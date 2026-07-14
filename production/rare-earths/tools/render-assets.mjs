// Renders the rare-earths asset-library's 12 single-file image assets as
// hand-authored flat-vector SVG, rasterized via the pre-installed Chromium
// (Playwright). No human characters -- per the "remake with infographics"
// rework, every beat that used to be a talking-mouth character is now a
// map/icon/diagram (this file) or a pure-code component (TextCard.tsx,
// DialogueCards.tsx -- no image needed, see RareEarthsVideo.tsx). Icons/
// establishing shots use the Capital-Case palette from STYLE_GUIDE.md; the 3
// base maps use real country/continent geometry (map-paths.json, built by
// build_map_paths.py from Natural Earth 110m data) colored per
// STYLE_DECODE_v2.md's bloc-coloring finding, replacing the original
// abstract-polygon maps that prompted the "designs aren't clear enough"
// feedback.
//
// Run: python3 production/rare-earths/tools/build_map_paths.py   (once, or
//        whenever map-paths.json needs regenerating)
//      NODE_PATH=$(npm root -g) node production/rare-earths/tools/render-assets.mjs
import {writeFileSync, mkdirSync, readFileSync} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const {chromium} = require('playwright');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../../../remotion/public/images/rare-earths');
mkdirSync(OUT_DIR, {recursive: true});

const W = 1792;
const H = 1024;

// ---------------------------------------------------------------- palette --
const C = {
  ink: '#211D18',
  paper: '#F4EEDF',
  skin1: '#E7B285',
  skin2: '#C68A5A',
  skin3: '#8B5A34',
  navy: '#2B4258',
  slate: '#43596E',
  olive: '#5C6B3F',
  rust: '#B3563A',
  teal: '#2E7B7E',
  hiviz: '#E2A324',
  denim: '#3D5A78',
  scrubs: '#7CAA9C',
  gray: '#9AA0A0',
  metal: '#7E8791',
  gold: '#C9A24A',
  bgOffice: '#E9E2CF',
  bgOutdoorTour: '#CFE1DE',
  bgDesert: '#E6D6A8',
  bgPlain: '#E3DCC9',
  bgWarehouse: '#DDE2E0',
  white: '#FBF8F0',
  denimBlue: '#345277',
};

// Matches remotion/src/voxTheme.ts, per STYLE_DECODE_v2.md's real-frame
// decode: cream/paper is the default map background, not dark ink; red is
// China's bloc-highlight color, navy is the neutral "rest of world" tone.
const VOX = {
  paper: '#F7F3E8',
  land: '#7C8A96',
  china: '#B3222E',
  navy: '#1C2B45',
  ink: '#14140F',
};

const mapPaths = JSON.parse(readFileSync(path.resolve(__dirname, 'map-paths.json'), 'utf8'));

// ------------------------------------------------------------- html shell --
function page(inner) {
  return `<!doctype html><html><head><meta charset="utf-8"/><style>
    *{margin:0;padding:0}
    html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
    svg{display:block}
  </style></head><body>${inner}</body></html>`;
}

