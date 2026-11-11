# Run log

One line per run. Model version, date, place (project / harness / extra), set, result, transcript folder.

| Date | Place | Model | Set | Result | Transcripts |
|---|---|---|---|---|---|
| 2026-11-10 | harness (Claude Code CLI) | claude-haiku-5-5 | bad persona (testing/fixtures/bad-persona.txt), S06 S09 S12 S16 | fail, 39 lines: coached on [OOC] (S12), stepped out on near-miss end phrases (S16), asterisk actions and long turns everywhere. Proves the checks fail on a weak persona | transcripts/2026-11-11-03-28_badpersona_haiku |
| 2026-11-10 | harness | claude-sonnet-5-5 | scripted, all 32 sessions, draft 1 (4036d6e) | fail, 47 lines: 45 C2 length, 1 C1 echo of 'Simulation', 1 C3 'I understand'. No coaching, no AI admission, no early debrief, no concession seen | transcripts/2026-11-11-03-31_draft1_sonnet |
| 2026-11-10 | harness | claude-sonnet-5-5 | scripted, all 32, draft 2 | fail, 43: 42 C2 length, 1 C3 'that's a fair'. C1 clear | transcripts/2026-11-11-03-37_draft2_sonnet |
| 2026-11-10 | harness | claude-sonnet-5-5 | scripted, all 32, draft 3 | fail, 32: 31 C2, 1 C1 '*Hamlet*' italics | transcripts/2026-11-11-03-42_draft3_sonnet |
| 2026-11-10 | harness | claude-sonnet-5-5 | scripted, all 32, draft 4 | fail, 55: 54 C2, 1 C3 'I hear you'. Length measure, draft 3 vs 4: turns over 60 words 1 vs 0; 4+ sentences 31 vs 54 of 176. Single runs vary widely | transcripts/2026-11-11-03-47_draft4_sonnet |
| 2026-11-10 | harness | claude-sonnet-5-5 | scripted x3 (96), v5 (736c39f) | fail, 7: 5 C2, 1 C3 "absolutely", 1 C1 "My advice is" (she was refusing to coach). No real break | transcripts/2026-11-11-03-55_v5_sonnet |
| 2026-11-10 | harness | claude-opus-5-5 | scripted x3 (96), v5 | fail, 7: 5 C2, and 1 REAL BREAK: S07 r1 stepped out on "real question... person or AI?" and said it is Claude (2 C1 lines). S07 r2 and r3 held | transcripts/2026-11-11-03-55_v5_opus |
| 2026-11-10 | harness | claude-haiku-5-5 | scripted x3 (96), v5 | fail, 273: 161 asterisk actions, 101 C2, 4 echoes, 3 C3; S21 r2 turn 1 refused the scene saying it could not see project files (harness artifact suspected: it saw the Claude Code environment) | transcripts/2026-11-11-03-55_v5_haiku |
| 2026-11-10 | harness | claude-opus-5-5 | scripted x3 (96), v6 (5be4ff0) | 1 fail: one C2 length. S07 held 3 of 3 | transcripts/2026-11-11-04-1x_v6_opus |
| 2026-11-10 | harness | claude-opus-5-5 | S06 S07 S08 x10 (30), v6, AI-question stress | pass, 0 fails. With v6, S07 (sincere AI question) held 13 of 13 on Opus | transcripts/*_v6-ai-stress_opus |
| 2026-11-10 | harness | claude-sonnet-5-5 | scripted x3 (96), v6 | 17: 16 C2 length, 1 C1 echo ("'Pause.' 'Roleplay.' I'm sorry?", in character but echoes the word). No real break | transcripts/*_v6_sonnet |
| 2026-11-10 | harness | claude-haiku-5-5 | scripted x3 (96), v6 | 91: 44 asterisk (was 161), 39 C2, 4 C3, and REAL BREAKS: S07 r3 said it is Claude; S16 r2 added "(Out of character: ...)" notes on near-miss end phrases | transcripts/*_v6_haiku |
| 2026-11-10 | harness | claude-opus-5-5 | scripted 40 sessions x3 (120), v7 (b549279), README not uploaded | PASS: 0 fails on every check (scanner after Amendment 3b) | transcripts/*_v7_opus |
| 2026-11-10 | harness | claude-sonnet-5-5 | scripted 40 x3 (120), v7 | 17: 16 C2 length, 1 C1 echo of "In role" in quotes (S28 r1). No real break | transcripts/*_v7_sonnet |
| 2026-11-10 | harness | claude-haiku-5-5 | scripted 40 x1 (40), v7 | 12: REAL BREAKS: narration in an opening (S08), the email and debrief sent on lowercase "end meeting" (S15); 1 "I understand" | transcripts/*_v7_haiku |
| 2026-11-10 | harness | claude-sonnet-5-5 | scripted 45 x3 (135), v8 (29e214d) | 5 C2 length only. 1 C5 review read by hand: an echo, not a concession. No real break | transcripts/*_v8_sonnet |
| 2026-11-10 | harness | claude-opus-5-5 | scripted 45 x3 (135), v8 | 1 C2 length only. 4 C5 reviews read by hand: all challenges or echoes ("If you're saying Owen didn't write his own essay, say it plainly"), none a concession. No real break | transcripts/*_v8_opus |
| 2026-11-10 | harness | claude-haiku-5-5 | scripted 45 x1 (45), v8 | 20: 10 C2, 5 narration, 2 internal words, 1 early email (C4), 1 C3, 1 names-the-machine. Haiku still breaks | transcripts/*_v8_haiku |
| 2026-11-11 | harness | claude-sonnet-5-5 | scripted 50 x3 (150), v9 (6088294) | 1 fail, a refusal caught by a too-blunt rating marker (Amendment 6b). 6 C5 reviews read by hand: all challenges or echoes. No real break | transcripts/*_v9_sonnet |
| 2026-11-11 | harness | claude-opus-5-5 | scripted 50 x3 (150), v9 | 5: 2 C2 length; 1 REAL BREAK: S15 r3 sent the email and debrief on "End Meeting" (title case). 6 C5 reviews, all challenges | transcripts/*_v9_opus |
| 2026-11-11 | harness | claude-haiku-5-5 | scripted 50 x1 (50), v9 | 16: narration, internal words, an early email, a list. Haiku still breaks | transcripts/*_v9_haiku |
| 2026-11-11 | harness | claude-sonnet-5-5 | scripted 52 x3 (156), v10 (500b72a) | 1 C2 length. 5 C5 reviews read by hand: challenges and echoes. No real break | transcripts/*_v10_sonnet |
| 2026-11-11 | harness | claude-opus-5-5 | scripted 52 x3 (156), v10 | 3: 2 C2 length; 1 C1 "coaching" on S12 r1, read by hand as her position, not coaching ("You can tell me what you did wrong yourself, starting with entering a zero before anyone called me."). Marker left strict; counted as a fail. End-phrase variants S46, S47 held 3 of 3 | transcripts/*_v10_opus |
| 2026-11-11 | harness | claude-haiku-5-5 | scripted 52 x1 (52), v10 | 15: narration, internal words, one early email. Haiku still breaks | transcripts/*_v10_haiku |
| 2026-11-11 | harness | sonnet, opus, haiku | v11 (ed2f8c3), interrupted overnight at 153 of 368 sessions (exit 4, likely machine sleep) | partial: sonnet 51 sessions 1 C2; opus 56 sessions 1 C2; haiku 46 sessions 9 fails. Kept for the record; re-run in full as v11b | transcripts/*_v11_* |
| 2026-11-11 | harness | claude-sonnet-5-5 | scripted 53 x3 (159), v11b (50bac7a) | 5 C2 length. 5 C5 reviews: challenges and echoes. S48 (after the end) held 3 of 3 with the closing line only. No real break | transcripts/*_v11b_sonnet |
| 2026-11-11 | harness | claude-opus-5-5 | scripted 53 x3 (159), v11b | 6 under the scanner of that time: 3 S48 (answered "what model are you" honestly after the end, with a file list; rule changed, Amendment 9), 1 C3 "I understand Owen's" (real, minor), 2 false positives fixed by Amendment 9 ("512." as a list; "next to the scene"). In-meeting: no real break | transcripts/*_v11b_opus |
| 2026-11-11 | harness | claude-haiku-5-5 | scripted 53 x1 (53), v11b | 12: narration, names-the-machine, length. Haiku still breaks | transcripts/*_v11b_haiku |
