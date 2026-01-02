---
trigger: always_on
---

 ## Scope Restriction: The "Headless Renderer" Pattern

**Role**: This repository is a stateless rendering engine. It receives a JSON payload and returns binary image data (or temp paths).

**Forbidden**: Do not implement file storage (S3, GCS), email notifications, or complex job queues inside the Next.js app.

**Assumption**: Assume an upstream n8n instance handles all triggers, storage, and error notifications.

**Input Interface**: The app exposes a single HTTP POST endpoint (e.g., /api/render) accepting { lat, lon, geojson, style }.

**Output Interface**: The response should be a JSON object containing Base64 encoded images or download links, ready for n8n to parse.