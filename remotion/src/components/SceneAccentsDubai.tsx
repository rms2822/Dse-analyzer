import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

const GOLD = '#d8a34a';
const GOLD_BRIGHT = '#f2d998';
const BLUE = '#5fb3e0';

// Shared "chip" container matching the existing StatCallouts/MapPings visual
// language (dark translucent box, gold border) so accents read as one system.
const AccentBox: React.FC<{
  x: number;
  y: number;
  width: number;
  opacity: number;
  children: React.ReactNode;
}> = ({x, y, width, opacity, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      opacity,
      background: 'rgba(10,12,14,0.68)',
      border: `1.5px solid ${GOLD}`,
      borderRadius: 10,
      padding: '14px 18px',
      pointerEvents: 'none',
    }}
  >
    {children}
  </div>
);

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: 18,
  fontWeight: 700,
  color: GOLD_BRIGHT,
  letterSpacing: 1.5,
  marginBottom: 6,
};

// Sample points for a declining/rising trend line, used by scenes 1 and 8.
const TREND_POINTS: [number, number][] = [
  [0, 20],
  [60, 30],
  [120, 46],
  [180, 60],
  [240, 72],
  [300, 82],
];

function trendPath(points: [number, number][], invertY?: boolean): {d: string; length: number} {
  const pts = invertY ? points.map(([x, y]) => [x, 90 - y] as [number, number]) : points;
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  // Rough polyline length approximation (sum of segment lengths) for dash animation.
  let length = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    length += Math.hypot(x1 - x0, y1 - y0);
  }
  return {d, length};
}

function pointAt(points: [number, number][], progress: number, invertY?: boolean): [number, number] {
  const pts = invertY ? points.map(([x, y]) => [x, 90 - y] as [number, number]) : points;
  const t = progress * (pts.length - 1);
  const i = Math.min(Math.floor(t), pts.length - 2);
  const frac = t - i;
  const [x0, y0] = pts[i];
  const [x1, y1] = pts[i + 1];
  return [x0 + (x1 - x0) * frac, y0 + (y1 - y0) * frac];
}

// Scene 1: oil pump hook — declining trend line, reinforces the "<1% OF GDP" stat.
export const OilShareGraph: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames * 0.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const {d, length} = trendPath(TREND_POINTS);
  const [tipX, tipY] = pointAt(TREND_POINTS, progress);
  const pulse = interpolate(frame % 30, [0, 15, 30], [1, 1.4, 1]);

  return (
    <AccentBox x={60} y={1230} width={300} opacity={interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'})}>
      <div style={LABEL_STYLE}>OIL SHARE OF GDP</div>
      <svg width={300} height={90} viewBox="0 0 300 90">
        <path d={d} fill="none" stroke={GOLD} strokeWidth={3} strokeDasharray={length} strokeDashoffset={length * (1 - progress)} />
        <circle cx={tipX} cy={tipY} r={5 * pulse} fill={GOLD_BRIGHT} />
      </svg>
    </AccentBox>
  );
};

// Scene 8: closing bookend — rising trend line, visual payoff to scene 1's decline.
export const NewEconomyGraph: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames * 0.8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const {d, length} = trendPath(TREND_POINTS, true);
  const [tipX, tipY] = pointAt(TREND_POINTS, progress, true);
  const pulse = interpolate(frame % 30, [0, 15, 30], [1, 1.4, 1]);

  return (
    <AccentBox x={60} y={1230} width={300} opacity={interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'})}>
      <div style={LABEL_STYLE}>THE NEW ECONOMY</div>
      <svg width={300} height={90} viewBox="0 0 300 90">
        <path d={d} fill="none" stroke={GOLD} strokeWidth={3} strokeDasharray={length} strokeDashoffset={length * (1 - progress)} />
        <circle cx={tipX} cy={tipY} r={5 * pulse} fill={GOLD_BRIGHT} />
      </svg>
    </AccentBox>
  );
};

// Scene 2: skyline glam — ticking tourist counter (no existing stat covers this line).
export const TouristCounter: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const count = interpolate(frame, [0, durationInFrames * 0.65], [0, 30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AccentBox x={720} y={1230} width={300} opacity={opacity}>
      <div style={LABEL_STYLE}>TOURISTS / YEAR</div>
      <div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 44, fontWeight: 800, color: GOLD_BRIGHT}}>
        {count.toFixed(0)}M
      </div>
    </AccentBox>
  );
};

