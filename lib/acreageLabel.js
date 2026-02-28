import * as turf from '@turf/turf';

/**
 * Compute the acreage label text and anchor position.
 * Logic: Finds the longest 'flat-ish' segment and offsets it OUTWARD to avoid obstructing the lot.
 */
export function computeAcreageLabel(acres, boundaryCoords) {
    if (!boundaryCoords || boundaryCoords.length < 3) {
        throw new Error('computeAcreageLabel requires at least 3 boundary coordinates');
    }

    const poly = turf.polygon([boundaryCoords]);
    const centroid = turf.centroid(poly);
    let bestSegment = null;
    let maxScore = -1;

    // Iterate through segments of the outer ring
    for (let i = 0; i < boundaryCoords.length - 1; i++) {
        const p1 = boundaryCoords[i];
        const p2 = boundaryCoords[i + 1];
        const line = turf.lineString([p1, p2]);
        const length = turf.length(line, { units: 'meters' });

        // Calculate bearing (0 is North, 90 is East)
        const brng = turf.bearing(p1, p2);

        // Score: prefers longer lines that are closer to horizontal (90 or -90)
        // Horizontal lines are easier to read 'sticker-style'
        const horizontalness = Math.abs(Math.sin(brng * Math.PI / 180)); // 1.0 for East/West, 0.0 for North/South
        const score = length * (0.5 + horizontalness); // length with 50% bias towards horizontal

        if (score > maxScore) {
            maxScore = score;
            bestSegment = { line, midpoint: turf.midpoint(p1, p2), bearing: brng };
        }
    }

    // Determine 'OUTWARD' direction
    // A simple offset might go inward or outward depending on winding.
    // We'll calculate the vector from centroid to midpoint.
    const toCentroid = turf.bearing(bestSegment.midpoint, centroid);
    const outwardBearing = (bestSegment.bearing + 90) % 360;

    // If the +90 degree normal points roughly towards the centroid, use -90 instead
    const diff = Math.abs(outwardBearing - toCentroid);
    const normalizedDiff = diff > 180 ? 360 - diff : diff;
    const finalBearing = normalizedDiff < 90 ? (bestSegment.bearing - 90) : outwardBearing;

    // Offset point outward by ~25 meters
    const anchor = turf.destination(bestSegment.midpoint, 25, finalBearing, { units: 'meters' });

    // Normalize rotation for sticker alignment (-90 to 90 degrees)
    let rotation = bestSegment.bearing;
    if (rotation > 90) rotation -= 180;
    if (rotation < -90) rotation += 180;

    return {
        lon: anchor.geometry.coordinates[0],
        lat: anchor.geometry.coordinates[1],
        text: formatAcres(acres),
        rotation: (rotation * Math.PI / 180) // Radians for Cesium
    };
}

function formatAcres(acres) {
    if (acres == null || isNaN(acres)) return '';
    const val = parseFloat(acres);
    const label = val === 1 ? 'ACRE' : 'ACRES';
    if (val >= 10) return `${Math.round(val)} ${label}`;
    return `${val.toFixed(2)} ${label}`;
}