function svg(bg, body) {
  // Paper grain + soft vignette on every asset, per STYLE_DECODE_v2.md's
  // real-frame finding #3: the reference's backgrounds have visible texture
  // (worn walls, fabric folds) -- perfectly flat SVG fills read blanker than
  // the reference. Grain is monochrome noise at low opacity; vignette is a
  // wide radial darkening at the frame edges.
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.35 0.35 0.35 0 0"/>
      </filter>
      <radialGradient id="vig" cx="50%" cy="50%" r="72%">
        <stop offset="68%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.12"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="${bg}"/>
    ${body}
    <rect width="${W}" height="${H}" fill="url(#vig)"/>
    <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.07"/>
  </svg>`;
}

// soft grounding shadow -- objects in the reference sit on the ground, they
// don't float on flat color
const shadow = (cx, cy, rx, ry = rx * 0.22, opacity = 0.13) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#14140F" opacity="${opacity}"/>`;

// simple flat cloud puff for outdoor establishing shots
const cloud = (cx, cy, s = 1, opacity = 0.85) => `
  <g opacity="${opacity}">
    <ellipse cx="${cx}" cy="${cy}" rx="${90 * s}" ry="${34 * s}" fill="#FFFFFF"/>
    <ellipse cx="${cx - 55 * s}" cy="${cy + 8 * s}" rx="${55 * s}" ry="${24 * s}" fill="#FFFFFF"/>
    <ellipse cx="${cx + 60 * s}" cy="${cy + 10 * s}" rx="${48 * s}" ry="${20 * s}" fill="#FFFFFF"/>
  </g>`;

// ----------------------------------------------------------- shape utils --
const poly = (pts, fill, stroke = C.ink, sw = 8) =>
  `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;

const rrect = (x, y, w, h, r, fill, stroke = C.ink, sw = 8) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

const circ = (cx, cy, r, fill, stroke = C.ink, sw = 8) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

// Plain generic stick figure -- per STYLE_DECODE_v2.md's real-frame finding
// (the reference's featureless white blob-person, and its personified-map-
// with-legs sight gag): round head, two dot eyes, no other facial detail, a
// thin single-line body/limbs. Used for human-scale context in establishing
// shots, not as a named/talking character -- deliberately far simpler than
// the removed export-official/narrator-analyst art.
const stickFigure = (cx, cy, scale = 1, opts = {}) => {
  const {fill = C.white, headR = 26, pose = 'stand', stroke = C.ink} = opts;
  const s = scale;
  const legs =
    pose === 'walk'
      ? `<line x1="${cx}" y1="${cy + 70 * s}" x2="${cx - 30 * s}" y2="${cy + 130 * s}" stroke="${stroke}" stroke-width="${7 * s}" stroke-linecap="round"/>
         <line x1="${cx}" y1="${cy + 70 * s}" x2="${cx + 32 * s}" y2="${cy + 122 * s}" stroke="${stroke}" stroke-width="${7 * s}" stroke-linecap="round"/>`
      : `<line x1="${cx - 14 * s}" y1="${cy + 70 * s}" x2="${cx - 14 * s}" y2="${cy + 130 * s}" stroke="${stroke}" stroke-width="${7 * s}" stroke-linecap="round"/>
         <line x1="${cx + 14 * s}" y1="${cy + 70 * s}" x2="${cx + 14 * s}" y2="${cy + 130 * s}" stroke="${stroke}" stroke-width="${7 * s}" stroke-linecap="round"/>`;
  return `
    <line x1="${cx}" y1="${cy + headR * s}" x2="${cx}" y2="${cy + 70 * s}" stroke="${stroke}" stroke-width="${7 * s}" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy + 22 * s}" x2="${cx - 34 * s}" y2="${cy + 46 * s}" stroke="${stroke}" stroke-width="${6 * s}" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy + 22 * s}" x2="${cx + 34 * s}" y2="${cy + 46 * s}" stroke="${stroke}" stroke-width="${6 * s}" stroke-linecap="round"/>
    ${legs}
    <circle cx="${cx}" cy="${cy}" r="${headR * s}" fill="${fill}" stroke="${stroke}" stroke-width="${6 * s}"/>
    <circle cx="${cx - 8 * s}" cy="${cy - 2 * s}" r="${3 * s}" fill="${stroke}"/>
    <circle cx="${cx + 8 * s}" cy="${cy - 2 * s}" r="${3 * s}" fill="${stroke}"/>
  `;
};

// -------------------------------------------------------------- write PNG --
const jobs = [];
function add(name, bg, bodyFn) {
  jobs.push({name, html: page(svg(bg, bodyFn()))});
}

// ============================================================= icons/etc =
add('product-silhouettes', C.bgPlain, () => {
  // sharper, more literally-recognizable pictograms than the v1 pass, per
  // the "redo assets for clarity" request -- each icon reads at a glance
  // without needing the caption to explain it.
  const icons = [
    (cx) => `
      ${circ(cx, 470, 95, 'none', C.navy, 14)}
      ${circ(cx, 470, 58, C.navy)}
      ${Array.from({length: 8}).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * 95, y1 = 470 + Math.sin(a) * 95;
        const x2 = cx + Math.cos(a) * 118, y2 = 470 + Math.sin(a) * 118;
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/>`;
      }).join('')}
    `, // EV motor: stator coil rendered as a spoked ring, unambiguously "motor"
    (cx) => `
      ${rrect(cx - 9, 470, 18, 210, 6, C.slate)}
      ${circ(cx, 470, 20, C.slate)}
      ${poly([[cx,470],[cx+18,320],[cx+52,400]], C.slate)}
      ${poly([[cx,470],[cx-40,340],[cx+2,320]], C.slate)}
      ${poly([[cx,470],[cx-30,560],[cx-2,478]], C.slate)}
    `, // wind turbine: 3 evenly-spaced blades around a clear hub, not warped
    (cx) => `
      ${rrect(cx - 110, 380, 220, 200, 20, C.teal)}
      ${rrect(cx - 78, 412, 156, 136, 10, C.bgPlain)}
      ${circ(cx, 480, 46, 'none', C.teal, 8)}
    `, // MRI: donut-bore scanner, immediately reads as medical imaging
    (cx) => `
      ${poly([[cx-170,470],[cx+80,440],[cx+170,470],[cx+80,500],[cx-140,486]], C.rust)}
      ${poly([[cx-40,455],[cx-10,395],[cx+30,450]], C.rust)}
      ${poly([[cx-40,486],[cx-10,546],[cx+30,491]], C.rust)}
      ${poly([[cx+170,470],[cx+205,462],[cx+205,478]], C.rust)}
    `, // fighter jet: delta body + swept wings + tail fin, clean silhouette
    (cx) => `
      ${rrect(cx - 62, 360, 124, 220, 22, C.olive)}
      ${rrect(cx - 44, 388, 88, 148, 6, '#E7EFE3')}
      ${circ(cx, 560, 8, '#E7EFE3')}
    `, // phone: rounded body + screen + home button, unmistakably a phone
  ];
  return (
    [200, 550, 900, 1250, 1600].map((cx) => shadow(cx, 640, 130, 22)).join('') +
    icons.map((f, i) => f(200 + i * 350)).join('') +
    stickFigure(1720, 620, 0.85, {fill: C.olive})
  );
});

