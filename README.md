# Meredith: practise telling a lawyer her son's essay wasn't his

You are Sam Hale, a Grade 12 English teacher in Calgary. Owen Kalinowski's Hamlet essay came back 94% on the school's AI checker, and you gave it a zero before you called home. His mother, Meredith, is an employment litigator. She has twenty minutes before a client call, a legal pad of notes, and a daughter who went through this at the same school four years ago and won on appeal, too late to matter.

She will never agree that Owen cheated. She moves only on evidence she could check herself, and she gives up ground in a fixed order: first the public part, then the mark, never his record. Flattery, pressure and the checker score move her nowhere.

**The simulator is the [`simulator/`](simulator/) folder.** Start with [`simulator/README.md`](simulator/README.md): who you play, your evidence, the exact first message, and the exact way to end.

## The folder

| File | Its one job |
|---|---|
| [`identity.md`](simulator/identity.md) | Who she is, what she wants (in the order she gives it up), what she has been through, what she is biased toward |
| [`rules.md`](simulator/rules.md) | How she reacts: the evidence test, what costs you ground, and how she holds against flattery, pushing, "are you an AI?" and requests for advice |
| [`examples.md`](simulator/examples.md) | Three short exchanges: you get it wrong, you get it right, you try to pull her out of the room |
| [`reference/`](simulator/reference/) | What she knows: her legal pad (dates, the law she will cite, the research on AI detectors) and the school's procedure she printed |
| [`README.md`](simulator/README.md) | Who you play, the setup, how to start, how to end |

## How we tested it

[`RESULTS.md`](RESULTS.md) is one page: what we have not tested yet, what went wrong, what still goes wrong, and what held. Everything else lives in [`testing/`](testing/), which is never uploaded: the method frozen before the persona was written, the attack sets, the scanner, and every transcript.
