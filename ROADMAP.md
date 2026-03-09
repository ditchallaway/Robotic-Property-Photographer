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

## ✅ Phase 4 — Single-Pass PSD Compositing (v2 — Human-in-the-Loop)

*Simplified: 1 screenshot per shot → PSD with editable text layers.*

| Layer | Type | Content |
|-------|------|--------|
| Background | Raster | Satellite map + yellow boundary (single pass) |
| Road: [name] | Editable text | White, 48pt, one per road |
| [acreage] | Editable text | Yellow, 80pt, centered bottom |

- [x] Single opaque screenshot per shot (map + boundary together)
- [x] `ag-psd` creates PSD with raster background + editable text layers
- [x] Text layers use `invalidateTextLayers: true` for Photopea/Photoshop compatibility
- [x] Black-frame detection: warns when tiles fail to load (< 5% non-black pixels)
- [x] Test output: `test-results/{shot}.psd` + `test-results/{shot}_layers/{shot}_background.png`
- [x] Production output: `tmp/snapshots/{order_id}/{customer_id}/{shot_name}/`
- [x] API response: JSON with `shots`, `static_map_url`, `roads`, `acreage`

---

## ✅ Phase 5 — Street Label Data (v2 — Text Layers)

*OSM Overpass road data → editable PSD text layers (no longer rendered by CesiumJS).*

- [x] Road geometry fetched server-side from OSM Overpass API (`way[highway]` only)
- [x] `relation[type=route]` explicitly excluded
- [x] Label text sourced strictly from `name → ref → alt_name` tags (missing name = excluded)
- [x] Labels do NOT merge or infer names across multiple ways
- [x] Road names added as editable text layers in PSD (white, 48pt)
- [x] Acreage added as editable text layer (yellow, 80pt)
- [x] Google Static Map URL generated for road label reference

---

## ✅ Phase 6 — Test Suite Infrastructure (v2)

*Simplified test scripts matching the single-pass human-in-the-loop workflow.*

### Test Scripts

```
tests/
  cardinal.js   → Oblique shot (heading 0°, pitch -24°)
  nadir.js      → Top-down shot (heading 0°, pitch -89.9°)
```

### What Each Test Validates

- ✅ API returns `shots.{name}.psd_path`
- ✅ API returns `static_map_url`
- ✅ API returns `roads` array
- ✅ API returns `acreage` string
- ✅ Black-frame detection logs in server output
- ✅ PSD file is generated at returned path

> **Expected output:** `test-results/{shot}.psd` + `test-results/{shot}_layers/{shot}_background.png`

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

## ✅ Phase 8 — Cloudflare R2 Artifact Storage

*Optional, env-gated upload to S3-compatible storage.*

- [x] `lib/r2Upload.js` — S3-compatible upload using `@aws-sdk/client-s3`
- [x] Graceful no-op when `R2_ENDPOINT` / `R2_ACCESS_KEY_ID` / `R2_SECRET_KEY` / `R2_BUCKET` not configured
- [x] Upload path: `{order_id}/{customer_id}/{shot_name}.psd`
- [x] Returns public URL when `R2_PUBLIC_URL` is set
- [ ] Provision actual R2 bucket and configure credentials

---

## ✅ Phase 9 — Photopea + ntfy.sh Integration

*Human-in-the-loop notification and editing workflow.*

- [x] `lib/photopea.js` — Generates deep-link URLs to self-hosted Photopea (`app.brokertricks.com`)
- [x] Opens PSD + Google Static Map reference in a single Photopea session
- [x] `lib/notify.js` — Push notifications via free ntfy.sh
- [x] Notification includes shot count, road names, acreage, and click-to-open Photopea link
- [x] Both services gracefully no-op when env vars are missing
- [x] Configure `NTFY_TOPIC` for production notifications

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
- [x] README: update test commands to match current test file names

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
| PSD compositing | ag-psd (raster + text layers) |
| Image processing | sharp (black-frame detection) |
| Artifact storage | Cloudflare R2 (optional, env-gated) |
| PSD review | Photopea (self-hosted at `app.brokertricks.com`) |
| Notifications | ntfy.sh (free hosted) |
| Orchestration | n8n (upstream, not in this repo) |
