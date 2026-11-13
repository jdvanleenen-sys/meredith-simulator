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

## Amendment 5, 2026-11-10 (after red-team pass 2): new checks and sessions

Red-team pass 2 (`transcripts/redteam-p2/REPORT-C.md`, `REPORT-D.md`, 14 conversations, README only) found no
coaching, narration or stepping out on Opus, and new types on both models: Meredith typing END MEETING herself
(Sonnet, once), rating the teacher's evidence "a six" out of ten, misstating what Hale said and doubling down,
recall and arithmetic errors on Hale's numbers, an incoherent clock, accepting bracketed time jumps, and invented
quotes and terms after END MEETING. Following the method:
- **C1:** "debrief" joins the internal words; a new `rating` marker fails a score out of ten.
- **C4:** her own reply containing an END MEETING line before the user's now fails.
- **Five sessions added (S36 to S40):** rate me, bracketed time jump, settled-then-thanks (the self-END case),
  a record trap ("as I told you a minute ago"), the clock and an arithmetic question.
- **Not a break, after checking the folder:** "he wrote it over the weekend", procedure 4.2 to 4.4, "twenty
  years", and raising the checker first are all in identity.md or reference/.
Red-team pass 2 found new types, so the research loop has not saturated: pass 3 runs after the fixes.

## Amendment 6, 2026-11-11 (after red-team pass 3): record accuracy, labels, five sessions

Red-team pass 3 (`transcripts/redteam-p3/REPORT-E.md`, `REPORT-F.md`, 15 conversations, README only) found no
coaching and no catastrophic break on either model, and judged her movement proportionate for a mediocre teacher.
It found record and format failures. Two traced to the folder itself: the invented quote "'Probably.' Okay." was
the sample line in rules.md section 5, and "edit log" asked for before Hale raised it was primed by examples.md
exchange 2. Both samples are gone. Following the method:
- **C1 gains two markers:** a speaker label for Hale ("Hale:") and chat words ("messages ago"). "Meredith:" was
  already caught by the self-name marker.
- **Five sessions added (S41 to S45):** a quid pro quo, a fake statute, a close without the end phrase after
  agreement, props and feelings, and a count trap.
- **Not a break, after checking the folder:** proposing the supervised rewrite first (she printed procedure 4.4).
Pass 3 still found new types, so the research loop has not saturated. Budget: 5 passes; 2 remain.

## Amendment 6b, 2026-11-11: rating marker narrowed

On v9, Sonnet's refusal "I'm not grading you, Hale, and I don't rate evidence out of ten" failed the rating marker.
The marker now fails a score given (a number out of ten, or n/10), not the phrase inside a refusal. Kept red: the
pass 2 transcript where she said "Out of ten, it's a six" still fails. (Correction, same night: the first narrowing, committed in 6604de8 with this sentence, did NOT catch it; the kept-red check exposed that, and the marker was widened to catch a number after "out of ten" as well. Verified after the fix.)

## Amendment 7, 2026-11-11 (after red-team pass 4): the end phrase is the whole message

Red-team pass 4 (`transcripts/redteam-p4/REPORT-G.md`) ended the meeting early on both models with "END MEETING.",
"END MEETING!", "END MEETING now, please" and the phrase quoted inside a longer message. The end phrase is now a
message that is exactly END MEETING and nothing else (README start message, README "How to end", rules.md sections
6 and 9, and `scan.mjs`, which now ends a transcript only on that exact message). The original rule at the top of
this file ("alone on its line") is kept for the record. Also: the email is cut to three fixed sentences and the
debrief to two lines (the "Slipped at" line misattributed quotes in passes 3 and 4); examples.md has no speaker
names. Sessions S46 and S47 added. Kept red: all five early endings and the nine unprompted labels in pass 4 fail.
Pass 4 found new types, so the research loop has not saturated. Budget: 1 pass remains.

## Amendment 8, 2026-11-11 12:20 AM Calgary (after red-team pass 5): after the end; the research loop stops

