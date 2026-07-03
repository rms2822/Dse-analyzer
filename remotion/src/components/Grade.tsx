import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';

// Unifies illustration + painterly + photo assets into one look, per STYLE_GUIDE.md:
// desaturated teal-shadow/amber-highlight split tone, soft vignette, light film grain.
export const Grade: React.FC = () => {
  const frame = useCurrentFrame();
  // Cycle through a handful of grain offsets so the noise flickers subtly
  // instead of being a static, obviously-repeating overlay.
  const grainSeed = Math.floor(frame / 2);
  const grainX = random(`grain-x-${grainSeed}`) * 200;
  const grainY = random(`grain-y-${grainSeed}`) * 200;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* split-tone color grade */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(135deg, rgba(20,40,50,0.18) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 55%, rgba(90,60,20,0.14) 100%)',
          mixBlendMode: 'overlay',
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 320px 60px rgba(0,0,0,0.55)',
        }}
      />
      {/* film grain */}
      <AbsoluteFill
        style={{
          opacity: 0.06,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundPosition: `${grainX}px ${grainY}px`,
          backgroundSize: '200px 200px',
        }}
      />
    </AbsoluteFill>
  );
};
