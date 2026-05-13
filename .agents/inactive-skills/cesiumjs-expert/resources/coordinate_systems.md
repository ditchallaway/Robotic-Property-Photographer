# CesiumJS Coordinate Systems Cheatsheet

> CesiumJS uses 3 coordinate representations internally.
> The #1 source of bugs is mixing them up or using wrong argument order.

---

## ⚠️ Critical: Argument Order

```
CesiumJS:    (longitude, latitude)  ← DEGREES: west/east first
Google Maps: (latitude, longitude)  ← opposite!
GeoJSON:     [longitude, latitude]  ← same as Cesium
```

**If your points appear in the ocean off the coast of Africa, you swapped lat/lon.**

---

## The 3 Coordinate Types

| Type | Units | Used For | Example |
|------|-------|----------|---------|
| **Cartesian3** | meters (ECEF XYZ) | Entity positions, camera destinations | `Cesium.Cartesian3.fromDegrees(-97.75, 30.25, 100)` |
| **Cartographic** | radians + meters | Internal math, terrain sampling | `Cesium.Cartographic.fromDegrees(-97.75, 30.25, 100)` |
| **Degrees** | degrees | Human-readable, GeoJSON, API input | `[-97.75, 30.25]` |

---

## Conversion Reference

### Degrees → Cartesian3 (most common)

```javascript
// Single point
const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
// height is optional, defaults to 0 (surface)

// Array of points (for polygons/polylines) — flat array: lon1, lat1, lon2, lat2, ...
const positions = Cesium.Cartesian3.fromDegreesArray([
  -97.75, 30.25,
  -97.74, 30.25,
  -97.74, 30.26,
  -97.75, 30.26,
]);

// Array with heights — flat array: lon1, lat1, h1, lon2, lat2, h2, ...
const positions = Cesium.Cartesian3.fromDegreesArrayHeights([
  -97.75, 30.25, 100,
  -97.74, 30.25, 200,
]);
```

### Degrees → Cartographic

```javascript
const carto = Cesium.Cartographic.fromDegrees(longitude, latitude, height);
// .longitude is in RADIANS
// .latitude is in RADIANS
// .height is in METERS
```

### Cartesian3 → Degrees

```javascript
const cartesian = Cesium.Cartesian3.fromDegrees(-97.75, 30.25, 100);

// Step 1: Cartesian3 → Cartographic (radians)
const carto = Cesium.Cartographic.fromCartesian(cartesian);

// Step 2: Radians → Degrees
const longitude = Cesium.Math.toDegrees(carto.longitude);
const latitude = Cesium.Math.toDegrees(carto.latitude);
const height = carto.height; // already in meters
```

### Cartographic → Cartesian3

```javascript
const carto = Cesium.Cartographic.fromDegrees(-97.75, 30.25, 100);
const cartesian = Cesium.Cartographic.toCartesian(carto);
// OR
const cartesian = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height);
```

### Radians ↔ Degrees

```javascript
const radians = Cesium.Math.toRadians(90);    // 90° → π/2
const degrees = Cesium.Math.toDegrees(Math.PI); // π → 180°
```

---

## Rectangle (Bounding Box)

```javascript
// From degrees (west, south, east, north)
const rect = Cesium.Rectangle.fromDegrees(-97.76, 30.24, -97.73, 30.27);

// Properties (in RADIANS)
rect.west    // western boundary (longitude, radians)
rect.south   // southern boundary (latitude, radians)
rect.east    // eastern boundary (longitude, radians)
rect.north   // northern boundary (latitude, radians)

// Center point
const center = Cesium.Rectangle.center(rect);
// → Cartographic (radians)

// Use as camera destination (fits view to rectangle)
viewer.camera.setView({ destination: rect });
```

### Compute bounding rectangle from coordinates

```javascript
function boundingRectFromDegrees(coords) {
  // coords = [[lon, lat], [lon, lat], ...]
  let west = Infinity, south = Infinity, east = -Infinity, north = -Infinity;

  for (const [lon, lat] of coords) {
    west = Math.min(west, lon);
    south = Math.min(south, lat);
    east = Math.max(east, lon);
    north = Math.max(north, lat);
  }

  return Cesium.Rectangle.fromDegrees(west, south, east, north);
}
```

