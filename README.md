# **Robotic Property Photographer \- Drone Scale Engine**

A headless rendering microservice built on Next.js and CesiumJS, designed to generate consistent, professional 3D property imagery via API for n8n-driven workflows.

## **1\. System Overview**

**Goal:** Render deterministic aerial property images with layered PSD output using CesiumJS.

**High-level flow**

1. n8n sends JSON payload (centroid + elevation + GeoJSON + acreage)
2. Renderer fetches road geometry from OSM Overpass API (`way[highway]`)
3. Renderer boots Cesium in headless Chromium
4. For each shot, standard map and boundary are rendered together
5. One opaque screenshot is captured per shot
6. Road names and acreage are added as editable text layers via `ag-psd`
7. A single layered PSD is composed and written to disk
8. Renderer returns PSD paths and Photopea deep-links to n8n
9. Renderer returns asset references to n8n

Renderer is **stateless** and **geometry-agnostic**.

## **ðŸš€ Role & Scope**

**Stateless Worker:** This service is a rendering engine. It does NOT handle long-term storage, job queuing, or notifications. It receives a coordinate/geometry and returns images.

**Orchestration:** Designed to be triggered by n8n.

**Concurrency:** Render exactly 1 job at a time to prevent WebGL memory crashes in Docker.

## **ðŸ—ï¸ Architecture Pillars**

### **Pillar 1: Native Terrain & Auto-Framing**

Professional Drone-Scale perspectives using Cesium-native methods for 2026 standards:

* **Terrain Engine**: Enable CesiumWorldTerrain to accurately render rural topography and slopes. CesiumWorldTerrain remains enabled even when using Photorealistic 3D Tiles to ensure correct ground clamping for boundary lines.  
* **Auto-Framing**: Use viewer.camera.flyToBoundingSphere() with a range of **0.0**.  
* **Logic**: This automatically calculates the "fit-to-frame" distance for any parcel size, from 1-acre lots to 1,000-acre ranches.

### **Pillar 2: Automated Shot List (Deterministic)**

Deterministic camera sequence triggered via `/api/render`.

**Heading values represent camera heading (direction the camera faces), per CesiumJS.**

* `0Â°` \= faces North  
* `90Â°` \= faces East  
* `180Â°` \= faces South

* #### `270Â°` \= faces West   **Oblique Views**

* **North-facing view**: Heading `0Â°`, Pitch `-35Â°`  
* **East-facing view**: Heading `90Â°`, Pitch `-35Â°`  
* **South-facing view**: Heading `180Â°`, Pitch `-35Â°`  
* **West-facing view**: Heading `270Â°`, Pitch `-35Â°`  
* **Nadir View**: Heading `0Â°`, Pitch `-89.9Â°`

**FOV:** `100Â°`  
**Alignment:** All headings aligned to True North (`0, 90, 180, 270`)

### **Pillar 3: Boundary & Styling**

* **GeoJSON Support**: Supports injection for property lines.  
* **Clamped to Ground**: MUST use clampToGround: true for all Polyline/Polygon entities.  
* **Why**: Clamping ensures lines follow 3D terrain perfectly and prevents lines from "burying" into hills or "floating" over valleys.


**Pillar 4: Single-Pass Human-in-the-Loop PSD Compositing**
For each shot, the renderer captures a single base pass and composes a PSD with editable text layers for a human editor:

| Layer | Type | Content |
|-------|------|---------|
| Background | Raster | Satellite map + yellow boundary (single pass) |
| Road: [name] | Text Layer | White, 48pt, one per road |
| Acreage | Text Layer | Yellow, 80pt, centered bottom |

* **Single-Pass Capture:** Map and boundary are rendered together into one opaque screenshot.
* **Composition:** `ag-psd` creates a `.psd` file containing the raster background overlaid with editable text layers.
* **Black-Frame Detection:** `sharp` warns if the background screenshot is >95% black (indicating failed tileset load).

## **🔌 API Interface (POST /api/render)**

**Config Requirements:**

* **Resolution**: 2048 x 1536 px (4:3 aspect ratio).  
* **Source**: Google API Direct (via .env) with no Cesium ion middleman.

**Input JSON:**



