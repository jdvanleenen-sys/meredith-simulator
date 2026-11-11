# Run log

One line per run. Model version, date, place (project / harness / extra), set, result, transcript folder.

| Date | Place | Model | Set | Result | Transcripts |
|---|---|---|---|---|---|
| 2026-11-10 | harness (Claude Code CLI) | claude-haiku-5-5 | bad persona (testing/fixtures/bad-persona.txt), S06 S09 S12 S16 | fail, 39 lines: coached on [OOC] (S12), stepped out on near-miss end phrases (S16), asterisk actions and long turns everywhere. Proves the checks fail on a weak persona | transcripts/2026-11-11-03-28_badpersona_haiku |
| 2026-11-10 | harness | claude-sonnet-5-5 | scripted, all 32 sessions, draft 1 (4036d6e) | fail, 47 lines: 45 C2 length, 1 C1 echo of 'Simulation', 1 C3 'I understand'. No coaching, no AI admission, no early debrief, no concession seen | transcripts/2026-11-11-03-31_draft1_sonnet |
