# Architecture: Headless Rendering Service

## 1. The "Headless Renderer" Pattern
* **Role:** This repository is a **stateless rendering microservice**. It exists solely to receive a JSON payload and return processed binary image data (Base64) or temporary file paths.
* **Forbidden Scope:**
    * Do **NOT** implement long-term file storage (S3, Google Drive, etc.).
    * Do **NOT** implement email/notification logic (SendGrid, SMTP).
    * Do **NOT** implement complex job queues (Redis/Bull) inside this codebase.
* **Assumption:** An upstream **n8n** instance handles all triggers, rate limiting, permanent storage, and error notifications.

## 2. API Contract
* **Input:** The app exposes a single HTTP POST endpoint (e.g., `/api/render`).
    * `lat` (number): Target centroid latitude.
    * `lon` (number): Target centroid longitude.
    * `geojson` (object): The GeoJSON object defining the property boundary.
    * `style` (object): { strokeColor: string, strokeWidth: number, fillOpacity: number }.
* **Output:** A JSON response containing an array of Base64 encoded images strings or a download URL for a temporary zip file.

## 3. Technology Standards
* **Engine:** CesiumJS (Raw, via `import 'cesium'`) running in a headless browser context (Puppeteer).
* **Coordinate System:** Always use `Cesium.Cartesian3` for positioning. Do not invent custom trigonometry.
* **Fidelity:** All capture sequences must wait for `tileset.allTilesLoaded` or a stabilization delay before capturing the canvas.
* **Dependency Management:** If a new npm package is installed, you **MUST** suggest running `docker-compose up --build` immediately.