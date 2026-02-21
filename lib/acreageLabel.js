/**
 * Acreage Label Placement
 * 
 * Uses Turf.js to compute an optimal anchor point for the acreage text
 * label relative to the property boundary polygon.
 */
import * as turf from '@turf/turf';

/**
 * Compute the acreage label text and anchor position.
 * 
 * @param {number} acres - Property acreage
 * @param {Array<[number,number]>} boundaryCoords - GeoJSON polygon ring [[lon,lat], ...]
 * @returns {{ lon: number, lat: number, text: string }}
 */
export function computeAcreageLabel(acres, boundaryCoords) {
    if (!boundaryCoords || boundaryCoords.length < 3) {
        throw new Error('computeAcreageLabel requires at least 3 boundary coordinates');
    }

    // Format acreage text
    const text = formatAcres(acres);

    // Create a Turf polygon from the boundary
    const polygon = turf.polygon([boundaryCoords]);

    // Use center-of-mass for visual centroid (better than centroid for irregular shapes)
    const center = turf.centerOfMass(polygon);
    const [lon, lat] = center.geometry.coordinates;

    return { lon, lat, text };
}

/**
 * Format acreage as a human-readable string.
 * Examples: "6.19 acres", "0.25 acres", "142 acres"
 */
function formatAcres(acres) {
    if (acres == null || isNaN(acres)) return '';
    if (acres >= 10) return `${Math.round(acres)} acres`;
    if (acres >= 1) return `${acres.toFixed(2)} acres`;
    return `${acres.toFixed(2)} acres`;
}
