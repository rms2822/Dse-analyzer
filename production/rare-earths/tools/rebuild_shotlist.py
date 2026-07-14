#!/usr/bin/env python3
"""Rework the rare-earths shotlist: remove every human-character shot
(export-official / narrator-analyst / factory-worker-lineup / deng-era-figure
/ mountain-pass-worker-1980s / factory-manager, and the TalkingCharacter /
SplitPhoneCall techniques that animated them) and replace with infographic
techniques already built for this project (maps+pins, whiteboard reveals,
stat overlays, a new flow diagram, and two new pure-code components:
TextCard for quotes/statements, DialogueCards for the phone-call exchange).

Also raises the cut rate: every remaining plain KenBurns/LoopedIdle shot over
5.5s gets split into two shots (alternating Ken Burns corner, or switching
LoopedIdle->KenBurns on the second half) so the same footage produces a real
visual change at the new cut point, per STYLE_GUIDE.md's template-reuse
technique -- not because the underlying art changed.

Run from repo root: python3 production/rare-earths/tools/rebuild_shotlist.py
"""
import json
import copy

SRC = 'remotion/src/data/rare-earths/shotlist.json'
DEST_PROD = 'production/rare-earths/shotlist.json'
DEST_REMOTION = 'remotion/src/data/rare-earths/shotlist.json'

CORNERS = ['tl', 'tr', 'bl', 'br']

with open(SRC) as f:
    data = json.load(f)
scenes = data['scenes']
by_id = {s['id']: s for s in scenes}

# ---------------------------------------------------------------- manual --
# id -> list of replacement scenes (1 entry = simple reassignment, 2-3 = a
# split). Each replacement omits id/start/end/text -- those are filled in
# from the original scene (split evenly in time for multi-entry lists).
MANUAL = {
    1: [
        {'technique': 'LoopedIdle', 'asset': 'ministry-document-icon'},
    ],
    10: [
        {'technique': 'KenBurns', 'asset': 'stamp-signature-anim',
         'overlay': {'note': 'withheld', 'label': 'STOPPED'}},
        {'technique': 'KenBurns', 'asset': 'product-silhouettes'},
    ],
    11: [
        {'technique': 'ProgressiveReveal', 'asset': 'product-silhouettes',
         'overlay': {'pins': ['PHONES', 'TURBINES']}},
    ],
    16: [
        {'technique': 'ProgressiveReveal', 'asset': 'whiteboard-icon',
         'overlay': {'pins': ['THE STAMP']}},
        {'technique': 'ProgressiveReveal', 'asset': 'whiteboard-icon',
         'overlay': {'pins': ['CLEANEST TECH', 'DIRTIEST INDUSTRY']}},
        {'technique': 'KenBurns', 'asset': 'china-map-base'},
    ],
    34: [
        {'technique': 'KenBurns', 'asset': 'world-map-base', 'variant': 'M',
         'overlay': {'pin': 'MICHIGAN, US'}},
    ],
    35: [
        {'technique': 'KenBurns', 'asset': 'world-map-base', 'variant': 'M',
         'overlay': {'pin': 'SAO PAULO, BR'}},
    ],
    36: [
        {'technique': 'KenBurns', 'asset': 'product-silhouettes'},
    ],
    39: [
        {'technique': 'KenBurns', 'asset': 'china-map-base', 'variant': 'M',
         'overlay': {'pin': 'SOUTHERN CHINA'}},
    ],
    40: [
        {'technique': 'LoopedIdle', 'asset': 'china-map-base'},
    ],
    41: [
        {'technique': 'KenBurns', 'asset': 'text-card',
         'overlay': {'variant': 'quote', 'attribution': 'DENG XIAOPING, 1992'}},
    ],
    45: [
        {'technique': 'KenBurns', 'asset': 'mountain-pass-mine', 'variant': 'M',
         'overlay': {'label': '~100% SUPPLY, 1965-1985'}},
    ],
    66: [
        {'technique': 'KenBurns', 'asset': 'text-card',
         'overlay': {'variant': 'statement'}},
    ],
    67: [
        {'technique': 'KenBurns', 'asset': 'supply-chain-flow', 'variant': 'M',
         'overlay': {'label': 'THE BOTTLENECK'}},
    ],
    78: [
        {'technique': 'DialogueCards', 'asset': 'dialogue-cards',
         'overlay': {'pane': 'A'}},
    ],
    79: [
        {'technique': 'DialogueCards', 'asset': 'dialogue-cards',
         'overlay': {'pane': 'B'}},
    ],
    80: [
        {'technique': 'DialogueCards', 'asset': 'dialogue-cards',
         'overlay': {'pane': 'A'}},
    ],
    81: [
        {'technique': 'DialogueCards', 'asset': 'dialogue-cards',
         'overlay': {'pane': 'B'}},
    ],
    82: [
        {'technique': 'KenBurns', 'asset': 'text-card',
         'overlay': {'variant': 'statement'}},
    ],
    90: [
        {'technique': 'KenBurns', 'asset': 'text-card',
         'overlay': {'variant': 'statement'}},
    ],
    100: [
        {'technique': 'KenBurns', 'asset': 'text-card',
         'overlay': {'variant': 'statement'}},
    ],
}

