---
name: Cesium Headless Renderer
description: Expert skill for generating high-quality property boundary PNG images from Cesium.js within a headless Docker environment. Enforces strict rendering constraints, tile loading validation, and hardware-accelerated Puppeteer configurations.
---

# Cesium Headless Renderer

## Overview

This skill specializes in the "Headless Renderer" pattern for Cesium.js applications. It is designed to reliably produce consistent, high-resolution snapshots in a stateless, build-free environment (e.g., Docker + Puppeteer).

## Core Rendering Constraints

All rendering operations MUST follow these strict hardware and software configurations to ensure stability and avoid common pitfalls like blank PNGs or memory crashes.

### 1. Concurrency & Resource Management
- **Sequential Rendering**: Always render jobs **Sequentially** (1 at a time). Parallel jobs can exceed the 2GB SHM limit and cause WebGL memory crashes.
- **Queue Implementation**: Wrap all render logic in a `renderQueue` promise to prevent race conditions.

### 2. Puppeteer Launch Configuration
Every Puppeteer launch MUST include these specific flags to enable hardware acceleration and stable WebGL performance in headless mode:
```javascript
const browser = await puppeteer.launch({
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader'
  ]
});
```

### 3. Viewer Initialization
To prevent capturing blank images, the Cesium Viewer must be initialized with `preserveDrawingBuffer`:
```javascript
const viewer = new Cesium.Viewer('cesiumContainer', {
  contextOptions: {
    webgl: {
      preserveDrawingBuffer: true
    }
  }
  // ... other options
});
```

### 4. Quality & Aspect Ratio
- **Resolution**: Output MUST be **2048 x 1536 px** (4:3 aspect ratio).
- **Field of View (FOV)**: Set to **100 degrees**.
- **Detail Level**: Set `viewer.scene.globe.maximumScreenSpaceError = 1.0` before capture to force maximum tile detail.

## Rendering Lifecycle & Validation

Never take a shortcut on tile loading. A "Success" status is only granted if the frame is fully loaded and passes pixel density checks.

### Tile Loading Gate (waitForTiles)
Do NOT rely solely on `scene.render()`. A screenshot must only be captured when:
1. `viewer.scene.globe.tilesLoaded === true`.
2. **Tile Stability**: Use a `waitForTiles` function to ensure at least **3 consecutive stable ticks** (approx. 900ms) where no new tiles are requested.

### Shot Alignment
Shots must be aligned to True North. Standard property headings are:
- `0` (North)
- `90` (East)
- `180` (South)
- `270` (West)

### Verification Gate
A snapshot is only considered a "Success" if post-capture analysis (e.g., using `sharp`) confirms non-black pixel density is **> 5%**. This catches edge cases where the renderer might produce a valid PNG file that is visually empty or corrupted.

## Usage Scenarios

| Task | Pattern |
| :--- | :--- |
| **New Shot Request** | Add to `renderQueue` -> Apply True North heading -> `waitForTiles` -> Capture. |
| **High-Res Export** | Set resolution to 2048x1536 -> Force `maximumScreenSpaceError = 1.0`. |
| **Stuck Loader** | Verify `tilesLoaded` state; ensure `preserveDrawingBuffer` is enabled. |

## OSM Data Guardrails (Road Labels)
When rendering road overlays:
- Source road data strictly from OpenStreetMap (OSM) `way[highway]` tags.
- Do NOT query `relation[type=route]` or infer route names across multiple ways.
- Label text is taken strictly from: `name` → `ref` → `alt_name`.
- If no name/ref exists, the road must be excluded from the label layer.

---
> [!IMPORTANT]
> This skill assumes an upstream instance (e.g., n8n) handles all triggers, storage, and error notifications. The local engine remains stateless.
