import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {VOX} from '../voxTheme';

type Segment = {start: number; end: number; text: string};
type KineticWindow = {start: number; end: number};

// Vox-style caption bar: solid black bar, bold uppercase-adjacent sans, sharp
// corners -- distinct from Room_39/Captions.tsx's transparent text-shadow
// treatment. RareEarths-only.
export const VoxCaptions: React.FC<{segments: Segment[]; kineticLines: KineticWindow[]}> = ({
  segments,
  kineticLines,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const kineticActive = kineticLines.some((k) => t >= k.start && t < k.end);
  if (kineticActive) return null;

  const active = segments.find((s) => t >= s.start && t < s.end);
  if (!active) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 84,
      }}
    >
      <div
        style={{
          maxWidth: '78%',
          textAlign: 'center',
          fontFamily: VOX.font,
          fontSize: 42,
          fontWeight: 800,
          color: VOX.white,
          lineHeight: 1.3,
          background: 'rgba(11,15,20,0.88)',
          padding: '10px 26px',
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
