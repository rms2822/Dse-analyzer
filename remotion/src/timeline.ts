import shotlist from './data/shotlist.json';
import overlays from './data/overlays.json';

export const FPS = 30;
const TAIL_SECONDS = 0.5;
export const OVERLAP_SECONDS = overlays.crossfadeSeconds ?? 0.4;
export const OVERLAP_FRAMES = Math.round(OVERLAP_SECONDS * FPS);

type Scene = (typeof shotlist.scenes)[number];

export type TimelineItem =
  | {kind: 'scene'; scene: Scene; start: number; coverageEnd: number}
  | {kind: 'endcard'; start: number; coverageEnd: number};

// Each scene's on-screen hold is extended to the next scene's start (instead of
// stopping at its own dialogue end), so the natural pauses between sentences don't
// leave a gap where nothing is rendered — that gap was the cause of the black-screen
// flashes at almost every cut. A trailing end card is appended as the final item so
// it also gets a crossfade in like everything else.
export function buildTimeline(): TimelineItem[] {
  const scenes = shotlist.scenes;
  const items: TimelineItem[] = scenes.map((scene, i) => {
    const coverageEnd = i < scenes.length - 1 ? scenes[i + 1].start : scene.end + TAIL_SECONDS;
    return {kind: 'scene', scene, start: scene.start, coverageEnd};
  });
  const last = items[items.length - 1];
  items.push({
    kind: 'endcard',
    start: last.coverageEnd,
    coverageEnd: last.coverageEnd + overlays.endCard.durationSeconds,
  });
  return items;
}

// Sequence bounds for a timeline item: padded by OVERLAP_FRAMES on each internal
// edge (not at the very start/end of the whole video) so SceneFade has room to
// crossfade while the item's *nominal* start stays fixed — this is what keeps
// narration/captions in sync despite the added crossfades.
export function frameRangeFor(item: TimelineItem, index: number, total: number) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const seqFrom = Math.round(item.start * FPS) - (isFirst ? 0 : OVERLAP_FRAMES);
  const seqDuration =
    Math.round((item.coverageEnd - item.start) * FPS) +
    (isFirst ? 0 : OVERLAP_FRAMES) +
    (isLast ? 0 : OVERLAP_FRAMES);
  return {seqFrom, seqDuration, isFirst, isLast};
}

export function totalDurationInFrames(): number {
  const items = buildTimeline();
  const last = items[items.length - 1];
  const {seqFrom, seqDuration} = frameRangeFor(last, items.length - 1, items.length);
  return seqFrom + seqDuration;
}
