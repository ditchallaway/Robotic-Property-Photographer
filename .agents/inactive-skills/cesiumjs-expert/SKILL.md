---
name: cesiumjs-expert
description: |
  Expert assistant for CesiumJS 3D geospatial development, specializing in
  headless rendering, container-based screenshot pipelines, and WebGL debugging.
  Covers Viewer configuration, Camera positioning, GeoJSON/Entity/3DTiles loading,
  Puppeteer integration, Docker SwiftShader setup, and coordinate system conversions.

## 📚 Core Resources

- **API Reference**: [API Reference](resources/cesium_api_reference.md) (Extracted from local docs)
- **Advanced Examples**: [Expert Examples](resources/cesium_examples.md)
- **Headless Pattern**: [Headless Script](examples/headless_render.js)

## 🎯 Expert Domains
- **Headless Rendering**: Puppeteer + SwiftShader + Docker + --use-gl=angle/swiftshader.
- **CesiumJS Widget/Viewer**: Optimization by disabling all non-essential widgets.
- **Complex Geometries**: Entities with holes, deep hierarchies, and custom orientations.
- **Camera Math**: Heading (0-360), Pitch (-90 to 90), and HPR conversions.
  Triggered when user says "cesium", "cesiumjs", "3d globe", "headless map",
  "tile rendering", "geospatial screenshot", "webgl in docker", "property boundary
  render", "camera position", "cartesian3", "3d tiles", "imagery provider",
  "flyTo", "setView", or describes any CesiumJS-related coding task.
---

# Goal

Provide expert-level CesiumJS guidance that produces working, production-quality
code on first attempt — specializing in headless rendering pipelines that capture
geospatial screenshots inside Docker containers without a GPU.

# Instructions

## 1. Identify the Domain

Determine which of the 6 domains the user's question falls into:

| Domain | Signal Keywords |
|--------|----------------|
| **Viewer Setup** | "new Viewer", "imagery", "terrain", "constructor", "options" |
| **Camera** | "setView", "flyTo", "lookAt", "heading", "pitch", "zoom", "rectangle" |
| **Entities & Data** | "GeoJSON", "polygon", "entity", "3D Tiles", "tileset", "polyline", "billboard" |
| **Headless Rendering** | "screenshot", "puppeteer", "headless", "snapshot", "capture", "off-screen" |
| **Docker / WebGL** | "docker", "container", "swiftshader", "black screen", "WebGL", "GPU", "chrome flags" |
| **Coordinates** | "Cartesian3", "Cartographic", "fromDegrees", "longitude", "latitude", "bounding box" |

- If the question spans multiple domains → address each in order
- If unclear → ask: "Are you working on [X] or [Y]?"

## 2. Viewer Setup

📚 **Full API reference:** `resources/cesium_api_reference.md`

When configuring a `Cesium.Viewer`:

1. **Always disable UI elements** for headless/production rendering:
   ```javascript
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
   });
   ```

2. **Imagery provider selection** — recommend based on use case:
   - **No API key needed:** `OpenStreetMapImageryProvider`
   - **High quality satellite:** Cesium Ion (requires token) or Google Photorealistic
   - **Custom tiles:** `UrlTemplateImageryProvider` with `{z}/{x}/{y}` pattern
   - **No imagery (blank globe):** Set `imageryProvider: false`

3. **Terrain** — recommend `EllipsoidTerrainProvider` for headless (fastest) unless
   terrain elevation accuracy is required

4. **Performance for headless:**
   ```javascript
   viewer.scene.requestRenderMode = true;
   viewer.scene.maximumRenderTimeChange = Infinity;
   viewer.scene.globe.tileCacheSize = 1000;
   viewer.scene.fog.enabled = false;
   viewer.scene.skyAtmosphere.show = false;
   ```

## 3. Camera & Navigation

When positioning the camera:

1. **Static view** (most common for screenshots) — use `camera.setView`:
   ```javascript
   viewer.camera.setView({
     destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
     orientation: {
       heading: Cesium.Math.toRadians(0),   // North
       pitch: Cesium.Math.toRadians(-90),    // Looking straight down (nadir)
       roll: 0,
     },
   });
   ```

2. **Bounding rectangle view** — use `Rectangle.fromDegrees`:
   ```javascript
   viewer.camera.setView({
     destination: Cesium.Rectangle.fromDegrees(west, south, east, north),
   });
   ```

3. **Fly animation** — use `camera.flyTo` (returns a Promise):
   ```javascript
   await viewer.camera.flyTo({
     destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
     duration: 0,  // instant for headless
   });
   ```

