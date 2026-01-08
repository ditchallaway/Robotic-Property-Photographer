import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export const config = { api: { responseLimit: false } };

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { customer_id, order_id, centroid, centroid_elevation, geometry } = req.body;

    // Define the persistent volume path per Section 7
    const snapshotDir = `/app/public/snapshots/${order_id}/${customer_id}`;
    await fs.mkdir(snapshotDir, { recursive: true });

    let browser = null;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none']
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
            const text = msg.text();
            if (text.startsWith('CAPTURE_FRAME:')) {
                const viewName = text.split(':')[1];
                const filePath = path.join(snapshotDir, `${viewName}.png`);

                const buffer = await page.screenshot({ type: 'png' });
                await fs.writeFile(filePath, buffer);
                imagePaths.push(filePath);
                console.log(`[RENDERER] Captured: ${filePath}`);
            }
        });

        const targetUrl = `http://127.0.0.1:3000/`;
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