// Scene 3: tax-free magnet — a few extra drifting coin glyphs continuing the
// flow-toward-tower motion already baked into the static illustration.
export const DriftingCoins: React.FC<{durationInFrames: number}> = () => {
  const frame = useCurrentFrame();
  const coins = [
    {x: 140, y: 1000, delay: 0},
    {x: 260, y: 1120, delay: 20},
    {x: 200, y: 850, delay: 40},
    {x: 340, y: 980, delay: 10},
    {x: 300, y: 1200, delay: 30},
  ];

  return (
    <svg style={{position: 'absolute', inset: 0}} width="100%" height="100%" viewBox="0 0 1080 1920">
      {coins.map((c, i) => {
        const local = (frame - c.delay + 90) % 90;
        const y = interpolate(local, [0, 90], [c.y, c.y - 160]);
        const x = interpolate(local, [0, 90], [c.x, c.x + 120]);
        const opacity = interpolate(local, [0, 15, 70, 90], [0, 0.85, 0.85, 0]);
        return <circle key={i} cx={x} cy={y} r={14} fill={GOLD} opacity={opacity} />;
      })}
    </svg>
  );
};

// Scene 5: port — dashed cargo-flow arrows toward the edges of frame,
// reinforcing "moving cargo between Asia, Europe, and Africa."
export const CargoFlowArrows: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const lanes = [
    {x1: 540, y1: 420, x2: 220, y2: 220, label: 'ASIA', delay: 0},
    {x1: 540, y1: 420, x2: 540, y2: 140, label: 'EUROPE', delay: 15},
    {x1: 540, y1: 420, x2: 860, y2: 220, label: 'AFRICA', delay: 30},
  ];

  return (
    <svg style={{position: 'absolute', inset: 0}} width="100%" height="100%" viewBox="0 0 1080 1920">
      {lanes.map((lane, i) => {
        const local = Math.max(0, frame - lane.delay);
        const length = Math.hypot(lane.x2 - lane.x1, lane.y2 - lane.y1);
        const progress = interpolate(local, [0, 25], [0, 1], {extrapolateRight: 'clamp'});
        const labelOpacity = interpolate(local, [25, 35, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <g key={i}>
            <line
              x1={lane.x1}
              y1={lane.y1}
              x2={lane.x2}
              y2={lane.y2}
              stroke={BLUE}
              strokeWidth={3}
              strokeDasharray={`10 8`}
              strokeDashoffset={length * (1 - progress)}
              opacity={0.85}
            />
            <text
              x={lane.x2}
              y={lane.y2 - 14}
              fill={GOLD_BRIGHT}
              fontFamily="Arial, sans-serif"
              fontSize={22}
              fontWeight={800}
              textAnchor="middle"
              opacity={labelOpacity}
            >
              {lane.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Scene 7: Burj/Palm aerial — a glowing trace line draws itself along a
// stylized frond outline, calling out the man-made island shape.
export const PalmTrace: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [10, durationInFrames * 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cx = 760;
  const cy = 560;
  const fronds = 8;
  const outerR = 170;
  const innerR = 40;

  return (
    <svg style={{position: 'absolute', inset: 0}} width="100%" height="100%" viewBox="0 0 1080 1920">
      <circle cx={cx} cy={cy} r={innerR * 0.35} fill={GOLD_BRIGHT} opacity={progress} />
      {Array.from({length: fronds}).map((_, i) => {
        const angle = (i / fronds) * Math.PI * 2;
        const x2 = cx + Math.cos(angle) * outerR;
        const y2 = cy + Math.sin(angle) * outerR * 0.6;
        const frondProgress = interpolate(progress, [i / fronds, i / fronds + 0.3], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const length = Math.hypot(x2 - cx, y2 - cy);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke={GOLD}
            strokeWidth={2.5}
            strokeDasharray={length}
            strokeDashoffset={length * (1 - frondProgress)}
            opacity={0.8}
          />
        );
      })}
    </svg>
  );
};

export const SceneAccentFor: React.FC<{id: number; durationInFrames: number}> = ({id, durationInFrames}) => {
  switch (id) {
    case 1:
      return <OilShareGraph durationInFrames={durationInFrames} />;
    case 2:
      return <TouristCounter durationInFrames={durationInFrames} />;
    case 3:
      return <DriftingCoins durationInFrames={durationInFrames} />;
    case 5:
      return <CargoFlowArrows durationInFrames={durationInFrames} />;
    case 7:
      return <PalmTrace durationInFrames={durationInFrames} />;
    case 8:
      return <NewEconomyGraph durationInFrames={durationInFrames} />;
    default:
      return null;
  }
};
