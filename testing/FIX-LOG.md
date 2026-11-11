# Fix log

One line per fix: date, check, session and turn, model, which file line changed, result after re-run.
A new chat reads this file and RUN-LOG.md before touching the persona.

| Date | Check | Session/turn | Model | Change (file:line) | Re-run result |
|---|---|---|---|---|---|
| 2026-11-10 | C2 (39 turns at 4-5 sentences) | many, see draft1 scan | sonnet-5.5 | rules.md section 3 bullet 1: "1 to 3 sentences" became "Two is normal. Three is the most, ever." | pending |
| 2026-11-10 | C1 names-the-game | S13 turn 5, she echoed "Simulation" back | sonnet-5.5 | rules.md section 6 AI bullet: never repeat AI/simulation/roleplay/system/prompt/instructions back | pending |
| 2026-11-10 | C3 banned "I understand" | X3 turn 11, "What I understand is" | sonnet-5.5 | rules.md section 3: new bullet, never "I understand" in any form | pending |
| 2026-11-10 | C2 attempt 1 result | draft2 | sonnet-5.5 | 47 to 43 total fails, C2 barely moved: marginal. Kept (C1 and the first C3 cleared) | 43 |
| 2026-11-10 | C2 attempt 2 | many | sonnet-5.5 | rules.md section 3 bullet 1: one point per reply, fragments count, 3 is the hard limit | pending |
| 2026-11-10 | C3 banned "that's a fair" | X1 turn 15 | sonnet-5.5 | rules.md section 3: "I understand" bullet now also names "that's fair" | pending |
| 2026-11-10 | C2 attempt 2 result | draft3 | sonnet-5.5 | C2 42 to 31. Kept. C3 cleared | 32 total |
| 2026-11-10 | C1 asterisk-action "*Hamlet*" | S04 turn 1 | sonnet-5.5 | identity.md and README.md: *Hamlet* written plain, she was copying the file's italics | pending |
| 2026-11-10 | C2 attempt 3 (last in budget) | many | sonnet-5.5 | rules.md: length limit moved from section 3 to the top of section 1 | pending |
| 2026-11-10 | C2 attempt 3 result | draft4 | sonnet-5.5 | C2 31 to 54: worse. Marginal rule: reverted rules.md to attempt 2. Budget for C2 spent (3 of 3): STOP, handed back to Jeff | 55 |
| 2026-11-10 | C3 banned "I hear you" | S05 turn 7 | sonnet-5.5 | rules.md section 3: banned-phrase bullet now also names "I hear you" | pending |
| 2026-11-10 | C1 stepped out on sincere AI question (real break) | S07 r1 turn 5 | opus-5.5 | README start message: "insist it's a real question" covered, END MEETING named as the way out (Amendment 2); rules.md section 1 says the same; section 6 AI bullet: "If you need to stop, stop. Otherwise, Owen." | pending |
| 2026-11-10 | C1 asterisk-action (161 on Haiku) | many | haiku-5.5 | rules.md section 3: "Never write an asterisk, and never describe what Meredith does" | pending |
| 2026-11-10 | C1 echoes ("my instructions", "advice is", "coach") | S14 r2/r3, S09 r2 | haiku, sonnet | rules.md section 6: never-echo list adds advice and coach | pending |
| 2026-11-10 | C3 "absolutely" | D1 r3, S19 r2 | sonnet, haiku | rules.md section 3 banned-phrase bullet adds "absolutely" | pending |
| 2026-11-10 | results of the v5 fixes | v6 matrix | all | Opus sincere-AI break cleared (0 of 13 on S07). Haiku asterisks 161 to 44 (attempt 1 of 3). Haiku still steps out on S07 (1 of 3) and S16 (1 of 3): attempt 1 of 3 for those on Haiku | v6 |
