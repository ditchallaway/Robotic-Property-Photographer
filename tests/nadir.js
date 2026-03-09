/**
 * ⚠️ IMPORTANT FOR LOCAL TESTING ⚠️
 * Since this application runs in Docker and Node may not be installed on the host,
 * you MUST execute this script INSIDE the running container.
 *
 * Command: docker compose exec moonshot node tests/nadir.js
 *
 * NADIR TEST (Human-in-the-Loop v2)
 * ──────────────────────────────────────
 * Perspective: Top-Down (pitch -90°), True North aligned (0°)
 * Single pass: map + boundary baked into one screenshot
 * PSD: background raster + text layers (roads + acreage)
 *
 * Expected output: 
 *   test-results/nadir.psd
 *   test-results/nadir_layers/nadir_background.png
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
    "order_id": "test",
    "shots": ["nadir"]
};

console.log("\n🚀 Nadir Test (Human-in-the-Loop v2)");

async function run() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 600000); // 10 minutes

        const response = await fetch('http://localhost:3000/api/render', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_PAYLOAD),
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API failed with ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log("✅ Render complete!");
        console.log(JSON.stringify(result, null, 2));

        // Validate response schema
        if (!result.shots?.nadir) throw new Error("Missing 'shots.nadir' in response");
        if (!result.shots.nadir.psd_path) throw new Error("Missing 'psd_path' in nadir shot");
        if (!result.static_map_url) throw new Error("Missing 'static_map_url' in response");
        if (!Array.isArray(result.roads)) throw new Error("Missing 'roads' array in response");
        if (typeof result.acreage !== 'string') throw new Error("Missing 'acreage' string in response");

        console.log("\n✅ Schema validation passed");
        console.log(`📍 Static Map URL: ${result.static_map_url}`);
        console.log(`🏷️  Roads: ${result.roads.join(', ') || '(none found)'}`);
        console.log(`📐 Acreage: ${result.acreage}`);
        console.log(`📄 PSD: ${result.shots.nadir.psd_path}`);
        if (result.shots.nadir.psd_url) {
            console.log(`☁️  R2 URL: ${result.shots.nadir.psd_url}`);
        } else {
            console.log(`☁️  R2: not configured (local only)`);
        }

    } catch (error) {
        console.error("\n❌ TEST FAILED:");
        console.error(error);
        process.exit(1);
    }
}

run();