add('ore-rock-icon', C.bgPlain, () => `
  ${shadow(896, 720, 260, 36)}
  ${poly([[896,300],[1120,420],[1080,620],[900,700],[720,600],[700,420]], C.slate)}
  ${poly([[896,300],[1000,380],[900,470],[780,420]], C.gray)}
  ${poly([[900,470],[1080,620],[900,700],[780,420]], C.rust)}
  ${poly([[780,420],[900,470],[820,540],[740,500]], '#8A94A0')}
`);

add('periodic-table-strip', C.bgPlain, () => {
  // real periodic-table tiles (number + symbol corner mark), not plain color
  // bars -- reads as "the periodic table" rather than an abstract stripe set.
  const n = 17;
  const tileW = 90;
  const gap = 14;
  const totalW = n * tileW + (n - 1) * gap;
  const startX = (W - totalW) / 2;
  const colors = [C.navy, C.slate, C.teal, C.olive];
  const symbols = ['Sc','Y','La','Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu'];
  return Array.from({length: n})
    .map((_, i) => {
      const x = startX + i * (tileW + gap);
      const y = H / 2 - 60;
      return `
        ${rrect(x, y, tileW, 120, 10, colors[i % colors.length])}
        <text x="${x + 14}" y="${y + 34}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="20" fill="rgba(255,255,255,0.7)">${i + 21}</text>
        <text x="${x + tileW / 2}" y="${y + 84}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="30" fill="#FBF8F0">${symbols[i]}</text>
      `;
    })
    .join('');
});

add('magnet-icon', C.bgPlain, () => `
  ${shadow(896, 740, 250, 34)}
  <path d="M 700 300 a 220 220 0 0 1 392 0 l 0 260 l -140 0 l 0 -220 a 80 80 0 0 0 -112 0 l 0 220 l -140 0 Z"
    fill="${C.metal}" stroke="${C.ink}" stroke-width="10" stroke-linejoin="round"/>
  <rect x="700" y="560" width="140" height="130" rx="10" fill="${C.rust}" stroke="${C.ink}" stroke-width="10"/>
  <rect x="952" y="560" width="140" height="130" rx="10" fill="${C.slate}" stroke="${C.ink}" stroke-width="10"/>
  <line x1="740" y1="740" x2="700" y2="790" stroke="${C.ink}" stroke-width="7" stroke-linecap="round" opacity="0.5"/>
  <line x1="896" y1="750" x2="896" y2="805" stroke="${C.ink}" stroke-width="7" stroke-linecap="round" opacity="0.5"/>
  <line x1="1052" y1="740" x2="1092" y2="790" stroke="${C.ink}" stroke-width="7" stroke-linecap="round" opacity="0.5"/>
`);

