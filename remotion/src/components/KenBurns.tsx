import React from 'react';
import {Img, interpolate, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

type Corner = 'tl' | 'tr' | 'bl' | 'br' | 'center';

const CORNER_OFFSETS: Record<Corner, {x: number; y: number}> = {
  tl: {x: -1, y: -1},
  tr: {x: 1, y: -1},
  bl: {x: -1, y: 1},
  br: {x: 1, y: 1},
  center: {x: 0, y: 0},
};

export const KenBurns: React.FC<{
  src: string;
  durationInFrames: number;
  corner?: Corner;
  zoomTo?: number; // final scale, e.g. 1.12
  panPercent?: number; // how far to drift toward the corner, in % of frame
}> = ({src, durationInFrames, corner = 'center', zoomTo = 1.12, panPercent = 3}) => {
  const frame = useCurrentFrame();
  const offset = CORNER_OFFSETS[corner];

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.bezier(0.33, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(progress, [0, 1], [1, zoomTo]);
  const translateX = interpolate(progress, [0, 1], [0, offset.x * panPercent]);
  const translateY = interpolate(progress, [0, 1], [0, offset.y * panPercent]);

  return (
    <div style={{width: '100%', height: '100%', overflow: 'hidden', position: 'absolute'}}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
};
