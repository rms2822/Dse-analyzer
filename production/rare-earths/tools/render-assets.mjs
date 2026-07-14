// Renders the rare-earths asset-library's 12 single-file image assets as
// hand-authored flat-vector SVG, rasterized via the pre-installed Chromium
// (Playwright). No human characters -- per the "remake with infographics"
// rework, every beat that used to be a talking-mouth character is now a
// map/icon/diagram (this file) or a pure-code component (TextCard.tsx,
// DialogueCards.tsx -- no image needed, see RareEarthsVideo.tsx). Icons/
// establishing shots use the Capital-Case palette from STYLE_GUIDE.md; the 3
// base maps use the Vox bold-data-viz palette per the "Vox graphics layer"
// restyle decision.
//
// Run: NODE_PATH=$(npm root -g) node production/rare-earths/tools/render-assets.mjs
import {writeFileSync, mkdirSync} from 'fs';
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

const VOX = {
  ocean: '#0B1B2B',
  land: '#FF3D1F',
  landAlt: '#FFC700',
  coast: '#F5F1E8',
  ink: '#08131F',
  cyan: '#00B4D8',
};

// ------------------------------------------------------------- html shell --
function page(inner) {
  return `<!doctype html><html><head><meta charset="utf-8"/><style>
    *{margin:0;padding:0}
    html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
    svg{display:block}
  </style></head><body>${inner}</body></html>`;
}

function svg(bg, body) {
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${bg}"/>
    ${body}
  </svg>`;
}

// ----------------------------------------------------------- shape utils --
const poly = (pts, fill, stroke = C.ink, sw = 8) =>
  `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;

const rrect = (x, y, w, h, r, fill, stroke = C.ink, sw = 8) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

const circ = (cx, cy, r, fill, stroke = C.ink, sw = 8) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

// -------------------------------------------------------------- write PNG --
const jobs = [];
function add(name, bg, bodyFn) {
  jobs.push({name, html: page(svg(bg, bodyFn()))});
}

// ============================================================= icons/etc =
add('product-silhouettes', C.bgPlain, () => {
  const icons = [
    (cx) => `${circ(cx, 470, 90, C.navy)}${rrect(cx - 20, 380, 40, 90, 10, C.navy)}`, // EV motor
    (cx) => `${rrect(cx - 10, 380, 20, 200, 8, C.slate)}${poly([[cx,380],[cx+140,430],[cx,470]], C.slate)}${poly([[cx,380],[cx-140,460],[cx,420]], C.slate)}${poly([[cx,380],[cx+40,240],[cx-10,380]], C.slate)}`, // turbine
    (cx) => `${rrect(cx - 100, 400, 200, 160, 30, C.teal)}${rrect(cx - 60, 440, 120, 30, 8, C.bgPlain)}`, // MRI
    (cx) => `${poly([[cx-160,470],[cx+120,430],[cx+160,470],[cx+120,510],[cx-120,490]], C.rust)}${poly([[cx-160,470],[cx-220,440],[cx-160,470],[cx-220,500]], C.rust)}`, // jet
    (cx) => `${rrect(cx - 60, 360, 120, 220, 24, C.olive)}${rrect(cx - 40, 390, 80, 140, 6, '#DCE7DC')}`, // phone
  ];
  return icons.map((f, i) => f(200 + i * 350)).join('');
});

add('ore-rock-icon', C.bgPlain, () => `
  ${poly([[896,300],[1120,420],[1080,620],[900,700],[720,600],[700,420]], C.slate)}
  ${poly([[896,300],[1000,380],[900,470],[780,420]], C.gray)}
  ${poly([[900,470],[1080,620],[900,700],[780,420]], C.rust)}
`);

add('periodic-table-strip', C.bgPlain, () => {
  const n = 17;
  const tileW = 90;
  const gap = 14;
  const totalW = n * tileW + (n - 1) * gap;
  const startX = (W - totalW) / 2;
  const colors = [C.navy, C.slate, C.teal, C.olive];
  return Array.from({length: n})
    .map((_, i) => rrect(startX + i * (tileW + gap), H / 2 - 60, tileW, 120, 10, colors[i % colors.length]))
    .join('');
});

add('magnet-icon', C.bgPlain, () => `
  <path d="M 700 300 a 220 220 0 0 1 392 0 l 0 260 l -140 0 l 0 -220 a 80 80 0 0 0 -112 0 l 0 220 l -140 0 Z"
    fill="${C.metal}" stroke="${C.ink}" stroke-width="10" stroke-linejoin="round"/>
  <rect x="700" y="560" width="140" height="130" rx="10" fill="${C.rust}" stroke="${C.ink}" stroke-width="10"/>
  <rect x="952" y="560" width="140" height="130" rx="10" fill="${C.slate}" stroke="${C.ink}" stroke-width="10"/>
`);

add('refinery-icon', C.bgOutdoorTour, () => `
  ${rrect(0, 660, W, 364, 0, '#AEBFC2')}
  ${[260, 520, 780].map((x) => `${rrect(x, 380, 120, 320, 8, C.metal)}${circ(x + 60, 380, 60, C.metal)}`).join('')}
  ${[900, 1080, 1260].map((x, i) => rrect(x, 300 + i * 20, 40, 400 - i * 20, 6, '#8B98A0')).join('')}
  ${[1420, 1470, 1520].map((x) => `<line x1="${x}" y1="700" x2="${x}" y2="600" stroke="${C.metal}" stroke-width="10" stroke-linecap="round"/>`).join('')}
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
  `;
});

add('supply-chain-flow', C.bgPlain, () => {
  const cy = H / 2 + 20;
  const arrow = (x1, x2) => `
    <line x1="${x1}" y1="${cy}" x2="${x2}" y2="${cy}" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>
    ${poly([[x2, cy - 24], [x2 + 34, cy], [x2, cy + 24]], C.ink)}
  `;
  return `
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

// =============================================================== VOX maps =
// (labels/pins come from RegionMap's overlay prop at render time, not baked
// into these base images)
add('world-map-base', VOX.ocean, () => `
  ${poly([[120,520],[260,380],[420,420],[380,600],[220,660]], VOX.land)}
  ${poly([[380,600],[520,560],[560,760],[400,820]], VOX.landAlt)}
  ${poly([[760,340],[980,300],[1060,420],[960,520],[800,480]], VOX.land)}
  ${poly([[960,520],[1180,540],[1220,660],[1000,700]], VOX.landAlt)}
  ${poly([[1180,300],[1460,260],[1620,380],[1520,520],[1280,480],[1140,420]], VOX.land)}
  ${poly([[1520,700],[1660,680],[1690,760],[1560,780]], VOX.landAlt)}
`);

add('china-map-base', VOX.ocean, () => `
  ${poly(
    [
      [560, 340],
      [760, 260],
      [1020, 300],
      [1180, 260],
      [1320, 360],
      [1300, 480],
      [1420, 560],
      [1360, 660],
      [1180, 700],
      [1040, 780],
      [880, 760],
      [820, 640],
      [660, 620],
      [600, 480],
    ],
    VOX.land,
  )}
`);

add('us-map-base', VOX.ocean, () => `
  ${poly(
    [
      [420, 420],
      [640, 360],
      [980, 340],
      [1340, 380],
      [1420, 460],
      [1340, 540],
      [1000, 560],
      [700, 560],
      [460, 540],
    ],
    VOX.land,
  )}
  ${poly([[420,420],[520,400],[540,500],[460,540]], VOX.landAlt)}
`);

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
