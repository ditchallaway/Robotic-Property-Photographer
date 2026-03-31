# Testing Guide

This document describes the diagnostic and functional tests available in the Robotic Property Photographer repository.

## 1. WebGL Diagnostic (`test-gl.js`)

**Purpose**: Verifies that the browser environment (Puppeteer) correctly initializes WebGL using software rendering. This is critical for environments without a physical GPU (like Docker or WSL).

### How to Run
```bash
node test-gl.js
```

### What it Does
1.  Launches a headless Puppeteer browser with specific hardware acceleration overrides:
    - `--enable-unsafe-swiftshader`
    - `--use-gl=angle`
    - `--use-angle=swiftshader`
2.  Creates a hidden canvas and attempts to get a `webgl` context.
3.  Queries the `WEBGL_debug_renderer_info` extension to identify the underlying driver.

### Expected Output
Successful execution should return:
```text
WebGL Renderer: Google SwiftShader
```

---

## 2. API Integration Test (`test-api.cjs`)

**Purpose**: Performs an end-to-end functional test of the rendering pipeline by sending a sample job request to the application's `/api/render` endpoint and verifying the generation of 5 PNG images.

### How to Run
```bash
# Direct execution (inside container)
node test-api.cjs

# OR via npm script (from host)
npm run test:api
```

### What it Does
1.  Constructs a JSON payload containing:
    - `centroid`: Coordinates for the property center.
    - `geometry`: A GeoJSON polygon defining the property boundary.
2.  Dispatches an HTTP POST request to `http://127.0.0.1:3000/api/render`.
3.  Waits for the rendering sequence (5 shots) to complete.
4.  Logs the JSON response containing paths to the 5 generated PNGs.

### Expected Output
A successful response from the server with the 5 shots:
```json
✅ Response Received:
{
  "status": "success",
  "customer_id": "cust_123",
  "order_id": "order_456",
  "shots": {
    "north": { "png_path": "/app/results/north.png", "png_url": "..." },
    "east":  { "png_path": "/app/results/east.png",  "png_url": "..." },
    "south": { "png_path": "/app/results/south.png", "png_url": "..." },
    "west":  { "png_path": "/app/results/west.png",  "png_url": "..." },
    "nadir": { "png_path": "/app/results/nadir.png", "png_url": "..." }
  }
}
```