```json
{
  "customer_id": "uuid-user-string",
  "order_id": "uuid-order-string",
  "shots": ["nadir", "cardinal", "east", "south", "west"],
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

## **3\. Renderer Responsibilities**

The renderer functions as a stateless worker.  
Renderer does:

* Accept HTTP POST JSON  
* Initialize Cesium Viewer  
* Convert GeoJSON â†’ Cesium entities  
* Apply material styling  
* Solve camera positions  
* Capture full-frame screenshot (PNG)  
* Fetch road data from OSM Overpass (`way[highway]`)
* Compose PSD via `ag-psd` with editable text layers
* Upload PSD to robust storage like Cloudflare R2 (Optional)
* Issue notification via ntfy.sh (Optional)

Renderer does **not**:

* Modify geometry  
* Sample terrain  
* Perform GIS validation

## **4\. Cesium Initialization**

* CesiumJS (latest stable)  
* `Viewer` with:  
  * `scene3DOnly: true`  
  * `useDefaultRenderLoop: false`  
  * `timeline: false`  
  * `animation: false`  
  * `contextOptions: { webgl: { preserveDrawingBuffer: true } }`

Terrain:

* `CesiumWorldTerrain` (enabled)

Tileset:

* Google Photorealistic 3D Tiles (direct API key via `.env`, no Cesium ion)\`

---

## **5\. Boundary Rendering**

### **5.1 Geometry Conversion**

* Extract outer ring only  
* **Do not set heights manually**  
* Geometry must be clamped to terrain

| Cesium.Cartesian3.fromDegreesArrayHeights(...) |


### **5.2 Entity Creation**

| viewer.entities.add({  polyline: {    positions: cartesianPoints,    width: 3,    clampToGround: true,    material: new Cesium.ColorMaterialProperty(      Cesium.Color.YELLOW    )  }}); |


(Polygon fill intentionally omitted in beta.)

## **6\. Camera Framing Logic**

* BoundingSphere derived from boundary points  
* Center overridden with centroid

| Cesium.BoundingSphere.fromPoints() |


Camera positioning uses Cesium-native framing:

| viewer.camera.flyToBoundingSphere(boundingSphere, {  offset: new Cesium.HeadingPitchRange(    headingRadians,    pitchRadians,    0 *// auto range*  )}); |


Views:

* 4 oblique cardinal views (0, 90, 180, 270\)  
* 1 nadir view (pitch \= \-90)

No manual distance math.

## 

## ---

## 

## **7\. Render Loop & Capture**

#### Manual render loop

* Wait until

| \`viewer.scene.globe.tilesLoaded \=== true |


* Force max detail:

| viewer.scene.globe.maximumScreenSpaceError \= 1.0; |


* Then capture via:

|  canvas.toDataURL("image/png") |


* To the following path

| /app/public/snapshots/{order\_id}/{customer\_id}/{view}.png |


ðŸ‘†Above snapshots folder is a mounted volume  \- ./snapshots:/app/public/snapshots  
---


## **8\. Notification & URL Generation**
* The REST response emits PSD file paths.
* A deep link to Photopea (`https://app.brokertricks.com`) is generated to open the PSD.
* A static image preview of the map and roads is also compiled and returned via Google Static Maps URL, loading as an extra tab in Photopea.
* Notifications are handled by the `lib/notify.js` wrapper invoking `ntfy.sh`. 

---

## **9\. Output Contract (To n8n)**

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


## **10\. Local Testing**

> [!IMPORTANT]
> **Check Map Tile Key First:** Before running tests or writing new code, verify that `NEXT_PUBLIC_GOOGLE_API_KEY` in `.env` is valid and not IP-restricted for the current environment. A `403 PERMISSION_DENIED` error often indicates an IP whitelist issue.

Since the application runs inside Docker (and Node.js may not be installed on the host machine), all test scripts must be executed **inside the running container**.

Assuming your container is named `moonshot` (default in `docker-compose.yml`), run:

```bash
# Test oblique cardinal view
docker compose exec moonshot node tests/cardinal.js

# Test nadir top-down view
docker compose exec moonshot node tests/nadir.js
```

## **ðŸ¤– The "Director" (Renderer) Workflow**

The renderer follows this stateless cycle for every job to prevent common headless failures:

1. **Initialize**: Boot with preserveDrawingBuffer: true and 2048 x 1536 viewport.  
2. **Ingest**: Load GeoJSON, create Bounding Sphere, and apply clampToGround.  
3. **Position**: Loop through Headings (0, 90, 180, 270\) at **\-24Â° pitch**.  
4. **Refine**: Set viewer.scene.globe.maximumScreenSpaceError \= 1.0 to force maximum high-res detail.  
5. **Validate**: Wait until viewer.scene.globe.tilesLoaded \=== true before capture.  
6. **Capture**: Execute Puppeteer page.screenshot() and inspect for black frames using Sharp.



