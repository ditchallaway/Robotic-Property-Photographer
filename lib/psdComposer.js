/**
 * PSD Layer Composer
 * 
 * Composes multiple PNG buffers into a single PSD file with named layers
 * using ag-psd. Layers are ordered bottom-to-top (first = bottom).
 */
import { writePsd } from 'ag-psd';
import sharp from 'sharp';

/**
 * Decode a PNG buffer into raw RGBA pixel data for ag-psd.
 * ag-psd expects imageData with a Uint8ClampedArray `data` property.
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
 * Compose multiple PNG layers into a PSD file.
 * 
 * @param {Array<{name: string, buffer: Buffer}>} layers - Layers bottom-to-top
 * @param {Object} [options]
 * @param {number} [options.width] - Canvas width (default: from first layer)
 * @param {number} [options.height] - Canvas height (default: from first layer)
 * @returns {Promise<Buffer>} PSD file buffer
 */
export async function composePsd(layers, options = {}) {
    if (!layers || layers.length === 0) {
        throw new Error('composePsd requires at least one layer');
    }

    // Decode all layers to imageData
    const decodedLayers = await Promise.all(
        layers.map(async (layer) => {
            const imageData = await decodeToImageData(layer.buffer);
            return {
                name: layer.name,
                ...imageData
            };
        })
    );

    const width = options.width || decodedLayers[0].width;
    const height = options.height || decodedLayers[0].height;

    // Build PSD structure
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

    // writePsd returns a Uint8Array
    const psdBytes = writePsd(psd);
    return Buffer.from(psdBytes);
}
