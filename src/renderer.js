const puppeteer = require('puppeteer-core');
const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');
const config = require('./config');

/**
 * Black-frame detection using pixel density analysis
 * Returns true if >95% of pixels are black (silent render crash indicator)
 */
async function detectBlackFrame(pngBuffer, threshold = config.BLACK_FRAME_THRESHOLD) {
    const sharp = require('sharp');
    try {
        const metadata = await sharp(pngBuffer).metadata();
        const { width, height } = metadata;
        const raw = await sharp(pngBuffer)
            .ensureAlpha()
            .raw()
            .toBuffer();

        let blackPixels = 0;
        const pixelLength = 4; // RGBA
        const totalPixels = width * height;

        for (let i = 0; i < raw.length; i += pixelLength) {
            const r = raw[i];
            const g = raw[i + 1];
            const b = raw[i + 2];
            // Consider pixel black if all channels < 10 (near-black due to compression)
            if (r < 10 && g < 10 && b < 10) {
                blackPixels++;
            }
        }

        const blackRatio = blackPixels / totalPixels;
        console.log(`[Black Frame Check] Black ratio: ${(blackRatio * 100).toFixed(2)}% (threshold: ${(threshold * 100).toFixed(2)}%)`);
        
        return blackRatio >= threshold;
    } catch (err) {
        console.error('[Black Frame Check] Error analyzing frame:', err.message);
        return true; // Crash-safety: assume black/failed render if analysis fails
    }
}

/**
 * Launch Puppeteer with WebGL-optimized flags
 */
async function launchBrowser() {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--enable-unsafe-swiftshader',
        '--disable-gpu-sandbox',
        '--allow-file-access-from-files'
    ];

    console.log(`[Browser] Launching Puppeteer with args: ${args.join(' ')}`);
    const browser = await puppeteer.launch({
        executablePath: config.PUPPETEER_EXECUTABLE_PATH,
        headless: 'new',
        args,
        defaultViewport: null,
        timeout: 60000
    });
    console.log(`[Browser] Launched successfully (PID: ${browser.process()?.pid || 'unknown'})`);

    return browser;
}

/**
 * Render a property photo
 */
