import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {VOX} from '../voxTheme';

// Pure motion graphic (no generated image, per asset-library.json), mirrors
// the Hormuz reference's fuel-reserve gauge for a rising-stat beat -- an
// animated line climbing sharply, paired with a big multiplier readout.
export const PriceSpikeChart: React.FC<{
  durationInFrames: number;
  multiplierLabel?: string;
}> = ({durationInFrames, multiplierLabel = '6x'}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames * 0.75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const W = 900;
  const H = 420;
  const points: [number, number][] = [
    [40, 340],
    [220, 320],
    [400, 300],
    [560, 200],
    [720, 90],
    [860, 40],
  ];
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  // position of the line's leading tip at the current progress, so a marker
  // dot can ride the line as it draws on
  const segLens = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  const totalLen = segLens.reduce((a, b) => a + b, 0);
  let remaining = progress * totalLen;
  let tip = points[0];
  for (let i = 0; i < segLens.length; i++) {
    if (remaining <= segLens[i]) {
      const t = segLens[i] === 0 ? 0 : remaining / segLens[i];
      tip = [
        points[i][0] + (points[i + 1][0] - points[i][0]) * t,
        points[i][1] + (points[i + 1][1] - points[i][1]) * t,
      ];
      break;
    }
    remaining -= segLens[i];
    tip = points[i + 1];
  }
  const tipPulse = 1 + 0.25 * Math.sin(frame / 3);

  return (
    <AbsoluteFill style={{background: VOX.ink, alignItems: 'center', justifyContent: 'center'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={40} y1={370} x2={860} y2={370} stroke={VOX.gray} strokeWidth={2} />
        <line x1={40} y1={20} x2={40} y2={370} stroke={VOX.gray} strokeWidth={2} />
        <path
          d={pathD}
          fill="none"
          stroke={VOX.red}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={2000}
          strokeDashoffset={2000 * (1 - progress)}
        />
        <circle cx={tip[0]} cy={tip[1]} r={16 * tipPulse} fill={VOX.red} opacity={0.25} />
        <circle cx={tip[0]} cy={tip[1]} r={9} fill={VOX.red} stroke={VOX.white} strokeWidth={3} />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 90,
          fontFamily: VOX.font,
          fontWeight: 900,
          fontSize: 88,
          color: VOX.gold,
          opacity: interpolate(progress, [0.6, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        {multiplierLabel}
      </div>
    </AbsoluteFill>
  );
};
