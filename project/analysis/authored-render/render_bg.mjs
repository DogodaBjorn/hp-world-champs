// render_bg.mjs — composite the cinematic scenes into page backgrounds.
//
// Bakes the reliable chrome (cinematic scene + dark scrim + gold magical light +
// masthead + dark-translucent card panels with gold hairlines + parchment story
// panels) into one PNG per page. Live visuals (numbers, charts, slicers) sit on
// top in PBIR with transparent backgrounds, aligned to the same layout the JS
// emits to layout_v23.json.
//
// Output: <Report>/StaticResources/RegisteredResources/bg_<page>.png  @2x
//         project/analysis/authored-render/layout_v23.json (geometry for PBIR)
//
// Usage: node render_bg.mjs [page ...]   (default: all)

import { createRequire } from 'module';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..');
const SCENES = join(HERE, 'scenes');
const RES = join(REPO, 'project', 'pbip', 'second-build.Report', 'StaticResources', 'RegisteredResources');
const require2 = createRequire(join(REPO, 'design_handoff_powerbi', 'package.json'));
const { chromium } = require2('playwright');

const W = 1280, H = 720;

// ---- tokens ----
const T = {
  ink0: '#06090F', midnight: '#0B1020', card: 'rgba(12,17,33,0.68)',
  cardSolid: '#0E1524', hair: 'rgba(201,162,39,0.55)', hairSoft: 'rgba(201,162,39,0.30)',
  gold: '#C9A227', goldBright: '#E7C765', white: '#F5F1E6', mut: '#B9B29E',
  parch: '#F1E4C6', parchInk: '#2A2010',
};

const dataUri = (p) => `data:image/png;base64,${readFileSync(p).toString('base64')}`;

