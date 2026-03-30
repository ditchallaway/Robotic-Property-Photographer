import puppeteer from 'puppeteer-core';

(async () => {
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--enable-unsafe-swiftshader',
            '--use-gl=angle',
            '--use-angle=swiftshader'
        ]
    });

    const page = await browser.newPage();

    const info = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (!gl) return { error: 'WebGL not supported' };
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return { error: 'WEBGL_debug_renderer_info not supported' };
        return {
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        };
    });

    console.log('WebGL Diagnostic:', info);
    await browser.close();
})();
