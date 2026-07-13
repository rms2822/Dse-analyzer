// Renders the 15-asset rare-earths asset-library (23 files incl. mouth/blink
// layers) as hand-authored flat-vector SVG, rasterized via the pre-installed
// Chromium (Playwright). Characters/icons/establishing shots use the
// Capital-Case palette from STYLE_GUIDE.md; the 3 base maps use the Vox
// bold-data-viz palette per the "Vox graphics layer" restyle decision.
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

// -------------------------------------------------------- character rig --
// One reusable "peg doll" rig: head + neck + optional hair/hat + face state.
// Mouth/eye state swap is the entire mechanism behind TalkingCharacter's
// viseme cycling, so base/mouth_open/mouth_closed/blink must be pixel-identical
// except for that one feature.
function headRig(cx, cy, r, skin, {mouth, eyes, hair} = {}) {
  let s = '';
  s += rrect(cx - 34, cy + r - 30, 68, 60, 14, skin); // neck
  s += circ(cx - r + 4, cy + 16, 20, skin); // left ear
  s += circ(cx + r - 4, cy + 16, 20, skin); // right ear
  s += circ(cx, cy, r, skin); // head
  if (hair) s += hair(cx, cy, r);
  // brows
  s += `<path d="M ${cx - 46} ${cy - 34} q 16 -10 30 -2" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
  s += `<path d="M ${cx + 16} ${cy - 36} q 14 -8 30 2" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`;
  // eyes
  if (eyes === 'blink') {
    s += `<line x1="${cx - 42}" y1="${cy - 8}" x2="${cx - 14}" y2="${cy - 8}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>`;
    s += `<line x1="${cx + 14}" y1="${cy - 8}" x2="${cx + 42}" y2="${cy - 8}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>`;
  } else {
    s += circ(cx - 28, cy - 8, 9, C.ink, 'none', 0);
    s += circ(cx + 28, cy - 8, 9, C.ink, 'none', 0);
  }
  // nose
  s += `<path d="M ${cx - 6} ${cy + 4} q -8 20 0 26 l 12 0" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`;
  // mouth
  if (mouth === 'open') {
    s += `<ellipse cx="${cx}" cy="${cy + 48}" rx="24" ry="18" fill="${C.ink}"/>`;
    s += `<ellipse cx="${cx}" cy="${cy + 43}" rx="17" ry="8" fill="#C4614A"/>`;
  } else {
    s += `<path d="M ${cx - 26} ${cy + 48} Q ${cx} ${cy + 58} ${cx + 26} ${cy + 48}" fill="none" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>`;
  }
  return s;
}

const hairCap = (color) => (cx, cy, r) =>
  `<path d="M ${cx - r} ${cy - 6} a ${r} ${r} 0 0 1 ${r * 2} 0 l 0 -14 a ${r} ${r} 0 0 0 -${r * 2} 0 Z" fill="${color}" stroke="${C.ink}" stroke-width="8" stroke-linejoin="round"/>`;

const hairCombover = (color) => (cx, cy, r) =>
  `<path d="M ${cx - r + 10} ${cy - r + 30} q ${r} -50 ${2 * r - 20} 0 q -10 -34 -${r} -30 q -${r - 10} -4 -${r - 10} 30 Z" fill="${color}" stroke="${C.ink}" stroke-width="7" stroke-linejoin="round"/>`;

const fedora = (color) => (cx, cy, r) => `
  ${rrect(cx - r - 26, cy - r + 4, 2 * r + 52, 20, 8, color)}
  ${poly([[cx - r + 10, cy - r + 4], [cx + r - 10, cy - r + 4], [cx + r - 26, cy - r - 46], [cx - r + 26, cy - r - 46]], color)}
  ${rrect(cx - r + 6, cy - r - 14, 2 * r - 12, 14, 4, '#1B1815')}
`;

const hardhat = (color) => (cx, cy, r) => `
  <path d="M ${cx - r - 4} ${cy - 4} a ${r + 4} ${r + 4} 0 0 1 ${2 * (r + 4)} 0 Z" fill="${color}" stroke="${C.ink}" stroke-width="8"/>
  ${rrect(cx - r - 16, cy - 10, 2 * r + 32, 16, 8, color)}
`;

