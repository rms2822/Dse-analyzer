# Room 39 — Remotion video project

Assembles the `Room_39.mp3` narration + timestamped transcript into a video in the
decoded style from `production/STYLE_GUIDE.md` (one level up). Ken Burns / parallax
motion on static images, a unifying film-grade (grain + vignette + split-tone),
burned-in captions synced to the real transcript timestamps, a set of overlay
graphics (chapter cards, stat callouts, lower thirds, map pings, kinetic type), a
handful of pure-Remotion motion graphics for map/diagram beats, and narration + SFX
audio baked directly into the render.

## Workflow

1. **Generate images with ChatGPT.** Open `../production/shotlist.json` — each
   scene with `"imageType": "A"` or `"B"` has a `description` field. Prepend it to
   the matching suffix in `../production/STYLE_GUIDE.md` ("Character / dramatized
   scene shots" for A, "Wide / establishing / location shots" for B) and generate
   at 1792x1024. Scenes marked `"imageType": "M"` are built directly in Remotion —
   skip those.
2. **Drop the images in** `public/images/<file>`, replacing the placeholder with
   the same filename (e.g. `01-unmarked-door.png`).
3. **Preview**: `npm start` opens Remotion Studio (scrub the timeline, see changes
   live as you swap in real images).
4. **Render**: `npm run build` outputs `out/room-39.mp4` — audio (narration + SFX)
   is muxed in automatically, no separate ffmpeg step needed.

## Structure

- `src/timeline.ts` — the single source of truth for scene timing. Each scene's
  on-screen hold is extended to the *next* scene's start (not just its own dialogue
  end) so the natural pauses between sentences don't leave a gap with nothing
  rendered, and a short crossfade (`overlays.json` → `crossfadeSeconds`) is added at
  every boundary via `SceneFade` — this is what fixed the black-screen flashes that
  used to happen at almost every cut. A trailing end card is appended as the final
  timeline item so it gets the same crossfade treatment.
- `src/data/shotlist.json` / `src/data/overlays.json` — copies of the shot list and
  the overlay timing (chapters/stats/lower-thirds/map pings/kinetic lines/end card),
  keeps this project self-contained. Source of truth is `production/*.json` one
  level up — re-copy after editing there.
- `src/data/captions.json` — copy of the Whisper transcript
  (`transcripts/Room_39/Room_39.json`) used to drive burned-in captions.
- `src/components/KenBurns.tsx` — pan/zoom on a still image (used for scenes not in
  `overlays.json` → `parallaxSceneIds`).
- `src/components/ParallaxImage.tsx` — 2-layer fake-depth version of the above
  (soft-masked top/bottom bands moving at different rates) for the wide establishing
  shots, closer to what the reference video does.
- `src/components/SceneFade.tsx` — crossfade wrapper; see `timeline.ts` above.
- `src/components/Grade.tsx` — the unifying color grade (vignette + grain +
  split-tone) that sits above every shot.
- `src/components/Captions.tsx` — bottom-third caption synced to transcript segment
  timing (yields to `KineticLines` during the couple of lines that get the bigger
  kinetic-type treatment instead).
- `src/components/Overlays.tsx` — `ChapterCards`, `StatCallouts`, `LowerThirds`,
  `MapPings`, `KineticLines`, `EndCard`. All driven by `overlays.json` via the
  `useActiveWindow` hook, and layered on top of the scene timeline rather than
  being part of it, so they never affect narration/caption sync.
- `src/components/SfxCues.tsx` — plays the synthesized cues in
  `public/audio/sfx/` (whoosh / thud / ping) under the chapter cards, stat
  callouts, and map pings / lower thirds respectively.
- `src/components/MotionGraphics.tsx` — the four pure-graphic scenes (title
  reveal, three-offices diagram, old→new tools transition, three-generations).
- `src/Room39Video.tsx` — builds the timeline from `timeline.ts`, renders each item
  through `SceneFade`, and layers `Grade`/overlays/`Captions`/`SfxCues`/narration
  `Audio` on top.

## Editing the overlays

`production/overlays.json` (copy at `src/data/overlays.json`) holds every overlay's
timing in seconds against the real transcript:

- `chapters` — section-divider cards (title + start/end window).
- `stats` — kinetic number callouts.
- `lowerThirds` — name/role tags for named people.
- `mapPings` — small corner map badge for each country mentioned.
- `kineticLines` — the couple of lines that get bold animated type instead of a
  normal caption.
- `parallaxSceneIds` — which scene ids use `ParallaxImage` instead of `KenBurns`.
- `crossfadeSeconds` / `endCard` — global crossfade duration and the closing card.

If you change the narration or timestamps, regenerate
`transcripts/Room_39/Room_39.json` and re-copy it to `src/data/captions.json`, and
update `production/shotlist.json` / `overlays.json` timings to match, then re-copy
those into `src/data/` too.
