/**
 * ⚠️ IMPORTANT FOR LOCAL TESTING ⚠️
 * Since this application runs in Docker and Node may not be installed on the host,
 * you MUST execute this script INSIDE the running container.
 *
 * Command: docker compose exec moonshot node tests/nadir.js
 *
 * NADIR TEST
 * ──────────────────────────────────────
 * Perspective: Top-Down (pitch -90°), True North aligned (0°)
 * Passes tested: ALL (base, boundary, labels, acreage)
 *
 * Expected output: 
 *   tmp/test/nadir/nadir.psd
 *   tmp/test/nadir/layers/nadir_base.png
 *   tmp/test/nadir/layers/nadir_boundary.png
 *   tmp/test/nadir/layers/nadir_labels.png
 *   tmp/test/nadir/layers/nadir_acreage.png
 */

const TEST_PAYLOAD = {
    "ap_parcel_number": "RP58N01W327600A",
    "centroid": [-116.4869477327835, 48.33225928561425],
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
    "elevation": 655,
    "centroid_elevation": 655,
    "customer_id": "test_nadir",
    "order_id": "test", // Triggers routing to /tmp/test
    "shots": ["nadir"],
    "capabilities": ["base", "boundary", "labels", "acreage"]
};

console.log("\n🚀 Nadir Composited Test");

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
        console.log("✅ Render complete!");
        console.log(result.images);

    } catch (error) {
        console.error("\n❌ TEST FAILED:");
        console.error(error);
        process.exit(1);
    }
}

run();
