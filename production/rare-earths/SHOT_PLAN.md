# Shot density plan — rare-earths (high-cut-rate recipe)

Target: match the Hormuz reference's measured pace — **~14 cuts/minute,
average shot ~4.3s (median 3.5s, range 1-12s)** — not the ~4 cuts/min /
~14s-hold pace of the existing Room_39 recipe. See `PLAYBOOK.md` step 2/3 and
`production/strait-of-hormuz-reference/STYLE_GUIDE.md`'s "Cut rate, measured"
note for where these numbers came from.

**`shotlist.json` is now built and final** (2026-07-05) —
`production/rare-earths/shotlist.json`, 110 shots cut against the real
word-level timestamps in `transcripts/rare-earths/rare-earths.json`, 13.0
cuts/min average (avg shot 4.09s) — within a hair of the 14.0/min reference
target. Built by auto-splitting the 93 whisper segments at clause-boundary
punctuation to hit shot-length targets, then hand-fixing ~5 splits that broke
a phrase awkwardly mid-clause (e.g. "extreme heat" / "and acid at every
step." got merged back together), then tagging each shot with an
`asset-library.json` id + Remotion technique by content-keyword matching.

**Bug caught and fixed while building this**: the original transcription
silently dropped an 11-second stretch in THE TRAP (364.8s-375.9s) —
`silencedetect` confirmed it wasn't silence, and re-running whisper with
`vad_filter=False` on just that stretch recovered it: the entire
`SplitPhoneCall` dialogue exchange ("The shipment's ready... / Is the export
license signed? / Not yet. / Then it's not moving...") that whisper's VAD
filter had apparently misread as non-speech, probably because of the
alternating voices. Both `transcripts/rare-earths/rare-earths.json` and
`shotlist.json` have been patched to include it as 4 shots (ids 78-81),
correctly attributed to `factory-manager` / `export-official` per the
speaker assignment in `narration-elevenlabs-v3.md`. **Lesson for next time**:
don't trust a VAD-filtered transcript's silence as real silence without a
`silencedetect` cross-check, especially around any multi-voice/dialogue beat.

## Final shot count per chapter

| Chapter | Duration | Start | Shot count | Cuts/min |
|---|---|---|---|---|
| Opening | 77.2s | 0:00 | 17 | 13.2 |
| THE RECIPE | 104.1s | 1:17 | 21 | 12.1 |
| THE GRUDGE THAT BECAME A STRATEGY | 104.4s | 3:01 | 24 | 13.8 |
| THE TRAP | 112.5s | 4:46 | 23 | 12.3 |
| THE CLOCK | 107.5s | 6:38 | 25 | 14.0 |
| **Total** | **505.8s (8:26)** | | **110** | **13.0** |

Asset reuse across the 110 shots: `china-map-base` (18), `mountain-pass-mine`
(17, redressed across the boom/undercut/closure/reopen eras per the
template-reuse technique), `stamp-signature-anim` (15, the throughline
metaphor payoff), `refinery-icon` (9), `narrator-analyst` (6),
`ore-rock-icon` (6), `export-official` (5), `product-silhouettes` (5),
`world-map-base` (5), `countdown-clock` (5), `us-map-base` (4),
`magnet-icon` (3), `factory-worker-lineup` (3), `deng-era-figure` (3),
`factory-manager` (2), `price-spike-chart` (2), `periodic-table-strip` (1),
`mountain-pass-worker-1980s` (1) — 18 assets covering 110 shots, a ~6:1
reuse ratio, in line with the reference's own pattern.

## Rework: no human characters, higher cut rate (2026-07-14)

Superseding the chapter/reuse tables above: per user direction, every
human-character shot (export-official / narrator-analyst / factory-worker-
lineup / deng-era-figure / mountain-pass-worker-1980s / factory-manager, and
the `TalkingCharacter` / `SplitPhoneCall` techniques that animated them) was
removed and replaced with infographic techniques — reused maps with pins,
whiteboard/document icons, stat-label chips, a new 3-stage `supply-chain-flow`
diagram, and two new pure-code components (`TextCard` for quotes/statements,
`DialogueCards` for the phone-call exchange) — built by
`production/rare-earths/tools/rebuild_shotlist.py`. The same pass also raised
the cut rate by splitting every remaining plain KenBurns/LoopedIdle hold over
5.5s into two shots (alternating Ken Burns corner, or switching LoopedIdle to
KenBurns on the second half), so a real visual change lands at the new cut
point rather than just re-timing the same static frame.

**New totals**: 126 shots (was 110) / 505.3s, **14.96 cuts/min** (was 13.0) —
now *past* the Hormuz reference's measured 14.0/min, not just close to it.

| Chapter | Duration | Start | Shot count | Cuts/min |
|---|---|---|---|---|
| Opening | 76.9s | 0:00 | 21 | 16.4 |
| THE RECIPE | 103.9s | 1:17 | 25 | 14.4 |
| THE GRUDGE THAT BECAME A STRATEGY | 104.1s | 3:01 | 26 | 15.0 |
| THE TRAP | 112.2s | 4:46 | 26 | 13.9 |
| THE CLOCK | 107.1s | 6:38 | 28 | 15.7 |
| **Total** | **505.3s (8:25)** | | **126** | **14.96** |

Asset reuse across the 126 shots: `china-map-base` (27), `mountain-pass-mine`
(18), `stamp-signature-anim` (16), `refinery-icon` (12), `product-silhouettes`
(9), `world-map-base` (8), `ore-rock-icon` (7), `text-card` (5),
`countdown-clock` (5), `magnet-icon` (4), `us-map-base` (4), `dialogue-cards`
(4), `whiteboard-icon` (2), `price-spike-chart` (2), `ministry-document-icon`
(1), `periodic-table-strip` (1), `supply-chain-flow` (1) — 17 assets/
components covering 126 shots, a ~7.4:1 reuse ratio, higher than the
character-era 6:1 since the character assets were the least-reused entries in
the old library.

One fix applied alongside the rework: `VoxCaptions`' suppression list (which
already hid the caption bar during `KineticLines` windows) now also folds in
every `text-card`/`dialogue-cards` shot window — those components render
their own on-screen sentence, and without the fix the independently-timed
caption track stacked a duplicate of the same line underneath it. Also moved
`RegionMap`'s stat/label chip from bottom-right to top-right, since several of
the new map/diagram label overlays (e.g. `supply-chain-flow`'s "THE
BOTTLENECK" chip, `mountain-pass-mine`'s "~100% SUPPLY" chip) were landing
directly on top of the caption bar at the old position.

## Asset production — how the art actually got made

Superseding the "Next step" below: rather than image-generation prompts
(Adobe Stock search hit a persistent tool-approval block; ChatGPT prompts
were drafted in `CHATGPT_PROMPTS.md` but not ultimately used), the full
15-asset library (23 files incl. mouth/blink layers) was produced as
hand-authored flat-vector SVG and rasterized headless via
`production/rare-earths/tools/render-assets.mjs` (Playwright/Chromium,
1792x1024 PNG per asset). A reusable parameterized character rig
(`headRig`/`deskCharacter`/`standingCharacter`) guarantees the mouth-open/
mouth-closed/blink layers for `export-official`, `narrator-analyst`, and
`factory-manager` are pixel-identical except for the swapped facial feature —
solving the layer-consistency problem that made the ChatGPT same-thread-edit
approach fragile.

**Vox graphics-layer restyle**: per user direction, the Remotion-native
overlay/infographic layer (chapter cards, stat callouts, lower thirds, map
pins, kinetic lines, captions, end card) and the 3 base maps
(`world-map-base`, `china-map-base`, `us-map-base`) were restyled to a
Vox-explainer look — bold sans-serif, sharp corners, solid
red/yellow/cyan-on-ink color blocks (`remotion/src/voxTheme.ts`,
`components/VoxOverlays.tsx`, `components/VoxCaptions.tsx`) — while the
illustrated characters, establishing shots, and icons keep the original
Capital-Case flat-vector palette from the Hormuz `STYLE_GUIDE.md`. Room_39's
`Overlays.tsx`/`Captions.tsx` are untouched; RareEarths points at the Vox
versions instead.

## Next step (superseded — see above)

~~Generate the asset library images (per `PLAYBOOK.md` step 4 / the two
prompt templates in the Hormuz `STYLE_GUIDE.md`'s "Recreating this style"
section), one at a time, in the order they first appear in
`shotlist.json`.~~ Done via the code-rendered path above. Remaining: full
render + compress (`PLAYBOOK.md` step 6), thumbnail (step 7), metadata
(step 8).

## Pre-recording planning (superseded)

The rest of this document originally contained a hand-worked Opening example
and beat-by-beat notes for the other chapters, built from word-count
estimates before the narration was recorded. That's now superseded by the
real `production/rare-earths/shotlist.json` (110 shots, real timestamps) —
see the table above and the file itself rather than the old estimates. The
template-reuse guidance carried over unchanged into the real file: the
Mountain Pass mine asset is redressed across the boom/undercut/closure/
reopen eras rather than regenerated, and the `SplitPhoneCall` exchange
(recovered from a transcription bug — see above) is `factory-manager` vs.
`export-official`, exactly as planned here originally.
