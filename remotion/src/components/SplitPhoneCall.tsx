import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TalkingCharacter} from './TalkingCharacter';

// Two-pane cross-cut for the one dramatized multi-voice exchange in the video
// (THE TRAP's "Is the export license signed?" beat) -- per STYLE_GUIDE.md, the
// reference stages this as a literal split between two characters on two
// phones, not narration over a generic cutaway. Both panes render for the
// whole exchange; only the currently-speaking pane's TalkingCharacter animates
// its mouth and sits at full brightness, so the split reads as one continuous
// scene across the 4 quick shots rather than 4 unrelated cuts.
export const SplitPhoneCall: React.FC<{
  leftAssetId: string;
  rightAssetId: string;
  speakingPane: 'A' | 'B';
  durationInFrames: number;
}> = ({leftAssetId, rightAssetId, speakingPane, durationInFrames}) => {
  return (
    <AbsoluteFill style={{flexDirection: 'row'}}>
      <AbsoluteFill style={{left: 0, width: '50%', right: 'auto'}}>
        <TalkingCharacter
          assetId={leftAssetId}
          durationInFrames={durationInFrames}
          active={speakingPane === 'A'}
          dim={speakingPane !== 'A'}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{left: '50%', width: '50%'}}>
        <TalkingCharacter
          assetId={rightAssetId}
          durationInFrames={durationInFrames}
          active={speakingPane === 'B'}
          dim={speakingPane !== 'B'}
        />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 4,
          marginLeft: -2,
          background: 'rgba(255,255,255,0.85)',
        }}
      />
    </AbsoluteFill>
  );
};
