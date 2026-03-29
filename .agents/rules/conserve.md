---
trigger: always_on
---

Concurrency: Always render jobs Sequentially (1 at a time) to prevent WebGL memory crashes.
Headless Config: Always set contextOptions: { webgl: { preserveDrawingBuffer: true } } when initializing the viewer to prevent blank PNGs.
Validation: Never capture a screenshot until viewer.scene.globe.tilesLoaded === true. Do not rely solely on scene.render().