// ---- reusable pieces ----
const sparkle = (c = T.goldBright) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="${c}" stroke-width="1.6"><path d="M12 2 L13.5 9 L21 12 L13.5 15 L12 22 L10.5 15 L3 12 L10.5 9 Z"/></svg>`;
const iconBrick = (c = T.goldBright) => `<svg viewBox="0 0 32 24" width="26" height="20" fill="none" stroke="${c}" stroke-width="1.5"><rect x="2" y="7" width="28" height="15" rx="2"/><rect x="7" y="3" width="6" height="4" rx="1.2"/><rect x="19" y="3" width="6" height="4" rx="1.2"/></svg>`;
const iconStud = (c = T.goldBright) => `<svg viewBox="0 0 28 28" width="24" height="24" fill="none" stroke="${c}" stroke-width="1.5"><rect x="3" y="3" width="22" height="22" rx="3"/><circle cx="14" cy="14" r="5"/></svg>`;
const iconFig = (c = T.goldBright) => `<svg viewBox="0 0 24 28" width="22" height="24" fill="none" stroke="${c}" stroke-width="1.5"><rect x="8" y="2" width="8" height="6" rx="3"/><path d="M6 9 h12 v7 a3 3 0 0 1-3 3 h-6 a3 3 0 0 1-3-3 Z"/><path d="M9 19 v6 M15 19 v6"/></svg>`;

function card(x, y, w, h, { r = 16, solid = false, glow = true } = {}) {
  const bg = solid ? T.cardSolid : T.card;
  const sh = glow ? `box-shadow:0 10px 40px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.04);` : '';
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${bg};border:1px solid ${T.hair};border-radius:${r}px;${sh}"></div>`;
}
function parchPanel(x, y, w, h, { r = 12 } = {}) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:linear-gradient(160deg,#F3E7C8,#E8D7AE);border:1px solid rgba(120,90,40,.45);border-radius:${r}px;box-shadow:0 10px 34px rgba(0,0,0,.5);"></div>`;
}
// glowing gold horizontal magical-light separator
function goldLight(x, y, w) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:2px;background:linear-gradient(90deg,transparent,${T.gold} 20%,${T.goldBright} 50%,${T.gold} 80%,transparent);box-shadow:0 0 18px 3px rgba(231,199,101,.55);"></div>
  <div style="position:absolute;left:${x + w * 0.30}px;top:${y - 7}px;width:${w * 0.40}px;height:16px;background:radial-gradient(ellipse at center, rgba(231,199,101,.35), transparent 70%);filter:blur(4px);"></div>`;
}

// scene layer with a dark scrim; `focus` shifts the cover position
function sceneLayer(scene, scrim) {
  const uri = dataUri(join(SCENES, `${scene}.png`));
  return `<div style="position:absolute;inset:0;background:#000 url('${uri}') center right/cover no-repeat;"></div>
  <div style="position:absolute;inset:0;background:${scrim};"></div>`;
}

// masthead: eyebrow + nav
function masthead(active) {
  const items = ['Cover', 'The Story', 'Explore', 'Sources'];
  const nav = items.map(n => `<span style="padding:6px 14px;border-radius:20px;font:600 12px Segoe UI;letter-spacing:.5px;color:${n === active ? T.ink0 : T.mut};background:${n === active ? T.goldBright : 'transparent'};border:1px solid ${n === active ? T.goldBright : 'rgba(201,162,39,.25)'};">${n}</span>`).join('<span style="width:6px;display:inline-block"></span>');
  return `<div style="position:absolute;left:48px;top:34px;font:700 12px Segoe UI;letter-spacing:3px;color:${T.gold}">POWER BI DATAVIZ WORLD CHAMPS · ROUND 2 · BRICK BY BRICK
    <div style="width:120px;height:2px;background:${T.gold};margin-top:8px;box-shadow:0 0 10px ${T.gold}"></div></div>
  <div style="position:absolute;right:40px;top:30px;display:flex;align-items:center">${nav}</div>`;
}

function footer(text) {
  return `<div style="position:absolute;left:48px;bottom:20px;font:12px 'Consolas',monospace;color:rgba(201,162,39,.8);letter-spacing:.3px">${text}</div>`;
}

// ---------- COVER ----------
function cover() {
  const scrim = `linear-gradient(90deg, rgba(5,8,16,.94) 0%, rgba(5,8,16,.86) 34%, rgba(5,8,16,.28) 60%, rgba(5,8,16,.5) 100%), radial-gradient(120% 90% at 30% 40%, transparent 40%, rgba(3,5,12,.6) 100%)`;
  const kpis = [
    { x: 48, icon: iconBrick(), label: 'SETS' },
    { x: 240, icon: iconStud(), label: 'PARTS' },
    { x: 432, icon: iconFig(), label: 'MINIFIGURES' },
  ];
  let kpiHtml = '';
  for (const k of kpis) {
    kpiHtml += card(k.x, 512, 176, 118, { r: 14 });
    kpiHtml += `<div style="position:absolute;left:${k.x + 18}px;top:530px">${k.icon}</div>`;
    // number is a LIVE card in PBIR; bake only label + underline
    kpiHtml += `<div style="position:absolute;left:${k.x + 18}px;top:600px;font:700 11px Segoe UI;letter-spacing:2px;color:${T.gold}">${k.label}
      <div style="width:34px;height:2px;background:${T.gold};margin-top:6px"></div></div>`;
  }
  return `${sceneLayer('cover', scrim)}
  ${masthead('Cover')}
  <div style="position:absolute;left:48px;top:96px;font:700 13px Segoe UI;letter-spacing:4px;color:${T.gold}">A LEGO HARRY POTTER STORY · 2001–2026</div>
  <div style="position:absolute;left:44px;top:120px;font:800 66px Georgia,serif;line-height:.98;color:${T.white};text-shadow:0 2px 30px rgba(0,0,0,.6)">The Boy Who<br><span style="color:${T.goldBright}">Came Back</span></div>
  <div style="position:absolute;left:48px;top:290px;width:150px;height:3px;background:${T.goldBright};box-shadow:0 0 12px ${T.goldBright}"></div>
  <div style="position:absolute;left:48px;top:312px;width:520px;font:400 17px Segoe UI;line-height:1.5;color:${T.mut}">Vanished for seven silent years — then returned in 2018 at nearly triple the scale.</div>
  ${card(48, 372, 560, 116)}
  <div style="position:absolute;left:70px;top:392px;display:flex;align-items:center;gap:10px">
    <span style="width:34px;height:34px;border:1px solid ${T.hair};border-radius:50%;display:flex;align-items:center;justify-content:center">${sparkle()}</span>
    <span style="font:700 12px Segoe UI;letter-spacing:2px;color:${T.gold}">KEY TAKEAWAY</span></div>
  <div style="position:absolute;left:70px;top:428px;width:518px;font:400 14px Segoe UI;line-height:1.5;color:${T.white}">LEGO Harry Potter went quiet after 2011, then came back bigger — more sets, more parts, and <span style="color:${T.goldBright};font-weight:700">576 minifigures</span> across two distinct builds of one story.</div>
  ${kpiHtml}
  <div style="position:absolute;left:640px;top:600px;padding:12px 26px;border:1px solid ${T.goldBright};border-radius:24px;font:700 13px Segoe UI;letter-spacing:1px;color:${T.goldBright};background:rgba(11,16,32,.5)">Open the book  ▷</div>
  ${footer('Source: Rebrickable LEGO Database (https://rebrickable.com)')}`;
}

// baked section title inside a card
function cardTitle(x, y, kicker, sub) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;font:700 13px Segoe UI;letter-spacing:1.5px;color:${T.white}">${kicker}${sub ? `<div style="font:600 11px Segoe UI;letter-spacing:.5px;color:${T.gold};margin-top:3px">${sub}</div>` : ''}</div>`;
}
function chapterHead(active, chap, title, desc) {
  return `${masthead(active)}
  ${goldLight(48, 74, 1184)}
  <div style="position:absolute;left:48px;top:90px;font:700 12px Segoe UI;letter-spacing:3px;color:${T.gold}">${chap}</div>
  <div style="position:absolute;left:46px;top:106px;font:800 30px Georgia,serif;color:${T.white}">${title}</div>
  <div style="position:absolute;left:48px;top:150px;width:900px;font:400 13.5px Segoe UI;color:${T.mut}">${desc}</div>`;
}
function prevNext() {
  return `<div style="position:absolute;right:40px;bottom:18px;display:flex;gap:10px">
    <span style="padding:8px 16px;border:1px solid ${T.hairSoft};border-radius:20px;font:600 12px Segoe UI;color:${T.mut}">◁ Back</span>
    <span style="padding:8px 16px;border:1px solid ${T.goldBright};border-radius:20px;font:700 12px Segoe UI;color:${T.goldBright}">Turn the page ▷</span></div>`;
}

