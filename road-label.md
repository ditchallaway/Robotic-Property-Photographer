# Road Label Generation — Deterministic Export-Only Spec

## NON-NEGOTIABLE CONSTRAINTS (READ FIRST)

1. **EXPORT ONLY**
   - No labels are rendered in Cesium.
   - No quads, textures, billboards, or primitives are created.
   - Output is sidecar JSON only.

2. **NO SERVERS**
   - Do NOT start `next dev`, `npm run dev`, or any background server.
   - Do NOT bind ports.
   - Execution is driven only by the existing render/test pipeline.

3. **STRICT PROCESS BOUNDARY**
   - Server: fetches and prepares road data only.
   - Browser (Cesium): performs visibility + math only.
   - Puppeteer: captures console output only.
   - No logic may cross these boundaries.

4. **EXACT CONSOLE PROTOCOL**
   - The ONLY valid emission format is:
     ```
     console.log('SIDECAR_DATA', viewName, labelArray)
     ```
   - No colons, no JSON prefix, no extra arguments, no wrapping.

Violation of any item above is a spec failure.

---

## Purpose
Generate deterministic, human-readable road labels for rendered property images.

Labels:
- Must correspond to real road geometry
- Must be visible in-frame
- Must be readable in nadir and oblique views
- Must be fully reconstructable from sidecar JSON alone

---

## Data Source (SERVER ONLY)
Authoritative Vector Road Tiles (MVT/PBF)
Data source must expose raw road geometry (LineString/MultiLineString).
Provider is implementation-defined and approved separately.

Allowed:
- Raw vector geometry (LineString / MultiLineString)
- Road name (human-readable)
- Road kind/class

Forbidden:
- Tile feature picking
- Cesium tileset introspection
- Client-side tile fetching

Server output = plain road geometry + attributes.

---

## Coordinate Space
All math is performed in **ENU (East-North-Up)** space derived from:
- Parcel centroid
- Ground plane definition
- Cesium camera matrices (browser only)

Server code must NOT assume ENU.

---

## Road Classification
Map Google kinds into exactly three classes:

- `highway` → motorway, trunk
- `major` → primary, secondary
- `local` → everything else

Classification affects priority only, never visibility.

---

## Road Graph & Backbone Resolution (SERVER)

1. Build a lightweight graph from road geometry.
2. Identify **property-adjacent roads** (intersect parcel buffer).
3. Resolve a single **anchor highway**:
   - Prefer nearest highway connected to property roads.
   - If none:
     - Traverse outward through connected majors.
     - Promote the largest connected major.
     - Repeat until a backbone exists.

Server output includes:
- Road geometry
- Road class
- Connectivity metadata

No visibility decisions here.

---

## Visibility Rules (BROWSER — HARD GATE)

A road exists for a given view **only if**:

1. At least one segment projects inside the camera viewport
2. Projected depth > 0 (in front of camera)
3. Projected screen-space length ≥ minimum threshold

Distance alone is irrelevant.
If it cannot be seen, it does not exist.

---

## Per-View Selection Logic (BROWSER)

Executed independently for:
`north`, `south`, `east`, `west`, `nadir`

Selection order:
1. Property access road (if visible) — always included
2. Anchor highway (if visible or near-visible)
3. Remaining visible roads:
   - Sort by ENU distance to parcel centroid
   - Include closest until cap reached

Limits:
- Max **3 non-highway roads + 1 highway**
- Zero labels is valid

---

## Anchor Point Resolution (BROWSER)

For each selected road:
- Find closest visible point on polyline to parcel centroid
- Offset slightly perpendicular to road bearing
- Apply small +Z lift to avoid z-fighting

---

## Label Orientation (BROWSER — NO BILLBOARDS)

### Nadir
- Plane: `ground`
- Normal: ground plane normal
- Rotation: road bearing (ENU)

### Oblique (N/E/S/W)
- Plane: `vertical`
- Up: ENU up
- Facing: camera forward projected onto ground plane
- Baseline aligned to projected road bearing

Orientation is fixed and deterministic.

---

## Rendering
❌ No rendering occurs in this system.

This spec explicitly forbids:
- Cesium label primitives
- Textured quads
- Canvas textures
- Screen-space scaling

Rendering is a downstream concern.

---

## Output (SIDE-ONLY)

The browser emits exactly one payload per view:

```json
{
  "labels": [
    {
      "text": "US-95",
      "class": "highway",
      "anchor_enu": [x, y, z],
      "bearing": radians,
      "plane": "vertical",
      "view": "north",
      "label_width_m": 32
    }
  ]
}
