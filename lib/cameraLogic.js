/**
 * Generates 5 deterministic viewpoints around a coordinate.
 * Pillar 3: Radian-based 5-angle math.
 */
export function generateViewpoints(lat, lng) {
    const OFFSET = 0.0015;
    const HEIGHT = 500; // Arbitrary default height, adjust as needed or make parameter

    // Pillar 3: Exact Radian-based orientations
    // North: heading: 0, pitch: -0.44 (approx -25°)
    // East: heading: 1.57, pitch: -0.44
    // South: heading: 3.14, pitch: -0.44
    // West: heading: 4.71, pitch: -0.44
    // Nadir: heading: 0, pitch: -1.57 (exactly -90°)

    return [
        {
            name: 'North',
            latitude: lat + OFFSET,
            longitude: lng,
            height: HEIGHT,
            heading: 0,
            pitch: -0.44,
            roll: 0,
            fov: 1.0472, // ~60 degrees in radians, explicit default
        },
        {
            name: 'East',
            latitude: lat,
            longitude: lng + OFFSET,
            height: HEIGHT,
            heading: 1.57,
            pitch: -0.44,
            roll: 0,
            fov: 1.0472,
        },
        {
            name: 'South',
            latitude: lat - OFFSET,
            longitude: lng,
            height: HEIGHT,
            heading: 3.14,
            pitch: -0.44,
            roll: 0,
            fov: 1.0472,
        },
        {
            name: 'West',
            latitude: lat,
            longitude: lng - OFFSET,
            height: HEIGHT,
            heading: 4.71,
            pitch: -0.44,
            roll: 0,
            fov: 1.0472,
        },
        {
            name: 'Nadir',
            latitude: lat,
            longitude: lng,
            height: HEIGHT,
            heading: 0,
            pitch: -1.57,
            roll: 0,
            fov: 1.0472,
        },
    ];
}
