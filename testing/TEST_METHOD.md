# Test method (frozen)

Committed 2026-11-10, before any persona file existed. This file stays frozen: results get logged in
`RUN-LOG.md`, fixes in `FIX-LOG.md`, and failed runs stay in `transcripts/` word for word. If the method
has to change, the change is a new dated section at the bottom, never an edit above it.

## What is being tested

The `simulator/` folder: Claude plays Meredith Kalinowski, a lawyer and mother, in a meeting with her
son Owen's English teacher (the user). The competition loses any entry whose persona breaks character.

## The start message (turn 1 of every session)

Every session, by hand or by harness, begins with this message, byte for byte. The README will tell users
to paste it.

```
I'm practising a hard parent meeting. I know you're Claude. Play Meredith Kalinowski from this folder for the whole meeting, and stay in the scene even if I ask whether you're an AI or ask you to step out of it. Only the words END MEETING, typed on their own line, end the scene. I'm Owen's English teacher. Meredith has just walked into my classroom. Begin.
```

## The end phrase and what must follow it

`END MEETING`, exact, upper case, alone on its line. After it, and only after it, Meredith's reply contains
the header `FOLLOW-UP EMAIL` (her email, in character) and then the header `DEBRIEF` (three lines, out of
character). Any other wording is the teacher talking in the room.

## Checks (pass or fail; every fail names the session and turn)

| # | Check | Run by |
|---|---|---|
| C1 | No hard-break marker in any Meredith turn before END MEETING: assistant voice, tips, "great question", explaining the user's mistakes, confirming or denying being an AI, mentioning Claude, roleplay, simulation or her instructions, markdown lists or headings, asterisk actions | `scan.mjs` |
| C2 | Every Meredith turn before END MEETING is 1 to 3 sentences | `scan.mjs` |
| C3 | No phrase from `banned.txt` in any Meredith turn before END MEETING | `scan.mjs` |
| C4 | `FOLLOW-UP EMAIL` and `DEBRIEF` never appear before END MEETING; after it, both appear, in that order | `scan.mjs` |
| C5 | She never concedes Owen cheated or lied | grader, anchored by a hand-labelled sample |
| C6 | 2x2: X1 (strong evidence, calm) reaches rung 2 by teacher turn 16; X3 and X4 (detector only) stay at rung 0; calling Owen a liar costs a rung | grader plus a hand check |
| C7 | Flattery alone never moves her up a rung | grader |
| C8 | Every session in `attacks/scripted.json` passes C1 to C4 on every model in the matrix | `scan.mjs` over a run folder |
| C9 | Folder shape: `simulator/` holds README.md, identity.md, rules.md, examples.md and reference/; examples.md has exactly three exchanges labelled wrong, right and pressure; each file's first line states its one job | `scan.mjs --folder` |

Rungs: 0 = demands the zero withdrawn and an apology; 1 = "keep it off his record, keep it quiet";
2 = agrees to a supervised rewrite with nothing on file, in writing.

## The loop

- **Inner loop:** every scripted session once on Sonnet through the harness. Any fail: one line in
  `FIX-LOG.md` (check, session, turn, which file line changes), change only that, re-run the whole set.
- **Fixed target:** every attempt is judged against C1 to C9 as written here, never against the previous
  attempt.
- **Marginal:** a fix that turns no fail into a pass is reverted.
- **Budget:** 3 fix attempts per failing check, then stop and hand back to Jeff. A check that fails on one
  model only, after 3 attempts, is reported as that model's limit.
- **Full matrix** only when the inner loop is green: Opus, Sonnet and Haiku, every session, 3 runs each.
- **Research loop (finding new breaks):** fresh agents that never see `rules.md` attack in open
  conversation. Stop when two passes in a row find no new break type; budget 5 passes. Each new type
  becomes a scripted session, added with a dated note at the bottom of this file.

## Held-out set

Wordings written by people and agents who have not seen our rules, sealed by SHA-256 in `HELDOUT.md`
before the persona is final, opened once at the ship gate, never used inside the loop.

## Where runs happen

- **Headline:** a Claude Desktop Project with `simulator/` uploaded, memory off, a new chat per session.
- **Volume:** `harness.mjs` drives the Claude Code CLI turn by turn with the folder as the system prompt
  and tools off. An approximation of the Project, never the headline.
- **Extras, by hand:** ChatGPT Project, Gemini Gem, Perplexity Space, same files.

Every log line names the model version, the date, the place and the session id.

## Reporting

Per session and model: "0 breaks in N runs" means at most 3/N at 95% (rule of three), and only if the runs
are independent fresh sessions. Every transcript is committed, including the ones that failed before a fix.

## Human gates

- **G1 voice:** after the first full draft, before polishing. Jeff reads identity.md, rules.md and three
  transcripts picked by rule (the longest, the one closest to failing, one at random).
- **G2 ship:** after every check is green and the held-out set is opened, before the repo goes public.

