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
    // Proportional Scaling Algorithm: 2.40-870 acre range
    // Altitude scales with sqrt(acreage) to maintain consistent relative framing.
    const SCALE_FACTOR = Math.sqrt(gisacre); // S = √(gisacre)

    // Base altitude 70m for 1 acre -> ~180m for 6.5 acres
    const RELATIVE_HEIGHT = 70 * SCALE_FACTOR;
    const ABSOLUTE_ALTITUDE = groundElevation + RELATIVE_HEIGHT;

    // Aesthetic Constants: "Isometric Professional"
    const PITCH = -1.1519; // -66° in radians

    // Step back distance to center the centroid at -66° pitch
    // D = H / tan(66°)
    // tan(66°) ≈ 2.246
    // D ≈ H / 2.246
    // Degrees ≈ Meters / 111,111
    const STEP_BACK_METERS = RELATIVE_HEIGHT / 2.246;
    const STEP_BACK = STEP_BACK_METERS / 111111;

    const FOV = 1.7453; // 100° in radians

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
