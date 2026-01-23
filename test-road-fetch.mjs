// Isolated test for road data fetching (ESM)
import { fetchRoadData } from './lib/roadData.js';

const lat = 48.2647;
const lon = -116.6662;
const boundary = [
    [-116.6680, 48.2660],
    [-116.6640, 48.2660],
    [-116.6640, 48.2630],
    [-116.6680, 48.2630],
    [-116.6680, 48.2660]
];

async function test() {
    try {
        console.log("Fetching road data...");
        const data = await fetchRoadData(lat, lon, boundary);
        console.log(`Found ${data.roads.length} road segments.`);

        const adjacent = data.roads.filter(r => r.is_adjacent);
        console.log(`Adjacent roads: ${adjacent.length}`);
        adjacent.forEach(r => console.log(` - ${r.name} (${r.class})`));

        console.log(`Anchor Highway: ${data.anchor_name || 'None'}`);

        const classes = data.roads.reduce((acc, r) => {
            acc[r.class] = (acc[r.class] || 0) + 1;
            return acc;
        }, {});
        console.log("Road Classes:", classes);
        console.log(`Data Source: ${data.data_source}`);

    } catch (err) {
        console.error("Test Failed:", err);
    }
}

test();
