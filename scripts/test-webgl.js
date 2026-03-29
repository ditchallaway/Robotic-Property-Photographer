import puppeteer from 'puppeteer';

async function test(glArg, angleArg) {
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--ignore-gpu-blocklist'
    ];
    if (glArg) args.push(glArg);
    if (angleArg) args.push(angleArg);

    console.log(`Testing args: ${glArg || 'default'}, ${angleArg || 'default'}`);

    try {
        const browser = await puppeteer.launch({ args });
        const page = await browser.newPage();
        const webglInfo = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (!gl) return { error: 'No WebGL context' };
            const ext = gl.getExtension('WEBGL_debug_renderer_info');
            return {
                vendor: gl.getParameter(gl.VENDOR),
                renderer: gl.getParameter(gl.RENDERER),
                unmaskedVendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : 'unknown',
                unmaskedRenderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown',
                version: gl.getParameter(gl.VERSION)
            };
        });
        console.log('Result:', webglInfo);
        await browser.close();
    } catch (e) {
        console.error('Crash:', e.message);
    }
}

async function runAll() {
    await test('--use-gl=angle');
    await test('--use-gl=swiftshader');
    await test('--use-gl=angle', '--use-angle=swiftshader');
    await test('--use-gl=egl');
}

runAll();
