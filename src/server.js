'use strict';

/**
 * Robotic Property Photographer — HTTP Server
 *
 * Replaces Next.js as the HTTP layer for the render microservice.
 * Exposes a POST /api/render endpoint and a GET /api/health endpoint.
 *
 * Usage:
 *   node src/server.js
 *   PORT=3000 node src/server.js
 */

const http = require('http');
const { normalizeJob } = require('../lib/jobParser');
const { executeRenderJob } = require('./renderJob');

const PORT = parseInt(process.env.PORT || '3000', 10);

// Sequential render queue — only one job runs at a time to prevent
// WebGL memory exhaustion in Docker.
let renderQueue = Promise.resolve();

/**
 * Read and parse the JSON body from an incoming HTTP request.
 *
 * @param {http.IncomingMessage} req
 * @returns {Promise<Object>}
 */
function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', chunk => { raw += chunk; });
        req.on('end', () => {
            try {
                resolve(JSON.parse(raw));
            } catch {
                reject(new Error('Invalid JSON body'));
            }
        });
        req.on('error', reject);
    });
}

/**
 * Send a JSON response.
 *
 * @param {http.ServerResponse} res
 * @param {number} statusCode
 * @param {Object} data
 */
function sendJson(res, statusCode, data) {
    const body = JSON.stringify(data);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
    });
    res.end(body);
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');

    // Health check
    if (req.method === 'GET' && url.pathname === '/api/health') {
        return sendJson(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    }

    // Render endpoint
    if (req.method === 'POST' && url.pathname === '/api/render') {
        let body;
        try {
            body = await parseJsonBody(req);
        } catch {
            return sendJson(res, 400, { error: 'Invalid JSON body' });
        }

        let job;
        try {
            job = normalizeJob(body);
        } catch (err) {
            return sendJson(res, 400, { error: err.message });
        }

        // Enqueue the render job (sequential — 1 at a time)
        let jobResolve, jobReject;
        const jobPromise = new Promise((resolve, reject) => {
            jobResolve = resolve;
            jobReject = reject;
        });

        renderQueue = renderQueue.then(async () => {
            try {
                jobResolve(await executeRenderJob(job));
            } catch (err) {
                jobReject(err);
            }
        });

        try {
            const result = await jobPromise;
            return sendJson(res, 200, result);
        } catch (err) {
            console.error('[Server] Render failed:', err.message);
            return sendJson(res, 500, { error: 'Render failed', message: err.message });
        }
    }

    sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
    console.log('[Server] Robotic Property Photographer listening on port ' + PORT);
    console.log('[Config] Google API Key : ' + (process.env.GOOGLE_API_KEY  ? '✓ set' : '✗ missing'));
    console.log('[Config] Cesium Token   : ' + (process.env.CESIUM_ION_TOKEN ? '✓ set' : '✗ missing'));
});

module.exports = server;
