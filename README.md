# Robotic Property Photographer - Drone Scale Engine

A headless rendering microservice built on Next.js and CesiumJS, designed to generate consistent, professional 3D property imagery via API for n8n-driven workflows.

## 🚀 Role & Scope
**Stateless Worker**: This service is a rendering engine. It does NOT handle long-term storage, job queuing, or notifications. It receives a coordinate/geometry and returns images.
**Orchestration**: Designed to be triggered by **n8n**.

## 🏗️ Architecture Pillars

### Pillar 1: Terrain-Aware Inverse Scaling (v1.3.0-inverse)
Professional Drone-Scale perspectives using fixed-parameter inverse-scaling:
- **Relative Height ($H$):** $1200 - (\sqrt{gisacre} \times 20)$
- **Absolute Altitude ($A$):** $GroundElevation + H$
- **Step-Back Distance ($D$):** $0.03 / \sqrt{gisacre}$

### Pillar 2: 5-Point Automated Shot List
Deterministic camera sequence triggered via `/api/render`:
1. **Nadir**: Directly overhead (90°)
2. **North View**: Facing South (Heading 180°, Tilt 66°)
3. **South View**: Facing North (Heading 0°, Tilt 66°)
4. **East View**: Facing West (Heading 270°, Tilt 66°)
5. **West View**: Facing East (Heading 90°, Tilt 66°)

### Pillar 3: Boundary & Styling (Phase 1)
- Supports **GeoJSON** injection for property lines.
- **Clamped to Ground**: Ensures lines drape over Google 3D buildings.
- **Styling**: Accepts hex codes and opacity for stroke/fill.

## 🔌 API Interface (POST `/api/render`)
**Input JSON:**
```json
{
  "lat": 34.0522,
  "lon": -118.2437,
  "acreage": 5.2,
  "geojson": { ... },
  "style": { "stroke": "#FF0000", "weight": 2 }
}
```
**Output JSON:**
```json
{
  "status": "success",
  "frames": ["base64_string_1", "base64_string_2", ...]
}
```