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
const W = 1280, H = 720;          // landscape spreads (the opened book)
const CW = 800, CH = 1200;        // portrait cover (the closed book), a 2:3 novel

const T = {
  ink: '#3A2A14', ink2: '#5E4A28', inkSoft: '#7A6238', red: '#7C2B22',
  gold: '#9C7A22', goldBright: '#B8912E', goldLeaf: '#C9A94A',
  leather: '#4A140F', edge: '#241407',
};
const uri = (n) => `data:image/png;base64,${readFileSync(join(SCN, `${n}.png`)).toString('base64')}`;
const PARCH = uri('parchment');
// real Rebrickable product photos already in the repo (jpg) -> LEGO connection
const resJpg = (f) => `data:image/jpeg;base64,${readFileSync(join(RES, f)).toString('base64')}`;
// faint LEGO baseplate stud texture for plot areas
const STUD = `background-image:radial-gradient(circle at 7px 7px, rgba(120,90,40,.09) 2.6px, transparent 3.2px);background-size:22px 22px`;

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
// ink caption for a figure — on a faint LEGO baseplate of studs
function fig(x, y, w, h) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:rgba(247,240,222,.5);${STUD};border:1px solid ${T.inkSoft}88;box-shadow:inset 0 0 24px rgba(120,90,40,.15)"></div>`;
}
// clean LEGO instruction-manual product-shot card (holds a real Rebrickable
// photo — live in Desktop, or baked). A 2x2 stud tab sits on the corner.
function productCard(x, y, w, h, caption, imgFile) {
  const img = imgFile ? `background:#fff url('${resJpg(imgFile)}') center/contain no-repeat;` : 'background:#FBFAF7;';
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;padding:6px;background:linear-gradient(180deg,#FCFBF8,#F2ECDD);border:1.5px solid ${T.ink};box-shadow:0 4px 14px rgba(40,25,8,.28)">
    <div style="width:100%;height:100%;${img}box-shadow:inset 0 0 0 1px rgba(58,42,20,.15)"></div></div>
    <div style="position:absolute;left:${x + 10}px;top:${y - 9}px;display:flex;gap:3px">
      <span style="width:12px;height:8px;background:${T.red};border-radius:2px 2px 0 0;border:1px solid ${T.ink}"></span>
      <span style="width:12px;height:8px;background:${T.goldBright};border-radius:2px 2px 0 0;border:1px solid ${T.ink}"></span></div>
    ${caption ? `<div style="position:absolute;left:${x + 4}px;top:${y + h + 8}px;font:italic 400 11px Georgia,serif;color:${T.ink2}">${caption}</div>` : ''}`;
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
  return `<div style="position:absolute;right:64px;bottom:34px;font:italic 600 13px Georgia,serif;color:${T.red}">turn the page ❦</div>
  <div style="position:absolute;left:64px;bottom:34px;font:italic 600 13px Georgia,serif;color:${T.ink2}">❦ back</div>`;
}
// transparent LEGO cutout floating on the page (no white box)
function cutImg(n, x, y, w) {
  return `<img src="${uri(n)}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;filter:drop-shadow(0 8px 12px rgba(0,0,0,.45))">`;
}
function eyebrow(x, y, t) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;font:700 12px Segoe UI;letter-spacing:4px;color:${T.gold};text-transform:uppercase">${t}</div>`;
}
const gink = (t) => `<span style="color:${T.red};font-weight:700">${t}</span>`;

// ================= FRONT COVER (portrait — a bound HP-style novel) =================
// The CLOSED book: a 2:3 portrait cover with an ornate gilt border, gilded title,
// a framed night-castle illustration and a parchment plaque carrying the key
// takeaway + the gap chart. 'open the book' turns to the landscape spreads.
const sparkle = (stroke) => `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="${stroke}" stroke-width="1.5"><path d="M12 2 L13.5 9 L21 12 L13.5 15 L12 22 L10.5 15 L3 12 L10.5 9 Z"/></svg>`;
function cover() {
  return `
  <!-- deep bound-cover backdrop: candlelit oxblood into midnight -->
  <div style="position:absolute;inset:0;background:radial-gradient(120% 78% at 50% 12%, #5C1B13 0%, #3C1310 40%, #1E0C1C 78%, #0B0712 100%)"></div>
  <div style="position:absolute;inset:0;opacity:.5;background-image:repeating-linear-gradient(93deg, rgba(0,0,0,.05) 0 2px, transparent 2px 6px)"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(48% 24% at 50% 5%, rgba(232,201,120,.22), transparent 72%)"></div>
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 150px 46px rgba(6,3,8,.75)"></div>
  <!-- ornate gilt border with side pillars (evokes a classic HP book cover) -->
  <div style="position:absolute;left:22px;top:22px;right:22px;bottom:22px;border:2.5px solid ${T.goldLeaf};box-shadow:inset 0 0 0 4px rgba(0,0,0,.3), 0 0 26px rgba(201,169,74,.16)"></div>
  <div style="position:absolute;left:30px;top:30px;right:30px;bottom:30px;border:1px solid rgba(201,169,74,.55)"></div>
  <div style="position:absolute;left:44px;top:60px;bottom:60px;width:2px;background:linear-gradient(180deg,transparent,${T.gold}99 12%,${T.gold}99 88%,transparent)"></div>
  <div style="position:absolute;right:44px;top:60px;bottom:60px;width:2px;background:linear-gradient(180deg,transparent,${T.gold}99 12%,${T.gold}99 88%,transparent)"></div>
  ${filigree(28, 28, 0)}${filigree(702, 28, 90)}${filigree(702, 1102, 180)}${filigree(28, 1102, 270)}
  <div style="position:absolute;left:${CW / 2 - 8}px;top:26px;width:16px;height:16px;background:${T.goldLeaf};transform:rotate(45deg)"></div>
  <div style="position:absolute;left:${CW / 2 - 8}px;top:1158px;width:16px;height:16px;background:${T.goldLeaf};transform:rotate(45deg)"></div>
  <!-- gilt title block -->
  <div style="position:absolute;left:${CW / 2 - 27}px;top:52px;width:54px;height:54px;border:2px solid ${T.goldLeaf};border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px rgba(201,169,74,.35)">
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="${T.goldLeaf}" stroke-width="1.4"><path d="M14 2 L6 13 L11 13 L10 22 L18 9 L13 9 Z"/></svg></div>
  <div style="position:absolute;left:0;top:120px;width:${CW}px;text-align:center;font:700 15px Segoe UI;letter-spacing:8px;color:${T.goldLeaf}">HARRY POTTER LEGO</div>
  <div style="position:absolute;left:0;top:146px;width:${CW}px;text-align:center;font:800 56px Georgia,serif;line-height:1.02;letter-spacing:.5px;color:#E8CF88;text-shadow:0 2px 1px rgba(0,0,0,.65),0 -1px 0 rgba(255,240,200,.22)">The Boy Who<br><span style="color:#F3E3AE">Came Back</span></div>
  <div style="position:absolute;left:${CW / 2 - 130}px;top:284px;width:260px;height:1px;background:linear-gradient(90deg,transparent,${T.goldLeaf},transparent)"></div>
  <div style="position:absolute;left:0;top:294px;width:${CW}px;text-align:center;font:italic 400 14px Georgia,serif;color:#D8BE7E">a LEGO® brick history in colour · 2001–2026</div>
  <!-- framed night-castle illustration (the cover art), arched like a book plate -->
  <div style="position:absolute;left:120px;top:334px;width:560px;height:372px;padding:8px;background:linear-gradient(150deg,${T.goldBright},#7E611B);border-radius:270px 270px 12px 12px;box-shadow:0 12px 34px rgba(0,0,0,.55)">
    <div style="width:100%;height:100%;overflow:hidden;border-radius:264px 264px 8px 8px;background:#000 url('${uri('cover')}') center/cover;position:relative">
      <div style="position:absolute;inset:0;background:linear-gradient(0deg, rgba(20,10,20,.5), transparent 45%), radial-gradient(120% 90% at 50% 30%, transparent 55%, rgba(15,8,15,.5))"></div>
    </div></div>
  <div style="position:absolute;left:0;top:732px;width:${CW}px;text-align:center;font:italic 400 13px Georgia,serif;color:#C9AE72">the castle, after the silence</div>
  <!-- parchment plaque: the key takeaway + the gap chart -->
  <div style="position:absolute;left:64px;top:750px;width:672px;height:362px;background:#000 url('${PARCH}') center/cover;box-shadow:0 12px 30px rgba(0,0,0,.5), inset 0 0 40px rgba(60,35,12,.22);border:2px solid ${T.goldLeaf}"></div>
  <div style="position:absolute;left:70px;top:756px;width:660px;height:350px;border:1px solid ${T.gold}88"></div>
  <div style="position:absolute;left:88px;top:772px;width:672px;text-align:center;display:flex;justify-content:center;align-items:center;gap:8px">${sparkle(T.red)}<span style="font:700 12px Segoe UI;letter-spacing:3px;color:${T.red}">KEY TAKEAWAY</span></div>
  <div style="position:absolute;left:88px;top:796px;width:624px;text-align:center;font:800 30px Georgia,serif;line-height:1.1;color:${T.ink}">It took <span style="color:${T.red}">seven years</span> for Harry to reappear.</div>
  ${figCap(90, 872, 'SETS SHIPPED PER YEAR · 2001–2026', 'the silent years 2012–2017 stand empty on the shelf')}
  ${fig(90, 908, 620, 150)}
  <div style="position:absolute;left:64px;top:1074px;width:672px;text-align:center;font:700 12px Georgia,serif;color:${T.ink2}">209 sets&nbsp;&nbsp;·&nbsp;&nbsp;576 minifigures&nbsp;&nbsp;·&nbsp;&nbsp;7 silent years</div>
  <!-- footer -->
  <div style="position:absolute;left:0;top:1134px;width:${CW}px;text-align:center;font:italic 600 15px Georgia,serif;color:#E8CF88">open the book ❦</div>`;
}

// ================= CHAPTER I: The Yellow Years =================
function yellow() {
  return `${parchmentPage()}
  ${goldBorder(28, 24, 1224, 672)}
  ${ribbons(0)}
  ${step(56, 52, 'I')}
  ${eyebrow(112, 56, 'Bag One · 2001–2011')}
  <div style="position:absolute;left:110px;top:70px;font:800 34px Georgia,serif;color:${T.ink}">The Yellow Years</div>
  <div style="position:absolute;left:112px;top:110px;font:italic 600 15px Georgia,serif;color:${T.red}">…and then he vanished</div>
  ${dropCap('O', 56, 148)}
  <div style="position:absolute;left:146px;top:150px;width:340px;font:400 14.5px Georgia,serif;line-height:1.58;color:${T.ink}">ne quiet decade, built in classic yellow. Small sets, few colours — the humble first act of a wizarding brick world, until the silence fell in ${gink('2011')}.</div>
  ${callout(56, 250, '67', 'sets')}
  ${callout(214, 250, '267', 'avg parts')}
  ${plate('yellow', 56, 320, 430, 300)}
  ${clue(232, 486)} ${clue(406, 558)}
  <div style="position:absolute;left:56px;top:640px;font:italic 400 12px Georgia,serif;color:${T.ink2}">Plate I · the Hogwarts Express · tap a ✦ to meet the yellow cast</div>
  ${fig(512, 60, 720, 300)} ${figCap(528, 74, 'FIGURE 1 · EVERY SET IN VIEW', 'tap a bar to inspect · year & size runes apply')}
  ${fig(512, 380, 350, 240)} ${figCap(528, 394, 'FIGURE 2 · THE SELECTED SET', 'chosen from Figure 1 above')}
  ${fig(882, 380, 350, 240)} ${figCap(898, 394, 'FIGURE 3 · ITS TRUE COLOURS', 'each tile a real brick colour · size = its parts in the set')}
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
  <div style="position:absolute;left:110px;top:70px;font:800 34px Georgia,serif;color:${T.ink}">The Colour Years</div>
  <div style="position:absolute;left:112px;top:110px;font:italic 600 15px Georgia,serif;color:${T.red}">…and then he came back</div>
  ${dropCap('A', 56, 148)}
  <div style="position:absolute;left:146px;top:150px;width:340px;font:400 14.5px Georgia,serif;line-height:1.58;color:${T.ink}">fter seven silent years the story returned in ${gink('2018')} — bigger sets, bolder builds, and a burst of colour. Nearly ${gink('triple')} the scale of the yellow years.</div>
  ${callout(56, 250, '142', 'sets')} ${callout(214, 250, '731', 'avg parts')}
  ${plate('cameback', 56, 320, 430, 300)}
  ${clue(140, 462)} ${clue(392, 470)} ${clue(250, 578)}
  <div style="position:absolute;left:56px;top:640px;font:italic 400 12px Georgia,serif;color:${T.ink2}">Plate II · the colour returns · tap a ✦ to uncover three hidden tales</div>
  ${fig(512, 60, 720, 300)} ${figCap(528, 74, 'FIGURE 1 · EVERY SET IN VIEW', 'tap a bar to inspect')}
  ${fig(512, 380, 350, 240)} ${figCap(528, 394, 'FIGURE 2 · THE SELECTED SET', 'chosen from Figure 1 above')}
  ${fig(882, 380, 350, 240)} ${figCap(898, 394, 'FIGURE 3 · FROM YELLOW TO COLOUR', 'each tile a real brick colour · size = its parts in the set')}
  ${pageNo('II')} ${turn()}`;
}

// tappable "clue" marker — a gold disc with a dark ring + halo, so it reads as
// an interactive spot on any background (an always-on affordance over the set)
function clue(x, y) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 42% 38%, #F5E6B4 0%, #D8B24E 55%, #9C7A22 100%);border:2px solid #5A2E12;box-shadow:0 0 0 3px rgba(232,201,120,.45), 0 0 18px 6px rgba(232,201,120,.6), 0 3px 6px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center">
    <span style="font:800 17px Georgia,serif;color:#5A2E12">✦</span></div>`;
}
// a small gilt ribbon banner for a headline claim
function goldRibbon(x, y, w, text) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;padding:9px 14px;background:linear-gradient(180deg,#8A6A1E,#6E5417);border:1px solid ${T.goldLeaf};border-radius:4px;box-shadow:0 3px 8px rgba(0,0,0,.3);text-align:center;font:800 11px Segoe UI;letter-spacing:1.2px;color:#F3E3AE;text-transform:uppercase">${text}</div>`;
}
// a "minifig-tip": a transparent minifig + a parchment speech-scroll (a hidden
// reveal shown when a clue is tapped). Rendered standalone on transparent bg.
function minifigTip(cut, phrase, name, accent, figH = 224, sx = 158, sw = 258, cta = '') {
  return `<img src="${uri(cut)}" style="position:absolute;left:8px;bottom:8px;height:${figH}px;filter:drop-shadow(0 12px 16px rgba(0,0,0,.5))">
  <div style="position:absolute;left:${sx}px;top:18px;width:${sw}px;padding:15px 18px;background:#000 url('${PARCH}') center/cover;border:2px solid ${T.goldLeaf};border-radius:14px;box-shadow:0 12px 28px rgba(0,0,0,.45)">
    <div style="font:800 11px Segoe UI;letter-spacing:1.5px;color:${accent};text-transform:uppercase;margin-bottom:6px;padding-right:16px">${name}</div>
    <div style="font:italic 400 14px Georgia,serif;line-height:1.5;color:${T.ink}">${phrase}</div>
    ${cta ? `<div style="margin-top:11px;padding-top:9px;border-top:1px solid ${T.goldLeaf}66;font:italic 800 13px Georgia,serif;color:${T.red};text-decoration:underline;text-underline-offset:3px">${cta} ❦</div>` : ''}
    ${closeX()}
    <div style="position:absolute;left:-15px;top:64px;width:0;height:0;border-top:9px solid transparent;border-bottom:9px solid transparent;border-right:16px solid ${T.goldLeaf}"></div>
  </div>`;
}
// a live-count slot rendered as a highlighted chip (a real measure fills it in
// the report; shown here as a placeholder so no number is fabricated in the art)
const nchip = (t) => `<span style="background:${T.red};color:#F3E3AE;padding:1px 8px;border-radius:5px;font-weight:800;font-family:Georgia,serif">${t}</span>`;
// two minifigs sharing one speech-scroll (a paired hidden reveal)
function duoTip(cutA, cutB, name, phrase, accent) {
  return `<img src="${uri(cutA)}" style="position:absolute;left:4px;bottom:6px;height:206px;filter:drop-shadow(0 12px 16px rgba(0,0,0,.5))">
  <img src="${uri(cutB)}" style="position:absolute;left:118px;bottom:6px;height:192px;filter:drop-shadow(0 12px 16px rgba(0,0,0,.5))">
  <div style="position:absolute;left:250px;top:14px;width:286px;padding:15px 18px;background:#000 url('${PARCH}') center/cover;border:2px solid ${T.goldLeaf};border-radius:14px;box-shadow:0 12px 28px rgba(0,0,0,.45)">
    <div style="font:800 11px Segoe UI;letter-spacing:1.5px;color:${accent};text-transform:uppercase;margin-bottom:6px;padding-right:16px">${name}</div>
    <div style="font:italic 400 14px Georgia,serif;line-height:1.55;color:${T.ink}">${phrase}</div>
    ${closeX()}
    <div style="position:absolute;left:-15px;top:72px;width:0;height:0;border-top:9px solid transparent;border-bottom:9px solid transparent;border-right:16px solid ${T.goldLeaf}"></div>
  </div>`;
}
// a small ✕ close chip for a popup (an invisible dismiss button sits over it in
// the report) + the "Expecto Patronum" spell button that banishes the Dementor
const closeX = () => `<div style="position:absolute;top:-11px;right:-11px;width:26px;height:26px;border-radius:50%;background:${T.leather};border:1.5px solid ${T.goldLeaf};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.45)"><span style="font:700 12px Georgia,serif;color:${T.goldLeaf};line-height:1">✕</span></div>`;
function patronusButton() {
  return `<div style="display:inline-flex;align-items:center;gap:11px;padding:12px 24px;background:linear-gradient(180deg,#2C3E58,#141E2C);border:2px solid #9FC6E8;border-radius:26px;box-shadow:0 0 24px 5px rgba(159,198,232,.55), inset 0 0 12px rgba(159,198,232,.25)">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#DCEBFA" stroke-width="1.7"><path d="M3.5 20.5 L13 11"/><path d="M15.5 2 L16.7 6.3 L21 7.5 L16.7 8.7 L15.5 13 L14.3 8.7 L10 7.5 L14.3 6.3 Z" fill="#DCEBFA" stroke="none"/></svg>
    <span style="font:800 15px Georgia,serif;letter-spacing:2.5px;color:#EAF4FF;text-shadow:0 0 9px rgba(159,198,232,.85)">EXPECTO PATRONUM</span>
  </div>`;
}
// the silvery Patronus burst that replaces the Dementor once it is banished
function patronusGlow(cx, cy) {
  const spark = (dx, dy, s) => `<span style="position:absolute;left:${dx}px;top:${dy}px;font:${s}px Georgia,serif;color:#EAF4FF;text-shadow:0 0 9px rgba(159,198,232,.95)">✦</span>`;
  return `<div style="position:absolute;left:${cx - 175}px;top:${cy - 175}px;width:350px;height:350px;background:radial-gradient(circle, rgba(220,238,255,.8), rgba(159,198,232,.32) 34%, transparent 66%);border-radius:50%"></div>
  <div style="position:absolute;left:${cx - 160}px;top:${cy - 160}px;width:320px;height:320px">${spark(24, 44, 28)}${spark(258, 66, 18)}${spark(60, 250, 22)}${spark(232, 236, 28)}${spark(150, 20, 16)}${spark(8, 150, 18)}${spark(288, 168, 22)}${spark(120, 300, 18)}</div>`;
}

