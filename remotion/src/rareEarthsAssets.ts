import {staticFile} from 'remotion';
import assetLibrary from './data/rare-earths/asset-library.json';

type AssetEntry = (typeof assetLibrary.assets)[number];

const byId: Record<string, AssetEntry> = Object.fromEntries(
  assetLibrary.assets.map((a) => [a.id, a]),
);

// Resolves an asset-library id (+ optional layer, for characters with
// base/mouth-open/mouth-closed/blink files) to a public/images/rare-earths/
// path. Falls back to `<id>.png` for single-file assets, and to the `base`
// layer for any character asset that doesn't define the requested layer (most
// characters only have a base pose -- mouth/blink swapping is opt-in per
// asset-library.json, not assumed for every "character" type).
export function resolveAssetSrc(assetId: string, layer?: string): string {
  const entry = byId[assetId];
  const files = entry && 'files' in entry ? (entry as any).files as Record<string, string> : undefined;

  if (files) {
    if (layer && files[layer]) return staticFile(`images/rare-earths/${files[layer]}`);
    if (files.base) return staticFile(`images/rare-earths/${files.base}`);
  }
  return staticFile(`images/rare-earths/${assetId}.png`);
}

export function hasLayer(assetId: string, layer: string): boolean {
  const entry = byId[assetId];
  const files = entry && 'files' in entry ? (entry as any).files as Record<string, string> : undefined;
  return Boolean(files && files[layer]);
}
