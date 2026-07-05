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
  type) ending in an identical style suffix so every generated image matches.

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

## 3. Build the shot list from the transcript

Group the transcript's segments into ~15–25 narrative scenes (not uniform time
slices — cut on topic changes). For each scene, write `production/<slug>/shotlist.json`:

```json
{
  "scenes": [
    {
      "id": 1, "start": 0.0, "end": 10.14, "segments": [1,2,3],
      "file": "01-some-name.png", "imageType": "A",
      "description": "<scene description to feed the image prompt>"
    }
  ]
}
```

`imageType`: `A` = character/dramatized illustration prompt suffix, `B` =
painterly/establishing prompt suffix, `M` = built directly in Remotion as a motion
graphic (maps, diagrams, transitions) — no image needed, cheaper and crisper than
generating one.

## 4. Generate images

For each non-`M` scene, combine `description` + the matching style-guide suffix
into one prompt, hand it to ChatGPT image generation **one scene at a time, in
order** — ask the user for each image, inspect what comes back before accepting it
(catch mismatched scenes, wrong framing, multi-panel grids, etc. before they get
buried in the project), then drop it into `remotion/public/images/<file>`,
replacing the placeholder. Generate placeholders (solid color + description text,
via Pillow) up front so the Remotion project renders end-to-end before any real
art exists.

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
- [ ] Build `shotlist.json` scenes from the transcript
- [ ] Generate images one at a time, in order, verifying each before moving on
- [ ] Point the Remotion project at the new `shotlist.json` / `captions.json` /
      `overlays.json` / `public/images/`
- [ ] Render → compress → still-frame QA (crossfades, overlays, parallax)
- [ ] Thumbnail via Canva, check for letterboxing
- [ ] Metadata with chapters pulled from `overlays.json`
