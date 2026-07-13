import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import overlays from '../data/rare-earths/overlays.json';
import {useActiveWindow} from './useActiveWindow';
import {VOX} from '../voxTheme';

// Vox-explainer-style graphics layer for RareEarths: bold sans, sharp corners,
// solid high-contrast color blocks instead of Room_39's rounded
// gold-hairline/translucent-navy noir chips. Same data shapes as
// components/Overlays.tsx (chapters/stats/lowerThirds/mapPings/kineticLines/
// endCard) so this is a drop-in swap, not a schema change.

export const ChapterCards: React.FC<{chapters?: typeof overlays.chapters}> = ({
  chapters = overlays.chapters,
}) => {
  const active = useActiveWindow(chapters);
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
  const barWidth = interpolate(inSpring, [0, 1], [0, 240]);

  return (
    <AbsoluteFill
      style={{
        background: VOX.ink,
        opacity: Math.min(inSpring, outFade),
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 140,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: 20, maxWidth: '75%'}}>
        <div style={{width: barWidth, height: 14, background: VOX.red}} />
        <div
          style={{
            fontFamily: VOX.font,
            fontSize: 88,
            fontWeight: 900,
            letterSpacing: 1,
            color: VOX.white,
            textTransform: 'uppercase',
            lineHeight: 1.05,
          }}
        >
          {item.title}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const StatCallouts: React.FC<{stats?: typeof overlays.stats}> = ({stats = overlays.stats}) => {
  const active = useActiveWindow(stats);
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
    <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: 110, paddingLeft: 100}}>
      <div
        style={{
          transform: `scale(${0.7 + pop * 0.3})`,
          transformOrigin: 'top left',
          opacity: Math.min(pop, outOpacity),
          background: VOX.yellow,
          padding: '16px 36px',
        }}
      >
        <div
          style={{
            fontFamily: VOX.font,
            fontSize: 58,
            fontWeight: 900,
            color: VOX.ink,
            letterSpacing: 0.5,
          }}
        >
          {active.item.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

type LowerThirdItem = {start: number; end: number; name: string; role: string};

export const LowerThirds: React.FC<{lowerThirds?: LowerThirdItem[]}> = ({
  lowerThirds = overlays.lowerThirds as LowerThirdItem[],
}) => {
  const active = useActiveWindow(lowerThirds);
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
        <div style={{width: 10, background: VOX.red}} />
        <div style={{background: VOX.ink, padding: '14px 26px'}}>
          <div style={{fontFamily: VOX.font, fontSize: 30, fontWeight: 900, color: VOX.white, textTransform: 'uppercase'}}>
            {active.item.name}
          </div>
          <div style={{fontFamily: VOX.font, fontSize: 20, fontWeight: 700, color: VOX.yellow, marginTop: 2}}>
            {active.item.role}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const MapPings: React.FC<{mapPings?: typeof overlays.mapPings}> = ({
  mapPings = overlays.mapPings,
}) => {
  const active = useActiveWindow(mapPings);
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
          background: VOX.ink,
          padding: '10px 22px',
        }}
      >
        <svg width={18} height={18}>
          <circle cx={9} cy={9} r={9 * pulse} fill={VOX.cyan} opacity={0.35} />
          <circle cx={9} cy={9} r={5} fill={VOX.cyan} />
        </svg>
        <div style={{fontFamily: VOX.font, fontSize: 22, fontWeight: 800, color: VOX.white, letterSpacing: 1, textTransform: 'uppercase'}}>
          {active.item.label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const KineticLines: React.FC<{kineticLines?: typeof overlays.kineticLines}> = ({
  kineticLines = overlays.kineticLines,
}) => {
  const active = useActiveWindow(kineticLines);
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
        background: 'rgba(0,0,0,0.55)',
      }}
    >
      <div
        style={{
          opacity: Math.min(pop, outOpacity),
          transform: `scale(${0.92 + pop * 0.08})`,
          fontFamily: VOX.font,
          fontSize: 70,
          fontWeight: 900,
          color: VOX.white,
          textAlign: 'center',
          lineHeight: 1.15,
          maxWidth: '82%',
          whiteSpace: 'pre-line',
          textTransform: 'uppercase',
        }}
      >
        {active.item.text}
      </div>
    </AbsoluteFill>
  );
};

export const EndCard: React.FC<{durationInFrames: number; title?: string; subtitle?: string}> = ({
  durationInFrames,
  title = overlays.endCard.title,
  subtitle = overlays.endCard.subtitle,
}) => {
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
        background: VOX.ink,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: Math.min(inSpring, outOpacity),
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        <div style={{width: 120, height: 14, background: VOX.red}} />
        <div
          style={{
            fontFamily: VOX.font,
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: 1,
            color: VOX.white,
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {title}
        </div>
        <div style={{fontFamily: VOX.font, fontSize: 26, fontWeight: 600, color: VOX.gray}}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};
