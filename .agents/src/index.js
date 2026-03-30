require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { renderPropertyPhoto } = require('./renderer');
const { exportToPholopea } = require('./psd-generator');
const RenderQueue = require('./queue');

const app = express();
const queue = new RenderQueue();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        queue: queue.getStatus()
    });
});

/**
 * Main render endpoint
 * POST /render
 * 
 * Body:
 * {
 *   "centroid": { "lon": -122.45, "lat": 37.78 },
 *   "elevation": 100,
 *   "boundary": [[-122.451, 37.781], [-122.449, 37.781], [-122.449, 37.779], [-122.451, 37.779]],
 *   "acreage": 2.5,
 *   "roadName": "Main Street",
 *   "shotList": [0, 90, 180, 270]
 * }
 */
app.post('/render', async (req, res) => {
    try {
        const job = req.body;

        // Validate required fields
        if (!job.centroid || !job.boundary) {
            return res.status(400).json({
                error: 'Missing required fields: centroid, boundary'
            });
        }

        let result;
        try {
            result = await queue.enqueue(async () => {
                return await renderPropertyPhoto(job);
            });
        } catch (err) {
            console.error('[API] Render failed:', err.message);
            return res.status(500).json({
                error: 'Render failed',
                message: err.message
            });
        }

        const { writeOutput, getTimestampedPath } = require('../../lib/outputWriter');
        
        let fileResults = {};
        if (job.is_test) {
            const shotName = (job.shots && job.shots[0]) || 'render';
            let outputPath = path.join(process.cwd(), 'test-results', `${shotName}.png`);
            outputPath = getTimestampedPath(outputPath);
            
            await writeOutput(result.pngBuffer, result.metadata, outputPath);
            fileResults = {
                png_path: outputPath,
                psd_path: outputPath.replace('.png', '.psd') // Mocking for now
            };
        }

        // Generate PSD metadata
        const psdMeta = exportToPholopea(result.pngBuffer, {
            acreage: job.acreage || 0,
            roadName: job.roadName || 'Unknown Road',
            centroid: job.centroid,
            timestamp: result.metadata.timestamp
        });

        // Return both PNG and PSD metadata
        res.json({
            success: true,
            png: result.pngBuffer.toString('base64'),
            psd: psdMeta,
            metadata: result.metadata,
            ...fileResults
        });

    } catch (err) {
        console.error('[API] Error:', err);
        res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
});

/**
 * Batch render endpoint
 * POST /render-batch
 * 
 * Body:
 * {
 *   "jobs": [{ centroid, boundary, ... }, ...]
 * }
 */
app.post('/render-batch', async (req, res) => {
    try {
        const { jobs } = req.body;

        if (!Array.isArray(jobs) || jobs.length === 0) {
            return res.status(400).json({
                error: 'Invalid batch: must provide jobs array'
            });
        }

        const results = [];
        const errors = [];

        for (let i = 0; i < jobs.length; i++) {
            try {
                const result = await queue.enqueue(async () => {
                    return await renderPropertyPhoto(jobs[i]);
                });

                results.push({
                    index: i,
                    success: true,
                    png: result.pngBuffer.toString('base64'),
                    metadata: result.metadata
                });
            } catch (err) {
                errors.push({
                    index: i,
                    success: false,
                    error: err.message
                });
            }
        }

        res.json({
            total: jobs.length,
            successful: results.length,
            failed: errors.length,
            results,
            errors
        });

    } catch (err) {
        console.error('[API] Batch error:', err);
        res.status(500).json({
            error: 'Batch processing failed',
            message: err.message
        });
    }
});

/**
 * Queue status endpoint
 */
app.get('/queue/status', (req, res) => {
    res.json(queue.getStatus());
});

app.listen(PORT, () => {
    console.log(`[Server] Moonshot Renderer listening on port ${PORT}`);
    console.log(`[Config] Google API Key: ${process.env.GOOGLE_API_KEY ? '✓ set' : '✗ missing'}`);
    console.log(`[Config] Cesium Token: ${process.env.CESIUM_ION_TOKEN ? '✓ set' : '✗ missing'}`);
    console.log(`[Config] Black Frame Threshold: ${process.env.BLACK_FRAME_THRESHOLD || '0.95'}`);
});

module.exports = app;
