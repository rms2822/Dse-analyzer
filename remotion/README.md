# Room 39 — Remotion video project

Assembles the `Room_39.mp3` narration + timestamped transcript into a video in the
decoded style from `production/STYLE_GUIDE.md` (one level up). Ken Burns motion on
static images, a unifying film-grade (grain + vignette + split-tone), burned-in
captions synced to the real transcript timestamps, and a few pure-Remotion motion
graphics for map/diagram beats.

## Workflow

1. **Generate images with ChatGPT.** Open `../production/shotlist.json` — each
   scene with `"imageType": "A"` or `"B"` has a `description` field. Prepend it to
   the matching suffix in `../production/STYLE_GUIDE.md` ("Character / dramatized
   scene shots" for A, "Wide / establishing / location shots" for B) and generate
   at 1792x1024. Scenes marked `"imageType": "M"` are built directly in Remotion —
   skip those.
2. **Drop the images in** `public/images/<file>`, replacing the placeholder with
   the same filename (e.g. `01-unmarked-door.png`). Placeholders are already there
   so the project renders end-to-end before you've generated anything.
3. **Preview**: `npm start` opens Remotion Studio (scrub the timeline, see changes
   live as you swap in real images).
4. **Render**: `npm run build` outputs `out/room-39.mp4`.

## Structure

- `src/data/shotlist.json` — copy of the shot list (scene timing + image file +
  prompt description), keeps this project self-contained.
- `src/data/captions.json` — copy of the Whisper transcript
  (`transcripts/Room_39/Room_39.json`) used to drive burned-in captions.
- `src/components/KenBurns.tsx` — pan/zoom on a still image.
- `src/components/Grade.tsx` — the unifying color grade (vignette + grain +
  split-tone) that sits above every shot.
- `src/components/Captions.tsx` — bottom-third caption synced to transcript
  segment timing.
- `src/components/MotionGraphics.tsx` — the four pure-graphic scenes (title
  reveal, three-offices diagram, old→new tools transition, three-generations).
- `src/Room39Video.tsx` — lays out all scenes from `shotlist.json` as
  `<Sequence>`s and picks Ken Burns vs. a motion graphic per scene.

If you change the narration or timestamps, regenerate
`transcripts/Room_39/Room_39.json` and re-copy it to `src/data/captions.json`, and
update `production/shotlist.json` scene start/end times to match.
