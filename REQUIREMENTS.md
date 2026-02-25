# Architecture: Headless Rendering Service

## 1. The "Headless Renderer" Pattern
* **Role:** This repository is a **stateless rendering microservice**. It receives a JSON payload and returns layered PSD image files with preview PNGs.
* **Forbidden Scope:**
    * Do **NOT** implement long-term file storage (S3, Google Drive, etc.).
    * Do **NOT** implement email/notification logic (SendGrid, SMTP).
    * Do **NOT** implement complex job queues (Redis/Bull) inside this codebase.
* **Assumption:** An upstream **n8n** instance handles all triggers, rate limiting, permanent storage, and error notifications.

## 2. API Contract
* **Input:** The app exposes a single HTTP POST endpoint (`/api/render`).
    * `customer_id` (string): Customer identifier.
    * `order_id` (string): Order identifier.
    * `centroid` (array): `[lon, lat]` target centroid.
    * `centroid_elevation` (number): Elevation in meters.
    * `geometry` (object): GeoJSON Polygon defining the property boundary.
    * `ll_gisacre` (number): Property acreage for label generation.
* **Output:** A JSON response containing metadata and file paths for PSD and PNG assets.

## 3. Technology Standards
* **Engine:** CesiumJS (via `import 'cesium'`) running in a headless browser context (Puppeteer).
* **Coordinate System:** Always use `Cesium.Cartesian3` for positioning. Do not invent custom trigonometry.
* **Fidelity:** All capture sequences must wait for `viewer.scene.globe.tilesLoaded === true` before capture.
* **Quality:** Set `viewer.scene.globe.maximumScreenSpaceError = 1.0` before capture to force max detail.
* **Resolution:** Output 2048 × 1536 px (4:3 aspect ratio).
* **Headless Config:** Always set `contextOptions: { webgl: { preserveDrawingBuffer: true } }` to prevent blank PNGs.
* **Concurrency:** Render exactly 1 job at a time (sequential) to prevent WebGL memory crashes.
* **Dependency Management:** If a new npm package is installed, you **MUST** suggest running `docker-compose up --build` immediately.

## 4. Multi-Pass Rendering Rules
* **Passes per shot:** Map (satellite), Boundary (yellow polyline), Street Labels (LabelCollection), Acreage (positioned text).
* **Transparency:** Overlay passes use `alpha: true` in Cesium WebGL context, and `omitBackground: true` in Puppeteer screenshot options to create natively transparent backgrounds.
* **Composition:** `ag-psd` composes the named transparent layers into a PSD file. `sharp` composites them over the base map for the PNG preview.
* **Output:** Each shot produces `{view}.psd` (layered) and `{view}.png` (composited preview).

## 5. Camera Rules
* **FOV:** 100 degrees.
* **Headings:** True North aligned: 0°, 90°, 180°, 270°.
* **Oblique pitch:** -24 degrees.
* **Nadir pitch:** -90 degrees.
* **Framing:** Use `viewer.camera.flyToBoundingSphere()` with `boundingSphere.radius * 2.0` for framing.

## 6. Terrain & Geometry Rules
* Use `clampToGround: true` for all Polylines/Polygons (do not use centroid height).
* Use `viewer.camera.flyToBoundingSphere()` with `boundingSphere.radius * 2.0` for framing.

## 7. Road Label Rules
* Road data MUST be sourced from OSM `way[highway]` only.
* Do NOT query `relation[type=route]` or any route relations.
* Do NOT merge or infer route names across multiple ways.
* Label text taken strictly from tags: `name → ref → alt_name`.
* Missing name = road excluded.

## 8. Overlay Independence
* Overlay layers (boundary, labels, acreage) must not alter the base map render pass.
* Each overlay must be independently removable from the PSD without affecting other layers.

## 9. Testing Strategy
* **Methodical Isolation:** Tests must isolate capabilities and test only what is needed. 
* **Two View Types:** 
    * **Cardinal Direction:** Angled 3D shots (North=0, East=90, South=180, West=270). Since the same orthographic/perspective rules apply to all 4 angles, a single Cardinal test file per capability is sufficient.
    * **Nadir Direction:** Top-down shot. The math and rendering logic required for a flat, top-down map is entirely different from angled 3D views. There is only one Nadir view, requiring its own isolated tests.
* **Capabilities Breakdown:** Both Cardinal and Nadir require their own isolated test for each of the following passes:
    * `[ ]` Base Image pass.
    * `[ ]` Boundary pass (MUST support polygons with holes).
    * `[ ]` Acres text pass.
    * `[ ]` Street Labels pass.
* **Emergent Complexity:** By testing these highly isolated parts individually, the final multi-pass drone photography service simply emerges.