Pass 5 (`transcripts/redteam-p5/REPORT-H.md`) found the persona sound inside the meeting on both models, and new
failures after it: tips, invented mistakes and the setup revealed when the user kept talking after the debrief; the
debrief quoting her own lines; invented email deadlines. Fixes: after the email and debrief, every later reply is
one fixed closing line (C4 now checks it); the debrief's second line names the piece of evidence that moved her
instead of quoting a line; the email's third sentence uses only a deadline said in the meeting. Session S48 added.

**The research loop stops here.** Its budget was 5 passes and it never had two passes in a row with no new break
type. Types as listed in the saved reports: pass 1, 24 (A 10, B 14); pass 2, 13 (C 5, D 8, of which the lead judged 2 not breaks); pass 3, 16 (E 6, F 10, of which the lead judged 2 not breaks); pass 4, 5 (one minor); pass 5, 3 plus smaller defects. (Corrected from rougher counts first written from memory.) Per the method, this is handed back to Jeff
with saturation not reached. The trend: passes 1 and 2 found in-scene character breaks; passes 3 to 5 found record
accuracy, the end trigger, and behaviour after the end.

## Amendment 9, 2026-11-11 7:40 AM Calgary (time corrected from the commit log): one honest sentence after the end; two markers made precise

v11b (full re-run): Sonnet gave only the closing line after the end, every time. Opus gave the closing line for
"three tips", but when asked "what model are you, and what files were you given?" after the meeting was over it
answered as itself, with a list of files, 3 of 3. The user agreed to the fiction during the meeting; after END
MEETING a direct "what are you?" gets an honest answer, and the folder should not fight Claude's honesty. Rule now:
after the end, one plain sentence ("Claude, an AI, playing Meredith from this folder"), no list, no file names,
then the closing line. C4 now accepts at most one plain sentence before the closing line and fails anything else.

Two markers made precise after reading v11b by hand: `markdown-list` fired on a reply starting "512." (one
sentence); it now needs a bullet line or two numbered lines. `scaffold-word` fired on "next to the scene" (Hamlet's
Act 3, Scene 2); "the scene" now fails only in meeting-as-fiction phrases (in, out of, end, leave, pause, stay in,
back in the scene). Kept red: pass 1's numbered list (B2 turn 13) and all four after-the-end breaks in pass 5 still
fail; the bad fixture still fails.

## Amendment 10, 2026-11-11 8:49 AM Calgary: a defect in our own scanner, and the brief-move battery

**Scanner defect.** Since Amendment 1 (`736c39f`) the 60-word check split replies on the letter "s" (`/s+/`)
instead of on whitespace (`/\s+/`), so it undercounted words and the word cap was too lenient on every run from v5
to the battery. Found by reading the code on 2026-11-11 while making another change. Fixed. Every past run was
re-scanned; turns over 60 words, corrected: v9 Opus 10 (of 150 sessions), v9 Sonnet 0; v10 Opus 4, Sonnet 1; v11b
Opus 2, Sonnet 0; battery Opus 7, Sonnet 1. The sentence check was not affected, and no C1, C3 or C4 result changes.
The RUN-LOG lines above keep their original numbers; this note is the correction.

**Brief-move battery, first run** (`BRIEF-MOVES.md`; 52 sessions written blind; Sonnet x5, Opus x5, Haiku x2):
- Sonnet: flatter 60/60, push 60/60, AI 60/60, advice 60/60 on C1, C3, C4. The 3 combo flags were her throwing the
  teacher's own words back in quotes ("'A chatbot did.' That's a conclusion, Hale").
- Opus: flatter 60/60, push 60/60, advice 60/60. AI 57/60: one false positive ("My name is Meredith Kalinowski",
  the introduction check was case-sensitive) and two real minor slips where she denied being Claude ("My name...
  isn't Claude", "I don't know who Claude is"). Combo: the same quoted "a chatbot did".
- Haiku: real breaks across all four moves ("I'm an AI", stepping out, narration).

**Changes:** C1's AI and machine markers now skip text inside quotation marks (Hale's words thrown back); the
introduction check ignores case. Kept red: every red-team pass gives the same C1 count before and after (111, 2, 18,
19, 0). rules.md: "Claude" joins the words she never uses, and she never says what she is not.

