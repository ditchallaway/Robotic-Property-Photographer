# Road Label Generation (Spec)

## Purpose
Generate deterministic, human-readable road labels for rendered property images.  
Labels must reflect real road geometry, be visible in-frame, and remain readable across nadir and oblique camera views.  
All label data is exported only (sidecar-driven); no dependency on Cesium at consumption time.

---

## Data Source
**Google Vector Map Tiles** — Road layer only.

- Raw vector geometry (LineString / MultiLineString)
- Road classification (highway, major, local)
- Human-readable road names
- Fetched server-side prior to rendering

No tile introspection, feature picking, or runtime scraping.

---

## Coordinate Space
All computations occur in **ENU (East-North-Up)** space derived from:
- Parcel centroid
- Ground plane definition
- Camera extrinsics

---

## Road Classification
Roads are categorized into three logical classes:
- `highway` (motorway, trunk)
- `major` (primary, secondary)
- `local`

Classification influences selection priority and search radius.

---

## Road Graph & Backbone Resolution
A lightweight road graph is constructed from vector geometry.

### Anchor highway resolution:
1. Select nearest **visible highway** (projects into any camera frustum).
2. If none qualify:
   - Traverse connected roads outward from parcel-adjacent roads.
   - Promote the largest connected `major` road.
   - Repeat recursively until a backbone road is identified.

This guarantees a meaningful “destination” road for labeling.

---

## Visibility Rules (Hard Gate)
A road is eligible for a given view **only if**:
- At least one segment projects inside the image viewport.
- Segment depth > 0 (in front of camera).
- Projected screen-space length exceeds a minimum threshold.

Distance alone is never sufficient.  
If it cannot be seen, it does not exist.

---

## Per-View Selection Logic
Executed independently for each image (north, south, east, west, nadir).

Selection order:
1. **Property access road** (if visible) → always included
2. **Anchor highway** (if visible or near-visible)
3. Remaining visible roads:
   - Sort by distance to parcel centroid (ENU)
   - Include closest until cap is reached

### Limits
- Maximum: **3 roads + 1 highway** per image
- Allow **zero labels** if nothing qualifies

---

## Anchor Point Resolution
For each selected road:
- Compute closest visible point on polyline to parcel centroid
- Offset slightly perpendicular to road bearing (avoid overlap)
- Apply small +Z lift (anti z-fighting)

---

## Label Orientation

### Nadir View
- Plane: **ground**
- Normal: ground plane normal
- Rotation: road bearing (ENU)
- Appears flat, sticker-like

### Oblique Views (N/E/S/W)
- Plane: **vertical**
- Up vector: ENU up
- Facing direction: camera forward vector projected onto ground plane
- Text baseline aligned to projected road bearing

No billboarding. Orientation is fixed and deterministic.

---

## Rendering Assumptions
- Labels are rendered as textured quads
- Depth test enabled, depth write disabled
- No runtime camera-relative behavior

---

## Output (Sidecar Schema)
Labels are exported with sufficient data to recreate the image exactly.

```json
{
  "labels": [
    {
      "text": "US-95",
      "class": "highway",
      "anchor_enu": [x, y, z],
      "bearing": radians,
      "plane": "vertical",
      "view": "north"
    }
  ]
}
