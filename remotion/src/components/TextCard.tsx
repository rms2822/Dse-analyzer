import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {VOX} from '../voxTheme';

// Pure motion graphic (no generated image, per asset-library.json's
// motion_graphics_no_generation_needed) replacing the deng-era-figure quote
// beat and narrator-analyst's direct-address statement beats -- no character,
// just Vox-styled type. 'quote' adds a big quotation-mark glyph + attribution
// chip; 'statement' is a bold centered line on its own.
export const TextCard: React.FC<{
  durationInFrames: number;
  variant: 'quote' | 'statement';
  text: string;
  attribution?: string;
}> = ({durationInFrames, variant, text, attribution}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 200}});
  const outOpacity = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(pop, outOpacity);

  return (
    <AbsoluteFill style={{background: VOX.ink, alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          opacity,
          transform: `scale(${0.94 + pop * 0.06})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          maxWidth: '78%',
        }}
      >
        {variant === 'quote' && (
          <div style={{fontFamily: VOX.font, fontSize: 160, fontWeight: 900, color: VOX.red, lineHeight: 0.5}}>
            &ldquo;
          </div>
        )}
        <div
          style={{
            fontFamily: VOX.font,
            fontSize: variant === 'quote' ? 58 : 66,
            fontWeight: 900,
            color: VOX.white,
            textAlign: 'center',
            lineHeight: 1.25,
          }}
        >
          {text.trim()}
        </div>
        {attribution && (
          <div style={{background: VOX.yellow, padding: '10px 26px', marginTop: 8}}>
            <div style={{fontFamily: VOX.font, fontSize: 24, fontWeight: 800, color: VOX.ink, letterSpacing: 1}}>
              {attribution}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
