/**
 * Validates a GeoJSON geometry object.
 * 
 * @param {Object} geometry 
 * @throws {Error} if invalid
 */
export function validateGeoJson(geometry) {
    if (!geometry) throw new Error('Geometry is missing');
    if (!['Polygon', 'MultiPolygon'].includes(geometry.type)) {
        throw new Error(`Unsupported geometry type: ${geometry.type}. Only Polygon and MultiPolygon are supported.`);
    }
    if (!geometry.coordinates || !Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
        throw new Error('Geometry coordinates are missing or empty');
    }
}

/**
 * Converts GeoJSON geometry to an array of Cesium-compatible coordinate arrays.
 * 
 * @param {Object} geometry - GeoJSON Polygon or MultiPolygon
 * @param {number} [elevation=0] - Elevation to apply to all points
 * @param {Object} Cesium - Cesium library instance
 * @returns {Array<Array<Object>>} Array of position arrays (one for each ring/polygon)
 */
export function geoJsonToCesiumPositions(geometry, elevation = 0, Cesium) {
    validateGeoJson(geometry);
    
    const results = [];
    
    if (geometry.type === 'Polygon') {
        geometry.coordinates.forEach(ring => {
            const positions = ring.map(coord => 
                Cesium.Cartesian3.fromDegrees(coord[0], coord[1], elevation)
            );
            results.push(positions);
        });
    } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach(polygon => {
            polygon.forEach(ring => {
                const positions = ring.map(coord => 
                    Cesium.Cartesian3.fromDegrees(coord[0], coord[1], elevation)
                );
                results.push(positions);
            });
        });
    }
    
    return results;
}

/**
 * Flattens all positions from multiple rings into a single array.
 * Useful for BoundingSphere calculation.
 * 
 * @param {Array<Array<Object>>} positionGroups 
 * @returns {Array<Object>}
 */
export function flattenPositions(positionGroups) {
    return positionGroups.reduce((acc, val) => acc.concat(val), []);
}

/**
 * Creates a BoundingSphere from geometry.
 * 
 * @param {Object} geometry 
 * @param {Object} centroid - { lat, lon } or [lon, lat]
 * @param {number} elevation 
 * @param {Object} Cesium 
 * @returns {Object} Cesium.BoundingSphere
 */
export function createBoundingSphere(geometry, centroid, elevation, Cesium) {
    const lat = Array.isArray(centroid) ? centroid[1] : centroid.lat;
    const lon = Array.isArray(centroid) ? centroid[0] : centroid.lon;
    
    const groups = geoJsonToCesiumPositions(geometry, elevation, Cesium);
    const allPositions = flattenPositions(groups);
    
    const sphere = Cesium.BoundingSphere.fromPoints(allPositions);
    
    // Override center with the explicit centroid if provided
    sphere.center = Cesium.Cartesian3.fromDegrees(lon, lat, elevation);
    
    // Safety minimum radius
    if (sphere.radius < 50) sphere.radius = 50;
    
    return sphere;
}

/**
 * Calculates a camera range (distance) that fits the bounding sphere 
 * with a comfortable margin.
 * 
 * @param {number} radius - Bounding sphere radius in meters
 * @param {number} pitch - Camera pitch in degrees
 * @returns {number} range in meters
 */
export function calculateCameraRange(radius, pitch) {
    // Terrain-logic rule: Use boundingSphere.radius * 2.0 for framing
    return radius * 2.0;
}

/**
 * Estimates the "optimal" heading for an elongated parcel.
 * Returns the heading (0-360) of the long axis.
 * 
 * @param {Object} geometry - GeoJSON
 * @returns {number} heading in degrees
 */
export function estimateOptimalHeading(geometry) {
    validateGeoJson(geometry);
    
    // Flatten all points to [lon, lat]
    let points = [];
    if (geometry.type === 'Polygon') {
        points = geometry.coordinates[0];
    } else {
        points = geometry.coordinates[0][0];
    }
    
    const lons = points.map(p => p[0]);
    const lats = points.map(p => p[1]);
    
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    
    const dLon = (maxLon - minLon) * Math.cos((minLat + maxLat) / 2 * Math.PI / 180);
    const dLat = (maxLat - minLat);
    
    // If wider than tall, optimal heading is 90 (East-West)
    // If taller than wide, optimal heading is 0 (North-South)
    return (dLon > dLat) ? 90 : 0;
}
