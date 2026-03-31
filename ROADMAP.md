# Robotic Property Photographer — Project Roadmap

> A living document. Updated as phases complete and new intent is defined.
>
> **Current Objective:** Stateless headless renderer that converts parcel geometry into **exactly 5 deterministic PNG images**.
>
> **Architecture constraint:** This service is a stateless rendering engine. It receives a JSON payload and returns PNG assets. Long-term storage, job queuing, and notifications are handled by upstream n8n.

---

## ✅ Phase 1 — Rendering Foundation (Completed)
- [x] Next.js app scaffolded in Docker (`moonshot` container)
- [x] **High-Performance Standalone Renderer**: Bypassed React hydration for Puppeteer using `public/render.html`.
- [x] CesiumJS integrated with headless Chromium via Puppeteer.
- [x] Viewport locked at **2048 × 1536 px** (4:3 aspect ratio).
- [x] Sequential render queue (1 job at a time) — prevents WebGL OOM crashes.
- [x] `/api/render` POST endpoint accepting centroid and GeoJSON.

## ✅ Phase 2 — Camera & Boundary System (Completed)
- [x] **Deterministic headings:** 0°, 90°, 180°, 270° (True North aligned).
- [x] **FOV:** 100°.
- [x] **Boundary Rendering:** GeoJSON polygon → Yellow polyline (3px), clamped to terrain.
- [x] **Auto-framing:** Smart `flyToBoundingSphere` logic for consistent property sizing.

## ✅ Phase 3 — Simplified PNG Output (Completed)
- [x] Service optimized to return exactly 5 PNGs (North, East, South, West, Nadir).
- [x] Removed dependency on `ag-psd` and complex layering logic.
- [x] Removed OSM road data fetching and acreage calculation (simplified scope).
- [x] Black-frame detection: warns when tiles fail to load (< 5% non-black pixels).

## ✅ Phase 4 — Test Infrastructure (Completed)
- [x] `test-api.cjs` — End-to-end API integration test verifying the 5-PNG output.
- [x] `test-gl.js` — WebGL diagnostic script for headless environment.

## 🔜 Phase 5 — Production Hardening
- [ ] Render timeout: kill job and return `{ status: "timeout" }` after N seconds.
- [ ] Health check endpoint (`/api/health`) for Docker + n8n polling.
- [ ] Graceful Puppeteer teardown on container SIGTERM.

---

## Removed / Deprecated Features
*The following features were part of previous project goals and have been removed to simplify the engine and improve reliability:*

*   **PSD Compositing:** Layered PSD output with editable text layers.
*   **Street Label Data:** OSM road name fetching and overlay.
*   **Acreage Overlay:** Calculation and rendering of parcel acreage.
*   **External Storage:** Built-in Cloudflare R2 uploads (now handled by upstream n8n).
*   **Photopea Integration:** Deep-linking for manual layer correction.
*   **ntfy.sh Notifications:** Direct push notifications from the renderer.

---

## Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Rendering engine | CesiumJS (headless, via Puppeteer) |
| Web framework | Next.js |
| Container | Docker / Docker Compose |
| 3D tiles | Google Photorealistic 3D Tiles |
| Terrain | CesiumWorldTerrain |
| Image processing | sharp (black-frame detection) |
| Orchestration | n8n (upstream, not in this repo) |