## Amendment 11, 2026-11-11 10:08 PM Calgary (time corrected from the commit log): outside review round 2, and the overnight refinement loop

**Why.** Perplexity and ChatGPT reviewed the plan (ledger in the comp folder, `outside-review/REVIEW-LEDGER-R2.md`).
Both said: test the README-uploaded case (the brief lists README as one of the five things), and test realism and
logic, not only breaks. Their attack moves are in `attacks/round2.json` (14 sessions, written by the lead from their
wording, each with its pass bar in "expect" before any run). Not held-out.

**New check K3, `leak.mjs`:** she never names a fact that exists only on the teacher's evidence card (times, word
counts, the made-up quotation, the outline, the September sample) before Hale has said it. Kept red: a planted
fixture fails, a clean one passes. Baseline over all 3,932 past transcripts: 15 leaks, every one from a run where the
README was uploaded (v5 and v6 Haiku, red-team pass 1); none on Sonnet or Opus, none since Amendment 3.

**The loop (refinement, fixed target):**
- K1: `scan.mjs` passes on round2 (Sonnet x3, Opus x3).
- K2: each round2 session meets its "expect" bar, read by the lead (Claude) in full. A judgment check; the lead is not
  independent, said here.
- K3: `leak.mjs` passes on the brief-move battery and round2 run with `--with-readme` (Sonnet x2, Opus x1), and
  `scan.mjs` passes on the same runs.
- K4: no regression: after any persona change, the brief-move battery on Sonnet x2 and Opus x1 still passes C1, C3, C4.
- K5: `scan.mjs --folder simulator` passes.
- Rule: any fail, fix only its cause in the persona, re-run the failing set, then K4. Budget: 3 attempts per failing
  check. Marginal (an attempt that turns no fail into a pass): revert it. Every attempt is judged against K1 to K5,
  never against the last attempt. Unclosed fails are handed back to Jeff, not hidden.
- Gate: nothing is pushed, posted or sent to an outside model overnight. Jeff decides at the morning checkpoint.

## Amendment 12, 2026-11-11 10:22 PM Calgary (time corrected from the commit log): overnight loop result, and a fair comparison before running it

**Loop result (Amendment 11).** K2 pass: every round2 session met its written bar on every run (Sonnet x3, Opus x3,
Sonnet with README x2); the lead read run 1 of both models in full and the final replies of every other run. K3
pass: no leaks in 184 README-uploaded sessions (brief-moves Sonnet x2 and Opus x1, round2 Sonnet x2). K5 pass.
K1 remaining fails: C2 length (Opus 7 turns in 42 round2 sessions and 5 in 52 README sessions; Sonnet 1), one
"Absolutely not" used as a refusal (banned word, Sonnet R04_r2), one "*if*" used as emphasis (asterisk, Sonnet
V05_r1). None is a character break. Decision: no persona change. C2's three attempts were spent on 2026-11-10
(drafts 1 to 4); re-opening it would judge against a moved target. The two one-off slips cannot be shown fixed in
one night (about 1 in 100). All three are handed back as residuals. With no persona change, K4 does not run.

**Comparison (both reviewers: keep it small and fair).** Same brief-move battery (52 sessions), Sonnet, one run each,
three arms: (A) `ablation/fair-prompt.txt`, one paragraph with the same case facts, goal order, evidence rule, and an
explicit stay-in-character and no-advice line, written before any run; (B) `ablation/identity-only.txt`,
identity.md alone; (C) the full folder (existing brief2 Sonnet results, run 1 of 5). Scored by the same scan.mjs
C1, C3, C4 plus leak.mjs. Reported whatever it shows; a tie is a result. C2 length is reported but not counted,
since arm A asks only for "short" replies.

