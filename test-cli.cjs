/**
 * CLI Test Script
 * 
 * Usage:
 *   node test-cli.js
 * 
 * This script demonstrates how to call the renderer CLI and verify the 5-shot output.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const job = {
    customer_id: "cust_98765",
    order_id: "order_12345",
    centroid: [-116.6662, 48.2647], // [lon, lat]
    elevation: 645,                // meters
    boundary: [
        [-116.6680, 48.2660],
        [-116.6640, 48.2660],
        [-116.6640, 48.2630],
        [-116.6680, 48.2630],
        [-116.6680, 48.2660]
    ],
    acreage: "5.00 ACRES"
};

const jobFile = path.join(__dirname, 'tmp_job.json');
const outputBase = path.join(__dirname, 'output', 'test_render.png');

fs.writeFileSync(jobFile, JSON.stringify(job, null, 2));

console.log("🚀 Launching CLI Render Mission...");
console.log(`Input: ${jobFile}`);
console.log(`Output Base: ${outputBase}`);

try {
    // Run the CLI
    const cmd = `node bin/render.js ${jobFile} --output ${outputBase} --timestamp`;
    console.log(`Executing: ${cmd}`);
    
    // We expect some stderr logs from the renderer
    const output = execSync(cmd, { stdio: 'inherit' });

    console.log("\n✅ CLI Execution Finished.");
    console.log("Checking for output files...");

    // Shot IDs we expect
    const shots = ['north', 'east', 'south', 'west', 'overhead'];
    
    const files = fs.readdirSync(path.join(__dirname, 'output'));
    const matches = files.filter(f => f.startsWith('test_render') && f.endsWith('.png'));

    console.log(`Found ${matches.length} matching PNG files in output/`);
    
    if (matches.length >= 5) {
        console.log("✨ Success! All 5 deterministic shots were (likely) generated.");
    } else {
        console.log("⚠️ Warning: Expected at least 5 shots, but found fewer.");
    }

} catch (err) {
    console.error("❌ CLI Test Failed:");
    console.error(err.message);
} finally {
    // Cleanup
    if (fs.existsSync(jobFile)) fs.unlinkSync(jobFile);
}
