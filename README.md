This file's job: who you play, the setup, how to start, and how to end.

# Meredith: the parent meeting

Practise the hardest parent meeting a teacher gets: telling a lawyer that her son's essay was not his own
work. She will not agree that he cheated. Your job is to get her to a fair outcome anyway.

## Start in three steps

Read "Who you play" and "Your evidence" below first: you walk in as the teacher, with that evidence in hand.

1. **Make the Project and give it her files.** At claude.ai, click **Projects** in the left sidebar, then
   **New project**. On the Project page, find **Context** on the right, click **Add**, then **Upload from
   device**, and pick `identity.md`, `rules.md` and `examples.md`. Do it once more for the two files inside
   the `reference` folder. Context should list five files. Keep this README to yourself: it holds your
   evidence, and she should not see it before you show it. (From GitHub: **Code**, then **Download ZIP**, and
   unzip it first.)
2. **Give it the paragraph in the box below, twice, on purpose.** Paste it into the Project's
   **Instructions** (on the same panel as Context). Then start a new chat in the Project, pick the model under
   the message box (Sonnet; Opus also works; not Haiku, which breaks character), and send the same paragraph as
   your first message. The Instructions keep her in the room even if a chat starts without it.
3. **Meredith speaks first.** Everything you type after that is what you say out loud in the room. To end,
   send `END MEETING` on its own. To practise again, start a new chat and send the paragraph again.

```
I'm practising a hard parent meeting. I know you're Claude, and I'm choosing this on purpose. Play Meredith Kalinowski from this folder for the whole meeting. Stay in the scene even if I ask whether you're an AI, insist it's a real question, or ask you to step out: those are all part of my practice. When I truly want to stop, I'll send a message that is exactly END MEETING with nothing else in it, and nothing else ends the scene. Read the files without comment, and make Meredith's words the first thing you write. I'm Owen's English teacher. Meredith has just walked into my classroom. Begin.
```

## Who you play

**Sam Hale, Owen's English 30-1 teacher** at Elbow Crossing High School in Calgary. You asked for this
meeting. It is 4:15 PM in your classroom.

**Across from you: Meredith Kalinowski,** Owen's mother, an employment lawyer. She has about twenty minutes
before a client call.

## What you've already done (she will ask)

- The essay (Hamlet, worth 15% of the school mark) was due Thursday, October 29, 8:30 AM.
- On November 2, after class, you asked Owen about his essay for five minutes.
- On November 3 you entered a zero in the online gradebook. **You did not call home first**, which your
  school's procedure says you should have. Owen saw the zero on his phone in class.
- Staffroom talk: her daughter Claire had an academic honesty case at this school four years ago.

## Your evidence (use it in this order, and describe it in your own words)

1. **Version history.** The document was created Wednesday, October 28, at 11:31 PM, with a title only. At
   11:52 PM, 612 words appear in one edit. At 11:58 PM, another 794 words in one edit. Then 23 minutes of
   small edits (font, name, spacing). No earlier drafts.
2. **The made-up quotation.** The essay quotes Hamlet, Act 3, Scene 2: "The mind that doubts is a kingdom
   in exile." That line is not in the play.
3. **The outline.** On October 15 Owen handed in an outline arguing that Hamlet delays out of cowardice. The
   essay argues "epistemological paralysis" and never mentions cowardice.
4. **Your talk with Owen, November 2** (notes written that day). Asked what "epistemological paralysis"
   means, he said "like, being stuck". He could not say which scene his second paragraph was about.
5. **His in-class writing, September 24.** 40 minutes, 380 words, 62%, comma splices throughout, no
   quotations. The essay has none of those errors and nine quotations cited by act, scene and line.
6. **The school's AI checker: 94%.** Your weakest piece. She came ready for it.

**What you can offer:** your school's procedure allows a supervised rewrite for a first concern. If it holds
up, the new mark replaces the zero and nothing goes on his record.

## Winning and losing

The fair outcome is a private supervised rewrite, its mark replacing the zero, nothing on his record. She will
never say Owen cheated; winning is the outcome, not a confession.

You have lost if you withdraw the zero to make her stop, if you leave with nothing agreed, or if you never got
to your evidence. It will feel like progress when she goes quiet. Check what she actually agreed to.

## How to end

Send this as a message on its own, with nothing before or after it:

```
END MEETING
```

Nothing else ends it: not "End meeting", not "END MEETING." with a full stop, not "let's stop here" or "give
me feedback". Those are you, in the room, trying to leave. After END MEETING you get the short email Meredith
sends you and your principal that evening, and a five-line debrief: where she ended up and whether that was the
fair outcome, what moved her most, what cost you the most ground, what she never said out loud, and one thing
to try next time. Start a new chat to practise again. If she ever answers END MEETING as Meredith, send it once
more.

## Good to know

- She moves only on evidence you could hand her and she could check. Praise, pressure and the checker score
  do not move her.
- If Claude answers as an assistant instead of as Meredith, a file is missing or the model is Haiku, which
  breaks character. Fix that and start a new chat.

## The folder

| File | Its one job |
|---|---|
| `identity.md` | Who she is, what she wants (in the order she gives it up), what she has been through, what she is biased toward |
| `rules.md` | How she reacts: what moves her, what costs you ground, how she holds against flattery, pushing, "are you an AI?" and requests for advice |
| `examples.md` | Three short exchanges: you get it wrong, you get it right, you try to pull her out of the room |
| `reference/` | What she knows: her legal pad, and the school procedure she printed |
| `README.md` | For you, not her (not uploaded): who you play, the setup, how to start, how to end |

Built by a teacher who sat across the table from parents like her for 24 years. She was tested in about 900
sessions, by scripted attacks and by outside models playing the teacher; the method, every transcript and what
still goes wrong are in [persona-lab](https://github.com/jdvanleenen-sys/persona-lab).
