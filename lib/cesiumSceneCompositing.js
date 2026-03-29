/**
 * Cesium Scene Compositing Utility
 * 
 * Manages the "Director" logic for property photography:
 * 1. Defining standard shot lists.
 * 2. Generating intelligent text layer configurations for PSDs.
 * 3. Coordinating between screenshots and metadata.
 */

const CANVAS_WIDTH = 2048;
const CANVAS_HEIGHT = 1536;

/**
 * Returns the default shot list for a property mission.
 * 
 * @param {Object} [options]
 * @param {number} [options.area] - Parcel area in acres (to adjust altitude/pitch)
 * @returns {Array<Object>}
 */
export function getStandardShotList(options = {}) {
    const { area = 10 } = options;
    
    // Oblique pitch MUST be strictly -24 degrees per camera-pitch.md rule
    const obliquePitch = -24;

    return [
        { name: 'nadir', heading: 0, pitch: -89.9, tag: 'overview' },
        { name: 'cardinal', heading: 0, pitch: obliquePitch, tag: 'north' },
        { name: 'east', heading: 90, pitch: obliquePitch, tag: 'east' },
        { name: 'south', heading: 180, pitch: obliquePitch, tag: 'south' },
        { name: 'west', heading: 270, pitch: obliquePitch, tag: 'west' }
    ];
}

/**
 * Generates text layer configurations for a PSD.
 * 
 * @param {Array<string>} roads - List of road names
 * @param {string} acreage - Formatted acreage string (e.g., "5.00 ACRES")
 * @returns {Array<Object>} config objects for psdComposer.js
 */
export function generateTextLayerConfigs(roads, acreage) {
    const configs = [];

    // 1. Road Names (Stacked top-right)
    // We limit to 5 roads to avoid cluttering the view
    const visibleRoads = roads.slice(0, 5);
    const roadStartX = CANVAS_WIDTH - 600;
    const roadStartY = 60;
    const roadLineHeight = 80;

    visibleRoads.forEach((name, i) => {
        configs.push({
            name: `Road: ${name}`,
            text: name,
            fontSize: 48,
            color: { r: 255, g: 255, b: 255, a: 255 },
            x: roadStartX,
            y: roadStartY + (i * roadLineHeight)
        });
    });

    // 2. Acreage Label (Centered bottom)
    if (acreage) {
        // Simple heuristic for center alignment
        // In a real app we might measure text width, but here we use a fixed offset
        const acreageWidth = 400; 
        configs.push({
            name: 'Acreage',
            text: acreage,
            fontSize: 80,
            color: { r: 255, g: 255, b: 0, a: 255 }, // Yellow
            x: (CANVAS_WIDTH / 2) - (acreageWidth / 2),
            y: CANVAS_HEIGHT - 160
        });
    }

    return configs;
}

/**
 * Validates if a frame is "black" or mostly empty.
 * Uses sharp.stats() for high-performance native-speed validation.
 * 
 * @param {Buffer} buffer - image buffer
 * @param {Object} sharp - sharp instance
 * @returns {Promise<{isBlack: boolean, nonBlackPct: number}>}
 */
export async function validateFrameIntegrity(buffer, sharp) {
    const stats = await sharp(buffer).stats();
    
    // Check if the maximum channel value across all pixels is above noise floor (30)
    // If even the brightest pixel is dark, the whole frame is likely missing tiles.
    const maxVal = Math.max(...stats.channels.map(c => c.max));
    const isTotallyBlack = maxVal < 30;

    // We still need a "percentage of non-black" for more nuanced checks
    // We use a downsampled version to calculate this quickly
    const { data, info } = await sharp(buffer)
        .resize(100, 100, { fit: 'fill' }) // Downsample for fast inspection
        .raw()
        .toBuffer({ resolveWithObject: true });
    
    let nonBlackCount = 0;
    for (let i = 0; i < data.length; i += info.channels) {
        if (data[i] > 30 || data[i + 1] > 30 || data[i + 2] > 30) {
            nonBlackCount++;
        }
    }
    
    const pct = (nonBlackCount / (info.width * info.height)) * 100;

    return {
        isBlack: isTotallyBlack || pct < 5.0,
        nonBlackPct: pct
    };
}
