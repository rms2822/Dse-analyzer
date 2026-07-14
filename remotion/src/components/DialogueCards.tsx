import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {VOX} from '../voxTheme';

// Replaces SplitPhoneCall's two drawn characters (per asset-library.json's
// motion_graphics_no_generation_needed dialogue-cards entry) for THE TRAP's
// one dramatized multi-voice exchange: a two-pane Vox transcript-card layout
// -- labeled speaker cards, no faces. The active pane pops its line in; the
// inactive pane just holds its dimmed label, mirroring the original's
// active/dim pane split without any character art.
export const DialogueCards: React.FC<{
  durationInFrames: number;
  leftLabel: string;
  rightLabel: string;
  activePane: 'A' | 'B';
  activeText: string;
}> = ({leftLabel, rightLabel, activePane, activeText}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 14, stiffness: 160, mass: 0.6}});

  const pane = (side: 'A' | 'B', label: string) => {
    const active = side === activePane;
    return (
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          background: active ? '#12181F' : VOX.ink,
          padding: 60,
        }}
      >
        <div
          style={{
            fontFamily: VOX.font,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            color: active ? VOX.yellow : VOX.gray,
            marginBottom: 24,
          }}
        >
          {label}
        </div>
        {active && (
          <div
            style={{
              transform: `scale(${0.85 + pop * 0.15})`,
              opacity: pop,
              background: VOX.white,
              padding: '22px 30px',
              maxWidth: '90%',
            }}
          >
            <div style={{fontFamily: VOX.font, fontSize: 30, fontWeight: 800, color: VOX.ink, lineHeight: 1.3}}>
              {activeText.trim()}
            </div>
          </div>
        )}
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill style={{flexDirection: 'row'}}>
      <AbsoluteFill style={{left: 0, width: '50%', right: 'auto'}}>{pane('A', leftLabel)}</AbsoluteFill>
      <AbsoluteFill style={{left: '50%', width: '50%'}}>{pane('B', rightLabel)}</AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 4,
          marginLeft: -2,
          background: VOX.red,
        }}
      />
    </AbsoluteFill>
  );
};
