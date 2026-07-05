# Audio → Finished YouTube Video: Reusable Playbook

This is the repeatable process used to turn `Room_39.mp3` into a finished, styled,
captioned video with a thumbnail and metadata. Follow it top to bottom for the next
video; only the content changes, not the pipeline. Replace `<slug>` below with a
short project name (e.g. `room-39`).

## 0. Folder layout (per video)

```
transcripts/<slug>/          Whisper output (.json/.srt/.txt)
production/<slug>/           STYLE_GUIDE.md, shotlist.json, overlays.json, thumbnail/
remotion/                    one Remotion project, reused across videos —
                              swap public/images, src/data/*.json per project
deliverables/<slug>.mp4      final render for direct GitHub download
```

The first time through, `remotion/` itself is the template — after a video ships,
either branch it per-project or treat `src/data/*.json` + `public/images/` as the
only things that change between videos and keep one Remotion project long-term.

## 1. Transcribe with accurate timestamps

Tools: `ffmpeg` (decode), `faster-whisper` (ASR with word-level timestamps).

```bash
apt-get install -y --no-install-recommends ffmpeg
pip install faster-whisper
```

Run with `word_timestamps=True`, `vad_filter=True`, `beam_size=5`, model `small`
on CPU/int8 (good accuracy/speed tradeoff for CPU-only environments). Output three
files: `.json` (segments + word timestamps, feeds captions/overlay timing), `.srt`
(subtitles), `.txt` (human-readable with `[start --> end]` per line). See
`transcripts/Room_39/` and the script pattern used there for the exact call.

**Checkpoint**: skim the `.txt` output for obvious mis-transcriptions before
building anything downstream from it — everything else keys off these timestamps.

## 2. (Optional) Decode a reference video's visual style and narration style

If replicating another video's look and voice: pull its storyboard sprite sheet
instead of the full video (much lighter, and sidesteps most download/auth issues):

```bash
pip install yt-dlp
yt-dlp -f sb0 -o "sb0.%(ext)s" "<youtube-url>"
```

The `.mhtml` result is a MIME multipart file of JPEG sprite sheets — extract with
Python's `email` module, tile each sheet into individual frames with Pillow, then
sample ~15–20 frames evenly across the timeline and look at them (the `Read` tool
renders images directly).