// ================= CHAPTER III: The Chamber of Colours =================
function colours() {
  return `${parchmentPage()} ${goldBorder(28, 24, 1224, 672)} ${ribbons(2)}
  ${step(56, 52, 'III')} ${eyebrow(112, 56, 'Bag Three · The Chamber of Colours')}
  <div style="position:absolute;left:110px;top:70px;font:800 34px Georgia,serif;color:${T.ink}">The Chamber of Colours</div>
  ${dropCap('C', 56, 128)}
  <div style="position:absolute;left:146px;top:130px;width:372px;font:400 14px Georgia,serif;line-height:1.55;color:${T.ink}">olour is the strongest magic in brick — and no licensed LEGO theme casts more of it than ${gink('Harry Potter')}. Its crown jewel, Diagon Alley (2025), is the ${gink('#2 most colourful')} LEGO set ever built, of any theme.</div>
  ${goldRibbon(56, 232, 428, 'Harry Potter · LEGO\'s most colourful licensed theme')}
  <!-- the real set, floating transparent (Rebrickable white box removed) -->
  <img src="${uri('cut_diagon')}" style="position:absolute;left:2px;top:276px;width:542px;filter:drop-shadow(0 12px 16px rgba(40,20,8,.4))">
  <div style="position:absolute;left:34px;top:576px;width:520px;font:700 12.5px Georgia,serif;color:${T.ink}">Diagon Alley 76444 · <span style="color:${T.red}">55 distinct colours</span> · #2 most colourful set ever</div>
  <div style="position:absolute;left:34px;top:598px;font:italic 400 12px Georgia,serif;color:${T.ink2}">tap a ✦ to uncover a hidden tale</div>
  ${clue(150, 506)} ${clue(446, 508)}
  <!-- charts -->
  ${fig(548, 80, 684, 286)} ${figCap(564, 94, 'FIGURE 1 · THE COLOUR MAP', 'every colour to scale, in its true brick hex — sized by parts')}
  ${fig(548, 388, 684, 200)} ${figCap(564, 402, 'FIGURE 2 · THE 55-COLOUR SPECTRUM', 'one bar, every hue, ordered by part count')}
  ${pageNo('III')} ${turn()}`;
}

