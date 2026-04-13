/**
 * Application configuration and environment validation
 */
require('dotenv').config();

const config = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    BLACK_FRAME_THRESHOLD: parseFloat(process.env.BLACK_FRAME_THRESHOLD || '0.95'),
    PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    VARYING_PITCH: parseFloat(process.env.VARYING_PITCH || '-24'),
    RENDER_TIMEOUT_MS: parseInt(process.env.RENDER_TIMEOUT_MS || '600000'), // 10 minutes
    SHOT_TILE_TIMEOUT_MS: parseInt(process.env.SHOT_TILE_TIMEOUT_MS || '120000'), // 2 minutes per shot
    TILE_CHECK_INTERVAL_MS: parseInt(process.env.TILE_CHECK_INTERVAL_MS || '300'),
    TILE_STABLE_TICKS_REQUIRED: parseInt(process.env.TILE_STABLE_TICKS_REQUIRED || '3'),
    COARSE_SSE: parseFloat(process.env.COARSE_SSE || '128'),
    FINAL_SSE: parseFloat(process.env.FINAL_SSE || '1.0')
};

// Fail fast if critical environment variables are missing
const requiredVars = ['GOOGLE_API_KEY'];
const missingVars = requiredVars.filter(v => !config[v]);

if (missingVars.length > 0) {
    console.error(`[FATAL] Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}

module.exports = config;
