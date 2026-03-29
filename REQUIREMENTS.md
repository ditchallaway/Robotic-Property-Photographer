# Architecture: Headless Rendering Service

## 1. The "Headless Renderer" Pattern
* **Role:** This repository is a **stateless rendering microservice**. It receives a JSON payload and returns layered PSD image files with editable text layers.
* **Forbidden Scope:**
    * Do **NOT** implement long-term file storage (S3, GCS, etc.) — R2 upload is optional and env-gated.
    * Do **NOT** implement email/notification logic (SendGrid, SMTP).
    * Do **NOT** implement complex job queues (Redis/Bull) inside this codebase.
* **Assumption:** An upstream **n8n** instance handles all triggers, rate limiting, permanent storage, and error notifications.

## 2. API Contract
* **Input:** The app exposes a single HTTP POST endpoint (`/api/render`).

```json
{
    "centroid": [-116.4869, 48.3322],
    "centroid_elevation": 655,
    "ll_gisacre": 6.1944,
    "geometry": {
        "type": "Polygon",
        "coordinates": [[[-116.486, 48.331], ...]]
    },
    "customer_id": "cust_12345",
    "order_id": "order_12345",
    "shots": ["nadir", "cardinal", "east", "south", "west"]
}
```

* **Output:** A JSON response containing metadata and file paths/URLs for PSD assets.

```json
{
    "status": "success",
    "customer_id": "cust_12345",
    "order_id": "order_12345",
    "shots": {
        "nadir": {
            "psd_path": "/app/test-results/nadir.psd",
            "psd_url": "https://r2.example.com/order_12345/cust_12345/nadir.psd",
            "photopea_url": "https://app.brokertricks.com#..."
        }
    },
    "static_map_url": "https://maps.googleapis.com/maps/api/staticmap?...",
    "roads": ["West Shingle Mill Road", "East Shingle Mill Road"],
    "acreage": "6.19 ACRES"
}
```

## 3. Technology Standards
* **Engine:** CesiumJS (via `import 'cesium'`) running in a headless browser context (Puppeteer).
* **Coordinate System:** Always use `Cesium.Cartesian3` for positioning. Do not invent custom trigonometry.
* **Fidelity:** All capture sequences must wait for `viewer.scene.globe.tilesLoaded === true` before capture.
* **Quality:** Set `viewer.scene.globe.maximumScreenSpaceError = 1.0` before capture to force max detail.
* **Resolution:** Output 2048 × 1536 px (4:3 aspect ratio).
* **Headless Config:** Always set `contextOptions: { webgl: { preserveDrawingBuffer: true } }` to prevent blank PNGs.
* **Concurrency:** Render exactly 1 job at a time (sequential) to prevent WebGL memory crashes.
* **Black-Frame Detection:** After each screenshot, automatically check for mostly-black frames (< 5% non-black pixels) and log a warning. This prevents silently saving empty renders.
* **Dependency Management:** If a new npm package is installed, you **MUST** suggest running `docker-compose up --build` immediately.

## 4. Single-Pass Rendering
* **One pass per shot:** Map (satellite) + boundary (yellow polyline) captured together in a single opaque screenshot.
* **Text layers created server-side:** Road names and acreage are added as editable text layers via `ag-psd` (not rendered by CesiumJS).
* **PSD Structure:**
    * Background layer: opaque map + boundary screenshot
    * Road text layers: white, 48pt, stacked in top-right margin
    * Acreage text layer: yellow, 80pt, centered bottom
* **Human-in-the-loop:** The operator drags text layers to correct positions using Photopea.
* **Reference map:** A Google Static Map URL is generated showing satellite imagery with road labels for the operator's reference.

## 5. Camera Rules
* **FOV:** 100 degrees.
* **Headings:** True North aligned: 0°, 90°, 180°, 270°.
* **Oblique pitch:** -35 degrees.
* **Nadir pitch:** -89.9 degrees (avoids gimbal lock at exact -90°).
* **Framing:** Use `viewer.camera.flyToBoundingSphere()` with `boundingSphere.radius * 2.5` for oblique shots and `2.0` for nadir.

## 6. Terrain & Geometry Rules
* Use `clampToGround: true` for all Polylines/Polygons (do not use centroid height).

## 7. Road Label Rules
* Road data MUST be sourced from OSM `way[highway]` only.
* Do NOT query `relation[type=route]` or any route relations.
* Do NOT merge or infer route names across multiple ways.
* Label text taken strictly from tags: `name → ref → alt_name`.
* Missing name = road excluded.

## 8. External Services (All Optional, Env-Gated)

| Service | Env Vars | Purpose |
|---------|----------|---------|
| Cloudflare R2 | `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` | PSD upload for remote access |
| ntfy.sh | `NTFY_TOPIC`, `NTFY_URL` | Push notification when shots are ready |
| Photopea | `PHOTOPEA_URL` | Self-hosted PSD editor (default: `app.brokertricks.com`) |
| Google Maps | `NEXT_PUBLIC_GOOGLE_API_KEY` | 3D tiles + static map reference |

All services gracefully no-op when not configured.

## 9. Testing Strategy
* **Two test scripts:** `tests/cardinal.js` (oblique) and `tests/nadir.js` (top-down).
* **Run inside container:** `docker compose exec moonshot node tests/cardinal.js`
* **Schema validation:** Tests verify the response JSON has `shots`, `static_map_url`, `roads`, `acreage`.
* **Black-frame detection:** Automatically logs warnings for mostly-black screenshots.
* **Expected output:**
    * `test-results/cardinal.psd` — layered PSD with text layers
    * `test-results/nadir.psd` — layered PSD with text layers
    * `test-results/{shot}_layers/{shot}_background.png` — raw screenshot