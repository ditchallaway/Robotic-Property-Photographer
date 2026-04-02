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

## CLI Usage

The renderer is a Node.js CLI tool — no HTTP server.

**Input:** A JSON job spec provided via file path, inline argument, or stdin.

```json
{
  "centroid": [-116.4869, 48.3322],
  "centroid_elevation": 655,
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[-116.486, 48.331], ...]]
  }
}
```

**Invocation:**

```bash
# From a file
node bin/render.js job.json --output output/photo.png

# Piped via stdin
cat job.json | node bin/render.js --output output/photo.png

# Inline JSON
node bin/render.js '{"centroid":{"lon":-116.48,"lat":48.33},"boundary":[[...]]}' --output output/photo.png

# In Docker
docker compose run renderer node bin/render.js < job.json > output/photo.png
```

**Output:** PNG written to the path specified by `--output`, or to stdout if omitted. A `.json` metadata sidecar is written alongside the PNG.

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
# Build and run in Docker
docker compose up --build

# Run a render job
docker compose run renderer node bin/render.js < job.json --output /app/output/photo.png

# Run tests
docker compose run renderer node test-gl.js
docker compose run renderer node test-api.cjs
```

---

## Implementation rules

See [`REQUIREMENTS.md`](./REQUIREMENTS.md) for rendering invariants and engineering constraints.