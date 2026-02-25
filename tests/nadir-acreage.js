// tests/nadir-acreage.js

const TEST_PAYLOAD = {
    // A sample bounding box and centroid (from previous tests)
    "centroid": [-116.4869477327835, 48.33225928561425],
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [-116.4868255, 48.3317135],
                [-116.485553, 48.3317135],
                [-116.4855585, 48.332807],
                [-116.488335, 48.3328055],
                [-116.488341, 48.332094],
                [-116.4883485, 48.3317135],
                [-116.4868255, 48.3317135]
            ]
        ]
    },
    // Adding the acreage anchor for the label
    "ll_gisacre": 6.1944,
    "acreageAnchor": {
        "lon": -116.486948,
        "lat": 48.332259,
        "text": "6.19 acres"
    },
    "elevation": 655,
    "centroid_elevation": 655,
    "customer_id": "cust_12345",
    "order_id": "test_nadir_acreage",
    "shots": ["nadir"],
    "capabilities": ["acreage"]  // Only render transparent acreage label
};

console.log("\n🚀 Testing ISOLATED CAPABILITY: Nadir Acreage Label...");
console.log(`🆔 Order: ${TEST_PAYLOAD.order_id} / ${TEST_PAYLOAD.customer_id}`);

async function run() {
    try {
        const response = await fetch('http://localhost:3000/api/render', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_PAYLOAD)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API failed with ${response.status}: ${errorText}`);
        }

        const result = await response.json();

        console.log("\n✅ Render complete!");
        console.log(`📁 Outputs saved to: tmp/snapshots/${TEST_PAYLOAD.order_id}/${TEST_PAYLOAD.customer_id}`);
        console.log("\n📋 Check the output. It should be a single transparent PNG containing ONLY the '6.19 acres' text label centered over the parcel, without any map imagery or boundary.");

    } catch (error) {
        console.error("\n❌ TEST FAILED:");
        console.error(error);
        process.exit(1);
    }
}

run();
