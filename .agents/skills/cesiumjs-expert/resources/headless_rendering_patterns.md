# Headless Rendering Patterns — CesiumJS + Puppeteer + Docker

> Battle-tested patterns for rendering CesiumJS screenshots inside Docker containers
> without a physical GPU. Uses SwiftShader for software-based WebGL.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  Docker Container (node:20-slim + Chromium deps)        │
│                                                         │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Job JSON │───▶│ Node.js CLI  │───▶│ PNG Output   │  │
│  └──────────┘    │ (render.js)  │    └──────────────┘  │
│                  └──────┬───────┘                       │
│                         │                               │
│              ┌──────────▼───────────┐                   │
│              │  Puppeteer + Chrome  │                   │
│              │  (SwiftShader WebGL) │                   │
│              └──────────┬───────────┘                   │
│                         │                               │
│              ┌──────────▼───────────┐                   │
│              │  CesiumJS (inline)   │                   │
│              │  Globe + Entities    │                   │
│              └──────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

---

## Pattern 1: Puppeteer Launch Configuration

### Minimal working config for WebGL in Docker

```javascript
const puppeteer = require("puppeteer");

async function launchBrowser() {
  return puppeteer.launch({
    headless: "new",
    args: [
      // === Sandbox (required in Docker) ===
      "--no-sandbox",
      "--disable-setuid-sandbox",

      // === WebGL via SwiftShader ===
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",

      // === GPU sandbox (must disable for software rendering) ===
      "--disable-gpu-sandbox",

      // === Memory (Docker shared memory is small) ===
      "--disable-dev-shm-usage",

      // === Stability ===
      "--disable-extensions",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
    ],
    defaultViewport: null,
  });
}
```

### ⚠️ Common flag mistakes

| ❌ Wrong | ✅ Correct | Why |
|----------|-----------|-----|
| `--disable-gpu` | `--use-gl=angle --use-angle=swiftshader` | `--disable-gpu` kills ALL GL, including software |
| `--headless=old` | `headless: "new"` | Old headless mode has WebGL bugs |
| Missing `--enable-unsafe-swiftshader` | Add it | Required since Chrome 112+ for software WebGL |
| `--use-gl=swiftshader` (old) | `--use-gl=angle --use-angle=swiftshader` | Direct SwiftShader backend deprecated |

---

## Pattern 2: Inline CesiumJS HTML Template

No web server needed — inject the entire page as a string.

