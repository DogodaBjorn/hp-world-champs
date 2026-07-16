// render_bg.mjs — "The Spellbook of the Boy Who Came Back"
// An illuminated wizarding tome × LEGO instruction booklet. Bakes each page as
// a parchment spread with gold illumination, framed illustration plates (our
// Gemini scenes), LEGO part-callout badges, step numbers and ribbon-bookmark
// nav. Live data (ink-themed charts/KPIs) sits on top in PBIR.
//
// Output: <Report>/StaticResources/RegisteredResources/bg_<page>.png @2x
// Usage:  node render_bg.mjs [page ...]

import { createRequire } from 'module';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..');
const SCN = join(HERE, 'scenes');
const RES = join(REPO, 'project', 'pbip', 'second-build.Report', 'StaticResources', 'RegisteredResources');
const require2 = createRequire(join(REPO, 'design_handoff_powerbi', 'package.json'));
const { chromium } = require2('playwright');
const W = 1280, H = 720;

const T = {
  ink: '#3A2A14', ink2: '#5E4A28', inkSoft: '#7A6238', red: '#7C2B22',
  gold: '#9C7A22', goldBright: '#B8912E', goldLeaf: '#C9A94A',
  leather: '#4A140F', edge: '#241407',
};
const uri = (n) => `data:image/png;base64,${readFileSync(join(SCN, `${n}.png`)).toString('base64')}`;
const PARCH = uri('parchment');

