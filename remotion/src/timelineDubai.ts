import shotlist from './data/dubai-shotlist.json';
import overlays from './data/dubai-overlays.json';

export const DUBAI_FPS = 30;
const TAIL_SECONDS = 0.5;
export const DUBAI_OVERLAP_SECONDS = overlays.crossfadeSeconds ?? 0.4;
export const DUBAI_OVERLAP_FRAMES = Math.round(DUBAI_OVERLAP_SECONDS * DUBAI_FPS);

type Scene = (typeof shotlist.scenes)[number];

export type DubaiTimelineItem =
  | {kind: 'scene'; scene: Scene; start: number; coverageEnd: number}
  | {kind: 'endcard'; start: number; coverageEnd: number};

// Same approach as timeline.ts: extend each scene's hold to the next scene's start
// (not its own dialogue end) so pauses between sentences don't leave a black gap.
export function buildDubaiTimeline(): DubaiTimelineItem[] {
  const scenes = shotlist.scenes;
  const items: DubaiTimelineItem[] = scenes.map((scene, i) => {
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

export function dubaiFrameRangeFor(item: DubaiTimelineItem, index: number, total: number) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const seqFrom = Math.round(item.start * DUBAI_FPS) - (isFirst ? 0 : DUBAI_OVERLAP_FRAMES);
  const seqDuration =
    Math.round((item.coverageEnd - item.start) * DUBAI_FPS) +
    (isFirst ? 0 : DUBAI_OVERLAP_FRAMES) +
    (isLast ? 0 : DUBAI_OVERLAP_FRAMES);
  return {seqFrom, seqDuration, isFirst, isLast};
}

export function dubaiTotalDurationInFrames(): number {
  const items = buildDubaiTimeline();
  const last = items[items.length - 1];
  const {seqFrom, seqDuration} = dubaiFrameRangeFor(last, items.length - 1, items.length);
  return seqFrom + seqDuration;
}
