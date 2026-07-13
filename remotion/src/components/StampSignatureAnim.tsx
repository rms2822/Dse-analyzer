import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {VOX} from '../voxTheme';

// The throughline metaphor's payoff, built as pure Remotion motion graphic --
// no generated image, per asset-library.json (stamp-signature-anim is listed
// under motion_graphics_no_generation_needed). Three variants inferred from
// the shot's overlay note: a stamp coming down with a word, a stamp withheld/
// hovering (China "not needing" to act), and a neutral idle version.
export const StampSignatureAnim: React.FC<{
  durationInFrames: number;
  variant?: 'down' | 'withheld' | 'idle';
  label?: string;
}> = ({durationInFrames, variant = 'idle', label = 'RESTRICTED'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const impactFrame = Math.min(18, Math.round(durationInFrames * 0.4));
  const stampY =
    variant === 'withheld'
      ? -40 + Math.sin(frame / 14) * 6 // hovers, never lands
      : spring({frame, fps, config: {damping: 10, stiffness: 220, mass: 0.7}, durationInFrames: impactFrame}) * 140 -
        140;

  const impacted = variant !== 'withheld' && frame >= impactFrame;
  const shake = impacted && frame < impactFrame + 4 ? (impactFrame + 4 - frame) * 1.5 : 0;

  const labelOpacity = interpolate(frame, [impactFrame, impactFrame + 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{background: '#e9e4d8', alignItems: 'center', justifyContent: 'center'}}>
      {/* the form/desk */}
      <div
        style={{
          width: 520,
          height: 340,
          background: '#faf7ee',
          border: '3px solid #55524a',
          borderRadius: 6,
          boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {variant !== 'withheld' && impacted && (
          <div
            style={{
              opacity: labelOpacity,
              fontFamily: VOX.font,
              fontWeight: 900,
              fontSize: 46,
              color: VOX.red,
              border: `6px solid ${VOX.red}`,
              padding: '10px 26px',
              transform: 'rotate(-8deg)',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {label}
          </div>
        )}
      </div>

      {/* the stamp itself */}
      <div
        style={{
          position: 'absolute',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #6b4a2e, #3c2a19)',
          border: '6px solid #241a10',
          transform: `translateY(${stampY - 260}px) translateX(${shake}px)`,
          boxShadow: '0 12px 20px rgba(0,0,0,0.3)',
        }}
      />
    </AbsoluteFill>
  );
};