// ---- gold filigree corner (SVG) ----
function filigree(x, y, rot) {
  return `<svg style="position:absolute;left:${x}px;top:${y}px;transform:rotate(${rot}deg)" width="70" height="70" viewBox="0 0 70 70" fill="none" stroke="${T.gold}" stroke-width="1.4" opacity="0.85">
    <path d="M4 4 L4 30 M4 4 L30 4"/>
    <path d="M4 4 C 26 6 30 10 30 30 M4 4 C 6 26 10 30 30 30"/>
    <circle cx="34" cy="34" r="2.2" fill="${T.gold}" stroke="none"/>
    <path d="M12 12 c 8 0 14 6 14 14" opacity="0.6"/>
  </svg>`;
}
// double gold rule border inset in a page rect
function goldBorder(x, y, w, h) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:2px solid ${T.gold};box-shadow:inset 0 0 0 4px transparent, inset 0 0 0 5px ${T.goldBright}55;opacity:.9"></div>
  <div style="position:absolute;left:${x - 5}px;top:${y - 5}px;width:${w + 10}px;height:${h + 10}px;border:1px solid ${T.gold}66"></div>
  ${filigree(x - 6, y - 6, 0)}${filigree(x + w + 6, y - 6, 90)}${filigree(x + w + 6, y + h + 6, 180)}${filigree(x - 6, y + h + 6, 270)}`;
}
// parchment page filling the canvas + soft book vignette + binding hint
function parchmentPage() {
  return `<div style="position:absolute;inset:0;background:#000 url('${PARCH}') center/cover"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(130% 120% at 50% 45%, transparent 55%, rgba(60,35,12,.35) 100%)"></div>
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 120px 30px rgba(40,20,7,.45)"></div>`;
}
// illuminated drop cap
function dropCap(letter, x, y) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:74px;height:74px;background:linear-gradient(145deg,#6E1E17,#8C2A20);border:2px solid ${T.goldBright};box-shadow:0 2px 10px rgba(0,0,0,.35), inset 0 0 0 4px rgba(201,169,74,.25);display:flex;align-items:center;justify-content:center">
    <span style="font:700 52px Georgia,serif;color:${T.goldLeaf};text-shadow:0 1px 2px rgba(0,0,0,.4)">${letter}</span></div>`;
}
// LEGO part-callout badge
function callout(x, y, count, label) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;padding:8px 14px;background:rgba(255,250,238,.65);border:1.5px solid ${T.ink};border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,.18);display:flex;align-items:center;gap:9px">
    <svg width="26" height="18" viewBox="0 0 32 22" fill="none" stroke="${T.ink}" stroke-width="1.6"><rect x="2" y="6" width="28" height="14" rx="2"/><rect x="7" y="2" width="6" height="4" rx="1"/><rect x="19" y="2" width="6" height="4" rx="1"/></svg>
    <span style="font:800 18px Georgia,serif;color:${T.ink}">${count}<span style="font-size:13px">×</span></span>
    <span style="font:600 10px Segoe UI;letter-spacing:1px;color:${T.ink2};text-transform:uppercase">${label}</span></div>`;
}
// circled step number
function step(x, y, n) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:40px;height:40px;border-radius:50%;background:${T.leather};border:2px solid ${T.goldBright};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.3)"><span style="font:800 20px Georgia,serif;color:${T.goldLeaf}">${n}</span></div>`;
}
// framed illustration plate ("moving photograph"): scene, warmed, gold frame
function plate(scene, x, y, w, h) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;padding:7px;background:linear-gradient(145deg,${T.goldBright},#8A6A1E);box-shadow:0 6px 20px rgba(30,15,5,.45)">
    <div style="width:100%;height:100%;background:#000 url('${uri(scene)}') center/cover;box-shadow:inset 0 0 40px rgba(20,10,3,.6);position:relative">
      <div style="position:absolute;inset:0;background:linear-gradient(0deg, rgba(60,35,12,.35), rgba(60,35,12,.1)), radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(30,15,5,.4))"></div>
    </div></div>`;
}
// ink caption for a figure
function fig(x, y, w, h) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:rgba(247,240,222,.5);border:1px solid ${T.inkSoft}88;box-shadow:inset 0 0 24px rgba(120,90,40,.15)"></div>`;
}
function figCap(x, y, kick, sub) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;font:700 13px Georgia,serif;letter-spacing:.5px;color:${T.ink}">${kick}${sub ? `<div style="font:italic 400 11px Georgia,serif;color:${T.ink2};margin-top:2px">${sub}</div>` : ''}</div>`;
}
// ribbon bookmark nav on the right edge
function ribbons(active) {
  const tabs = ['I', 'II', 'III', '✦', '?'];
  let s = '';
  tabs.forEach((t, i) => {
    const on = i === active;
    const y = 150 + i * 74;
    s += `<div style="position:absolute;right:0;top:${y}px;width:${on ? 44 : 34}px;height:52px;background:linear-gradient(90deg,#6E1E17,${on ? '#9C2A20' : '#7C2318'});border:1px solid ${T.goldBright}${on ? '' : '99'};border-right:none;border-radius:6px 0 0 6px;box-shadow:-2px 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:flex-start;padding-left:8px">
      <span style="font:700 15px Georgia,serif;color:${T.goldLeaf}">${t}</span></div>`;
  });
  return s;
}
function pageNo(n) {
  return `<div style="position:absolute;left:0;bottom:20px;width:${W}px;text-align:center;font:italic 400 13px Georgia,serif;color:${T.ink2}">~ ${n} ~</div>`;
}
function turn() {
  return `<div style="position:absolute;right:64px;bottom:16px;font:italic 600 13px Georgia,serif;color:${T.red}">turn the page ❦</div>
  <div style="position:absolute;left:64px;bottom:16px;font:italic 600 13px Georgia,serif;color:${T.ink2}">❦ back</div>`;
}
function eyebrow(x, y, t) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;font:700 12px Segoe UI;letter-spacing:4px;color:${T.gold};text-transform:uppercase">${t}</div>`;
}
const gink = (t) => `<span style="color:${T.red};font-weight:700">${t}</span>`;

// ================= COVER (the closed tome) =================
function cover() {
  return `<div style="position:absolute;inset:0;background:#000 url('${uri('tome')}') center/cover"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(90deg, rgba(10,6,3,.86) 0%, rgba(10,6,3,.5) 38%, transparent 62%)"></div>
  ${eyebrow(64, 70, 'A LEGO Harry Potter Story · 2001–2026')}
  <div style="position:absolute;left:60px;top:150px;font:700 15px Segoe UI;letter-spacing:2px;color:${T.goldLeaf}">✦ ✦ ✦</div>
  <div style="position:absolute;left:58px;top:172px;font:800 74px Georgia,serif;line-height:1.0;color:#F0E6CE;text-shadow:0 2px 24px rgba(0,0,0,.7)">The Boy<br>Who Came<br><span style="color:${T.goldLeaf}">Back</span></div>
  <div style="position:absolute;left:64px;top:452px;width:150px;height:2px;background:${T.goldBright};box-shadow:0 0 12px ${T.goldBright}"></div>
  <div style="position:absolute;left:64px;top:472px;width:470px;font:italic 400 17px Georgia,serif;line-height:1.5;color:#D9CBAE">A wizarding brick history in five chapters — from the yellow years, through the silence, to the most colourful magic ever built.</div>
  <div style="position:absolute;left:64px;top:576px;padding:13px 26px;border:1.5px solid ${T.goldBright};border-radius:4px;background:rgba(20,10,4,.5);font:600 14px Georgia,serif;letter-spacing:1px;color:${T.goldLeaf}">❦  Open the book</div>
  <div style="position:absolute;left:64px;bottom:22px;font:12px 'Consolas',monospace;color:${T.goldBright}bb">Rebrickable LEGO Database · rebrickable.com</div>`;
}