// ================= CHAPTER III (dark): The Chamber of Greys =================
function dark() {
  return `${parchmentPage()}
  <div style="position:absolute;inset:0;background:radial-gradient(120% 110% at 40% 40%, rgba(10,8,6,.45), rgba(6,5,4,.82) 100%)"></div>
  ${goldBorder(28, 24, 1224, 672)}
  <div style="position:absolute;left:56px;top:52px;width:40px;height:40px;border-radius:50%;background:#1A1512;border:2px solid ${T.gold};display:flex;align-items:center;justify-content:center"><span style="font:800 18px Georgia,serif;color:${T.goldLeaf}">☾</span></div>
  ${eyebrow(112, 56, 'The Restricted Section')}
  <div style="position:absolute;left:110px;top:72px;font:800 34px Georgia,serif;color:#D8CBB0">The Chamber of Greys</div>
  <div style="position:absolute;left:56px;top:132px;width:420px;font:400 16px Georgia,serif;line-height:1.58;color:#DBCFB6">Not every set dazzles. The greyest theme of all is <span style="color:#E08A78;font-weight:700">Star Wars</span> — about <span style="color:#E08A78;font-weight:700">72% grey</span>, against Harry Potter's 42%. Its darkest build, Vader's TIE Advanced (2006), is <span style="color:#E08A78;font-weight:700">97.9%</span> greyscale.</div>
  <div style="position:absolute;left:64px;top:252px;font:800 80px Georgia,serif;color:#D8CCAE;text-shadow:0 0 20px rgba(0,0,0,.5)">97.9%</div>
  <div style="position:absolute;left:68px;top:348px;font:italic 400 15px Georgia,serif;color:#BCAF92">of every brick is greyscale</div>
  ${plate('dark', 56, 410, 430, 240)}
  ${cutImg('cut_vold', 300, 344, 168)}
  ${fig(512, 60, 720, 340)} ${figCap(528, 74, 'FIGURE 1 · COLOUR COMPOSITION', 'grey vs the true rainbow of colour · Star Wars is greyest')}
  ${fig(512, 420, 720, 200)} ${figCap(528, 434, 'FIGURE 2 · GREYEST vs BRIGHTEST', 'share of greyscale bricks, by theme')}
  <div style="position:absolute;left:64px;bottom:52px;padding:12px 22px;border:1.5px solid ${T.goldBright};border-radius:4px;background:rgba(20,14,6,.5);font:600 13px Georgia,serif;color:${T.goldLeaf}">❦ back to the colour</div>
  ${pageNo('III')} <div style="position:absolute;right:64px;bottom:34px;font:italic 600 13px Georgia,serif;color:#A89A7E">turn the page ❦</div>`;
}

