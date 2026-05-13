# .n8n File Schema Reference

## Top-Level Fields

A `.n8n` file is a JSON object with these fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Human-readable workflow name |
| `nodes` | array | ✅ | Array of node definition objects |
| `connections` | object | ✅ | Maps source node names → target nodes |
| `settings` | object | ✅ | Execution settings |
| `pinData` | object | ✅ | Pinned test data (use `{}` for none) |
| `id` | string | ❌ | Workflow ID (assigned by server) |
| `active` | boolean | ❌ | Whether workflow is activated |
| `createdAt` | string | ❌ | ISO timestamp |
| `updatedAt` | string | ❌ | ISO timestamp |

---

## Node Definition

```json
{
  "parameters": { },
  "id": "uuid-v4-here",
  "name": "Human Readable Name",
  "type": "n8n-nodes-base.nodeType",
  "typeVersion": 2,
  "position": [x, y],
  "credentials": { },
  "disabled": false,
  "webhookId": "optional-webhook-id"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `parameters` | object | ✅ | Node-specific configuration |
| `id` | string | ✅ | Unique UUID v4 |
| `name` | string | ✅ | Must be unique within the workflow |
| `type` | string | ✅ | Full node type identifier |
| `typeVersion` | number | ✅ | Node API version |
| `position` | [number, number] | ✅ | Canvas [x, y] coordinates |
| `credentials` | object | ❌ | Credential refs: `{ type: { id, name } }` |
| `disabled` | boolean | ❌ | `true` to skip during execution |
| `webhookId` | string | ❌ | Only for webhook trigger nodes |

---

## Connections

Connections are keyed by the **source node's `name`** (not its ID):

```json
{
  "connections": {
    "Source Node Name": {
      "main": [
        [
          {
            "node": "Target Node Name",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

**Structure:** `connections[sourceName].main[outputIndex][connectionIndex]`

- `main[0]` = first output (most nodes have only one)
- `main[1]` = second output (IF nodes: true = 0, false = 1)
- Each output is an array of connections (fan-out to multiple nodes)

### Fan-Out Example (one node → two targets)

```json
"My Node": {
  "main": [
    [
      { "node": "Target A", "type": "main", "index": 0 },
      { "node": "Target B", "type": "main", "index": 0 }
    ]
  ]
}
```

### IF Node Branching

```json
"Check Status": {
  "main": [
    [ { "node": "Handle True", "type": "main", "index": 0 } ],
    [ { "node": "Handle False", "type": "main", "index": 0 } ]
  ]
}
```

---

## Settings

```json
{
  "settings": {
    "executionOrder": "v1",
    "availableInMCP": false
  }
}
```

| Field | Values | Description |
|---|---|---|
| `executionOrder` | `"v1"` | Use v1 for modern workflows |
| `availableInMCP` | `true` / `false` | Expose as MCP tool |

---

## Layout & Positioning

### Grid Rules
- **Horizontal spacing:** 220px between nodes in a chain
- **Vertical spacing:** 200px between parallel branches
- **Starting position:** `[260, 300]` for the trigger node
- **Direction:** Left to right, top to bottom

### Standard Chain
```
Trigger     →  Process    →  Transform  →  Output
[260, 300]     [480, 300]    [700, 300]    [920, 300]
```

### Branching
```
                              True Branch  [700, 200]
Trigger → IF Node            /
[260,300] [480,300]          /
                             \
                              False Branch [700, 400]
```

---

## Validation Checklist

- [ ] **Valid JSON** — file parses without syntax errors
- [ ] **Unique node IDs** — no two nodes share the same `id`
- [ ] **Unique node names** — no two nodes share the same `name`
- [ ] **Connection integrity** — every node name in `connections` exists in `nodes`
- [ ] **Target integrity** — every `connection.node` target exists in `nodes`
- [ ] **Exactly one trigger** — workflow has at least one trigger node
- [ ] **No orphan nodes** — every non-trigger node is reachable via connections
- [ ] **Position format** — every position is `[number, number]`
- [ ] **Required fields** — every node has `parameters`, `id`, `name`, `type`, `typeVersion`, `position`
- [ ] **Code escaping** — JavaScript in `jsCode` has newlines as `\n` and quotes escaped

Run automated validation:
```bash
node .agents/skills/n8n-workflow-builder/validate.js <file.n8n>
```
