import React from 'react';
import {Composition} from 'remotion';
import {Room39Video} from './Room39Video';
import {FPS, totalDurationInFrames} from './timeline';
import {DubaiMoneyVideo} from './DubaiMoneyVideo';
import {DUBAI_FPS, dubaiTotalDurationInFrames} from './timelineDubai';

export const DURATION_IN_FRAMES = totalDurationInFrames();
export const DUBAI_DURATION_IN_FRAMES = dubaiTotalDurationInFrames();

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Room39"
        component={Room39Video}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="DubaiMoney"
        component={DubaiMoneyVideo}
        durationInFrames={DUBAI_DURATION_IN_FRAMES}
        fps={DUBAI_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
