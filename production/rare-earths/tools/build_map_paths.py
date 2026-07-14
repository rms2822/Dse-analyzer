#!/usr/bin/env python3
"""Decodes real-world country geometry (Natural Earth 110m, via the
world-atlas npm package's TopoJSON) into flat SVG path strings for the 3
rare-earths map assets, per STYLE_DECODE_v2.md's finding that the reference
video's maps are accurately recognizable geography, not abstract shapes.
Equirectangular projection (lon, -lat), simple and standard for this kind of
flat explainer map -- exact cartographic accuracy matters less than "reads as
the right place at a glance."

Outputs production/rare-earths/tools/map-paths.json: {world: [d,...],
china: [d,...], us: [d,...]} in a 1792x1024 viewBox, ready for
render-assets.mjs to fill/stroke.

Run: python3 production/rare-earths/tools/build_map_paths.py
"""
import json

SRC = '/tmp/countries-110m.json'
OUT = 'production/rare-earths/tools/map-paths.json'
W, H = 1792, 1024


def decode_arcs(topo):
    scale = topo['transform']['scale']
    translate = topo['transform']['translate']
    arcs = []
    for arc in topo['arcs']:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            lon = translate[0] + scale[0] * x
            lat = translate[1] + scale[1] * y
            pts.append((lon, lat))
        arcs.append(pts)
    return arcs


def arc_ref(arcs, i):
    if i < 0:
        return list(reversed(arcs[~i]))
    return list(arcs[i])


def ring_coords(arcs, ring):
    coords = []
    for i in ring:
        pts = arc_ref(arcs, i)
        if coords and coords[-1] == pts[0]:
            pts = pts[1:]
        coords.extend(pts)
    return coords


def geometry_rings(arcs, geom):
    """Yields each polygon ring (outer boundary only -- holes ignored, none
    of these 3 countries/the world landmass need interior holes at this
    scale) as a list of (lon, lat)."""
    if geom['type'] == 'Polygon':
        for ring in geom['arcs']:
            yield ring_coords(arcs, ring)
    elif geom['type'] == 'MultiPolygon':
        for poly in geom['arcs']:
            for ring in poly:
                yield ring_coords(arcs, ring)


def project(lon, lat, bounds, pad=40):
    lon0, lat0, lon1, lat1 = bounds
    sx = (W - 2 * pad) / (lon1 - lon0)
    sy = (H - 2 * pad) / (lat1 - lat0)
    s = min(sx, sy)
    cx = (lon0 + lon1) / 2
    cy = (lat0 + lat1) / 2
    x = W / 2 + (lon - cx) * s
    y = H / 2 - (lat - cy) * s  # screen y grows downward
    return x, y


def ring_to_path(ring, bounds):
    if len(ring) < 3:
        return None
    # antimeridian-wrapping rings (Russia, Fiji, etc. -- raw coordinates jump
    # from ~+180 to ~-180 longitude) would otherwise draw one long spurious
    # line straight across the map connecting the two far sides; split into
    # separate subpaths at the actual dateline crossing (a >180 deg raw lon
    # jump between consecutive points), before projecting.
    subrings = [[ring[0]]]
    for lon, lat in ring[1:]:
        if abs(lon - subrings[-1][-1][0]) > 170:
            subrings.append([])
        subrings[-1].append((lon, lat))
    d_parts = []
    for sr in subrings:
        if len(sr) < 3:
            continue
        pts = [project(lon, lat, bounds) for lon, lat in sr]
        d_parts.append(
            f'M {pts[0][0]:.1f} {pts[0][1]:.1f} '
            + ' '.join(f'L {x:.1f} {y:.1f}' for x, y in pts[1:])
            + ' Z'
        )
    return ' '.join(d_parts) if d_parts else None


def ring_bbox(ring):
    lons = [p[0] for p in ring]
    lats = [p[1] for p in ring]
    return min(lons), min(lats), max(lons), max(lats)


def ring_area(bbox):
    return (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])


with open(SRC) as f:
    topo = json.load(f)
arcs = decode_arcs(topo)
geoms = topo['objects']['countries']['geometries']

out = {}

# ---- China: mainland ring only (drop tiny offshore islands) ----
china_geom = next(g for g in geoms if g['properties']['name'] == 'China')
china_rings = list(geometry_rings(arcs, china_geom))
china_rings.sort(key=lambda r: ring_area(ring_bbox(r)), reverse=True)
mainland = china_rings[0]
bounds = ring_bbox(mainland)
# pad bounds a bit so the shape doesn't touch the canvas edge
lon0, lat0, lon1, lat1 = bounds
pad_lon = (lon1 - lon0) * 0.06
pad_lat = (lat1 - lat0) * 0.06
bounds = (lon0 - pad_lon, lat0 - pad_lat, lon1 + pad_lon, lat1 + pad_lat)
out['china'] = [ring_to_path(mainland, bounds)]

# ---- US: contiguous 48 only (drop Alaska/Hawaii/territories) ----
us_geom = next(g for g in geoms if g['properties']['name'] == 'United States of America')
us_rings = list(geometry_rings(arcs, us_geom))
us_rings.sort(key=lambda r: ring_area(ring_bbox(r)), reverse=True)
contiguous = us_rings[0]
bounds = ring_bbox(contiguous)
lon0, lat0, lon1, lat1 = bounds
pad_lon = (lon1 - lon0) * 0.05
pad_lat = (lat1 - lat0) * 0.05
bounds = (lon0 - pad_lon, lat0 - pad_lat, lon1 + pad_lon, lat1 + pad_lat)
out['us'] = [ring_to_path(contiguous, bounds)]
# Sacramento-ish point, so render-assets.mjs can drop a California-region
# accent mark in the right place without reimplementing the projection.
out['us_california_xy'] = list(project(-121.5, 38.6, bounds))

# ---- World: largest ~55 landmasses by bbox area (drop tiny islands/noise) ----
# China's ring(s) are kept separate from the rest so render-assets.mjs can
# highlight China within the world map (red) against the rest (neutral tone)
# -- the reference's bloc-coloring technique, adapted to our "China vs. the
# rest of the supply chain" throughline instead of Cold War alignment.
world_bounds = (-170, -56, 179, 78)  # standard world crop, trims deep Antarctica
candidates = []
for g in geoms:
    if g['properties']['name'] == 'Antarctica':
        continue
    for ring in geometry_rings(arcs, g):
        if len(ring) < 4:
            continue
        # drop anything that's entirely south of the crop -- ring_to_path
        # doesn't clip, so an uncropped far-south ring would otherwise still
        # get projected (squashed) into the visible canvas.
        if max(lat for _, lat in ring) < world_bounds[1]:
            continue
        bbox = ring_bbox(ring)
        candidates.append((ring_area(bbox), g['properties']['name'], ring))
candidates.sort(key=lambda c: c[0], reverse=True)
top = candidates[:55]
out['world'] = [p for _, name, r in top if name != 'China' and (p := ring_to_path(r, world_bounds))]
out['world_china'] = [p for _, name, r in top if name == 'China' and (p := ring_to_path(r, world_bounds))]

with open(OUT, 'w') as f:
    json.dump(out, f)
print('china rings:', len(out['china']))
print('us rings:', len(out['us']))
print('world rings:', len(out['world']))
print('wrote', OUT)
