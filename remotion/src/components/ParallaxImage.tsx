import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame, Easing} from 'remotion';

// Fake 2-layer parallax: the same image is duplicated, each copy masked to a band
// (soft-feathered so there's no seam) and panned/scaled at a different rate, so wide
// establishing shots get real depth instead of a flat single-plane Ken Burns move —
// closer to what the reference video does on its landscape shots.
export const ParallaxImage: React.FC<{
  src: string;
  durationInFrames: number;
}> = ({src, durationInFrames}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.bezier(0.33, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bgScale = interpolate(progress, [0, 1], [1.06, 1.16]);
  const bgY = interpolate(progress, [0, 1], [0, -1.5]);
  const fgScale = interpolate(progress, [0, 1], [1.02, 1.28]);
  const fgY = interpolate(progress, [0, 1], [0, 3.2]);

  const bgMask =
    'linear-gradient(to bottom, black 0%, black 52%, transparent 76%)';
  const fgMask =
    'linear-gradient(to bottom, transparent 0%, transparent 38%, black 60%, black 100%)';

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={src}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${bgScale}) translateY(${bgY}%)`,
          maskImage: bgMask,
          WebkitMaskImage: bgMask,
        }}
      />
      <Img
        src={src}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${fgScale}) translateY(${fgY}%)`,
          maskImage: fgMask,
          WebkitMaskImage: fgMask,
        }}
      />
    </AbsoluteFill>
  );
};
