/**
 * Application configuration and environment validation
 */
require('dotenv').config();

const config = {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    BLACK_FRAME_THRESHOLD: parseFloat(process.env.BLACK_FRAME_THRESHOLD || '0.95'),
    PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    VARYING_PITCH: parseFloat(process.env.VARYING_PITCH || '-24'),
};

// Fail fast if critical environment variables are missing
const requiredVars = ['GOOGLE_API_KEY'];
const missingVars = requiredVars.filter(v => !config[v]);

if (missingVars.length > 0) {
    console.error(`[FATAL] Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}

module.exports = config;