// ================= CHAPTER IV: Match the Minifig (game) =================
// numbered instruction step + a ❋ result seal that live measures flip to ✓/✗
function numStep(x, y, n) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:34px;height:34px;border-radius:50%;background:${T.leather};border:2px solid ${T.goldBright};display:flex;align-items:center;justify-content:center"><span style="font:800 17px Georgia,serif;color:${T.goldLeaf}">${n}</span></div>`;
}
function sealSpot(x, y) {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:58px;height:58px;border-radius:50%;border:2px dashed ${T.gold}88;display:flex;align-items:center;justify-content:center"><span style="font:italic 400 11px Georgia,serif;color:${T.ink2}">match?</span></div>`;
}
function explore() {
  return `${parchmentPage()} ${goldBorder(28, 24, 1224, 672)} ${ribbons(3)}
  ${step(56, 52, '✦')} ${eyebrow(112, 56, 'The Final Chapter · the whole cast')}
  <div style="position:absolute;left:110px;top:72px;font:800 34px Georgia,serif;color:${T.ink}">The Cast Assembles</div>
  <div style="position:absolute;left:56px;top:126px;width:1176px;font:italic 400 14px Georgia,serif;line-height:1.5;color:${T.ink2}">Every ${gink('Harry Potter')} minifig design ever made — one dot each, placed by the year it first appeared and how many sets it comes to live in. Watch the cast fall silent through the lost years, then flood back in flesh and colour. ${gink('Hover any wizard')}; pick one on the left to meet them.</div>
  <!-- left column: find-a-wizard + portrait -->
  <div style="position:absolute;left:58px;top:188px;font:700 12px Segoe UI;letter-spacing:1.5px;color:${T.red}">FIND A WIZARD</div>
  ${fig(56, 214, 280, 214)}
  <div style="position:absolute;left:58px;top:444px;font:700 12px Segoe UI;letter-spacing:1.5px;color:${T.red}">THEIR FACES THROUGH THE YEARS</div>
  ${fig(56, 470, 280, 158)}
  <!-- the swarm -->
  ${fig(360, 200, 872, 428)}
  ${figCap(376, 214, 'FIGURE · THE CAST, YEAR BY YEAR', 'each dot a minifig design · first appearance year across → sets it appears in ↑ · classic yellow vs modern flesh')}
  ${pageNo('IV')} ${turn()}`;
}

