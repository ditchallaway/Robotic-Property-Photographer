# Human-in-the-Loop PSD Workflow

## Problem

The multi-pass rendering pipeline (4 separate screenshots per shot: map, boundary, labels, acreage) is fragile. Automating label placement and acreage positioning in CesiumJS adds complexity without enough reliability for production use. Meanwhile, the human operator already knows how to finish these images — they just need a head start.

## Design

**Ship what works. Give the human a head start.**

### Core Flow

```
POST /api/render { lat, lon, geometry, ll_gisacre, ... }
  │
  ├─ CesiumJS: single render pass (map + boundary) × 5 shots
  ├─ Server: fetch OSM roads → road name list
  ├─ Server: compute acreage label text
  ├─ ag-psd: compose PSD per shot
  │    ├─ "Background" — map + boundary raster (one screenshot)
  │    ├─ "Road: Elm St" — editable text layer
  │    ├─ "Road: Main Ave" — editable text layer
  │    └─ "6.19 ACRES" — editable text layer
  ├─ (Optional) Upload PSDs to Cloudflare R2
  └─ Return JSON with PSD URLs + Static Map URL
         │
         ▼
n8n assembles Photopea URL → pushes via ntfy.sh → human opens & finishes
```

### What Changes

| Before | After |
|--------|-------|
| 4 render passes per shot (map, boundary, labels, acreage) | **1 render pass** per shot (map + boundary together) |
| Labels rendered as CesiumJS canvas bitmaps | **Text layers** written directly by `ag-psd` |
| Acreage rendered as CesiumJS billboard | **Text layer** written directly by `ag-psd` |
| Boundary on separate transparent layer | **Baked into background** with map |
| No upload — local paths only | **Optional R2 upload** (env-gated) |
| No reference map | **Google Static Map URL** with road labels for human reference |

### PSD Structure (per shot)

```
Layer Stack (top → bottom):
  ├─ "6.19 ACRES"      — text layer, yellow, 80pt, predictable position
  ├─ "Road: Elm St"     — text layer, white, 48pt, stacked in margin
  ├─ "Road: Main Ave"   — text layer, white, 48pt, stacked in margin
  └─ "Background"       — raster layer (map + yellow boundary, single screenshot)
```

Text layers use predictable stacked positions (not geo-projected). The human uses the Google Static Map reference to see where roads are, then drags text layers into position.

### Google Static Map Reference

Generated URL with:
- `maptype=satellite` + default road labels
- Property boundary drawn via `path` parameter (yellow)
- Custom style hiding POIs/transit (roads only)
- Opened in Photopea alongside the PSD via `pea.openFromURL(..., true)`

### R2 Upload (Optional)

Gated by env vars:
- `R2_ENDPOINT` — S3-compatible endpoint
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_URL` — public base URL for file access

When absent: PSD saved locally, local paths returned.
When present: PSD uploaded, public URLs returned.

### Renderer Simplification

- **Remove** from `render.html`: label billboard rendering, acreage billboard rendering, transparent overlay passes (labels, acreage), separate boundary pass
- **Keep**: map + boundary rendered together in one pass, tile loading, camera system
- **Remove** from `render.js`: `capturePass` logic for labels/acreage/boundary, simplify to single-pass capture
- **Modify** `psdComposer.js`: add text layer support (using `ag-psd` text layer API)
- **Keep** `osmRoads.js`: still used server-side for road name data
- **Keep** `acreageLabel.js`: still used for text computation (position data ignored for now)

### API Response (Updated)

```json
{
  "status": "success",
  "customer_id": "cust_123",
  "order_id": "order_456",
  "shots": {
    "nadir": { "psd_path": "/tmp/...", "psd_url": "https://r2/..." },
    "cardinal": { "psd_path": "/tmp/...", "psd_url": "https://r2/..." },
    "east": { "psd_path": "/tmp/...", "psd_url": "https://r2/..." },
    "south": { "psd_path": "/tmp/...", "psd_url": "https://r2/..." },
    "west": { "psd_path": "/tmp/...", "psd_url": "https://r2/..." }
  },
  "static_map_url": "https://maps.googleapis.com/maps/api/staticmap?...",
  "roads": ["Elm St", "Main Ave"],
  "acreage": "6.19 ACRES"
}
```

`psd_url` is `null` when R2 is not configured.

## Verification Plan

### Automated Test (inside Docker)

Update `tests/cardinal.js` to:
1. POST to `/api/render` with single shot `["cardinal"]` and no capabilities filter
2. Verify response JSON structure matches new schema
3. Verify PSD file exists at returned path
4. Verify PSD contains expected layers (Background + text layers)

```bash
docker compose exec moonshot node tests/cardinal.js
```

### Manual Verification

1. Run the cardinal test
2. Open the generated PSD in Photopea (or locally) — confirm:
   - Background layer shows map with yellow boundary
   - Text layers exist for road names and acreage
   - Text layers are editable (not rasterized)
3. Open the `static_map_url` from the response in a browser — confirm road labels visible
4. Visually check the test results via `test-results/index.html`
