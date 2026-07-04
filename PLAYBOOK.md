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

**Known drift**: `Room_39` predates this convention — its production files sit
directly under `production/` (not `production/Room_39/`). Move them into
`production/<slug>/` before starting a second video, or the next video's files
will collide with these.

The first time through, `remotion/` itself is the template — after a video ships,
either branch it per-project or treat `src/data/*.json` + `public/images/` as the
only things that change between videos and keep one Remotion project long-term.
`src/data/*.json` (shotlist, overlays, captions) are plain copies, not symlinks —
nothing enforces that they match `production/*.json` / the transcript, so re-copy
by hand every time you edit the source and don't assume they're in sync.

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

## 2. (Optional) Decode a reference video's visual style

If replicating another video's look: pull its storyboard sprite sheet instead of
the full video (much lighter, and sidesteps most download/auth issues):

```bash
pip install yt-dlp
yt-dlp -f sb0 -o "sb0.%(ext)s" "<youtube-url>"
```

The `.mhtml` result is a MIME multipart file of JPEG sprite sheets — extract with
Python's `email` module, tile each sheet into individual frames with Pillow, then
sample ~15–20 frames evenly across the timeline and look at them (the `Read` tool
renders images directly). From that, write a `STYLE_GUIDE.md` documenting:
- the asset types in play (illustration style / painterly establishing shots / real
  photo inserts / motion graphics) and how they're differentiated,
- the animation approach (usually just Ken Burns pans + occasional parallax — full
  frame-by-frame animation is rare in this genre),
- the color grade that unifies everything (grain, vignette, split-tone),
- two ready-to-paste ChatGPT image-generation prompt templates (one per asset
  type) ending in an identical style suffix so every generated image matches.

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
- After editing `production/shotlist.json`, `production/overlays.json`, or the
  transcript, re-copy them into `src/data/shotlist.json`, `src/data/overlays.json`,
  `src/data/captions.json` respectively — these are hand-maintained copies (see
  step 0), not read live from `production/`/`transcripts/`.

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

**Not currently wired in**: `package.json`'s `build` script is just
`remotion render src/index.ts Room39 out/room-39.mp4` with no CRF flag, and the
shipped `deliverables/room-39.mp4` shows no evidence this recompress step was
actually run. Treat the two-command sequence above as required, run it by hand
every time, and don't rely on `npm run build` alone to produce the final file.

Before calling it done, pull stills at: a chapter-card frame, a stat-callout frame,
a lower-third frame, a kinetic-line frame, a frame mid-crossfade between two scenes
(confirms no black gap), and a parallax scene frame. Cheaper to catch a broken
overlay or a stray black flash from 6 stills than from scrubbing the full render.

## 7. Thumbnail

Use the Canva MCP `generate-design` tool with `design_type: youtube_thumbnail`
and a prompt built from the same style guide (bold title text, high contrast,
the moodboard's palette). Export at `1280x720`. Generate a couple of concept
variants and let the user pick rather than shipping the first result. **Check
each candidate for**: letterboxing/pillarboxing (generated designs sometimes
render with black bars baked into the canvas — crop to content bounds and
resize back up rather than shipping with bars) and garbled text on any
map/label graphic (a common generation artifact, easy to miss at a glance).

## 8. Metadata

Write title/description/tags/category, and pull chapter timestamps straight from
the `overlays.json` chapter list (already-decided narrative beats, and YouTube
requires the first chapter at `0:00` and ≥10s between chapters — both already true
if the overlay chapters were spaced sensibly in step 5).

## Reuse checklist for the next video

- [ ] Transcribe with faster-whisper, skim the `.txt` for errors
- [ ] (If replicating a style) pull storyboard sprites, decode style guide
- [ ] Build `shotlist.json` scenes from the transcript
- [ ] Generate images one at a time, in order, verifying each before moving on
- [ ] Point the Remotion project at the new `shotlist.json` / `captions.json` /
      `overlays.json` / `public/images/`, re-copying each into `src/data/` (they
      are manual copies, not read live from `production/`/`transcripts/`)
- [ ] Render → compress with the ffmpeg CRF 26 pass (not currently automated by
      `npm run build`) → still-frame QA (crossfades, overlays, parallax)
- [ ] Thumbnail via Canva: generate a few candidates, check each for
      letterboxing/pillarboxing and garbled map/label text before picking one
- [ ] Metadata with chapters pulled from `overlays.json`
