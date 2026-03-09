import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fetchOsmRoads } from '../../lib/osmRoads.js';
import { computeAcreageLabel } from '../../lib/acreageLabel.js';
import { composeHumanPsd } from '../../lib/psdComposer.js';
import { buildStaticMapUrl } from '../../lib/staticMap.js';
import { uploadToR2, isR2Configured } from '../../lib/r2Upload.js';
import { buildPhotopeaUrl } from '../../lib/photopea.js';
import { sendNotification } from '../../lib/notify.js';

export const config = { api: { responseLimit: false } };

// Global sequential queue to prevent WebGL memory crashes
let renderQueue = Promise.resolve();

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
    } = req.body;

    let snapshotDir = path.join(process.cwd(), 'tmp', 'snapshots', order_id, customer_id);
    let isTest = false;
    if (order_id === 'test' || req.body.is_test) {
        snapshotDir = path.join(process.cwd(), 'test-results');
        isTest = true;
    }

    await fs.mkdir(snapshotDir, { recursive: true });
    const logFile = path.join(snapshotDir, `${new Date().toISOString().split('T')[0]}.log`);

    const logToFile = async (msg) => {
        const timestamp = new Date().toISOString();
        await fs.appendFile(logFile, `[${timestamp}] ${msg}\n`).catch(() => { });
        console.log(msg);
    };

    // ── Server-side data preparation ───────────────────────────────
    const lat = Array.isArray(centroid) ? centroid[1] : centroid.lat;
    const lon = Array.isArray(centroid) ? centroid[0] : centroid.lon;
    const boundaryCoords = geometry?.coordinates?.[0] || [];

    // Fetch road names (for text layers)
    let roads = [];
    try {
        roads = await fetchOsmRoads(lat, lon, boundaryCoords);
        await logToFile(`[RENDERER] Fetched ${roads.length} roads from OSM`);
    } catch (err) {
        await logToFile(`[RENDERER] OSM road fetch failed (non-fatal): ${err.message}`);
    }

    // Compute acreage text (for text layer)
    let acreageText = null;
    try {
        if (ll_gisacre && boundaryCoords.length >= 3) {
            const acreageData = computeAcreageLabel(ll_gisacre, boundaryCoords);
            acreageText = acreageData.text;
            await logToFile(`[RENDERER] Acreage label: "${acreageText}"`);
        }
    } catch (err) {
        await logToFile(`[RENDERER] Acreage label computation failed (non-fatal): ${err.message}`);
    }

    // Build Google Static Map URL for road label reference
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const staticMapUrl = buildStaticMapUrl(geometry, googleApiKey);

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

        // Per-shot screenshot buffers
        const shotBuffers = {};
        const outputPaths = [];

        // ── Single-pass capture function ─────────────────────────────
        await page.exposeFunction('capturePass', async (shotName) => {
            try {
                const buffer = await page.screenshot({
                    type: 'png',
                    omitBackground: false // Full opaque screenshot with map + boundary
                });

                // ── Black-frame detection ──
                const { default: sharpMod } = await import('sharp');
                const raw = await sharpMod(buffer).raw().toBuffer({ resolveWithObject: true });
                let nonBlack = 0;
                const totalPixels = raw.info.width * raw.info.height;
                for (let i = 0; i < raw.data.length; i += raw.info.channels) {
                    if (raw.data[i] > 30 || raw.data[i + 1] > 30 || raw.data[i + 2] > 30) nonBlack++;
                }
                const pct = ((nonBlack / totalPixels) * 100).toFixed(1);
                if (nonBlack / totalPixels < 0.05) {
                    await logToFile(`[RENDERER] ⚠️  BLACK FRAME detected for ${shotName}: only ${pct}% non-black pixels. Tiles likely failed to load.`);
                } else {
                    await logToFile(`[RENDERER] ✅ Frame OK for ${shotName}: ${pct}% non-black pixels`);
                }

                shotBuffers[shotName] = buffer;

                // Write the raw screenshot
                let screenshotPath;
                if (isTest) {
                    const layersDir = path.join(snapshotDir, `${shotName}_layers`);
                    await fs.mkdir(layersDir, { recursive: true }).catch(() => { });
                    screenshotPath = path.join(layersDir, `${shotName}_background.png`);
                } else {
                    const shotDir = path.join(snapshotDir, shotName);
                    await fs.mkdir(shotDir, { recursive: true }).catch(() => { });
                    screenshotPath = path.join(shotDir, `${shotName}_background.png`);
                }
                await fs.writeFile(screenshotPath, buffer);
                outputPaths.push(screenshotPath);

                await logToFile(`[RENDERER] Captured: ${shotName} (${(buffer.length / 1024).toFixed(1)} KB)`);
                return true;
            } catch (err) {
                await logToFile(`[RENDERER] Capture error: ${err.message}`);
                return false;
            }
        });

        // Launch page
        const targetUrl = `http://localhost:3000/render.html`;

        await page.evaluateOnNewDocument((data) => {
            window.__MISSION_DATA__ = data;
        }, {
            centroid,
            centroid_elevation,
            geometry,
            ll_gisacre,
            customer_id,
            order_id,
            shots,
            google_api_key: googleApiKey
        });

        page.on('console', async (msg) => {
            const text = msg.text();
            if (!text.startsWith('[BROWSER]')) return;
            await logToFile(text);
        });

        console.log(`[API] Navigating Puppeteer to: ${targetUrl}`);
        await page.goto(targetUrl, { waitUntil: 'load', timeout: 60000 });

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
                    reject(new Error('Browser-side mission failed. Check [BROWSER] logs for details.'));
                }
            });
        });

        // ── Compose PSDs with text layers ──────────────────────────────
        const CANVAS_WIDTH = 2048;
        const CANVAS_HEIGHT = 1536;
        const roadNames = roads.map(r => r.name);

        // Build text layers config
        const textLayersConfig = [];

        // Road name text layers — stacked in top-right area
        const roadStartX = CANVAS_WIDTH - 600;
        const roadStartY = 40;
        const roadLineHeight = 70;

        roadNames.forEach((name, i) => {
            textLayersConfig.push({
                name: `Road: ${name}`,
                text: name,
                fontSize: 48,
                color: { r: 255, g: 255, b: 255, a: 255 },
                x: roadStartX,
                y: roadStartY + (i * roadLineHeight)
            });
        });

        // Acreage text layer — centered bottom
        if (acreageText) {
            textLayersConfig.push({
                name: acreageText,
                text: acreageText,
                fontSize: 80,
                color: { r: 255, g: 255, b: 0, a: 255 },
                x: (CANVAS_WIDTH / 2) - 200,
                y: CANVAS_HEIGHT - 150
            });
        }

        const shotsResponse = {};

        for (const [shotName, buffer] of Object.entries(shotBuffers)) {
            try {
                const psdBuffer = await composeHumanPsd(buffer, textLayersConfig);

                let psdPath;
                if (isTest) {
                    psdPath = path.join(snapshotDir, `${shotName}.psd`);
                } else {
                    const shotDir = path.join(snapshotDir, shotName);
                    await fs.mkdir(shotDir, { recursive: true }).catch(() => { });
                    psdPath = path.join(shotDir, `${shotName}.psd`);
                }
                await fs.writeFile(psdPath, psdBuffer);
                outputPaths.push(psdPath);

                // Upload to R2 if configured
                let psdUrl = null;
                if (isR2Configured()) {
                    const r2Key = `${order_id}/${customer_id}/${shotName}.psd`;
                    psdUrl = await uploadToR2(psdBuffer, r2Key, 'application/octet-stream');
                }

                // Build Photopea deep-link
                const photopeaUrl = buildPhotopeaUrl(psdUrl, staticMapUrl);

                shotsResponse[shotName] = {
                    psd_path: psdPath,
                    psd_url: psdUrl,
                    photopea_url: photopeaUrl
                };

                await logToFile(`[RENDERER] Composed PSD: ${psdPath} (${(psdBuffer.length / 1024).toFixed(1)} KB)`);
            } catch (err) {
                await logToFile(`[RENDERER] PSD composition error for ${shotName}: ${err.message}`);
                shotsResponse[shotName] = { psd_path: null, psd_url: null, error: err.message };
            }
        }

        // Send push notification
        const shotNames = Object.keys(shotsResponse);
        await sendNotification(
            `📸 ${shotNames.length} shots ready`,
            `Order ${order_id} for ${customer_id}\n${shotNames.join(', ')}\nRoads: ${roadNames.join(', ')}\nAcreage: ${acreageText || 'N/A'}`,
            {
                tags: ['camera', 'white_check_mark'],
                priority: 'default',
                clickUrl: Object.values(shotsResponse).find(s => s.photopea_url)?.photopea_url || undefined
            }
        );

        res.status(200).json({
            status: "success",
            customer_id,
            order_id,
            shots: shotsResponse,
            static_map_url: staticMapUrl,
            roads: roadNames,
            acreage: acreageText
        });

    } catch (err) {
        await logToFile(`[RENDERER] Fatal error: ${err.message}`);
        res.status(500).json({ status: "error", message: err.message });
    } finally {
        if (browser) await browser.close();
    }
}