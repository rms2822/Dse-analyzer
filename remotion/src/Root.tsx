import React from 'react';
import {Composition} from 'remotion';
import {Room39Video} from './Room39Video';
import {FPS, totalDurationInFrames} from './timeline';

export const DURATION_IN_FRAMES = totalDurationInFrames();

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
