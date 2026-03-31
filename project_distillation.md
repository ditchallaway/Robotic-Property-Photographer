# Robotic Property Photographer: Project Distillation

This document provides a technical summary of the "Moonshot" renderer, a stateless microservice designed for high-fidelity property imagery.

## 1. Core Functional Requirements

The renderer is a **stateless worker** that converts geographic data into professional-grade property photos.

*   **Logic Model**: The service converts geographic data (Centroid, GeoJSON Boundary) into a specific set of 5 professional property photos.
*   **Processing**: Boots a headless Chromium instance to frame the property using CesiumJS with Google 3D Tiles and capture single-pass screenshots.
*   **Outputs**: Exactly 5 PNG files (North, East, South, West, and Nadir) featuring the yellow property boundary.
*   **Safety & Reliability**:
    *   **Sequential Queue**: Only one job renders at a time to prevent WebGL memory starvation.
    *   **Determinism**: Shot headings are locked to True North (0, 90, 180, 270) for cardinal views and -90 pitch for the overhead view.
    *   **Validation**: Uses pixel density analysis to detect "black-frame" failures before confirming a successful render.

### Critical Technical Fixes:
*   **Blank Frames**: Fixed by setting `preserveDrawingBuffer: true` in the WebGL context.
*   **Low-Detail Tiles**: Resolved by polling `tilesLoaded === true` for 3 consecutive ticks before capture.


## 2. Docker & Network Configuration

The current stable environment relies on specific hardware acceleration and memory tuning.

### Docker Compose Configuration
```yaml
services:
  moonshot:
    build: .
    shm_size: '2gb' # CRITICAL: Prevents Chromium "Aw Snap" during 4K texture operations
    ports: ["3001:3000"]
    volumes:
      - .:/app
      - /app/node_modules # Protect internal build artifacts
      - /app/.next
      - /app/public/cesium
```

### Puppeteer Stable Launch Arguments
These flags are the result of multiple iterations to ensure WebGL stability in a Debian-slim container:
```javascript
args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage', // Offloads SHM to the 2GB volume
    '--disable-gpu',
    '--enable-unsafe-swiftshader', // New Chrome 130+ requirement for CPU WebGL
    '--use-gl=angle',           // Use ANGLE for better WebGL translation
    '--use-angle=swiftshader'    // Software fallback for CPU-only environments
]
```

---

## 3. Lessons Learned (The "Hard Way")

| Failure Point | Why it Failed | Solution |
| :--- | :--- | :--- |
| **Blank PNGs** | Puppeteer captures the front buffer before Cesium finishes swapping. | Set `{ contextOptions: { webgl: { preserveDrawingBuffer: true } } }`. |
| **Low-Detail Tiles** | `scene.render()` doesn't wait for network-bound tiles to arrive. | Poll `viewer.scene.globe.tilesLoaded === true` with a stable check (3 consecutive ticks). |
| **403 Forbidden** | Google API keys often had trailing newlines or spaces from `.env` files. | Use `process.env.KEY.trim()` rigorously. |
| **Silent Crashes** | WebGL context loss would return a transparent/black frame without throwing an error. | Implement `sharp`-based black-pixel detection (>95% threshold). |
| **Zombie PIDs** | Node subprocesses (Chromium) wouldn't die on container stop. | Use `tini` as the ENTRYPOINT in the Dockerfile. |

---

## 4. Sequential Queue Wrapper

Ensures the server doesn't crash with multiple concurrent jobs.

```javascript
let renderQueue = Promise.resolve();

// Inside the API Handler:
await (renderQueue = renderQueue.then(async () => {
    try {
        await doRender(req, res);
    } catch (err) {
        console.error('[QUEUE] Job failed:', err.message);
    }
}));
```
