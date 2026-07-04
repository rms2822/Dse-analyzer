import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const gradeBg = '#0b0d10';

// Scene 4: dark UAE-region map with a cluster of pulsing "FREE ZONE" markers.
export const FreeZonesMap: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.12], {extrapolateRight: 'clamp'});
  const markers = [
    {x: 540, y: 640, label: 'FREE ZONE', delay: 0},
    {x: 660, y: 760, label: 'FREE ZONE', delay: 10},
    {x: 460, y: 820, label: 'FREE ZONE', delay: 20},
    {x: 600, y: 900, label: 'FREE ZONE', delay: 30},
  ];

  return (
    <AbsoluteFill style={{background: gradeBg, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${scale})`}}>
        <svg width={1080} height={1400} viewBox="0 0 1080 1400">
          {/* rough coastline silhouette standing in for a satellite map of the UAE */}
          <path
            d="M300 500 C420 520 500 560 560 640 C640 660 700 720 660 800 C700 860 640 940 560 960 C500 1020 400 1000 360 940 C300 920 280 840 320 780 C280 720 300 620 300 500 Z"
            fill="#173226"
          />
          {markers.map((m, i) => {
            const local = frame - m.delay;
            const pop = interpolate(local, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            const pulse = interpolate(local % 40, [0, 20, 40], [1, 1.3, 1]);
            return (
              <g key={i} opacity={pop}>
                <circle cx={m.x} cy={m.y} r={26 * pulse} fill="none" stroke="#d8a34a" strokeWidth={3} opacity={0.7} />
                <circle cx={m.x} cy={m.y} r={6} fill="#f2d998" />
                <text x={m.x + 34} y={m.y + 6} fill="#f2d998" fontFamily="Arial, sans-serif" fontSize={22} fontWeight={700}>
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: world map centered on Dubai with an expanding flight-radius arc.
export const FlightHubMap: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const radiusProgress = interpolate(frame, [0, durationInFrames * 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const radius = interpolate(radiusProgress, [0, 1], [0, 420]);
  const planeAngle = interpolate(frame, [0, durationInFrames], [0, 300], {extrapolateRight: 'clamp'});
  const cx = 540;
  const cy = 760;
  const planeX = cx + radius * Math.cos((planeAngle * Math.PI) / 180);
  const planeY = cy + radius * 0.6 * Math.sin((planeAngle * Math.PI) / 180);

  return (
    <AbsoluteFill style={{background: gradeBg, alignItems: 'center', justifyContent: 'center'}}>
      <svg width={1080} height={1400} viewBox="0 0 1080 1400">
        {/* faint landmass blobs standing in for continents around the radius */}
        <ellipse cx={540} cy={400} rx={260} ry={120} fill="#1c2a1f" opacity={0.6} />
        <ellipse cx={280} cy={900} rx={180} ry={140} fill="#1c2a1f" opacity={0.6} />
        <ellipse cx={820} cy={950} rx={200} ry={150} fill="#1c2a1f" opacity={0.6} />
        <ellipse cx={780} cy={500} rx={150} ry={110} fill="#1c2a1f" opacity={0.6} />

        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#5fb3e0" strokeWidth={3} opacity={0.6} />
        <circle cx={cx} cy={cy} r={8} fill="#8fd3f4" />
        <circle cx={planeX} cy={planeY} r={7} fill="#f2d998" opacity={radiusProgress} />
      </svg>
    </AbsoluteFill>
  );
};
