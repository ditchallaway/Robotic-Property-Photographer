/**
 * Standalone test for OSM Overpass road fetcher.
 * Usage: node scripts/test-osm-roads.mjs
 */
import { fetchOsmRoads } from '../lib/osmRoads.js';

// Bonner County, ID — same location as test-real-data.js
const lat = 48.332259;
const lon = -116.486948;
const boundary = [
    [-116.4868255, 48.3317135],
    [-116.485553, 48.3317135],
    [-116.4855585, 48.332807],
    [-116.488335, 48.3328055],
    [-116.488341, 48.332094],
    [-116.4883485, 48.3317135],
    [-116.4868255, 48.3317135]
];

console.log(`\n🛣️  Testing OSM Road Fetch`);
console.log(`📍 Location: ${lat}, ${lon} (Bonner County, ID)\n`);

try {
    const roads = await fetchOsmRoads(lat, lon, boundary);

    console.log(`\n✅ Found ${roads.length} named roads:\n`);

    for (const road of roads) {
        const pts = road.geometry.length;
        const adj = road.is_adjacent ? '🏠 ADJACENT' : '';
        console.log(`  ${road.road_class.padEnd(8)} │ ${road.name.padEnd(30)} │ ${pts} pts │ ${adj}`);
    }

    // Classification breakdown
    const classes = {};
    for (const r of roads) {
        classes[r.road_class] = (classes[r.road_class] || 0) + 1;
    }
    console.log(`\n📊 Classification: ${JSON.stringify(classes)}`);

    // Adjacent roads
    const adjacent = roads.filter(r => r.is_adjacent);
    console.log(`🏠 Adjacent roads: ${adjacent.length}`);

    // Sample output
    if (roads.length > 0) {
        console.log(`\n📄 Sample road object:`);
        const sample = { ...roads[0], geometry: `[${roads[0].geometry.length} points]` };
        console.log(JSON.stringify(sample, null, 2));
    }
} catch (err) {
    console.error(`❌ Failed: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
}
