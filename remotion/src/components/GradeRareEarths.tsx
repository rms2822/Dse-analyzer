import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import overlays from '../data/rare-earths/overlays.json';

type Window = {chapter: string; start: number; end: number; grade: 'day' | 'crisis-night'};
const windows = overlays.chapterWindows as Window[];

// Two-grade strategy, not one continuous grade -- per STYLE_GUIDE.md's
// measured finding: bright/flat/saturated for the explainer chapters, a cool
// dark-navy wash for the crisis chapters (THE TRAP, THE CLOCK), switched at
// chapter boundaries rather than graded shot-by-shot like Room_39's constant
// grain+vignette+split-tone. No grain/vignette in either grade -- the
// reference's flat-vector daytime shots read clean at low bitrate on purpose.
export const GradeRareEarths: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const active = windows.find((w) => t >= w.start && t < w.end) ?? windows[windows.length - 1];

  if (active.grade === 'day') {
    // STYLE_DECODE_v2.md restyle: a soft warm-paper clarity boost, matching
    // the reference's cream/white-default illustrated scenes, instead of the
    // cool cyan tint from the earlier neon-Vox palette (dropped entirely).
    return (
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 50%, rgba(247,243,232,0.05) 100%)',
        }}
      />
    );
  }

  // crisis-night: cool dark-navy wash + mild vignette, distinct from Room_39's warm split-tone
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(6,14,28,0.32) 0%, rgba(4,10,22,0.42) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 260px 50px rgba(0,4,14,0.5)'}} />
    </AbsoluteFill>
  );
};
