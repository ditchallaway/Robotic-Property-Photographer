# Example: curl to render a property photo

curl -X POST http://localhost:3001/render \
  -H "Content-Type: application/json" \
  -d '{
    "centroid": {
      "lon": -122.4194,
      "lat": 37.7749
    },
    "elevation": 150,
    "boundary": [
      [-122.4195, 37.7750],
      [-122.4193, 37.7750],
      [-122.4193, 37.7748],
      [-122.4195, 37.7748]
    ],
    "acreage": 1.25,
    "roadName": "Market Street",
    "shotList": [0, 90, 180, 270]
  }' | jq '.'

# Get health status
curl http://localhost:3001/health | jq '.'

# Get queue status
curl http://localhost:3001/queue/status | jq '.'
