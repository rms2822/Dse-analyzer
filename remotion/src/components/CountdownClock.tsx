import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {VOX} from '../voxTheme';

// Pure motion graphic (no generated image), for THE CLOCK's ticking-deadline
// beats -- a simple analog clock face with a moving second hand, plus an
// optional date label for the Nov 10 2026 deadline callouts.
export const CountdownClock: React.FC<{
  durationInFrames: number;
  dateLabel?: string;
}> = ({durationInFrames, dateLabel}) => {
  const frame = useCurrentFrame();
  const secondAngle = (frame * 12) % 360; // fast, urgent tick rather than real-time
  const minuteAngle = (frame * 0.6) % 360;

  const pulse = 1 + 0.03 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{background: VOX.ink, alignItems: 'center', justifyContent: 'center'}}>
      <svg width={360} height={360} viewBox="0 0 360 360" style={{transform: `scale(${pulse})`}}>
        <circle cx={180} cy={180} r={160} fill="#151A20" stroke={VOX.white} strokeWidth={4} />
        {Array.from({length: 12}).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 180 + Math.sin(a) * 140;
          const y1 = 180 - Math.cos(a) * 140;
          const x2 = 180 + Math.sin(a) * 155;
          const y2 = 180 - Math.cos(a) * 155;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={VOX.white} strokeWidth={3} />;
        })}
        <line
          x1={180}
          y1={180}
          x2={180 + Math.sin((minuteAngle * Math.PI) / 180) * 95}
          y2={180 - Math.cos((minuteAngle * Math.PI) / 180) * 95}
          stroke={VOX.yellow}
          strokeWidth={7}
          strokeLinecap="round"
        />
        <line
          x1={180}
          y1={180}
          x2={180 + Math.sin((secondAngle * Math.PI) / 180) * 130}
          y2={180 - Math.cos((secondAngle * Math.PI) / 180) * 130}
          stroke={VOX.red}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={180} cy={180} r={8} fill={VOX.yellow} />
      </svg>
      {dateLabel && (
        <div
          style={{
            position: 'absolute',
            bottom: 90,
            fontFamily: VOX.font,
            fontWeight: 800,
            fontSize: 40,
            color: VOX.yellow,
            letterSpacing: 2,
          }}
        >
          {dateLabel}
        </div>
      )}
    </AbsoluteFill>
  );
};
