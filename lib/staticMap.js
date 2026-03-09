/**
 * Google Static Map URL Builder
 * 
 * Generates a Google Static Maps URL with satellite imagery,
 * road labels, and property boundary overlay.
 */

/**
 * Build a Google Static Maps URL for a property.
 * 
 * @param {Object} geometry - GeoJSON geometry (Polygon)
 * @param {string} apiKey - Google Maps API key
 * @param {Object} [options]
 * @param {number} [options.size=1200] - Image size (square)
 * @param {number} [options.scale=2] - Retina scale
 * @param {string} [options.pathColor='0xffff00ff'] - Boundary path color (hex + alpha)
 * @param {number} [options.pathWeight=4] - Boundary line weight
 * @returns {string} Google Static Maps URL
 */
export function buildStaticMapUrl(geometry, apiKey, options = {}) {
    if (!geometry?.coordinates?.[0] || !apiKey) {
        return null;
    }

    const {
        size = 1200,
        scale = 2,
        pathColor = '0xffff00ff',
        pathWeight = 4
    } = options;

    const coords = geometry.coordinates[0];

    // Build path parameter: lat,lng pairs separated by |
    const pathPoints = coords
        .map(([lon, lat]) => `${lat},${lon}`)
        .join('|');

    const pathParam = `color:${pathColor}|weight:${pathWeight}|${pathPoints}`;

    // Style params to emphasize roads and suppress POIs
    const styles = [
        'feature:poi|visibility:off',
        'feature:transit|visibility:off',
    ];

    const styleParams = styles
        .map(s => `&style=${encodeURIComponent(s)}`)
        .join('');

    const url = `https://maps.googleapis.com/maps/api/staticmap`
        + `?size=${size}x${size}`
        + `&scale=${scale}`
        + `&maptype=satellite`
        + `&path=${encodeURIComponent(pathParam)}`
        + styleParams
        + `&key=${apiKey}`;

    return url;
}
