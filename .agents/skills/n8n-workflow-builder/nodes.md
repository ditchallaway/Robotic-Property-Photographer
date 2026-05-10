# n8n Node Catalog

Copy-paste node templates for the most commonly used n8n node types.
Replace `"uuid"` with actual UUID v4 values.

---

## Triggers

### Manual Trigger
```json
{
  "parameters": {},
  "id": "uuid",
  "name": "When clicking 'Test workflow'",
  "type": "n8n-nodes-base.manualTrigger",
  "typeVersion": 1,
  "position": [260, 300]
}
```

### Webhook Trigger
```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "my-webhook-path",
    "responseMode": "lastNode",
    "options": {}
  },
  "id": "uuid",
  "name": "Webhook Trigger",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2,
  "position": [260, 300],
  "webhookId": "my-webhook-id"
}
```

| Parameter | Values | Description |
|---|---|---|
| `httpMethod` | `"GET"`, `"POST"`, `"PUT"`, `"DELETE"`, `"PATCH"` | HTTP method |
| `path` | string | URL path segment (appended to n8n base URL) |
| `responseMode` | `"onReceived"`, `"lastNode"`, `"responseNode"` | When to send HTTP response |

### Schedule Trigger
```json
{
  "parameters": {
    "rule": {
      "interval": [
        { "field": "minutes", "minutesInterval": 5 }
      ]
    }
  },
  "id": "uuid",
  "name": "Schedule Trigger",
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1.2,
  "position": [260, 300]
}
```

---

## Data Processing

### Edit Fields (Set Node)
```json
{
  "parameters": {
    "assignments": {
      "assignments": [
        {
          "id": "uuid",
          "name": "fieldName",
          "value": "static value or ={{ expression }}",
          "type": "string"
        }
      ]
    },
    "options": {
      "dotNotation": true
    }
  },
  "id": "uuid",
  "name": "Edit Fields",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.4,
  "position": [480, 300]
}
```

**Assignment types:** `"string"`, `"number"`, `"boolean"`, `"array"`, `"object"`

### Code Node (JavaScript)
```json
{
  "parameters": {
    "mode": "runOnceForAllItems",
    "language": "javaScript",
    "jsCode": "const items = $input.all();\nreturn items.map(item => ({\n  json: { processed: item.json.value }\n}));"
  },
  "id": "uuid",
  "name": "Code",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [480, 300]
}
```

| Mode | Description |
|---|---|
| `"runOnceForAllItems"` | Single execution, access to all items |
| `"runOnceForEachItem"` | Executes once per item |

### Code Node (Python)
```json
{
  "parameters": {
    "mode": "runOnceForAllItems",
    "language": "python",
    "pythonCode": "items = _input.all()\nresult = []\nfor item in items:\n    result.append({'json': {'processed': True}})\nreturn result"
  },
  "id": "uuid",
  "name": "Python Code",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [480, 300]
}
```

---

## HTTP & APIs

### HTTP Request
```json
{
  "parameters": {
    "method": "GET",
    "url": "https://api.example.com/data",
    "authentication": "none",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        { "name": "page", "value": "={{ $json.page }}" },
        { "name": "limit", "value": "50" }
      ]
    },
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Authorization", "value": "Bearer {{ $json.token }}" }
      ]
    },
    "sendBody": false,
    "options": {
      "timeout": 30000,
      "response": {
        "response": {
          "fullResponse": true,
          "responseFormat": "text"
        }
      }
    }
  },
  "id": "uuid",
  "name": "HTTP Request",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "position": [480, 300]
}
```

**Authentication:**
| Value | Description |
|---|---|
| `"none"` | No authentication |
| `"predefinedCredentialType"` | Use stored credentials |
| `"genericCredentialType"` | Generic auth (header/query/basic) |

For `predefinedCredentialType`, add to node:
```json
"nodeCredentialType": "githubApi",
"credentials": { "githubApi": { "id": "credId", "name": "My GitHub" } }
```

**Body** (when `sendBody: true`):
```json
"body": {
  "contentType": "json",
  "jsonBody": "={{ JSON.stringify($json) }}"
}
```

---

## Flow Control

### IF Node (Conditional)
```json
{
  "parameters": {
    "conditions": {
      "options": { "caseSensitive": true },
      "conditions": [
        {
          "id": "uuid",
          "leftValue": "={{ $json.status }}",
          "rightValue": "active",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    }
  },
  "id": "uuid",
  "name": "IF",
  "type": "n8n-nodes-base.if",
  "typeVersion": 2.2,
  "position": [480, 300]
}
```

**Outputs:** `main[0]` → true, `main[1]` → false

**Operators:**
| Type | Operations |
|---|---|
| `string` | `equals`, `notEquals`, `contains`, `notContains`, `startsWith`, `endsWith`, `regex`, `exists`, `notExists` |
| `number` | `equals`, `notEquals`, `gt`, `gte`, `lt`, `lte`, `exists`, `notExists` |
| `boolean` | `true`, `false`, `exists`, `notExists` |

### Switch Node
```json
{
  "parameters": {
    "mode": "expression",
    "output": "={{ $json.type }}",
    "rules": {
      "values": [
        { "outputKey": "overhead", "value": "overhead" },
        { "outputKey": "cardinal", "value": "north" }
      ]
    },
    "fallbackOutput": "extra"
  },
  "id": "uuid",
  "name": "Switch",
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3.2,
  "position": [480, 300]
}
```

### Merge Node
```json
{
  "parameters": {
    "mode": "append"
  },
  "id": "uuid",
  "name": "Merge",
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3,
  "position": [700, 300]
}
```

**Modes:** `"append"`, `"combine"`, `"chooseBranch"`

---

## Storage & Files

### S3 / R2 Upload
```json
{
  "parameters": {
    "operation": "upload",
    "bucketName": "my-bucket",
    "fileName": "={{ $json.customer_id }}/{{ $json.fileName }}",
    "additionalFields": {}
  },
  "id": "uuid",
  "name": "Upload to S3",
  "type": "n8n-nodes-base.s3",
  "typeVersion": 1,
  "position": [480, 300],
  "credentials": {
    "s3": { "id": "credId", "name": "my-s3-bucket" }
  }
}
```

### Compression
```json
{
  "parameters": {
    "outputPrefix": "="
  },
  "id": "uuid",
  "name": "Compression",
  "type": "n8n-nodes-base.compression",
  "typeVersion": 1.1,
  "position": [480, 300]
}
```

---

## Documentation

### Sticky Note
```json
{
  "parameters": {
    "content": "## Section Title\n**Description** of this workflow section.",
    "height": 272,
    "width": 192,
    "color": 4
  },
  "id": "uuid",
  "name": "Sticky Note",
  "type": "n8n-nodes-base.stickyNote",
  "typeVersion": 1,
  "position": [260, -100]
}
```

**Colors:** `1` (yellow), `2` (blue), `3` (pink), `4` (green), `5` (purple), `6` (red), or hex `"#477D40"`

---

## Common Pitfalls

| Problem | Solution |
|---|---|
| Node not found in connection | Connection keys use **node name**, not node ID |
| Expression not evaluating | Prefix the string value with `=` |
| Code node fails silently | Always return `[{ json: {} }]` array format |
| Webhook returns empty | Set `responseMode` to `"lastNode"` |
| Binary data lost | Pass binary through using `item.binary` in code nodes |
| `URLSearchParams` not available | Use manual string concatenation: `` key=${encodeURIComponent(val)} `` |
| Credential errors | `credentials` field goes on the node object, not inside `parameters` |
| Positions overlap | Use the 220px horizontal / 200px vertical spacing grid |