// ================= SOURCES =================
function sources() {
  const rowH = (x, y, w, t, s) => `${fig(x, y, w, 86)}
    <div style="position:absolute;left:${x + 18}px;top:${y + 13}px;font:700 13.5px Georgia,serif;color:${T.ink}">${t}</div>
    <div style="position:absolute;left:${x + 18}px;top:${y + 37}px;width:${w - 36}px;font:400 12px Georgia,serif;line-height:1.42;color:${T.ink2}">${s}</div>`;
  const L = 56, R = 646, W1 = 570, W2 = 586;
  return `${parchmentPage()} ${goldBorder(28, 24, 1224, 672)} ${ribbons(4)}
  ${step(56, 52, '?')} ${eyebrow(112, 56, 'The Footnotes')}
  <div style="position:absolute;left:110px;top:70px;font:800 34px Georgia,serif;color:${T.ink}">Sources & Credits</div>
  <div style="position:absolute;left:56px;top:122px;width:1020px;font:italic 400 13.5px Georgia,serif;color:${T.ink2}">Every brick in this story stands on someone's work. Data, tools, trademarks and teachers — cited here, with thanks.</div>
  ${rowH(L, 158, W1, 'Rebrickable — the LEGO database', 'Every set, part, colour, minifigure and photograph. rebrickable.com — the factual foundation of the whole story.')}
  ${rowH(R, 158, W2, 'Deneb · Daniel Marsh-Patrick', 'The certified AppSource visual rendering declarative Vega-Lite in Power BI — every true-colour map & spectrum here.')}
  ${rowH(L, 252, W1, 'LEGO® · The LEGO Group', 'LEGO® is a trademark of The LEGO Group, which does not sponsor or endorse this non-commercial fan data-story.')}
  ${rowH(R, 252, W2, 'Harry Potter™ · Wizarding World', 'Trademarks of Warner Bros. Entertainment Inc. Used lovingly for a non-commercial fan data-story.')}
  ${rowH(L, 346, W1, 'Cinematic scene art · Google Gemini', 'Brick-built wizarding scenes generated with Google Gemini 2.5 Flash Image, anchored on real LEGO set photos.')}
  ${rowH(R, 346, W2, 'pbir CLI · Kurt Buhler & Maxim Anatsko', 'The agent-first Power BI toolkit that made this PBIR authorable, used under its non-commercial licence.')}
  ${rowH(L, 440, W1, 'Design craft', 'Storytelling & layout shaped by Cole Nussbaumer Knaflic, Lukas Reese, Draft BI, Numerro & MoonStory. Type set in Georgia.')}
  ${rowH(R, 440, W2, 'The arena · DataViz World Champs', 'Power BI DataViz World Champs · Barcelona · Round 2 — brief & judging by the Microsoft Fabric community.')}
  <div style="position:absolute;left:412px;top:548px;width:456px;height:1px;background:linear-gradient(90deg,transparent,${T.goldLeaf},transparent)"></div>
  <div style="position:absolute;left:56px;top:560px;width:1168px;text-align:center;font:italic 600 14px Georgia,serif;color:${T.red}">…and to everyone and everything that shaped this build — knowingly and unknowingly — thank you.</div>
  <div style="position:absolute;left:0;bottom:34px;width:${W}px;text-align:center;font:italic 600 13px Georgia,serif;color:${T.ink2}">❦ return to the book</div>`;
}

