import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import overlays from '../data/overlays.json';
import {FPS} from '../timeline';

// Short synthesized cues (see public/audio/sfx) that punctuate the new overlay
// graphics — a whoosh under each chapter card, a thud under each stat callout, a
// ping under each map/lower-third beat. Kept quiet so they sit under the narration.
export const SfxCues: React.FC = () => {
  return (
    <>
      {overlays.chapters.map((c, i) => (
        <Sequence key={`chapter-sfx-${i}`} from={Math.round(c.start * FPS)} durationInFrames={30}>
          <Audio src={staticFile('audio/sfx/whoosh.wav')} volume={0.35} />
        </Sequence>
      ))}
      {overlays.stats.map((s, i) => (
        <Sequence key={`stat-sfx-${i}`} from={Math.round(s.start * FPS)} durationInFrames={20}>
          <Audio src={staticFile('audio/sfx/thud.wav')} volume={0.3} />
        </Sequence>
      ))}
      {overlays.mapPings.map((m, i) => (
        <Sequence key={`map-sfx-${i}`} from={Math.round(m.start * FPS)} durationInFrames={20}>
          <Audio src={staticFile('audio/sfx/ping.wav')} volume={0.25} />
        </Sequence>
      ))}
      {overlays.lowerThirds.map((l, i) => (
        <Sequence key={`lt-sfx-${i}`} from={Math.round(l.start * FPS)} durationInFrames={20}>
          <Audio src={staticFile('audio/sfx/ping.wav')} volume={0.2} />
        </Sequence>
      ))}
    </>
  );
};
