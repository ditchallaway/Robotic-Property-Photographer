---
description: Build, validate, and modify n8n workflows as .n8n files for the n8n Atom extension
---

# n8n Workflow Builder — Agent Skill

> **Companion to [n8n Atom](https://marketplace.visualstudio.com/items?itemName=atom8n.n8n-atom)**
> — This skill teaches AI agents how to write structurally correct `.n8n`
> workflow files that sync automatically via the n8n Atom VS Code extension.
>
> **Workflow:** Write JSON → save as `.n8n` → n8n Atom syncs it to the server.

## Prerequisites

Before building workflows, verify the n8n Atom extension is installed:

```bash
node .agents/skills/n8n-workflow-builder/check-setup.js
```

This checks for:
- ✅ n8n Atom extension installed (VS Code / Cursor / Antigravity)
- ✅ Local n8n server reachable on port 5888
- ✅ Existing `.n8n` files in the workspace

If the extension is missing, the script prints install instructions and exits with a non-zero code.

---

## Skill Modules

Read the module you need for the task at hand:

| Module | File | Use When |
|---|---|---|
| **Setup Check** | [check-setup.js](./check-setup.js) | Verify n8n Atom is installed and server is running |
| **Schema** | [schema.md](./schema.md) | You need the `.n8n` file format, node definition, connection wiring, or settings reference |
| **Nodes** | [nodes.md](./nodes.md) | You need copy-paste templates for specific node types (triggers, HTTP, code, IF, etc.) |
| **Expressions** | [expressions.md](./expressions.md) | You need n8n expression syntax (`={{ }}`), code node API, or helper functions |
| **Templates** | [templates/](./templates/) | You want a complete starter workflow (webhook API, pipeline, MCP tool, branching) |
| **Validation** | [validate.js](./validate.js) | You want to check a `.n8n` file for structural errors before syncing |

## Quick Start

```json
{
  "name": "My Workflow",
  "nodes": [ /* see nodes.md */ ],
  "connections": { /* see schema.md §Connections */ },
  "settings": { "executionOrder": "v1" },
  "pinData": {}
}
```

Save as `my-workflow.n8n` in the workspace root. n8n Atom auto-syncs it.

## Validate Before Sync

```bash
node .agents/skills/n8n-workflow-builder/validate.js <path-to-file.n8n>
```

## n8n Atom Extension

[n8n Atom](https://marketplace.visualstudio.com/items?itemName=atom8n.n8n-atom) is actively maintained on the VS Code Marketplace. It provides:

- **File-based workflows** — `.n8n` format (JSON) for Git version control
- **Visual editor** — drag-and-drop n8n UI embedded in VS Code / Cursor / Antigravity
- **Auto-sync** — file saves propagate to the connected n8n server
- **Local server** — `npx -y @atom8n/n8n@latest` (port 5888)

### File Operations
- **New workflow:** Write JSON, save as `my-workflow.n8n`
- **Existing JSON:** Rename `.json` → `.n8n` and open it
- **Editing:** Modify JSON directly — n8n Atom re-syncs on save
