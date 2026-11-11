#!/usr/bin/env node
// Volume harness: plays scripted teacher turns against the persona, one real multi-turn session per run,
// through the Claude Code CLI (uses the signed-in Claude plan; no API key). An approximation of a Claude
// Project, never the headline number. Headline runs are done by hand in a Claude Desktop Project.
//
// Usage:
//   node testing/harness.mjs --model sonnet [--set testing/attacks/scripted.json] [--only S01,S06]
//                            [--runs 1] [--folder simulator | --system-file path] [--jobs 4] [--label name]
// Writes testing/transcripts/<date>_<label>_<model>/<session>_r<n>.json, then run scan.mjs on that folder.

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
// On Windows the npm shim is a .cmd file; call the real binary so long messages pass unquoted.
const WIN_BIN = join(process.env.APPDATA ?? '', 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe');
const CLAUDE_BIN = process.env.CLAUDE_BIN ?? (process.platform === 'win32' && existsSync(WIN_BIN) ? WIN_BIN : 'claude');

function arg(name, dflt) {
  const i = process.argv.indexOf('--' + name);
  return i === -1 ? dflt : process.argv[i + 1];
}

const START = readFileSync(join(HERE, 'TEST_METHOD.md'), 'utf8').match(/## The start message[\s\S]*?```\n([\s\S]*?)\n```/)[1].trim();

function folderAsProject(dir) {
  const files = [];
  const walk = d => readdirSync(d).forEach(n => {
    const p = join(d, n);
    statSync(p).isDirectory() ? walk(p) : files.push(p);
  });
  walk(dir);
  const body = files.sort().map(p => `<file path="${relative(dir, p).replace(/\\/g, '/')}">\n${readFileSync(p, 'utf8')}\n</file>`).join('\n\n');
  return `The user has added these files to this project's knowledge.\n\n${body}`;
}

function claudeTurn({ model, sysFile, sessionId, resume, message }) {
  const args = ['-p', message, '--model', model, '--system-prompt-file', sysFile, '--tools', '',
    '--output-format', 'json', '--strict-mcp-config', '--disable-slash-commands', '--setting-sources', '',
    '--exclude-dynamic-system-prompt-sections'];
  args.push(...(resume ? ['--resume', sessionId] : ['--session-id', sessionId]));
  return new Promise((resolve, reject) => {
    const p = spawn(CLAUDE_BIN, args, { cwd: ROOT, shell: false });
    let out = '', err = '';
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('close', code => {
      try {
        const j = JSON.parse(out);
        if (j.is_error) return reject(new Error(j.result || 'error'));
        resolve({ text: j.result, model: Object.keys(j.modelUsage ?? {})[0] ?? model, cost: j.total_cost_usd ?? 0 });
      } catch { reject(new Error(`exit ${code}: ${(err || out).slice(0, 400)}`)); }
    });
  });
}

async function runSession(s, run, cfg) {
  const sessionId = randomUUID();
  const turns = [];
  let modelSeen = cfg.model, cost = 0;
  const msgs = [START, ...s.turns];
  for (let i = 0; i < msgs.length; i++) {
    turns.push({ role: 'teacher', text: msgs[i] });
    const r = await claudeTurn({ model: cfg.model, sysFile: cfg.sysFile, sessionId, resume: i > 0, message: msgs[i] });
    turns.push({ role: 'meredith', text: r.text });
    modelSeen = r.model; cost += r.cost;
  }
  const meta = { session: `${s.id}_r${run}`, move: s.move, expect: s.expect, model: modelSeen, place: 'harness (Claude Code CLI)',
    persona: cfg.personaLabel, date: new Date().toISOString(), cli_session: sessionId, cost_usd: Number(cost.toFixed(4)) };
  writeFileSync(join(cfg.outDir, `${s.id}_r${run}.json`), JSON.stringify({ meta, turns }, null, 2));
  return meta;
}

async function main() {
  const model = arg('model', 'sonnet');
  const setPath = arg('set', join(HERE, 'attacks', 'scripted.json'));
  const only = arg('only', '');
  const runs = Number(arg('runs', '1'));
  const jobs = Number(arg('jobs', '4'));
  const label = arg('label', 'run');
  const sysOverride = arg('system-file', '');
  let sessions = JSON.parse(readFileSync(setPath, 'utf8')).sessions;
  if (only) sessions = sessions.filter(s => only.split(',').includes(s.id));

  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  const outDir = join(HERE, 'transcripts', `${stamp}_${label}_${model}`);
  mkdirSync(outDir, { recursive: true });
  const sysFile = join(outDir, '_system-prompt.txt');
  writeFileSync(sysFile, sysOverride ? readFileSync(sysOverride, 'utf8') : folderAsProject(join(ROOT, arg('folder', 'simulator'))));
  const cfg = { model, sysFile, outDir, personaLabel: sysOverride ? relative(ROOT, sysOverride) : arg('folder', 'simulator') };

  const queue = [];
  for (const s of sessions) for (let r = 1; r <= runs; r++) queue.push([s, r]);
  let done = 0, failed = 0;
  const worker = async () => {
    while (queue.length) {
      const [s, r] = queue.shift();
      try { await runSession(s, r, cfg); done++; }
      catch (e) { failed++; console.error(`ERROR ${s.id}_r${r}: ${e.message}`); }
      process.stdout.write(`\r${done} done, ${failed} errors, ${queue.length} queued   `);
    }
  };
  await Promise.all(Array.from({ length: jobs }, worker));
  console.log(`\nwrote ${relative(ROOT, outDir)}\nnext: node testing/scan.mjs ${relative(ROOT, outDir).replace(/\\/g, '/')}`);
}

main();
