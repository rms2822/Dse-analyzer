import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';

// Locked-off camera + a small continuously-looping secondary motion (a flag
// wave, drifting clouds, a pin bob) -- per STYLE_GUIDE.md's measured animation
// techniques, this is the dominant treatment for "planted" symbolic shots and
// map-pin idle life, distinct from Ken Burns (which moves the camera instead).
// The loop period is intentionally NOT tied to durationInFrames, so it reads
// as ambient/continuous rather than a one-shot animation timed to the cut.
export const LoopedIdle: React.FC<{
  src: string;
  loopSeconds?: number; // one full wobble cycle
  amplitudeDeg?: number; // rotation amplitude
  amplitudeScale?: number; // scale pulse amplitude, e.g. 0.01 = +/-1%
  bobPx?: number; // vertical bob amplitude -- gentle breathing lift
  fps?: number;
}> = ({src, loopSeconds = 3.2, amplitudeDeg = 1.1, amplitudeScale = 0.012, bobPx = 5, fps = 30}) => {
  const frame = useCurrentFrame();
  const period = loopSeconds * fps;
  const phase = (frame / period) * Math.PI * 2;
  const rotate = Math.sin(phase) * amplitudeDeg;
  // 1.03 base overscan keeps the bob/wobble from ever exposing the frame edge
  const scale = 1.03 + Math.sin(phase * 0.5) * amplitudeScale;
  // offset phase so the bob doesn't sync with the rotation -- reads as
  // ambient drift rather than a mechanical loop
  const bob = Math.sin(phase * 0.8 + 1.3) * bobPx;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translateY(${bob}px) scale(${scale}) rotate(${rotate}deg)`,
          transformOrigin: 'center center',
        }}
      />
    </AbsoluteFill>
  );
};
