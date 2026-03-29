/**
 * Photopea Integration URL Builder
 * 
 * Generates a URL that opens Photopea with a PSD file (when uploaded to R2)
 * and/or a Google Static Map reference image for street identification.
 * 
 * Uses the self-hosted instance at app.brokertricks.com
 */

const PHOTOPEA_BASE = process.env.PHOTOPEA_URL || 'https://app.brokertricks.com';

/**
 * Build a Photopea URL that opens files for editing.
 * 
 * Photopea accepts a config JSON in the hash fragment:
 *   #config={"files":["url1","url2"]}
 * 
 * Each URL opens as a separate document tab in Photopea.
 * The static map always opens so the operator can reference road labels.
 * The PSD opens when it has a public URL (R2 configured).
 * 
 * @param {string|null} psdUrl - URL to the PSD file (null if R2 not configured)
 * @param {string|null} staticMapUrl - Google Static Map URL for road reference
 * @returns {string|null} Photopea URL or null if nothing to open
 */
export function buildPhotopeaUrl(psdUrl, staticMapUrl) {
    const files = [];

    if (psdUrl) files.push(psdUrl);
    if (staticMapUrl) files.push(staticMapUrl);

    if (files.length === 0) return null;

    const config = JSON.stringify({ files });
    return `${PHOTOPEA_BASE}#${encodeURIComponent(config)}`;
}
