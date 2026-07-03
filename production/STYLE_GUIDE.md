# Visual Style Decode — reference: "The Incredible Japanese Prison Break" (youtu.be/oI8trlbCbU8)

Decoded by sampling ~17 frames spread evenly across the reference video's storyboard
sprite sheet (yt-dlp `sb0` format), since the video itself couldn't be pulled full-res
in this environment. Enough coverage to identify a clear, repeatable production pattern.

## What the video actually is (production recipe)

It's a **hybrid AI-illustration documentary**: no traditional animation, no live actors.
Four asset types are cut together and unified with one color grade:

1. **Character/scene illustrations** — flat cel-shaded anime/manhwa style digital art
   (bold black outlines, minimal shading blocks, expressive simplified faces). These
   carry every scene with a named person or dramatized moment (guards, prisoner,
   interrogation, character portraits).
2. **Painterly wide/establishing shots** — semi-realistic matte-painting style
   landscapes and buildings, looser brushwork than the character art, used for
   location/context shots.
3. **Real photographic inserts** — actual stock/archival photos (textures, objects,
   nature) dropped in for factual anchor beats — always re-graded to match the
   illustrated scenes' palette so they don't look out of place.
4. **Minimal motion-graphics overlays** — glowing rings, pulsing map markers,
   satellite-style dark maps with a highlighted region — used for geography/data beats
   between narrative scenes.

## Animation style (this is the important part — there is no frame-by-frame animation)

- Every asset is a **single static image**. Motion comes entirely from camera moves on
  that still image:
  - **Ken Burns pans/zooms** — slow scale (1.0 → ~1.08–1.15) plus a slight pan,
    eased (not linear), lasting the full duration the shot is on screen.
  - **Parallax on multi-layer scenes** — foreground/background separated slightly and
    moved at different speeds for a subtle 2.5D depth effect (visible as mild
    "ghosting" between adjacent storyboard frames — that's parallax drift, not a
    render artifact).
  - Character portraits get **near-imperceptible idle motion** (tiny scale breathing,
    occasional blink-swap) rather than a big Ken Burns move, so dialogue-driven shots
    don't feel like they're sliding around.
- **Transitions**: hard cuts on beat with the narration, occasionally a quick
  cross-fade or a circular wipe/iris (the glowing-ring graphic doubles as a wipe
  transition device).
- **Color grade unifies everything**: desaturated, slightly cool-shadow /
  warm-highlight (soft teal & orange split-tone), crushed blacks, soft vignette on
  every shot, a consistent light film-grain overlay on top of the whole timeline —
  this one layer is what makes illustration + painting + real photos read as one
  world.
- **Captions/narration**: no on-screen animated text in the sampled frames — the
  video is voice-led; graphics carry the info instead of lower-thirds. (For our
  version we're adding burned-in captions anyway since that's now standard for
  retention — see Remotion setup below.)

## Reusable prompt formula for ChatGPT (DALL·E) image generation

Use one of these two suffixes on every prompt depending on shot type, so the whole
episode comes out visually consistent. Swap in the scene-specific description at
the front; keep the suffix identical every time.

**A. Character / dramatized scene shots**
```
[SCENE DESCRIPTION], flat cel-shaded anime/manhwa illustration style, bold clean
black outlines, minimal flat shading with soft directional light, muted desaturated
color palette with cool teal shadows and warm amber highlights, subtle film grain,
soft vignette, cinematic 16:9 widescreen documentary composition, no text, no
watermark, no logo.
```

**B. Wide / establishing / location shots**
```
[SCENE DESCRIPTION], semi-realistic painted matte-painting illustration, loose
brushwork, moody atmospheric lighting, muted desaturated color palette with cool
teal shadows and warm amber highlights, subtle film grain, soft vignette, cinematic
16:9 widescreen documentary composition, no text, no watermark, no logo.
```

Generate at 1792x1024 (DALL·E 3's native widescreen) so Remotion has headroom to
Ken-Burns/pan without upscaling artifacts.

The map/ring motion-graphics elements should **not** be generated as images — build
them directly in Remotion (SVG + `interpolate`), see below. They're simple enough
that a generated image would only fight the crispness the reference has there.

## Remotion implementation of the above

- `KenBurns` component: wraps an `<Img>`, animates `scale`/`translate` over the
  shot's `durationInFrames` with an eased interpolation, direction (which corner it
  zooms toward) alternates per shot so consecutive shots don't feel identical.
- `FilmGrain` + `Vignette` overlay components: fixed, timeline-wide, sit above
  everything as the unifying grade (see `src/Grade.tsx`).
- `MapReveal` component: pure SVG/Canvas, no image asset, for the geography beats.
- Captions: burned in from `transcripts/Room_39/Room_39.json` word-level timestamps
  (already generated) — one caption clause on screen at a time, synced tightly.
