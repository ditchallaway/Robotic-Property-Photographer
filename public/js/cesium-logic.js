/**
 * Browser-side Cesium Logic
 * 
 * Included in render.html to handle GeoJSON conversion and mission execution.
 */

window.CesiumUtils = {
    /**
     * Converts GeoJSON to Cesium Positions
     */
    geoJsonToPositions: function(geometry, elevation, Cesium) {
        if (!geometry || !geometry.coordinates) return [];
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
    },

    /**
     * Calculates camera range (distance) that fits the bounding sphere 
     * with a comfortable margin.
     * 
     * @param {number} radius - Bounding sphere radius in meters
     * @param {number} pitch - Camera pitch in degrees
     * @returns {number} range in meters
     */
    calculateRange: function(radius, pitch) {
        // Terrain-logic rule: Use boundingSphere.radius * 2.0 for framing
        return radius * 2.0;
    },

    /**
     * Wait for tiles to settle (both 3D tiles and terrain)
     */
    waitForTiles: async function(viewer, tileset) {
        return new Promise(resolve => {
            let stable = 0;
            const timer = setInterval(() => {
                const tsLoaded = tileset ? (tileset.tilesLoaded || tileset.allTilesLoaded) : true;
                const gLoaded = viewer.scene.globe.tilesLoaded;
                if (tsLoaded && gLoaded) {
                    if (++stable >= 3) {
                        clearInterval(timer);
                        resolve();
                    }
                } else {
                    stable = 0;
                }
            }, 300);
            setTimeout(() => { clearInterval(timer); resolve(); }, 120000);
        });
    }
};
