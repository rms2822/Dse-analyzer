import {useCurrentFrame, useVideoConfig} from 'remotion';

// Finds the active item (by absolute start/end seconds) for the current frame, plus
// a 0..1 progress value through that item's window — used by all overlay layers
// (chapter cards, stat callouts, lower thirds, map pings, kinetic lines).
export function useActiveWindow<T extends {start: number; end: number}>(
  items: T[],
): {item: T; progress: number; localSeconds: number} | null {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const item = items.find((i) => t >= i.start && t < i.end);
  if (!item) return null;

  const localSeconds = t - item.start;
  const progress = localSeconds / (item.end - item.start);
  return {item, progress, localSeconds};
}
