/**
 * Terrain-Aware Robotic Photographer for Vacant Land Listings
 * Generates 5 viewpoints (Nadir + 4 cardinal) scaled by property acreage.
 * Pillar 2: Updated Terrain-Relative Altitude Model
 * 
 * @param {number} lat - Centroid latitude
 * @param {number} lng - Centroid longitude
 * @param {number} gisacre - GIS Acreage (Zoom/Scale Driver)
 * @param {number} groundElevation - Ground Elevation in meters (Terrain Baseline)
 * @returns {Array} Array of 5 camera viewpoint objects
 */
export function generateViewpoints(lat, lng, gisacre, groundElevation) {
    // Fixed-Parameter Algorithm: Inverse scaling for 2.40-870 acre range
    const SCALE_FACTOR = Math.sqrt(gisacre); // S = √(gisacre)
    const RELATIVE_HEIGHT = 1200 - (SCALE_FACTOR * 20); // H = 1200 - (S × 20) - Inverse scale
    const ABSOLUTE_ALTITUDE = groundElevation + RELATIVE_HEIGHT; // A = elevation + H
    const STEP_BACK = 0.03 / SCALE_FACTOR; // D = 0.03 / S - Smaller offset for larger properties

    // Aesthetic Constants: "Isometric Professional"
    const PITCH = -1.1519; // -66° in radians (fixed downward tilt)
    const FOV = 0.9599; // 55° in radians (fixed field of view)

    // Five Required Perspectives:
    // 1. Nadir (Top-Down): Capture property boundaries and orientation
    // 2. North View: Position south of centroid, looking north
    // 3. South View: Position north of centroid, looking south
    // 4. East View: Position west of centroid, looking east
    // 5. West View: Position east of centroid, looking west

    return [
        {
            name: 'Nadir',
            latitude: lat,
            longitude: lng,
            height: ABSOLUTE_ALTITUDE,
            heading: 0,
            pitch: -1.5708, // -90° in radians (straight down)
            roll: 0,
            fov: FOV,
        },
        {
            name: 'North',
            latitude: lat - STEP_BACK,
            longitude: lng,
            height: ABSOLUTE_ALTITUDE,
            heading: 0, // 0° - Looking North
            pitch: PITCH,
            roll: 0,
            fov: FOV,
        },
        {
            name: 'South',
            latitude: lat + STEP_BACK,
            longitude: lng,
            height: ABSOLUTE_ALTITUDE,
            heading: 3.14159, // 180° (π radians) - Looking South
            pitch: PITCH,
            roll: 0,
            fov: FOV,
        },
        {
            name: 'East',
            latitude: lat,
            longitude: lng - STEP_BACK,
            height: ABSOLUTE_ALTITUDE,
            heading: 1.5708, // 90° (π/2 radians) - Looking East
            pitch: PITCH,
            roll: 0,
            fov: FOV,
        },
        {
            name: 'West',
            latitude: lat,
            longitude: lng + STEP_BACK,
            height: ABSOLUTE_ALTITUDE,
            heading: -1.5708, // -90° (-π/2 radians) - Looking West
            pitch: PITCH,
            roll: 0,
            fov: FOV,
        },
    ];
}
