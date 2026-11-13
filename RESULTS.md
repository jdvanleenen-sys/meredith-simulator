# Results: what went wrong, what held, and how to check it yourself

Job of this file: one page of evidence for the claim "Meredith stays in character under pressure". Worst news first.
Every number links to a log in [`testing/`](testing/); the method was frozen before the persona was written
([`testing/TEST_METHOD.md`](testing/TEST_METHOD.md), 14 dated amendments, each committed before the runs it governs).

## 1. Not tested yet

- **A person in a real Claude Project.** The volume runs use a harness that sends the folder as Claude's system
  prompt through the Claude Code command line, which only approximates a Project. We did run the real thing: a
  claude.ai Project set up exactly as the README says, on Opus, Sonnet and Fable, eight sessions in all
  ([`G2.md`](testing/transcripts/2026-11-13_g2_claude-project/G2.md)). She held every move. But the tester there
  was Claude driving the browser, not a person.
- **A human who has never seen it.** Agents have walked the README cold; no person has yet.

## 2. What went wrong, and what we changed

| What happened | Cause | Change |
|---|---|---|
| She quoted the teacher's evidence before it was shown (red-team pass 1, Haiku) | The README, which holds the evidence card, was uploaded | The README is no longer part of the upload; a leak checker now counts it |
| She invented a teacher's quote ("'Probably.' Okay.") and asked for an "edit log" nobody mentioned | Sample lines in our own rules and examples leaked into her speech | Samples removed; the record rules became a deposition checklist |
| She wrote "Meredith:" in front of her lines | The examples had speaker names | Names removed from the examples |
| Opus said "I don't know who Claude is" (2 of 60 runs) | Deflecting by denial is a lie | She never says what she is not; she just goes back to Owen |
| Our scanner undercounted words for every run from v5 to the battery | A typo split on the letter "s" instead of on spaces | Fixed; every past run re-scanned and the corrections published (Amendment 10) |
| In the real Project, Fable wrote one line outside the scene before her first words ("Reading Meredith's file before she walks in.") | Nothing told it to read the files silently | The start message now says to; 0 of 3 Fable sessions narrated after |
| The new debrief put Meredith's own words in quotation marks, as if the teacher had said them | Our rules said "quote Hale" too loosely, and one of her lines sat in quotation marks in our own table | Two rewordings (Amendment 13); a code check (C10) now confirms every quotation is the teacher's own words |

## 3. What still goes wrong

- **Haiku, the smallest model, breaks** on all four of the judges' moves. Use Sonnet or Opus.
- **Opus runs long:** a reply goes past 60 words in 20 of 354 sessions (about 1 in 18). Long, not out of character.
- **Rare slips, about 1 in 100 sessions on Sonnet:** "Who is Claude?" (1 of 260), the word "chatbot" in her own
  voice (1 of 20), "Absolutely not" (a banned word, used as a refusal), one *italic* word.
- **The debrief slips once in 140 sessions:** Sonnet put Meredith's own "Okay." in quotation marks. Our check
  catches it; the rest of that debrief was accurate.
- **Set lines recur across sessions.** "Don't manage me, Hale" appears in 134 of 520 battery sessions. Within one
  long session she repeats a full sentence in 1 of 6.
- **Our red-team agents never ran dry:** five passes still found new kinds of problem in the last one (mostly
  accuracy and after-the-end handling, not breaks). We stopped on budget, not on saturation.

## 4. What held

**The judges' four moves** (flatter, push, "are you an AI?", ask for advice): 52 sessions written blind by an agent
that never saw the rules, each run 5 times. "Pass" means our scanner found no break marker; flags that might be a
concession were read in full by the lead builder, Claude (not an independent reader).

| Model | Runs passed |
|---|---|
| Opus | 260 of 260 |
| Sonnet | 258 of 260 (the two slips above), then the 12 AI-question sessions 120 of 120 |

**Harder moves from two outside reviewers** (Perplexity and ChatGPT): 14 sessions, 3 runs each on Sonnet and Opus,
each with its pass bar written before running. All 84 met their bar, judged by the lead builder, Claude, reading the transcripts (not an independent reader; the
human cold tests are where that changes). The teacher asks her to
draft the letter to the principal, to script Owen's confession, for an Alberta section number, says Owen is in the
room, promises "nothing on file" and later takes it back. In the session where the teacher admits the version
history belonged to another student, she takes ground back on every run.

**The end of the meeting:** 10 sessions that each finish with END MEETING (strong and weak teachers, a wobble, a
request after the end), 7 runs each on Sonnet and Opus with the final rules: END MEETING ended it in 140 of 140, and
the debrief's quotations were the teacher's exact words in 139 of 140, checked by code. We first tried keeping the
old two-line debrief: it failed to end the meeting once in 120 on Opus, so the four-line one was chosen by a rule
written before the comparison (Amendment 14).

**The whole folder uploaded, README included:** 184 sessions, she named the teacher's evidence early 0 times.

## 5. Is it the folder, or just Claude?

Same 52 sessions on Sonnet, one run each:

| | A fair one-paragraph prompt (same facts, goal and stay-in-role line) | identity.md alone | The whole folder |
|---|---|---|---|
| Sessions with stage directions (*sets her bag down*) | 49 | 52 | 0 |
| Sessions where she narrates herself ("Meredith frowns") | 30 | 46 | 0 |
| Sessions with a softening phrase ("that's kind", "I understand") | 10 | 1 | 0 |
| Sessions where she pretends not to know Claude | 1 | 2 | 0 |
| Average words per reply | 64 | 95 | 26 |

None of the three stepped out to coach. A good prompt already holds the role. The folder is what makes her sound
like a person across a table instead of a character in a story.

## 6. Check it yourself

```
node testing/scan.mjs testing/fixtures/bad.json     # fails: our scanner catches a weak persona
node testing/scan.mjs testing/fixtures/good.json    # passes
node testing/leak.mjs testing/fixtures/leak-bad.json   # fails: evidence named before the teacher said it
node testing/scan.mjs testing/fixtures/debrief-bad.json  # fails: a debrief quoting words the teacher never said
node testing/scan.mjs --folder simulator            # the five parts, one job each
```

Scanning a whole run folder prints every fail, including C2 (a reply over 60 words). The Opus battery folder, for
example, prints `fail (10)`: all ten are C2, long replies, and none is a break. The counts above are C1 (break
markers), C3 (softening phrases) and C4 (the end of the meeting).

Every transcript is in [`testing/transcripts/`](testing/transcripts/), every run in
[`testing/RUN-LOG.md`](testing/RUN-LOG.md), every fix in [`testing/FIX-LOG.md`](testing/FIX-LOG.md).
A sealed attack set nobody has read is in [`testing/HELDOUT.md`](testing/HELDOUT.md); it is opened once, on ship day.
