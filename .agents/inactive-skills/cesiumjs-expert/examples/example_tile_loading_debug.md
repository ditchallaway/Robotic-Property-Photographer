# Example: Debugging Blank/Black Screenshots in Docker

> Edge case — diagnosing and fixing the most common headless rendering failures.

---

## Scenario

User is running a CesiumJS headless rendering pipeline inside a Docker container.
Screenshots are coming out as solid black, solid blue, or completely blank images.

---

## Problem 1: Completely Black Screenshot

**Input:** "My Cesium screenshots are coming out completely black inside Docker."

**Diagnosis checklist:**

```
1. ❓ Which Chrome flags are you using?
   → Look for --disable-gpu (this is the #1 cause)

2. ❓ Is --enable-unsafe-swiftshader present?
   → Required since Chrome 112+

3. ❓ Is the container based on node:alpine?
   → Alpine lacks many required shared libraries
```

**Root cause:** `--disable-gpu` disables ALL GPU processing, including software rendering.

**Fix:**

```diff
  const browser = await puppeteer.launch({
    args: [
-     "--disable-gpu",
+     "--use-gl=angle",
+     "--use-angle=swiftshader",
+     "--enable-unsafe-swiftshader",
+     "--disable-gpu-sandbox",
    ],
  });
```

**Verification:** Add this check before taking a screenshot:

```javascript
const webglWorks = await page.evaluate(() => {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!gl) return { working: false, error: "No WebGL context" };
  return {
    working: true,
    renderer: gl.getParameter(gl.RENDERER),
    vendor: gl.getParameter(gl.VENDOR),
  };
});
console.log("WebGL status:", webglWorks);
// Expected: { working: true, renderer: "Google SwiftShader", vendor: "Google Inc." }
```

---

## Problem 2: Blue Globe, No Imagery Tiles

**Input:** "I can see the blue globe but there are no map tiles loading."

**Diagnosis:**

| Check | How | Expected |
|-------|-----|----------|
| Network access | `await page.goto("https://tile.openstreetmap.org/0/0/0.png")` | 200 OK |
| Cesium Ion token | Check `Cesium.Ion.defaultAccessToken` | Non-empty string if using Ion |
| DNS resolution | `docker exec <container> nslookup tile.openstreetmap.org` | Resolves |
| Console errors | `page.on("console", msg => console.log(msg.text()))` | No 403/404 errors |

**Common fixes:**

```javascript
// Fix 1: Imagery provider not loading — use explicit OSM provider
const viewer = new Cesium.Viewer("cesiumContainer", {
  imageryProvider: new Cesium.OpenStreetMapImageryProvider({
    url: "https://tile.openstreetmap.org/",
  }),
  // Remove: baseLayer: false,  ← this disables default imagery
});

// Fix 2: Ion token expired or missing
Cesium.Ion.defaultAccessToken = process.env.CESIUM_ION_TOKEN;
// Verify: if (!Cesium.Ion.defaultAccessToken) console.error("No Ion token!");

// Fix 3: Docker network issues — fallback to a TMS server
const fallback = new Cesium.UrlTemplateImageryProvider({
  url: "https://your-cached-tiles.s3.amazonaws.com/{z}/{x}/{y}.png",
  minimumLevel: 0,
  maximumLevel: 18,
});
```

---

## Problem 3: Globe Visible But Tiles Are Blurry

**Input:** "The globe loads and shows map data but the tiles are super low resolution and blurry."

**Root cause:** Screenshot was captured before high-resolution tiles finished loading.

**Fix:** Improve tile-loading wait strategy:

```javascript
// BAD — fixed timeout (unreliable)
await new Promise(r => setTimeout(r, 5000));
await page.screenshot({ path: "output.png" });

// GOOD — poll for tile completion
await page.evaluate(() => {
  return new Promise((resolve) => {
    let stableCount = 0;
    const check = setInterval(() => {
      if (viewer.scene.globe.tilesLoaded) {
        stableCount++;
        // Wait for 3 consecutive "loaded" checks (debounce)
        if (stableCount >= 3) {
          clearInterval(check);
          viewer.scene.requestRender();
          setTimeout(resolve, 500);
        }
      } else {
        stableCount = 0; // reset if new tiles start loading
      }
    }, 300);
    // Hard timeout at 45 seconds
    setTimeout(() => { clearInterval(check); resolve(); }, 45000);
  });
});
```

