# **Robotic Property Photographer \- Drone Scale Engine**

A headless rendering microservice built on Next.js and CesiumJS, designed to generate consistent, professional 3D property imagery via API for n8n-driven workflows.

## **1\. System Overview**


## 2. README.md
The system overview and output contract for the drone-scale engine.

System Goal: Render 5 deterministic aerial property images (4 cardinal oblique + 1 nadir overhead) with consistent yellow boundary styling.

Architecture Pillars:

Yellow Boundary: All shots must use a yellow property polyline (width: 3) with clampToGround: true to follow terrain contours.

Deterministic Shot List:

North: Heading 0°, Pitch -24°.

East: Heading 90°, Pitch -24°.

South: Heading 180°, Pitch -24°.

West: Heading 270°, Pitch -24°.

Nadir: Heading 0°, Pitch -90°.

Output Contract:

JSON

{
    "status": "success",
    "order_id": "order_12345",
    "images": [
        "/snapshots/north.png",
        "/snapshots/east.png",
        "/snapshots/south.png",
        "/snapshots/west.png",
        "/snapshots/nadir.png"
    ]
}
---

Renderer is **stateless** and **geometry-agnostic**.

## **🚀 Role & Scope**

**Stateless Worker:** This service is a rendering engine. It does NOT handle long-term storage, job queuing, or notifications. It receives a coordinate/geometry and returns images.

**Orchestration:** Designed to be triggered by n8n.

**Concurrency:** Render exactly 1 job at a time to prevent WebGL memory crashes in Docker.

## **🏗️ Architecture Pillars**

### **Pillar 1: Native Terrain & Auto-Framing**

Professional Drone-Scale perspectives using Cesium-native methods for 2026 standards:

* **Terrain Engine**: Enable CesiumWorldTerrain to accurately render rural topography and slopes. CesiumWorldTerrain remains enabled even when using Photorealistic 3D Tiles to ensure correct ground clamping for boundary lines.  
* **Auto-Framing**: Use viewer.camera.flyToBoundingSphere() with a range of **0.0**.  
* **Logic**: This automatically calculates the "fit-to-frame" distance for any parcel size, from 1-acre lots to 1,000-acre ranches.

### **Pillar 2: Automated Shot List (Deterministic)**

Deterministic camera sequence triggered via `/api/render`.

**Heading values represent camera heading (direction the camera faces), per CesiumJS.**

* `0°` \= faces North  
* `90°` \= faces East  
* `180°` \= faces South
* `270°` \= faces West   **Oblique Views**

* **North-facing view**: Heading `0°`, Pitch `-24°`  
* **East-facing view**: Heading `90°`, Pitch `-24°`  
* **South-facing view**: Heading `180°`, Pitch `-24°`  
* **West-facing view**: Heading `270°`, Pitch `-24°`  
* **Nadir View**: Heading `0°`, Pitch `-90°`

**FOV:** `100°`  
	 **Alignment:** All headings aligned to True North (`0, 90, 180, 270`)

### **Pillar 3: Boundary & Styling**

* **GeoJSON Support**: Supports injection for property lines.  
* **Clamped to Ground**: MUST use clampToGround: true for all Polyline/Polygon entities.  
* **Why**: Clamping ensures lines follow 3D terrain perfectly and prevents lines from "burying" into hills or "floating" over valleys.



**Config Requirements:**

* **Resolution**: 2048 x 1536 px (4:3 aspect ratio).  
* **Source**: Google API key (via .env or .env.local) with no Cesium ion middleman.

**Input JSON:**

JSON

| {  "customer\_id": "uuid-user-string",  "order\_id": "uuid-order-string",  "centroid": \[lon, lat\],  "centroid\_elevation": meters,  "geometry": { "type": "Polygon", "coordinates": \[...\] }} |
| :---- |

**Assumptions:**

* WGS84  
* meters  
* geometry already validated

Renderer performs **no** terrain sampling or centroid computation.


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

* **Do not set heights manually**  
* Geometry must be clamped to terrain

| Cesium.Cartesian3.fromDegreesArrayHeights(...) |
| :---- |

### **5.2 Entity Creation**

