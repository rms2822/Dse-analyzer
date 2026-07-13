# ChatGPT image prompts — rare-earths asset library

**Superseded.** The asset library was ultimately produced by
`production/rare-earths/tools/render-assets.mjs` (hand-authored flat-vector
SVG, rasterized headless) rather than through this ChatGPT prompt flow, and
the maps were restyled to the Vox-explainer palette in that pass rather than
the cream/green style prompted below. Left in place as prompt reference in
case any asset needs a redo via image generation instead of code.

---

15 assets, in the order they first appear in `shotlist.json` (generate in this
order — catches a mismatched/wrong-looking asset early instead of after
you've made 10 more). Each combines that asset's `asset-library.json`
description with one of the two style suffixes from
`production/strait-of-hormuz-reference/STYLE_GUIDE.md`. Paste each prompt
into ChatGPT image generation as its own message.

**For the 3 assets with mouth/blink layers** (export-official, narrator-analyst,
factory-manager): generate the base pose first, then — **in that same
ChatGPT conversation thread**, not a new one — ask it to edit/vary that exact
image for each additional layer (e.g. "same character, same pose and
background, but mouth open as if mid-sentence" / "...eyes closed, blinking").
Staying in one thread lets ChatGPT reference the actual image instead of
re-imagining the character from text alone, which is what keeps the 4 layers
looking like the same person. Generating all 4 from 4 independent prompts in
separate threads will almost certainly drift.

**When each comes back**: save it as the exact filename listed, at
`remotion/public/images/rare-earths/<filename>`, replacing the placeholder.
Send it to me (or drop it directly in the repo) and I'll check it against how
that asset is actually used in `shotlist.json` before we move to the next one.

---

## 1. export-official (character, 4 layers)
*Used: Opening cold open, THE TRAP export-office scene, SplitPhoneCall pane B*

**Base** → `export-official-base.png`
```
flat 2D vector Chinese ministry export-control clerk at a desk, holding a
stamp and a paper form, plain office background, flat 2D vector cartoon
illustration, South-Park-style simplified character design, big rounded
head, minimal facial detail, thick clean black outlines, flat solid color
fills with no gradients or shading, plain flat-color background, no text,
no watermark, no logo, 16:9.
```
**Then, same thread:**
- `mouth_open` → "Same character, same pose, same background — but mouth open as if mid-sentence." → `export-official-mouth-open.png`
- `mouth_closed` → "Same character again, mouth fully closed/neutral." → `export-official-mouth-closed.png`
- `blink` → "Same character again, eyes closed as if mid-blink." → `export-official-blink.png`

## 2. product-silhouettes (icon)
*Used: Opening scale montage, THE RECIPE dependency beat*
```
flat vector icon set: EV motor cutaway, wind turbine, MRI machine, fighter
jet, smartphone -- simple single-color silhouettes on transparent
background, one image with 5 sub-icons to crop from, flat 2D vector
infographic illustration, simple flat color shapes, thin clean outlines,
minimal detail, bright saturated flat color palette, no gradients, no text
unless specified, 16:9.
```
→ `product-silhouettes.png`

## 3. china-map-base (map)
*Used: THE RECIPE refining-share beat, THE TRAP export-control beat*
```
flat vector map of China with neighboring countries in pale outline, no
labels baked in, flat 2D vector infographic illustration, simple flat color
shapes, thin clean outlines, minimal detail, bright saturated flat color
palette, no gradients, no text unless specified, 16:9.
```
→ `china-map-base.png`

## 4. world-map-base (map)
*Used: Opening scale montage, THE CLOCK global price-spike beat*
```
flat vector world map, green continents, white ocean, thin gray borders, no
labels baked in, flat 2D vector infographic illustration, simple flat color
shapes, thin clean outlines, minimal detail, bright saturated flat color
palette, no gradients, no text unless specified, 16:9.
```
→ `world-map-base.png`

## 5. narrator-analyst (character, 4 layers)
*Used: THE RECIPE whiteboard/periodic-table reveal, chapter-card companion shots*

**Base** → `narrator-analyst-base.png`
```
flat 2D vector trenchcoat-and-fedora narrator-proxy figure standing beside a
blank whiteboard, flat 2D vector cartoon illustration, South-Park-style
simplified character design, big rounded head, minimal facial detail, thick
clean black outlines, flat solid color fills with no gradients or shading,
plain flat-color background, no text, no watermark, no logo, 16:9.
```
**Then, same thread:**
- `mouth_open` → "Same character, same pose, same background — mouth open as if mid-sentence." → `narrator-analyst-mouth-open.png`
- `mouth_closed` → "Same character again, mouth fully closed/neutral." → `narrator-analyst-mouth-closed.png`
- `blink` → "Same character again, eyes closed as if mid-blink." → `narrator-analyst-blink.png`

## 6. ore-rock-icon (icon)
*Used: THE RECIPE "digging is the easy part" beat*
```
flat vector raw ore rock chunk, simple faceted shape with a subtle
mixed-mineral color pattern, flat 2D vector infographic illustration, simple
flat color shapes, thin clean outlines, minimal detail, bright saturated
flat color palette, no gradients, no text unless specified, 16:9.
```
→ `ore-rock-icon.png`

## 7. periodic-table-strip (icon)
*Used: THE RECIPE "17 elements" beat*
```
flat vector isolated lanthanide row of the periodic table, 17 plain element
tiles, no chemical symbols needed at establishing distance, flat 2D vector
infographic illustration, simple flat color shapes, thin clean outlines,
minimal detail, bright saturated flat color palette, no gradients, no text
unless specified, 16:9.
```
→ `periodic-table-strip.png`

## 8. refinery-icon (establishing)
*Used: THE RECIPE refining beat, THE TRAP refining-bottleneck beat*
```
flat vector industrial chemical-refining plant illustration, tanks and
pipes, workers in hard hats and hi-vis for scale, flat 2D vector infographic
illustration, simple flat color shapes, thin clean outlines, minimal detail,
bright saturated flat color palette, no gradients, no text unless specified,
16:9.
```
→ `refinery-icon.png`

## 9. magnet-icon (icon)
*Used: every "this contains rare earths" callout across all chapters*
```
flat vector stylized sintered permanent magnet icon (simple horseshoe/block
shape), single reusable glyph, flat 2D vector infographic illustration,
simple flat color shapes, thin clean outlines, minimal detail, bright
saturated flat color palette, no gradients, no text unless specified, 16:9.
```
→ `magnet-icon.png`

## 10. factory-worker-lineup (character, single pose)
*Used: THE RECIPE "autoworker in Michigan..." beat*
```
flat 2D vector lineup of three ordinary workers in different national dress
(US autoworker in coveralls, European wind-turbine technician in hi-vis,
South American hospital technician in scrubs), plain background, flat 2D
vector cartoon illustration, South-Park-style simplified character design,
big rounded head, minimal facial detail, thick clean black outlines, flat
solid color fills with no gradients or shading, plain flat-color background,
no text, no watermark, no logo, 16:9.
```
→ `factory-worker-lineup.png`

## 11. deng-era-figure (character, single pose)
*Used: THE GRUDGE 1992 quote beat*
```
flat 2D vector 1990s-era Chinese official in a plain suit, mid-speech pose,
outdoor tour setting, muted period color palette, flat 2D vector cartoon
illustration, South-Park-style simplified character design, big rounded
head, minimal facial detail, thick clean black outlines, flat solid color
fills with no gradients or shading, plain flat-color background, no text, no
watermark, no logo, 16:9.
```
→ `deng-era-figure.png`

## 12. us-map-base (map)
*Used: THE GRUDGE Mountain Pass beat*
```
flat vector map of the continental United States with California region
distinguishable, no labels baked in, flat 2D vector infographic
illustration, simple flat color shapes, thin clean outlines, minimal
detail, bright saturated flat color palette, no gradients, no text unless
specified, 16:9.
```
→ `us-map-base.png`

## 13. mountain-pass-mine (establishing — reused 3x across eras)
*Used: THE GRUDGE boom/bust/reopen beats (SAME image reused with a color-grade dressing per era in Remotion — don't generate 3 versions)*
```
flat vector open-pit mine illustration, California desert setting, wide
establishing shot, flat 2D vector infographic illustration, simple flat
color shapes, thin clean outlines, minimal detail, bright saturated flat
color palette, no gradients, no text unless specified, 16:9.
```
→ `mountain-pass-mine.png`

## 14. mountain-pass-worker-1980s (character, single pose)
*Used: THE GRUDGE Mountain Pass boom beat*
```
flat 2D vector 1980s mining worker in a hardhat beside period-appropriate
mining equipment, desert background, flat 2D vector cartoon illustration,
South-Park-style simplified character design, big rounded head, minimal
facial detail, thick clean black outlines, flat solid color fills with no
gradients or shading, plain flat-color background, no text, no watermark, no
logo, 16:9.
```
→ `mountain-pass-worker-1980s.png`

## 15. factory-manager (character, 3 layers — no blink)
*Used: THE TRAP SplitPhoneCall pane A*

**Base** → `factory-manager-base.png`
```
flat 2D vector factory manager at a desk on the phone, warehouse visible
through a window behind, flat 2D vector cartoon illustration, South-Park-
style simplified character design, big rounded head, minimal facial detail,
thick clean black outlines, flat solid color fills with no gradients or
shading, plain flat-color background, no text, no watermark, no logo, 16:9.
```
**Then, same thread:**
- `mouth_open` → "Same character, same pose, same background — mouth open as if mid-sentence." → `factory-manager-mouth-open.png`
- `mouth_closed` → "Same character again, mouth fully closed/neutral." → `factory-manager-mouth-closed.png`

---

## Checklist

- [ ] 1. export-official (base + 3 layers)
- [ ] 2. product-silhouettes
- [ ] 3. china-map-base
- [ ] 4. world-map-base
- [ ] 5. narrator-analyst (base + 3 layers)
- [ ] 6. ore-rock-icon
- [ ] 7. periodic-table-strip
- [ ] 8. refinery-icon
- [ ] 9. magnet-icon
- [ ] 10. factory-worker-lineup
- [ ] 11. deng-era-figure
- [ ] 12. us-map-base
- [ ] 13. mountain-pass-mine
- [ ] 14. mountain-pass-worker-1980s
- [ ] 15. factory-manager (base + 2 layers)
