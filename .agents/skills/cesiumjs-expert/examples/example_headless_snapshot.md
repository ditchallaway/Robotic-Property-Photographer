# Example: Headless Property Boundary Screenshot

> Happy path — a complete pipeline rendering a property polygon as a nadir PNG.

---

## Scenario

User has a property boundary defined as GeoJSON coordinates. They want to render
a top-down (nadir) screenshot showing the property outline overlaid on satellite
imagery, captured inside a Docker container without a GPU.

## Input

```json
{
  "parcel_id": "travis-2024-001234",
  "coordinates": [
    [-97.7523, 30.2574],
    [-97.7498, 30.2574],
    [-97.7498, 30.2596],
    [-97.7523, 30.2596]
  ],
  "camera": {
    "heading": 0,
    "pitch": -90,
    "height": 600
  },
  "output": {
    "width": 1920,
    "height": 1080,
    "path": "output/travis-2024-001234_nadir.png"
  }
}
```

## Thought Process

1. **Parse coordinates** → 4 vertices forming a rectangular property boundary
2. **Compute centroid** → `[-97.75105, 30.2585]` (average of all vertices)
3. **Calculate bounding box** → west: -97.7523, south: 30.2574, east: -97.7498, north: 30.2596
4. **Camera position** → place at centroid, height 600m, looking straight down (pitch: -90°)
5. **Rendering strategy** → OpenStreetMap imagery (no API key), flat terrain, red polygon outline
6. **Wait strategy** → poll `globe.tilesLoaded` with 30s timeout

## Implementation

```javascript
const puppeteer = require("puppeteer");

async function renderProperty(job) {
  const { coordinates, camera, output } = job;

  // 1. Launch browser with SwiftShader WebGL
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox", "--disable-setuid-sandbox",
      "--use-gl=angle", "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader", "--disable-gpu-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: output.width, height: output.height });

  // 2. Inject CesiumJS page
  await page.setContent(`<!DOCTYPE html>
<html>
<head>
  <script src="https://cesium.com/downloads/cesiumjs/releases/1.119/Build/Cesium/Cesium.js"></script>
  <link href="https://cesium.com/downloads/cesiumjs/releases/1.119/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
  <style>html, body, #cesiumContainer { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }</style>
</head>
<body>
  <div id="cesiumContainer"></div>
  <script>
    const viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProvider: new Cesium.OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" }),
      terrainProvider: new Cesium.EllipsoidTerrainProvider(),
      animation: false, timeline: false, baseLayerPicker: false,
      geocoder: false, homeButton: false, sceneModePicker: false,
      navigationHelpButton: false, fullscreenButton: false,
      selectionIndicator: false, infoBox: false,
      requestRenderMode: true,
      contextOptions: { webgl: { preserveDrawingBuffer: true } },
    });
    viewer.scene.fog.enabled = false;
    viewer.scene.skyAtmosphere.show = false;
    window.__CESIUM_READY__ = true;
  </script>
</body>
</html>`, { waitUntil: "networkidle0" });

  await page.waitForFunction("window.__CESIUM_READY__", { timeout: 15000 });

  // 3. Add property boundary polygon
  await page.evaluate((coords) => {
    const flat = coords.flatMap(([lon, lat]) => [lon, lat]);
    viewer.entities.add({
      polygon: {
        hierarchy: Cesium.Cartesian3.fromDegreesArray(flat),
        height: 0,
        material: Cesium.Color.RED.withAlpha(0.25),
        outline: true,
        outlineColor: Cesium.Color.RED,
        outlineWidth: 3,
      },
    });
  }, coordinates);

  // 4. Position camera (nadir — straight down)
  const centroid = [
    coordinates.reduce((s, [lon]) => s + lon, 0) / coordinates.length,
    coordinates.reduce((s, [, lat]) => s + lat, 0) / coordinates.length,
  ];

  await page.evaluate(({ centroid, camera }) => {
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(centroid[0], centroid[1], camera.height),
      orientation: {
        heading: Cesium.Math.toRadians(camera.heading),
        pitch: Cesium.Math.toRadians(camera.pitch),
        roll: 0,
      },
    });
  }, { centroid, camera });

  // 5. Wait for tiles to load
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = setInterval(() => {
        if (viewer.scene.globe.tilesLoaded) {
          clearInterval(check);
          viewer.scene.requestRender();
          setTimeout(resolve, 500);
        } else if (Date.now() - start > 30000) {
          clearInterval(check);
          viewer.scene.requestRender();
          setTimeout(resolve, 500);
        }
      }, 200);
    });
  });

  // 6. Capture screenshot
  await page.evaluate(() => viewer.scene.requestRender());
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: output.path, type: "png" });

  // 7. Cleanup
  await page.evaluate(() => viewer.destroy());
  await page.close();
  await browser.close();

  return { success: true, path: output.path };
}
```

## Output

- **File:** `output/travis-2024-001234_nadir.png` (1920×1080 PNG)
- **Content:** Top-down view showing the property boundary as a semi-transparent red polygon
  with red outline, overlaid on OpenStreetMap satellite tiles
- **Render time:** ~8-15 seconds with SwiftShader (vs ~2s with GPU)

## Why This Works

1. **No API key needed** — uses OpenStreetMap imagery (free, no rate limits for small batches)
2. **No server needed** — CesiumJS is injected as inline HTML via `setContent`
3. **SwiftShader** provides software WebGL rendering inside Docker without a GPU
4. **Tile-load polling** ensures all map tiles are loaded before the screenshot fires
5. **`preserveDrawingBuffer: true`** is critical — without it, `page.screenshot()` captures a blank canvas
6. **`requestRenderMode: true`** saves CPU by only rendering when we ask
