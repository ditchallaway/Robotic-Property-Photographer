# Fix Map Tiles Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore map tiles and optimize globe detail in the Cesium renderer to prevent solid blue earth renders.

**Architecture:** Modify `generateCesiumHTML` in `src/renderer.js` to replace the restrictive `baseLayer: false` with an OpenStreetMap provider and enforce maximum globe detail via `maximumScreenSpaceError`.

**Tech Stack:** Cesium.js, Puppeteer, Sharp, Node.js.

---

### Task 1: Replace baseLayer with OpenStreetMap Provider

**Files:**
- Modify: `src/renderer.js:288`

**Step 1: Replace baseLayer: false**
- Remove line 288: `baseLayer: false`
- Replace with:
```javascript
            imageryProvider: new Cesium.OpenStreetMapImageryProvider({
                url: "https://tile.openstreetmap.org/"
            }),
```

**Step 2: Commit**
```bash
git add src/renderer.js
git commit -m "fix: replace baseLayer: false with OpenStreetMap imagery provider"
```

### Task 2: Optimize Globe Detail

**Files:**
- Modify: `src/renderer.js:304-306`

**Step 1: Set globe maximumScreenSpaceError**
- Add after line 304 (where tileset is added):
```javascript
                viewer.scene.globe.maximumScreenSpaceError = 1.0;
```

**Step 2: Commit**
```bash
git add src/renderer.js
git commit -m "perf: set globe maximumScreenSpaceError to 1.0 for better detail"
```

### Task 3: Verify Fix with Visual Integration Tests

**Files:**
- Test: `tests/cardinal.js`
- Test: `tests/nadir.js`

**Step 1: Start the server in background**
Run: `npm start &`
Wait for `[Server] Robotic Property Photographer listening on port 9876`

**Step 2: Run Cardinal Test**
Run: `npm run test:cardinal`
Expected: `✅ Dynamic Image Validation Passed.` (specifically `Terrain Unique Colors >= 1000`)

**Step 3: Run Nadir Test**
Run: `npm run test:nadir`
Expected: `✅ Dynamic Image Validation Passed.` (specifically `Terrain Unique Colors >= 1000`)

**Step 4: Cleanup**
Run: `pkill -f "node src/index.js"`
