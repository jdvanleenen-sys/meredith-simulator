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
