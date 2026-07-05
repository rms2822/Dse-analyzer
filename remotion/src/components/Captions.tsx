import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import captions from '../data/captions.json';
import overlays from '../data/overlays.json';

type Segment = {start: number; end: number; text: string};
type KineticWindow = {start: number; end: number};

const defaultSegments: Segment[] = captions.segments;

// Optional overrides so a second project (rare-earths) can point this at its
// own captions/kinetic-lines data without forking the file — omit both props
// and behavior is exactly what it was before (Room_39's own data).
export const Captions: React.FC<{segments?: Segment[]; kineticLines?: KineticWindow[]}> = ({
  segments = defaultSegments,
  kineticLines = overlays.kineticLines,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  // Kinetic lines take over the punchiest moments — don't double up with a caption.
  const kineticActive = kineticLines.some((k) => t >= k.start && t < k.end);
  if (kineticActive) return null;

  const active = segments.find((s) => t >= s.start && t < s.end);
  if (!active) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 90,
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          textAlign: 'center',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 44,
          fontWeight: 700,
          color: 'white',
          lineHeight: 1.3,
          textShadow:
            '0 2px 10px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)',
          padding: '10px 28px',
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
