# Robotic Property Photographer — Project Roadmap

> A living document. Updated as phases complete and new intent is defined.
>
> **Architecture constraint:** This service is a stateless rendering engine. It receives a JSON payload and returns image assets. Long-term storage, job queuing, and notifications are handled by upstream n8n.

---

## ✅ Phase 1 — Rendering Foundation
- [x] Next.js app scaffolded in Docker (`moonshot` container)
- [x] **High-Performance Standalone Renderer**: Bypassed React hydration for Puppeteer using `public/render.html`.
- [x] CesiumJS integrated with headless Chromium via Puppeteer
- [x] Viewer initialized with `preserveDrawingBuffer: true`
- [x] Viewport locked at **2048 × 1536 px**
- [x] Sequential render queue (1 job at a time) — prevents WebGL OOM crashes
- [x] **Mission Fail-Fast**: Added explicit `MISSION_ERROR` signaling to prevent hangs.
- [x] `/api/render` POST endpoint accepting `{ lat, lon, geojson, style }` payload

---

## ✅ Phase 2 — Camera System

*Deterministic, True North-aligned shot list.*

- [x] **FOV:** 100°
- [x] **Oblique pitch:** −24°
- [x] **Nadir pitch:** −90°
- [x] **Cardinal headings:** 0° / 90° / 180° / 270° (True North aligned)
- [x] Auto-framing via `viewer.camera.flyToBoundingSphere()` — works for 1-acre to 1,000-acre parcels
- [x] BoundingSphere center overridden with centroid for accurate framing
- [x] `boundingSphere.radius * 2.0` range scale for consistent subject size

---

## ✅ Phase 3 — Boundary Rendering

*GeoJSON polygon → Cesium polyline, clamped to terrain.*

- [x] GeoJSON `Polygon` → `Cesium.Cartesian3` conversion
- [x] `clampToGround: true` on all polylines/polygons
- [x] Exterior ring + interior rings (holes) supported
- [x] Yellow polyline styling (`Cesium.Color.YELLOW`, width 3px)
- [x] Polygon fill intentionally omitted (overlay-only design)

---

## ✅ Phase 4 — Multi-Pass PSD Compositing

*4-pass capture per shot → layered PSD + preview PNG.*

| Pass | Background | Content | Output |
|------|-----------|---------|--------|
| Map | Satellite tiles | None | Opaque base layer |
| Boundary | Chroma magenta `#FF00FF` | Yellow polyline | Transparent overlay |
| Street Labels | Chroma magenta | `LabelCollection` text | Transparent overlay |
| Acreage | Chroma magenta | Turf.js-positioned text | Transparent overlay |

- [x] Magenta chroma-key tile via `SingleTileImageryProvider` (1×1 px tile)
- [x] Sky, sun, moon, atmosphere hidden during overlay passes
- [x] `sharp` removes magenta background post-capture (configurable tolerance)
- [x] `ag-psd` composes named transparent layers into a `.psd` file
- [x] Per-shot output: `layers/{shot}_{pass}.png` (transparent layers) + `{shot}.psd` (composited layered file)
- [x] Test output path: `tmp/test/{shot_name}/`
- [x] Production output path: `tmp/snapshots/{order_id}/{customer_id}/{shot_name}/`
- [x] API response: JSON object with metadata + file paths (n8n-parseable)

---

## ✅ Phase 5 — Street Label Rendering

*OSM Overpass road data → geo-projected canvas text labels.*

- [x] Road geometry fetched server-side from OSM Overpass API (`way[highway]` only)
- [x] `relation[type=route]` explicitly excluded
- [x] Label text sourced strictly from `name → ref → alt_name` tags (missing name = excluded)
- [x] Labels do NOT merge or infer names across multiple ways
- [x] Road segments projected to pixel coordinates via `Cesium.SceneTransforms.wgs84ToWindowCoordinates`
- [x] Terrain elevation sampled for accurate 3D → 2D projection
- [x] Visible road filtering (frustum culling + viewport bounds check)
- [x] Labels rendered upright (rotation = 0) in both cardinal and nadir views
- [x] Overlay independence: street label pass does not affect base map render

---

## ✅ Phase 6 — Test Suite Infrastructure

*Isolated, per-capability test scripts executed inside the Docker container.*

### Test Architecture

```
tests/
  cardinal-base.js     → Cardinal base image only
  cardinal-boundary.js → Cardinal boundary (with hole polygon)
  cardinal-acreage.js  → Cardinal acreage label
  cardinal-labels.js   → Cardinal street labels
  nadir-base.js        → Nadir base image only
  nadir-boundary.js    → Nadir boundary (with hole polygon)
  nadir-acreage.js     → Nadir acreage label
  nadir-labels.js      → Nadir street labels
```

### Cardinal Tests — ✅ Complete

A single cardinal test generates an oblique shot containing all layers.

