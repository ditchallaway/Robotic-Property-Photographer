import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
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

    const renderer = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (!gl) return 'WebGL not supported';
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return 'WEBGL_debug_renderer_info not supported';
        return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    });

    console.log('WebGL Renderer:', renderer);
    await browser.close();
})();
