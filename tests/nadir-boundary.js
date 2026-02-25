/**
 * ⚠️ IMPORTANT FOR LOCAL TESTING ⚠️
 * Since this application runs in Docker and Node may not be installed on the host,
 * you MUST execute this script INSIDE the running container.
 * 
 * Command: docker compose exec moonshot node tests/nadir-boundary.js
 */

const realPropertyDataWithHole = {
    "ap parcel number": "RP58N01W327600A",
    "owner": "",
    "centroid": [-116.4869477327835, 48.33225928561425],
    "lat": "48.332259",
    "lon": "-116.486948",
    "ll_gisacre": 6.1944,
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [ // Exterior Ring
                [-116.4868255, 48.3317135],
                [-116.485553, 48.3317135],
                [-116.4855585, 48.332807],
                [-116.488335, 48.3328055],
                [-116.488341, 48.332094],
                [-116.4883485, 48.3317135],
                [-116.4868255, 48.3317135]
            ],
            [ // Interior Ring (Hole)
                [-116.487000, 48.332000],
                [-116.487000, 48.332200],
                [-116.487500, 48.332200],
                [-116.487500, 48.332000],
                [-116.487000, 48.332000]
            ]
        ]
    },
    "county": "Bonner County",
    "elevation": 655,
    "customer_id": "cust_12345",
    "order_id": "test_nadir_boundary",
    "centroid_elevation": 655,

    // 🔥 NEW ISOLATED TEST CAPS 🔥
    "shots": ["nadir"],
    "capabilities": ["boundary"]  // Only render the boundary
};

async function testRender() {
    console.log('🚀 Testing ISOLATED CAPABILITY: Nadir Boundary (with holes)...');
    console.log(`🆔 Order: ${realPropertyDataWithHole.order_id} / ${realPropertyDataWithHole.customer_id}\n`);

    try {
        const response = await fetch('http://localhost:3000/api/render', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(realPropertyDataWithHole)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Render failed: ${error.message}`);
        }

        const result = await response.json();
        console.log('\n✅ Render complete!');
        console.log(`📁 Outputs saved to: tmp/snapshots/${realPropertyDataWithHole.order_id}/${realPropertyDataWithHole.customer_id}`);
        console.log('\n📋 Check the output. It should be a single PNG containing ONLY the yellow boundary line (no map) and it MUST contain the inner hole cutout.');
    } catch (err) {
        console.error('❌ Test failed:', err.message);
        process.exit(1);
    }
}

testRender();
