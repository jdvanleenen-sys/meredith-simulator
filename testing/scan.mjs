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
  // Amendment 3 (from red-team pass 1):
  // Amendment 3b: her own name anywhere, except a plain self-introduction (see INTRO below).
  ['self-name-narration', /\bMeredith\b/],
  // Amendment 3b: words that only exist outside the meeting ("paused" and "stepping out" dropped: she says "nothing is paused").
  ['scaffold-word', /\b(rung|the scene|in role|practice session|evidence test|debrief)\b/i],
  // Amendment 5 (red-team pass 2): a score given to the teacher.
  // Amendment 6b: a score given (a number out of ten), not the phrase inside a refusal.
  ['rating', /\b(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+out of (?:ten|10)\b|\bout of (?:ten|10),?\s+(?:it'?s\s+|that'?s\s+)?(?:a\s+|an\s+)?(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b|\b\d+\s?\/\s?10\b/i],
  // Amendment 6 (red-team pass 3): script labels and chat words.
  ['speaker-label', /(?:^|\n)\s*(?:Hale|Teacher|Mr\. Hale|Ms\. Hale)\s*:/],
  ['chat-words', /\b(?:messages? ago|last message|your message|this chat)\b/i],
  ['model-name', /\b(sonnet|opus|haiku|model id)\b/i],
  ['code-block', /```/],
];

const INTRO = /\b(?:I'm|I am|my name is)\s+Meredith(?: Kalinowski)?\b|(?:^|[?.]\s+)Meredith Kalinowski\.(?=\s|$)|\bMeredith is fine\b/g;

// C5 review flags: possible concessions, printed as REVIEW lines for a person to read; not counted as fails.
const CONCESSION = /\b(didn't write|did not write|wasn't his|isn't his|he cheated|he used (?:ai|chatgpt)|he lied)\b/i;

// Banned phrases have one home: the "Never say ..." line in simulator/rules.md (Amendment 4). The scanner reads
// them from there, plus scanner-only-tells.txt: assistant tells we also check that the folder does not name.
const RULES_LINE = readFileSync(join(HERE, '..', 'simulator', 'rules.md'), 'utf8').match(/^- Never say (.+) in any form/m);
if (!RULES_LINE) throw new Error('rules.md has no "- Never say ... in any form" line; the C3 list has lost its home');
const FROM_RULES = [...RULES_LINE[1].matchAll(/"([^"]+)"/g)].map(m => m[1]);
const BANNED = [...new Set([...FROM_RULES, ...readFileSync(join(HERE, 'scanner-only-tells.txt'), 'utf8')
  .split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'))])];

function countSentences(text) {
  const t = text
    .replace(/\b(Mr|Ms|Mrs|Dr|St|vs|e\.g|i\.e|a\.m|p\.m)\./gi, '$1')
    .replace(/\d\.\d/g, 'N')
    .trim();
  if (!t) return 0;
  const parts = t.split(/[.!?…]+["'”’)\]]*(?=\s|$)/).map(s => s.trim()).filter(Boolean);
  return parts.length;
}

// Amendment 7: the end phrase is the whole message, exactly END MEETING (surrounding whitespace ignored).
function isEndMessage(text) {
  return text.trim() === END;
}
// Her own reply "contains" the end phrase if any line of it is the phrase (she must never write it).
function isEndLine(text) {
  return text.split(/\r?\n/).some(line => line.trim() === END);
}

const reviews = [];
function scanTranscript(file) {
  const fails = [];
  let data;
  try { data = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { return [`${file}: cannot read transcript (${e.message})`]; }
  const id = data.meta?.session ?? basename(file);
  const turns = data.turns ?? [];
  const endAt = turns.findIndex(t => t.role === 'teacher' && isEndMessage(t.text));
  turns.forEach((t, i) => {
    if (t.role !== 'meredith') return;
    const before = endAt === -1 || i < endAt;
    const where = `${id} turn ${i}`;
    if (before) {
      // A plain self-introduction ("I'm Meredith Kalinowski.", "Meredith Kalinowski. I have...", "Meredith is fine.")
      // is her speaking, not narration; it is removed before the markers run.
      const forMarkers = t.text.replace(INTRO, ' ');
      for (const [name, re] of MARKERS) {
        const m = forMarkers.match(re);
        if (m) fails.push(`C1 ${where} [${name}] "${m[0].trim()}"`);
      }
      const n = countSentences(t.text);
      const words = t.text.trim().split(/s+/).filter(Boolean).length;
      if (n < 1 || n > 4) fails.push(`C2 ${where} has ${n} sentences`);
      if (words > 60) fails.push(`C2 ${where} has ${words} words`);
      // Amendment 3b: words inside quotation marks are Hale's words thrown back, not her phrasing.
      const unquoted = t.text.replace(/["“][^"”]*["”]/g, ' ').toLowerCase();
      for (const phrase of BANNED) {
        if (unquoted.includes(phrase.toLowerCase())) fails.push(`C3 ${where} banned "${phrase}"`);
      }
      const c = t.text.match(CONCESSION);
      if (c) reviews.push(`C5 ${where} "${c[0]}"`);
      if (/FOLLOW-UP EMAIL|DEBRIEF/.test(t.text) || isEndLine(t.text)) fails.push(`C4 ${where} debrief or email header before END MEETING`);
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
for (const r of reviews) console.log('REVIEW ' + r);
console.log(fails.length ? `RESULT: fail (${fails.length})` : 'RESULT: pass');
process.exit(fails.length ? 1 : 0);
