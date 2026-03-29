# Robotic Property Photographer: Project Distillation

This document provides a technical summary of the "Moonshot" renderer, a stateless microservice designed for high-fidelity property imagery.

## 1. Core Functional Requirements

The renderer is a **stateless worker** that converts geographic data into professional-grade property photos.

*   **Logic Model**:
    *   **Inputs**: Centroid (Lon/Lat), Elevation, GeoJSON Boundary, Acreage, and Shot List.
    *   **Processing**: Boots a headless Chromium instance, initializes CesiumJS with Google 3D Tiles, frames the property, and captures a single-pass screenshot (Map + Boundary).
    *   **Outputs**: Layered PSD files (for Photopea/Photoshop) with editable text layers for Road Names and Acreage.
*   **Safety Constraints**:
    *   **Sequential Processing**: Only one job renders at a time to prevent WebGL memory starvation.
    *   **Determinism**: Shot headings are fixed to True North (0, 90, 180, 270) to ensure consistency.
    *   **Validation**: Every screenshot is checked for "black-frame" failure (silent render crash) using pixel density analysis.

---

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
    '--ignore-gpu-blocklist',
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

## 4. Most Complex Functions ("Clean" Versions)

### A. The Precision Settle (`waitForTiles`)
Ensures the map is fully high-res before the "shutter" clicks.
```javascript
async function waitForTiles(viewer, tileset) {
    return new Promise(resolve => {
        let stable = 0;
        const timer = setInterval(() => {
            const tsLoaded = tileset ? (tileset.tilesLoaded || tileset.allTilesLoaded) : true;
            const gLoaded = viewer.scene.globe.tilesLoaded;
            if (tsLoaded && gLoaded) {
                if (++stable >= 3) { // Must be stable for 3 ticks (900ms)
                    clearInterval(timer);
                    resolve();
                }
            } else {
                stable = 0;
            }
        }, 300);
        setTimeout(() => { clearInterval(timer); resolve(); }, 120000); // 2-minute safety timeout
    });
}
```

### B. PSD Text Layer Generation
Creates editable text in a PSD without requiring the browser to render typography.
```javascript
function createTextLayer({ name, text, fontSize, color, x, y }) {
    return {
        name,
        left: Math.round(x),
        top: Math.round(y),
        opacity: 1,
        text: {
            text: text,
            style: {
                font: { name: 'ArialMT' },
                fontSize: fontSize,
                fillColor: color,
            },
            styleRuns: [{ length: text.length, style: { fontSize, fillColor: color } }],
        }
    };
}
```

### C. Sequential Queue Wrapper
Ensures the 3080/4090 (or Server GPU) doesn't catch fire with multiple concurrent jobs.
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

---

## 5. Implementation Complete

The full Moonshot application has been built from this distillation with:

- **Express API** with `/render`, `/render-batch`, `/health`, `/queue/status` endpoints
- **Puppeteer Integration** with WebGL-optimized launch args & black-frame detection
- **CesiumJS Initialization** with Google 3D Tiles support & dynamic boundary rendering
- **PSD Generation** with editable text layers (Road Name, Acreage, Coordinates, Timestamp)
- **Sequential Queue** preventing WebGL memory starvation
- **Docker Multi-Stage Build** with tini PID 1 handler & 2GB shm_size config
- **docker-compose.yml** with resource limits, healthcheck, & networking

See generated source files for complete implementation.
