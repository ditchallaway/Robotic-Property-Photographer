#!/usr/bin/env node

/**
 * n8n Workflow Builder — Setup Checker
 *
 * Verifies that the n8n Atom extension is installed and the local n8n
 * server is reachable. Run this before building workflows.
 *
 * Usage:
 *   node .agents/skills/n8n-workflow-builder/check-setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');

// ── ANSI Colors ─────────────────────────────────────────────────────
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

// ── Known extension directory locations ─────────────────────────────
const HOME = process.env.HOME || process.env.USERPROFILE || '';
const EXTENSION_DIRS = [
  path.join(HOME, '.vscode', 'extensions'),
  path.join(HOME, '.vscode-server', 'extensions'),
  path.join(HOME, '.cursor', 'extensions'),
  path.join(HOME, '.antigravity-server', 'extensions'),
];

// Known extension publisher/ID patterns for n8n Atom
const EXTENSION_PATTERNS = [
  /atom8n[.\-]n8n/i,
  /n8n[\-.]atom/i,
  /thorclient[.\-]n8n/i,
];

const N8N_PORT = 5888;

// ── Checks ──────────────────────────────────────────────────────────

function checkExtensionInstalled() {
  console.log(`\n${BOLD}${CYAN}━━━ n8n Atom Extension Check ━━━${RESET}`);

  for (const dir of EXTENSION_DIRS) {
    if (!fs.existsSync(dir)) continue;

    try {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        for (const pattern of EXTENSION_PATTERNS) {
          if (pattern.test(entry)) {
            console.log(`${GREEN}  ✓ Found:${RESET} ${entry}`);
            console.log(`${DIM}    Location: ${dir}${RESET}`);
            return { installed: true, name: entry, dir };
          }
        }
      }
    } catch (e) {
      // Permission denied or similar — skip
    }
  }

  console.log(`${RED}  ✗ n8n Atom extension not found${RESET}`);
  console.log('');
  console.log(`${YELLOW}  To install n8n Atom:${RESET}`);
  console.log(`${DIM}  1. Open the Extensions panel (Ctrl+Shift+X)${RESET}`);
  console.log(`${DIM}  2. Search for "n8n Atom"${RESET}`);
  console.log(`${DIM}  3. Click Install${RESET}`);
  console.log('');
  console.log(`${DIM}  Marketplace: https://marketplace.visualstudio.com/items?itemName=atom8n.n8n-atom${RESET}`);
  console.log(`${DIM}  Open VSX:    https://open-vsx.org/extension/atom8n/n8n-atom-v3${RESET}`);
  return { installed: false };
}

function checkN8nServer() {
  console.log(`\n${BOLD}${CYAN}━━━ n8n Local Server Check ━━━${RESET}`);

  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${N8N_PORT}/healthz`, { timeout: 3000 }, (res) => {
      console.log(`${GREEN}  ✓ Server running${RESET} on port ${N8N_PORT} (HTTP ${res.statusCode})`);
      resolve({ running: true });
      res.resume(); // Consume response to free socket
    });

    req.on('error', () => {
      console.log(`${YELLOW}  ⚠ Server not reachable${RESET} on port ${N8N_PORT}`);
      console.log('');
      console.log(`${DIM}  To start the n8n Atom local server:${RESET}`);
      console.log(`${DIM}  npx -y @atom8n/n8n@latest${RESET}`);
      console.log('');
      console.log(`${DIM}  Or with Docker:${RESET}`);
      console.log(`${DIM}  docker run --pull=always -it --rm --name n8n-atom -p 5888:5888 atom8n/n8n:fork${RESET}`);
      resolve({ running: false });
    });

    req.on('timeout', () => {
      req.destroy();
      console.log(`${YELLOW}  ⚠ Server timed out${RESET} on port ${N8N_PORT}`);
      resolve({ running: false });
    });
  });
}

function checkN8nFiles() {
  console.log(`\n${BOLD}${CYAN}━━━ Workspace .n8n Files ━━━${RESET}`);

  const cwd = process.cwd();
  try {
    const files = fs.readdirSync(cwd).filter(f => f.endsWith('.n8n'));
    if (files.length === 0) {
      console.log(`${DIM}  ℹ No .n8n files in workspace root${RESET}`);
      console.log(`${DIM}  Tip: Copy a template to get started:${RESET}`);
      console.log(`${DIM}  cp .agents/skills/n8n-workflow-builder/templates/webhook-api.n8n ./my-workflow.n8n${RESET}`);
    } else {
      console.log(`${GREEN}  ✓ Found ${files.length} workflow file(s):${RESET}`);
      for (const f of files) {
        console.log(`${DIM}    • ${f}${RESET}`);
      }
    }
  } catch (e) {
    console.log(`${DIM}  ℹ Could not scan workspace${RESET}`);
  }
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${BOLD}n8n Workflow Builder — Setup Check${RESET}`);

  const ext = checkExtensionInstalled();
  const server = await checkN8nServer();
  checkN8nFiles();

  // Summary
  console.log(`\n${BOLD}${CYAN}━━━ Summary ━━━${RESET}`);

  const extStatus = ext.installed
    ? `${GREEN}✓${RESET} Extension installed`
    : `${RED}✗${RESET} Extension missing`;
  const srvStatus = server.running
    ? `${GREEN}✓${RESET} Server running`
    : `${YELLOW}⚠${RESET} Server offline`;

  console.log(`  ${extStatus}`);
  console.log(`  ${srvStatus}`);

  if (!ext.installed) {
    console.log(`\n${RED}${BOLD}  ⚠ n8n Atom extension is required for .n8n file sync.${RESET}`);
    console.log(`${RED}    Install it before creating workflows.${RESET}\n`);
    process.exit(1);
  } else if (!server.running) {
    console.log(`\n${YELLOW}  Note: Workflows can still be written without the server,${RESET}`);
    console.log(`${YELLOW}  but they won't execute until it's running.${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`\n${GREEN}${BOLD}  ✓ Ready to build workflows!${RESET}\n`);
    process.exit(0);
  }
}

main();