- `cardinal_map` — satellite imagery, no overlays
- `cardinal_boundary` — yellow polyline, oblique foreshortening, hole visible
- `cardinal_labels` — upright white street text, transparent bg
- `cardinal_acreage` — upright yellow text, transparent bg

> **Expected output:** 1 PSD nested at `tmp/test/cardinal/cardinal.psd` and 4 PNGs in `layers/`.

### Nadir Tests — ✅ Complete

A single nadir test generates a top-down shot containing all layers.

- `nadir_map` — satellite base image, top-down -90° pitch
- `nadir_boundary` — yellow polyline, hole polygon support verified
- `nadir_labels` — street labels, painted street-aligned projection
- `nadir_acreage` — acreage label, Turf.js centroid anchor

> **Expected output:** 1 PSD nested at `tmp/test/nadir/nadir.psd` and 4 PNGs in `layers/`.

### Local Test Runner

```bash
# Inside container
docker compose exec moonshot node tests/cardinal.js
docker compose exec moonshot node tests/nadir.js
```

---

## ✅ Phase 7 — Local Tooling

*Quality-of-life improvements for local development.*

- [x] `viewer.html` — checkerboard PNG gallery in `tmp/test/`
  - Opens directly in browser (no server needed — `file://` protocol)
  - Shows all test suite PNGs grouped by suite + direction
  - Stats bar: cardinal count / nadir count / active suites
  - Lightbox with keyboard navigation (← → Esc)
  - PSD download chip on each card
  - Graceful empty states with run commands for unrendered suites

---

## 🔜 Phase 8 — Cloudflare R2 Artifact Storage

*Persistent, remotely accessible storage for PSD and PNG test artifacts.*

> **Scope note:** Storage is handled upstream. R2 is being added specifically to enable
> browser-accessible PSD inspection via Photopea — not as production delivery storage.
> n8n will continue to orchestrate the upload step.

- [ ] Provision Cloudflare R2 bucket (e.g. `rpp-test-artifacts`)
- [ ] Configure public access (or signed URL generation) on the bucket
- [ ] Define upload path convention: `{order_id}/{customer_id}/{view}.{psd|png}`
- [ ] Add optional n8n upload step post-render (outside this repo's scope)
- [ ] Or: lightweight upload script callable from the container for dev testing

---

## 🔜 Phase 9 — Photopea Deep-Link Integration

*One-click PSD inspection in the browser — no Photoshop license needed.*

Photopea supports a URL parameter that accepts a publicly accessible PSD URL
and opens it directly in the browser editor.

### URL Format

```
https://www.photopea.com#pa=<url-encoded-json>
```

Where the JSON payload is:
```json
{ "files": ["https://r2.your-bucket.com/order_id/cust_id/north.psd"] }
```

### Planned Changes

- [ ] Update `viewer.html` to generate a Photopea link per PSD card
  - Each card gets an "Open in Photopea" button alongside the PSD download chip
  - Button only renders when a public R2 URL is configured
- [ ] Add `R2_PUBLIC_BASE_URL` env variable convention
- [ ] Update test scripts to log Photopea links after successful render
- [ ] Consider: `psd-links.html` auto-generated per test run (a run manifest)

---

## 🔜 Phase 10 — n8n Pipeline Integration

*Connect the rendering engine to the upstream n8n orchestrator for production use.*

- [ ] Define n8n webhook trigger → `/api/render` call sequence
- [ ] n8n node: parse JSON response, extract PSD/PNG paths
- [ ] n8n node: upload artifacts to R2 (or permanent GCS/S3)
- [ ] n8n node: generate Photopea links from R2 URLs
- [ ] n8n node: send delivery notification (email/Slack) with links
- [ ] End-to-end test: real property parcel → rendered PSD → Photopea link in notification

---

## 🔜 Phase 11 — Production Hardening

*Reliability and observability improvements before go-live.*

- [ ] Structured JSON logging per render job (request in / response out / errors)
- [ ] Render timeout: kill job and return `{ status: "timeout" }` after N seconds
- [ ] Input validation: reject malformed GeoJSON before invoking renderer
- [ ] Health check endpoint (`/api/health`) for Docker + n8n polling
- [ ] Graceful Puppeteer teardown on container SIGTERM
- [ ] README: update test commands to match current test file names

---

## Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Rendering engine | CesiumJS (headless, via Puppeteer) |
| Web framework | Next.js |
| Container | Docker / Docker Compose |
| 3D tiles | Google Photorealistic 3D Tiles |
| Terrain | CesiumWorldTerrain |
| Road data | OSM Overpass API (`way[highway]`) |
| Geo utilities | Turf.js (acreage centroid) |
| PSD compositing | ag-psd |
| Image processing | sharp (chroma-key removal) |
| Orchestration | n8n (upstream, not in this repo) |
| Artifact storage | Cloudflare R2 *(planned — Phase 8)* |
| PSD review | Photopea deep-links *(planned — Phase 9)* |
