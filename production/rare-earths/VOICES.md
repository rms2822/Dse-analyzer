# Voice casting — confirmed multi-voice by design

Unlike the Hormuz reference (single narrator throughout) and the standing
`narration-elevenlabs-v3.md` note ("one narrator voice for everything else"),
this project deliberately uses a **different voice per chapter**, confirmed
2026-07-05. Update the ElevenLabs companion doc's assumption before using it
for any future re-recording — it currently still says "one narrator voice."

## Chapter → voice map

| Chapter | File | Voice |
|---|---|---|
| Opening | `transcripts/rare-earths/audio-chapters/01-opening.mp3` | **unlabeled** — filename carried no ElevenLabs voice metadata |
| THE RECIPE | `.../02-the-recipe.mp3` | **unlabeled** — filename carried no ElevenLabs voice metadata |
| THE GRUDGE THAT BECAME A STRATEGY | `.../03-the-grudge_voice-James-energetic-charismatic.mp3` | **James** — Energetic, Charismatic |
| THE TRAP | `.../04-the-trap.mp3` | **unlabeled** — filename carried no ElevenLabs voice metadata |
| THE CLOCK | `.../05-the-clock_voice-Prof-Nathaniel-Mandrake-sardonic-bitter-wit.mp3` | **Professor Nathaniel Mandrake** — Sardonic Academic, Bitter Wit |

**Action needed**: name the voices used for Opening, THE RECIPE, and THE TRAP
(3 of 5 files kept a renamed filename that dropped the ElevenLabs voice
metadata) so this table — and eventually `asset-library.json`'s character
casting and any `SplitPhoneCall`/`TalkingCharacter` voice assignment — is
complete. Until then, treat them as three more distinct voices rather than
assuming they match either James or Professor Nathaniel Mandrake.

## Downstream implications of multi-voice-by-design

- **`TalkingCharacter` casting**: since each chapter has its own voice, it's
  worth deciding whether each chapter's narrator-voice also gets its *own*
  on-screen character design (rather than one recurring `narrator-analyst`
  asset for every whiteboard/direct-address beat) — otherwise the same face
  will appear to "change voice" between chapters, which reads as a continuity
  error rather than a deliberate choice unless the visuals lean into it (e.g.
  each chapter opens on a distinct on-screen "expert" figure whose design
  matches their voice's character, similar to a docuseries with different
  talking-head experts per segment).
- **THE TRAP's `SplitPhoneCall` exchange** (Factory Manager / Export Official)
  already uses two voices distinct from the chapter narrator per
  `narration-elevenlabs-v3.md` — confirm those two don't collide with
  whichever voice narrates THE TRAP itself (3 voices active in one chapter:
  narrator + 2 dialogue characters).
- **Overlays/lower-thirds**: consider a small on-screen voice/name tag at each
  chapter's start (documentary convention when handing off between distinct
  narrators/experts) so the voice switch reads as intentional rather than a
  splice.