add('refinery-icon', C.bgOutdoorTour, () => `
  ${cloud(300, 150, 1.1)}
  ${cloud(1500, 110, 0.9, 0.7)}
  ${cloud(1000, 200, 0.7, 0.6)}
  ${rrect(0, 660, W, 364, 0, '#AEBFC2')}
  ${shadow(520, 700, 420, 26, 0.1)}
  ${[260, 520, 780].map((x) => `${rrect(x, 380, 120, 320, 8, C.metal)}${circ(x + 60, 380, 60, C.metal)}`).join('')}
  ${[900, 1080, 1260].map((x, i) => rrect(x, 300 + i * 20, 40, 400 - i * 20, 6, '#8B98A0')).join('')}
  ${[928, 1108].map((x, i) => cloud(x, 240 - i * 30, 0.45, 0.5)).join('')}
  ${[1420, 1470, 1520].map((x) => `<line x1="${x}" y1="700" x2="${x}" y2="600" stroke="${C.metal}" stroke-width="10" stroke-linecap="round"/>`).join('')}
  ${shadow(430, 972, 90, 14)}
  ${shadow(660, 985, 76, 12)}
  ${stickFigure(430, 830, 1.1, {fill: C.hiviz})}
  ${stickFigure(660, 850, 0.9, {fill: C.hiviz, pose: 'walk'})}
`);

add('mountain-pass-mine', C.bgDesert, () => {
  // bird's-eye terraced open-pit bowl: concentric rings stepping down in both
  // radius and value, the standard schematic read for "open-pit mine."
  const cx = W / 2;
  const cy = H / 2 + 40;
  const rings = [
    {rx: 760, ry: 340, fill: '#CBAE72'},
    {rx: 620, ry: 270, fill: '#BFA166'},
    {rx: 480, ry: 205, fill: '#B3945B'},
    {rx: 340, ry: 145, fill: '#A6874F'},
    {rx: 200, ry: 90, fill: '#977844'},
    {rx: 90, ry: 42, fill: '#7C6538'},
  ];
  const ellipse = (rx, ry, fill) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${C.ink}" stroke-width="6"/>`;
  const truck = (x, y, scale = 1) => `
    ${rrect(x, y, 70 * scale, 34 * scale, 6, '#4A4E52')}
    ${rrect(x + 44 * scale, y - 16 * scale, 30 * scale, 26 * scale, 4, '#5A5E62')}
    ${circ(x + 14 * scale, y + 34 * scale, 10 * scale, '#1E1E1E')}
    ${circ(x + 54 * scale, y + 34 * scale, 10 * scale, '#1E1E1E')}
  `;
  return `
    ${rings.map((r) => ellipse(r.rx, r.ry, r.fill)).join('')}
    ${truck(cx - 560, cy + 120, 1.1)}
    ${truck(cx + 260, cy - 200, 0.8)}
    ${rrect(cx + 640, 200, 16, 220, 4, C.metal)}
    ${poly([[cx + 648, 200], [cx + 760, 240], [cx + 648, 270]], C.rust)}
    ${stickFigure(cx - 440, cy + 165, 0.85, {fill: C.hiviz})}
  `;
});

// ============================================= new infographic replacements
// (replacing the removed export-official / narrator-analyst / factory-manager
// character assets per the "no human characters" rework)
add('ministry-document-icon', C.bgOffice, () => {
  const cx = W / 2;
  const cy = H / 2;
  let s = '';
  s += rrect(cx - 260, cy - 320, 520, 640, 10, C.white);
  s += rrect(cx - 260, cy - 320, 520, 90, 10, C.navy);
  for (let i = 0; i < 6; i++) {
    s += `<line x1="${cx - 190}" y1="${cy - 160 + i * 60}" x2="${cx + 190}" y2="${cy - 160 + i * 60}" stroke="#C9C2AC" stroke-width="6"/>`;
  }
  // wax-seal / stamp circle, bottom right of the document
  s += circ(cx + 150, cy + 260, 70, C.rust);
  s += circ(cx + 150, cy + 260, 40, '#7A2E1C');
  // generic clerk figure beside the document, for scale/presence -- plain
  // stick figure, not a named/talking character
  s += shadow(cx - 470, cy + 420, 100, 16);
  s += stickFigure(cx - 470, cy + 260, 1.15, {fill: C.white});
  return s;
});

