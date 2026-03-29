---
trigger: always_on
---

The API must wrap all render logic in the renderQueue promise to prevent parallel jobs from exceeding the 2gb SHM limit.