// KPI band with 3 dark cells (icon+label baked, number live on top)
function kpiBand(x, y, w, h, cells) {
  let s = card(x, y, w, h);
  const third = w / 3;
  cells.forEach((c, i) => {
    const cx = x + i * third + 30;
    s += `<div style="position:absolute;left:${cx}px;top:${y + 16}px">${c.icon}</div>`;
    s += `<div style="position:absolute;left:${cx}px;top:${y + h - 30}px;font:700 11px Segoe UI;letter-spacing:2px;color:${T.gold}">${c.label}<div style="width:30px;height:2px;background:${T.gold};margin-top:5px"></div></div>`;
    if (i) s += `<div style="position:absolute;left:${x + i * third}px;top:${y + 18}px;width:1px;height:${h - 36}px;background:${T.hairSoft}"></div>`;
  });
  return s;
}

// ---------- CHAPTER I: The Yellow Years (explorer) ----------
function yellow() {
  const scrim = `linear-gradient(180deg, rgba(8,7,4,.72) 0%, rgba(8,7,4,.82) 40%, rgba(8,7,4,.9) 100%), radial-gradient(130% 100% at 70% 30%, transparent 30%, rgba(6,5,3,.55) 100%)`;
  const kb = kpiBand(48, 188, 1184, 84, [
    { icon: iconBrick(), label: 'SETS' }, { icon: iconStud(), label: 'AVG PARTS' }, { icon: iconFig(), label: 'COLOURS' },
  ]);
  return `${sceneLayer('yellow', scrim)}
  ${chapterHead('The Story', 'CHAPTER I', 'The Yellow Years · 2001–2011', 'One quiet decade in classic yellow — small sets, few colours, the humble beginning of a wizarding brick world.')}
  ${kb}
  ${card(48, 284, 620, 300)}
  ${cardTitle(72, 302, 'EVERY SET IN VIEW', 'tap a bar to inspect · year & size filters apply')}
  ${card(688, 284, 544, 300)}
  ${cardTitle(712, 302, 'SELECTED SET', 'click a set on the left')}
  ${card(48, 598, 1184, 84)}
  ${cardTitle(72, 612, 'THE PALETTE IN VIEW', 'each bar is a true brick hex — pick a set and it collapses to that set’s colours')}
  ${footer('Source: Rebrickable LEGO Database (rebrickable.com)')}
  ${prevNext()}`;
}