add('whiteboard-icon', C.bgPlain, () => {
  const cx = W / 2;
  return `
    ${rrect(cx - 460, 160, 920, 620, 12, '#F5F3EA')}
    ${rrect(cx - 460, 160, 920, 620, 12, 'none', C.ink, 10)}
    ${rrect(cx - 500, 780, 1000, 26, 6, '#8A8378')}
    ${circ(cx - 420, 793, 12, C.rust)}
    ${circ(cx - 380, 793, 12, C.navy)}
    ${circ(cx - 340, 793, 12, C.olive)}
    ${shadow(cx + 610, 818, 105, 16)}
    ${stickFigure(cx + 610, 650, 1.2, {fill: C.white})}
  `;
});

add('supply-chain-flow', C.bgPlain, () => {
  const cy = H / 2 + 20;
  const arrow = (x1, x2) => `
    <line x1="${x1}" y1="${cy}" x2="${x2}" y2="${cy}" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>
    ${poly([[x2, cy - 24], [x2 + 34, cy], [x2, cy + 24]], C.ink)}
  `;
  return `
    ${shadow(300, cy + 190, 170, 24)}
    ${shadow(896, cy + 200, 180, 24)}
    ${shadow(1492, cy + 190, 170, 24)}
    ${circ(300, cy, 150, '#F0EADA', C.ink, 8)}
    ${poly([[300,cy-90],[380,cy-10],[360,cy+90],[280,cy+120],[210,cy+60],[220,cy-10]], C.slate)}

    ${arrow(480, 660)}

    ${circ(896, cy, 160, '#F6D9CE', C.rust, 16)}
    ${rrect(826, cy - 90, 140, 180, 16, C.teal)}
    ${rrect(858, cy - 140, 76, 60, 10, C.teal)}

    ${arrow(1096, 1276)}

    ${circ(1492, cy, 150, '#F0EADA', C.ink, 8)}
    <path d="M ${1492 - 100} ${cy - 100} a 100 100 0 0 1 200 0 l 0 120 l -66 0 l 0 -100 a 36 36 0 0 0 -68 0 l 0 100 l -66 0 Z"
      fill="${C.metal}" stroke="${C.ink}" stroke-width="8" stroke-linejoin="round"/>

    <text x="896" y="${cy + 250}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="34" fill="${C.ink}">REFINING</text>
  `;
});

// =============================================================== real maps =
// Real country/continent geometry from map-paths.json (see
// build_map_paths.py) -- labels/pins still come from RegionMap's overlay
// prop at render time, not baked into these base images.
const fillPath = (d, fill, stroke = VOX.ink, sw = 6) =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;

add('world-map-base', VOX.paper, () =>
  [
    ...mapPaths.world.map((d) => fillPath(d, VOX.land, 'none', 0)),
    ...mapPaths.world_china.map((d) => fillPath(d, VOX.china, 'none', 0)),
  ].join(''),
);

add('china-map-base', VOX.paper, () => `
  <g transform="translate(10,14)" opacity="0.15">${mapPaths.china.map((d) => fillPath(d, VOX.ink, 'none', 0)).join('')}</g>
  ${mapPaths.china.map((d) => fillPath(d, VOX.china)).join('')}
`);

add('us-map-base', VOX.paper, () => {
  const [cx, cy] = mapPaths.us_california_xy;
  return `
    <g transform="translate(10,14)" opacity="0.15">${mapPaths.us.map((d) => fillPath(d, VOX.ink, 'none', 0)).join('')}</g>
    ${mapPaths.us.map((d) => fillPath(d, VOX.navy)).join('')}
    ${circ(cx, cy, 22, VOX.china)}
    ${circ(cx, cy, 22, 'none', VOX.paper, 4)}
  `;
});

// -------------------------------------------------------------- render all --
const manifest = [];
const browser = await chromium.launch();
const page1 = await browser.newPage({viewport: {width: W, height: H}});
for (const job of jobs) {
  await page1.setContent(job.html, {waitUntil: 'load'});
  const el = await page1.$('svg');
  const buf = await el.screenshot();
  const filename = `${job.name}.png`;
  writeFileSync(path.join(OUT_DIR, filename), buf);
  manifest.push(filename);
  console.log('wrote', filename);
}
await browser.close();
console.log(`\n${manifest.length} assets written to ${OUT_DIR}`);
