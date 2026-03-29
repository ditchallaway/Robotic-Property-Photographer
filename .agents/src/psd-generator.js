const PSD = require('psd');

/**
 * Create an editable text layer in PSD format
 */
function createTextLayer({ name, text, fontSize, color, x, y }) {
    return {
        name,
        left: Math.round(x),
        top: Math.round(y),
        opacity: 1,
        text: {
            text: text,
            style: {
                font: { name: 'ArialMT' },
                fontSize: fontSize,
                fillColor: color,
            },
            styleRuns: [
                {
                    length: text.length,
                    style: {
                        fontSize,
                        fillColor: color
                    }
                }
            ],
        }
    };
}

/**
 * Generate PSD with base image + editable text layers
 * @param {Buffer} pngBuffer - Screenshot PNG
 * @param {Object} metadata - { acreage, roadName, centroid, timestamp }
 * @returns {Buffer} PSD file
 */
async function generatePSD(pngBuffer, metadata) {
    const { acreage, roadName = 'Unknown Road', centroid, timestamp } = metadata;

    try {
        // Parse PNG to get dimensions
        const sharp = require('sharp');
        const pngMeta = await sharp(pngBuffer).metadata();
        const { width, height } = pngMeta;

        // Build layer structure
        const layers = [];

        // Text layers with fixed positioning
        layers.push(
            createTextLayer({
                name: 'Road Name',
                text: roadName,
                fontSize: 32,
                color: { r: 255, g: 255, b: 255 }, // White
                x: 50,
                y: 50
            })
        );

        layers.push(
            createTextLayer({
                name: 'Acreage',
                text: `${acreage.toFixed(2)} acres`,
                fontSize: 28,
                color: { r: 255, g: 255, b: 255 }, // White
                x: 50,
                y: 100
            })
        );

        layers.push(
            createTextLayer({
                name: 'Coordinates',
                text: `${centroid.lat.toFixed(6)}, ${centroid.lon.toFixed(6)}`,
                fontSize: 16,
                color: { r: 200, g: 200, b: 200 }, // Light gray
                x: 50,
                y: 150
            })
        );

        layers.push(
            createTextLayer({
                name: 'Timestamp',
                text: new Date(timestamp).toLocaleString(),
                fontSize: 14,
                color: { r: 150, g: 150, b: 150 }, // Medium gray
                x: 50,
                y: 180
            })
        );

        // Create a simple PSD structure
        // Note: Full PSD generation requires binary format support
        // For now, return structured metadata that can be exported
        const psdData = {
            version: 1,
            canvas: { width, height },
            layers: layers,
            image: pngBuffer.toString('base64')
        };

        // In production, use a proper PSD library or export to JSON for Photopea
        console.log('[PSD] Generated PSD metadata with', layers.length, 'text layers');
        
        return Buffer.from(JSON.stringify(psdData));

    } catch (err) {
        console.error('[PSD] Generation error:', err.message);
        throw err;
    }
}

/**
 * Export PSD structure to Photopea JSON format
 * Photopea can import this and convert to native PSD
 */
function exportToPholopea(pngBuffer, metadata) {
    const { acreage, roadName = 'Unknown Road', centroid, timestamp } = metadata;

    return {
        psVersion: 1,
        width: 1920,
        height: 1080,
        depth: 8,
        colorMode: 'RGB',
        layers: [
            {
                name: 'Background',
                type: 'raster',
                opacity: 100,
                blendMode: 'normal',
                visible: true,
                data: pngBuffer.toString('base64')
            },
            {
                name: 'Road Name',
                type: 'text',
                text: roadName,
                fontSize: 32,
                fontName: 'Arial',
                left: 50,
                top: 50,
                color: '#FFFFFF'
            },
            {
                name: 'Acreage',
                type: 'text',
                text: `${acreage.toFixed(2)} acres`,
                fontSize: 28,
                fontName: 'Arial',
                left: 50,
                top: 100,
                color: '#FFFFFF'
            },
            {
                name: 'Coordinates',
                type: 'text',
                text: `${centroid.lat.toFixed(6)}, ${centroid.lon.toFixed(6)}`,
                fontSize: 16,
                fontName: 'Arial',
                left: 50,
                top: 150,
                color: '#C8C8C8'
            },
            {
                name: 'Timestamp',
                type: 'text',
                text: new Date(timestamp).toLocaleString(),
                fontSize: 14,
                fontName: 'Arial',
                left: 50,
                top: 180,
                color: '#969696'
            }
        ]
    };
}

module.exports = {
    createTextLayer,
    generatePSD,
    exportToPholopea
};
