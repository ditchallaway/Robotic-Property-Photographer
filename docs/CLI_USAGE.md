# Rendering API

## Usage

### Via stdin:
```bash
cat job.json | node bin/render.js
```

### Via file argument:
```bash
node bin/render.js ./job.json --output ./output/photo.png
```

### Via Docker:
```bash
docker run --rm \
  -e CESIUM_ION_TOKEN=$TOKEN \
  -e GOOGLE_API_KEY=$KEY \
  -v $(pwd)/output:/app/output \
  renderer:latest \
  node bin/render.js ./job.json --output /app/output/photo.png
```

## Job Schema
```json
{
  "centroid": { "lon": -120.5, "lat": 45.5 },
  "elevation": 850,
  "boundary": [[lon1, lat1], [lon2, lat2], ...],
  "acreage": "5.00 ACRES",
  "shotList": [...]
}
```