// ================= CHAPTER I: The Yellow Years =================
function yellow() {
  return `${parchmentPage()}
  ${goldBorder(28, 24, 1224, 672)}
  ${ribbons(0)}
  ${step(56, 52, 'I')}
  ${eyebrow(112, 56, 'Bag One · 2001–2011')}
  <div style="position:absolute;left:110px;top:72px;font:800 34px Georgia,serif;color:${T.ink}">The Yellow Years</div>
  ${dropCap('O', 56, 130)}
  <div style="position:absolute;left:146px;top:132px;width:340px;font:400 14.5px Georgia,serif;line-height:1.6;color:${T.ink}">ne quiet decade, built in classic yellow. Small sets, few colours — the humble first act of a wizarding brick world, before the silence fell in ${gink('2011')}.</div>
  ${callout(56, 250, '67', 'sets')}
  ${callout(214, 250, '267', 'avg parts')}
  ${plate('yellow', 56, 320, 430, 300)}
  <div style="position:absolute;left:56px;top:628px;font:italic 400 12px Georgia,serif;color:${T.ink2}">Plate I · the Hogwarts Express leaves the platform</div>
  ${fig(512, 60, 720, 300)} ${figCap(528, 74, 'FIGURE 1 · EVERY SET IN VIEW', 'tap a bar to inspect · year & size runes apply')}
  ${fig(512, 380, 350, 240)} ${figCap(528, 394, 'FIGURE 2 · THE SELECTED SET', 'chosen from the left')}
  ${fig(882, 380, 350, 240)} ${figCap(898, 394, 'FIGURE 3 · ITS TRUE COLOURS', 'each mark a real brick hex')}
  ${pageNo('I')} ${turn()}`;
}