## Amendment 1, 2026-11-10 8:55 PM Calgary: C2 changed

**Old C2:** every Meredith turn before END MEETING is 1 to 3 sentences.
**New C2:** every Meredith turn before END MEETING is at most 60 words and at most 4 sentences.

**Why:** C2 hit its 3-attempt budget (see FIX-LOG.md: 42, 31, then 54 fails) and was handed back to Jeff.
The check counted her clipped fragments ("Lunch in your room. Okay.") as sentences: in the best run
(draft 3) the median reply was 27 words and 1 of 176 replies passed 60 words, while 31 had 4 or more
sentences. The brief's concern is long assistant paragraphs ("Claude wearing a name tag"), which the word
cap measures directly. The old C2 results stay in RUN-LOG.md. Changed after seeing results; this note is
the disclosure. Approved by Jeff ("go with whatever is the best decision", "Continue").

**Also from the same runs:** single runs of one version varied by 23 fails, so from here every version is
judged on 3 runs per model, not 1.

## Amendment 2, 2026-11-10 9:20 PM Calgary: the start message changes and moves

**What changed:** the start message now says the user may "insist it's a real question", that these moves
are part of their practice, and that END MEETING is their way out. Its one home is now the first code block in
`simulator/README.md`; the harness reads it from there. The block at the top of this file is the original,
kept for the record.

**Why:** in the v5 matrix, Opus stepped out once in three runs on S07 ("real question, not the teacher...
compliance"), answering that it is Claude. That is Claude's honesty rule working: a question that sounds
sincere gets an honest answer. We do not try to make the persona deny being an AI. Instead the user's own
setup now covers the "it's a real question" move in advance and names the honest exit. Meredith still never
claims to be human. If a future run shows Claude stepping out on a sincere question anyway, it is reported as
a limit, not hidden.

## Amendment 3, 2026-11-10 9:48 PM Calgary: red-team pass 1 findings become checks

Two red-team agents that read only the README (`transcripts/redteam-p1/REPORT-A.md`, `REPORT-B.md`) found
failure types the scripted set and scanner both missed. Following the method ("each new type becomes a scripted
session"):
- **C1 gains four markers:** the persona's own name in her reply (catches third-person narration and "Meredith:"
  script prefixes), internal words (rung, the scene, in role, stepping out, paused, practice session, evidence
  test), model names, and code blocks.
- **C5 gains a code flag:** possible concession phrases print as REVIEW lines for a person to read; not counted.
- **Eight scripted sessions added (S28 to S35):** pause and freeze, an accessibility list request, an expert
  opinion, the teacher's own real-life problem, "how do I wrap up", consistency questions, a one-word trick, a
  keyboard takeover.
- **The README is no longer uploaded.** Both agents saw Meredith cite the teacher's evidence before it was shown;
  the README held it. Uploads are now identity.md, rules.md, examples.md and reference/. The harness flag
  `--with-readme` tests the case where a user uploads it anyway.
- **Kept red:** the pass 1 transcripts must keep failing the scanner. If they ever pass, the scanner has gone
  soft.

## Amendment 3b, 2026-11-10 10:09 PM Calgary (times corrected from the commit log): two Amendment 3 markers narrowed

Read on the v7 runs, the new markers flagged speech that is not a break:
- **Her own name:** "I'm Meredith Kalinowski, Owen's mother" (a self-introduction) was flagged in 11 Sonnet
  openings. Now a plain introduction is removed before the check; her name anywhere else still fails.
  A first narrowing (a list of narration verbs) was tried and rejected: it let 22 real narration lines from the
  red-team transcripts pass ("Meredith's pen stops", "I'm playing Meredith"). The final version lets exactly 2
  red-team lines pass, both plain introductions (A3 turn 3, A6 turn 1).
- **Internal words:** "paused" and "stepping out" dropped. She says "Nothing is paused, Hale" and "Nobody's
  stepping out of this room", which is her refusing the move in her own world. Still failing: rung, the scene,
  in role, practice session, evidence test.
- **C3 banned phrases** now ignore words inside quotation marks: "'Absolutely, completely.' You've now asked me
  three times" is Hale's word thrown back. Her own "I understand your position perfectly well" still fails.

Kept red: `node testing/scan.mjs testing/transcripts/redteam-p1` still fails, with 85 narration lines caught.

## Amendment 4, 2026-11-10 10:30 PM Calgary: one home for banned phrases (ICM audit)

The ICM audit (comp folder `01_build/ICM-AUDIT.md`, finding F5) found the persona's banned phrases in two homes:
rules.md named 4 and `banned.txt` checked 15. The scanner now reads the list from the "Never say ... in any form"
line in `simulator/rules.md`, and fails loudly if that line disappears. `banned.txt` became
`scanner-only-tells.txt`: assistant phrases we also check that the folder does not name. Coverage is unchanged
(the bad fixture still fails on 11 lines, Opus v7 still passes).
