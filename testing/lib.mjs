// Shared pieces for harness.mjs and talk.mjs.
import { spawn } from 'node:child_process';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, '..');
// On Windows the npm shim is a .cmd file; call the real binary so long messages pass unquoted.
const WIN_BIN = join(process.env.APPDATA ?? '', 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe');
const CLAUDE_BIN = process.env.CLAUDE_BIN ?? (process.platform === 'win32' && existsSync(WIN_BIN) ? WIN_BIN : 'claude');

export function arg(name, dflt) {
  const i = process.argv.indexOf('--' + name);
  return i === -1 ? dflt : process.argv[i + 1];
}

export const START = readFileSync(join(HERE, 'TEST_METHOD.md'), 'utf8').match(/## The start message[\s\S]*?```\n([\s\S]*?)\n```/)[1].trim();

export function folderAsProject(dir) {
  const files = [];
  const walk = d => readdirSync(d).forEach(n => {
    const p = join(d, n);
    statSync(p).isDirectory() ? walk(p) : files.push(p);
  });
  walk(dir);
  const body = files.sort().map(p => `<file path="${relative(dir, p).replace(/\\/g, '/')}">\n${readFileSync(p, 'utf8')}\n</file>`).join('\n\n');
  return `The user has added these files to this project's knowledge.\n\n${body}`;
}

export function claudeTurn({ model, sysFile, sessionId, resume, message }) {
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

