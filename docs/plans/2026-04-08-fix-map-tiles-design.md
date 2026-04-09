# Design: Map Tile Restoration & Quality Optimization

## Problem
Test images render with a correct sky/atmosphere but the earth surface is solid blue. This is because the CesiumJS Viewer is initialized with `baseLayer: false`, which completely disables the globe's imagery layer. Any area not covered by the Google Photorealistic 3D Tileset renders as the bare blue ellipsoid.

## Approach: ImageryProvider + Globe Quality Improvement
We will replace the `baseLayer: false` option with an explicit OpenStreetMap imagery provider and enforce maximum globe detail to satisfy project quality requirements.

## Proposed Changes

### `src/renderer.js`
- In `generateCesiumHTML()`, modify the `Cesium.Viewer` constructor options:
    - Remove `baseLayer: false`.
    - Add `imageryProvider: new Cesium.OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" })`.
- In the same function, after tileset initialization:
    - Add `viewer.scene.globe.maximumScreenSpaceError = 1.0;` to force maximum detail on the globe fallback.

## Verification Plan
1.  **Automated Tests**:
    - Run `node tests/cardinal.js`.
    - Run `node tests/nadir.js`.
2.  **Success Criteria**:
    - `Terrain Unique Colors` ≥ 1000.
    - `Yellow Boundary Pixels` ≥ 100.
    - No solid blue sphere in visually inspected results.
