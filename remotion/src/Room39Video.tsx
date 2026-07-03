import React from 'react';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {FPS} from './Root';
import shotlist from './data/shotlist.json';
import {KenBurns} from './components/KenBurns';
import {Grade} from './components/Grade';
import {Captions} from './components/Captions';
import {TitleReveal, ThreeOffices, OldToNewTools, ThreeGenerations} from './components/MotionGraphics';

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

export const Room39Video: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {shotlist.scenes.map((scene, i) => {
        const from = Math.round(scene.start * FPS);
        const durationInFrames = Math.max(1, Math.round((scene.end - scene.start) * FPS));

        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
            {scene.imageType === 'M' ? (
              <MotionGraphicFor id={scene.id} durationInFrames={durationInFrames} />
            ) : (
              <KenBurns
                src={staticFile(`images/${scene.file}`)}
                durationInFrames={durationInFrames}
                corner={CORNERS[i % CORNERS.length]}
              />
            )}
          </Sequence>
        );
      })}

      <Grade />
      <Captions />
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
