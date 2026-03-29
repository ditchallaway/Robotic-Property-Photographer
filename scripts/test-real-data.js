/**
 * ⚠️ IMPORTANT FOR LOCAL TESTING ⚠️
 * Since this application runs in Docker and Node may not be installed on the host,
 * you MUST execute this script INSIDE the running container.
 * 
 * Command: docker compose exec moonshot node path/to/test-script.js
 */

// Native fetch is available in Node.js 18+
// If running on older Node, install node-fetch manually
// Real property data from n8n (actual payload structure)
const realPropertyData = {
    "ap parcel number": "RP58N01W327600A",
    "owner": "",
    "centroid": [-116.4869477327835, 48.33225928561425],
    "lat": "48.332259",
    "lon": "-116.486948",
    "ll_gisacre": 6.1944,
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
    "county": "Bonner County",
    "elevation": 655,
    "customer_id": "cust_12345",
    "order_id": "order_12345",
    "centroid_elevation": 655,
    // Street labels are now fetched from OSM server-side (no longer passed in payload)
};

async function testRender() {
    console.log('🚀 Testing photographer with real property data...');
    console.log(`📍 Location: ${realPropertyData.county}`);
    console.log(`📐 Acreage: ${realPropertyData.ll_gisacre} acres`);
    console.log(`🆔 Order: ${realPropertyData.order_id} / ${realPropertyData.customer_id}\n`);

    try {
        const response = await fetch('http://127.0.0.1:3000/api/render', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(realPropertyData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Render failed: ${error.message}`);
        }

        const result = await response.json();
        console.log('\n✅ Render complete!');
        console.log(`📁 Outputs saved to: tmp/snapshots/${realPropertyData.order_id}/${realPropertyData.customer_id}`);
        console.log('\n📋 Next steps:');
        console.log('1. Open .psd files to verify 4 named layers (Map, Boundary, Street Labels, Acreage)');
        console.log('2. Check .png preview matches satellite imagery');
        console.log('3. Verify acreage label shows "6.19 acres"\n');
    } catch (err) {
        console.error('❌ Test failed:', err.message);
        process.exit(1);
    }
}

testRender();
