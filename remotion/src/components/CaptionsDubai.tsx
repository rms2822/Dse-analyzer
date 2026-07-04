import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import captions from '../data/dubai-captions.json';
import overlays from '../data/dubai-overlays.json';

type Segment = {start: number; end: number; text: string};

const segments: Segment[] = captions.segments;

export const CaptionsDubai: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const kineticActive = overlays.kineticLines.some((k) => t >= k.start && t < k.end);
  if (kineticActive) return null;

  const active = segments.find((s) => t >= s.start && t < s.end);
  if (!active) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 220,
      }}
    >
      <div
        style={{
          maxWidth: '88%',
          textAlign: 'center',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 52,
          fontWeight: 700,
          color: 'white',
          lineHeight: 1.3,
          textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)',
          padding: '10px 28px',
        }}
      >
        {active.text}
      </div>
    </AbsoluteFill>
  );
};
