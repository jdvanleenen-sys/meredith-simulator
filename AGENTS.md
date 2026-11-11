# AGENTS.md: where everything is, and where to go for each task

A simulator folder that makes Claude play Meredith Kalinowski, a lawyer and mother, so a teacher can practise
telling her that her son's essay was not his own work. Comp #16, The Simulator. This file routes; it holds
no content.

| To do this | Go here |
|---|---|
| Practise the meeting | `simulator/README.md` (upload the four parts it names, not the README) |
| See how she is built | `simulator/identity.md`, `simulator/rules.md`, `simulator/examples.md`, `simulator/reference/` |
| Know how she is tested | `testing/TEST_METHOD.md` (frozen; changes are dated amendments at its foot) |
| Check transcripts for breaks | `node testing/scan.mjs <transcript.json or folder>` |
| Check the folder's shape | `node testing/scan.mjs --folder simulator` |
| Run the scripted attacks | `node testing/harness.mjs --model sonnet --runs 3 --label <name>` |
| Talk to her live (red team) | `node testing/talk.mjs --new <name> --model sonnet` |
| Continue the fix loop | Read `testing/RUN-LOG.md` and `testing/FIX-LOG.md` first, then the method |
| Find the sealed attacks | `testing/HELDOUT.md` (hashes only until the ship gate) |
| Check a fact she cites | `SOURCES.md` |

## What not to change

- `testing/TEST_METHOD.md` above its amendments, and any committed transcript: the record of what ran.
- The start message: its one home is the first code block in `simulator/README.md`.
- Banned phrases: their one home is the "Never say" line in `simulator/rules.md`; the scanner reads it.