```javascript
function buildCesiumHTML({ cesiumVersion, cesiumToken, width, height }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cesium.com/downloads/cesiumjs/releases/${cesiumVersion}/Build/Cesium/Cesium.js"></script>
  <link href="https://cesium.com/downloads/cesiumjs/releases/${cesiumVersion}/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
  <style>
    html, body, #cesiumContainer {
      width: ${width}px;
      height: ${height}px;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div id="cesiumContainer"></div>
  <script>
    ${cesiumToken ? `Cesium.Ion.defaultAccessToken = "${cesiumToken}";` : ""}

    const viewer = new Cesium.Viewer("cesiumContainer", {
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      selectionIndicator: false,
      infoBox: false,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      contextOptions: {
        webgl: {
          alpha: false,
          preserveDrawingBuffer: true,
        },
      },
    });

    // Disable visual noise for clean screenshots
    viewer.scene.fog.enabled = false;
    viewer.scene.skyAtmosphere.show = false;

    // Signal that viewer is ready
    window.__CESIUM_READY__ = true;
  </script>
</body>
</html>`;
}
```

### Page setup sequence

```javascript
async function setupPage(browser, width, height) {
  const page = await browser.newPage();

  // 1. Set viewport BEFORE content
  await page.setViewport({ width, height, deviceScaleFactor: 1 });

  // 2. Inject HTML
  await page.setContent(buildCesiumHTML({
    cesiumVersion: "1.119",
    cesiumToken: process.env.CESIUM_ION_TOKEN || null,
    width,
    height,
  }), { waitUntil: "networkidle0" });

  // 3. Wait for Cesium to initialize
  await page.waitForFunction("window.__CESIUM_READY__ === true", {
    timeout: 15000,
  });

  return page;
}
```

---

## Pattern 3: Tile-Load Waiting Strategies

The #1 cause of blank screenshots is capturing before tiles have loaded.

### Strategy A: Globe tilesLoaded polling (recommended)

```javascript
async function waitForTiles(page, timeoutMs = 30000) {
  await page.evaluate((timeout) => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = setInterval(() => {
        const viewer = window.viewer;
        if (!viewer) return;

        if (viewer.scene.globe.tilesLoaded) {
          clearInterval(check);
          viewer.scene.requestRender();
          // Extra buffer for render to complete
          setTimeout(resolve, 500);
        } else if (Date.now() - start > timeout) {
          clearInterval(check);
          console.warn("Tile loading timed out, proceeding anyway");
          viewer.scene.requestRender();
          setTimeout(resolve, 500);
        }
      }, 200);
    });
  }, timeoutMs);
}
```

### Strategy B: tileLoadProgressEvent (for progress tracking)

```javascript
async function waitForTilesWithProgress(page, timeoutMs = 30000) {
  await page.evaluate((timeout) => {
    return new Promise((resolve) => {
      const viewer = window.viewer;
      let lastRemaining = Infinity;

      const handler = (remaining) => {
        console.log(`Tiles remaining: ${remaining}`);
        lastRemaining = remaining;
        if (remaining === 0) {
          viewer.scene.globe.tileLoadProgressEvent.removeEventListener(handler);
          viewer.scene.requestRender();
          setTimeout(resolve, 500);
        }
      };
      viewer.scene.globe.tileLoadProgressEvent.addEventListener(handler);

      // Timeout safety
      setTimeout(() => {
        viewer.scene.globe.tileLoadProgressEvent.removeEventListener(handler);
        viewer.scene.requestRender();
        setTimeout(resolve, 500);
      }, timeout);
    });
  }, timeoutMs);
}
```

### Strategy C: Frame-count based (simplest, least reliable)

```javascript
async function waitForFrames(page, frameCount = 10) {
  await page.evaluate((count) => {
    return new Promise((resolve) => {
      const viewer = window.viewer;
      let frames = 0;
      const handler = () => {
        frames++;
        if (frames >= count) {
          viewer.scene.postRender.removeEventListener(handler);
          resolve();
        }
        viewer.scene.requestRender();
      };
      viewer.scene.postRender.addEventListener(handler);
      viewer.scene.requestRender();
    });
  }, frameCount);
}
```

---

## Pattern 4: Screenshot Capture

```javascript
async function captureScreenshot(page, outputPath) {
  // Force a final render
  await page.evaluate(() => {
    window.viewer.scene.requestRender();
  });

  // Small delay for render to flush to canvas
  await new Promise(r => setTimeout(r, 200));

  // Capture
  const buffer = await page.screenshot({
    path: outputPath,
    type: "png",
    fullPage: false,  // use false + clip for exact dimensions
    omitBackground: false,
    clip: {
      x: 0,
      y: 0,
      width: await page.evaluate(() => window.innerWidth),
      height: await page.evaluate(() => window.innerHeight),
    },
  });

  return buffer;
}
```

---

## Pattern 5: Cleanup & Memory Management

Critical for multi-render pipelines that process many images.

```javascript
async function cleanup(page, browser) {
  try {
    // 1. Destroy CesiumJS viewer (frees WebGL context + textures)
    await page.evaluate(() => {
      if (window.viewer && !window.viewer.isDestroyed()) {
        window.viewer.destroy();
      }
    });

    // 2. Close the page (frees DOM + JS heap)
    await page.close();

    // 3. Close browser (frees Chrome process)
    await browser.close();
  } catch (err) {
    console.error("Cleanup error:", err.message);
    // Force kill if close fails
    try { browser.process()?.kill("SIGKILL"); } catch {}
  }
}
```

### For batch rendering (multiple screenshots, one browser)

```javascript
async function renderBatch(jobs) {
  const browser = await launchBrowser();

  for (const job of jobs) {
    const page = await browser.newPage();
    try {
      await setupPage(page, job.width, job.height);
      // ... configure scene, wait for tiles, screenshot ...
    } finally {
      // Destroy viewer + close page, but keep browser alive
      await page.evaluate(() => {
        if (window.viewer && !window.viewer.isDestroyed()) viewer.destroy();
      });
      await page.close();
    }
  }

  await browser.close();
}
```

---

## Pattern 6: Full Render Pipeline (end-to-end)

```javascript
async function renderPropertyScreenshot(job) {
  const { coordinates, camera, width = 1920, height = 1080, outputPath } = job;

  // 1. Launch
  const browser = await launchBrowser();
  const page = await browser.newPage();

  try {
    // 2. Setup
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.setContent(buildCesiumHTML({
      cesiumVersion: "1.119",
      cesiumToken: process.env.CESIUM_ION_TOKEN,
      width, height,
    }), { waitUntil: "networkidle0" });
    await page.waitForFunction("window.__CESIUM_READY__", { timeout: 15000 });

    // 3. Add property boundary
    await page.evaluate((coords) => {
      const flat = coords.flatMap(([lon, lat]) => [lon, lat]);
      viewer.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(flat),
          height: 0,
          material: Cesium.Color.RED.withAlpha(0.3),
          outline: true,
          outlineColor: Cesium.Color.RED,
          outlineWidth: 3,
        },
      });
    }, coordinates);

    // 4. Position camera
    await page.evaluate((cam) => {
      const center = coords[0]; // simplified — use centroid in production
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], cam.height),
        orientation: {
          heading: Cesium.Math.toRadians(cam.heading || 0),
          pitch: Cesium.Math.toRadians(cam.pitch || -90),
          roll: 0,
        },
      });
    }, camera);

    // 5. Wait for tiles
    await waitForTiles(page, 30000);

    // 6. Screenshot
    await captureScreenshot(page, outputPath);

    return { success: true, path: outputPath };
  } finally {
    await cleanup(page, browser);
  }
}
```

---

## Dockerfile Template

```dockerfile
FROM node:20-slim

# Install Chromium dependencies for headless WebGL
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    libxshmfence1 \
    libglu1-mesa \
    fonts-liberation \
    fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*

# Environment for software rendering
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV LIBGL_ALWAYS_SOFTWARE=1

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .

CMD ["node", "bin/render.js"]
```

### docker-compose.yml

```yaml
services:
  renderer:
    build: .
    volumes:
      - ./output:/app/output
      - ./jobs:/app/jobs
    environment:
      - CESIUM_ION_TOKEN=${CESIUM_ION_TOKEN:-}
    shm_size: "512mb"  # increase shared memory for Chrome
```
