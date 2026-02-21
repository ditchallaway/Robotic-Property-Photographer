/**
 * Chroma-Key Removal Utility
 * 
 * Removes a solid chroma color from a PNG buffer, replacing matched pixels
 * with transparency. Designed for the multi-pass rendering pipeline where
 * overlay layers (boundary, labels, text) are captured on a magenta background.
 */
import sharp from 'sharp';

// Default chroma key: magenta #FF00FF
const DEFAULT_CHROMA = { r: 255, g: 0, b: 255 };

/**
 * Remove chroma-key color from a PNG buffer.
 * 
 * @param {Buffer} pngBuffer - Input PNG image buffer
 * @param {Object} [options]
 * @param {Object} [options.color] - Chroma color { r, g, b } to remove (default: magenta)
 * @param {number} [options.tolerance] - Color distance tolerance (0-442, default: 30)
 * @returns {Promise<Buffer>} PNG buffer with chroma pixels made transparent
 */
export async function removeChromaKey(pngBuffer, options = {}) {
    const chroma = options.color || DEFAULT_CHROMA;
    const tolerance = options.tolerance ?? 30;

    const image = sharp(pngBuffer).ensureAlpha();
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    // Process each pixel: if close to chroma color, set alpha to 0
    for (let i = 0; i < data.length; i += channels) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dist = Math.sqrt(
            Math.pow(r - chroma.r, 2) +
            Math.pow(g - chroma.g, 2) +
            Math.pow(b - chroma.b, 2)
        );

        if (dist <= tolerance) {
            data[i + 3] = 0; // Set alpha to transparent
        }
    }

    return sharp(data, { raw: { width, height, channels } })
        .png()
        .toBuffer();
}