// parchment story text (the "reading a spellbook" moment); {g} wraps gold highlights
function story(x, y, w, h, html) {
  return `${parchPanel(x, y, w, h)}
  <div style="position:absolute;left:${x + 22}px;top:${y + 20}px;width:${w - 44}px;font:400 14.5px Georgia,serif;line-height:1.62;color:${T.parchInk}">${html}</div>`;
}
const g = (t) => `<span style="color:#7A5A12;font-weight:700">${t}</span>`;

// ---------- CHAPTER II: …and came back (explorer, colour) ----------
function cameback() {
  const scrim = `linear-gradient(180deg, rgba(6,9,20,.7) 0%, rgba(6,9,20,.82) 45%, rgba(6,9,20,.9) 100%)`;
  const kb = kpiBand(48, 188, 1184, 84, [
    { icon: iconBrick(), label: 'SETS' }, { icon: iconStud(), label: 'AVG PARTS' }, { icon: iconFig(), label: 'COLOURS' },
  ]);
  return `${sceneLayer('cameback', scrim)}
  ${chapterHead('The Story', 'CHAPTER II', 'The Boy Who Came Back · 2018–', 'The relaunch that changed everything — bigger sets, bolder builds, and a burst of colour after the silence.')}
  ${kb}
  ${card(48, 284, 620, 300)} ${cardTitle(72, 302, 'EVERY SET IN VIEW', 'tap a bar to inspect')}
  ${card(688, 284, 544, 300)} ${cardTitle(712, 302, 'SELECTED SET', 'click a set on the left')}
  ${card(48, 598, 1184, 84)} ${cardTitle(72, 612, 'FROM YELLOW TO COLOUR', 'the palette blooms from a narrow yellow band into the full spectrum')}
  ${footer('Source: Rebrickable LEGO Database (rebrickable.com)')} ${prevNext()}`;
}

// ---------- CHAPTER III: The Chamber of Colours (editorial) ----------
function colours() {
  const scrim = `linear-gradient(90deg, rgba(6,9,20,.9) 0%, rgba(6,9,20,.7) 42%, rgba(6,9,20,.35) 70%, rgba(6,9,20,.6) 100%)`;
  return `${sceneLayer('colours', scrim)}
  ${chapterHead('The Story', 'CHAPTER III', 'The Chamber of Colours', 'Colour is the strongest magic in LEGO — and one wizarding set out-coloured almost everything ever made.')}
  ${story(48, 200, 360, 250, `Diagon Alley Wizarding Shops (2025) is the ${g('#2 most colourful LEGO set ever made')} — of any theme, ever. ${g('2,750')} parts across ${g('55')} real brick colours, a riot of magic after the yellow years.`)}
  <div style="position:absolute;left:48px;top:472px;font:800 96px Georgia,serif;color:${T.goldBright};text-shadow:0 0 30px rgba(231,199,101,.4)">55</div>
  <div style="position:absolute;left:52px;top:600px;font:italic 400 15px Georgia,serif;color:${T.mut}">distinct colours in a single set</div>
  ${card(432, 200, 800, 360)} ${cardTitle(456, 218, 'LEGO HARRY POTTER COLOUR MAP', 'every colour to scale, in its true brick hex — sized by part count')}
  ${card(432, 576, 560, 106)} ${cardTitle(456, 594, 'THE COLOUR EXPLOSION', 'a relaunch built to dazzle')}
  <div style="position:absolute;left:1012px;top:600px;padding:14px 22px;border:1px solid ${T.goldBright};border-radius:24px;font:700 13px Segoe UI;color:${T.goldBright};background:rgba(11,16,32,.6)">…or come to the dark side ▷</div>
  ${footer('Source: Rebrickable LEGO Database (rebrickable.com)')} ${prevNext()}`;
}

