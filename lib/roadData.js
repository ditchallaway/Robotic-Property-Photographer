const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
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
 * Maps Google road types or names to spec classes
 */
function mapRoadClass(name, types = []) {
    const n = (name || '').toLowerCase();
    const t = types.map(x => x.toLowerCase());

    if (n.includes('i-') || n.includes('interstate') || n.includes('freeway') || t.includes('highway')) return 'highway';
    if (n.includes('us-') || n.includes('hwy') || n.includes('highway') || n.includes('state route') || n.includes('sr-')) return 'major';

    return 'local';
}

/**
 * Fetches details for a placeId to get the road name
 */
async function getRoadDetails(placeId) {
    if (!API_KEY) return null;
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,type&key=${API_KEY}`;
        const res = await fetchApi(url);
        const data = await res.json();
        if (data.status === 'OK') {
            return {
                name: data.result.name,
                types: data.result.types || []
            };
        }
    } catch (e) {
        console.error(`[roadData] Place Details failed for ${placeId}:`, e.message);
    }
    return null;
}

/**
 * Main entry point for fetching road data
 */
export async function fetchRoadData(lat, lon, boundary_lla = []) {
    console.log(`[roadData] Discovery for ${lat}, ${lon}`);
    if (!API_KEY) throw new Error('Missing Google API Key');
    if (!fetchApi) throw new Error('Global fetch not available');

    // 1. Generate Discovery Points
    // - Sample boundary
    // - 10x10 grid (~1km radius)
    const discoveryPoints = [];

    // Boundary samples
    if (boundary_lla.length > 0) {
        boundary_lla.forEach(p => discoveryPoints.push({ lat: p[1], lon: p[0] }));
    } else {
        discoveryPoints.push({ lat, lon });
    }

    // Grid samples (0.01 degrees ~1.1km)
    const span = 0.01;
    const steps = 5; // 5x5 for total search efficiency
    for (let i = -steps; i <= steps; i++) {
        for (let j = -steps; j <= steps; j++) {
            discoveryPoints.push({
                lat: lat + (i * span / steps),
                lon: lon + (j * span / steps)
            });
        }
    }

    // 2. Call Nearest Roads to find all unique segments
    // Google Roads API limit: 100 points per request
    const uniquePlaceIds = new Set();
    const chunkedPoints = [];
    for (let i = 0; i < discoveryPoints.length; i += 100) {
        chunkedPoints.push(discoveryPoints.slice(i, i + 100));
    }

    console.log(`[roadData] Querying nearest roads for ${discoveryPoints.length} points in ${chunkedPoints.length} chunks`);

    for (const chunk of chunkedPoints) {
        const pointsStr = chunk.map(p => `${p.lat},${p.lon}`).join('|');
        const url = `https://roads.googleapis.com/v1/nearestRoads?points=${pointsStr}&key=${API_KEY}`;
        try {
            const res = await fetchApi(url);
            const data = await res.json();
            if (data.snappedPoints) {
                data.snappedPoints.forEach(p => uniquePlaceIds.add(p.placeId));
            }
        } catch (e) {
            console.error(`[roadData] nearestRoads chunk failed:`, e.message);
        }
    }

    console.log(`[roadData] Found ${uniquePlaceIds.size} unique road segments`);

    // 3. Resolve Metadata and Trace Geometry
    const roads = [];
    const placeIdToRoad = new Map();

    for (const placeId of uniquePlaceIds) {
        // Get Name & Class
        const details = await getRoadDetails(placeId);
        if (!details || !details.name) continue;

        const roadClass = mapRoadClass(details.name, details.types);

        // Trace Geometry
        // For a single placeId, we can't easily "interpolate" without two points.
        // However, we can find points that snapped to this placeId.
        // Let's refine the discovery: we need segments.
        // Actually, snapToRoads with interpolate=true works best with a path.
        // But we have placeIds. 
        // Strategy: Use snapToRoads on the original discovery points, grouped by placeId? 
        // No, snapToRoads returns a sequence.
    }

    // REVISED STRATEGY: 
    // Instead of Place Details first, let's use Snap to Roads on discovery paths to get geometry.
    // Then use Place Details only on the unique placeIds in the result.

    const finalRoads = new Map();

    // Trace paths (Horizontal and Vertical grid lines for coverage)
    const paths = [];
    // Boundary loop
    if (boundary_lla.length > 1) {
        paths.push(boundary_lla.map(p => ({ lat: p[1], lon: p[0] })));
    }

    // Grid lines
    for (let i = -steps; i <= steps; i++) {
        // Vertical line
        paths.push([
            { lat: lat - span, lon: lon + (i * span / steps) },
            { lat: lat + span, lon: lon + (i * span / steps) }
        ]);
        // Horizontal line
        paths.push([
            { lat: lat + (i * span / steps), lon: lon - span },
            { lat: lat + (i * span / steps), lon: lon + span }
        ]);
    }

    console.log(`[roadData] Tracing ${paths.length} paths`);

    for (const path of paths) {
        const pathStr = path.map(p => `${p.lat},${p.lon}`).join('|');
        const url = `https://roads.googleapis.com/v1/snapToRoads?path=${pathStr}&interpolate=true&key=${API_KEY}`;
        try {
            const res = await fetchApi(url);
            const data = await res.json();
            if (data.snappedPoints) {
                // Group by placeId to form segments
                let currentPlaceId = null;
                let currentGeom = [];

                for (const p of data.snappedPoints) {
                    if (p.placeId !== currentPlaceId) {
                        if (currentPlaceId && currentGeom.length > 1) {
                            if (!finalRoads.has(currentPlaceId)) {
                                finalRoads.set(currentPlaceId, { geometry: [] });
                            }
                            // Append or merge geometry? For now, just collect all
                            finalRoads.get(currentPlaceId).geometry.push(...currentGeom);
                        }
                        currentPlaceId = p.placeId;
                        currentGeom = [];
                    }
                    currentGeom.push({ lat: p.location.latitude, lon: p.location.longitude });
                }
                if (currentPlaceId && currentGeom.length > 1) {
                    if (!finalRoads.has(currentPlaceId)) {
                        finalRoads.set(currentPlaceId, { geometry: [] });
                    }
                    finalRoads.get(currentPlaceId).geometry.push(...currentGeom);
                }
            }
        } catch (e) {
            console.error(`[roadData] snapToRoads failed:`, e.message);
        }
    }

    // 4. Final Processing: Details, Classification, and Cleanup
    const resultRoads = [];
    let anchorHighway = null;

    for (const [placeId, road] of finalRoads.entries()) {
        const details = await getRoadDetails(placeId);
        if (!details || !details.name) continue;

        const roadClass = mapRoadClass(details.name, details.types);

        // Deduplicate and Sort Geometry (Rough approximation)
        // Since we collected points from various crossings, we just want a simple path.
        // This is hard without knowing the sequence. 
        // Actually, for a single segment (placeId), snapToRoads with interpolate=true 
        // usually returns a clean sequence if the path was continuous.
        // Because we snapped grid lines, we have segments.

        // Let's just take the longest continuous segment for that placeId?
        // Or just the unique points sorted by one axis? (Risky)
        // Better: just use the geometry as is, the label logic handles anchor points.

        const r = {
            id: placeId,
            name: details.name,
            class: roadClass,
            geometry: road.geometry,
            is_adjacent: boundary_lla.length > 0 ? road.geometry.some(pt => isPointInPoly(pt, boundary_lla)) : false
        };

        if (roadClass === 'highway' && (!anchorHighway || r.is_adjacent)) {
            anchorHighway = r;
        }

        resultRoads.push(r);
    }

    console.log(`[roadData] Discovery complete. Found ${resultRoads.length} named roads.`);

    return {
        roads: resultRoads.map(r => ({
            ...r,
            is_anchor: anchorHighway ? anchorHighway.id === r.id : false
        })),
        anchor_name: anchorHighway ? anchorHighway.name : null
    };
}