4. **Zoom to entity** — use `viewer.zoomTo`:
   ```javascript
   await viewer.zoomTo(entity, new Cesium.HeadingPitchRange(
     Cesium.Math.toRadians(0),    // heading
     Cesium.Math.toRadians(-45),  // pitch
     500                          // range (meters from target)
   ));
   ```

5. **Camera height calculation** from a bounding box:
   - Rule of thumb: `height ≈ max(width, height) * 1.5` in meters
   - For nadir shots: `height = diagonal / (2 * tan(fov/2))`

📚 **Coordinate conversions:** `resources/coordinate_systems.md`

## 4. Entities & Data Sources

### GeoJSON Loading
```javascript
const dataSource = await Cesium.GeoJsonDataSource.load(geojsonData, {
  clampToGround: true,
  stroke: Cesium.Color.RED,
  fill: Cesium.Color.RED.withAlpha(0.3),
  strokeWidth: 3,
});
viewer.dataSources.add(dataSource);
```

### Polygon Entity (inline coordinates)
```javascript
const entity = viewer.entities.add({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      lon1, lat1, lon2, lat2, lon3, lat3, // ... close the ring
    ]),
    height: 0,
    material: Cesium.Color.BLUE.withAlpha(0.4),
    outline: true,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
  },
});
```

### 3D Tiles
```javascript
// From Cesium Ion
const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId);
viewer.scene.primitives.add(tileset);
await viewer.zoomTo(tileset);

// From URL
const tileset = await Cesium.Cesium3DTileset.fromUrl("/path/to/tileset.json");
viewer.scene.primitives.add(tileset);
```

### Google Photorealistic 3D Tiles
```javascript
const tileset = await Cesium.createGooglePhotorealistic3DTileset();
viewer.scene.primitives.add(tileset);
```

## 5. Headless Rendering Pipeline

📚 **Full patterns:** `resources/headless_rendering_patterns.md`
📚 **Example walkthrough:** `examples/example_headless_snapshot.md`

### Architecture (proven pattern)

```
Job JSON → Parse → Launch Puppeteer → Inject CesiumJS HTML → Wait for tiles → Screenshot → PNG
```

1. **Puppeteer launch** for WebGL:
   ```javascript
   const browser = await puppeteer.launch({
     headless: "new",
     args: [
       "--no-sandbox",
       "--disable-setuid-sandbox",
       "--disable-dev-shm-usage",
       "--use-gl=angle",
       "--use-angle=swiftshader",
       "--enable-unsafe-swiftshader",
       "--disable-gpu-sandbox",
     ],
   });
   ```

2. **Inject CesiumJS as inline HTML** (no server required):
   ```javascript
   await page.setContent(`
     <!DOCTYPE html>
     <html>
     <head>
       <script src="https://cesium.com/downloads/cesiumjs/releases/1.119/Build/Cesium/Cesium.js"></script>
       <link href="https://cesium.com/downloads/cesiumjs/releases/1.119/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
       <style>
         html, body, #cesiumContainer { width: 100%; height: 100%; margin: 0; padding: 0; overflow: hidden; }
       </style>
     </head>
     <body>
       <div id="cesiumContainer"></div>
     </body>
     </html>
   `, { waitUntil: "networkidle0" });
   ```

3. **Wait for tile loading** — CRITICAL for non-blank screenshots:
   ```javascript
   await page.evaluate(() => {
     return new Promise((resolve) => {
       const checker = setInterval(() => {
         if (viewer.scene.globe.tilesLoaded) {
           clearInterval(checker);
           viewer.scene.requestRender();
           setTimeout(resolve, 500); // extra buffer for render
         }
       }, 200);
       // Timeout safety
       setTimeout(() => { clearInterval(checker); resolve(); }, 30000);
     });
   });
   ```

4. **Screenshot capture:**
   ```javascript
   await page.screenshot({
     path: outputPath,
     type: "png",
     fullPage: true,
     omitBackground: false,
   });
   ```

5. **Cleanup** — always destroy to prevent memory leaks:
   ```javascript
   await page.evaluate(() => viewer.destroy());
   await page.close();
   await browser.close();
   ```

## 6. Docker / WebGL Configuration

📚 **Debugging guide:** `examples/example_tile_loading_debug.md`

### Required Chrome flags for SwiftShader
```
--no-sandbox
--disable-setuid-sandbox
--use-gl=angle
--use-angle=swiftshader
--enable-unsafe-swiftshader
--disable-gpu-sandbox
--disable-dev-shm-usage
```

