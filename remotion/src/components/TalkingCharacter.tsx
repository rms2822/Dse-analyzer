import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame} from 'remotion';
import {hasLayer, resolveAssetSrc} from '../rareEarthsAssets';

// Character close-up hold: no camera move, no body movement -- per
// STYLE_GUIDE.md's measured "talking-head viseme swap" technique, the whole
// effect is a small number of mouth-shape images cycling on a fixed interval,
// plus an occasional blink, over an otherwise static pose. Falls back to a
// near-imperceptible idle scale breathe (same fallback Room_39 used for
// dialogue-driven shots) for any character asset that only has a base pose.
export const TalkingCharacter: React.FC<{
  assetId: string;
  durationInFrames: number;
  active?: boolean; // for SplitPhoneCall: false = other pane, stays on a closed-mouth still
  dim?: boolean;
}> = ({assetId, durationInFrames, active = true, dim = false}) => {
  const frame = useCurrentFrame();
  const canTalk = hasLayer(assetId, 'mouth_open') && hasLayer(assetId, 'mouth_closed');
  const canBlink = hasLayer(assetId, 'blink');

  let src: string;
  if (canTalk && active) {
    const MOUTH_CYCLE_FRAMES = 6; // ~5 mouth-flaps/sec at 30fps, a cheap viseme-swap approximation
    const isBlinkFrame = canBlink && frame % 90 >= 86 && frame % 90 < 90;
    if (isBlinkFrame) {
      src = resolveAssetSrc(assetId, 'blink');
    } else {
      const mouthOpen = Math.floor(frame / MOUTH_CYCLE_FRAMES) % 2 === 0;
      src = resolveAssetSrc(assetId, mouthOpen ? 'mouth_open' : 'mouth_closed');
    }
  } else if (canTalk) {
    // inactive side of a SplitPhoneCall pane: hold on a closed mouth, still image
    src = resolveAssetSrc(assetId, 'mouth_closed');
  } else {
    src = resolveAssetSrc(assetId, 'base');
  }

  // Idle breathing scale for static-pose characters (or the inactive pane),
  // matching the original reference's "near-imperceptible idle motion" note.
  const breathe = 1 + 0.012 * Math.sin((frame / durationInFrames) * Math.PI * 2 * (durationInFrames / 60));

  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: dim ? 0.55 : 1}}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: canTalk ? undefined : `scale(${breathe})`,
          filter: dim ? 'saturate(0.7) brightness(0.85)' : undefined,
          transition: 'filter 0.2s',
        }}
      />
    </AbsoluteFill>
  );
};
