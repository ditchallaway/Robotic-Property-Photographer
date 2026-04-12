---
description: Retrieves Docker Compose logs from the test environment for debugging. Use when image generation fails, outputs are missing, or results differ unexpectedly to identify errors in the rendering pipeline.
---

```
docker compose logs
```

Look for

Errors, exceptions, or stack traces
Missing file warnings (especially /test-results/current)
Image generation or rendering failures
Container startup issues or failed services
Timing issues (process not completing)
