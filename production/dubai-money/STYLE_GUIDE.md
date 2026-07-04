# Visual Style — Dubai Money (vertical short)

Reuses the same hybrid AI-illustration documentary style decoded in
`production/STYLE_GUIDE.md` (Room 39), adapted to a 9:16 vertical frame and a
smaller, non-character shot list (mostly wide/establishing + a couple of
conceptual close scenes + two Remotion motion-graphic maps).

## Reusable prompt formula for ChatGPT (DALL·E) image generation

Use one of these two suffixes depending on shot type (see `shotlist.json` →
`imageType`), swapping in the scene-specific `description` at the front. Keep
the suffix identical every time so the whole short is visually consistent.

**A. Conceptual / close scene shots** (scene 3)
```
[SCENE DESCRIPTION], flat cel-shaded illustration style, bold clean black
outlines, minimal flat shading with soft directional light, muted desaturated
color palette with cool teal shadows and warm amber/gold highlights, subtle
film grain, soft vignette, cinematic vertical 9:16 portrait composition, no
text, no watermark, no logo.
```

**B. Wide / establishing / location shots** (scenes 1, 2, 5, 7, 8)
```
[SCENE DESCRIPTION], semi-realistic painted matte-painting illustration, loose
brushwork, moody atmospheric lighting, muted desaturated color palette with
cool teal shadows and warm amber/gold highlights, subtle film grain, soft
vignette, cinematic vertical 9:16 portrait composition, no text, no watermark,
no logo.
```

Generate at **1024x1792** (DALL-E 3's native portrait size) so Remotion has
headroom to Ken-Burns/pan without upscaling artifacts, and so nothing needs
letterboxing to fit the 9:16 frame.

Scenes 4 and 6 (`imageType: "M"`) are built directly in Remotion (SVG map +
`interpolate`) — do not generate images for those, same reasoning as Room 39's
motion-graphic beats: a generated image would only fight the crispness a
built graphic gets for free.

## Remotion implementation

Same components as Room 39 (`Grade`, `KenBurns`/`ParallaxImage`, `Captions`,
`SfxCues`), reused as-is. The only project-level differences: a 1080x1920
(9:16) composition instead of 1920x1080, and two new map motion-graphic
components (free-zone map, flight-radius map) alongside the existing
`MotionGraphics.tsx` set.
