import {staticFile} from 'remotion';

// Resolves an asset-library id to a public/images/rare-earths/ path. Every
// asset is single-file (no human-character layers), so this always resolves
// to `<id>.png`; `layer` is accepted for call-site consistency but unused.
export function resolveAssetSrc(assetId: string, _layer?: string): string {
  return staticFile(`images/rare-earths/${assetId}.png`);
}