### Add padding to bounding rectangle

```javascript
function padRectangle(rect, paddingDegrees) {
  return Cesium.Rectangle.fromDegrees(
    Cesium.Math.toDegrees(rect.west) - paddingDegrees,
    Cesium.Math.toDegrees(rect.south) - paddingDegrees,
    Cesium.Math.toDegrees(rect.east) + paddingDegrees,
    Cesium.Math.toDegrees(rect.north) + paddingDegrees,
  );
}
```

---

## GeoJSON ↔ CesiumJS Coordinate Mapping

### GeoJSON coordinate order
```
GeoJSON uses [longitude, latitude] — same as CesiumJS
```

### GeoJSON Polygon → Cesium flat array

```javascript
function geojsonPolygonToCesiumFlat(geojsonCoords) {
  // geojsonCoords = GeoJSON polygon coordinates (with outer ring)
  // geojsonCoords[0] = outer ring = [[lon, lat], [lon, lat], ...]
  const ring = geojsonCoords[0];

  // Remove last point (GeoJSON closes the ring, Cesium does it automatically)
  const openRing = ring.slice(0, -1);

  // Flatten to [lon1, lat1, lon2, lat2, ...]
  return openRing.flatMap(([lon, lat]) => [lon, lat]);
}

// Usage
const flat = geojsonPolygonToCesiumFlat(geojson.geometry.coordinates);
const hierarchy = Cesium.Cartesian3.fromDegreesArray(flat);
```

### Compute centroid from GeoJSON polygon

```javascript
function centroidFromCoords(coords) {
  // coords = [[lon, lat], [lon, lat], ...]
  const n = coords.length;
  const sumLon = coords.reduce((s, [lon]) => s + lon, 0);
  const sumLat = coords.reduce((s, [, lat]) => s + lat, 0);
  return [sumLon / n, sumLat / n];
}
```

---

## Camera Height Calculation

### From bounding rectangle (for nadir/top-down shots)

```javascript
function cameraHeightForRect(rect, canvasWidth, canvasHeight, fovDegrees = 60) {
  const widthDeg = Cesium.Math.toDegrees(rect.east - rect.west);
  const heightDeg = Cesium.Math.toDegrees(rect.north - rect.south);

  // Convert degrees to approximate meters (at the latitude)
  const centerLat = Cesium.Math.toDegrees((rect.north + rect.south) / 2);
  const metersPerDegLon = 111320 * Math.cos(centerLat * Math.PI / 180);
  const metersPerDegLat = 110540;

  const widthM = widthDeg * metersPerDegLon;
  const heightM = heightDeg * metersPerDegLat;

  // Use the larger dimension
  const extent = Math.max(widthM, heightM);

  // Camera height = extent / (2 * tan(fov/2))
  const fovRad = (fovDegrees * Math.PI) / 180;
  const height = extent / (2 * Math.tan(fovRad / 2));

  // Add 20% padding
  return height * 1.2;
}
```

### Quick rule of thumb

| Property Size | Camera Height (nadir) |
|---------------|-----------------------|
| Small lot (0.1 acres) | ~50m |
| Quarter acre | ~100m |
| 1 acre | ~200m |
| 5 acres | ~400m |
| 40 acres | ~1200m |
| Section (640 acres) | ~4500m |

---

## Heading / Pitch / Roll Reference

```
Heading:  0° = North, 90° = East, 180° = South, 270° = West
Pitch:   0° = Horizontal, -90° = Straight down (nadir), 90° = Straight up
Roll:    0° = Level, positive = clockwise tilt

Common camera angles:
  Nadir (top-down):     heading: 0,   pitch: -90,  roll: 0
  Cardinal NE at 45°:   heading: 45,  pitch: -45,  roll: 0
  Street-level:         heading: 0,   pitch: -10,  roll: 0
```

```javascript
// Always convert to radians for CesiumJS
orientation: {
  heading: Cesium.Math.toRadians(45),    // 45° = NE
  pitch: Cesium.Math.toRadians(-45),     // 45° down from horizon
  roll: 0,
}
```
