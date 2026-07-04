import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import overlays from '../data/dubai-overlays.json';
import {useActiveWindow} from './useActiveWindow';

const FONT = 'Arial, Helvetica, sans-serif';

export const StatCalloutsDubai: React.FC = () => {
  const active = useActiveWindow(overlays.stats);
  const {fps} = useVideoConfig();
  if (!active) return null;
  const localFrame = Math.round(active.localSeconds * fps);
  const pop = spring({frame: localFrame, fps, config: {damping: 12, stiffness: 140, mass: 0.6}});
  const totalFrames = Math.round((active.item.end - active.item.start) * fps);
  const outOpacity = interpolate(localFrame, [totalFrames - 6, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 220}}>
      <div
        style={{
          transform: `scale(${0.7 + pop * 0.3})`,
          opacity: Math.min(pop, outOpacity),
          background: 'rgba(10,12,14,0.72)',
          border: '2px solid #c9a24a',
          borderRadius: 10,
          padding: '18px 42px',
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 60,
            fontWeight: 800,
            color: '#f2d998',
            letterSpacing: 2,
          }}
        >
          {active.item.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const KineticLinesDubai: React.FC = () => {
  const active = useActiveWindow(overlays.kineticLines);
  const {fps} = useVideoConfig();
  if (!active) return null;
  const localFrame = Math.round(active.localSeconds * fps);
  const pop = spring({frame: localFrame, fps, config: {damping: 200}});
  const totalFrames = Math.round((active.item.end - active.item.start) * fps);
  const outOpacity = interpolate(localFrame, [totalFrames - 6, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.35)',
      }}
    >
      <div
        style={{
          opacity: Math.min(pop, outOpacity),
          transform: `scale(${0.9 + pop * 0.1})`,
          fontFamily: FONT,
          fontSize: 72,
          fontWeight: 800,
          color: 'white',
          textAlign: 'center',
          lineHeight: 1.25,
          maxWidth: '90%',
          whiteSpace: 'pre-line',
          textShadow: '0 4px 24px rgba(0,0,0,0.9)',
        }}
      >
        {active.item.text}
      </div>
    </AbsoluteFill>
  );
};

export const EndCardDubai: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inSpring = spring({frame, fps, config: {damping: 200}});
  const outOpacity = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#0a0c0e',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: Math.min(inSpring, outOpacity),
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
        <div style={{fontFamily: 'Georgia, serif', fontSize: 110, letterSpacing: 8, color: 'white'}}>
          {overlays.endCard.title}
        </div>
        <div style={{fontFamily: FONT, fontSize: 30, color: '#9aa0a6'}}>
          {overlays.endCard.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