| viewer.entities.add({  polyline: {    positions: cartesianPoints,    width: 3,    clampToGround: true,    material: new Cesium.ColorMaterialProperty(      Cesium.Color.YELLOW    )  }}); |
| :---- |

(Polygon fill intentionally omitted in beta.)

## **6\. Camera Framing Logic**

* BoundingSphere derived from boundary points  
* Center overridden with centroid

| Cesium.BoundingSphere.fromPoints() |
| :---- |

Camera positioning uses Cesium-native framing:

| viewer.camera.flyToBoundingSphere(boundingSphere, {  offset: new Cesium.HeadingPitchRange(    headingRadians,    pitchRadians,    0 *// auto range*  )}); |
| :---- |

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
| :---- |

* Force max detail:

| viewer.scene.globe.maximumScreenSpaceError \= 1.0; |
| :---- |

* Then capture via:

|  canvas.toDataURL("image/png") |
| :---- |

* To the following path

| /app/public/snapshots/{order\_id}/{customer\_id}/{view}.png |
| :---- |

👆Above snapshots folder is a mounted volume  \- ./snapshots:/app/public/snapshots  
---


## **8\. Multi-Pass PSD Output**

For each shot, the renderer captures 4 separate passes that are composed into a layered PSD file:

### **Pass Sequence**

1. **Map** — Satellite imagery, opaque, all overlays hidden
2. **Boundary** — Yellow property polyline on chroma-key background
3. **Street Labels** — Cesium `LabelCollection` from OSM data on chroma-key background
4. **Acreage** — Turf.js-positioned acreage text on chroma-key background

### **Chroma-Key Process**

* Overlay passes swap satellite imagery for a 1×1 magenta (`#FF00FF`) tile via `SingleTileImageryProvider`
* Sky, sun, moon, and atmosphere are hidden during overlay passes
* After capture, `sharp` removes the magenta background with configurable tolerance
* `ag-psd` composes all passes into a PSD with named layers

### **Output Files**

For each shot (nadir, north, east, south, west):

| File | Contents |
|------|----------|
| `{view}.psd` | Layered PSD: Map (bottom) → Boundary → Street Labels → Acreage (top) |
| `{view}.png` | Flat preview of the map pass only |

---

## **9\. Output Contract (To n8n)**

Returns local file paths to keep n8n payloads lightweight.

```json
{
    "status": "success",
    "customer_id": "uuid-user-string",
    "order_id": "uuid-order-string",
    "images": [
        "/app/public/snapshots/123/456/north.psd",
        "/app/public/snapshots/123/456/north.png",
        "/app/public/snapshots/123/456/nadir.psd",
        "/app/public/snapshots/123/456/nadir.png"
    ]
}
```


## **10\. Local Testing**

Since the application runs inside Docker (and Node.js may not be installed on the host machine), all test scripts must be executed **inside the running container**.

Assuming your container is named `moonshot` (default in `docker-compose.yml`), run:

```bash
# Test with real property data payload
docker compose exec moonshot node scripts/test-real-data.js

# Test with basic mock payload
docker compose exec moonshot node test-api.cjs
```

You can also use the npm shortcuts:
```bash
npm run test:real
npm run test:api
```

## **🤖 The "Director" (Renderer) Workflow**

Instant Framing: Use viewer.camera.flyToBoundingSphere() with duration: 0.

Logic: This calculates the "fit-to-frame" distance for the property size (from 1 to 1,000+ acres) and teleports the camera instantly without animation frames.

The "Director" Workflow:

1. **Initialize**: Boot Chromium with preserveDrawingBuffer: true.

2. **Ingest**: Load GeoJSON and create the Bounding Sphere.
3. **Position**: Loop through the 5 shots (4 Cardinal + 1 Nadir), snapping the camera instantly to each view.  
4. **Refine**: Set viewer.scene.globe.maximumScreenSpaceError \= 1.0 to force maximum high-res detail.  
5. **Validate**: Wait until viewer.scene.globe.tilesLoaded \=== true before capture.  
6. **Capture**: Execute canvas.toDataURL() and write to local /app/public/snapshots/ path.

