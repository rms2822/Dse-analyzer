import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {VOX} from '../voxTheme';

// Narration-paced reveal: items appear one at a time, evenly spaced across the
// shot's duration -- per STYLE_GUIDE.md's "progressive on-screen reveal" note
// (the whiteboard-checklist beat, kinetic chapter-title builds). Used here for
// the product-silhouette montages and the multi-pin "three places outside
// China" beat, layered over a base image that gets a mild static hold.
export const ProgressiveReveal: React.FC<{
  src: string;
  durationInFrames: number;
  items: string[];
}> = ({src, durationInFrames, items}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const perItem = durationInFrames / Math.max(items.length, 1);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 28}}>
        {items.map((label, i) => {
          const appearFrame = i * perItem;
          const localFrame = frame - appearFrame;
          if (localFrame < 0) return null;
          const pop = spring({frame: localFrame, fps, config: {damping: 13, stiffness: 150, mass: 0.5}});
          return (
            <div
              key={label + i}
              style={{
                transform: `scale(${0.8 + pop * 0.2})`,
                opacity: pop,
                background: VOX.yellow,
                padding: '14px 28px',
                fontFamily: VOX.font,
                fontSize: 32,
                fontWeight: 900,
                color: VOX.ink,
                textTransform: 'uppercase',
              }}
            >
              {label}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