const PAGES = { cover, yellow, cameback, colours, dark, explore, sources };
const SIZES = { cover: { W: CW, H: CH } };   // portrait cover; every other page landscape
const TIPS = {
  tip_harry: { w: 476, h: 250, fn: () => minifigTip('cut_harry', "Look closer — this one set hides <b>55</b> real brick colours. There's only one LEGO set ever built that has more colours.", 'Harry Potter', T.red) },
  tip_vold: { w: 476, h: 250, fn: () => minifigTip('cut_vold', "All this colour… how <i>garish</i>. Come find me in the greys, where <b>97.9%</b> of a set is shadow.", 'Lord Voldemort', '#7A5A1C', 224, 158, 258, 'come to the dark side and see for yourself') },
  tip_dementor: { w: 476, h: 250, fn: () => minifigTip('cut_dementor', "Seven pieces of pure dread — no minifig in the Yellow Years is built from more.", 'The Dementor · largest of the era', '#4A5A3E') },
  tip_marge: { w: 542, h: 250, fn: () => minifigTip('cut_marge', "Fourteen pieces and still inflating — no Harry Potter minifig ever built is bigger than me.", 'Aunt Marge · the largest of all', T.red, 200, 232, 250) },
  tip_yellow_duo: { w: 600, h: 252, fn: () => duoTip('cut_ron_y', 'cut_hermione_y', 'Ron & Hermione · the yellow years', `Back then we were a small cast — just ${nchip('134')} Harry Potter minifigures in the whole Yellow Years, the first of us in classic sunshine yellow.`, '#B8912E') },
  tip_colour_duo: { w: 600, h: 252, fn: () => duoTip('cut_ron_c', 'cut_hermione_c', 'Ron & Hermione · the colour years', `The return brought ${nchip('442')} minifigures — more than triple the Yellow Years — and every one now wears a real, flesh-toned face.`, '#7C2B22') },
  tip_appearances: { w: 600, h: 252, fn: () => duoTip('cut_draco', 'cut_harry_og', 'Set-appearance record', `Draco appears in ${nchip('7')} different sets — 2nd-most of any Harry Potter minifig. Only one wizard tops him: the very first yellow-faced Harry, on the right.`, '#2F6B4A') },
};

