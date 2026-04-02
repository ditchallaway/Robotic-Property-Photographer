#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { renderPropertyPhoto } = require('../.agents/src/renderer');
const { normalizeJob } = require('../lib/jobParser');

/**
 * Robotic Property Photographer CLI
 * 
 * Usage:
 *   cat job.json | node bin/render.js
 *   node bin/render.js job.json --output photo.png
 *   node bin/render.js '{"centroid":...}' --output photo.png
 */

// Redirect all standard console logs to stderr
console.log = (...args) => process.stderr.write(args.join(' ') + '\n');
console.error = (...args) => process.stderr.write('[ERROR] ' + args.join(' ') + '\n');

async function main() {
    try {
        let jobRaw;
        const args = process.argv.slice(2);
        
        let outputPath = '-'; // Default is stdout

        // Parse --output flag
        const outputFlagIndex = args.indexOf('--output');
        if (outputFlagIndex !== -1 && args[outputFlagIndex + 1]) {
            outputPath = args[outputFlagIndex + 1];
            args.splice(outputFlagIndex, 2);
        }

        // Parse job input (JSON string, file path, or stdin)
        if (args.length > 0) {
            const input = args[0];
            if (input.trim().startsWith('{')) {
                jobRaw = JSON.parse(input);
            } else if (fs.existsSync(input)) {
                jobRaw = JSON.parse(fs.readFileSync(input, 'utf-8'));
            }
        }

        // If no job from args, try stdin
        if (!jobRaw && !process.stdin.isTTY) {
            const stdinData = fs.readFileSync(0, 'utf-8');
            if (stdinData && stdinData.trim()) {
                jobRaw = JSON.parse(stdinData);
            }
        }

        if (!jobRaw) {
            console.log("Usage:");
            console.log("  cat job.json | node bin/render.js");
            console.log("  node bin/render.js job.json --output photo.png");
            console.log("  node bin/render.js '{\"centroid\":...}' --output photo.png");
            process.exit(1);
        }

        const { writeOutput, getTimestampedPath } = require('../lib/outputWriter');
        const normalizedJob = normalizeJob(jobRaw);
        
        let finalPath = outputPath;
        if ((args.includes('--timestamp') || jobRaw.is_test) && finalPath !== '-') {
            finalPath = getTimestampedPath(finalPath);
        }

        console.log(`[CLI] Initializing renderer...`);

        const result = await renderPropertyPhoto(normalizedJob);
        
        for (const shot of result.shots) {
            let shotPath = finalPath;
            if (finalPath !== '-') {
                const ext = path.extname(finalPath);
                const base = finalPath.slice(0, -ext.length);
                shotPath = `${base}_${shot.id}${ext}`;
            }

            console.log(`[CLI] Writing shot: ${shot.id}`);
            await writeOutput(shot.pngBuffer, { 
                ...result.metadata, 
                shot: shot.id, 
                heading: shot.heading, 
                pitch: shot.pitch 
            }, shotPath);

            if (shotPath !== '-') {
                console.log(`[CLI] Successfully rendered shot to ${shotPath}`);
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err.stack || err.message);
        process.exit(1);
    }
}

main();
