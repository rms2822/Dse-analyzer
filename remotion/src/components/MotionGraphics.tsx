import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig} from 'remotion';

const gradeBg = '#0b0d10';

// Scene 2: dark map + pulsing red circle + title reveal.
export const TitleReveal: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pulse = interpolate(frame % 40, [0, 20, 40], [1, 1.15, 1]);
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.25], {
    extrapolateRight: 'clamp',
  });
  const titleOpacity = spring({frame: frame - fps * 1.5, fps, config: {damping: 200}});

  return (
    <AbsoluteFill style={{background: gradeBg, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{transform: `scale(${scale})`}}>
        <svg width={900} height={900} viewBox="0 0 900 900">
          {/* rough dark landmass silhouette standing in for a satellite map */}
          <path
            d="M420 60 C460 140 500 200 480 280 C520 340 470 420 500 500 C540 580 470 660 430 760 C400 820 360 780 350 700 C300 660 330 560 300 480 C260 420 300 340 280 260 C260 180 340 100 420 60 Z"
            fill="#1c3a1f"
          />
          <circle
            cx={430}
            cy={520}
            r={60 * pulse}
            fill="none"
            stroke="#c62828"
            strokeWidth={6}
            opacity={0.9}
          />
          <circle cx={430} cy={520} r={8} fill="#ff5252" />
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          fontFamily: 'Georgia, serif',
          fontSize: 120,
          color: 'white',
          letterSpacing: 8,
          opacity: titleOpacity,
          textShadow: '0 4px 30px rgba(0,0,0,0.8)',
        }}
      >
        ROOM 39
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: three labeled offices on one floor.
export const ThreeOffices: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const items = [
    {label: 'OFFICE 35', sub: 'Intelligence', glow: false},
    {label: 'OFFICE 38', sub: 'Legal money', glow: false},
    {label: 'ROOM 39', sub: 'No sign on the door', glow: true},
  ];
  return (
    <AbsoluteFill style={{background: '#111417', alignItems: 'center', justifyContent: 'center', gap: 60, flexDirection: 'row'}}>
      {items.map((item, i) => {
        const delay = i * 12;
        const opacity = interpolate(frame - delay, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const y = interpolate(frame - delay, [0, 20], [30, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div
            key={item.label}
            style={{
              opacity,
              transform: `translateY(${y}px)`,
              width: 320,
              height: 420,
              background: item.glow ? 'linear-gradient(180deg,#3a2f18,#1a1510)' : '#1d2226',
              border: item.glow ? '2px solid #d8a34a' : '2px solid #3a4046',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: item.glow ? '0 0 60px rgba(216,163,74,0.35)' : 'none',
            }}
          >
            <div style={{width: 90, height: 140, background: '#0b0d10', borderRadius: 4, marginBottom: 30}} />
            <div style={{fontFamily: 'Arial, sans-serif', color: 'white', fontSize: 30, fontWeight: 700}}>{item.label}</div>
            <div style={{fontFamily: 'Arial, sans-serif', color: '#9aa0a6', fontSize: 20, marginTop: 8}}>{item.sub}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Scene 17: old tools dissolve into new tools (typewriter -> laptop), pure shape morph stand-in.
export const OldToNewTools: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const crossfade = interpolate(frame, [durationInFrames * 0.3, durationInFrames * 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{background: '#15181b', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'relative', width: 500, height: 300}}>
        <div style={{position: 'absolute', inset: 0, opacity: 1 - crossfade, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 380, height: 180, background: '#3a3226', borderRadius: 10}} />
          <div style={{position: 'absolute', color: '#cbb98a', fontFamily: 'Georgia, serif', fontSize: 24}}>old tools</div>
        </div>
        <div style={{position: 'absolute', inset: 0, opacity: crossfade, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 380, height: 220, background: '#1a2733', borderRadius: 10, border: '2px solid #4d7ea8'}} />
          <div style={{position: 'absolute', color: '#8fc7ec', fontFamily: 'Arial, sans-serif', fontSize: 24}}>new tools</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 21: three portrait silhouettes cross-fading with a network line pattern.
export const ThreeGenerations: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const third = durationInFrames / 3;
  const opacities = [0, 1, 2].map((i) =>
    interpolate(frame, [i * third, i * third + third * 0.5, (i + 1) * third], [0, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  return (
    <AbsoluteFill style={{background: '#0c0e10', alignItems: 'center', justifyContent: 'center'}}>
      {opacities.map((o, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            opacity: o,
            width: 260,
            height: 320,
            borderRadius: '50% 50% 45% 45%',
            background: 'linear-gradient(180deg,#2a2f33,#111417)',
          }}
        />
      ))}
      <svg
        style={{position: 'absolute', inset: 0}}
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
      >
        <line x1="700" y1="540" x2="1220" y2="540" stroke="#3f7ea8" strokeWidth={2} opacity={0.5} />
      </svg>
    </AbsoluteFill>
  );
};
