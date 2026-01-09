import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export const config = { api: { responseLimit: false } };

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { customer_id, order_id, centroid, centroid_elevation, geometry } = req.body;

    // Define the persistent volume path per Section 7
    // Use process.cwd() to be safe across Local (Windows) and Docker (/app)
    const snapshotDir = path.join(process.cwd(), 'public', 'snapshots', order_id, customer_id);
    await fs.mkdir(snapshotDir, { recursive: true });

    let browser = null;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--enable-webgl',
                '--ignore-gpu-blocklist',
                '--use-gl=angle',
                '--font-render-hinting=none'
            ]
        });

        const page = await browser.newPage();
        // Section 6.1: 2048 x 1536 (4:3 aspect ratio)
        await page.setViewport({ width: 2048, height: 1536 });

        // Ingest data into browser scope
        await page.evaluateOnNewDocument((data) => {
            window.__MISSION_DATA__ = data;
        }, { centroid, centroid_elevation, geometry });

        const imagePaths = [];

        // Listen for the Capture Signal
        page.on('console', async (msg) => {
            const args = msg.args();
            if (args.length >= 3) {
                try {
                    const token = await args[0].jsonValue();
                    if (token === 'SIDECAR_DATA') {
                        const viewName = await args[1].jsonValue();
                        const data = await args[2].jsonValue();
                        const filePath = path.join(snapshotDir, `${viewName}.json`);
                        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
                        imagePaths.push(filePath);
                        console.log(`[RENDERER] Saved Sidecar: ${filePath}`);
                        return; // Done handling this message
                    }
                } catch (err) {
                    console.error('[RENDERER] Sidecar Error:', err);
                }
            }

            const text = msg.text();
            if (text.startsWith('CAPTURE_FRAME:')) {
                const viewName = text.split(':')[1];
                const filePath = path.join(snapshotDir, `${viewName}.png`);

                const buffer = await page.screenshot({ type: 'png' });
                await fs.writeFile(filePath, buffer);
                imagePaths.push(filePath);
                console.log(`[RENDERER] Captured: ${filePath}`);
            } else {
                console.log(`[BROWSER] ${text}`);
            }
        });

        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host; // Includes port
        const targetUrl = `${protocol}://${host}/`;
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });

        // Wait for Mission Complete
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Render timeout')), 120000);
            page.on('console', (msg) => {
                if (msg.text() === 'MISSION_COMPLETE') {
                    clearTimeout(timeout);
                    resolve();
                }
            });
        });

        // Section 8: Return local file paths
        res.status(200).json({
            status: "success",
            customer_id,
            order_id,
            images: imagePaths
        });

    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    } finally {
        if (browser) await browser.close();
    }
}