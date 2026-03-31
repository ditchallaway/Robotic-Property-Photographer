/**
 * ⚠️ IMPORTANT FOR LOCAL TESTING ⚠️
 * Since this application runs in Docker and Node may not be installed on the host,
 * you MUST execute this script INSIDE the running container.
 * 
 * Command: docker compose exec moonshot node path/to/test-script.js
 */

import fs from 'fs/promises';
import path from 'path';

// Native fetch is available in Node.js 18+
// If running on older Node, install node-fetch manually
// Real property data from n8n (actual payload structure)
// This payload uses the flat lat/lon + acres format produced by the upstream workflow.
const realPropertyData = {
    "acres": "6.5",
    "owner": "KISTING, WARREN V & MARIA T",
    "elevation": 655,
    "lat": "48.332259",
    "lon": "-116.486948",
    "county": "Bonner County",
    "customer_id": "cust_12345",
    "order_id": "order_12345",
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-116.4868255, 48.3317135],
            [-116.485553, 48.3317135],
            [-116.4855585, 48.332807],
            [-116.488335, 48.3328055],
            [-116.488341, 48.332094],
            [-116.4883485, 48.3317135],
            [-116.4868255, 48.3317135]
        ]]
    },
    "srcmap": "https://maps.googleapis.com/maps/api/staticmap?size=1200x1200&scale=2&maptype=satellite&path=color:0xffff00ff|weight:4|48.3317135,-116.4868255|48.3317135,-116.4855530|48.3328070,-116.4855585|48.3328055,-116.4883350|48.3320940,-116.4883410|48.3317135,-116.4883485|48.3317135,-116.4868255&key=AIzaSyBH98WxAx5gUHvvKSwhoKpyfQQiBS5dUJ0",
    is_test: true,
    shots: ['nadir', 'cardinal'],
    // Street labels are now fetched from OSM server-side (no longer passed in payload)
};

async function testRender() {
    console.log('🚀 Testing photographer with real property data...');
    console.log(`📍 Location: ${realPropertyData.county}`);
    console.log(`📐 Acreage: ${realPropertyData.acres} acres`);
    console.log(`🆔 Order: ${realPropertyData.order_id} / ${realPropertyData.customer_id}\n`);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 minutes

        const response = await fetch('http://localhost:3000/api/render', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(realPropertyData),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Render failed: ${error.message}`);
        }

        const result = await response.json();

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Test Results</title>
    <style>body { font-family: sans-serif; } img { border: 1px solid #ccc; margin: 5px; max-width: 48%; }</style>
</head>
<body>
    <h1>Cardinal Layers (North)</h1>
    <div>
        <img src="cardinal_layers/cardinal_map.png" alt="Map">
        <img src="cardinal_layers/cardinal_acres.png" alt="Acres">
        <img src="cardinal_layers/cardinal_boundary.png" alt="Boundary">
        <img src="cardinal_layers/cardinal_labels.png" alt="Labels">
    </div>
    <h1>Nadir Layers</h1>
    <div>
        <img src="nadir_layers/nadir_map.png" alt="Map">
        <img src="nadir_layers/nadir_acres.png" alt="Acres">
        <img src="nadir_layers/nadir_boundary.png" alt="Boundary">
        <img src="nadir_layers/nadir_labels.png" alt="Labels">
    </div>
</body>
</html>`;
        await fs.writeFile(path.join(process.cwd(), 'test-results', 'index.html'), htmlContent);

        console.log('\n✅ Render complete!');
        console.log(`📁 Outputs saved to: test-results/`);
        console.log('\n📋 Next steps:');
        console.log('1. Open test-results/index.html to view all layers');
        console.log('2. Check test-results/composite.psd to verify 4 named layers (Map, Boundary, Street Labels, Acreage)');
        console.log('3. Verify acreage label shows "6.19 acres"\n');
    } catch (err) {
        console.error('❌ Test failed:', err.message);
        process.exit(1);
    }
}

testRender();
