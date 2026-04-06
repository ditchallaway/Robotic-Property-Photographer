const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
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
 * Precision tile-loading settle helper (injected into page context)
 */
const TILE_WAIT_POLL = `
    new Promise((resolve, reject) => {
        let stable = 0;
        const timer = setInterval(() => {
            try {
                const tsLoaded = window.tileset 
                    ? (window.tileset.tilesLoaded || window.tileset.allTilesLoaded) 
                    : true;
                const gLoaded = window.viewer.scene.globe.tilesLoaded;
                
                if (tsLoaded && gLoaded) {
                    if (++stable >= 3) { // 3 consecutive stable ticks (~900ms)
                        clearInterval(timer);
                        resolve();
                    }
                } else {
                    stable = 0;
                }
            } catch (err) {
                stable = 0;
            }
        }, 300);

        setTimeout(() => {
            clearInterval(timer);
            reject(new Error('Tile loading timeout exceeded (120s)'));
        }, 120000);
    })
`;

/**
 * Launch Puppeteer with WebGL-optimized flags
 */
async function launchBrowser() {
    const args = [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--allow-file-access-from-files'
    ];

    const browser = await puppeteer.launch({
        executablePath: config.PUPPETEER_EXECUTABLE_PATH,
        headless: 'new',
        args,
        defaultViewport: null,
        timeout: 60000
    });

    return browser;
}

/**
 * Render a property photo
 * This function forms the core of the rendering engine. 
 * It is designed to be executed within the isolated environment provided by the worker queue
 * to ensure that heavy WebGL operations do not overlap and crash the server.
 * @param {Object} job - Job spec with centroid, elevation, boundary, acreage, shotList
 * @returns {Object} { pngBuffer, metadata }
 */
async function renderPropertyPhoto(job) {
    const { centroid, elevation, boundary, boundaryRings, acreage, shotList } = job;
    
    if (!centroid || !centroid.lon || !centroid.lat) {
        throw new Error('Invalid centroid: requires { lon, lat }');
    }
    if (!boundary || !Array.isArray(boundary)) {
        throw new Error('Invalid boundary: must be GeoJSON coordinate array');
    }

    let browser;
    try {
        browser = await launchBrowser();
        const page = await browser.newPage();

        // Set viewport for consistent output
        await page.setViewport({ width: 2048, height: 1536 });

        // Save the HTML to a temporary file to bypass Chromium origin restrictions for file:// resources
        const os = require('os');
        const fsPromises = require('fs').promises;
        const tempHtmlPath = path.join(os.tmpdir(), `render_${Date.now()}.html`);
        const htmlContent = generateCesiumHTML(job);
        await fsPromises.writeFile(tempHtmlPath, htmlContent);

        page.on('console', msg => console.log('[Puppeteer Console]', msg.type(), msg.text()));
        page.on('pageerror', err => console.log('[Puppeteer Error]', err.message));
        page.on('requestfailed', request => {
            const fail = request.failure();
            console.log('[Puppeteer Request Failed]', request.url(), fail ? fail.errorText : 'Unknown Error');
        });

        // Load the HTML file via file protocol
        await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle2' });

        // Wait for viewer to initialize
        await page.waitForFunction(() => window.viewer !== undefined, { timeout: 60000 });
        console.log('[Renderer] Viewer initialized');

        // Define the 5 required shots
        const shots = [
            { id: 'north', heading: 0, pitch: -24 },
            { id: 'east', heading: 90, pitch: -24 },
            { id: 'south', heading: 180, pitch: -24 },
            { id: 'west', heading: 270, pitch: -24 },
            { id: 'overhead', heading: 0, pitch: -89.9 }
        ];

        const results = [];

        // Sequential rendering (1 at a time) to prevent WebGL memory crashes
        for (const shot of shots) {
            console.log(`[Renderer] Rendering shot: ${shot.id} (heading: ${shot.heading}°)`);
            
            await page.evaluate((s) => {
                const heading = window.Cesium.Math.toRadians(s.heading);
                const pitch = window.Cesium.Math.toRadians(s.pitch);
                
                window.viewer.camera.setView({
                    orientation: {
                        heading: heading,
                        pitch: pitch,
                        roll: 0.0
                    }
                });
            }, shot);

            // Wait for tiles to settle for this specific view
            await page.evaluate(TILE_WAIT_POLL);

            const pngBuffer = await page.screenshot({ type: 'png' });

            // Check for black-frame failure
            const isBlackFrame = await detectBlackFrame(pngBuffer);

            if (isBlackFrame) {
                throw new Error(`Black-frame detected on shot ${shot.id}`);
            }

            results.push({
                id: shot.id,
                pngBuffer,
                heading: shot.heading,
                pitch: shot.pitch
            });
        }

        await browser.close();

        return {
            shots: results,
            metadata: {
                width: 2048,
                height: 1536,
                centroid,
                elevation,
                acreage,
                timestamp: new Date().toISOString()
            }
        };

    } catch (err) {
        if (browser) await browser.close();
        throw err;
    }
}

