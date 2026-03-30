'use strict';

/**
 * Rendering job orchestrator
 *
 * Handles the full pipeline for a render job:
 * 1. Launch Puppeteer with CesiumJS
 * 2. Render each requested shot (heading + pitch)
 * 3. Detect and warn on black frames
 * 4. Save background PNGs to the correct output paths
 * 5. Return a structured result matching the API contract
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CANVAS_WIDTH = 2048;
const CANVAS_HEIGHT = 1536;

// Camera parameters per shot name
const SHOT_PARAMS = {
    nadir:    { heading: 0,   pitch: -89.9 },
    cardinal: { heading: 0,   pitch: -24   },
    north:    { heading: 0,   pitch: -24   },
    east:     { heading: 90,  pitch: -24   },
    south:    { heading: 180, pitch: -24   },
    west:     { heading: 270, pitch: -24   },
};

/**
 * Detect whether a PNG buffer is mostly black (WebGL context loss indicator).
 *
 * @param {Buffer} buffer - PNG image buffer
 * @param {number} [threshold=0.95] - black-pixel ratio that triggers the warning
 * @returns {Promise<boolean>}
 */
async function detectBlackFrame(buffer, threshold = 0.95) {
    const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
    let blackPixels = 0;
    const totalPixels = info.width * info.height;
    for (let i = 0; i < data.length; i += info.channels) {
        if (data[i] < 10 && data[i + 1] < 10 && data[i + 2] < 10) {
            blackPixels++;
        }
    }
    return (blackPixels / totalPixels) >= threshold;
}

/**
 * Generate a self-contained CesiumJS HTML page for a specific shot.
 *
 * @param {Object} job - Normalised job object
 * @param {string} shotName - Shot name key (e.g. 'cardinal', 'nadir')
 * @returns {string} HTML string
 */