**Additional fix — increase tile cache:**

```javascript
viewer.scene.globe.tileCacheSize = 1000; // default is 100
```

---

## Problem 4: Blank White Page

**Input:** "Screenshot is completely white — no globe at all."

**Diagnosis:**

```javascript
// Check 1: Did CesiumJS load?
const cesiumLoaded = await page.evaluate(() => typeof Cesium !== "undefined");
console.log("Cesium loaded:", cesiumLoaded);

// Check 2: Did the viewer initialize?
const viewerReady = await page.evaluate(() => {
  return typeof viewer !== "undefined" && !viewer.isDestroyed();
});
console.log("Viewer ready:", viewerReady);

// Check 3: Any JavaScript errors?
page.on("pageerror", err => console.error("Page error:", err.message));
page.on("console", msg => {
  if (msg.type() === "error") console.error("Console error:", msg.text());
});
```

**Common causes & fixes:**

| Cause | Fix |
|-------|-----|
| CesiumJS CDN blocked by Docker network | Use local Cesium build: `COPY node_modules/cesium/Build/ /app/public/cesium/` |
| Viewport not set before content | Add `await page.setViewport({width, height})` BEFORE `page.setContent()` |
| Container has no internet | `docker run --network=host` or pre-cache tiles |
| Wrong Cesium version URL | Pin to exact version: `releases/1.119/Build/Cesium/Cesium.js` |

---

## Problem 5: Partial Render / Cut Off Image

**Input:** "The screenshot is showing only part of the globe — it's cropped weirdly."

**Fix — ensure viewport matches content dimensions:**

```javascript
// Correct order:
const WIDTH = 1920;
const HEIGHT = 1080;

// 1. Set viewport FIRST
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

// 2. Set content with matching dimensions
await page.setContent(`
  <style>
    html, body, #cesiumContainer {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  </style>
  ...
`);

// 3. Screenshot with explicit clip
await page.screenshot({
  type: "png",
  clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
});
```

---

## Problem 6: Chrome Crashes / OOM in Docker

**Input:** "Chrome keeps crashing inside the container with signal 9 (SIGKILL)."

**Fixes:**

```yaml
# docker-compose.yml — increase shared memory
services:
  renderer:
    shm_size: "1gb"  # default is 64mb — far too small for WebGL
```

```javascript
// Puppeteer args — avoid shared memory
"--disable-dev-shm-usage",  // write to /tmp instead
```

```dockerfile
# Dockerfile — set memory limits
# Don't constrain Docker memory below 1GB for WebGL rendering
```

```javascript
// Code — destroy viewer between renders
await page.evaluate(() => {
  if (window.viewer && !window.viewer.isDestroyed()) {
    window.viewer.destroy();
  }
});
await page.close(); // close page to free memory
// Only close browser after all pages are done
```

---

## Quick Diagnostic Script

Run this inside the container to verify WebGL works:

```javascript
// diagnostic.js — run with: node diagnostic.js
const puppeteer = require("puppeteer");

(async () => {
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
  await page.setViewport({ width: 800, height: 600 });
  await page.setContent(`<canvas id="c" width="800" height="600"></canvas>`);

  const result = await page.evaluate(() => {
    const canvas = document.getElementById("c");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return { webgl: false, error: "No context" };

    // Draw a red triangle to verify rendering works
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, "attribute vec4 p;void main(){gl_Position=p;}");
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, "void main(){gl_FragColor=vec4(1,0,0,1);}");
    gl.compileShader(fs);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog); gl.useProgram(prog);

    return {
      webgl: true,
      renderer: gl.getParameter(gl.RENDERER),
      vendor: gl.getParameter(gl.VENDOR),
      version: gl.getParameter(gl.VERSION),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    };
  });

  console.log("=== WebGL Diagnostic ===");
  console.log(JSON.stringify(result, null, 2));
  // Expected:
  // { webgl: true, renderer: "Google SwiftShader", vendor: "Google Inc.",
  //   version: "OpenGL ES 3.0 SwiftShader ...", maxTextureSize: 8192 }

  await page.screenshot({ path: "/tmp/diagnostic.png" });
  console.log("Screenshot saved to /tmp/diagnostic.png");

  await browser.close();
})();
```
