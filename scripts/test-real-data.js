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
    // Street labels (when n8n provides them)
    // Sample street labels for testing filtering logic
    "labels": [
        {
            "id": 101,
            "street_name": "Visible St",
            "label_text": "Visible St",
            "latitude": 48.333259, // ~100m North (Visible in North view)
            "longitude": -116.486948,
            "distance_meters": 100.0
        },
        {
            "id": 102,
            "street_name": "Too Far Ave",
            "label_text": "Too Far Ave",
            "latitude": 48.342259, // ~1km North (Filtered by distance)
            "longitude": -116.486948,
            "distance_meters": 1100.0
        },
        {
            "id": 103,
            "street_name": "Behind Ln",
            "label_text": "Behind Ln",
            "latitude": 48.331259, // ~100m South (Behind camera in North view)
            "longitude": -116.486948,
            "distance_meters": 100.0
        }
    ]
};

async function testRender() {
    console.log('🚀 Testing photographer with real property data...');
    console.log(`📍 Location: ${realPropertyData.county}`);
    console.log(`📐 Acreage: ${realPropertyData.ll_gisacre} acres`);
    console.log(`🆔 Order: ${realPropertyData.order_id} / ${realPropertyData.customer_id}\n`);

    try {
        const response = await fetch('http://localhost:3001/api/render', {
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
        console.log(`📁 Outputs saved to: public/snapshots/${realPropertyData.order_id}/${realPropertyData.customer_id}`);
        console.log('\n📋 Next steps:');
        console.log('1. Check sidecar JSON for "acres": 6.1944 (not "N/A")');
        console.log('2. Verify boundary_3d coordinates match GeoJSON input');
        console.log('3. Copy outputs to compositor test_data/raw/ for validation\n');
    } catch (err) {
        console.error('❌ Test failed:', err.message);
        process.exit(1);
    }
}

testRender();