// seated-at-desk bust: head + shoulders behind a desk edge, used for the two
// "talking head over a phone/paper" characters.
function deskCharacter({bg, skin, outfit, outfitAccent, hair, deskColor, mouth, eyes, extra = ''}) {
  const cx = W / 2;
  const cy = H / 2 - 90;
  let s = '';
  s += `<rect width="${W}" height="${H}" fill="${bg}"/>`;
  // window/back wall accent
  s += rrect(W - 420, 80, 300, 380, 16, '#00000012', 'none', 0);
  // shoulders/torso
  s += poly(
    [
      [cx - 300, H - 40],
      [cx - 220, cy + 120],
      [cx - 90, cy + 60],
      [cx + 90, cy + 60],
      [cx + 220, cy + 120],
      [cx + 300, H - 40],
    ],
    outfit,
  );
  s += rrect(cx - 44, cy + 40, 88, 40, 10, outfitAccent);
  s += headRig(cx, cy, 120, skin, {mouth, eyes, hair});
  s += extra;
  // desk
  s += rrect(0, H - 210, W, 210, 0, deskColor);
  s += rrect(0, H - 220, W, 18, 0, '#00000022', 'none', 0);
  return s;
}

// full-standing character: head + torso + simple legs, plain background.
function standingCharacter({bg, skin, outfit, outfitAccent, hair, mouth, eyes, pantsColor = '#33302A', extra = ''}) {
  const cx = W / 2;
  const cy = 300;
  let s = `<rect width="${W}" height="${H}" fill="${bg}"/>`;
  s += rrect(cx - 40, 780, 34, 200, 12, pantsColor); // legs
  s += rrect(cx + 6, 780, 34, 200, 12, pantsColor);
  s += rrect(cx - 60, 960, 76, 30, 8, '#2A2622'); // shoes
  s += poly(
    [
      [cx - 190, 800],
      [cx - 150, 430],
      [cx + 150, 430],
      [cx + 190, 800],
    ],
    outfit,
  ); // torso
  s += rrect(cx - 46, 480, 92, 46, 10, outfitAccent);
  // arms
  s += rrect(cx - 230, 460, 60, 260, 26, outfit);
  s += rrect(cx + 170, 460, 60, 260, 26, outfit);
  s += circ(cx - 200, 720, 32, skin); // hands
  s += circ(cx + 200, 720, 32, skin);
  s += headRig(cx, cy, 120, skin, {mouth, eyes, hair});
  s += extra;
  return s;
}

// -------------------------------------------------------------- write PNG --
const jobs = [];
function add(name, bg, bodyFn) {
  jobs.push({name, html: page(svg(bg, bodyFn()))});
}

// ===================================================== 1. export-official =
{
  const hair = hairCombover('#141210');
  const extra = (mouth, eyes) => {
    let s = '';
    // stamp in raised right hand
    s += circ(W / 2 + 300, H / 2 - 40, 46, C.rust);
    s += circ(W / 2 + 300, H / 2 - 40, 22, '#7A2E1C');
    s += rrect(W / 2 + 285, H / 2 - 4, 30, 60, 6, '#5C4530');
    // paper form under left hand
    s += rrect(W / 2 - 360, H / 2 + 40, 220, 150, 6, C.white);
    for (let i = 0; i < 4; i++) {
      s += `<line x1="${W / 2 - 340}" y1="${H / 2 + 70 + i * 26}" x2="${W / 2 - 170}" y2="${H / 2 + 70 + i * 26}" stroke="#C9C2AC" stroke-width="4"/>`;
    }
    return s;
  };
  for (const [layer, mouth, eyes] of [
    ['base', 'closed', 'open'],
    ['mouth-open', 'open', 'open'],
    ['mouth-closed', 'closed', 'open'],
    ['blink', 'closed', 'blink'],
  ]) {
    add(`export-official-${layer}`, C.bgOffice, () =>
      deskCharacter({
        bg: C.bgOffice,
        skin: C.skin2,
        outfit: C.navy,
        outfitAccent: C.rust,
        hair,
        deskColor: '#6B5A3E',
        mouth,
        eyes,
        extra: extra(mouth, eyes),
      }),
    );
  }
}

// =================================================== 5. narrator-analyst =
{
  const hair = fedora('#2B2622');
  const extra = () => `
    ${rrect(140, 260, 420, 560, 10, '#EDEAE0')}
    ${rrect(140, 260, 420, 560, 10, 'none', C.ink, 10)}
  `;
  for (const [layer, mouth, eyes] of [
    ['base', 'closed', 'open'],
    ['mouth-open', 'open', 'open'],
    ['mouth-closed', 'closed', 'open'],
    ['blink', 'closed', 'blink'],
  ]) {
    add(`narrator-analyst-${layer}`, C.bgPlain, () =>
      standingCharacter({
        bg: C.bgPlain,
        skin: C.skin1,
        outfit: '#5A5148',
        outfitAccent: C.denimBlue,
        hair,
        mouth,
        eyes,
        extra: extra(),
      }),
    );
  }
}

