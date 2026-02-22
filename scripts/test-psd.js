import fs from 'fs';
import { readPsd } from 'ag-psd';

async function checkPsd(file) {
    console.log('Checking', file);
    const buffer = fs.readFileSync(file);
    const psd = readPsd(buffer);

    console.log('Size:', psd.width, 'x', psd.height);
    console.log('Layers:');
    for (const layer of psd.children) {
        let nonTransparent = 0;
        let solidBlack = 0;
        let solidMagenta = 0;

        if (layer.imageData && layer.imageData.data) {
            const data = layer.imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];

                if (a > 0) nonTransparent++;
                if (a > 0 && r < 5 && g < 5 && b < 5) solidBlack++;
                if (a > 0 && r > 250 && g < 5 && b > 250) solidMagenta++;
            }
            console.log(`  - ${layer.name}: ${nonTransparent} visible pixels (Black: ${solidBlack}, Magenta: ${solidMagenta})`);
        } else {
            console.log(`  - ${layer.name}: No image data!`);
        }
    }
}

const file = process.argv[2] || 'public/snapshots/order_12345/cust_12345/nadir.psd';
checkPsd(file).catch(console.error);