// ---- render ----
const only = process.argv.slice(2);
mkdirSync(RES, { recursive: true });
const browser = await chromium.launch();
const bp = await browser.newPage({ deviceScaleFactor: 2 });
const shoot = async (html, sel, out, opts = {}) => {
  const tmp = join(HERE, `_tmp.html`);
  writeFileSync(tmp, html);
  await bp.goto(pathToFileURL(tmp).href);
  await bp.waitForTimeout(300);
  await bp.locator(sel).first().screenshot({ path: out, ...opts });
};

for (const name of Object.keys(PAGES).filter(p => !only.length || only.includes(p))) {
  const { W: pw, H: ph } = SIZES[name] || { W, H };
  await bp.setViewportSize({ width: pw, height: ph });
  const html = `<!doctype html><meta charset="utf-8"><body style="margin:0"><div style="position:relative;width:${pw}px;height:${ph}px;overflow:hidden;background:${T.edge};font-family:Georgia,serif">${PAGES[name]()}</div></body>`;
  await shoot(html, 'div', join(RES, `bg_${name}.png`));
  console.log('baked', name);
}

// transparent minifig-tip reveals (hidden overlay visuals, shown on clue tap)
if (!only.length || only.includes('tips')) {
  for (const [name, t] of Object.entries(TIPS)) {
    await bp.setViewportSize({ width: t.w + 24, height: t.h + 12 });
    const html = `<!doctype html><meta charset="utf-8"><body style="margin:0"><div id="tip" style="position:relative;width:${t.w}px;height:${t.h}px;font-family:Georgia,serif">${t.fn()}</div></body>`;
    await shoot(html, '#tip', join(RES, `${name}.png`), { omitBackground: true });
    console.log('baked', name, '(transparent)');
  }
  // Expecto Patronum spell button + Patronus banish glow (standalone Dementor overlays)
  await bp.setViewportSize({ width: 340, height: 110 });
  await shoot(`<!doctype html><meta charset="utf-8"><body style="margin:0"><div id="pb" style="position:relative;display:inline-block;padding:34px;font-family:Georgia,serif">${patronusButton()}</div></body>`, '#pb', join(RES, 'patronus_btn.png'), { omitBackground: true });
  await bp.setViewportSize({ width: 380, height: 380 });
  await shoot(`<!doctype html><meta charset="utf-8"><body style="margin:0"><div id="pg" style="position:relative;width:360px;height:360px;font-family:Georgia,serif">${patronusGlow(180, 180)}</div></body>`, '#pg', join(RES, 'patronus_glow.png'), { omitBackground: true });
  console.log('baked patronus_btn + patronus_glow (transparent)');
}

