import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

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

  return (
    <AbsoluteFill style={{background: '#0d1420', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={40} y1={370} x2={860} y2={370} stroke="#334155" strokeWidth={2} />
        <line x1={40} y1={20} x2={40} y2={370} stroke="#334155" strokeWidth={2} />
        <path
          d={pathD}
          fill="none"
          stroke="#e0553f"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={2000}
          strokeDashoffset={2000 * (1 - progress)}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 90,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: 900,
          fontSize: 88,
          color: '#f2d998',
          opacity: interpolate(progress, [0.6, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        {multiplierLabel}
      </div>
    </AbsoluteFill>
  );
};
