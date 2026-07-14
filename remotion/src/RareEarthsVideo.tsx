import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import shotlist from './data/rare-earths/shotlist.json';
import overlays from './data/rare-earths/overlays.json';
import captions from './data/rare-earths/captions.json';
import {buildTimelineFor, frameRangeFor, totalDurationInFramesFor, OVERLAP_FRAMES} from './timeline';
import {resolveAssetSrc} from './rareEarthsAssets';
import {KenBurns} from './components/KenBurns';
import {ParallaxImage} from './components/ParallaxImage';
import {LoopedIdle} from './components/LoopedIdle';
import {RegionMap} from './components/RegionMap';
import {ProgressiveReveal} from './components/ProgressiveReveal';
import {StampSignatureAnim} from './components/StampSignatureAnim';
import {PriceSpikeChart} from './components/PriceSpikeChart';
import {CountdownClock} from './components/CountdownClock';
import {TextCard} from './components/TextCard';
import {DialogueCards} from './components/DialogueCards';
import {GradeRareEarths} from './components/GradeRareEarths';
import {VoxCaptions} from './components/VoxCaptions';
import {SceneFade} from './components/SceneFade';
import {ChapterCards, StatCallouts, MapPings, KineticLines, EndCard} from './components/VoxOverlays';

type Scene = (typeof shotlist.scenes)[number];

// overlays.json's parallaxSceneIds are raw shot ids -- rebuild_shotlist.py
// renumbers every id whenever the shotlist changes, so these must be
// re-picked (and re-checked against MOTION_GRAPHIC_ASSETS, see the ternary
// below) any time the shotlist is regenerated, not carried over blindly.
const PARALLAX_IDS = new Set(overlays.parallaxSceneIds);

// text-card/dialogue-cards render their own on-screen text (a quote,
// statement, or dialogue line) -- the independently-timed caption track would
// otherwise stack a duplicate of the same sentence underneath it, so these
// windows get folded into VoxCaptions' suppression list alongside kinetic
// lines.
const TEXT_OVERLAY_ASSETS = new Set(['text-card', 'dialogue-cards']);
const textOverlayWindows = shotlist.scenes
  .filter((s) => TEXT_OVERLAY_ASSETS.has(s.asset))
  .map((s) => ({start: s.start, end: s.end}));
const captionSuppressWindows = [...overlays.kineticLines, ...textOverlayWindows];

export function rareEarthsTimeline() {
  return buildTimelineFor(shotlist.scenes, overlays.endCard.durationSeconds);
}

export function rareEarthsDurationInFrames(): number {
  return totalDurationInFramesFor(rareEarthsTimeline());
}

export const RareEarthsVideo: React.FC = () => {
  const timeline = rareEarthsTimeline();

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <Audio src={staticFile('audio/rare-earths/narration-full.mp3')} />

      {timeline.map((item, i) => {
        const {seqFrom, seqDuration, isFirst, isLast} = frameRangeFor(item, i, timeline.length);

        return (
          <Sequence key={i} from={seqFrom} durationInFrames={seqDuration}>
            <SceneFade durationInFrames={seqDuration} overlapFrames={OVERLAP_FRAMES} isFirst={isFirst} isLast={isLast}>
              {item.kind === 'endcard' ? (
                <EndCardRareEarths durationInFrames={seqDuration} />
              ) : PARALLAX_IDS.has(item.scene.id) && !MOTION_GRAPHIC_ASSETS.has(item.scene.asset) ? (
                <ParallaxImage src={resolveAssetSrc(item.scene.asset, 'base')} durationInFrames={seqDuration} />
              ) : (
                <ShotRenderer scene={item.scene} durationInFrames={seqDuration} />
              )}
            </SceneFade>
          </Sequence>
        );
      })}

      <GradeRareEarths />
      <ChapterCards chapters={overlays.chapters} />
      <MapPings mapPings={overlays.mapPings} />
      <StatCallouts stats={overlays.stats} />
      <KineticLines kineticLines={overlays.kineticLines} />
      <VoxCaptions segments={captions.segments} kineticLines={captionSuppressWindows} />
    </AbsoluteFill>
  );
};

