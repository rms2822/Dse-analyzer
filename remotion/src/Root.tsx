import React from 'react';
import {Composition} from 'remotion';
import {Room39Video} from './Room39Video';
import shotlist from './data/shotlist.json';

export const FPS = 30;

const lastScene = shotlist.scenes[shotlist.scenes.length - 1];
const totalSeconds = lastScene.end + 0.5; // half a second of tail padding
export const DURATION_IN_FRAMES = Math.ceil(totalSeconds * FPS);

export const Root: React.FC = () => {
  return (
    <Composition
      id="Room39"
      component={Room39Video}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
