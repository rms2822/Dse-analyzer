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

## Next step

Generate the asset library images (per `PLAYBOOK.md` step 4 / the two prompt
templates in the Hormuz `STYLE_GUIDE.md`'s "Recreating this style" section),
one at a time, in the order they first appear in `shotlist.json`.

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
