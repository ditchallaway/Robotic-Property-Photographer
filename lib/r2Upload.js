/**
 * Cloudflare R2 Upload (S3-compatible)
 * 
 * Optional upload to R2. When env vars are not configured,
 * all methods gracefully no-op and return null.
 * 
 * Required env vars:
 *   R2_ENDPOINT       - S3-compatible endpoint URL
 *   R2_ACCESS_KEY_ID  - Access key
 *   R2_SECRET_KEY     - Secret key
 *   R2_BUCKET         - Bucket name
 *   R2_PUBLIC_URL     - Public base URL for file access
 */

let s3Client = null;
let bucketName = null;
let publicBaseUrl = null;

/**
 * Check if R2 is configured.
 * @returns {boolean}
 */
export function isR2Configured() {
    return !!(
        process.env.R2_ENDPOINT &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_KEY &&
        process.env.R2_BUCKET
    );
}

/**
 * Lazily initialize the S3 client.
 * Returns null if R2 env vars are not configured.
 */
async function getClient() {
    if (!isR2Configured()) return null;

    if (!s3Client) {
        const { S3Client } = await import('@aws-sdk/client-s3');
        s3Client = new S3Client({
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_KEY,
            },
        });
        bucketName = process.env.R2_BUCKET;
        publicBaseUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
    }

    return s3Client;
}

/**
 * Upload a buffer to R2.
 * 
 * @param {Buffer} buffer - File data to upload
 * @param {string} key - Object key (e.g., 'order_123/cust_456/cardinal.psd')
 * @param {string} [contentType='application/octet-stream'] - MIME type
 * @returns {Promise<string|null>} Public URL or null if R2 is not configured
 */
export async function uploadToR2(buffer, key, contentType = 'application/octet-stream') {
    const client = await getClient();
    if (!client) {
        console.log('[R2] Not configured — skipping upload');
        return null;
    }

    try {
        const { PutObjectCommand } = await import('@aws-sdk/client-s3');
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        }));

        const publicUrl = publicBaseUrl ? `${publicBaseUrl}/${key}` : null;
        console.log(`[R2] Uploaded: ${key} (${(buffer.length / 1024).toFixed(1)} KB) → ${publicUrl || '(no public URL)'}`);
        return publicUrl;
    } catch (err) {
        console.error(`[R2] Upload failed: ${err.message}`);
        return null;
    }
}
