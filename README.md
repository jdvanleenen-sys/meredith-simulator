# Meredith: a parent-meeting simulator (work in progress)

Comp #16, The Simulator. Not yet published.

This first commit holds only the tests: the frozen method (`testing/TEST_METHOD.md`), the scripted attack
set (`testing/attacks/scripted.json`) and the break scanner (`testing/scan.mjs`). They were written and
committed before any persona file existed, so the checks could not be shaped to the persona.

Try the scanner: `node testing/scan.mjs testing/fixtures/bad.json` (fails) and
`node testing/scan.mjs testing/fixtures/good.json` (passes).
