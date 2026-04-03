# Architecture: Headless Rendering Service

## 1. The "Headless Renderer" Pattern
* **Role:** This repository is a **stateless rendering microservice**. It receives a JSON payload and returns **exactly 5 deterministic PNG images** of a property boundary.
* **Forbidden Scope:**
    * Do **NOT** implement long-term file storage (S3, GCS, etc.).
    * Do **NOT** implement email/notification logic (SendGrid, SMTP).
    * Do **NOT** implement complex job queues (Redis/Bull) inside this codebase.
* **Assumption:** An upstream **n8n** instance handles all triggers, rate limiting, permanent storage, and error notifications.

## 2. API Contract
* **Input:** The app exposes a single HTTP POST endpoint (`/api/render`).

```json
{
    "centroid": [-116.4869, 48.3322],
    "centroid_elevation": 655,
    "geometry": {
        "type": "Polygon",
        "coordinates": [[[-116.486, 48.331], ...]]
    },
    "customer_id": "cust_12345",
    "order_id": "order_12345"
}
```

* **Output:** A JSON response containing metadata and file paths/URLs for the 5 PNG shots.

```json
{
    "status": "success",
    "customer_id": "cust_12345",
    "order_id": "order_12345",
    "shots": {
        "north": { "png_path": "/app/results/north.png", "png_url": "..." },
        "east":  { "png_path": "/app/results/east.png",  "png_url": "..." },
        "south": { "png_path": "/app/results/south.png", "png_url": "..." },
        "west":  { "png_path": "/app/results/west.png",  "png_url": "..." },
        "nadir": { "png_path": "/app/results/nadir.png", "png_url": "..." }
    }
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

## 4. Rendering Rules
* **One pass per shot:** Satellite imagery + yellow boundary (polyline) captured in a single opaque screenshot.
* **Boundary Styling:** Yellow polyline (`Cesium.Color.YELLOW`), width 3px.
* **No internal labels:** No road names, acreage, or other overlays are rendered.

## 5. Camera Rules
* **FOV:** 100 degrees.
* **Headings:** True North aligned: 0°, 90°, 180°, 270°.
* **Oblique pitch:** -35 degrees.
* **Nadir pitch:** -89.9 degrees (avoids gimbal lock at exact -90°).
* **Framing:** Use `viewer.camera.flyToBoundingSphere()` with `boundingSphere.radius * 2.5` for oblique shots and `2.0` for nadir.

## 6. Terrain & Geometry Rules
* Use `clampToGround: true` for all Polylines/Polygons (do not use centroid height).

## 7. External Services (Optional, Env-Gated)
| Service | Env Vars | Purpose |
|---------|----------|---------|
| Google Maps | `NEXT_PUBLIC_GOOGLE_API_KEY` | 3D tiles + satellite imagery source |

## 8. Testing Strategy
* **Test script:** `test-cli.cjs` (standard API integration test).
* **Run inside container:** `docker compose exec renderer node test-cli.cjs`
* **Verification:** Tests verify the response JSON has `shots` with 5 valid PNG paths.
* **Black-frame detection:** Automatically logs warnings for mostly-black screenshots.