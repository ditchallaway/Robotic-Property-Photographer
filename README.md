# Robotic Property Photographer 🚀

A headless, stateless microservice for capturing layered PSD aerial property composite images using CesiumJS, Puppeteer, and ag-psd.

---

## **1. System Overview**

The "Headless Renderer" Pattern

This repository is a **stateless rendering engine**. It receives a JSON payload and returns local file paths to the generated assets.

### **Pipeline**

1. n8n sends JSON payload (centroid + elevation + GeoJSON + acreage)
2. Renderer fetches road geometry from OSM Overpass API (`way[highway]`)
3. Renderer boots Cesium in headless Chromium
4. For each shot, standard map and boundary are rendered together
5. One opaque screenshot is captured per shot
6. Road names and acreage are added as editable text layers via `ag-psd`
7. A single layered PSD is composed and written to disk
8. Renderer returns asset paths and URLs to n8n

Renderer is **stateless** and **geometry-agnostic**.
It does **not** fetch data from external real estate APIs or parse user addresses.

---

## **2. API Contract**

### **🔌 API Interface (POST /api/render)**

**Config Requirements:**

* **Resolution**: 2048 x 1536 px (4:3 aspect ratio).  
* **Source**: Google Photorealistic 3D Tiles (direct API key via `.env`, no Cesium ion)

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

* WGS84  
* meters  
* geometry already validated

Renderer performs **no** terrain sampling or centroid computation.

---

## **3. Renderer Pipeline**

The renderer functions as a stateless worker.  
Renderer does:

* Accept HTTP POST JSON  
* Initialize Cesium Viewer  
* Convert GeoJSON → Cesium entities  
* Apply material styling  
* Solve camera positions  
* Capture full-frame screenshot (PNG)  
* Fetch road data from OSM Overpass (`way[highway]`)
* Compose PSD via `ag-psd` with editable text layers
* Upload PSD to robust storage like Cloudflare R2 (Optional)
* Issue notification via ntfy.sh (Optional)

Renderer does **not**:

* Use Bull / Redis for queues (that belongs in n8n)
* Talk directly to Amazon S3 (unless via R2 wrapper)

---

## **4. Cesium Configuration**

### **Pillar 1: Camera Rules**

Based on empirical testing, relying on bounds or polygon extents to determine height is fragile. We standardize via a uniform multiplier against the `BoundingSphere` radius.

* `viewer.camera.flyToBoundingSphere(...)`  

**BoundingSphere Overrides:**

* We override the `center` of the BoundingSphere to exactly match the provided `centroid` payload coordinate, explicitly setting the height to `centroid_elevation`.

**Radius Multipliers:**

* `radius * 2.5` for oblique framing
* `radius * 2.0` for nadir framing

### **Pillar 2: Views (The "Shots")**

* `0°` = faces North  
* `90°` = faces East  
* `180°` = faces South  
* `270°` = faces West

* **North-facing view**: Heading `0°`, Pitch `-35°`  
* **East-facing view**: Heading `90°`, Pitch `-35°`  
* **South-facing view**: Heading `180°`, Pitch `-35°`  
* **West-facing view**: Heading `270°`, Pitch `-35°`  
* **Nadir View**: Heading `0°`, Pitch `-89.9°`

**FOV:** `100°`  
**Alignment:** All headings aligned to True North (`0, 90, 180, 270`)

### **Pillar 3: Boundary & Styling**

* **Rule**: All polyline entities receive `clampToGround: true`
* **Why**: Clamping ensures lines follow 3D terrain perfectly and prevents lines from "burying" into hills or "floating" over valleys.

**Single-Pass Human-in-the-Loop PSD Compositing**
For each shot, the renderer captures a single base pass and composes a PSD with editable text layers for a human editor:

| Layer | Type | Content |
|-------|------|---------|
| Background | Raster | Satellite map + yellow boundary (single pass) |
| Road: [name] | Text Layer | White, 48pt, one per road |
| Acreage | Text Layer | Yellow, 80pt, centered bottom |

* **Single-Pass Capture:** Map and boundary are rendered together into one opaque screenshot.
* **Composition:** `ag-psd` creates a `.psd` file containing the raster background overlaid with editable text layers.
* **Black-Frame Detection:** `sharp` warns if the background screenshot is >95% black (indicating failed tileset load).

---

## **5. Output Contract**

Returns local file paths (and URLs if configured) to keep n8n payloads lightweight.

```json
{
    "status": "success",
    "customer_id": "uuid-user-string",
    "order_id": "uuid-order-string",
    "shots": {
        "cardinal": {
            "psd_path": "/app/test-results/cardinal.psd",
            "psd_url": "https://r2.example.com/order_id/cust_id/cardinal.psd",
            "photopea_url": "https://app.brokertricks.com#..."
        }
    },
    "static_map_url": "https://maps.googleapis.com/maps/api/staticmap?...",
    "roads": ["West Shingle Mill Road", "Shingle Mill Road"],
    "acreage": "6.19 ACRES"
}
```

---

## **6. Local Development**

### **🤖 The "Director" (Renderer) Workflow**

Inside the Puppeteer environment, the sequence of operations for each job is highly linear to ensure stability.

1. **Setup**: Load 3D Tiles, draw polygon `Cesium.Cartesian3.fromDegreesArray(...)`  
2. **Style**: Restrict colors strictly to HEX `#FFFF00`, `viewer.entities.add({...})`  
3. **Position**: Loop through Headings (0, 90, 180, 270) at **-35° pitch**.  
4. **Refine**: Set `viewer.scene.globe.maximumScreenSpaceError = 1.0` to force maximum high-res detail.  
5. **Validate**: Wait until `viewer.scene.globe.tilesLoaded === true` before capture.  
6. **Capture**: Execute `Puppeteer page.screenshot()` and inspect for black frames using Sharp.

### **Testing Locally**

Assuming your container is named `moonshot` (default in `docker-compose.yml`), run:

```bash
# Test oblique cardinal view
docker compose exec moonshot node tests/cardinal.js

# Test nadir top-down view
docker compose exec moonshot node tests/nadir.js
```
