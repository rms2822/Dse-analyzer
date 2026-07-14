# Style decode #2 — "the Vox video" (actually OverSimplified)

User feedback: "The art style doesn't work, the designs aren't clear enough.
Use the vox youtube video style." Two reference links were provided in
sequence.

## Reference 1 (rejected as a mismatch)

`youtu.be/WambFvcs1Rc` — Vox's **The Gray Area** podcast ("Democrats don't
know how to fix America's spiritual crisis"), ~44min. Decoded via storyboard
sprite (direct video download blocked with HTTP 403 in this environment, same
as the original Hormuz decode). This is a live two-person talking-head
interview show — no charts, maps, or infographic sequences anywhere across
the full runtime (checked storyboard tiles spanning the whole video). Not
usable as a style reference for an illustrated/narrated documentary; flagged
back to the user, who supplied a second link.

## Reference 2 (the actual style reference used below)

`youtu.be/I79TpDe3t2g` — **"The Cold War - OverSimplified (Part 1)"** by the
channel OverSimplified, 16:03. Not actually a Vox upload (confirmed via
yt-dlp's `uploader`/`channel` fields) — worth noting, but treated as the
intended reference regardless since the user supplied it deliberately after
rejecting reference 1.

**Method**: `googlevideo.com` returned HTTP 403 for direct format download in
this environment (same limitation as the Hormuz decode), so this used the
`sb3` storyboard sprite only — one 480x270 sheet, 10x10 grid, ~9.6s per tile,
covering the full 963s runtime. This is lower fidelity than the real-frame
decode the Hormuz reference got, so treat findings below as directionally
confident, not frame-exact — same caveat the Hormuz `STYLE_GUIDE.md` already
documents for storyboard-only decoding.

### Findings

1. **Cream/white is the default background**, not dark. Scenes are
   predominantly flat-illustrated on a light background; black/dark-navy
   backgrounds appear specifically for dramatic or tense beats (a menacing
   silhouette on solid deep red, a spotlit figure on black), not as the
   default canvas. This is the opposite of what we'd built — our overlay
   layer defaulted to a near-black `ink` background everywhere.
2. **Muted, desaturated illustration palette.** Character/environment scenes
   (an office interior, a factory exterior, a pastoral green field) use soft,
   low-saturation color -- not the bold saturated primary-color scheme we'd
   built for the "Vox graphics layer."
3. **Maps are colored by allegiance/bloc**, not by a single flat landmass
   tone: Cold War-era maps color the Soviet/communist side a deep red and the
   opposing side navy/blue, redrawn per scene as the front line moves (a
   divided Korea map, a shifting Europe map). The maps are also
   **recognizable real geography** — actual country/continent silhouettes,
   not abstract shapes.
4. **Bold, thick-outlined white sans-serif text** for year/label callouts
   ("1917"), high contrast against a dark backdrop, no background chip/card
   behind it -- the outline itself carries the legibility, not a solid box.
5. **Real black-and-white archival photography** is mixed directly with the
   flat illustration (handshake photos, a leaders' portrait) for
   documentary-style beats.
6. Small flat character icons are used at **small, icon-like scale**
   (standing on a map, in a room), not as large detailed bust portraits — this
   matches the direction we'd already moved in (no more human-character
   assets) and doesn't require further change.

### Update: 4 real screenshots supplied mid-rework (higher confidence than storyboard)

The user followed up with 4 actual full-resolution frames from the video
(not storyboard tiles). These supersede the low-fidelity findings above where
they conflict — same "prefer real frames over storyboard" lesson as the
original Hormuz decode. (Player-chrome elements visible in the screenshots --
the YouTube progress bar, the "Includes paid promotion" badge, the
next-chapter arrow -- are UI, not video content, and are excluded below.)

1. **Maps are accurately recognizable real geography**, not abstract shapes
   -- a screenshot of "USSR" vs. "Russia" shows the actual, correct Russia/
   Soviet-border silhouette, just solid-filled (red for USSR, blue for
   modern Russia) with a small national flag icon placed on the landmass.
   This directly contradicts our abstract-polygon map assets and is almost
   certainly the main source of "the designs aren't clear enough" -- our
   maps don't read as any specific place. **Action: redraw all 3 maps as
   actually recognizable silhouettes.**
2. **Typography is a rounded, informal, hand-drawn-adjacent display font**
   (dialogue/exclamation text like "WHAT?!"), not a clean geometric
   corporate sans -- bold, slightly wobbly, comic-lettering quality. Outline
   color flips with context: white fill + black outline on dark backgrounds,
   black (or dark) fill + light outline on pale backgrounds -- always
   high-contrast, never a flat unoutlined color. We don't have a matching
   font file available without adding an external/network font-loading
   dependency (risk: another render-time failure, this session already hit
   one real crash from an ambitious change) -- **kept the system bold
   sans-serif + thick stroke technique as a pragmatic approximation** rather
   than risk the render pipeline on a Google Fonts fetch.
3. **Backgrounds have visible texture/grain**, not perfectly flat fills --
   a worn brick/sandbag trench wall, a rippling fabric-fold texture behind a
   poster-style portrait. Flat SVG fills read as flatter/blanker than the
   reference by comparison.
4. **Dramatic character/topic introductions use bold 2-tone poster-style
   silhouette art** (the Lenin portrait: cream + near-black, high contrast,
   propaganda-poster quality) over a solid/textured color field. Not
   reused here -- the prior rework explicitly removed human-character art per
   the user's instruction, and a silhouette portrait would reintroduce a
   human figure; the *technique* (bold 2-tone silhouette icon over a
   textured color field) is applied to non-human icons instead where it fits.
5. Small, plain, unnamed "generic figure" characters (a featureless white
   blob-person with two dot eyes) do still appear in wide shots. **Update:**
   the user explicitly asked to add these back in -- built as `stickFigure()`
   in render-assets.mjs (round head, two dot eyes, no other facial detail,
   thin single-line body/limbs, optional walking pose) and baked into
   `ministry-document-icon`, `whiteboard-icon`, `refinery-icon`,
   `mountain-pass-mine`, and `product-silhouettes` for human scale/presence.
   Deliberately far simpler than the removed export-official/narrator-analyst
   art -- no name, no dialogue, no mouth/viseme state -- so this doesn't
   reverse the "no talking-mouth characters" decision, just adds the
   reference's plain-figure technique on top of it.

### What this changes in our recipe

- `voxTheme.ts` / `VoxOverlays.tsx` / `VoxCaptions.tsx`: rebuilt around
  cream/white-default cards with black bold-outlined text, reserving the deep
  red / navy tones for the chapter-card and end-card dramatic beats rather
  than as the constant background. See the components themselves for the
  updated token set.
- The 3 base maps (`world-map-base`, `china-map-base`, `us-map-base`) are
  redrawn with actually recognizable continent/country silhouettes (real
  proportions, not random polygons) and recolored per the bloc technique:
  **China in the accent color, the rest of the map in a neutral tone** — the
  closest fit for our "China vs. the rest of the world's supply chain"
  throughline, adapted from the reference's "communist bloc vs. the rest"
  coloring.
- No further character-asset changes — the reference confirms small-icon-
  scale characters are the right call, and we've already removed all human
  characters per the prior rework.
- Real archival-photo mixing isn't reproducible in this pipeline (no source
  photography, no compositing input) — noted as an unavailable technique
  rather than attempted.
- **Texture pass** (finding #3): every generated asset now carries a paper-
  grain noise overlay + soft edge vignette (SVG feTurbulence in
  render-assets.mjs's shared shell), grounding shadows under objects, and
  cloud puffs on outdoor establishing shots — flat fills no longer read
  blanker than the reference.
- **Animation pass**: map pins drop in with a springy overshoot (staggered
  per pin), the stamp impact gets a decaying camera shake + expanding impact
  ring + comic slam-in label, TextCard slams in oversized/tilted and settles,
  PriceSpikeChart's line carries a pulsing tip dot as it draws on,
  DialogueCards bubbles slide up like landing messages, and LoopedIdle adds a
  slow ambient bob (with a 1.03 overscan so edges never show).
