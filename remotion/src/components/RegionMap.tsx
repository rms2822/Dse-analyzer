import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {VOX} from '../voxTheme';

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
      {pinList.map((label, i) => {
        // staggered drop-in: each pin lands a few frames after the previous,
        // with a springy overshoot, rather than all pins fading in together
        const pinPop = spring({
          frame: Math.max(0, frame - i * 6),
          fps,
          config: {damping: 11, stiffness: 180, mass: 0.6},
        });
        const pinY = interpolate(pinPop, [0, 1], [-56, 0]);
        return (
        <div
          key={label + i}
          style={{
            position: 'absolute',
            top: `${28 + i * 12}%`,
            left: `${30 + i * 18}%`,
            transform: `translateY(${pinY}px)`,
            opacity: Math.min(pinPop * 1.4, 1),
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <svg width={20} height={20}>
            <circle cx={10} cy={10} r={10} fill={VOX.red} opacity={0.3} />
            <circle cx={10} cy={10} r={5} fill={VOX.red} />
          </svg>
          <div
            style={{
              fontFamily: VOX.font,
              fontSize: 26,
              fontWeight: 800,
              color: VOX.white,
              background: VOX.ink,
              padding: '5px 12px',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            {label}
          </div>
        </div>
        );
      })}
      {chipText && pinList.length === 0 && (
        <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-start', padding: 60}}>
          <div
            style={{
              transform: `scale(${0.8 + pop * 0.2})`,
              opacity: pop,
              background: VOX.gold,
              padding: '16px 34px',
              fontFamily: VOX.font,
              fontSize: 38,
              fontWeight: 900,
              color: VOX.ink,
              letterSpacing: 0.5,
            }}
          >
            {chipText}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