async function renderPropertyPhoto(job) {
    const { centroid, elevation, boundary, acreage } = job;
    
    if (!centroid || !centroid.lon || !centroid.lat) {
        throw new Error('Invalid centroid: requires { lon, lat }');
    }
    if (!boundary || !Array.isArray(boundary)) {
        throw new Error('Invalid boundary: must be GeoJSON coordinate array');
    }

    let browser;
    let server;
    try {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Render job timed out after ' + (config.RENDER_TIMEOUT_MS / 1000) + 's'));
            }, config.RENDER_TIMEOUT_MS);
        });

        const renderTask = (async function() {
            browser = await launchBrowser();
            const page = await browser.newPage();
            console.log(`[Renderer] New page created`);
            await page.setViewport({ width: 2048, height: 1536 });

            console.log(`[Renderer] Generating HTML`);
            const htmlContent = generateCesiumHTML(job);

            // Serve the render HTML and Cesium assets over HTTP to avoid file:// CORS restrictions
            const app = express();
            app.get('/render.html', (req, res) => {
                res.setHeader('Content-Type', 'text/html');
                res.send(htmlContent);
            });
            app.use('/cesium', express.static(path.join(process.cwd(), 'public/cesium')));
            server = http.createServer(app);
            await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
            const port = server.address().port;
            console.log(`[Renderer] Serving render HTML on http://127.0.0.1:${port}/render.html`);

            page.on('console', msg => console.log('[Puppeteer Console]', msg.type(), msg.text()));
            page.on('pageerror', err => console.error('[Puppeteer Error]', err.message));
            page.on('requestfailed', request => console.warn('[Puppeteer Request Failed]', request.url(), request.failure()?.errorText));
            page.on('response', response => {
                if (response.status() >= 400) {
                    console.error('[Puppeteer HTTP Error]', response.status(), response.url());
                }
            });

            console.log(`[Renderer] Navigating to http://127.0.0.1:${port}/render.html`);
            await page.goto(`http://127.0.0.1:${port}/render.html`, { waitUntil: 'domcontentloaded' });
            console.log(`[Renderer] Navigation complete, waiting for viewer...`);
            await page.waitForFunction(function() { return window.viewer !== undefined; }, { timeout: 60000 });
            console.log('[Renderer] Viewer initialized');

            const shots = [
                { id: 'north', heading: 0, pitch: -24 },
                { id: 'east', heading: 90, pitch: -24 },
                { id: 'south', heading: 180, pitch: -24 },
                { id: 'west', heading: 270, pitch: -24 },
                { id: 'overhead', heading: 0, pitch: -89.9 }
            ];

            const results = [];
            for (const shot of shots) {
                console.log('[Renderer] Rendering shot: ' + shot.id + ' (heading: ' + shot.heading + ' degrees)');
                
                await page.evaluate(function(s) {
                    const h = window.Cesium.Math.toRadians(s.heading);
                    const p = window.Cesium.Math.toRadians(s.pitch);
                    window.viewer.camera.setView({
                        orientation: { heading: h, pitch: p, roll: 0.0 }
                    });
                }, shot);

                // Wait for tiles to stabilize: 3 consecutive stable ticks (~900ms)
                // We poll from Node side to avoid Puppeteer protocol timeouts on long-running evaluates
                let stable = 0;
                let checks = 0;
                const maxChecks = 2000; // 600 seconds total

                while (checks < maxChecks) {
                    const status = await page.evaluate(function() {
                        var tsLoaded = window.tileset ? !!window.tileset.tilesLoaded : false;
                        var globeLoaded = (window.viewer.scene.globe && window.viewer.scene.globe.tilesLoaded !== undefined)
                            ? window.viewer.scene.globe.tilesLoaded 
                            : true;
                        
                        return { tsLoaded: tsLoaded, globeLoaded: globeLoaded };
                    });

                    checks++;

                    if (status.tsLoaded && status.globeLoaded) {
                        stable++;
                        if (stable >= 3) {
                            console.log(`[Renderer] Tiles stable (${stable}/3). Ready for capture.`);
                            break;
                        }
                    } else {
                        if (stable > 0) {
                            console.log('[Renderer] Tiles became unstable. Resetting.');
                        }
                        stable = 0;
                    }

                    if (checks % 10 === 0) {
                        console.log(`[Renderer] Waiting for tiles... (TS:${status.tsLoaded}, Globe:${status.globeLoaded}, check:${checks})`);
                    }

                    await new Promise(r => setTimeout(r, 300));
                }

                if (checks >= maxChecks) {
                    throw new Error('Tile loading timeout exceeded (600s)');
                }

                const buffer = await page.screenshot({ type: 'png' });
                const isBlack = await detectBlackFrame(buffer);
                if (isBlack) throw new Error('Black-frame detected on shot ' + shot.id);

                results.push({ id: shot.id, pngBuffer: buffer, heading: shot.heading, pitch: shot.pitch });
            }

            // Optional: Fetch reference map from srcmap URL if provided
            if (job.srcmap) {
                console.log(`[Renderer] Fetching reference srcmap from: ${job.srcmap}`);
                try {
                    const response = await fetch(job.srcmap);
                    if (response.ok) {
                        const arrayBuffer = await response.arrayBuffer();
                        results.push({
                            id: 'reference_overhead',
                            pngBuffer: Buffer.from(arrayBuffer),
                            isReference: true
                        });
                        console.log(`[Renderer] Reference srcmap downloaded successfully`);
                    } else {
                        console.warn(`[Renderer] Failed to fetch srcmap: ${response.status} ${response.statusText}`);
                    }
                } catch (e) {
                    console.error(`[Renderer] Error fetching srcmap: ${e.message}`);
                }
            }

            await browser.close();
            server.close();
            return {
                shots: results,
                metadata: { 
                    width: 2048, 
                    height: 1536, 
                    centroid, 
                    elevation, 
                    acreage, 
                    timestamp: new Date().toISOString(),
                    has_reference: results.some(r => r.id === 'reference_overhead')
                }
            };
        })();

        return await Promise.race([renderTask, timeoutPromise]);

    } catch (err) {
        if (browser) await browser.close().catch(() => {});
        if (server) server.close();
        throw err;
    }
}

