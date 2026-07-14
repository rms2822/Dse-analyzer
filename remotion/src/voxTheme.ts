// Shared color/type tokens for the rare-earths graphics layer, rebuilt per
// STYLE_DECODE_v2.md's real (storyboard) decode of the user's reference video
// ("OverSimplified - The Cold War Part 1"): cream/white is the default
// background, not dark ink; deep red/navy are dramatic accent blocks, not the
// constant canvas; text carries legibility through a bold black outline
// rather than a solid chip behind it. RareEarths-only -- Room_39's
// Overlays.tsx/Captions.tsx are untouched.
export const VOX = {
  ink: '#14140F',
  paper: '#F7F3E8',
  white: '#FFFFFF',
  red: '#B3222E',
  navy: '#1C2B45',
  gold: '#C9A227',
  gray: '#6B6A63',
  font: '"Helvetica Neue", Helvetica, Arial, sans-serif',
} as const;

// Bold outlined-text look (the "1917" title-card technique): a solid fill
// plus a thick same-weight stroke, so labels stay legible directly over a
// busy illustrated scene without needing a solid box behind them.
export function voxOutline(strokeColor: string, width = 3) {
  return {
    WebkitTextStroke: `${width}px ${strokeColor}`,
    paintOrder: 'stroke fill' as const,
  };
}
