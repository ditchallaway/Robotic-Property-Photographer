const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Black-frame detection using pixel density analysis
 * Returns true if >95% of pixels are black (silent render crash indicator)
 */
async function detectBlackFrame(pngBuffer, threshold = 0.95) {
    const sharp = require('sharp');
    try {
        const metadata = await sharp(pngBuffer).metadata();
        const { width, height } = metadata;
        const raw = await sharp(pngBuffer)
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
        return false; // Conservative: assume not black if analysis fails
    }
}

/**
 * Precision tile-loading settle
 * Ensures Cesium globe + tileset are fully loaded before capture
 */
async function waitForTiles(viewer, tileset, timeoutMs = 240000) {
    return new Promise((resolve, reject) => {
        let stable = 0;
        const timer = setInterval(() => {
            try {
                const tsLoaded = tileset 
                    ? (tileset.tilesLoaded || tileset.allTilesLoaded) 
                    : true;
                const gLoaded = viewer.scene.globe.tilesLoaded;
                
                if (tsLoaded && gLoaded) {
                    if (++stable >= 3) { // Must be stable for 3 ticks (~900ms)
                        clearInterval(timer);
                        console.log('[Tile Load] Tiles stable after', stable * 300, 'ms');
                        resolve();
                    }
                } else {
                    stable = 0;
                }
            } catch (err) {
                stable = 0; // Reset on error
            }
        }, 300);

        setTimeout(() => {
            clearInterval(timer);
            reject(new Error('Tile loading timeout exceeded'));
        }, timeoutMs);
    });
}

/**
 * Launch Puppeteer with WebGL-optimized flags
 */
async function launchBrowser() {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--ignore-gpu-blocklist',
        '--use-gl=angle',
        '--use-angle=swiftshader'
    ];

    const browser = await puppeteer.launch({
        headless: 'new',
        args,
        defaultViewport: null,
        timeout: 60000
    });

    return browser;
}

/**
 * Render a property photo
 * @param {Object} job - Job spec with centroid, elevation, boundary, acreage, shotList
 * @returns {Object} { pngBuffer, metadata }
 */
async function renderPropertyPhoto(job) {
    const { centroid, elevation, boundary, acreage, shotList } = job;
    
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
        await page.setViewport({ width: 1920, height: 1080 });

        // Inject Cesium initialization script
        await page.goto('about:blank');
        await page.evaluate(() => {
            window.Cesium = window.Cesium || {};
        });

        // Load the HTML with CesiumJS & initialization
        const htmlContent = generateCesiumHTML(job);
        await page.setContent(htmlContent, { waitUntil: 'networkidle2' });

        // Wait for viewer to initialize
        await page.waitForFunction(() => window.viewer !== undefined, { timeout: 60000 });
        console.log('[Renderer] Viewer initialized');

        // Get viewer & tileset references
        const tilesetRef = await page.evaluate(() => {
            return window.tileset ? { id: window.tileset.id || 'google-3d' } : null;
        });

        // Wait for tiles to load
        await page.evaluate(waitForTiles.toString()); // Inject function
        await page.evaluate(() => {
            return new Promise((resolve, reject) => {
                let stable = 0;
                const timer = setInterval(() => {
                    try {
                        const tsLoaded = window.tileset 
                            ? (window.tileset.tilesLoaded || window.tileset.allTilesLoaded) 
                            : true;
                        const gLoaded = window.viewer.scene.globe.tilesLoaded;
                        
                        if (tsLoaded && gLoaded) {
                            if (++stable >= 3) {
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
                    reject(new Error('Tile loading timeout'));
                }, 240000);
            });
        });

        console.log('[Renderer] Tiles loaded, capturing screenshot');

        // Capture screenshot
        const pngBuffer = await page.screenshot({ type: 'png' });

        // Check for black-frame failure
        const isBlackFrame = await detectBlackFrame(
            pngBuffer,
            parseFloat(process.env.BLACK_FRAME_THRESHOLD || '0.95')
        );

        if (isBlackFrame) {
            throw new Error('Black-frame detected: WebGL context loss or silent render crash');
        }

        await browser.close();

        return {
            pngBuffer,
            metadata: {
                width: 1920,
                height: 1080,
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
    const { centroid, elevation, boundary, acreage } = job;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="https://cesium.com/downloads/cesiumjs/releases/1.110/Cesium.js"></script>
    <link href="https://cesium.com/downloads/cesiumjs/releases/1.110/Widgets/widgets.css" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #cesiumContainer { width: 100%; height: 100%; }
        #info { display: none; }
    </style>
</head>
<body>
    <div id="cesiumContainer"></div>
    <script>
        Cesium.Ion.defaultAccessToken = '${process.env.CESIUM_ION_TOKEN || ''}';

        const container = document.getElementById('cesiumContainer');
        const viewer = new Cesium.Viewer(container, {
            terrainProvider: Cesium.CesiumTerrainProvider.fromIonAsyncResource(),
            contextOptions: { webgl: { preserveDrawingBuffer: true } }
        });

        window.viewer = viewer;

        (async () => {
            try {
                // Add Google 3D Tiles
                const tileset = await Cesium.Cesium3DTileset.fromUrl(
                    'https://tile.googleapis.com/v1/3dtiles/root.json?key=${googleApiKey}',
                    { maximumScreenSpaceError: 16 }
                );
                window.tileset = tileset;
                viewer.scene.primitives.add(tileset);
                console.log('[CesiumJS] 3D Tileset added');

                // Frame the property
                const lon = ${centroid.lon};
                const lat = ${centroid.lat};
                const height = ${elevation || 100};

                viewer.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(lon, lat, height * 2),
                    orientation: {
                        heading: Cesium.Math.toRadians(0),
                        pitch: Cesium.Math.toRadians(-45),
                        roll: 0.0
                    }
                });

                // Draw boundary polygon
                const boundaryCoords = ${JSON.stringify(boundary)};
                const positions = Cesium.Cartesian3.fromDegreesArray(
                    boundaryCoords.flat()
                );
                
                viewer.entities.add({
                    polyline: {
                        positions: positions,
                        width: 3,
                        material: Cesium.Color.RED,
                        clampToGround: true
                    }
                });

                console.log('[CesiumJS] Scene initialized');
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
    waitForTiles,
    detectBlackFrame
};