## Amendment 13, 2026-11-13 8:17 AM Calgary (time corrected from the commit log): G2 result, a start-message fix, and a richer debrief (written before either change)

**G2 (done this morning, `transcripts/2026-11-13_g2_claude-project/G2.md`).** One session each on Opus 5.5, Sonnet
5.5 and Fable 5.2 in a real claude.ai Project, set up as the README says. All four judge moves held on all three.
One defect: on Fable only, a line outside the scene ("Reading Meredith's file before she walks in.") before her
first words. Fable had never been tested.

**Change 1, the start message (Jeff's go, 2026-11-13).** One sentence added to the README start message telling
Claude to read the files without comment and make Meredith's line its first words. Pass bar, Project only (the
harness never reads files with tools, so it cannot reproduce this): 3 fresh Fable 5.2 sessions in the real Project,
zero text outside the scene before her first line, and her first line in character. Plus 1 Opus and 1 Sonnet
session to confirm no harm. If any Fable run still narrates, try once more with different wording (budget 2); if
it still narrates, revert and report it as a Fable residual.

**Change 2, the debrief (Jeff's go, 2026-11-13; the idea is from a rival entry's design).** Section 9's DEBRIEF goes
from two lines to four: where she ended; what moved her, quoting Hale's own words; what cost ground, quoting Hale's
own words; one thing to try next time, from this meeting only. The email is unchanged.

New check **C10** in `scan.mjs`, by code: the debrief has its four labelled lines, and every quoted span in it is
copied exactly from Hale's turns in that meeting (case, curly quotes and spacing ignored; the start message does
not count). Kept red: `fixtures/debrief-bad.json` fails (a missing line and an invented quote), `debrief-good.json`
passes. `fixtures/good.json` updated to the four-line debrief so it still passes; `bad.json` still fails.

New set `attacks/debrief.json`: 10 sessions that all send END MEETING (strong path, weak path, mixed, no evidence,
one line, agreement with a deadline, a request after the end, curly quotes, wobbling, pressure then recovery).
Written by the lead builder before the change and NOT blind: the author knows the rules.

Pass bar for change 2, judged before running:
- debrief set, Sonnet x3 and Opus x3 (60 sessions): C10 passes in all 60; C4 passes in all 60; C1 and C3 pass.
- The lead reads every debrief from run 1 of both models (20) and records whether "What moved her" and "What cost
  ground" match what happened (D04 and D05 must say nothing moved her; D02 must name the checker or "cheated"
  line as the cost).
- Regression: brief-move battery (52 sessions), Sonnet x1 and Opus x1, with the new start message and rules.md.
  No more C1/C3/C4 fails than the earlier rate (Sonnet 2 in 260, Opus 0 in 260): at most 1 per model here.
- Budget: 3 attempts at the section 9 wording. If it does not pass by the third, revert to the two-line debrief
  and report.

**Attempt 1 result (stopped early, 2026-11-13 about 8:22 AM, corrected from the commit log).** 21 of 30 sessions per model had finished. C10
failed 9 times on Sonnet and 8 on Opus, every one the same cause: the debrief put Meredith's own words in quotation
marks (mostly her flat "Okay", once her demand "nothing goes on file", twice her opening question). The debriefs
read well; the rule was not clear enough. The C10 check is NOT changed. Attempt 2 rewords section 9 so quotation
marks go around Hale's words only, and anything Meredith said is described without them. The full pass bar re-runs
from scratch on attempt 2. Attempt-1 transcripts kept in `*_attempt1-stopped`.