// ---------- CHAPTER III (dark twin): come to the dark side ----------
function dark() {
  const scrim = `linear-gradient(90deg, rgba(2,3,6,.92) 0%, rgba(2,3,6,.8) 45%, rgba(2,3,6,.55) 75%, rgba(2,3,6,.8) 100%)`;
  return `${sceneLayer('dark', scrim)}
  ${chapterHead('The Story', 'CHAPTER III · THE DARK SIDE', 'The Chamber of Greys', 'Not every set dazzles. Some are built almost entirely from shadow — grey, black and silver, the colour of the dark.')}
  ${card(48, 200, 384, 250, { solid: true })} ${cardTitle(72, 218, 'THE GREYEST OF ALL', 'near-total absence of colour')}
  <div style="position:absolute;left:72px;top:262px;font:800 76px Georgia,serif;color:#CFC9BE;text-shadow:0 0 24px rgba(0,0,0,.6)">97.9%</div>
  <div style="position:absolute;left:74px;top:372px;font:italic 400 14px Georgia,serif;color:${T.mut}">of every brick is greyscale</div>
  ${card(456, 200, 776, 360, { solid: true })} ${cardTitle(480, 218, 'COLOUR COMPOSITION', 'almost entirely grey — every mark in true hex')}
  ${card(48, 476, 384, 120, { solid: true })} ${cardTitle(72, 494, 'STAR WARS vs HARRY POTTER', 'the greyest theme meets the most colourful')}
  <div style="position:absolute;left:48px;bottom:56px;padding:14px 22px;border:1px solid ${T.goldBright};border-radius:24px;font:700 13px Segoe UI;color:${T.goldBright};background:rgba(11,16,32,.6)">◁ back to the colour</div>
  ${footer('Source: Rebrickable LEGO Database (rebrickable.com)')}`;
}

// button-slicer group (baked group label + pill hints; live slicer sits on top)
function slicerGroup(x, y, w, title, pills) {
  let s = card(x, y, w, 96, { r: 12 });
  s += `<div style="position:absolute;left:0;top:${y + 14}px;width:${w + 2 * x}px;text-align:center;font:700 13px Georgia,serif;color:${T.goldBright}">${title}</div>`.replace(`width:${w + 2 * x}px`, `left:${x}px;width:${w}px`);
  return s;
}
// ---------- CHAPTER IV: Take the Wand (explore / recommender) ----------
function explore() {
  const scrim = `linear-gradient(180deg, rgba(6,9,20,.72) 0%, rgba(6,9,20,.85) 50%, rgba(6,9,20,.92) 100%)`;
  return `${sceneLayer('explore', scrim)}
  ${chapterHead('Explore', 'CHAPTER IV', 'Take the Wand', 'You have read the story — now explore it. Choose an era, a build size and a favourite character to find your perfect wizarding set.')}
  ${card(48, 196, 560, 130, { r: 12 })} <div style="position:absolute;left:48px;top:212px;width:560px;text-align:center;font:700 13px Georgia,serif;color:${T.goldBright}">CHOOSE YOUR ERA</div>
  ${card(48, 340, 560, 130, { r: 12 })} <div style="position:absolute;left:48px;top:356px;width:560px;text-align:center;font:700 13px Georgia,serif;color:${T.goldBright}">BUILD SIZE</div>
  ${card(48, 484, 560, 130, { r: 12 })} <div style="position:absolute;left:48px;top:500px;width:560px;text-align:center;font:700 13px Georgia,serif;color:${T.goldBright}">FAVOURITE CHARACTER</div>
  ${card(648, 196, 584, 300)} ${cardTitle(672, 214, 'YOUR PERFECT SET', 'choose all three to reveal your match')}
  ${card(648, 512, 180, 100)} ${card(850, 512, 180, 100)} ${card(1052, 512, 180, 100)}
  <div style="position:absolute;left:672px;top:588px;font:700 11px Segoe UI;letter-spacing:2px;color:${T.gold}">YEAR</div>
  <div style="position:absolute;left:874px;top:588px;font:700 11px Segoe UI;letter-spacing:2px;color:${T.gold}">PARTS</div>
  <div style="position:absolute;left:1076px;top:588px;font:700 11px Segoe UI;letter-spacing:2px;color:${T.gold}">MINIFIGS</div>
  ${footer('Source: Rebrickable LEGO Database (rebrickable.com)')} ${prevNext()}`;
}

