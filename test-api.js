const http = require('http');
const fs = require('fs');

const postData = JSON.stringify({
    customer_id: "cust_98765",
    order_id: "order_12345",
    centroid: [-116.6662, 48.2647], // [lon, lat]
    centroid_elevation: 645,       // meters
    geometry: {
        type: "Polygon",
        coordinates: [[
            [-116.6680, 48.2660],
            [-116.6640, 48.2660],
            [-116.6640, 48.2630],
            [-116.6680, 48.2630],
            [-116.6680, 48.2660]
        ]]
    }
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/render',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log("🚀 Dispatching Mission to Moonshot Renderer...");

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log("✅ Response Received:");
        console.log(JSON.stringify(JSON.parse(data), null, 2));
    });
});

req.on('error', (e) => console.error(`❌ Request Failed: ${e.message}`));
req.write(postData);
req.end();