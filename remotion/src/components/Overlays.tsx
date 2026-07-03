import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import overlays from '../data/overlays.json';
import {useActiveWindow} from './useActiveWindow';

const FONT = 'Arial, Helvetica, sans-serif';

export const ChapterCards: React.FC = () => {
  const active = useActiveWindow(overlays.chapters);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!active) return null;

  const {item, localSeconds} = active;
  const localFrame = Math.round(localSeconds * fps);
  const inSpring = spring({frame: localFrame, fps, config: {damping: 200}});
  const totalFrames = Math.round((item.end - item.start) * fps);
  const outFade = interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#0a0c0e',
        opacity: Math.min(inSpring, outFade),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
        <div style={{width: 90, height: 2, background: '#8a6a34'}} />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: 4,
            color: 'white',
            textAlign: 'center',
          }}
        >
          {item.title}
        </div>
        <div style={{width: 90, height: 2, background: '#8a6a34'}} />
      </div>
    </AbsoluteFill>
  );
};

export const StatCallouts: React.FC = () => {
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
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 130}}>
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
            fontSize: 56,
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

export const LowerThirds: React.FC = () => {
  const active = useActiveWindow(overlays.lowerThirds);
  const {fps} = useVideoConfig();
  if (!active) return null;
  const localFrame = Math.round(active.localSeconds * fps);
  const slide = spring({frame: localFrame, fps, config: {damping: 200}});
  const totalFrames = Math.round((active.item.end - active.item.start) * fps);
  const outOpacity = interpolate(localFrame, [totalFrames - 8, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const x = interpolate(slide, [0, 1], [-60, 0]);

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', paddingBottom: 290}}>
      <div
        style={{
          opacity: Math.min(slide, outOpacity),
          transform: `translateX(${x}px)`,
          marginLeft: 90,
          display: 'flex',
          alignItems: 'stretch',
          width: 'fit-content',
        }}
      >
        <div style={{width: 6, background: '#c9a24a'}} />
        <div style={{background: 'rgba(10,12,14,0.72)', padding: '12px 24px'}}>
          <div style={{fontFamily: FONT, fontSize: 30, fontWeight: 800, color: 'white'}}>
            {active.item.name}
          </div>
          <div style={{fontFamily: FONT, fontSize: 20, color: '#c9a24a', marginTop: 2}}>
            {active.item.role}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MapPings: React.FC = () => {
  const active = useActiveWindow(overlays.mapPings);
  const {fps} = useVideoConfig();
  if (!active) return null;
  const localFrame = Math.round(active.localSeconds * fps);
  const pop = spring({frame: localFrame, fps, config: {damping: 14, stiffness: 160, mass: 0.5}});
  const totalFrames = Math.round((active.item.end - active.item.start) * fps);
  const outOpacity = interpolate(localFrame, [totalFrames - 6, totalFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = interpolate(localFrame % 30, [0, 15, 30], [1, 1.4, 1]);

  return (
    <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-start'}}>
      <div
        style={{
          opacity: Math.min(pop, outOpacity),
          transform: `scale(${0.8 + pop * 0.2})`,
          marginTop: 70,
          marginRight: 90,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(10,12,14,0.72)',
          border: '1px solid #3f7ea8',
          borderRadius: 999,
          padding: '10px 22px',
        }}
      >
        <svg width={16} height={16}>
          <circle cx={8} cy={8} r={7 * pulse} fill="none" stroke="#5fb3e0" strokeWidth={2} />
          <circle cx={8} cy={8} r={3} fill="#8fd3f4" />
        </svg>
        <div style={{fontFamily: FONT, fontSize: 22, fontWeight: 700, color: '#cfeaf9', letterSpacing: 2}}>
          {active.item.label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const KineticLines: React.FC = () => {
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
          fontSize: 66,
          fontWeight: 800,
          color: 'white',
          textAlign: 'center',
          lineHeight: 1.25,
          maxWidth: '85%',
          whiteSpace: 'pre-line',
          textShadow: '0 4px 24px rgba(0,0,0,0.9)',
        }}
      >
        {active.item.text}
      </div>
    </AbsoluteFill>
  );
};

export const EndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inSpring = spring({frame, fps, config: {damping: 200}});
  const outOpacity = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
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
        <div style={{fontFamily: 'Georgia, serif', fontSize: 96, letterSpacing: 8, color: 'white'}}>
          {overlays.endCard.title}
        </div>
        <div style={{fontFamily: FONT, fontSize: 26, color: '#9aa0a6'}}>
          {overlays.endCard.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
