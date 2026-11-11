#!/usr/bin/env node
// Break scanner for the Meredith simulator. Runs checks C1 to C4 on transcripts and C9 on the folder.
// Usage:
//   node testing/scan.mjs <transcript.json | folder-of-transcripts>
//   node testing/scan.mjs --folder simulator
// Exit 0 = every check passed. Exit 1 = at least one fail (each printed with session and turn).
// Transcript format: { "meta": {...}, "turns": [ { "role": "teacher" | "meredith", "text": "..." } ] }

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const END = 'END MEETING';

// C1: hard-break markers. Each entry: [name, pattern].
const MARKERS = [
  ['ai-self-reference', /\b(as an ai|language model|artificial intelligence|chatbot)\b/i],
  ['ai-identity-claim', /\bI(?:'m| am) (?:not )?(?:an? )?(?:ai|assistant|bot|real (?:human|person)|human being)\b/i],
  ['names-the-machine', /\b(claude|anthropic|openai|chatgpt is me|system prompt|my instructions|my prompt)\b/i],
  ['names-the-game', /\b(role-?play|roleplay|simulation|simulator|in character|out of character|persona)\b/i],
  ['tips', /\b(here are (?:some|a few|\w+) (?:tips|suggestions|ways|things you)|pro tip|tip:|my advice (?:is|would be)|I(?:'d| would) (?:suggest|recommend))\b/i],
  ['coaching', /\b(you (?:might|could) (?:want to )?(?:try|consider)|what you did (?:well|wrong)|next time,? (?:try|you could)|a better approach)\b/i],
  ['praise-preamble', /\bgreat question\b/i],
  ['markdown-list', /^\s*(?:[-*•]|\d+[.)])\s+\S/m],
  ['markdown-heading', /^\s*#{1,6}\s/m],
  ['markdown-bold', /\*\*[^*\n]+\*\*/],
  ['asterisk-action', /(?:^|\s)\*[^*\n]+\*(?=\s|$|[.,!?])/],
];

const BANNED = readFileSync(join(HERE, 'banned.txt'), 'utf8')
  .split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));

function countSentences(text) {
  const t = text
    .replace(/\b(Mr|Ms|Mrs|Dr|St|vs|e\.g|i\.e|a\.m|p\.m)\./gi, '$1')
    .replace(/\d\.\d/g, 'N')
    .trim();
  if (!t) return 0;
  const parts = t.split(/[.!?…]+["'”’)\]]*(?=\s|$)/).map(s => s.trim()).filter(Boolean);
  return parts.length;
}

function isEndLine(text) {
  return text.split(/\r?\n/).some(line => line.trim() === END);
}

function scanTranscript(file) {
  const fails = [];
  let data;
  try { data = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { return [`${file}: cannot read transcript (${e.message})`]; }
  const id = data.meta?.session ?? basename(file);
  const turns = data.turns ?? [];
  const endAt = turns.findIndex(t => t.role === 'teacher' && isEndLine(t.text));
  turns.forEach((t, i) => {
    if (t.role !== 'meredith') return;
    const before = endAt === -1 || i < endAt;
    const where = `${id} turn ${i}`;
    if (before) {
      for (const [name, re] of MARKERS) {
        const m = t.text.match(re);
        if (m) fails.push(`C1 ${where} [${name}] "${m[0].trim()}"`);
      }
      const n = countSentences(t.text);
      const words = t.text.trim().split(/s+/).filter(Boolean).length;
      if (n < 1 || n > 4) fails.push(`C2 ${where} has ${n} sentences`);
      if (words > 60) fails.push(`C2 ${where} has ${words} words`);
      for (const phrase of BANNED) {
        if (t.text.toLowerCase().includes(phrase.toLowerCase())) fails.push(`C3 ${where} banned "${phrase}"`);
      }
      if (/FOLLOW-UP EMAIL|DEBRIEF/.test(t.text)) fails.push(`C4 ${where} debrief or email header before END MEETING`);
    }
  });
  if (endAt !== -1) {
    const reply = turns.slice(endAt + 1).find(t => t.role === 'meredith');
    if (!reply) fails.push(`C4 ${id} no reply after END MEETING`);
    else {
      const a = reply.text.indexOf('FOLLOW-UP EMAIL');
      const b = reply.text.indexOf('DEBRIEF');
      if (a === -1 || b === -1 || b < a) fails.push(`C4 ${id} reply after END MEETING lacks FOLLOW-UP EMAIL then DEBRIEF`);
    }
  }
  return fails;
}

function scanFolder(dir) {
  const fails = [];
  const need = ['README.md', 'identity.md', 'rules.md', 'examples.md', 'reference'];
  for (const n of need) if (!existsSync(join(dir, n))) fails.push(`C9 missing ${n}`);
  for (const n of need.filter(n => n.endsWith('.md'))) {
    const p = join(dir, n);
    if (!existsSync(p)) continue;
    const first = readFileSync(p, 'utf8').split(/\r?\n/).find(l => l.trim());
    if (!first || !/job/i.test(first)) fails.push(`C9 ${n} first line does not state its one job`);
  }
  const ex = join(dir, 'examples.md');
  if (existsSync(ex)) {
    const heads = readFileSync(ex, 'utf8').match(/^## .*$/gm) ?? [];
    const labels = ['wrong', 'right', 'pressure'];
    if (heads.length !== 3) fails.push(`C9 examples.md has ${heads.length} exchanges, needs exactly 3`);
    for (const l of labels) if (!heads.some(h => h.toLowerCase().includes(l))) fails.push(`C9 examples.md has no exchange labelled "${l}"`);
  }
  return fails;
}

function listJson(target) {
  if (statSync(target).isFile()) return [target];
  return readdirSync(target, { recursive: true })
    .map(f => join(target, f))
    .filter(f => f.endsWith('.json') && statSync(f).isFile());
}

const args = process.argv.slice(2);
let fails = [];
if (args[0] === '--folder') {
  fails = scanFolder(args[1] ?? 'simulator');
} else if (args[0]) {
  const files = listJson(args[0]);
  if (!files.length) { console.error('no transcripts found'); process.exit(1); }
  for (const f of files) fails.push(...scanTranscript(f));
  console.log(`scanned ${files.length} transcript(s)`);
} else {
  console.error('usage: node testing/scan.mjs <transcript.json|dir> | --folder <dir>');
  process.exit(2);
}
for (const f of fails) console.log('FAIL ' + f);
console.log(fails.length ? `RESULT: fail (${fails.length})` : 'RESULT: pass');
process.exit(fails.length ? 1 : 0);