// illuminated hero numeral (for the editorial pages)
function numeral(x, y, n, sub) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;font:800 108px Georgia,serif;color:${T.goldBright};text-shadow:0 2px 2px rgba(90,20,15,.4)">${n}</div>
  <div style="position:absolute;left:${x + 4}px;top:${y + 132}px;width:180px;height:2px;background:${T.gold}"></div>
  <div style="position:absolute;left:${x + 4}px;top:${y + 142}px;width:260px;font:italic 400 15px Georgia,serif;color:${T.ink2}">${sub}</div>`;
}

// ================= CHAPTER II: …and Came Back =================
function cameback() {
  return `${parchmentPage()} ${goldBorder(28, 24, 1224, 672)} ${ribbons(1)}
  ${step(56, 52, 'II')} ${eyebrow(112, 56, 'Bag Two · 2018–today')}
  <div style="position:absolute;left:110px;top:72px;font:800 34px Georgia,serif;color:${T.ink}">…and Came Back</div>
  ${dropCap('A', 56, 130)}
  <div style="position:absolute;left:146px;top:132px;width:340px;font:400 14.5px Georgia,serif;line-height:1.6;color:${T.ink}">fter seven silent years the story returned in ${gink('2018')} — bigger sets, bolder builds, and a burst of colour. Nearly ${gink('triple')} the scale of the yellow years.</div>
  ${callout(56, 250, '142', 'sets')} ${callout(214, 250, '731', 'avg parts')}
  ${plate('cameback', 56, 320, 430, 300)}
  <div style="position:absolute;left:56px;top:628px;font:italic 400 12px Georgia,serif;color:${T.ink2}">Plate II · fireworks over the returning castle</div>
  ${fig(512, 60, 720, 300)} ${figCap(528, 74, 'FIGURE 1 · EVERY SET IN VIEW', 'tap a bar to inspect')}
  ${fig(512, 380, 350, 240)} ${figCap(528, 394, 'FIGURE 2 · THE SELECTED SET', 'chosen from the left')}
  ${fig(882, 380, 350, 240)} ${figCap(898, 394, 'FIGURE 3 · FROM YELLOW TO COLOUR', 'the palette blooms to full spectrum')}
  ${pageNo('II')} ${turn()}`;
}

// ================= CHAPTER III: The Chamber of Colours =================
function colours() {
  return `${parchmentPage()} ${goldBorder(28, 24, 1224, 672)} ${ribbons(2)}
  ${step(56, 52, 'III')} ${eyebrow(112, 56, 'Bag Three · The Chamber of Colours')}
  <div style="position:absolute;left:110px;top:72px;font:800 34px Georgia,serif;color:${T.ink}">The Chamber of Colours</div>
  ${dropCap('C', 56, 130)}
  <div style="position:absolute;left:146px;top:132px;width:350px;font:400 14px Georgia,serif;line-height:1.58;color:${T.ink}">olour is the strongest magic in brick. ${gink('Diagon Alley')} (2025) is the #2 most colourful LEGO set ever made — ${gink('2,750')} parts across a riot of real brick hues.</div>
  ${numeral(64, 250, '55', 'distinct colours in a single set')}
  ${plate('colours', 56, 452, 430, 200)}
  ${fig(512, 128, 720, 336)} ${figCap(528, 142, 'FIGURE 1 · THE COLOUR MAP', 'every colour to scale, in its true brick hex — sized by parts')}
  ${fig(512, 484, 720, 138)} ${figCap(528, 498, 'FIGURE 2 · THE COLOUR EXPLOSION', 'a relaunch built to dazzle')}
  <div style="position:absolute;right:64px;bottom:52px;padding:12px 22px;border:1.5px solid ${T.red};border-radius:4px;background:rgba(124,43,34,.12);font:600 13px Georgia,serif;color:${T.red}">…or come to the dark side ❦</div>
  ${pageNo('III')} ${turn()}`;
}

// ================= CHAPTER III (dark): The Chamber of Greys =================
function dark() {
  return `${parchmentPage()}
  <div style="position:absolute;inset:0;background:radial-gradient(120% 110% at 40% 40%, rgba(10,8,6,.45), rgba(6,5,4,.82) 100%)"></div>
  ${goldBorder(28, 24, 1224, 672)}
  <div style="position:absolute;left:56px;top:52px;width:40px;height:40px;border-radius:50%;background:#1A1512;border:2px solid ${T.gold};display:flex;align-items:center;justify-content:center"><span style="font:800 18px Georgia,serif;color:${T.goldLeaf}">☾</span></div>
  ${eyebrow(112, 56, 'The Restricted Section · after closing time')}
  <div style="position:absolute;left:110px;top:72px;font:800 34px Georgia,serif;color:#D8CBB0">The Chamber of Greys</div>
  <div style="position:absolute;left:56px;top:132px;width:400px;font:400 14.5px Georgia,serif;line-height:1.6;color:#C7B89A">Not every set dazzles. Some are built almost entirely from shadow — the greyest theme of all is <span style="color:#C97A6A;font-weight:700">Star Wars</span>, where <span style="color:#C97A6A;font-weight:700">97.9%</span> of one set is greyscale.</div>
  <div style="position:absolute;left:64px;top:240px;font:800 92px Georgia,serif;color:#CFC4A8;text-shadow:0 0 20px rgba(0,0,0,.5)">97.9%</div>
  <div style="position:absolute;left:68px;top:356px;font:italic 400 15px Georgia,serif;color:#A89A7E">of every brick is greyscale</div>
  ${plate('dark', 56, 410, 430, 240)}
  ${fig(512, 60, 720, 340)} ${figCap(528, 74, 'FIGURE 1 · COLOUR COMPOSITION', 'almost entirely grey — every mark in true hex')}
  ${fig(512, 420, 720, 200)} ${figCap(528, 434, 'FIGURE 2 · GREYEST vs BRIGHTEST', 'the dark side meets the chamber of colours')}
  <div style="position:absolute;left:64px;bottom:52px;padding:12px 22px;border:1.5px solid ${T.goldBright};border-radius:4px;background:rgba(20,14,6,.5);font:600 13px Georgia,serif;color:${T.goldLeaf}">❦ back to the colour</div>
  ${pageNo('III')} <div style="position:absolute;right:64px;bottom:16px;font:italic 600 13px Georgia,serif;color:#A89A7E">turn the page ❦</div>`;
}

// ================= CHAPTER IV: Take the Wand (explore) =================
function explore() {
  const selector = (x, y, title) => `${fig(x, y, 430, 118)}
    <div style="position:absolute;left:${x}px;top:${y + 14}px;width:430px;text-align:center;font:700 14px Georgia,serif;color:${T.red}">${title}</div>`;
  return `${parchmentPage()} ${goldBorder(28, 24, 1224, 672)} ${ribbons(3)}
  ${step(56, 52, '✦')} ${eyebrow(112, 56, 'The Final Chapter · your turn')}
  <div style="position:absolute;left:110px;top:72px;font:800 34px Georgia,serif;color:${T.ink}">Take the Wand</div>
  <div style="position:absolute;left:56px;top:126px;width:440px;font:italic 400 14px Georgia,serif;line-height:1.55;color:${T.ink2}">You have read the story — now choose your own path. Pick an era, a build size and a favourite character, and the book will find your perfect wizarding set.</div>
  ${selector(56, 196, 'CHOOSE YOUR ERA')}
  ${selector(56, 330, 'BUILD SIZE')}
  ${selector(56, 464, 'FAVOURITE CHARACTER')}
  ${fig(536, 196, 696, 300)} ${figCap(556, 214, 'YOUR PERFECT SET', 'choose all three to reveal your match')}
  ${fig(536, 512, 222, 108)} ${figCap(552, 526, 'YEAR')}
  ${fig(773, 512, 222, 108)} ${figCap(789, 526, 'PARTS')}
  ${fig(1010, 512, 222, 108)} ${figCap(1026, 526, 'MINIFIGS')}
  ${pageNo('IV')} ${turn()}`;
}

// ================= SOURCES =================
function sources() {
  const rowH = (x, y, w, t, s) => `${fig(x, y, w, 96)}
    <div style="position:absolute;left:${x + 20}px;top:${y + 18}px;font:700 14px Georgia,serif;color:${T.ink}">${t}</div>
    <div style="position:absolute;left:${x + 20}px;top:${y + 44}px;width:${w - 40}px;font:400 12.5px Georgia,serif;line-height:1.45;color:${T.ink2}">${s}</div>`;
  return `${parchmentPage()} ${goldBorder(28, 24, 1224, 672)} ${ribbons(4)}
  ${step(56, 52, '?')} ${eyebrow(112, 56, 'The Footnotes')}
  <div style="position:absolute;left:110px;top:72px;font:800 34px Georgia,serif;color:${T.ink}">Sources & Credits</div>
  <div style="position:absolute;left:56px;top:126px;width:900px;font:italic 400 13.5px Georgia,serif;color:${T.ink2}">Every brick in this story is sourced. Data, tools and trademarks belong to their owners — cited here with thanks.</div>
  ${rowH(56, 176, 570, 'Rebrickable LEGO Database', 'Every set, part, colour, minifigure and photo — rebrickable.com. The foundation of the whole story.')}
  ${rowH(646, 176, 586, 'Deneb (certified AppSource visual)', 'Daniel Marsh-Patrick — declarative Vega-Lite charts inside Power BI. The true-colour maps and blooms.')}
  ${rowH(56, 288, 570, 'LEGO®', 'A trademark of The LEGO Group, used for a non-commercial fan data-story. © The LEGO Group.')}
  ${rowH(646, 288, 586, 'Harry Potter™ / Wizarding World', 'Trademarks of Warner Bros. Entertainment Inc. Used for a non-commercial fan data-story.')}
  ${rowH(56, 400, 570, 'Cinematic artwork', 'Original brick-built wizarding scenes generated with Google Gemini 2.5 Flash Image for this entry.')}
  ${rowH(646, 400, 586, 'Contest', 'Power BI DataViz World Champs · Barcelona · Round 2. Brief & judging by the Microsoft Fabric community.')}
  ${plate('sources', 476, 520, 330, 110)}
  ${pageNo('✦')} ${turn()}`;
}

const PAGES = { cover, yellow, cameback, colours, dark, explore, sources };

// ---- render ----
const only = process.argv.slice(2);
mkdirSync(RES, { recursive: true });
const browser = await chromium.launch();
const bp = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
for (const name of Object.keys(PAGES).filter(p => !only.length || only.includes(p))) {
  const html = `<!doctype html><meta charset="utf-8"><body style="margin:0"><div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${T.edge};font-family:Georgia,serif">${PAGES[name]()}</div></body>`;
  const tmp = join(HERE, `_bg_${name}.html`);
  writeFileSync(tmp, html);
  await bp.goto(pathToFileURL(tmp).href);
  await bp.waitForTimeout(300);
  await bp.locator('div').first().screenshot({ path: join(RES, `bg_${name}.png`) });
  console.log('baked', name);
}
await browser.close();