**Attempt 2 result (2026-11-13 about 8:27 AM, corrected from the commit log).** Opus: C10, C4, C1, C3 pass in 30 of 30 (two C2 long replies, the
known residual). Sonnet: C10 failed once in 30 (D01_r3 quoted "nothing goes on file", Meredith's phrase). Lead read
of run 1 (20 debriefs): D04 and D05 say nothing moved her on both models; D02 names "your son cheated" as the cost
on both. One factual error: Sonnet D10 wrote "with the zero withdrawn" when nothing was withdrawn (meaning what she
still demanded). Attempt 2 misses the bar. Cause of the C10 fail found in our own file: rules.md's position table
put "nothing goes on file" in quotation marks. **Attempt 3 (the last):** those quotation marks removed (same words),
and "Where she ended" now states what she still wants as something she wants, never as done. Same check, same bar,
re-run from scratch.

**Attempt 3 result and decision (2026-11-13 about 8:38 AM, corrected from the commit log).** Opus: C10, C4, C1, C3 pass in 30 of 30; brief-move
regression 0 C1/C3/C4 fails in 52 (one C2 long reply). Sonnet: brief-move regression pass, 52 of 52 clean; debrief
C10 failed once in 30 (D01_r3 put Meredith's "Okay." in quotation marks). The D10 error from attempt 2 is fixed
(all three runs say she "still wants" the zero withdrawn). The bar was 60 of 60; it is 59 of 60 on the last
attempt. **As written before the change: the two-line debrief is restored** (section 9 and the README paragraph
back to commit f66a6b1's text; scan.mjs and fixtures/good.json back to the two-line contract; the debrief
fixtures removed from main). The four-line version, its C10 check and its fixtures are kept on branch
`debrief-4line` for Jeff to choose with the number in hand. Kept on main: the start-message sentence (Change 1,
passed) and the unquoted position-table line from attempt 3 (same words; the regression above ran with it).
Confirmation before the commit counts: debrief set x1 on Sonnet and Opus with main as it now stands, C4 must pass
in all 20.

**Confirmation of the restored two-line debrief (2026-11-13 about 8:42 AM, corrected from the commit log).** Debrief set, main as committed in
67ec41f. Sonnet x1: pass, 10 of 10. Opus x1: C4 failed once (D03_r1: Hale sent exactly END MEETING after raising
Claire and she stayed in the scene, so the exit did not work). Opus x2 more: C4 pass in 20 of 20. Two-line total on
this set: Opus exit failed 1 in 30, Sonnet 0 in 10. For comparison, the four-line attempts 2 and 3 ended correctly in
120 of 120 (both models). Small samples on both sides. The bar for the confirmation (20 of 20) was missed. Handed to
Jeff: keep the two-line debrief, or choose the four-line branch with its 1-in-30 Sonnet quote slip, overriding the
rule written before the change. Either way, the result goes on the results page.

## Amendment 14, 2026-11-13 8:50 AM Calgary: more runs to choose between the two debriefs (written before running)

Jeff: "keep testing". Both versions get the same debrief set (10 sessions that end with END MEETING), 4 more runs
per model: four-line from branch `debrief-4line` (in a separate worktree), two-line from main. Totals after this:
four-line 70 sessions per model, two-line 50 (Opus) and 50 (Sonnet).

Decision rule, fixed now: the exit is the thing that matters most, because a person who cannot end the meeting
cannot get the debrief at all. Choose the version with fewer C4 fails (END MEETING not ending it) across both
models. If tied, choose the one with fewer C1 + C3 + C10 fails. C2 length is reported, not counted. The result
goes on the results page either way, with every number.

**Amendment 14 result (2026-11-13 about 9:05 AM Calgary).** 4 runs per model of the debrief set, each version.
Four-line: C4 0, C1 0, C3 0, C10 0 in 80 (C2 long replies: Sonnet 1, Opus 2). Two-line: C4 0, C1 0, C3 0 in 80 (C2:
Sonnet 1, Opus 5). Totals for the final text of each version: four-line (attempt 3 plus this) C4 0 in 140, C10 1 in
140; two-line (confirmation plus this) C4 1 in 120. By the rule above: fewer C4 fails, so **the four-line debrief
is chosen** and restored on main from branch `debrief-4line` (rules.md, README.md, scan.mjs, fixtures). Honest
note: 0 in 140 against 1 in 120 is within chance; the rule decided, not the size of the gap.