**Known failure mode**: some videos' storyboard JPEGs are themselves corrupted at
the source (confirmed on the `strait-of-hormuz-reference` decode — two independent
downloads were byte-identical and `ffmpeg` logged matching decode errors on both,
so it wasn't a fetch problem). `googlevideo.com` — the CDN that serves actual
video/audio streams — also returns HTTP 403 for every format in this environment
regardless of resolution, so `yt-dlp` can't fall back to a real download either.
**If the user can supply the actual video file** (downloaded locally, e.g. via a
browser extension, then added to the repo/branch), always prefer decoding real
frames from it with `ffmpeg -vf fps=1/3` over storyboard sprites — much higher
fidelity, and it catches things a blocky/corrupted sprite can misread (a
storyboard-only pass on the Hormuz reference misread a literal insurance-office
scene as a health-insurance *analogy*, purely from lack of detail). Grab a few
native-framerate 2–3s bursts too (`ffmpeg -ss <t> -t 3 -vf fps=10`) at a handful of
representative moments — a single evenly-sampled frame per shot can't tell a Ken
Burns pan from a locked-off shot with a looping secondary animation (a waving
flag, a sonar sweep) from a talking-head mouth-swap, and those are different
Remotion components.

From the frames, write `production/<slug>/STYLE_GUIDE.md` documenting:
- the asset types in play (illustration style / painterly establishing shots / real
  photo inserts / motion graphics) and how they're differentiated,
- the animation approach — check for more than one technique before assuming Ken
  Burns everywhere: locked-off shots with a looped secondary motion, talking-head
  viseme/mouth-swap holds, and narration-paced progressive reveals (on-screen text
  or a diagram building up word-by-word) are all common and each needs a different
  component,
- whether any composition (a map, a character lineup, a symbolic vignette) is
  reused as a template across multiple scenes with only labels/costumes swapped —
  if so, that's the cheapest asset to replicate and worth building as a
  data-driven component rather than regenerating per scene,
- the color grade — a single continuous grade (Room_39's grain+vignette+split-tone)
  and a chapter-switched grade (two or more distinct palettes swapped at chapter
  boundaries, e.g. a bright "explainer" grade vs. a dark "crisis" grade) are both
  common; check whether it's constant or switches before writing the Remotion
  grade component,
- two ready-to-paste ChatGPT image-generation prompt templates (one per asset
  type) ending in an identical style suffix so every generated image matches,
- **the actual cut rate, measured, not eyeballed.** A single evenly-sampled
  frame every few seconds makes any video look like a slideshow — confirm the
  real pace with a calibrated frame-difference pass instead of guessing from a
  handful of stills:
  ```python
  # frames_fine/ = ffmpeg -vf fps=2 output (0.5s resolution is enough)
  # downsample each to a small grayscale thumbnail, mean-abs-diff consecutive
  # frames, then merge consecutive above-threshold points into single cut
  # events (a threshold around 15 on an 80x45 8-bit grayscale thumbnail
  # correctly caught a known hard cut in the Hormuz reference at a diff of
  # 50 vs. a ~1-5 baseline during held shots — sanity-check yours the same
  # way against one cut you've confirmed visually before trusting the count)
  ```
  This matters because it changes the production plan, not just the style
  notes: the Hormuz reference measured at **133 cuts over 9:30 — 14 cuts/min,
  average shot length 4.3s (median 3.5s, range 1-12s)**, while this repo's
  existing Room_39 recipe (measured the same way on the actual render) runs
  **22 cuts over 5:31 — 4.0 cuts/min, average shot length 14.4s**. That's a
  3.5x gap, not a rounding error — treat the measured number as the pacing
  target for step 3, not the "~15-25 scenes" guidance below, if the goal is
  actually matching a fast-cutting reference rather than the Room_39 pace.

Separately, pull the caption track for the narration-style half of this
study — auto-captions are enough, word-level timestamps aren't needed for this:

```bash
yt-dlp --skip-download --write-auto-subs --sub-langs en --sub-format vtt \
  -o "transcript.%(ext)s" "<youtube-url>"
```

Read the full cleaned transcript (strip VTT timing/tags) and write a narration
section (in the same `STYLE_GUIDE.md` or a sibling file) covering: the opening
hook technique, any single extended metaphor the whole script hangs on, recurring
rhetorical devices (relatable-scale comparisons, naming ordinary people in
unrelated places, staging an abstract mechanism as a literal scene rather than a
chart), the act structure (does it set up an expected solution and then subvert
it?), whether dramatized quotes use a second voice/character, and how it closes
(circular/thematic vs. a separate summary) — end with a reusable technique
checklist a future script in the same genre can follow. See
`production/strait-of-hormuz-reference/STYLE_GUIDE.md` for a full worked example
of both halves of this step.

## 3. Build the asset library and shot list from the transcript

**Two different recipes need two different shapes here — pick based on the
measured cut rate from step 2, don't default to one.**

- **Low-cut-rate recipe** (Room_39-style, ~4 cuts/min, ~12-15s holds): one
  scene = one bespoke image, same as before. Group transcript segments into
  ~15-25 narrative scenes (cut on topic changes, not uniform time slices).
- **High-cut-rate recipe** (Hormuz-style, ~14 cuts/min, ~4s holds): generating
  one bespoke image per shot doesn't scale — a 9-minute video at that pace
  needs ~125 shots, and hand-approving 125 individual generations is both
  slow and how you end up with visible inconsistency between them. The
  reference itself doesn't do this either — it reuses a handful of
  compositions (one map redressed with different pins/labels 8+ times, one
  ship silhouette copy-pasted into every fleet shot, one hilltop composition
  redressed across three historical eras) with only labels/costumes/pins
  swapped. **Split the file in two: a small asset library, and a much longer
  shot list that mostly references it.**

```json
// production/<slug>/asset-library.json — ~15-25 entries, same generation
// budget as the low-cut-rate recipe, just reused far more per asset
{
  "assets": [
    { "id": "gulf-map-base", "type": "map", "file": "gulf-map-base.png",
      "description": "flat vector Gulf region map, ..." },
    { "id": "detective-narrator", "type": "character",
      "files": { "base": "detective-base.png",
                 "mouth": ["detective-mouth-closed.png", "detective-mouth-open.png"],
                 "blink": "detective-blink.png" },
      "description": "flat vector trenchcoat narrator figure, ..." }
  ]
}
```

```json
// production/<slug>/shotlist.json — ~1 entry per real cut, most reference
// an asset + a variant instead of a unique file
{
  "scenes": [
    { "id": 1, "start": 0.0, "end": 3.2, "segments": [1],
      "asset": "gulf-map-base", "variant": "M",
      "overlay": { "pins": [{ "label": "IRAN", "x": 0.4, "y": 0.3 }] } },
    { "id": 2, "start": 3.2, "end": 8.4, "segments": [1,2],
      "asset": "detective-narrator", "variant": "A",
      "talking": true }
  ]
}
```

`variant`/`imageType`: `A` = character/dramatized illustration prompt suffix,
`B` = painterly/establishing prompt suffix, `M` = built directly in Remotion
as a motion graphic (maps, diagrams, transitions, label/pin overlays on a
reused base image) — no per-shot image needed, cheaper, crisper, and it's
the type that actually makes a high cut rate affordable.

Either way, avoid uniform time slices — cut on topic changes and on the
narration's own rhythm (a quick consequence-montage beat wants several
1-2s shots in a row; a whiteboard-reveal or talking-head beat wants one
shot held for several seconds while an overlay does the work instead).

## 4. Generate the asset library

Same workflow as before, just against the (much shorter) asset library
instead of one image per shot: for each non-`M` asset, combine its
`description` with the matching style-guide suffix, hand it to ChatGPT image
generation **one asset at a time, in order** — ask the user for each image,
inspect what comes back before accepting it, then drop it into
`remotion/public/images/<file>`, replacing the placeholder. Generate
placeholders (solid color + description text, via Pillow) up front so the
Remotion project renders end-to-end before any real art exists. For
character assets, ask for the base pose and mouth/blink variants as separate
layer images where the generator supports it — that's what makes the
`TalkingCharacter` component's viseme swap (see step 5) work cheaply.

## 5. Composition in Remotion

Core pieces (see `remotion/src/`):

- **`timeline.ts`**: single source of truth for scene timing. Extend each scene's
  on-screen hold to the *next* scene's start (not its own dialogue end) — natural
  pauses between sentences otherwise become gaps where nothing renders, which is
  the #1 cause of jarring black-screen cuts. Pad every internal Sequence boundary
  by a crossfade duration (`overlays.json` → `crossfadeSeconds`, ~0.4s) so
  `SceneFade` can dissolve between scenes without shifting the nominal start times
  that captions/overlays key off of.
- **`KenBurns.tsx`** / **`ParallaxImage.tsx`**: default motion is a slow eased
  scale+pan; reserve the 2-layer soft-masked parallax version for wide/landscape
  "B"-type shots where real depth reads well.
- **High-cut-rate recipe only** — components that read `shotlist.json`'s
  `asset`/`variant`/`overlay` fields instead of a 1:1 image, so the shot list
  can run 5-6x longer than the asset library without 5-6x the art budget:
  - `RegionMap.tsx` — one base map image plus a data-driven list of
    pins/arrows/callout labels (position, text, appear-time) per shot.
  - `TalkingCharacter.tsx` — swaps mouth/blink layers on a fixed interval or
    audio-amplitude gate over an otherwise static character image.
  - `LoopedIdle.tsx` — a small looping transform (flag wave, drifting clouds,
    a sonar sweep) on an otherwise locked-off shot — cheaper and more
    consistent than Ken Burns for "planted" vignette shots.
  - `ProgressiveReveal.tsx` — reveals N items in sequence timed to absolute
    seconds, for whiteboard-style checklists and kinetic chapter-title cards.
  - `SplitPhoneCall.tsx` — two-pane cross-cut layout for dramatized
    multi-voice quote beats, each pane a `TalkingCharacter`.
- **`Grade.tsx`**: vignette + film grain + split-tone overlay, sits above every
  shot — this is what makes generated illustrations, painterly shots, and any real
  photos read as one consistent world.
- **`Captions.tsx`**: burned-in captions straight from the transcript JSON.
- **`Overlays.tsx`** + `production/<slug>/overlays.json`: optional but worth
  reusing — chapter title cards between narrative beats, kinetic stat callouts for
  big numbers, documentary-style lower thirds for named people, a recurring map
  ping for each place mentioned, kinetic-type treatment for the 1-2 sharpest quotes,
  an end card. All keyed by absolute start/end seconds against the transcript, and
  layered *on top of* the scene timeline rather than part of it, so none of them
  can knock the narration/caption sync out of alignment.
- **`SfxCues.tsx`**: short synthesized cues under the overlay graphics
  (`sox` synth — see `remotion/public/audio/sfx/`) — a whoosh under chapter cards,
  a thud under stat callouts, a ping under map pings/lower thirds. Cheap, license-free,
  no dependency on a sample library.
- Narration audio is an `<Audio>` element inside the composition (not muxed on
  after the fact) so `npm run build` alone produces the finished file.

## 6. Render, compress, QA

```bash
npx remotion render src/index.ts <CompositionId> out/<slug>-raw.mp4 --concurrency=4
ffmpeg -y -i out/<slug>-raw.mp4 -c:v libx264 -crf 26 -preset medium \
  -vf format=yuv420p -c:a aac -b:a 160k out/<slug>.mp4
```

CRF 26 is necessary, not just nice-to-have, when a film-grain overlay is in the
grade — grain inflates bitrate under a quality-target encode far more than it
looks like it should; without recompressing, files land 5-6x larger for no visible
gain.

Before calling it done, pull stills at: a chapter-card frame, a stat-callout frame,
a lower-third frame, a kinetic-line frame, a frame mid-crossfade between two scenes
(confirms no black gap), and a parallax scene frame. Cheaper to catch a broken
overlay or a stray black flash from 6 stills than from scrubbing the full render.

## 7. Thumbnail

Use the Canva MCP `generate-design` tool with `design_type: youtube_thumbnail`
and a prompt built from the same style guide (bold title text, high contrast,
the moodboard's palette). Export at `1280x720`. **Check for letterboxing** in the
export — generated thumbnail designs sometimes render with black bars baked into
the canvas; if so, crop to the actual content bounds and resize back up rather
than shipping with bars.

## 8. Metadata

Write title/description/tags/category, and pull chapter timestamps straight from
the `overlays.json` chapter list (already-decided narrative beats, and YouTube
requires the first chapter at `0:00` and ≥10s between chapters — both already true
if the overlay chapters were spaced sensibly in step 5).

## Reuse checklist for the next video

- [ ] Transcribe with faster-whisper, skim the `.txt` for errors
- [ ] (If replicating a style) pull storyboard sprites — or a real video file if
      the user can supply one, it's higher fidelity and avoids storyboard
      corruption — and decode a visual `STYLE_GUIDE.md`
- [ ] (If replicating a voice) pull auto-captions and decode a narration-style
      section: hook, central metaphor, recurring rhetorical devices, act
      structure, dramatized-quote handling, closing technique, reusable checklist
- [ ] Measure the reference's actual cut rate (calibrated frame-diff, not
      eyeballed) and pick low-cut-rate (one image per scene) vs. high-cut-rate
      (asset library + data-driven shot list) accordingly
- [ ] Build `shotlist.json` scenes from the transcript (plus `asset-library.json`
      if high-cut-rate)
- [ ] Generate images one at a time, in order, verifying each before moving on
- [ ] Point the Remotion project at the new `shotlist.json` / `captions.json` /
      `overlays.json` / `public/images/`
- [ ] Render → compress → still-frame QA (crossfades, overlays, parallax)
- [ ] Thumbnail via Canva, check for letterboxing
- [ ] Metadata with chapters pulled from `overlays.json`
