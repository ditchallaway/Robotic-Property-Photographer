# Robotic Property Photographer

Stateless headless renderer that converts parcel geometry into **exactly 5 deterministic PNG images**.

This repo is a rendering engine. Upstream orchestration (n8n), long-term storage, notifications, and job scheduling happen outside this codebase.

---

## Output (fixed)

For every render request the service returns **exactly 5 PNGs**:

| Shot | Camera heading |
|------|---------------|
| `north` | 0° |
| `east` | 90° |
| `south` | 180° |
| `west` | 270° |
| `nadir` | top-down |

Each PNG contains:
- base imagery (Cesium / Google Photorealistic 3D Tiles)
- **one overlay only:** the yellow property boundary from the input GeoJSON

No other overlays are produced.

---

## API

### `POST /api/render`

**Minimum input:**
```json
{
  "customer_id": "cust_123",
  "order_id": "order_456",
  "centroid": [-116.4869, 48.3322],
  "centroid_elevation": 655,
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[...]]]
  }
}
```

**Output shape:**
```json
{
  "status": "success",
  "customer_id": "cust_123",
  "order_id": "order_456",
  "shots": {
    "north": { "png_path": "/app/results/north.png", "png_url": "https://example.com/north.png" },
    "east":  { "png_path": "/app/results/east.png",  "png_url": "https://example.com/east.png"  },
    "south": { "png_path": "/app/results/south.png", "png_url": "https://example.com/south.png" },
    "west":  { "png_path": "/app/results/west.png",  "png_url": "https://example.com/west.png"  },
    "nadir": { "png_path": "/app/results/nadir.png", "png_url": "https://example.com/nadir.png" }
  }
}
```

The shot list is **not configurable**. The service always returns these 5.

---

## Non-negotiable constraints

- **Stateless worker** — no internal database, no durable queues, no mandatory external services.
- **Sequential rendering** — one render job at a time (WebGL/Chromium stability).
- **Deterministic camera** — fixed headings (True North aligned) for reproducible outputs.
- **Tiles-loaded wait** — capture only after `viewer.scene.globe.tilesLoaded === true` (stable across N ticks).
- **Black-frame detection** — reject renders where < 5% of pixels are non-black.

---

## Dev / run

```bash
# Start the service
docker compose up --build

# Fire a render
curl -X POST http://localhost:3000/api/render \
  -H "Content-Type: application/json" \
  -d @payload.json
```

---

## Implementation rules

See [`REQUIREMENTS.md`](./REQUIREMENTS.md) for rendering invariants and engineering constraints.