### Dockerfile dependencies (Debian/Ubuntu)
```dockerfile
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 libatk-bridge2.0-0 libgtk-3-0 libgbm1 \
    libasound2 libxshmfence1 libglu1-mesa \
    fonts-liberation fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*
```

### Environment variables
```dockerfile
ENV LIBGL_ALWAYS_SOFTWARE=1
ENV CESIUM_BASE_URL=https://cesium.com/downloads/cesiumjs/releases/1.119/Build/Cesium/
```

### Diagnosing black/blank screenshots

| Symptom | Cause | Fix |
|---------|-------|-----|
| Fully black screenshot | WebGL context failed | Add `--enable-unsafe-swiftshader` flag |
| Blue globe, no imagery | Imagery provider failed to load | Check network access, use OSM fallback |
| Globe visible, tiles blurry | Screenshot taken before tiles loaded | Increase wait timeout, check `globe.tilesLoaded` |
| Blank white page | CesiumJS script failed to load | Check CDN URL, use local Cesium build |
| Partial render / cut off | Viewport size mismatch | Set `page.setViewport({ width, height })` before content |

## 7. Coordinate Systems

📚 **Full cheatsheet:** `resources/coordinate_systems.md`

Quick reference for the 3 common conversions:

```javascript
// Degrees → Cartesian3 (most common)
const position = Cesium.Cartesian3.fromDegrees(-98.0, 40.0, 1000);

// Degrees → Cartographic (radians internally)
const carto = Cesium.Cartographic.fromDegrees(-98.0, 40.0, 1000);

// Cartesian3 → Degrees
const carto = Cesium.Cartographic.fromCartesian(cartesian3);
const lon = Cesium.Math.toDegrees(carto.longitude);
const lat = Cesium.Math.toDegrees(carto.latitude);

// Bounding rectangle from degrees
const rect = Cesium.Rectangle.fromDegrees(west, south, east, north);
```

# Examples

## Example 1: Headless property boundary screenshot

**Context:** Render a property boundary polygon as a nadir (top-down) PNG.

**Input:**
```json
{
  "coordinates": [[-97.75, 30.25], [-97.74, 30.25], [-97.74, 30.26], [-97.75, 30.26]],
  "camera": { "heading": 0, "pitch": -90, "height": 800 }
}
```

**Output:** 1920×1080 PNG showing the property boundary with red outline on satellite imagery.

📚 **Full walkthrough:** `examples/example_headless_snapshot.md`

## Example 2: Debugging blank screenshot in Docker

**Context:** Screenshot inside Docker container returns a fully black image.

**Input:** "My Cesium screenshots are coming out completely black inside Docker. I'm using `--disable-gpu` flag."

**Thought Process:**
- `--disable-gpu` disables hardware GPU but ALSO disables SwiftShader software rendering
- Need to replace with `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`
- Also check that `--disable-gpu-sandbox` is present

**Output:** Replace Chrome flags — remove `--disable-gpu`, add the SwiftShader trio.

📚 **Full debugging guide:** `examples/example_tile_loading_debug.md`

# Constraints

- 🚫 NEVER suggest `--disable-gpu` for headless WebGL — it kills software rendering too
- 🚫 NEVER hardcode Cesium Ion tokens in code — always use environment variables
- 🚫 NEVER skip tile-load waiting before screenshots — always wait for `globe.tilesLoaded`
- 🚫 NEVER forget `viewer.destroy()` cleanup — causes memory leaks in multi-render pipelines
- 🚫 NEVER use `flyTo` with duration > 0 in headless pipelines — wastes time, causes timing issues
- ✅ ALWAYS set explicit `page.setViewport()` BEFORE setting page content
- ✅ ALWAYS include a timeout safety net for tile-loading waits (30s max)
- ✅ ALWAYS use `Cesium.Cartesian3.fromDegrees()` not manual Cartesian3 constructor
- ✅ ALWAYS recommend `requestRenderMode: true` for headless to save CPU
- ✅ ALWAYS add `--disable-dev-shm-usage` flag in Docker to prevent Chrome crashes
- ⚠️ CesiumJS coordinate order is `(longitude, latitude)` — opposite of Google Maps `(lat, lng)`
- ⚠️ SwiftShader rendering is ~10x slower than GPU — plan timeout budgets accordingly
- ⚠️ CesiumJS CDN versions change — always pin to a specific release version number

<!-- Generated by Skill Creator Ultra v1.1 -->
