import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fetchOsmRoads } from '../../lib/osmRoads.js';
import { computeAcreageLabel } from '../../lib/acreageLabel.js';
import { composePsd } from '../../lib/psdComposer.js';

export const config = { api: { responseLimit: false } };

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const {
        customer_id,
        order_id,
        centroid,
        centroid_elevation,
        geometry,
        ll_gisacre
    } = req.body;

    const snapshotDir = path.join(process.cwd(), 'public', 'snapshots', order_id, customer_id);
    const logFile = path.join(snapshotDir, `${new Date().toISOString().split('T')[0]}.log`);
    await fs.mkdir(snapshotDir, { recursive: true });

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
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--ignore-gpu-blocklist'
            ]
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 2048, height: 1536 });

        // Per-shot pass buffers
        const shotPasses = {};
        const outputPaths = [];

        // ── Expose capture function to browser ─────────────────────
        // This is the KEY fix: PhotoAgent awaits this function,
        // so the scene state is frozen while the screenshot is taken.
        await page.exposeFunction('capturePass', async (shotName, passName) => {
            try {
                const buffer = await page.screenshot({
                    type: 'png',
                    omitBackground: passName !== 'map' // Only overlay passes need transparency
                });
                if (!shotPasses[shotName]) shotPasses[shotName] = {};
                shotPasses[shotName][passName] = buffer;
                await logToFile(`[RENDERER] Captured pass: ${shotName}/${passName} (${(buffer.length / 1024).toFixed(1)} KB)`);
                return true;
            } catch (err) {
                await logToFile(`[RENDERER] Pass capture error: ${err.message}`);
                return false;
            }
        });

        // ── Expose compose function to browser ─────────────────────
        await page.exposeFunction('composeShot', async (shotName) => {
            try {
                const passes = shotPasses[shotName];
                if (!passes || !passes.map) {
                    await logToFile(`[RENDERER] WARNING: Missing map pass for ${shotName}`);
                    return false;
                }

                const layers = [
                    { name: 'Map', buffer: passes.map }
                ];

                if (passes.boundary) {
                    layers.push({ name: 'Boundary', buffer: passes.boundary });
                }
                if (passes.labels) {
                    layers.push({ name: 'Street Labels', buffer: passes.labels });
                }
                if (passes.acreage) {
                    layers.push({ name: 'Acreage', buffer: passes.acreage });
                }

                const psdBuffer = await composePsd(layers);
                const psdPath = path.join(snapshotDir, `${shotName}.psd`);
                await fs.writeFile(psdPath, psdBuffer);

                // Generate a flat composite PNG for preview
                let pngBuffer = passes.map;
                if (layers.length > 1) {
                    const compositeInputs = layers.slice(1).map(layer => ({ input: layer.buffer }));
                    pngBuffer = await sharp(passes.map)
                        .ensureAlpha()
                        .composite(compositeInputs)
                        .png()
                        .toBuffer();
                }
                const pngPath = path.join(snapshotDir, `${shotName}.png`);
                await fs.writeFile(pngPath, pngBuffer);

                outputPaths.push(psdPath, pngPath);
                await logToFile(`[RENDERER] Composed PSD: ${psdPath} (${(psdBuffer.length / 1024).toFixed(1)} KB)`);
                return true;
            } catch (err) {
                await logToFile(`[RENDERER] PSD composition error: ${err.message}`);
                return false;
            }
        });

        // Inject mission data
        await page.evaluateOnNewDocument((data) => {
            window.__MISSION_DATA__ = data;
        }, {
            centroid,
            centroid_elevation,
            geometry,
            acres: ll_gisacre,
            roads,
            acreageAnchor,
            customer_id,
            order_id
        });

        // Forward browser console to server logs
        page.on('console', async (msg) => {
            const text = msg.text();
            if (!text.startsWith('[BROWSER]')) return;
            await logToFile(`[BROWSER] ${text}`);
        });

        // Inside the container, the Next.js server is always on localhost:3000
        const targetUrl = `http://localhost:3000/`;
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for MISSION_COMPLETE
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Render timeout')), 600000);
            page.on('console', (msg) => {
                if (msg.text() === 'MISSION_COMPLETE') {
                    clearTimeout(timeout);
                    resolve();
                }
            });
        });

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