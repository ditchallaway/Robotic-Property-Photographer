#!/usr/bin/env node

/**
 * n8n Workflow Validator
 *
 * Validates .n8n workflow files for structural correctness before syncing
 * via n8n Atom. Catches common issues that would cause runtime failures.
 *
 * Usage:
 *   node .agents/scripts/validate-n8n-workflow.js <path-to-file.n8n>
 *   node .agents/scripts/validate-n8n-workflow.js *.n8n
 */

const fs = require('fs');
const path = require('path');

// ── ANSI Colors ─────────────────────────────────────────────────────
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

// ── Known Trigger Types ─────────────────────────────────────────────
const TRIGGER_TYPES = new Set([
  'n8n-nodes-base.manualTrigger',
  'n8n-nodes-base.webhook',
  'n8n-nodes-base.scheduleTrigger',
  'n8n-nodes-base.emailTrigger',
  'n8n-nodes-base.cronTrigger',
  'n8n-nodes-base.pollingTrigger',
  'n8n-nodes-base.formTrigger',
  'n8n-nodes-base.chatTrigger',
  '@n8n/n8n-nodes-langchain.chatTrigger',
]);

// ── Known Passive Node Types (no connections needed) ─────────────────
const PASSIVE_TYPES = new Set([
  'n8n-nodes-base.stickyNote',
]);

// ── Validator ───────────────────────────────────────────────────────

class WorkflowValidator {
  constructor(filePath) {
    this.filePath = filePath;
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.workflow = null;
  }

  error(msg) { this.errors.push(msg); }
  warn(msg) { this.warnings.push(msg); }
  note(msg) { this.info.push(msg); }

  validate() {
    // 1. Read & parse
    if (!this._readFile()) return this;
    if (!this._parseJSON()) return this;

    // 2. Structural checks
    this._checkTopLevelFields();
    this._checkNodes();
    this._checkConnections();
    this._checkTriggers();
    this._checkOrphans();

    return this;
  }

  _readFile() {
    try {
      this.raw = fs.readFileSync(this.filePath, 'utf-8');
      return true;
    } catch (e) {
      this.error(`Cannot read file: ${e.message}`);
      return false;
    }
  }

  _parseJSON() {
    try {
      this.workflow = JSON.parse(this.raw);
      return true;
    } catch (e) {
      this.error(`Invalid JSON: ${e.message}`);
      return false;
    }
  }

  _checkTopLevelFields() {
    const w = this.workflow;
    const required = ['name', 'nodes', 'connections'];

    for (const field of required) {
      if (!(field in w)) {
        this.error(`Missing required top-level field: "${field}"`);
      }
    }

    if (typeof w.name !== 'string' || w.name.trim() === '') {
      this.error('"name" must be a non-empty string');
    }

    if (!Array.isArray(w.nodes)) {
      this.error('"nodes" must be an array');
    }

    if (typeof w.connections !== 'object' || w.connections === null) {
      this.error('"connections" must be an object');
    }

    if (!('settings' in w)) {
      this.warn('Missing "settings" field — recommended: { "executionOrder": "v1" }');
    }

    if (!('pinData' in w)) {
      this.warn('Missing "pinData" field — recommended: {}');
    }
  }

  _checkNodes() {
    if (!Array.isArray(this.workflow.nodes)) return;

    const ids = new Set();
    const names = new Set();

    for (let i = 0; i < this.workflow.nodes.length; i++) {
      const node = this.workflow.nodes[i];
      const label = `nodes[${i}]`;

      // Required fields
      const nodeRequired = ['parameters', 'id', 'name', 'type', 'typeVersion', 'position'];
      for (const field of nodeRequired) {
        if (!(field in node)) {
          this.error(`${label}: Missing required field "${field}"`);
        }
      }

      // ID uniqueness
      if (node.id) {
        if (ids.has(node.id)) {
          this.error(`${label}: Duplicate node ID "${node.id}"`);
        }
        ids.add(node.id);
      }

      // Name uniqueness
      if (node.name) {
        if (names.has(node.name)) {
          this.error(`${label}: Duplicate node name "${node.name}"`);
        }
        names.add(node.name);
      }

      // Position format
      if (node.position) {
        if (!Array.isArray(node.position) || node.position.length !== 2) {
          this.error(`${label}: "position" must be a [x, y] array`);
        } else if (typeof node.position[0] !== 'number' || typeof node.position[1] !== 'number') {
          this.error(`${label}: "position" values must be numbers`);
        }
      }

      // Type version
      if (node.typeVersion !== undefined && typeof node.typeVersion !== 'number') {
        this.error(`${label}: "typeVersion" must be a number`);
      }

      // Type format
      if (node.type && typeof node.type === 'string') {
        if (!node.type.includes('.') && !node.type.startsWith('@')) {
          this.warn(`${label}: Node type "${node.type}" doesn't follow the "package.nodeType" pattern`);
        }
      }

      // Code node checks
      if (node.type === 'n8n-nodes-base.code' && node.parameters) {
        if (node.parameters.language === 'javaScript' && !node.parameters.jsCode) {
          this.warn(`${label}: JavaScript code node has no "jsCode" parameter`);
        }
        if (node.parameters.language === 'python' && !node.parameters.pythonCode) {
          this.warn(`${label}: Python code node has no "pythonCode" parameter`);
        }
      }

      // Webhook checks
      if (node.type === 'n8n-nodes-base.webhook' && node.parameters) {
        if (!node.parameters.path) {
          this.warn(`${label}: Webhook node has no "path" parameter`);
        }
        if (!node.webhookId) {
          this.warn(`${label}: Webhook node has no "webhookId"`);
        }
      }
    }

    this.note(`Found ${this.workflow.nodes.length} nodes`);
  }