// ---------- SOURCES ----------
function sources() {
  const scrim = `linear-gradient(180deg, rgba(6,9,16,.82) 0%, rgba(6,9,16,.9) 100%)`;
  const row = (x, y, w, t, s) => `${card(x, y, w, 92)}<div style="position:absolute;left:${x + 22}px;top:${y + 20}px;font:700 14px Segoe UI;color:${T.white}">${t}</div><div style="position:absolute;left:${x + 22}px;top:${y + 46}px;width:${w - 44}px;font:400 12.5px Segoe UI;color:${T.mut}">${s}</div>`;
  return `${sceneLayer('sources', scrim)}
  ${chapterHead('Sources', 'THE FOOTNOTES', 'Sources & Credits', 'Every brick in this story is sourced. Data, tools and trademarks belong to their owners — cited here with thanks.')}
  ${row(48, 196, 580, 'Rebrickable LEGO Database', 'Every set, part, colour, minifigure and photo — rebrickable.com. The foundation of the entire story.')}
  ${row(652, 196, 580, 'Deneb (certified AppSource visual)', 'Daniel Marsh-Patrick. Declarative Vega-Lite charts inside Power BI — the true-colour palettes and blooms.')}
  ${row(48, 308, 580, 'LEGO®', 'LEGO® is a trademark of The LEGO Group, used here for a non-commercial fan data-story. © The LEGO Group.')}
  ${row(652, 308, 580, 'Harry Potter™ / Wizarding World', 'Trademarks of Warner Bros. Entertainment Inc. Used for a non-commercial fan data-story.')}
  ${row(48, 420, 580, 'Cinematic artwork', 'Generated with Google Gemini 2.5 Flash Image for this entry — original brick-built wizarding scenes.')}
  ${row(652, 420, 580, 'Contest', 'Power BI DataViz World Champs · Barcelona · Round 2. Brief and judging by the Microsoft Fabric community.')}
  ${footer('Source: Rebrickable LEGO Database (rebrickable.com)')} ${prevNext()}`;
}

const PAGES = { cover, yellow, cameback, colours, dark, explore, sources };

// ---------- render ----------
const only = process.argv.slice(2);
mkdirSync(RES, { recursive: true });
const browser = await chromium.launch();
const bp = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const targets = Object.keys(PAGES).filter(p => !only.length || only.includes(p));
for (const name of targets) {
  const html = `<!doctype html><meta charset="utf-8"><body style="margin:0"><div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${T.ink0};font-family:Segoe UI">${PAGES[name]()}</div></body>`;
  const tmp = join(HERE, `_bg_${name}.html`);
  writeFileSync(tmp, html);
  await bp.goto(pathToFileURL(tmp).href);
  await bp.waitForTimeout(300);
  await bp.locator('div').first().screenshot({ path: join(RES, `bg_${name}.png`) });
  console.log('baked', name);
}
await browser.close();
