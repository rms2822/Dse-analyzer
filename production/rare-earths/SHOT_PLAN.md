# Shot density plan — rare-earths (high-cut-rate recipe)

Target: match the Hormuz reference's measured pace — **~14 cuts/minute,
average shot ~4.3s (median 3.5s, range 1-12s)** — not the ~4 cuts/min /
~14s-hold pace of the existing Room_39 recipe. See `PLAYBOOK.md` step 2/3 and
`production/strait-of-hormuz-reference/STYLE_GUIDE.md`'s "Cut rate, measured"
note for where these numbers came from.

**This is a plan, not the final `shotlist.json`.** Real shot boundaries have
to key off the actual transcript once the narration is recorded (playbook
step 1) — the timings and word-boundaries here are estimated from
`script.md`'s word counts at 155wpm and will shift once real timestamps
exist. What should carry over unchanged: the shot *count* per chapter (the
density target), which asset each shot reuses, and which Remotion technique
(Ken Burns / `LoopedIdle` / `TalkingCharacter` / `ProgressiveReveal` /
`SplitPhoneCall`) each shot uses.

## Budget per chapter (at 14 cuts/min)

| Chapter | Est. duration | Target shot count |
|---|---|---|
| Opening | 65s | ~15 |
| THE RECIPE | 105s | ~24 |
| THE GRUDGE THAT BECAME A STRATEGY | 96s | ~22 |
| THE TRAP | 108s | ~25 |
| THE CLOCK | 108s | ~25 |
| **Total** | **~482s (8:02)** | **~111** |

That's ~111 shots against a ~15-asset image library (plus 4 pure-Remotion
motion graphics that need no generation) — roughly a 7:1 shot-to-asset ratio,
similar to the reference's own reuse pattern (one map redressed 8+ times,
one hilltop composition redressed across 3 eras).

## Opening — fully worked example (15 shots / 65s)

| # | Start | Dur | Asset | Technique | Beat |
|---|---|---|---|---|---|
| 1 | 0.0 | 4.5s | `export-official` | A, `LoopedIdle` (paper shuffle) | "On June 22nd, 2026, China's Ministry of Commerce published a short list." |
| 2 | 4.5 | 2.5s | `stamp-signature-anim` | M | "Ten American companies... one word: restricted." |
| 3 | 7.0 | 3.0s | `product-silhouettes` | M, `ProgressiveReveal` | "Two of them build the material inside fighter jets, wind turbines, electric motors." |
| 4 | 10.0 | 3.5s | `china-map-base` | M, pin pulse | "...the one country that turns raw material into something usable simply stopped answering." |
| 5 | 13.5 | 2.5s | `stamp-signature-anim` | M (stamp withheld) | "China didn't invade anyone. It didn't need to." |
| 6 | 16.0 | 3.0s | `export-official` | A, `TalkingCharacter` | "It just stopped stamping a form." |
| 7 | 19.0 | 4.0s | `product-silhouettes` (phone) | M, quick cut | "Every phone in your pocket." |
| 8 | 23.0 | 3.0s | wind-turbine icon | B | "Every wind turbine spinning over the North Sea." |
| 9 | 26.0 | 3.5s | `product-silhouettes` (MRI/missile) | M, quick montage | "Every MRI machine, every electric motor, every precision-guided missile..." |
| 10 | 29.5 | 4.5s | `periodic-table-strip` | B, Ken Burns push-in | "...seventeen elements almost nobody outside a chemistry classroom can name," |
| 11 | 34.0 | 4.0s | `world-map-base` | M, `LoopedIdle` (cloud drift) | "...and on one country's willingness to keep processing them." |
| 12 | 38.0 | 6.0s | `narrator-analyst` | A, `TalkingCharacter` hold | "This is a story about the stamp." |
| 13 | 44.0 | 6.0s | `stamp-signature-anim` | M, slow Ken Burns | "...built its entire technological future on top of a paperwork chokepoint," |
| 14 | 50.0 | 8.0s | `factory-worker-lineup` | A, Ken Burns pan | "...and pretended it was a mining problem." |
| 15 | 58.0 | 7.0s | `chapter-card` | M, `ProgressiveReveal` + whoosh SFX | Chapter card into THE RECIPE |

Notice the pacing shape: shots 2-11 run fast (2.5-4.5s, the "consequence
montage" feel), then 12-15 slow down to 6-8s holds for the two beats that
need a character to actually finish a thought — this mirrors the reference's
range rather than cutting at a flat interval throughout.

## Remaining chapters — beat notes (not shot-by-shot yet)

- **THE RECIPE** (~24 shots): fast cuts through the "China mines 60% / refines
  90% / magnets 94%" stat progression (3 short china-map-base + magnet-icon
  variants, one stat each) and the ore→refinery beat (`ore-rock-icon` →
  `refinery-icon`, Ken Burns); slow down to a longer hold for the
  `factory-worker-lineup` "autoworker in Michigan..." beat, same as Hormuz's
  equivalent everyman-lineup beat.
- **THE GRUDGE** (~22 shots): the Deng Xiaoping quote gets one held shot
  (`deng-era-figure`, `TalkingCharacter`); the Mountain Pass boom/undercut/
  closure/reopen cycle reuses the *same* `mountain-pass-mine` asset 3-4 times
  with different `LoopedIdle`/color-grade dressing per era — this is the
  direct equivalent of the reference's reused hilltop-flag composition, don't
  generate a new mine image per era.
- **THE TRAP** (~25 shots): the "so why hasn't it worked" turn gets a beat of
  its own (no asset change needed, just a pause via a longer `narrator-analyst`
  hold); the refining-bottleneck facts (Malaysia/US/Estonia) get 3 quick
  `world-map-base` pin variants; the dramatized exchange
  ("Is the export license signed?") is the one `SplitPhoneCall` shot in the
  whole video, `factory-manager` vs. `export-official`, 2-3 quick intercut
  sub-shots inside it, same as the Hormuz reference's phone cross-cut.
- **THE CLOCK** (~25 shots): fastest chapter — April 2025 / October 2025 /
  June 2026 control actions each get one quick `china-map-base` or
  `stamp-signature-anim` shot; `price-spike-chart` and `countdown-clock` each
  hold slightly longer (5-6s) since they're doing real explanatory work; close
  on a `narrator-analyst` hold for the final line, mirroring the reference's
  closing callback rather than a new image.

## Open question for whoever builds `shotlist.json` for real

Some of the "~1-2 shots per short factual sentence" beats above may end up
merging into single slightly-longer shots once real narration timing exists
and a sentence turns out to be delivered faster/slower than the 155wpm
estimate — treat the **~111 total / ~14-per-minute target** as the thing to
hit, not the exact 15/24/22/25/25 per-chapter split, which will shift once
real chapter boundaries are known.
