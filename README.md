# **Robotic Property Photographer \- Drone Scale Engine**

A headless rendering microservice built on Next.js and CesiumJS, designed to generate consistent, professional 3D property imagery via API for n8n-driven workflows.

## **1\. System Overview**

**Goal:** Render deterministic aerial images of a property boundary using CesiumJS, returning PNG assets to n8n.

**High-level flow**

1. n8n sends JSON payload (centroid \+ elevation \+ GeoJSON)  
2. Renderer boots Cesium in headless Chromium  
3. Boundary is rendered using Cesium materials  
4. Camera positions are solved and frames captured  
5. PNGs are written to disk  
6. Renderer returns asset references to n8n

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

* #### `270°` \= faces West   **Oblique Views**

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

## **🔌 API Interface (POST /api/render)**

**Config Requirements:**

* **Resolution**: 2048 x 1536 px (4:3 aspect ratio).  
* **Source**: Google API Direct (via .env) with no Cesium ion middleman.

**Input JSON:**

JSON

| {  "customer\_id": "uuid-user-string",  "order\_id": "uuid-order-string",  "centroid": \[lon, lat\],  "centroid\_elevation": meters,  "geometry": { "type": "Polygon", "coordinates": \[...\] }} |
| :---- |

**Assumptions:**

* WGS84  
* meters  
* geometry already validated

Renderer performs **no** terrain sampling or centroid computation.

## **3\. Renderer Responsibilities**

* Accept HTTP POST JSON  
* Initialize Cesium Viewer  
* Convert GeoJSON → Cesium entities  
* Apply material styling  
* Solve camera positions  
* Capture PNG frames  
* Return file paths or blobs

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

---

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

## **8\. Output Contract (To n8n)**

Returns local file paths to keep n8n payloads lightweight.

JSON

| {    "status": "success",    "customer\_id": "uuid-user-string",    "order\_id": "uuid-order-string",    "images": \[     "/app/public/snapshots/123/456/nadir.png",    "/app/public/snapshots/123/456/north.png",    "/app/public/snapshots/123/456/east.png",    "..."  \]} |
| :---- |

## **🤖 The "Director" (Renderer) Workflow**

The renderer follows this stateless cycle for every job to prevent common headless failures:

1. **Initialize**: Boot with preserveDrawingBuffer: true and 2048 x 1536 viewport.  
2. **Ingest**: Load GeoJSON, create Bounding Sphere, and apply clampToGround.  
3. **Position**: Loop through Headings (0, 90, 180, 270\) at **\-24° pitch**.  
4. **Refine**: Set viewer.scene.globe.maximumScreenSpaceError \= 1.0 to force maximum high-res detail.  
5. **Validate**: Wait until viewer.scene.globe.tilesLoaded \=== true before capture.  
6. **Capture**: Execute canvas.toDataURL() and write to local /app/public/snapshots/ path.

