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

            // Serve the static render HTML and Cesium assets over HTTP to avoid file:// CORS restrictions
            const app = express();
            app.get('/render.html', (req, res) => {
                res.sendFile(path.join(process.cwd(), 'public/index.html'));
            });
            app.get('/app.js', (req, res) => {
                res.sendFile(path.join(process.cwd(), 'public/app.js'));
            });
            app.get('/api/job', (req, res) => {
                res.json({
                    job,
                    googleApiKey: (process.env.GOOGLE_API_KEY || '').trim()
                });
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


module.exports = {
    renderPropertyPhoto,
    launchBrowser,
    detectBlackFrame
};