// ===================================================== 15. factory-manager =
{
  const hair = hairCap('#3A3128');
  const extra = () => `
    ${rrect(W - 430, 70, 340, 320, 14, '#BFD0D6')}
    ${rrect(W - 430, 70, 340, 320, 14, 'none', C.ink, 8)}
    ${Array.from({length: 3}).map((_, i) => rrect(W - 400 + i * 100, 120, 60, 90, 6, '#8FA6AC')).join('')}
    ${rrect(W / 2 + 40, H / 2 + 10, 90, 130, 10, '#3B322A')}
  `;
  for (const [layer, mouth, eyes] of [
    ['base', 'closed', 'open'],
    ['mouth-open', 'open', 'open'],
    ['mouth-closed', 'closed', 'open'],
  ]) {
    add(`factory-manager-${layer}`, C.bgWarehouse, () =>
      deskCharacter({
        bg: C.bgWarehouse,
        skin: C.skin3,
        outfit: C.slate,
        outfitAccent: C.hiviz,
        hair,
        deskColor: '#8A8378',
        mouth,
        eyes,
        extra: extra(),
      }),
    );
  }
}

// =============================================== 10. factory-worker-lineup =
add('factory-worker-lineup', C.bgPlain, () => {
  const rows = [
    {cx: 480, skin: C.skin1, outfit: C.denim, accent: '#B7C4CC', hat: null},
    {cx: 896, skin: C.skin2, outfit: C.hiviz, accent: '#3A3A3A', hat: hardhat('#E2A324')},
    {cx: 1312, skin: C.skin3, outfit: C.scrubs, accent: '#F4F1E8', hat: null},
  ];
  return rows
    .map(({cx, skin, outfit, accent, hat}) => {
      const cy = 300;
      let s = '';
      s += rrect(cx - 40, 780, 34, 190, 12, '#33302A');
      s += rrect(cx + 6, 780, 34, 190, 12, '#33302A');
      s += poly(
        [
          [cx - 170, 790],
          [cx - 135, 440],
          [cx + 135, 440],
          [cx + 170, 790],
        ],
        outfit,
      );
      s += rrect(cx - 100, 480, 200, 50, 10, accent);
      s += rrect(cx - 210, 460, 56, 240, 24, outfit);
      s += rrect(cx + 154, 460, 56, 240, 24, outfit);
      s += circ(cx - 182, 700, 30, skin);
      s += circ(cx + 182, 700, 30, skin);
      s += headRig(cx, cy, 110, skin, {mouth: 'closed', eyes: 'open', hair: hat});
      return s;
    })
    .join('');
});

// ===================================================== 11. deng-era-figure =
add('deng-era-figure', C.bgOutdoorTour, () => `
  ${rrect(0, 620, W, 404, 0, '#B7CDBB')}
  ${circ(300, 700, 90, '#7C9C82', 'none', 0)}
  ${circ(1500, 660, 70, '#7C9C82', 'none', 0)}
  ${standingCharacter({
    bg: 'none',
    skin: C.skin2,
    outfit: '#4B4B4B',
    outfitAccent: '#8A1F1F',
    hair: hairCombover('#111'),
    mouth: 'open',
    eyes: 'open',
    extra: `<path d="M ${W / 2 + 200} 560 q 60 -20 90 20" fill="none" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>`,
  })}
`);

// ============================================ 14. mountain-pass-worker-1980s =
add('mountain-pass-worker-1980s', C.bgDesert, () => `
  ${rrect(0, 640, W, 384, 0, '#D8C182')}
  ${poly([[1200,640],[1340,420],[1460,640]], '#B7A06A')}
  ${rrect(1500, 500, 40, 200, 6, C.metal)}
  ${rrect(1440, 470, 160, 40, 6, C.metal)}
  ${standingCharacter({
    bg: 'none',
    skin: C.skin1,
    outfit: C.hiviz,
    outfitAccent: '#4A4A4A',
    hair: hardhat('#F4C430'),
    mouth: 'closed',
    eyes: 'open',
  })}
`);

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
  ${standingCharacter({bg:'none', skin: C.skin1, outfit: C.hiviz, outfitAccent:'#4A4A4A', hair: hardhat('#F4C430'), mouth:'closed', eyes:'open'})
    .replace(`<rect width="${W}" height="${H}" fill="none"/>`, '')}
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

// =============================================================== VOX maps =
function voxLabelBadge() {
  return ''; // labels come from RegionMap overlay, not baked in
}

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
