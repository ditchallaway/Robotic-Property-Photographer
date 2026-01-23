---
trigger: always_on
---

- Road data MUST be sourced from OSM way[highway] only.

- Do NOT query relation[type=route] or any route relations.

- Do NOT merge or infer route names across multiple ways.

- Label text is taken strictly from tags on the selected way (name → ref → alt_name).

- Missing name = road excluded.