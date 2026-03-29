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

**Purpose**: Performs an end-to-end functional test of the rendering pipeline by sending a sample job request to the application's `/api/render` endpoint.

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
    - `shots`: A list of desired camera angles (e.g., `["nadir"]`).
2.  Dispatches an HTTP POST request to `http://127.0.0.1:3000/api/render`.
3.  Logs the JSON response received from the server.

### Expected Output
A successful response from the server indicating the job has been queued or completed:
```json
✅ Response Received:
{
  "status": "success",
  "jobId": "...",
  "message": "Render sequence initiated"
}
```
*(Exact response structure may vary depending on the current API implementation)*
