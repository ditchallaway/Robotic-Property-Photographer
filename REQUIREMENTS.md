# Architecture: Headless Rendering Service

## 1. The "Headless Renderer" Pattern

- **Role:** This repository is a **stateless rendering microservice**. It receives a JSON payload and returns layered PSD image files with preview PNGs.
- **Forbidden Scope:**
  - Do **NOT** implement long-term file storage (S3, Google Drive, etc.).
  - Do **NOT** implement email/notification logic (SendGrid, SMTP).
  - Do **NOT** implement complex job queues (Redis/Bull) inside this codebase.
- **Assumption:** An upstream **n8n** instance handles all triggers, rate limiting, permanent storage, and error notifications.

## 2. API Contract

- **Input:** The app exposes a single HTTP POST endpoint (`/api/render`).

```

 * ⚠️ IMPORTANT FOR LOCAL TESTING ⚠️
 * Since this application runs in Docker and Node may not be installed on the host,
 * you MUST execute this script INSIDE the running container.
 *
 * Command: docker compose exec moonshot node path/to/test-script.js
 */

// Native fetch is available in Node.js 18+
// If running on older Node, install node-fetch manually
// Real property data from n8n (actual payload structure)
const realPropertyData = {
    "ap parcel number": "RP58N01W327600A",
    "owner": "",
    "centroid": [-116.4869477327835, 48.33225928561425],
    "lat": "48.332259",
    "lon": "-116.486948",
    "ll_gisacre": 6.1944,
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-116.4868255, 48.3317135],
            [-116.485553, 48.3317135],
            [-116.4855585, 48.332807],
            [-116.488335, 48.3328055],
            [-116.488341, 48.332094],
            [-116.4883485, 48.3317135],
            [-116.4868255, 48.3317135]
        ]]
    },
    "county": "Bonner County",
    "elevation": 655,
    "customer_id": "cust_12345",
    "order_id": "order_12345",
    "centroid_elevation": 655,
    // Street labels are now fetched from OSM server-side (no longer passed in payload)
};

```

- **Output:** The non-negotiable standards for the rendering service.

Output Standard: The service must return exactly 5 PNG assets per successful request.

Rendering Fidelity:

Resolution: 2048 x 1536 px (4:3 aspect ratio).

Quality: Force maximum detail by setting maximumScreenSpaceError = 1.0 before capture.

Geometry Rules:

Boundary must be a yellow polyline.

Must support polygons with holes using clampToGround: true.

Concurrency: Render exactly 1 job at a time to ensure stability.

## 3. Technology Standards

- **Engine:** CesiumJS (via `import 'cesium'`) running in a headless browser context (Puppeteer or Playwright).
- **Coordinate System:** Always use `Cesium.Cartesian3` for positioning. Do not invent custom trigonometry.
- **Fidelity:** All capture sequences must wait for `viewer.scene.globe.tilesLoaded === true` before capture.
- **Quality:** Set `viewer.scene.globe.maximumScreenSpaceError = 1.0` before capture to force max detail.
- **Resolution:** Output 2048 × 1536 px (4:3 aspect ratio).
- **Headless Config:** Always set `contextOptions: { webgl: { preserveDrawingBuffer: true } }` to prevent blank PNGs.
- **Concurrency:** Render exactly 1 job at a time (sequential) to prevent WebGL memory crashes.
- **Dependency Management:** If a new npm package is installed, you **MUST** suggest running `docker-compose up --build` immediately.

## 5. Camera Rules

- **FOV:** 100 degrees.
- **Headings:** True North aligned: 0°, 90°, 180°, 270°.
- **Oblique pitch:** -24 degrees.
- **Nadir pitch:** -90 degrees.
- **Framing:**
  Use `viewer.camera.flyToBoundingSphere(boundingSphere, { duration: 0 })`.
  **Camera Snap Range:** Use boundingSphere.radius \* 2.0 as the range to ensure the entire property and its yellow boundary are fully visible.
  **Sequential Execution:** The renderer snaps to a position, waits for tilesLoaded === true, captures the PNG, and immediately snaps to the next position.

## Technical Summary for the 5-Frame Render.

| View Type | Heading | Pitch | Framing Method             |
| --------- | ------- | ----- | -------------------------- |
| North     | 0°      | -24°  | Instant Snap (Duration: 0) |
| East      | 90°     | -24°  | Instant Snap (Duration: 0) |
| South     | 180°    | -24°  | Instant Snap (Duration: 0) |
| West      | 270°    | -24°  | Instant Snap (Duration: 0) |
| Nadir     | 0°      | -90°  | Instant Snap (Duration: 0) |

## 6. Terrain & Geometry Rules

- Use `clampToGround: true` for all Polylines/Polygons (do not use centroid height).
- Use `viewer.camera.flyToBoundingSphere()` with `boundingSphere.radius * 2.0` for framing.

## 9. Testing Strategy

- **Methodical Isolation:** Tests must isolate capabilities and test only what is needed.
- **Two View Types:**
  _ **Cardinal Direction:** Angled 3D shots (North=0, East=90, South=180, West=270). Since the same orthographic/perspective rules apply to all 4 angles, a single Cardinal test file per capability is sufficient.
  _ **Nadir Direction:** Top-down shot. The math and rendering logic required for a flat, top-down map is entirely different from angled 3D views. There is only one Nadir view, requiring its own isolated tests.
  0
