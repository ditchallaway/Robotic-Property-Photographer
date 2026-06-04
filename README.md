# Robotic Property Photographer

Headless renderer that converts parcel boundary geometry into PNG images of the property. By default it renders **5 PNG images** — north, east, south, west, and overhead — and can also produce tiered subsets for overhead-only deliveries.

This repo is a rendering engine focused on one job: **automate the creation of tiered property-boundary image sets per request**. 

Now transitioned to an **API-first architecture**, it provides a stateless microservice for high-fidelity property imagery.

## Product North Star

1. Given one property payload, render 5 usable PNGs (`north`, `east`, `south`, `west`, `nadir`) with the property boundary clearly visible.
2. Keep the system simple and reliable enough to run sequentially.
3. Scale throughput only after the core 5-image workflow is consistently passing.

---

## Output

Default mode returns **5 PNGs**:

| Shot | Camera Heading | Pitch |
|------|---------------|-------|
| `north` | 0° (True North) | -24° (Oblique) |
| `east` | 90° | -24° (Oblique) |
| `south` | 180° | -24° (Oblique) |
| `west` | 270° | -24° (Oblique) |
| `overhead` | Top-down | -90° (Overhead) |

When `SNAPSHOT_MODE=overhead_only`, only the overhead image is generated. When `SNAPSHOT_MODE=overhead_north`, the overhead and north images are generated.

Each PNG contains:
- Base imagery (Cesium / Google Photorealistic 3D Tiles)
- **One overlay:** The yellow property boundary from the input GeoJSON.

---

## API Usage

The renderer runs as an Express API server (default port `9876`).

### Main Endpoint: `POST /render`
**Request Body:**
```json
{
  "centroid": { "lon": -116.4869, "lat": 48.3322 },
  "boundary": [[-116.486, 48.331], ...],
  "customer_id": "cust_123",
  "order_id": "ord_456"
}
```

**Response:**
Returns a JSON object containing the 5 shots as base64-encoded PNG strings.

---

## CLI Usage (Legacy/Dev)

**Invocation:**
```bash
# From a file
node bin/render.js job.json --output output/photo.png

# In Docker
docker compose run renderer node bin/render.js < job.json > output/photo.png
```

---

## Technical Constraints & Safety Guardrails

- **Stateless Worker**: No internal database; each request is independent.
- **Sequential Rendering**: Only one job renders at a time to prevent WebGL memory starvation.
- **Deterministic Headings**: Shot headings are locked to True North for consistency.
- **Tiles-Loaded Validation**: Capture only after `viewer.scene.globe.tilesLoaded === true` (stable for 3 ticks).
- **Black-Frame Detection**: Automatic rejection if sharp analysis confirms non-black pixel density is < 5%.
- **Buffer Preservation**: `preserveDrawingBuffer: true` is required to prevent blank captures in Puppeteer.

---

## Lessons Learned (The "Hard Way")

| Failure Point | Solution |
| :--- | :--- |
| **Blank PNGs** | Set `preserveDrawingBuffer: true` in WebGL context. |
| **Low-Detail Tiles** | Poll `tilesLoaded === true` for 3 consecutive stable ticks. |
| **403 Forbidden** | Rigorously `trim()` API keys from environment variables. |
| **Silent Crashes** | Implement `sharp`-based black-pixel detection (>95% threshold). |
| **Zombie PIDs** | Use `tini` as the `ENTRYPOINT` for signal handling. |

---

## Dev / Run

```bash
# Build and run API server in Docker
docker compose up --build

# Run tests
docker compose run renderer npm test
```

## Recommended Production Settings
```bash
RENDER_TIMEOUT_MS=1200000
SHOT_TILE_TIMEOUT_MS=120000
TILE_STABLE_TICKS_REQUIRED=3
FINAL_SSE=1.0
```

---

## Implementation Rules
See [`REQUIREMENTS.md`](./REQUIREMENTS.md) and [`.agents/rules`](./.agents/rules) for rendering invariants and engineering constraints.
