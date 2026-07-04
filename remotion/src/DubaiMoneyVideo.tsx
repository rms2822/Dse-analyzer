import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import overlays from './data/dubai-overlays.json';
import {buildDubaiTimeline, dubaiFrameRangeFor, DUBAI_OVERLAP_FRAMES} from './timelineDubai';
import {KenBurns} from './components/KenBurns';
import {ParallaxImage} from './components/ParallaxImage';
import {Grade} from './components/Grade';
import {CaptionsDubai} from './components/CaptionsDubai';
import {SceneFade} from './components/SceneFade';
import {SfxCuesDubai} from './components/SfxCuesDubai';
import {StatCalloutsDubai, KineticLinesDubai, EndCardDubai} from './components/OverlaysDubai';
import {FreeZonesMap, FlightHubMap} from './components/MotionGraphicsDubai';
import {SceneAccentFor} from './components/SceneAccentsDubai';

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;
const PARALLAX_IDS = new Set(overlays.parallaxSceneIds);

export const DubaiMoneyVideo: React.FC = () => {
  const timeline = buildDubaiTimeline();

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <Audio src={staticFile('audio/dubai-narration.mp3')} />

      {timeline.map((item, i) => {
        const {seqFrom, seqDuration, isFirst, isLast} = dubaiFrameRangeFor(item, i, timeline.length);

        return (
          <Sequence key={i} from={seqFrom} durationInFrames={seqDuration}>
            <SceneFade durationInFrames={seqDuration} overlapFrames={DUBAI_OVERLAP_FRAMES} isFirst={isFirst} isLast={isLast}>
              {item.kind === 'endcard' ? (
                <EndCardDubai durationInFrames={seqDuration} />
              ) : item.scene.imageType === 'M' ? (
                <MotionGraphicFor id={item.scene.id} durationInFrames={seqDuration} />
              ) : PARALLAX_IDS.has(item.scene.id) ? (
                <>
                  <ParallaxImage src={staticFile(`images/${item.scene.file}`)} durationInFrames={seqDuration} />
                  <SceneAccentFor id={item.scene.id} durationInFrames={seqDuration} />
                </>
              ) : (
                <>
                  <KenBurns
                    src={staticFile(`images/${item.scene.file}`)}
                    durationInFrames={seqDuration}
                    corner={CORNERS[i % CORNERS.length]}
                  />
                  <SceneAccentFor id={item.scene.id} durationInFrames={seqDuration} />
                </>
              )}
            </SceneFade>
          </Sequence>
        );
      })}

      <Grade />
      <StatCalloutsDubai />
      <KineticLinesDubai />
      <CaptionsDubai />
      <SfxCuesDubai />
    </AbsoluteFill>
  );
};

const MotionGraphicFor: React.FC<{id: number; durationInFrames: number}> = ({id, durationInFrames}) => {
  switch (id) {
    case 4:
      return <FreeZonesMap durationInFrames={durationInFrames} />;
    case 6:
      return <FlightHubMap durationInFrames={durationInFrames} />;
    default:
      return <AbsoluteFill style={{background: 'black'}} />;
  }
};