/**
 * Generate HTML with CesiumJS initialization
 */
function generateCesiumHTML(job) {
    const { centroid, elevation, boundary, boundaryRings, acreage } = job;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="file://${process.cwd()}/public/cesium/Cesium.js"></script>
    <link href="file://${process.cwd()}/public/cesium/Widgets/widgets.css" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #cesiumContainer { width: 100%; height: 100%; }
        #info { display: none; }
    </style>
</head>
<body>
    <div id="cesiumContainer"></div>
    <script>
        const container = document.getElementById('cesiumContainer');
        const viewer = new Cesium.Viewer(container, {
            contextOptions: { webgl: { preserveDrawingBuffer: true } }
        });

        window.viewer = viewer;

        (async () => {
            try {
                try {
                    viewer.terrainProvider = await Cesium.createWorldTerrainAsync();
                } catch (e) {
                    console.log('Using default terrain due to error:', e.message);
                }

                // Add Google 3D Tiles
                const tileset = await Cesium.Cesium3DTileset.fromUrl(
                    'https://tile.googleapis.com/v1/3dtiles/root.json?key=${googleApiKey}',
                    { maximumScreenSpaceError: 1.0 }
                );
                window.tileset = tileset;
                viewer.scene.primitives.add(tileset);

                // Set globe detail
                viewer.scene.globe.maximumScreenSpaceError = 1.0;

                // Set FOV to 100 degrees
                viewer.camera.frustum.fov = Cesium.Math.toRadians(100);

                console.log('[CesiumJS] 3D Tileset added and quality settings applied');

                // Frame the property
                const lon = ${centroid.lon};
                const lat = ${centroid.lat};
                const height = ${elevation || 100};

                viewer.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(lon, lat, height * 2),
                    orientation: {
                        heading: Cesium.Math.toRadians(0),
                        pitch: Cesium.Math.toRadians(-24),
                        roll: 0.0
                    }
                });

                // Draw boundary polylines (supporting holes)
                const rings = ${JSON.stringify(boundaryRings || [boundary])};
                rings.forEach(ring => {
                    if (ring.length > 0) {
                        const first = ring[0];
                        const last = ring[ring.length - 1];
                        if (first[0] !== last[0] || first[1] !== last[1]) {
                            ring.push([...first]);
                        }
                    }
                    const positions = Cesium.Cartesian3.fromDegreesArray(ring.flat());
                    viewer.entities.add({
                        polyline: {
                            positions: positions,
                            width: 3,
                            material: Cesium.Color.YELLOW,
                            clampToGround: true
                        }
                    });
                });

                console.log('[CesiumJS] Scene initialized with ' + rings.length + ' ring(s)');
            } catch (err) {
                console.error('[CesiumJS] Initialization error:', err);
            }
        })();
    </script>
</body>
</html>
    `;
}

module.exports = {
    renderPropertyPhoto,
    launchBrowser,
    detectBlackFrame
};
