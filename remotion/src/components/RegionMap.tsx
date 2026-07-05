import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

// One base map image (world-map-base / china-map-base / us-map-base) reused
// across many shots per STYLE_GUIDE.md's template-reuse finding -- only the
// pin/label overlay changes per shot, not the underlying art. Base gets a
// slow Ken Burns push (matching the reference's map treatment); pins/labels
// pop in with a spring, matching Overlays.tsx's MapPings component.
export const RegionMap: React.FC<{
  src: string;
  durationInFrames: number;
  overlay?: {pin?: string; pins?: string[]; stat?: string; label?: string};
}> = ({src, durationInFrames, overlay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    easing: Easing.bezier(0.33, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(progress, [0, 1], [1, 1.08]);

  const pop = spring({frame, fps, config: {damping: 14, stiffness: 150, mass: 0.5}});
  const chipText = overlay?.stat ?? overlay?.label ?? overlay?.pin;
  const pinList = overlay?.pins ?? (overlay?.pin ? [overlay.pin] : []);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={src}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}}
      />
      {pinList.map((label, i) => (
        <div
          key={label + i}
          style={{
            position: 'absolute',
            top: `${28 + i * 12}%`,
            left: `${30 + i * 18}%`,
            transform: `scale(${0.85 + pop * 0.15})`,
            opacity: pop,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <svg width={18} height={18}>
            <circle cx={9} cy={9} r={7} fill="none" stroke="#5fb3e0" strokeWidth={2} />
            <circle cx={9} cy={9} r={3} fill="#8fd3f4" />
          </svg>
          <div
            style={{
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: 26,
              fontWeight: 700,
              color: '#eef6fb',
              background: 'rgba(10,12,14,0.55)',
              borderRadius: 6,
              padding: '4px 10px',
              letterSpacing: 1,
            }}
          >
            {label}
          </div>
        </div>
      ))}
      {chipText && pinList.length === 0 && (
        <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-end', padding: 60}}>
          <div
            style={{
              transform: `scale(${0.8 + pop * 0.2})`,
              opacity: pop,
              background: 'rgba(10,12,14,0.72)',
              border: '2px solid #c9a24a',
              borderRadius: 10,
              padding: '14px 30px',
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontSize: 38,
              fontWeight: 800,
              color: '#f2d998',
              letterSpacing: 1,
            }}
          >
            {chipText}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
