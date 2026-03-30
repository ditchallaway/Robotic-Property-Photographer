# Robotic Property Photographer 🚀

A headless rendering microservice built on Node.js and CesiumJS, designed to generate deterministic 3D property imagery via API for n8n-driven workflows.

---

## 1. System Overview

**Goal:** Render consistent aerial property images with layered PSD output using CesiumJS.

**High-level flow:**
1. n8n sends JSON payload (centroid + elevation + GeoJSON + acreage).
2. Renderer fetches road geometry from OSM Overpass API (`way[highway]`).
3. Renderer boots Cesium in headless Chromium.
4. Standard map and boundary are rendered together for each shot.
5. One opaque screenshot is captured per shot.
6. Road names and acreage are added as editable text layers via `ag-psd`.
7. A single layered PSD is composed and written to disk.
8. Renderer returns asset paths and URLs to n8n.

**Notes:** Renderer is stateless and geometry-agnostic. It does not fetch data from external real estate APIs or parse user addresses.

**Role & Scope:**
* **Stateless Worker:** Handles rendering only. Does not handle long-term storage, job queuing, or notifications.
* **Orchestration:** Triggered exclusively via n8n.
* **Concurrency:** Only 1 job at a time to prevent WebGL memory crashes in Docker.

**Single-Pass Human-in-the-Loop PSD Compositing**
For each shot, the renderer captures a single base pass and composes a PSD with editable text layers for a human editor:
* **Background:** Raster - Satellite map + yellow boundary
* **Road: [name]:** Text - White, 48pt, one per road
* **Acreage:** Text - Yellow, 80pt, centered bottom

* Single-pass capture → background + boundary.
* Composed via `ag-psd`.
* `sharp` checks for >95% black screenshots.

---

## 2. API Contract

**POST /api/render**

**Config Requirements:**
* **Resolution:** 2048 x 1536 px (4:3 aspect ratio).
* **Source:** Google Photorealistic 3D Tiles (direct API key via `.env`, no Cesium ion).

**Input JSON:**
```json
{
  "customer_id": "uuid-user-string",
  "order_id": "uuid-order-string",
  "shots": ["nadir", "north", "east", "south", "west"],
  "centroid": [lon, lat],
  "centroid_elevation": meters,
  "ll_gisacre": 6.1944,
  "geometry": { "type": "Polygon", "coordinates": [...] }
}
```

**Assumptions:**
* WGS84, meters.
* Geometry already validated.
* Renderer does not compute terrain or centroid.

---

## 3. Renderer Pipeline

The renderer functions as a stateless worker.

**Renderer does:**
* Accept HTTP POST JSON.
* Initialize Cesium Viewer.
* Convert GeoJSON → Cesium entities.
* Apply material styling.
* Solve camera positions.
* Capture full-frame screenshot (PNG).
* Fetch road data from OSM Overpass (`way[highway]`).
* Compose PSD via `ag-psd`.
* Upload PSD to storage (Cloudflare R2 optional).
* Issue notifications via ntfy.sh (optional).

**Renderer does NOT:**
* Modify geometry.
* Sample terrain.
* Perform GIS validation.

---

## 4. Cesium Configuration

### Architecture Pillars 🏗️

**Pillar 1: Native Terrain & Auto-Framing**
* **Terrain Engine:** CesiumWorldTerrain enabled for realistic slopes and rural topography.
* **Auto-Framing:** `viewer.camera.flyToBoundingSphere(...)` with range `0.0` for "fit-to-frame" distance.
* **Logic:** Automatically adjusts for parcel sizes 1–1,000 acres.

**Pillar 2: Automated Shot List (Deterministic)**
* Shot headings aligned to True North: 0°, 90°, 180°, 270°.
* Pitch: -35° for oblique, -89.9° for nadir.
* Field of View: 100°

* `0°` = faces North
* `90°` = faces East
* `180°` = faces South
* `270°` = faces West

**Pillar 3: Boundary & Styling**
* GeoJSON support: Inject property lines.
* Clamped to ground: All Polylines/Polygons use `clampToGround: true`.

### Code Reference

**Cesium Initialization:**
```javascript
const viewer = new Cesium.Viewer('container', {
    scene3DOnly: true,
    useDefaultRenderLoop: false,
    timeline: false,
    animation: false,
    contextOptions: { webgl: { preserveDrawingBuffer: true } }
});

const terrainProvider = Cesium.CesiumWorldTerrain();
viewer.terrainProvider = terrainProvider;
```

**Boundary Rendering:**
```javascript
const cartesianPoints = Cesium.Cartesian3.fromDegreesArray([...coordinates]);

viewer.entities.add({
    polyline: {
        positions: cartesianPoints,
        width: 3,
        clampToGround: true,
        material: new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW)
    }
});
```

**Camera Framing:**
```javascript
const boundingSphere = Cesium.BoundingSphere.fromPoints(cartesianPoints);
viewer.camera.flyToBoundingSphere(boundingSphere, {
    offset: new Cesium.HeadingPitchRange(headingRadians, pitchRadians, 0)
});
```

**Render Loop & Capture:**
```javascript
await viewer.scene.globe.tilesLoaded;
viewer.scene.globe.maximumScreenSpaceError = 1.0;
// Puppeteer page.screenshot() captures the frame
```

---

## 5. Output Contract

**Output JSON (To n8n):**
```json
{
  "status": "success",
  "customer_id": "uuid-user-string",
  "order_id": "uuid-order-string",
  "shots": {
    "north": {
      "psd_path": "/app/test-results/north.psd",
      "psd_url": "https://r2.example.com/order_id/cust_id/north.psd",
      "photopea_url": "https://app.brokertricks.com#..."
    }
  },
  "static_map_url": "https://maps.googleapis.com/maps/api/staticmap?...",
  "roads": ["West Shingle Mill Road", "Shingle Mill Road"],
  "acreage": "6.19 ACRES"
}
```

**Save path:**
`/app/public/snapshots/{order_id}/{customer_id}/{view}.png`
Snapshots folder must be mounted: `./snapshots:/app/public/snapshots`

---

## 6. Local Development

**Check Map Tile Key:**
Verify `GOOGLE_API_KEY` in `.env`. 403 errors → IP restriction.

**Run inside Docker container (moonshot):**
```bash
# Test oblique cardinal view
docker compose exec moonshot node tests/cardinal.js

# Test nadir top-down view
docker compose exec moonshot node tests/nadir.js
```

### The "Director" (Renderer) Workflow 🤖

1. **Initialize:** Boot with `preserveDrawingBuffer: true`, 2048x1536 viewport.
2. **Ingest:** Load GeoJSON, create BoundingSphere, `clampToGround: true`.
3. **Position:** Loop headings 0, 90, 180, 270 at -35° pitch.
4. **Refine:** `viewer.scene.globe.maximumScreenSpaceError = 1.0`.
5. **Validate:** Wait until `tilesLoaded === true`.
6. **Capture:** `Puppeteer page.screenshot()`.
7. **Compose:** `ag-psd` with text layers.
8. **Return:** File paths, PSD URLs, Photopea links, static map preview.