// asset-library.json's motion_graphics_no_generation_needed: these ids have
// no image file at all -- they must always render as pure Remotion graphics
// regardless of the shot's tagged technique, checked before anything else so
// a KenBurns-tagged shot referencing one of them doesn't try (and fail) to
// load a nonexistent PNG. text-card/dialogue-cards are the two "no human
// characters" replacements (quotes/statements, and the phone-call exchange).
const MOTION_GRAPHIC_ASSETS = new Set([
  'stamp-signature-anim',
  'price-spike-chart',
  'countdown-clock',
  'text-card',
  'dialogue-cards',
]);

const renderMotionGraphic = (scene: Scene, durationInFrames: number): React.ReactElement => {
  const overlay: any = (scene as any).overlay ?? {};
  const note: string = String(overlay.note ?? '').toLowerCase();
  const label: string = String(overlay.label ?? overlay.stat ?? '');

  switch (scene.asset) {
    case 'stamp-signature-anim': {
      const variant = note.includes('withheld') || note.includes('hover') ? 'withheld' : 'down';
      return (
        <StampSignatureAnim
          durationInFrames={durationInFrames}
          variant={variant}
          label={label || 'RESTRICTED'}
        />
      );
    }
    case 'price-spike-chart':
      return <PriceSpikeChart durationInFrames={durationInFrames} multiplierLabel={label || '6x'} />;
    case 'countdown-clock':
      return <CountdownClock durationInFrames={durationInFrames} dateLabel={label || undefined} />;
    case 'text-card':
      return (
        <TextCard
          durationInFrames={durationInFrames}
          variant={overlay.variant === 'quote' ? 'quote' : 'statement'}
          text={scene.text}
          attribution={overlay.attribution}
        />
      );
    case 'dialogue-cards': {
      const pane = overlay.pane === 'B' ? 'B' : 'A';
      return (
        <DialogueCards
          durationInFrames={durationInFrames}
          leftLabel="FACTORY MANAGER"
          rightLabel="EXPORT OFFICIAL"
          activePane={pane}
          activeText={scene.text}
        />
      );
    }
    default:
      // unreachable given MOTION_GRAPHIC_ASSETS.has(scene.asset) guarded the call site
      return <AbsoluteFill style={{background: 'black'}} />;
  }
};

// Dispatches a shot to the right animation technique, per STYLE_GUIDE.md's
// measured techniques (KenBurns default, LoopedIdle, ProgressiveReveal) plus
// the pure-code motion graphics above (which cover every beat that used to
// be a human character -- see MOTION_GRAPHIC_ASSETS). `asset`/`variant`/
// `technique`/`overlay`/`speaker` all come straight from shotlist.json -- see
// production/rare-earths/shotlist.json's _comment.
const ShotRenderer: React.FC<{scene: Scene; durationInFrames: number}> = ({scene, durationInFrames}) => {
  if (MOTION_GRAPHIC_ASSETS.has(scene.asset)) {
    return renderMotionGraphic(scene, durationInFrames);
  }

  switch (scene.technique) {
    case 'LoopedIdle':
      return <LoopedIdle src={resolveAssetSrc(scene.asset, 'base')} />;

    case 'ProgressiveReveal': {
      const overlay = (scene as any).overlay ?? {};
      const items: string[] = overlay.pins ?? (overlay.crop ? [String(overlay.crop)] : []);
      if (items.length === 0) {
        return <RegionMap src={resolveAssetSrc(scene.asset, 'base')} durationInFrames={durationInFrames} overlay={overlay} />;
      }
      return (
        <ProgressiveReveal src={resolveAssetSrc(scene.asset, 'base')} durationInFrames={durationInFrames} items={items} />
      );
    }

    case 'KenBurns':
    default: {
      const assetType = scene.variant;
      if (assetType === 'M') {
        const overlay = (scene as any).overlay ?? {};
        if (overlay.stat || overlay.label || overlay.pin || overlay.pins) {
          return <RegionMap src={resolveAssetSrc(scene.asset, 'base')} durationInFrames={durationInFrames} overlay={overlay} />;
        }
      }
      return (
        <KenBurns
          src={resolveAssetSrc(scene.asset, 'base')}
          durationInFrames={durationInFrames}
          corner={CORNERS[scene.id % CORNERS.length]}
        />
      );
    }
  }
};

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

const EndCardRareEarths: React.FC<{durationInFrames: number}> = ({durationInFrames}) => (
  <EndCard
    durationInFrames={durationInFrames}
    title={overlays.endCard.title}
    subtitle={overlays.endCard.subtitle}
  />
);
