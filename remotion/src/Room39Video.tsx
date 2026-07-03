import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import overlays from './data/overlays.json';
import {buildTimeline, frameRangeFor, OVERLAP_FRAMES} from './timeline';
import {KenBurns} from './components/KenBurns';
import {ParallaxImage} from './components/ParallaxImage';
import {Grade} from './components/Grade';
import {Captions} from './components/Captions';
import {SceneFade} from './components/SceneFade';
import {SfxCues} from './components/SfxCues';
import {
  ChapterCards,
  StatCallouts,
  LowerThirds,
  MapPings,
  KineticLines,
  EndCard,
} from './components/Overlays';
import {TitleReveal, ThreeOffices, OldToNewTools, ThreeGenerations} from './components/MotionGraphics';

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;
const PARALLAX_IDS = new Set(overlays.parallaxSceneIds);

export const Room39Video: React.FC = () => {
  const timeline = buildTimeline();

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <Audio src={staticFile('audio/narration.mp3')} />

      {timeline.map((item, i) => {
        const {seqFrom, seqDuration, isFirst, isLast} = frameRangeFor(item, i, timeline.length);

        return (
          <Sequence key={i} from={seqFrom} durationInFrames={seqDuration}>
            <SceneFade durationInFrames={seqDuration} overlapFrames={OVERLAP_FRAMES} isFirst={isFirst} isLast={isLast}>
              {item.kind === 'endcard' ? (
                <EndCard durationInFrames={seqDuration} />
              ) : item.scene.imageType === 'M' ? (
                <MotionGraphicFor id={item.scene.id} durationInFrames={seqDuration} />
              ) : PARALLAX_IDS.has(item.scene.id) ? (
                <ParallaxImage src={staticFile(`images/${item.scene.file}`)} durationInFrames={seqDuration} />
              ) : (
                <KenBurns
                  src={staticFile(`images/${item.scene.file}`)}
                  durationInFrames={seqDuration}
                  corner={CORNERS[i % CORNERS.length]}
                />
              )}
            </SceneFade>
          </Sequence>
        );
      })}

      <Grade />
      <ChapterCards />
      <MapPings />
      <StatCallouts />
      <LowerThirds />
      <KineticLines />
      <Captions />
      <SfxCues />
    </AbsoluteFill>
  );
};

const MotionGraphicFor: React.FC<{id: number; durationInFrames: number}> = ({id, durationInFrames}) => {
  switch (id) {
    case 2:
      return <TitleReveal durationInFrames={durationInFrames} />;
    case 5:
      return <ThreeOffices durationInFrames={durationInFrames} />;
    case 17:
      return <OldToNewTools durationInFrames={durationInFrames} />;
    case 21:
      return <ThreeGenerations durationInFrames={durationInFrames} />;
    default:
      return <AbsoluteFill style={{background: 'black'}} />;
  }
};
