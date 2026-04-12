---
description: Rebuilds and runs the test Docker environment to generate fresh outputs. Simulates the n8n trigger, writes new images to `/test-results/current`, and archives prior results to `/test-results/last` for comparison.
---

```
docker compose -f docker-compose.test.yml up --build -d
```

Expected outcome:

Containers are rebuilt and running
New images are written to /test-results/current
Previous results exist in /test-results/last (if not first run)

Activity:
Wait until containers are healthy before moving on.