function generateCesiumHTML(job) {
    const { centroid, elevation, boundary, boundaryRings, acreage } = job;
    const googleApiKey = (process.env.GOOGLE_API_KEY || '').trim();
    const ringsJson = JSON.stringify(boundaryRings || [boundary]);

    if (googleApiKey) {
        const sanitizedKey = `${googleApiKey.substring(0, 4)}...${googleApiKey.substring(googleApiKey.length - 4)}`;
        console.log(`[Renderer] Map Tile Auth: API Key found (Prefix: ${googleApiKey.substring(0, 4)}, Length: ${googleApiKey.length})`);
    } else {
        console.error(`[Renderer] Map Tile Auth: CRITICAL - GOOGLE_API_KEY environment variable is NOT SET.`);
    }

    return [
        '<!DOCTYPE html>',
        '<html>',
        '<head>',
        '    <meta charset="utf-8">',
        '    <script src="/cesium/Cesium.js"></script>',
        '    <link href="/cesium/Widgets/widgets.css" rel="stylesheet">',
        '    <style>',
        '        html, body { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; }',
        '        #cesiumContainer { width: 100%; height: 100%; }',
        '        /* Hide all Cesium UI widgets for clean screenshots */',
        '        .cesium-viewer-toolbar,',
        '        .cesium-viewer-animationContainer,',
        '        .cesium-viewer-timelineContainer,',
        '        .cesium-viewer-bottom,',
        '        .cesium-viewer-fullscreenContainer,',
        '        .cesium-viewer-infoPanel { display: none !important; }',
        '    </style>',
        '</head>',
        '<body>',
        '    <div id="cesiumContainer"></div>',
        '    <script>',
        '        console.log("[Cesium] Script starting...");',
        '        const container = document.getElementById("cesiumContainer");',
        '        const viewer = new Cesium.Viewer(container, {',
        '            contextOptions: { webgl: { preserveDrawingBuffer: true } },',
        '            animation: false,',
        '            timeline: false,',
        '            navigationHelpButton: false,',
        '            homeButton: false,',
        '            sceneModePicker: false,',
        '            baseLayerPicker: false,',
        '            geocoder: false,',
        '            fullscreenButton: false,',
        '            infoBox: false,',
        '            selectionIndicator: false,',
        '            creditContainer: document.createElement("div"),',
        '            baseLayer: false,',
        '            globe: false',
        '        });',
        '        window.viewer = viewer;',
        '        (async function() {',
        '            console.log("[Cesium] Initializing Google Photorealistic 3D Tileset...");',
        '            const apiKey = "' + (googleApiKey || '') + '";',
        '            if (!apiKey) {',
        '                console.error("[Cesium] CRITICAL: Google API Key is missing!");',
        '            }',
        '            try {',
        '                console.log("[Cesium] Calling createGooglePhotorealistic3DTileset...");',
        '                const tileset = await Cesium.createGooglePhotorealistic3DTileset({',
        '                    key: apiKey',
        '                });',
        '                console.log("[Cesium] Tileset created successfully.");',
        '                window.tileset = tileset;',
        '                viewer.scene.primitives.add(tileset);',
        '                tileset.maximumScreenSpaceError = 16.0;',
        '',
        '                // Camera setup: position above the property centroid',
        '                var centroidLon = ' + centroid.lon + ';',
        '                var centroidLat = ' + centroid.lat + ';',
        '                var elev = ' + (elevation || 100) + ';',
        '',
        '                // Calculate camera altitude from boundary extent',
        '                var rings = ' + ringsJson + ';',
        '                var lons = rings[0].map(function(c) { return c[0]; });',
        '                var lats = rings[0].map(function(c) { return c[1]; });',
        '                var lonSpan = Math.max.apply(null, lons) - Math.min.apply(null, lons);',
        '                var latSpan = Math.max.apply(null, lats) - Math.min.apply(null, lats);',
        '                var spanDeg = Math.max(lonSpan, latSpan);',
        '                // Convert to meters (~111km per degree), then use as camera height offset',
        '                var spanMeters = spanDeg * 111000;',
        '                var cameraAlt = elev + Math.max(spanMeters * 0.8, 150);',
        '',
        '                console.log("[Cesium] Camera altitude: " + cameraAlt + "m (elevation: " + elev + ", span: " + spanMeters.toFixed(0) + "m)");',
        '',
        '                viewer.camera.setView({',
        '                    destination: Cesium.Cartesian3.fromDegrees(centroidLon, centroidLat, cameraAlt),',
        '                    orientation: {',
        '                        heading: Cesium.Math.toRadians(0),',
        '                        pitch: Cesium.Math.toRadians(' + (job.varying_pitch || -24) + '),',
        '                        roll: 0.0',
        '                    }',
        '                });',
        '',
        '                viewer.camera.frustum.fov = Cesium.Math.toRadians(100);',
        '',
        '                // Draw boundary lines at property elevation',
        '                rings.forEach(function(ring) {',
        '                    var coords = [];',
        '                    ring.forEach(function(c) { coords.push(c[0], c[1], elev + 2); });',
        '                    var pos = Cesium.Cartesian3.fromDegreesArrayHeights(coords);',
        '                    viewer.entities.add({ polyline: { positions: pos, width: 3, material: Cesium.Color.YELLOW } });',
        '                });',
        '                console.log("[Cesium] Scene setup complete.");',
        '            } catch (e) { ',
        '                console.error("[CesiumJS Error] Failed to initialize tileset:", e); ',
        '                if (e.message && e.message.includes("401")) {',
        '                    console.error("[CesiumJS Error] Authentication failed (401). Check your Google API Key.");',
        '                }',
        '            }',
        '        })();',
        '    </script>',
        '</body>',
        '</html>'
    ].join('\n');
}

module.exports = {
    renderPropertyPhoto,
    launchBrowser,
    detectBlackFrame
};
