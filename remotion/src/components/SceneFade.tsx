import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

// Wraps a scene's content so consecutive Sequences crossfade instead of hard-cutting.
// The parent Sequence must be `overlapFrames` longer than the scene's true coverage
// on both ends (start earlier / end later) so the fade has room to happen while the
// *absolute* frame position of the scene's nominal start/end stays fixed — this is
// what keeps narration captions in sync even though the visuals now overlap.
export const SceneFade: React.FC<{
  durationInFrames: number;
  overlapFrames: number;
  isFirst?: boolean;
  isLast?: boolean;
  children: React.ReactNode;
}> = ({durationInFrames, overlapFrames, isFirst, isLast, children}) => {
  const frame = useCurrentFrame();

  // Computed as two independent fades (rather than one combined interpolate) so the
  // first/last items — which skip one side entirely — never produce a degenerate,
  // non-increasing input range.
  const fadeInOpacity = isFirst
    ? 1
    : interpolate(frame, [0, overlapFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  const fadeOutOpacity = isLast
    ? 1
    : interpolate(frame, [durationInFrames - overlapFrames, durationInFrames], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  const opacity = Math.min(fadeInOpacity, fadeOutOpacity);

  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};
