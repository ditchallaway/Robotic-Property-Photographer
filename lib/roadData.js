/**
 * Road Data Provider - OpenStreetMap (Overpass API)
 */

const fetchApi = typeof fetch !== 'undefined' ? fetch : null;

/**
 * Distance between two LLA points (approximate)
 */
function distLla(p1, p2) {
    const dx = p1.lon - p2.lon;
    const dy = p1.lat - p2.lat;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Point in Polygon (Property Adjacent test)
 */
function isPointInPoly(pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0], yi = poly[i][1];
        const xj = poly[j][0], yj = poly[j][1];
        const intersect = ((yi > pt.lat) !== (yj > pt.lat)) &&
            (pt.lon < (xj - xi) * (pt.lat - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

/**
 * Road near Polygon (Simple buffer test)
 * Adjacency is strictly defined as road geometry intersecting the boundary polygon.
 */
function isRoadNearPoly(road, poly, bufferDeg = 0.0005) { // ~50m buffer for intersection
    return road.geometry.some(pt => {
        if (isPointInPoly(pt, poly)) return true;
        // Also check if any point is within small buffer of any vertex
        return poly.some(v => distLla(pt, { lon: v[0], lat: v[1] }) < bufferDeg);
    });
}

/**
 * Maps OSM highway tags to spec classes
 */
function mapOsmClass(tags) {
    const h = tags.highway || '';
    if (h === 'motorway' || h === 'trunk') return 'highway';
    if (h === 'primary' || h === 'secondary') return 'major';
    return 'local';
}

/**
 * Deterministic Naming
 * Order: name -> ref -> alt_name
 */
function getRoadName(tags) {
    return tags.name || tags.ref || tags.alt_name || null;
}

/**
 * Fetches Road Data from Overpass API
 */
async function fetchOsmData(boundary_lla) {
    if (boundary_lla.length === 0) return [];

    let latMin = Infinity, latMax = -Infinity, lonMin = Infinity, lonMax = -Infinity;
    boundary_lla.forEach(p => {
        latMin = Math.min(latMin, p[1]);
        latMax = Math.max(latMax, p[1]);
        lonMin = Math.min(lonMin, p[0]);
        lonMax = Math.max(lonMax, p[0]);
    });

    // Explicit Symmetric Expansion (0.01 degrees)
    latMin -= 0.01;
    latMax += 0.01;
    lonMin -= 0.01;
    lonMax += 0.01;

    // Trace Order: latMin lonMin -> latMin lonMax -> latMax lonMax -> latMax lonMin -> latMin lonMin
    const polyString = `${latMin} ${lonMin} ${latMin} ${lonMax} ${latMax} ${lonMax} ${latMax} ${lonMin} ${latMin} ${lonMin}`;
    const query = `[out:json];way[highway](poly:"${polyString}");out geom;`;

    console.log(`[roadData] Querying Overpass with deterministic poly filter...`);

    try {
        const response = await fetchApi('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (!response.ok) {
            console.error(`[roadData] Overpass API error: ${response.status}`);
            return [];
        }

        const data = await response.json();
        return data.elements || [];
    } catch (err) {
        console.error(`[roadData] OSM Fetch failed: ${err.message}`);
        return [];
    }
}

export async function fetchRoadData(lat, lon, boundary_lla = []) {
    console.log(`[roadData] Fetching for ${lat}, ${lon} with ${boundary_lla.length} boundary points`);
    if (!fetchApi) throw new Error('Global fetch not available');

    // 1. Fetch from OSM
    const elements = await fetchOsmData(boundary_lla);
    console.log(`[roadData] OSM Fetch successful: ${elements.length} ways found`);

    if (elements.length === 0) {
        return {
            roads: [],
            anchor_name: null,
            data_source: "© OpenStreetMap contributors"
        };
    }

    // 2. Map to internal format
    const roads = elements.map(el => {
        const name = getRoadName(el.tags);
        const roadClass = mapOsmClass(el.tags);
        const geometry = el.geometry.map(pt => ({ lat: pt.lat, lon: pt.lon }));

        return {
            id: el.id,
            name,
            class: roadClass,
            geometry,
            is_adjacent: false
        };
    }).filter(r => r.name !== null);

    // 3. Adjacency & Backbone Resolution
    const adjacentRoads = roads.filter(r => isRoadNearPoly(r, boundary_lla));
    adjacentRoads.forEach(r => r.is_adjacent = true);
    console.log(`[roadData] Adjacent roads: ${adjacentRoads.length}`);

    // Build Connectivity Graph
    const graph = new Map();
    const snap = (v) => `${v.lon.toFixed(5)},${v.lat.toFixed(5)}`;

    roads.forEach(r => {
        const start = snap(r.geometry[0]);
        const end = snap(r.geometry[r.geometry.length - 1]);
        if (!graph.has(start)) graph.set(start, []);
        if (!graph.has(end)) graph.set(end, []);
        graph.get(start).push(r);
        graph.get(end).push(r);
    });

    let anchorHighway = null;
    if (adjacentRoads.length > 0) {
        const queue = adjacentRoads.map(r => ({ road: r, dist: 0 }));
        const seen = new Set(adjacentRoads.map(r => r.id));

        while (queue.length > 0) {
            const { road, dist } = queue.shift();
            if (road.class === 'highway') {
                anchorHighway = road;
                break;
            }
            if (dist < 5) {
                const endpoints = [snap(road.geometry[0]), snap(road.geometry[road.geometry.length - 1])];
                endpoints.forEach(e => {
                    const connections = graph.get(e) || [];
                    connections.forEach(next => {
                        if (!seen.has(next.id)) {
                            seen.add(next.id);
                            queue.push({ road: next, dist: dist + 1 });
                        }
                    });
                });
            }
        }
    }

    console.log(`[roadData] Finalizing result...`);
    return {
        roads: roads.map(r => ({
            name: r.name,
            class: r.class,
            geometry: r.geometry,
            is_adjacent: r.is_adjacent,
            is_anchor: anchorHighway ? anchorHighway.id === r.id : false
        })),
        anchor_name: anchorHighway ? anchorHighway.name : null,
        data_source: "© OpenStreetMap contributors"
    };
}
