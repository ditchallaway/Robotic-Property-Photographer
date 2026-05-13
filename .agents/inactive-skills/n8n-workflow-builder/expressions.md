# n8n Expressions & Code Node API

## Expression Syntax

n8n expressions use the `={{ }}` wrapper inside string parameter values:

```
"value": "={{ $json.fieldName }}"
"url": "=https://api.example.com/{{ $json.id }}"
"value": "={{ $('Other Node').item.json.field }}"
"value": "={{ $if($json.name, $json.name, 'default') }}"
```

### Rules
- Prefix with `=` to activate expression mode
- Wrap dynamic parts in `{{ }}`
- Static + dynamic: `"=static text {{ $json.var }} more text"`
- Pure expression: `"={{ $json.result }}"`

### Common Helpers
```
{{ $now }}                                → Current DateTime (Luxon)
{{ $today }}                              → Today's date (Luxon)
{{ $json.date.format('yyyy-MM-dd') }}     → Format dates
{{ $isEmpty($json.value) }}               → Check if empty
{{ JSON.stringify($json) }}               → Serialize to JSON
{{ $json.items.length }}                  → Array length
{{ $if($json.name, $json.name, 'N/A') }} → Conditional
```

---

## Code Node API (JavaScript)

### Accessing Input Data
```javascript
// All items as array
const items = $input.all();

// First / last item
const first = $input.first();
const last = $input.last();

// Current item (runOnceForEachItem mode only)
const current = $input.item;
```

### Accessing Other Nodes
```javascript
// All items from a named node
const data = $('Node Name').all();

// First item from a named node
const first = $('Node Name').first();

// Matched item from a named node (in runOnceForEachItem)
const matched = $('Node Name').item;
```

### Item Structure
```javascript
item.json    // The data object (always present)
item.binary  // Binary attachments (optional)
```

### Environment & Context
```javascript
$env                 // Environment variables
$now                 // Current DateTime (Luxon)
$today               // Today's date (Luxon)
$execution.id        // Current execution ID
$workflow.id         // Current workflow ID
$workflow.name       // Current workflow name
```

### Return Formats

**`runOnceForAllItems` mode** — return an array:
```javascript
return [
  { json: { key: "value1" } },
  { json: { key: "value2" } }
];
```

**`runOnceForEachItem` mode** — return a single item:
```javascript
return { json: { key: "value" } };
```

**With binary data:**
```javascript
return [{
  json: { fileName: "output.png" },
  binary: {
    data: $input.first().binary.data
  }
}];
```

### Common Patterns

**Transform all items:**
```javascript
const items = $input.all();
return items.map(item => ({
  json: {
    ...item.json,
    processed: true,
    timestamp: new Date().toISOString()
  }
}));
```

**Filter items:**
```javascript
const items = $input.all();
return items.filter(item => item.json.status === 'active');
```

**Aggregate / reduce:**
```javascript
const items = $input.all();
const total = items.reduce((sum, item) => sum + item.json.amount, 0);
return [{ json: { total, count: items.length } }];
```

**Reference upstream node data:**
```javascript
const upstream = $('Edit Fields').first().json;
const customerId = upstream.customer_id;
const orderId = upstream.order_id;
```

**Validate input and return error:**
```javascript
const input = $input.first().json;
if (!input.body?.id) {
  return [{ json: { error: 'Missing required field: id' } }];
}
```

**Split binary items:**
```javascript
const items = [];
for (const item of $input.all()) {
  for (const key of Object.keys(item.binary)) {
    items.push({
      json: { ...item.json, fileName: item.binary[key].fileName },
      binary: { data: item.binary[key] }
    });
  }
}
return items;
```

---

## Code Node API (Python)

### Key Differences from JavaScript
```python
# Input access uses underscore prefix
items = _input.all()
first = _input.first()

# Return list of dicts
return [{"json": {"processed": True}}]

# Logging
print("debug message")  # instead of console.log()
```

---

## JSON String Escaping in `.n8n` Files

When writing `jsCode` or `pythonCode` inside JSON, remember:
- Newlines → `\n`
- Double quotes → `\"`
- Backslashes → `\\`
- Template literals → `\`` (or use regular string concatenation)

**Example:**
```json
"jsCode": "const items = $input.all();\nconst result = items.map(item => ({\n  json: { value: item.json.name }\n}));\nreturn result;"
```
