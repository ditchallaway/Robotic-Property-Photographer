/**
 * PSD Layer Composer (v2 — Human-in-the-Loop)
 * 
 * Composes a PSD with:
 *   - One raster background layer (map + boundary screenshot)
 *   - Multiple editable text layers (road names, acreage)
 * 
 * Uses ag-psd for PSD generation. Text layers will prompt
 * Photoshop/Photopea to render them on first open.
 */
import { writePsd } from 'ag-psd';
import sharp from 'sharp';

/**
 * Decode a PNG buffer into raw RGBA pixel data for ag-psd.
 * 
 * @param {Buffer} pngBuffer
 * @returns {Promise<{width: number, height: number, data: Uint8ClampedArray}>}
 */
async function decodeToImageData(pngBuffer) {
    const image = sharp(pngBuffer).ensureAlpha();
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    return {
        width: info.width,
        height: info.height,
        data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength)
    };
}

/**
 * Create a text layer object for ag-psd.
 * 
 * @param {Object} params
 * @param {string} params.name - Layer name
 * @param {string} params.text - Text content
 * @param {number} params.fontSize - Font size in points
 * @param {Object} params.color - RGBA color { r, g, b, a }
 * @param {number} params.x - Left position
 * @param {number} params.y - Top position
 * @param {number} params.canvasWidth - PSD canvas width
 * @param {number} params.canvasHeight - PSD canvas height
 * @returns {Object} ag-psd Layer object with text property
 */
function createTextLayer({ name, text, fontSize, color, x, y, canvasWidth, canvasHeight }) {
    // Text layer bounds — estimate based on font size and text length
    const estimatedWidth = Math.min(text.length * fontSize * 0.7, canvasWidth - x);
    const estimatedHeight = fontSize * 1.4;

    return {
        name,
        left: Math.round(x),
        top: Math.round(y),
        right: Math.round(x + estimatedWidth),
        bottom: Math.round(y + estimatedHeight),
        opacity: 1,
        blendMode: 'normal',
        text: {
            text: text,
            orientation: 'horizontal',
            antiAlias: 'smooth',
            transform: [1, 0, 0, 1, 0, 0],
            style: {
                font: { name: 'ArialMT' },
                fontSize: fontSize,
                fillColor: color,
            },
            styleRuns: [
                {
                    length: text.length,
                    style: {
                        font: { name: 'ArialMT' },
                        fontSize: fontSize,
                        fillColor: color,
                        tracking: 0,
                    }
                }
            ],
            paragraphStyle: {
                justification: 'left',
            },
            paragraphStyleRuns: [
                {
                    length: text.length,
                    style: {
                        justification: 'left',
                    }
                }
            ],
        }
    };
}

/**
 * Compose a PSD with a raster background and editable text layers.
 * 
 * @param {Buffer} backgroundBuffer - PNG buffer for the background layer (map + boundary)
 * @param {Array<Object>} textLayers - Array of text layer configs
 * @param {string} textLayers[].name - Layer name
 * @param {string} textLayers[].text - Text content
 * @param {number} textLayers[].fontSize - Font size
 * @param {Object} textLayers[].color - RGBA color
 * @param {number} textLayers[].x - X position
 * @param {number} textLayers[].y - Y position
 * @returns {Promise<Buffer>} PSD file buffer
 */
export async function composeHumanPsd(backgroundBuffer, textLayers = []) {
    const bgImageData = await decodeToImageData(backgroundBuffer);
    const canvasWidth = bgImageData.width;
    const canvasHeight = bgImageData.height;

    // Background raster layer (bottom)
    const bgLayer = {
        name: 'Background',
        imageData: {
            width: bgImageData.width,
            height: bgImageData.height,
            data: bgImageData.data
        },
        left: 0,
        top: 0,
        opacity: 1,
        blendMode: 'normal'
    };

    // Text layers (on top of background)
    const psdTextLayers = textLayers.map(tl =>
        createTextLayer({
            ...tl,
            canvasWidth,
            canvasHeight
        })
    );

    // Build PSD structure — ag-psd children are bottom-to-top
    // Background first (bottom), text layers on top
    const psd = {
        width: canvasWidth,
        height: canvasHeight,
        children: [bgLayer, ...psdTextLayers]
    };

    const psdBytes = writePsd(psd, { invalidateTextLayers: true });
    return Buffer.from(psdBytes);
}

/**
 * Legacy composePsd for backward compatibility (raster-only layers).
 * Kept for potential future use.
 */
export async function composePsd(layers, options = {}) {
    if (!layers || layers.length === 0) {
        throw new Error('composePsd requires at least one layer');
    }

    const decodedLayers = await Promise.all(
        layers.map(async (layer) => {
            const imageData = await decodeToImageData(layer.buffer);
            return { name: layer.name, ...imageData };
        })
    );

    const width = options.width || decodedLayers[0].width;
    const height = options.height || decodedLayers[0].height;

    const psd = {
        width,
        height,
        children: decodedLayers.map(layer => ({
            name: layer.name,
            imageData: {
                width: layer.width,
                height: layer.height,
                data: layer.data
            },
            left: 0,
            top: 0,
            opacity: 1,
            blendMode: 'normal'
        }))
    };

    const psdBytes = writePsd(psd);
    return Buffer.from(psdBytes);
}