# speaker field: DialogueCards needs to know who's talking even though the
# image asset is gone -- keep the original scene's speaker/text for that.
KEEP_SPEAKER_IDS = {78, 79, 80, 81}

STATIC_IMAGE_ASSETS = {
    'world-map-base', 'china-map-base', 'us-map-base', 'ore-rock-icon',
    'periodic-table-strip', 'magnet-icon', 'refinery-icon',
    'mountain-pass-mine', 'product-silhouettes', 'ministry-document-icon',
    'whiteboard-icon', 'supply-chain-flow',
}
SPLIT_THRESHOLD = 5.5

new_scenes = []
next_id = 1


def emit(base_scene, technique, asset, overlay=None, speaker=None, start=None, end=None, variant=None):
    global next_id
    s = {
        'id': next_id,
        'start': round(start if start is not None else base_scene['start'], 3),
        'end': round(end if end is not None else base_scene['end'], 3),
        'chapter': base_scene['chapter'],
        'text': base_scene['text'],
        'asset': asset,
        'variant': variant if variant is not None else base_scene.get('variant', 'A'),
        'technique': technique,
    }
    if overlay:
        s['overlay'] = overlay
    if speaker:
        s['speaker'] = speaker
    new_scenes.append(s)
    next_id += 1


for scene in scenes:
    sid = scene['id']

    if sid in MANUAL:
        replacements = MANUAL[sid]
        n = len(replacements)
        span = scene['end'] - scene['start']
        for i, r in enumerate(replacements):
            seg_start = scene['start'] + span * i / n
            seg_end = scene['start'] + span * (i + 1) / n
            speaker = scene.get('speaker') if sid in KEEP_SPEAKER_IDS else None
            emit(scene, r['technique'], r['asset'], r.get('overlay'), speaker,
                 seg_start, seg_end, r.get('variant'))
        continue

    dur = scene['end'] - scene['start']
    technique = scene.get('technique', 'KenBurns')
    if technique in ('KenBurns', 'LoopedIdle') and scene['asset'] in STATIC_IMAGE_ASSETS and dur > SPLIT_THRESHOLD:
        mid = scene['start'] + dur / 2
        first_corner = CORNERS[scene['id'] % len(CORNERS)]
        second_corner = CORNERS[(scene['id'] + 2) % len(CORNERS)]
        overlay = dict(scene.get('overlay', {}))
        emit(scene, 'KenBurns' if technique == 'LoopedIdle' else technique,
             scene['asset'], overlay or None, None, scene['start'], mid)
        new_scenes[-1]['_corner'] = first_corner
        second_technique = 'KenBurns' if technique == 'LoopedIdle' else technique
        emit(scene, second_technique, scene['asset'], overlay or None, None, mid, scene['end'])
        new_scenes[-1]['_corner'] = second_corner
        continue

    # unchanged
    emit(scene, technique, scene['asset'], scene.get('overlay'), scene.get('speaker'),
         scene['start'], scene['end'])

# drop the internal _corner marker (KenBurns already derives corner from id
# deterministically in RareEarthsVideo.tsx; marker was only for readability
# during generation)
for s in new_scenes:
    s.pop('_corner', None)

data['scenes'] = new_scenes
data['_comment'] = (
    data.get('_comment', '') +
    ' -- Reworked to remove all human-character art/techniques '
    '(export-official/narrator-analyst/factory-worker-lineup/'
    'deng-era-figure/mountain-pass-worker-1980s/factory-manager, '
    'TalkingCharacter/SplitPhoneCall) in favor of infographic techniques '
    '(maps+pins, whiteboard reveals, stat overlays, TextCard, DialogueCards, '
    'a new supply-chain-flow diagram), and to raise cut rate by splitting '
    'long plain KenBurns/LoopedIdle holds.'
)

total_dur = new_scenes[-1]['end']
print(f'scenes: {len(scenes)} -> {len(new_scenes)}')
print(f'duration: {total_dur:.1f}s')
print(f'cuts/min: {len(new_scenes) / (total_dur / 60):.2f}')

with open(DEST_PROD, 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
with open(DEST_REMOTION, 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
print('wrote', DEST_PROD, 'and', DEST_REMOTION)