  _checkConnections() {
    if (typeof this.workflow.connections !== 'object') return;
    if (!Array.isArray(this.workflow.nodes)) return;

    const nodeNames = new Set(this.workflow.nodes.map(n => n.name));

    for (const [sourceName, outputs] of Object.entries(this.workflow.connections)) {
      // Source must exist
      if (!nodeNames.has(sourceName)) {
        this.error(`Connection source "${sourceName}" does not match any node name`);
      }

      // Check each output
      if (outputs.main && Array.isArray(outputs.main)) {
        for (let oi = 0; oi < outputs.main.length; oi++) {
          const output = outputs.main[oi];
          if (!Array.isArray(output)) continue;

          for (let ci = 0; ci < output.length; ci++) {
            const conn = output[ci];
            if (!conn.node) {
              this.error(`Connection from "${sourceName}" main[${oi}][${ci}]: missing "node" target`);
            } else if (!nodeNames.has(conn.node)) {
              this.error(`Connection from "${sourceName}" → "${conn.node}": target node not found`);
            }

            if (conn.type !== 'main') {
              this.warn(`Connection from "${sourceName}" → "${conn.node}": unusual type "${conn.type}" (expected "main")`);
            }
          }
        }
      }
    }
  }

  _checkTriggers() {
    if (!Array.isArray(this.workflow.nodes)) return;

    const triggers = this.workflow.nodes.filter(n => TRIGGER_TYPES.has(n.type));

    if (triggers.length === 0) {
      this.warn('No trigger node found — workflow cannot be started automatically');
    } else if (triggers.length > 1) {
      this.note(`Multiple trigger nodes found: ${triggers.map(t => `"${t.name}"`).join(', ')}`);
    } else {
      this.note(`Trigger: "${triggers[0].name}" (${triggers[0].type})`);
    }
  }

  _checkOrphans() {
    if (!Array.isArray(this.workflow.nodes)) return;
    if (typeof this.workflow.connections !== 'object') return;

    const nodeNames = new Set(this.workflow.nodes.map(n => n.name));
    const connected = new Set();

    // Trigger nodes are entry points
    for (const node of this.workflow.nodes) {
      if (TRIGGER_TYPES.has(node.type) || PASSIVE_TYPES.has(node.type)) {
        connected.add(node.name);
      }
    }

    // Walk connections
    for (const [sourceName, outputs] of Object.entries(this.workflow.connections)) {
      connected.add(sourceName);
      if (outputs.main && Array.isArray(outputs.main)) {
        for (const output of outputs.main) {
          if (!Array.isArray(output)) continue;
          for (const conn of output) {
            if (conn.node) connected.add(conn.node);
          }
        }
      }
    }

    // Find orphans
    for (const name of nodeNames) {
      if (!connected.has(name)) {
        this.warn(`Node "${name}" is not connected to any other node`);
      }
    }
  }

  // ── Report ──────────────────────────────────────────────────────

  report() {
    const filename = path.basename(this.filePath);
    console.log(`\n${BOLD}${CYAN}━━━ ${filename} ━━━${RESET}`);

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(`${GREEN}✓ Valid workflow${RESET}`);
    }

    for (const msg of this.errors) {
      console.log(`${RED}  ✗ ERROR:${RESET} ${msg}`);
    }

    for (const msg of this.warnings) {
      console.log(`${YELLOW}  ⚠ WARN:${RESET}  ${msg}`);
    }

    for (const msg of this.info) {
      console.log(`${DIM}  ℹ ${msg}${RESET}`);
    }

    if (this.workflow && this.workflow.name) {
      console.log(`${DIM}  ℹ Workflow: "${this.workflow.name}"${RESET}`);
    }

    const status = this.errors.length === 0 ? 'PASS' : 'FAIL';
    const statusColor = status === 'PASS' ? GREEN : RED;
    console.log(`${statusColor}${BOLD}  ${status}${RESET} ${DIM}(${this.errors.length} errors, ${this.warnings.length} warnings)${RESET}\n`);

    return this.errors.length === 0;
  }
}

// ── CLI ─────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`\n${BOLD}n8n Workflow Validator${RESET}`);
    console.log(`${DIM}Validates .n8n files for structural correctness.${RESET}\n`);
    console.log(`Usage: node ${path.basename(__filename)} <file.n8n> [file2.n8n ...]`);
    console.log(`       node ${path.basename(__filename)} *.n8n\n`);
    process.exit(0);
  }

  let allPassed = true;

  for (const arg of args) {
    // Expand globs (Node handles this on Linux)
    const filePath = path.resolve(arg);
    if (!fs.existsSync(filePath)) {
      console.log(`${RED}File not found: ${arg}${RESET}`);
      allPassed = false;
      continue;
    }

    const validator = new WorkflowValidator(filePath);
    const passed = validator.validate().report();
    if (!passed) allPassed = false;
  }

  process.exit(allPassed ? 0 : 1);
}

main();
