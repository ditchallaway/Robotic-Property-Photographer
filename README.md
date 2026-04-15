# Robotic Property Photographer

Headless renderer that converts parcel boundary geometry into **5 PNG images** of the property — north, east, south, west, and overhead.

This repo is a rendering engine focused on one job: **automate the creation of 5 property-boundary images per request**.

Upstream orchestration (n8n), long-term storage, notifications, and job scheduling happen outside this codebase.

## Product north star

Our immediate goal is simple and explicit:

1. Given one property payload, render 5 usable PNGs (`north`, `east`, `south`, `west`, `nadir`) with the property boundary clearly visible.
2. Keep the system simple and reliable enough to run a few times per day.
3. Scale throughput only after the core 5-image workflow is consistently passing.

This means we prioritize **working output and operational simplicity** over premature infrastructure complexity.

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
- **Fixed camera headings** — True North aligned (0°, 90°, 180°, 270°) for consistent framing.
- **Tiles-loaded wait** — capture only after `viewer.scene.globe.tilesLoaded === true` (stable across N ticks).
- **Black-frame detection** — reject renders where < 5% of pixels are non-black.

---

## Performance & Timeouts

- **Render Time**: Expect 1-3 minutes per job. High-fidelity 3D rendering in a headless environment is computationally intensive.
- **Intentional Timeout**: `RENDER_TIMEOUT_MS` defaults to **1,200,000ms (20 minutes)**. This is unconventional but necessary to ensure consistent tile loading across high-latency network conditions and software-rendering environments.
- **Visibility**: Use the `--progress-file` flag or the `/queue/status` endpoint to monitor real-time progress.
- **Fast Mode**: The `--fast` flag skips the SSE=4 intermediate step (`16→1` instead of `16→4→1`), reducing render time while still loading coarse tiles first to avoid flooding SwiftShader.

---

## Dev / run

```bash
# Build and run in Docker
docker compose up --build

# Run a render job
docker compose run renderer node bin/render.js < job.json --output /app/output/photo.png

# Run tests
docker compose run renderer node test_cesium.js
docker compose run renderer node test-cli.cjs
```

## Prevent hung renders (without waiting forever)

The renderer now has **two timeout layers**:

- `RENDER_TIMEOUT_MS` (default `600000`) is a hard timeout for the full job.
- `SHOT_TILE_TIMEOUT_MS` (default `120000`) is a per-shot timeout for tile loading.

This means a single stuck camera angle fails quickly instead of hanging for the full 10-minute job timeout.

### Recommended production settings

```bash
RENDER_TIMEOUT_MS=420000
SHOT_TILE_TIMEOUT_MS=90000
TILE_CHECK_INTERVAL_MS=300
TILE_STABLE_TICKS_REQUIRED=3
COARSE_SSE=128
FINAL_SSE=1.0
```

- `COARSE_SSE` speeds up initial loading while the camera settles.
- `FINAL_SSE=1.0` preserves output quality before capture.

## Speed tuning tips

1. Keep rendering strictly sequential (already enforced in queue) to avoid WebGL memory contention.
2. Use coarse-to-final SSE (implemented by default) instead of forcing max detail for the full wait.
3. If your area has very dense 3D tiles, reduce `SHOT_TILE_TIMEOUT_MS` and retry upstream with backoff.
4. Make sure host has enough CPU/RAM; software WebGL (`swiftshader`) is CPU-heavy.

## Running `docker compose` tests in cloud

Yes. The test stack works in cloud environments that support Docker Engine + Compose (for example: GitHub Actions runners, AWS EC2, GCP Compute Engine, Azure VM, Fly machines with Docker, etc.).

Typical CI command:

```bash
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from n8n-simulator
```

Then inspect artifacts in `./test-results/current/` (or publish that folder as CI artifacts).

---

## Implementation rules

See [`REQUIREMENTS.md`](./REQUIREMENTS.md) for rendering invariants and engineering constraints.
