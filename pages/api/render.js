import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fetchOsmRoads } from '../../lib/osmRoads.js';
import { computeAcreageLabel } from '../../lib/acreageLabel.js';
import { composePsd } from '../../lib/psdComposer.js';
import * as Compositing from '../../lib/cesiumSceneCompositing.js';

export const config = { api: { responseLimit: false } };

// Global sequential queue to prevent WebGL memory crashes (Audit #6)
let renderQueue = Promise.resolve();

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Enqueue and WAIT for the render job
    // This allows multiple requests to queue up but ensures they execute one at a time
    await (renderQueue = renderQueue.then(async () => {
        try {
            await doRender(req, res);
        } catch (err) {
            console.error('[QUEUE] Render job failed:', err.message);
            if (!res.writableEnded) {
                res.status(500).json({ status: "error", message: err.message });
            }
        }
    }).catch(err => {
        console.error('[QUEUE] Fatal queue error:', err);
    }));
}

async function doRender(req, res) {
    const {
        customer_id,
        order_id,
        centroid,
        centroid_elevation,
        geometry,
        ll_gisacre,
        shots,
        capabilities
    } = req.body;

    let snapshotDir = path.join(process.cwd(), 'public', 'snapshots', order_id, customer_id);
    if (order_id === 'test' || req.body.is_test) {
        snapshotDir = path.join(process.cwd(), 'tmp', 'test', order_id, customer_id);
    }

    // Create base dir to ensure log file writes
    await fs.mkdir(snapshotDir, { recursive: true });
    const logFile = path.join(snapshotDir, `${new Date().toISOString().split('T')[0]}.log`);

    const logToFile = async (msg) => {
        const timestamp = new Date().toISOString();
        await fs.appendFile(logFile, `[${timestamp}] ${msg}\n`).catch(() => { });
        console.log(msg);
    };

    // ── Server-side data preparation ───────────────────────────────
    let roads = [];
    try {
        const lat = Array.isArray(centroid) ? centroid[1] : centroid.lat;
        const lon = Array.isArray(centroid) ? centroid[0] : centroid.lon;
        const boundaryCoords = geometry?.coordinates?.[0] || [];
        roads = await fetchOsmRoads(lat, lon, boundaryCoords);
        await logToFile(`[RENDERER] Fetched ${roads.length} roads from OSM`);
    } catch (err) {
        await logToFile(`[RENDERER] OSM road fetch failed (non-fatal): ${err.message}`);
    }

    let acreageAnchor = null;
    try {
        const boundaryCoords = geometry?.coordinates?.[0] || [];
        if (ll_gisacre && boundaryCoords.length >= 3) {
            acreageAnchor = computeAcreageLabel(ll_gisacre, boundaryCoords);
            await logToFile(`[RENDERER] Acreage label: "${acreageAnchor.text}" at [${acreageAnchor.lon.toFixed(6)}, ${acreageAnchor.lat.toFixed(6)}]`);
        }
    } catch (err) {
        await logToFile(`[RENDERER] Acreage label computation failed (non-fatal): ${err.message}`);
    }

    // ── Puppeteer session ──────────────────────────────────────────
    let browser = null;
    try {
        // The next-server readiness check is now handled via retry logic during page.goto


        browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--use-gl=angle',
                '--use-angle=swiftshader',
                '--enable-unsafe-swiftshader'
            ]
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        await page.setViewport({ width: 2048, height: 1536 });

        // Per-shot pass buffers
        const shotPasses = {};
        const outputPaths = [];

        // ── Expose capture function to browser ─────────────────────
        await page.exposeFunction('capturePass', async (shotName, passName) => {
            try {
                // Wait for the renderComplete flag set by the browser script
                await page.waitForFunction('window.renderComplete === true', { timeout: 60000 }).catch(e => {
                    console.warn(`[RENDERER] Timeout waiting for window.renderComplete on ${shotName}/${passName}`);
                });

                const buffer = await page.screenshot({
                    type: 'png',
                    omitBackground: passName !== 'map'
                });
                
                if (!shotPasses[shotName]) shotPasses[shotName] = {};
                shotPasses[shotName][passName] = buffer;

                // Deferred Write/Validation: Save buffer to disk (fast raw write)
                const shotDir = path.join(snapshotDir, shotName);
                const layersDir = path.join(shotDir, 'layers');
                await fs.mkdir(layersDir, { recursive: true }).catch(() => { });
                const passPngPath = path.join(layersDir, `${shotName}_${passName}.png`);
                await fs.writeFile(passPngPath, buffer);
                outputPaths.push(passPngPath);

                await logToFile(`[RENDERER] BUFFERED: ${shotName}/${passName} (${(buffer.length / 1024).toFixed(1)} KB)`);
                return true; // Always return true during the browser session to defer validation
            } catch (err) {
                await logToFile(`[RENDERER] capturePass error: ${err.message}`);
                return false;
            }
        });

        // ── Expose signal for shot completion ─────────────────────
        await page.exposeFunction('composeShot', async (shotName) => {
            await logToFile(`[RENDERER] SHOT_SIGNALED: ${shotName}`);
            return true;
        });

        // Launch page with standalone renderer via HTTP
        const targetUrl = `http://localhost:3000/render.html`;

        await page.evaluateOnNewDocument((data) => {
            window.__MISSION_DATA__ = data;
        }, {
            centroid,
            centroid_elevation,
            geometry,
            ll_gisacre,
            roads,
            acreageAnchor,
            customer_id,
            order_id,
            shots,
            capabilities,
            google_api_key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
        });

        page.on('console', msg => console.log('BROWSER:', msg.text()));

        let connected = false;
        for (let i = 0; i < 5; i++) {
            try {
                await page.goto(targetUrl, { waitUntil: 'load', timeout: 30000 });
                connected = true;
                break;
            } catch (e) {
                await logToFile(`[RENDERER] Connection attempt ${i + 1} failed: ${e.message}`);
                await new Promise(r => setTimeout(r, 2000));
            }
        }
        if (!connected) throw new Error("Failed to reach local render server after 5 attempts.");

        // Wait for MISSION_COMPLETE or MISSION_ERROR
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Render timeout')), 600000);
            page.on('console', (msg) => {
                const text = msg.text();
                if (text === 'MISSION_COMPLETE') {
                    clearTimeout(timeout);
                    resolve();
                } else if (text === 'MISSION_ERROR') {
                    clearTimeout(timeout);
                    reject(new Error('Browser-side mission failed.'));
                }
            });
        });

        // ── Post-Mission Lifecycle ──────────────────────────────────
        // Audit #4: Ensure the sharp processing doesn't start until after browser.close() is called
        await logToFile(`[RENDERER] Mission finished. Closing browser before post-processing...`);
        if (browser) await browser.close();
        browser = null;

        // Run integrity checks and PSD composition now that browser memory is freed
        for (const shotName in shotPasses) {
            const passes = shotPasses[shotName];
            
            // 1. Validate Map Pass Integrity
            if (passes.map) {
                try {
                    const integrity = await Compositing.validateFrameIntegrity(passes.map, sharp);
                    if (integrity.isBlack) {
                        await logToFile(`[RENDERER] ⚠️  POST-VALIDATION: BLACK FRAME detected for ${shotName}/map (${integrity.nonBlackPct.toFixed(1)}%).`);
                    } else {
                        await logToFile(`[RENDERER] ✅ POST-VALIDATION: ${shotName}/map OK (${integrity.nonBlackPct.toFixed(1)}%)`);
                    }
                } catch (err) {
                    await logToFile(`[RENDERER] Integrity check failed for ${shotName}: ${err.message}`);
                }
            }

            // 2. Compose PSD
            try {
                const layers = [];
                if (passes.map) layers.push({ name: 'Map', buffer: passes.map });
                if (passes.boundary) layers.push({ name: 'Map with Boundary', buffer: passes.boundary });
                if (passes.labels) layers.push({ name: 'Street Labels', buffer: passes.labels });
                if (passes.acreage) layers.push({ name: 'Acreage', buffer: passes.acreage });

                const psdBuffer = await composePsd(layers);
                const shotDir = path.join(snapshotDir, shotName);
                const psdPath = path.join(shotDir, `${shotName}.psd`);
                await fs.writeFile(psdPath, psdBuffer);
                outputPaths.push(psdPath);
                await logToFile(`[RENDERER] Composed PSD: ${shotName}.psd (${(psdBuffer.length / 1024).toFixed(1)} KB)`);
            } catch (err) {
                await logToFile(`[RENDERER] PSD composition error for ${shotName}: ${err.message}`);
            }
        }

        res.status(200).json({
            status: "success",
            customer_id,
            order_id,
            images: outputPaths
        });

    } catch (err) {
        await logToFile(`[RENDERER] Fatal error: ${err.message}`);
        res.status(500).json({ status: "error", message: err.message });
    } finally {
        if (browser) await browser.close();
    }
}