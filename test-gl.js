// test-gl.js
// Purpose: Launch a headless Chromium instance via Puppeteer and inspect what WebGL
// renderer/vendor Chromium reports. This is useful for diagnosing whether WebGL is
// available and whether software rendering (SwiftShader) is being used.

import puppeteer from 'puppeteer';

(async () => {
    // Launch Chromium with flags that make it more likely to run in restricted / containerized
    // environments and to provide a predictable software-GL configuration.
    const browser = await puppeteer.launch({
        // Optional: allow overriding the Chromium/Chrome binary location (common in Docker/CI).
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,

        // Chromium command-line args:
        args: [
            // Disables the Chromium sandbox. Often required in Docker or certain CI environments,
            // but reduces security.
            '--no-sandbox',

            // Avoids using /dev/shm (shared memory) which can be tiny in containers and cause crashes.
            '--disable-dev-shm-usage',

            // Disables GPU hardware acceleration. This pushes Chromium toward software rendering.
            '--disable-gpu',

            // Enables SwiftShader even though it is considered "unsafe" (used for software GL).
            '--enable-unsafe-swiftshader',

            // Use ANGLE (Almost Native Graphics Layer Engine) to translate WebGL to a backend.
            '--use-gl=angle',

            // Force ANGLE to use the SwiftShader backend (software rasterizer).
            '--use-angle=swiftshader'
        ]
    });

    // Create a new blank tab/page to run our diagnostic JavaScript in.
    const page = await browser.newPage();

    // Execute code *inside the browser context* (not in Node.js) to query WebGL information.
    const info = await page.evaluate(() => {
        // Create a canvas so we can request a WebGL rendering context.
        const canvas = document.createElement('canvas');

        // Request a WebGL 1.0 context. (If you wanted WebGL2 you’d use 'webgl2'.)
        const gl = canvas.getContext('webgl');

        // If WebGL can't be created, report an error instead of throwing.
        if (!gl) return { error: 'WebGL not supported' };

        // This extension allows access to *unmasked* GPU vendor/renderer strings.
        // Without it, many browsers return generic values to reduce fingerprinting.
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return { error: 'WEBGL_debug_renderer_info not supported' };

        // Query the actual vendor/renderer values.
        // Examples might include SwiftShader, ANGLE, Mesa, NVIDIA, etc.
        return {
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        };
    });

    // Print the diagnostic result back in the Node.js process.
    console.log('WebGL Diagnostic:', info);

    // Always close the browser to avoid leaving Chromium processes running.
    await browser.close();
})();