// QA-only opaque previews: a hidden tale revealed on a page
if (!only.length || only.includes('qa')) {
  await bp.setViewportSize({ width: W, height: H });
  const wrap = (page, tipHtml, out) => shoot(
    `<!doctype html><meta charset="utf-8"><body style="margin:0"><div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${T.edge};font-family:Georgia,serif">${page}${tipHtml}</div></body>`,
    'div', join(HERE, out));
  const box = (x, y, t) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${t.w}px;height:${t.h}px">${t.fn()}</div>`;
  await wrap(colours(), box(150, 250, TIPS.tip_harry), `_qa_colours_tip.png`);
  await wrap(yellow(), box(110, 344, TIPS.tip_yellow_duo), `_qa_yellow_tip.png`);
  await wrap(yellow(), box(150, 360, TIPS.tip_dementor), `_qa_yellow_egg.png`);
  await wrap(cameback(), box(110, 344, TIPS.tip_colour_duo), `_qa_cameback_tip.png`);
  await wrap(cameback(), box(120, 360, TIPS.tip_marge), `_qa_cameback_egg.png`);
  await wrap(cameback(), box(110, 344, TIPS.tip_appearances), `_qa_appearances.png`);
  // Dementor encounter on the dark page + the Expecto Patronum banish
  await wrap(dark(), `<img src="${uri('cut_dementor2')}" style="position:absolute;left:566px;top:84px;height:302px;filter:drop-shadow(0 14px 22px rgba(0,0,0,.65))"><div style="position:absolute;left:512px;top:408px;width:372px;text-align:center">${patronusButton()}</div>`, `_qa_dark_dementor.png`);
  await wrap(dark(), `${patronusGlow(716, 220)}<div style="position:absolute;left:480px;top:452px;width:470px;text-align:center;font:italic 700 20px Georgia,serif;color:#EAF4FF;text-shadow:0 0 12px rgba(159,198,232,.95)">Expecto Patronum!</div><div style="position:absolute;left:480px;top:486px;width:470px;text-align:center;font:italic 400 14px Georgia,serif;color:#B9CBDD">The Dementor flees into the shadows.</div>`, `_qa_dark_banished.png`);
  console.log('baked QA tip previews');
}

await browser.close();