function generateCesiumHtml(job, shotName) {
    const { centroid, boundary, elevation } = job;
    const params = SHOT_PARAMS[shotName] || SHOT_PARAMS.cardinal;
    const googleApiKey = (process.env.GOOGLE_API_KEY || '').trim();
    const cesiumToken = (process.env.CESIUM_ION_TOKEN || '').trim();

    // Use nadir range multiplier for top-down shots, oblique for others
    const isNadir = Math.abs(params.pitch) > 60;
    const rangeScale = isNadir ? 2.0 : 2.5;

    // Serialise boundary coordinates as a JSON array for injection into HTML
    const boundaryJson = JSON.stringify(boundary || []);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cesium.com/downloads/cesiumjs/releases/1.114/Cesium.js"></script>
  <link href="https://cesium.com/downloads/cesiumjs/releases/1.114/Widgets/widgets.css" rel="stylesheet">
  <style>
    html, body { margin: 0; padding: 0; overflow: hidden; width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px; }
    #cesiumContainer { width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px; }
  </style>
</head>
<body>
  <div id="cesiumContainer"></div>
  <script>
    Cesium.Ion.defaultAccessToken = ${JSON.stringify(cesiumToken)};
    window.MISSION_STATUS = 'initializing';

    const viewer = new Cesium.Viewer('cesiumContainer', {
      scene3DOnly: true,
      useDefaultRenderLoop: true,
      timeline: false,
      animation: false,
      contextOptions: { webgl: { preserveDrawingBuffer: true } }
    });

    window.viewer = viewer;

    (async () => {
      try {
        // Add Google Photorealistic 3D Tiles when an API key is provided
        const googleApiKey = ${JSON.stringify(googleApiKey)};
        if (googleApiKey) {
          const tileset = await Cesium.Cesium3DTileset.fromUrl(
            'https://tile.googleapis.com/v1/3dtiles/root.json?key=' + googleApiKey,
            { maximumScreenSpaceError: 1.0 }
          );
          window.tileset = tileset;
          viewer.scene.primitives.add(tileset);
        }

        // Draw property boundary as a yellow polyline clamped to ground
        const boundary = ${boundaryJson};
        if (boundary.length > 1) {
          const positions = Cesium.Cartesian3.fromDegreesArray(boundary.flat());
          viewer.entities.add({
            polyline: {
              positions: positions,
              width: 3,
              material: Cesium.Color.YELLOW,
              clampToGround: true
            }
          });
        }

        // Build a BoundingSphere centred on the property centroid
        const lon = ${centroid.lon};
        const lat = ${centroid.lat};
        const elev = ${elevation !== undefined ? elevation : 100};
        let boundingSphere;
        if (boundary.length > 2) {
          const cartesians = Cesium.Cartesian3.fromDegreesArray(boundary.flat());
          boundingSphere = Cesium.BoundingSphere.fromPoints(cartesians);
          // Override BoundingSphere centre with explicit centroid for accurate framing
          boundingSphere.center = Cesium.Cartesian3.fromDegrees(lon, lat, elev);
        } else {
          boundingSphere = new Cesium.BoundingSphere(
            Cesium.Cartesian3.fromDegrees(lon, lat, elev),
            500
          );
        }

        // Position the camera for this shot
        const heading = Cesium.Math.toRadians(${params.heading});
        const pitch   = Cesium.Math.toRadians(${params.pitch});
        const range   = Math.max(boundingSphere.radius * ${rangeScale}, 500);

        await new Promise(resolve => {
          viewer.camera.flyToBoundingSphere(boundingSphere, {
            offset: new Cesium.HeadingPitchRange(heading, pitch, range),
            duration: 0,
            complete: resolve
          });
        });

        viewer.scene.globe.maximumScreenSpaceError = 1.0;

        // Wait until the globe and tileset tiles are fully loaded (stable for 3 ticks)
        await new Promise(resolve => {
          let stable = 0;
          const timer = setInterval(() => {
            const tsLoaded = window.tileset
              ? (window.tileset.tilesLoaded || window.tileset.allTilesLoaded)
              : true;
            const gLoaded = viewer.scene.globe.tilesLoaded;
            if (tsLoaded && gLoaded) {
              if (++stable >= 3) { clearInterval(timer); resolve(); }
            } else {
              stable = 0;
            }
          }, 300);
          // Safety timeout: 2 minutes
          setTimeout(() => { clearInterval(timer); resolve(); }, 120000);
        });

        window.MISSION_STATUS = 'ready';
      } catch (err) {
        console.error('[CesiumJS] Error:', err.message);
        window.MISSION_STATUS = 'error:' + err.message;
      }
    })();
  </script>
</body>
</html>`;
}

/**
 * Render a single shot using a Puppeteer page.
 *
 * @param {import('puppeteer-core').Browser} browser
 * @param {Object} job - Normalised job object
 * @param {string} shotName
 * @returns {Promise<Buffer>} PNG image buffer
 */
async function renderShot(browser, job, shotName) {
    const page = await browser.newPage();
    try {
        await page.setViewport({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

        const html = generateCesiumHtml(job, shotName);
        await page.setContent(html, { waitUntil: 'domcontentloaded' });

        // Wait for the Cesium Viewer to be attached to window
        await page.waitForFunction(() => window.viewer !== undefined, { timeout: 60000 });

        // Wait for MISSION_STATUS to reach 'ready' or an error state
        await page.waitForFunction(
            () => {
                const s = window.MISSION_STATUS;
                return s === 'ready' || (typeof s === 'string' && s.startsWith('error'));
            },
            { timeout: 180000 }
        );

        const status = await page.evaluate(() => window.MISSION_STATUS);
        if (typeof status === 'string' && status.startsWith('error')) {
            throw new Error('CesiumJS initialization failed: ' + status.slice(6));
        }

        return await page.screenshot({ type: 'png' });
    } finally {
        await page.close().catch(() => {});
    }
}

/**
 * Execute a full render job.
 *
 * Launches a single Puppeteer browser, renders each requested shot in
 * sequence (to avoid WebGL memory exhaustion), saves background PNGs,
 * and returns a structured result matching the API contract.
 *
 * @param {Object} job - Normalised job object (output of normalizeJob)
 * @returns {Promise<Object>} API response object
 */
async function executeRenderJob(job) {
    const {
        centroid,
        shots: requestedShots = ['cardinal'],
        customer_id,
        order_id,
        is_test,
        acreage,
    } = job;

    // Determine base output directory
    const outputBase = is_test
        ? path.join(process.cwd(), 'test-results')
        : path.join(process.cwd(), 'tmp', 'snapshots', order_id || 'unknown', customer_id || 'unknown');

    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        headless: 'new',
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--enable-unsafe-swiftshader',
            '--use-gl=angle',
            '--use-angle=swiftshader',
        ],
    });

    try {
        const result = {
            status: 'success',
            customer_id: customer_id || null,
            order_id: order_id || null,
            shots: {},
            roads: [],
            acreage: acreage || null,
        };

        for (const shotName of requestedShots) {
            const name = shotName.toLowerCase();
            if (!SHOT_PARAMS[name]) {
                console.warn('[Renderer] Unknown shot "' + name + '", skipping');
                continue;
            }

            console.log('[Renderer] Rendering shot: ' + name);

            // Ensure output directory exists
            const shotDir = path.join(outputBase, name + '_layers');
            fs.mkdirSync(shotDir, { recursive: true });

            const bgPath = path.join(shotDir, name + '_background.png');
            const psdPath = path.join(outputBase, name + '.psd');

            const pngBuffer = await renderShot(browser, job, name);

            // Black-frame detection
            const isBlack = await detectBlackFrame(pngBuffer);
            if (isBlack) {
                console.warn(
                    '[Renderer] Warning: shot "' + name + '" is >95% black ' +
                    '(possible WebGL context loss or missing API key)'
                );
            }

            // Persist background PNG
            fs.writeFileSync(bgPath, pngBuffer);
            console.log('[Renderer] Saved: ' + bgPath);

            result.shots[name] = {
                psd_path: psdPath,
                psd_url: null,
                photopea_url: null,
            };
        }

        return result;
    } finally {
        await browser.close().catch(() => {});
    }
}

module.exports = { executeRenderJob };
