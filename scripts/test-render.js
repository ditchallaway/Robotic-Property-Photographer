// Native fetch is available in Node 18+

const data = {
    customer_id: "TEST_USER",
    order_id: "VERIFY_fix_004",
    centroid: [-105.0, 40.0],
    centroid_elevation: 1600,
    geometry: {
        type: "Polygon",
        coordinates: [[
            [-105.001, 40.001],
            [-104.999, 40.001],
            [-104.999, 39.999],
            [-105.001, 39.999],
            [-105.001, 40.001]
        ]]
    }
};

fetch('http://localhost:3001/api/render', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
})
    .then(res => res.json())
    .then(json => console.log(JSON.stringify(json, null, 2)))
    .catch(err => console.error(err));
