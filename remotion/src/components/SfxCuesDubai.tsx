import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import overlays from '../data/dubai-overlays.json';
import {DUBAI_FPS} from '../timelineDubai';

// Short synthesized cues under the stat callouts, same shared sfx assets as Room 39.
export const SfxCuesDubai: React.FC = () => {
  return (
    <>
      {overlays.stats.map((s, i) => (
        <Sequence key={`stat-sfx-${i}`} from={Math.round(s.start * DUBAI_FPS)} durationInFrames={20}>
          <Audio src={staticFile('audio/sfx/thud.wav')} volume={0.3} />
        </Sequence>
      ))}
    </>
  );
};
