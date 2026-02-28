/**
 * OSM Overpass Road Fetcher
 * 
 * Fetches road geometry from OpenStreetMap via Overpass API.
 * Strictly queries way[highway] only — no relations, no route merging.
 * Label text: name → ref → alt_name. Missing name = excluded.
 */

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

/**
 * Map OSM highway tag values to spec classification.
 * highway → motorway, trunk
 * major   → primary, secondary
 * local   → everything else
 */
function classifyHighway(highwayTag) {
    const hw = (highwayTag || '').toLowerCase();
    if (['motorway', 'trunk', 'motorway_link', 'trunk_link'].includes(hw)) return 'highway';
    if (['primary', 'secondary', 'primary_link', 'secondary_link'].includes(hw)) return 'major';
    return 'local';
}

/**
 * Extract display name from OSM tags.
 * Priority: name → ref → alt_name
 * Returns null if no name available (road excluded per guardrails).
 */
function extractName(tags) {
    return tags.name || tags.ref || tags.alt_name || null;
}

/**
 * Simple point-in-polygon test (ray casting).
 */
function pointInPolygon(lon, lat, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];
        const intersect = ((yi > lat) !== (yj > lat)) &&
            (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
 * Buffer a bounding box by a fixed amount in degrees.
 * ~500m ≈ 0.0045° latitude.
 */
function bufferBbox(minLon, minLat, maxLon, maxLat, bufferDeg = 0.005) {
    return [
        minLat - bufferDeg,
        minLon - bufferDeg,
        maxLat + bufferDeg,
        maxLon + bufferDeg
    ];
}

/**
 * Main entry: Fetch roads from OSM Overpass.
 * 
 * @param {number} lat - Property centroid latitude
 * @param {number} lon - Property centroid longitude
 * @param {Array<[number,number]>} boundaryCoords - GeoJSON polygon ring [[lon,lat], ...]
 * @returns {Promise<Array>} Array of road objects
 */
export async function fetchOsmRoads(lat, lon, boundaryCoords = []) {
    // 1. Compute bounding box from boundary (or centroid fallback)
    let minLon, minLat, maxLon, maxLat;

    if (boundaryCoords.length > 0) {
        minLon = Math.min(...boundaryCoords.map(c => c[0]));
        maxLon = Math.max(...boundaryCoords.map(c => c[0]));
        minLat = Math.min(...boundaryCoords.map(c => c[1]));
        maxLat = Math.max(...boundaryCoords.map(c => c[1]));
    } else {
        // Fallback: ~500m box around centroid
        minLon = lon - 0.005;
        maxLon = lon + 0.005;
        minLat = lat - 0.005;
        maxLat = lat + 0.005;
    }

    // Buffer bbox by ~500m for context roads (highways nearby, etc.)
    const bbox = bufferBbox(minLon, minLat, maxLon, maxLat);
    const bboxStr = bbox.join(',');

    // 2. Query Overpass — way[highway] only, with geometry
    const query = `
[out:json][timeout:25];
way["highway"](${bboxStr});
out body geom;
`;

    console.log(`[osmRoads] Querying Overpass for bbox: ${bboxStr}`);

    // Retry with backoff for transient Overpass failures (429, 504)
    const MAX_RETRIES = 3;
    let res;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        if (attempt > 0) {
            const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
            console.log(`[osmRoads] Retry ${attempt}/${MAX_RETRIES} after ${delay}ms...`);
            await new Promise(r => setTimeout(r, delay));
        }

        res = await fetch(OVERPASS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data=${encodeURIComponent(query)}`
        });

        if (res.ok) break;
        if (res.status === 429 || res.status === 504) {
            console.warn(`[osmRoads] Overpass returned ${res.status}, retrying...`);
            continue;
        }
        // Non-retryable error
        throw new Error(`Overpass API returned ${res.status}: ${await res.text()}`);
    }

    if (!res.ok) {
        throw new Error(`Overpass API failed after ${MAX_RETRIES} retries (last status: ${res.status})`);
    }

    const data = await res.json();
    const ways = data.elements || [];

    console.log(`[osmRoads] Overpass returned ${ways.length} ways`);

    // 3. Process ways into road objects
    const roads = [];

    for (const way of ways) {
        if (way.type !== 'way' || !way.tags || !way.geometry) continue;

        // Label guardrail: skip roads with no name
        const name = extractName(way.tags);
        if (!name) continue;

        const highwayTag = way.tags.highway;
        const roadClass = classifyHighway(highwayTag);

        // Convert geometry to [lon, lat] array
        const geometry = way.geometry.map(pt => [pt.lon, pt.lat]);

        // Calculate a good anchor point for the label (closest point to property centroid)
        let anchorLon = geometry[0][0];
        let anchorLat = geometry[0][1];
        let minBoundDist = Infinity;

        // Find closest geometry point to property centroid
        for (const [gLon, gLat] of geometry) {
            const dLon = gLon - lon;
            const dLat = gLat - lat;
            const distSq = (dLon * dLon) + (dLat * dLat);
            if (distSq < minBoundDist) {
                minBoundDist = distSq;
                anchorLon = gLon;
                anchorLat = gLat;
            }
        }

        // Calculate road angle for "sticker" alignment (Nadir)
        // We use the segment containing the anchor point
        let anchorIdx = 0;
        let minDist = Infinity;
        for (let i = 0; i < geometry.length; i++) {
            const [gLon, gLat] = geometry[i];
            const dLonE = gLon - lon;
            const dLatE = gLat - lat;
            const d2 = (dLonE * dLonE) + (dLatE * dLatE);
            if (d2 < minDist) {
                minDist = d2;
                anchorIdx = i;
            }
        }

        const p1 = geometry[Math.max(0, anchorIdx - 1)];
        const p2 = geometry[Math.min(geometry.length - 1, anchorIdx + 1)];
        // Radians: Math.atan2(dy, dx)
        const dx = (p2[0] - p1[0]) * Math.cos(p1[1] * Math.PI / 180);
        const dy = p2[1] - p1[1];
        let angle = Math.atan2(dy, dx);

        // Normalize for readability (-PI/2 to PI/2)
        if (angle > Math.PI / 2) angle -= Math.PI;
        else if (angle < -Math.PI / 2) angle += Math.PI;

        roads.push({
            osm_id: way.id,
            name,
            road_class: roadClass,
            highway_tag: highwayTag,
            geometry,
            anchorLon,
            anchorLat,
            angle
        });
    }

    // 4. Deduplicate by name (same road can have multiple way segments)
    // Keep the version whose anchor is closest to the property
    const byName = new Map();
    for (const road of roads) {
        const existing = byName.get(road.name);
        if (!existing) {
            byName.set(road.name, road);
        } else {
            // Compare distance to centroid
            const dLonE = existing.anchorLon - lon;
            const dLatE = existing.anchorLat - lat;
            const distE = (dLonE * dLonE) + (dLatE * dLatE);

            const dLonR = road.anchorLon - lon;
            const dLatR = road.anchorLat - lat;
            const distR = (dLonR * dLonR) + (dLatR * dLatR);

            if (distR < distE) {
                // This new segment is closer to the property, use its anchor and angle
                byName.set(road.name, road);
            } else {
                // Current one is closer, but maybe promote the class?
                const classRank = { highway: 3, major: 2, local: 1 };
                if ((classRank[road.road_class] || 0) > (classRank[existing.road_class] || 0)) {
                    existing.road_class = road.road_class;
                    existing.highway_tag = road.highway_tag;
                }
            }
        }
    }

    const deduplicated = Array.from(byName.values());
    console.log(`[osmRoads] Found ${deduplicated.length} unique roads (from ${roads.length} segments)`);
    return deduplicated;
}
