---
description: Evaluates generated overhead.png against reference-overhead.png to determine visual correctness. Uses pixel comparison and visual inspection to confirm rendering matches expected output.
---

compare /test-results/current/overhead.png /test-results/reference-overhead.png

**Look for**

- Small differences → small difference in zoom level, field of view or aspect ratio.
- Large differences → likely rendering issue
- Missing or malformed image
