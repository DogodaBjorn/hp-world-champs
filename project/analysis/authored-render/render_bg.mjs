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
  <div style="position:absolute;left:0;top:1134px;width:${CW}px;text-align:center;font:italic 600 15px Georgia,serif;color:#E8CF88">open the book ❦</div>
  <div style="position:absolute;left:60px;top:1138px;font:italic 600 12.5px Georgia,serif;color:#C9AE72">with thanks ❦</div>`;
}

// ================= CHAPTER I: The Yellow Years =================
function yellow() {
  return `${parchmentPage()}
  ${goldBorder(28, 24, 1224, 672)}
  ${ribbons(0)}
  ${step(56, 52, 'I')}
  ${eyebrow(112, 56, 'Chapter I · 2001–2011')}
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
  ${step(56, 52, 'II')} ${eyebrow(112, 56, 'Chapter II · 2018–today')}
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
  const chip = (x, y, t) => `<div style="position:absolute;left:${x}px;top:${y}px;padding:4px 12px;background:${T.red};border-radius:3px;box-shadow:0 2px 5px rgba(60,20,10,.25);font:800 10.5px 'Segoe UI';letter-spacing:2px;color:#F3E3AE">${t}</div>`;
  return `${parchmentPage()} ${goldBorder(28, 24, 1224, 672)} ${ribbons(2)}
  ${step(56, 52, 'III')} ${eyebrow(112, 56, 'Chapter III · The Chamber of Colours')}
  <div style="position:absolute;left:110px;top:70px;font:800 34px Georgia,serif;color:${T.ink}">The Chamber of Colours</div>
  <!-- ===== FIRST TALE · the theme ===== -->
  ${chip(56, 122, 'FIRST TALE · THE MOST COLOURFUL THEME')}
  ${dropCap('C', 56, 156)}
  <div style="position:absolute;left:146px;top:158px;width:372px;font:400 14px Georgia,serif;line-height:1.55;color:${T.ink}">olour is the strongest magic in brick — and since the Second Build era, no licensed LEGO theme casts more of it than ${gink('Harry Potter')}. ${gink('Figure 1')} holds every colour the theme has ever used, each sized by the bricks that carry it.</div>
  ${goldRibbon(56, 262, 428, 'Harry Potter · LEGO\'s most colourful licensed theme')}
  ${fig(548, 80, 684, 286)} ${chip(564, 66, 'FIRST TALE')}
  ${figCap(564, 96, 'FIGURE 1 · EVERY COLOUR THE THEME EVER CAST', 'all Harry Potter brick colours in their true hex · sized by parts used')}
  <!-- gold rule between the two tales (right column) -->
  <div style="position:absolute;left:548px;top:374px;width:684px;height:1px;background:linear-gradient(90deg,transparent,${T.goldLeaf},transparent)"></div>
  <!-- ===== SECOND TALE · the set ===== -->
  ${chip(34, 306, 'SECOND TALE · ITS MOST COLOURFUL SET')}
  <img src="${uri('cut_diagon')}" style="position:absolute;left:2px;top:330px;width:520px;filter:drop-shadow(0 12px 16px rgba(40,20,8,.4))">
  <div style="position:absolute;left:34px;top:600px;width:520px;font:700 12.5px Georgia,serif;color:${T.ink}">Diagon Alley 76444 · <span style="color:${T.red}">55 distinct colours</span> · #2 most colourful set ever <span style="font:italic 700 12px Georgia,serif;color:${T.red}">&nbsp;⟶ Figure 2</span></div>
  <div style="position:absolute;left:34px;top:622px;font:italic 400 12px Georgia,serif;color:${T.ink2}">tap a ✦ to uncover a hidden tale</div>
  ${clue(150, 546)} ${clue(446, 548)}
  ${fig(548, 396, 684, 196)} ${chip(564, 382, 'SECOND TALE')}
  ${figCap(564, 412, 'FIGURE 2 · DIAGON ALLEY’S OWN 55', 'every colour inside set 76444 · one bar, every hue, ordered by part count')}
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
// ============ THE MARAUDER'S MAP (Chapter IV) ============
// Two states baked as separate canvases: the folded blank parchment with the
// oath, and the revealed ink map. Every clickable rect (oath, mischief, each
// name banner) is recorded into BANNERS and written to map_banners.json so the
// PBIR build script places its invisible buttons on exactly the same spots.
const MAPD = JSON.parse(readFileSync(join(HERE, 'map_data.json'), 'utf8'));
const BANNERS = {};
const MINK = '#4A3418';           // map ink (dark sepia)
const reg = (slug, x, y, w, h) => { BANNERS[slug] = { x, y, w, h }; return ''; };
// a Marauder name-banner: parchment ribbon with pointed ends + script name
// (compact: the names sit on the drawn Hogwarts itself)
function banner(slug, x, y, name, small = false) {
  const fs = small ? 10 : 11;
  const w = Math.round(name.length * (small ? 5.4 : 5.9)) + 26;
  const h = small ? 20 : 22;
  reg(slug, x - 6, y - 6, w + 12, h + 12);
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:rgba(243,233,210,.92);border:1.2px solid ${MINK};box-shadow:1px 2px 4px rgba(60,35,12,.25);display:flex;align-items:center;justify-content:center">
    <span style="font:italic 700 ${fs}px 'Segoe Script',Georgia,serif;color:${MINK};white-space:nowrap">${name}</span></div>
  <div style="position:absolute;left:${x - 7}px;top:${y + 4}px;width:0;height:0;border-top:${h / 2 - 4}px solid transparent;border-bottom:${h / 2 - 4}px solid transparent;border-right:8px solid ${MINK}"></div>
  <div style="position:absolute;left:${x + w - 1}px;top:${y + 4}px;width:0;height:0;border-top:${h / 2 - 4}px solid transparent;border-bottom:${h / 2 - 4}px solid transparent;border-left:8px solid ${MINK}"></div>`;
}
// an ink-drawn room: double border + tiny caps label
function room(x, y, w, h, label, extra = '') {
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:1.6px solid ${MINK};box-shadow:inset 0 0 0 3px rgba(243,233,210,.9), inset 0 0 0 4.2px ${MINK}66;background:rgba(240,228,200,.35);${extra}"></div>
  <div style="position:absolute;left:${x + 8}px;top:${y + 5}px;width:${w - 16}px;font:700 9.5px 'Segoe UI';letter-spacing:1.6px;color:${MINK};text-transform:uppercase;opacity:.85">${label}</div>`;
}
// a wandering trail of footprint pairs (tiny ink ovals, alternating offset)
function feet(x, y, rot, n = 5, gap = 17) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const t = rot * Math.PI / 180, px = x + Math.cos(t) * gap * i, py = y + Math.sin(t) * gap * i;
    const side = (i % 2 ? 4 : -4), sx = px - Math.sin(t) * side, syy = py + Math.cos(t) * side;
    s += `<span style="position:absolute;left:${sx}px;top:${syy}px;width:3.4px;height:6.4px;background:${MINK};border-radius:50%;opacity:.65;transform:rotate(${rot + 90}deg)"></span>
    <span style="position:absolute;left:${sx + Math.cos(t) * 5}px;top:${syy + Math.sin(t) * 5 - 3.4}px;width:2.2px;height:3.2px;background:${MINK};border-radius:50%;opacity:.6;transform:rotate(${rot + 90}deg)"></span>`;
  }
  return s;
}
const dash = (x, y, w, h) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-top:1.4px dashed ${MINK}88"></div>`;

function map_folded() {
  reg('solemn', 340, 396, 600, 64);
  return `${parchmentPage()} ${goldBorder(28, 24, 1224, 672)} ${ribbons(3)}
  ${step(56, 52, '✦')} ${eyebrow(112, 56, 'The Final Chapter')}
  <div style="position:absolute;left:110px;top:72px;font:800 34px Georgia,serif;color:${T.ink}">…just a blank piece of parchment?</div>
  <!-- faint fold creases -->
  <div style="position:absolute;left:426px;top:120px;width:1px;height:520px;background:linear-gradient(180deg,transparent,${T.inkSoft}44,transparent)"></div>
  <div style="position:absolute;left:852px;top:120px;width:1px;height:520px;background:linear-gradient(180deg,transparent,${T.inkSoft}44,transparent)"></div>
  <div style="position:absolute;left:200px;top:368px;width:880px;height:1px;background:linear-gradient(90deg,transparent,${T.inkSoft}33,transparent)"></div>
  <div style="position:absolute;left:0;top:300px;width:${W}px;text-align:center;font:italic 400 15px Georgia,serif;color:${T.ink2}">The castle keeps its secrets from plain eyes.<br>Only one oath will make the ink appear.</div>
  <!-- the oath button (invisible clue_solemn sits over this rect) -->
  <div style="position:absolute;left:340px;top:396px;width:600px;height:64px;border:2px solid ${T.red};border-radius:6px;background:rgba(124,43,34,.10);box-shadow:0 3px 12px rgba(60,20,10,.18);display:flex;align-items:center;justify-content:center">
    <span style="font:italic 700 19px 'Segoe Script',Georgia,serif;color:${T.red}">I solemnly swear that I am up to no good&nbsp;❦</span></div>
  <div style="position:absolute;left:0;top:478px;width:${W}px;text-align:center;font:italic 400 12px Georgia,serif;color:${T.ink2}">tap the oath — and mind who's watching</div>
  <div style="position:absolute;left:740px;bottom:20px;font:italic 600 13px Georgia,serif;color:${T.red}">❦ credits</div>
  ${pageNo('IV')} ${turn()}`;
}

function map_open() {
  // the Gemini-drawn Hogwarts (square art, no text) sits full-height centre;
  // masthead lives in the left margin; every name banner sits ON the drawing.
  const AX = 308, AY = 26, AS = 668;   // art rect on the page
  return `${parchmentPage()}
  <div style="position:absolute;inset:0;background:radial-gradient(120% 110% at 50% 40%, transparent 60%, rgba(90,55,20,.16))"></div>
  <img src="${uri('hogwarts_map_lego')}" style="position:absolute;left:${AX}px;top:${AY}px;width:${AS}px;height:${AS}px;mix-blend-mode:multiply;opacity:.97;filter:contrast(1.07);-webkit-mask-image:radial-gradient(88% 88% at 50% 50%, #000 78%, transparent 99%)">
  ${goldBorder(28, 24, 1224, 672)} ${ribbons(3)}
  <!-- masthead (left margin) -->
  <div style="position:absolute;left:48px;top:64px;width:240px;text-align:center;font:700 10px 'Segoe UI';letter-spacing:2.6px;line-height:1.7;color:${MINK}">MESSRS. MOONY, WORMTAIL, PADFOOT <span style="font-family:Georgia">&</span> PRONGS</div>
  <div style="position:absolute;left:48px;top:118px;width:240px;text-align:center;font:italic 400 11px Georgia,serif;line-height:1.45;color:${MINK}CC">purveyors of aids to magical mischief-makers, are proud to present</div>
  <div style="position:absolute;left:40px;top:166px;width:256px;text-align:center;font:italic 800 27px 'Segoe Script',Georgia,serif;line-height:1.25;color:${MINK};text-shadow:0 1px 0 rgba(255,244,214,.5)">The Marauder’s Map</div>
  <div style="position:absolute;left:68px;top:246px;width:200px;height:1px;background:linear-gradient(90deg,transparent,${MINK},transparent)"></div>
  <div style="position:absolute;left:52px;top:262px;width:232px;text-align:center;font:italic 400 11px Georgia,serif;line-height:1.5;color:${T.ink2}">the Map never lies —<br>tap a name to summon the minifig it follows</div>
  ${feet(120, 330, 62, 5)}
  <!-- mischief managed (left margin, under the masthead) -->
  ${reg('mischief', 52, 560, 232, 40)}
  <div style="position:absolute;left:52px;top:560px;width:232px;height:40px;border:1.8px solid ${T.red};border-radius:5px;background:rgba(124,43,34,.12);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(60,20,10,.2)">
    <span style="font:italic 700 14px 'Segoe Script',Georgia,serif;color:${T.red}">Mischief managed&nbsp;❦</span></div>
  <!-- ===== names on the drawn castle (art-space anchors) ===== -->
  ${banner('minerva', 384, 172, 'Minerva McGonagall')}
  ${banner('dumbledore', 548, 116, 'Albus Dumbledore')}
  ${banner('lockhart', 736, 96, 'Gilderoy Lockhart')}
  ${banner('luna', 796, 158, 'Luna Lovegood')}
  ${banner('pomfrey', 864, 216, 'Madam Pomfrey')}
  ${banner('hermione', 626, 196, 'Hermione Granger')}
  ${banner('myrtle', 700, 258, 'Moaning Myrtle')}
  ${banner('cho', 842, 296, 'Cho Chang')}
  ${banner('snape', 434, 300, 'Severus Snape')}
  ${banner('dobby', 500, 350, 'Dobby')}
  ${banner('ronmap', 592, 322, 'Ron Weasley')}
  ${banner('draco', 700, 356, 'Draco Malfoy')}
  ${banner('goyle', 742, 388, 'Gregory Goyle', true)}
  ${banner('hooch', 428, 442, 'Madame Hooch')}
  ${banner('moony', 856, 436, 'Moony')}
  ${banner('hagrid', 508, 566, 'Rubeus Hagrid')}
  ${feet(636, 470, 40, 5)} ${feet(806, 500, -35, 5)}
  <!-- right margin: compass rose + sighting legend + wandering prints -->
  <svg style="position:absolute;left:1042px;top:96px" width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="${MINK}" opacity=".8">
    <circle cx="60" cy="60" r="44" stroke-width="1.4"/><circle cx="60" cy="60" r="34" stroke-width=".8" opacity=".6"/>
    <path d="M60 10 L66 54 L60 60 L54 54 Z" fill="${T.red}" stroke="${T.red}"/>
    <path d="M60 110 L66 66 L60 60 L54 66 Z" fill="${MINK}" opacity=".7"/>
    <path d="M10 60 L54 54 L60 60 L54 66 Z M110 60 L66 54 L60 60 L66 66 Z" fill="${MINK}" opacity=".45"/>
  </svg>
  <div style="position:absolute;left:1042px;top:222px;width:120px;text-align:center;font:italic 700 12px 'Segoe Script',Georgia,serif;color:${MINK}">north, more or less</div>
  <div style="position:absolute;left:1030px;top:300px;width:150px;border-top:1px solid ${MINK}66"></div>
  <div style="position:absolute;left:1030px;top:314px;width:150px;font:italic 400 11px Georgia,serif;line-height:1.6;color:${T.ink2}">sighted tonight:<br><b style="color:${MINK}">sixteen wizards</b><br>wandering the grounds<br>— every one of them<br>a real LEGO minifig</div>
  <svg style="position:absolute;left:1072px;top:412px" width="44" height="30" viewBox="0 0 32 22" fill="none" stroke="${MINK}" stroke-width="1.3" opacity=".8"><rect x="2" y="8" width="28" height="12" rx="1.5"/><rect x="5" y="3" width="6" height="5" rx="1"/><rect x="13" y="3" width="6" height="5" rx="1"/><rect x="21" y="3" width="6" height="5" rx="1"/><path d="M2 14 h28" opacity=".5"/></svg>
  <div style="position:absolute;left:1030px;top:448px;width:150px;text-align:center;font:italic 400 10px Georgia,serif;color:${T.ink2}">the castle itself:<br>assembled brick by brick</div>
  ${feet(1096, 500, 82, 4)} ${feet(1104, 590, 100, 4)}
  <!-- chrome cues -->
  <div style="position:absolute;left:740px;bottom:20px;font:italic 600 13px Georgia,serif;color:${T.red}">❦ credits</div>
  <div style="position:absolute;right:64px;bottom:20px;font:italic 600 12px Georgia,serif;color:${T.red}">turn the page ❦</div>
  <div style="position:absolute;left:64px;bottom:20px;font:italic 600 12px Georgia,serif;color:${T.ink2}">❦ back</div>`;
}

// a Marauder's Map character card: quote header + transparent minifig + stats
// verified from the contest CSVs (map_data.json, derived 2026-07-18).
const MQUOTES = {
  hermione:  { q: 'It’s LeviOsa, not LeviosAR!' },
  dobby:     { q: 'Master has given Dobby a sock… Dobby is free!' },
  dumbledore:{ q: 'It does not do to dwell on dreams and forget to live.' },
  snape:     { q: 'Always.' },
  hagrid:    { q: 'Yer a wizard, Harry.' },
  minerva:   { q: 'Have a biscuit, Potter.' },
  luna:      { q: 'You’re just as sane as I am.' },
  hooch:     { q: 'Up!' },
  cho:       { q: 'Seeker of Ravenclaw', epithet: true },
  myrtle:    { q: 'I was just sitting in the U-bend, thinking about death…' },
  lockhart:  { q: 'Fame is a fickle friend, Harry.' },
  pomfrey:   { q: 'Matron of the Hospital Wing', epithet: true },
  moony:     { q: 'Mr Moony presents his compliments…' },
  ronmap:    { q: 'The Map never lies — someone’s been at the Polyjuice again.', epithet: true, name: 'Vincent Crabbe ⁄ Ron Weasley', extraCut: 'cut_ron_c' },
  draco:     { q: 'My father will hear about this!' },
  goyle:     { q: '…' },
};
function mapTip(slug) {
  const d = MAPD[slug], m = MQUOTES[slug];
  const cut = slug === 'hermione' ? 'cut_hermione_c' : `cut_map_${slug}`;
  const name = (m.name || d.name);
  const quote = m.epithet ? m.q : `“${m.q}”`;
  const stat = (y, label, val) => `<div style="position:absolute;left:268px;top:${y}px;font:700 10px 'Segoe UI';letter-spacing:2px;color:${T.red}">${label}</div>
    <div style="position:absolute;left:268px;top:${y + 17}px;width:322px;font:400 14px Georgia,serif;line-height:1.35;color:${T.ink}">${val}</div>`;
  return `<div style="position:absolute;left:0;top:0;width:620px;height:440px;background:#000 url('${PARCH}') center/cover;border:2px solid ${T.goldLeaf};border-radius:14px;box-shadow:0 12px 28px rgba(0,0,0,.45)"></div>
  <div style="position:absolute;left:26px;top:20px;width:540px;font:italic 700 17px Georgia,serif;line-height:1.35;color:${T.red}">${quote}</div>
  <div style="position:absolute;left:26px;top:${m.q.length > 42 ? 84 : 62}px;font:800 12px 'Segoe UI';letter-spacing:2.5px;color:${T.gold};text-transform:uppercase">${name}</div>
  <div style="position:absolute;left:26px;top:${m.q.length > 42 ? 104 : 82}px;width:568px;height:1px;background:linear-gradient(90deg,${T.goldLeaf},transparent)"></div>
  <img src="${uri(cut)}" style="position:absolute;left:30px;bottom:44px;height:250px;filter:drop-shadow(0 10px 14px rgba(0,0,0,.45))">
  ${m.extraCut ? `<img src="${uri(m.extraCut)}" style="position:absolute;left:138px;bottom:44px;height:148px;opacity:.92;filter:drop-shadow(0 8px 12px rgba(0,0,0,.4))">` : ''}
  ${stat(140, 'APPEARS IN', `${d.sets} sets · ${d.figs} minifig design${d.figs > 1 ? 's' : ''}`)}
  ${stat(210, 'FIRST SEEN', `${d.first_set} · ${d.first_year}`)}
  ${stat(288, 'LAST SEEN', `${d.last_set} · ${d.last_year}`)}
  <div style="position:absolute;left:268px;top:368px;width:322px;height:1px;background:linear-gradient(90deg,transparent,${T.goldLeaf},transparent)"></div>
  <div style="position:absolute;left:26px;bottom:14px;width:568px;text-align:center;font:italic 400 10.5px Georgia,serif;color:${T.ink2}">as recorded by the Marauder’s Map · archive: Rebrickable</div>
  ${closeX2(620)}`;
}
// condensed credits card (the popup twin of the full Sources & Credits page)
function creditsCard() {
  const row = (x, y, t, s) => `<div style="position:absolute;left:${x}px;top:${y}px;width:284px;font:700 12px Georgia,serif;color:${T.ink}">${t}<div style="font:400 10.5px Georgia,serif;line-height:1.35;color:${T.ink2};margin-top:1px">${s}</div></div>`;
  return `<div style="position:absolute;left:0;top:0;width:640px;height:480px;background:#000 url('${PARCH}') center/cover;border:2px solid ${T.goldLeaf};border-radius:14px;box-shadow:0 12px 28px rgba(0,0,0,.45)"></div>
  <div style="position:absolute;left:0;top:24px;width:640px;text-align:center;font:800 13px Segoe UI;letter-spacing:3px;color:${T.red}">WITH THANKS</div>
  <div style="position:absolute;left:170px;top:46px;width:300px;height:1px;background:linear-gradient(90deg,transparent,${T.goldLeaf},transparent)"></div>
  ${row(28, 64, 'Rebrickable', 'every set, part, colour, minifigure & photo — rebrickable.com')}
  ${row(330, 64, 'Deneb · Daniel Marsh-Patrick', 'the certified Vega-Lite visual behind every true-colour chart')}
  ${row(28, 128, 'LEGO® · The LEGO Group', 'trademark of The LEGO Group; not sponsored or endorsed')}
  ${row(330, 128, 'Harry Potter™ · Wizarding World', 'trademarks of Warner Bros. Entertainment Inc.')}
  ${row(28, 192, 'Scene art · Google Gemini', 'brick-built wizarding scenes, anchored on real set photos')}
  ${row(330, 192, 'pbir CLI · Kurt Buhler & Maxim Anatsko', 'the agent-first toolkit that made this book authorable')}
  ${row(28, 256, 'Design craft', 'Knaflic · Reese · Draft BI · Numerro · MoonStory')}
  ${row(330, 256, 'The arena · DataViz World Champs', 'Round 2 · brief & judging by the Fabric community')}
  <div style="position:absolute;left:28px;top:322px;width:584px;height:1px;background:linear-gradient(90deg,transparent,${T.goldLeaf},transparent)"></div>
  <div style="position:absolute;left:44px;top:334px;width:552px;text-align:center;font:400 11px Georgia,serif;line-height:1.4;color:${T.ink2}"><b>Quotes</b> · brief lines from J.K. Rowling’s novels & the Warner Bros. films, spoken again in loving homage</div>
  <div style="position:absolute;left:44px;top:372px;width:552px;text-align:center;font:italic 600 13px Georgia,serif;line-height:1.5;color:${T.red}">…and to everyone and everything that shaped this build —<br>knowingly and unknowingly — thank you.</div>
  <div style="position:absolute;left:0;top:426px;width:640px;text-align:center;font:italic 400 11px Georgia,serif;color:${T.ink2}">tap ✕ to return to the book</div>
  ${closeX2(640)}`;
}
// closeX for full-bleed cards (✕ inside the top-right corner, not overhanging)
const closeX2 = (w) => `<div style="position:absolute;left:${w - 38}px;top:14px;width:26px;height:26px;border-radius:50%;background:${T.leather};border:1.5px solid ${T.goldLeaf};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.45)"><span style="font:700 12px Georgia,serif;color:${T.goldLeaf};line-height:1">✕</span></div>`;

// hover-tooltip card for the set bar charts (t2-settip page background, 440x320).
// The white plate makes the Rebrickable product shot's white background read as
// an intentional instruction-manual product plate on the parchment.
function ttSetCard() {
  return `<div style="position:absolute;left:0;top:0;width:440px;height:320px;background:#000 url('${PARCH}') center/cover;border:2px solid ${T.goldLeaf};border-radius:10px;box-shadow:0 10px 24px rgba(0,0,0,.4)"></div>
  <div style="position:absolute;left:16px;top:12px;font:800 10px 'Segoe UI';letter-spacing:2.2px;color:${T.red}">FROM THE SHELF · SET RECORD</div>
  <div style="position:absolute;left:16px;top:30px;width:408px;height:1px;background:linear-gradient(90deg,${T.goldLeaf},transparent)"></div>
  <!-- white product plate (live set photo sits inside) -->
  <div style="position:absolute;left:16px;top:52px;width:240px;height:236px;padding:5px;background:linear-gradient(180deg,#FCFBF8,#F2ECDD);border:1.5px solid ${T.ink};box-shadow:0 4px 12px rgba(40,25,8,.25)">
    <div style="width:100%;height:100%;background:#FFFFFF;box-shadow:inset 0 0 0 1px rgba(58,42,20,.15)"></div></div>
  <div style="position:absolute;left:26px;top:44px;display:flex;gap:3px">
    <span style="width:12px;height:8px;background:${T.red};border-radius:2px 2px 0 0;border:1px solid ${T.ink}"></span>
    <span style="width:12px;height:8px;background:${T.goldBright};border-radius:2px 2px 0 0;border:1px solid ${T.ink}"></span></div>
  <!-- right column labels (live cards fill the gaps) -->
  <div style="position:absolute;left:270px;top:48px;font:700 9.5px 'Segoe UI';letter-spacing:2px;color:${T.red}">THE SET</div>
  <div style="position:absolute;left:270px;top:158px;font:700 9.5px 'Segoe UI';letter-spacing:2px;color:${T.red}">PARTS</div>
  <div style="position:absolute;left:270px;top:224px;font:700 9.5px 'Segoe UI';letter-spacing:2px;color:${T.red}">BUILD</div>
  <div style="position:absolute;left:270px;top:288px;width:154px;font:italic 400 9.5px Georgia,serif;color:${T.ink2}">photo · Rebrickable archive</div>`;
}

const PAGES = { cover, yellow, cameback, colours, dark, map_folded, map_open };
const SIZES = { cover: { W: CW, H: CH } };   // portrait cover; every other page landscape
const TIPS = {
  tip_harry: { w: 476, h: 250, fn: () => minifigTip('cut_harry', "Look closer — this one set hides <b>55</b> real brick colours. There's only one LEGO set ever built that has more colours.", 'Harry Potter', T.red) },
  tip_vold: { w: 476, h: 250, fn: () => minifigTip('cut_vold', "All this colour… how <i>garish</i>. Come find me in the greys, where <b>97.9%</b> of a set is shadow.", 'Lord Voldemort', '#7A5A1C', 224, 158, 258, 'come to the dark side and see for yourself') },
  tip_dementor: { w: 476, h: 250, fn: () => minifigTip('cut_dementor', "Seven pieces of pure dread — no minifig in the Yellow Years is built from more.", 'The Dementor · largest of the era', '#4A5A3E') },
  tip_marge: { w: 542, h: 250, fn: () => minifigTip('cut_marge', "Fourteen pieces and still inflating — no Harry Potter minifig ever built is bigger than me.", 'Aunt Marge · the largest of all', T.red, 200, 232, 250) },
  tip_yellow_duo: { w: 600, h: 252, fn: () => duoTip('cut_ron_y', 'cut_hermione_y', 'Ron & Hermione · the yellow years', `Back then we were a small cast — just ${nchip('134')} Harry Potter minifigures in the whole Yellow Years, the first of us in classic sunshine yellow.`, '#B8912E') },
  tip_colour_duo: { w: 600, h: 252, fn: () => duoTip('cut_ron_c', 'cut_hermione_c', 'Ron & Hermione · the colour years', `The return brought ${nchip('442')} minifigures — more than triple the Yellow Years — and every one now wears a real, flesh-toned face.`, '#7C2B22') },
  tip_appearances: { w: 600, h: 252, fn: () => duoTip('cut_draco', 'cut_harry_og', 'Set-appearance record', `Draco appears in ${nchip('7')} different sets — 2nd-most of any Harry Potter minifig. Only one wizard tops him: the very first yellow-faced Harry, on the right.`, '#2F6B4A') },
  tip_credits: { w: 640, h: 480, fn: creditsCard },
  tt_set_bg: { w: 440, h: 320, fn: ttSetCard },
  ...Object.fromEntries(Object.keys(MQUOTES).map(s => [`tip_map_${s}`, { w: 620, h: 440, fn: () => mapTip(s) }])),
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

// hotspot registry for the PBIR build (oath, mischief + every name banner):
// only written when the map pages were composed this run, so partial renders
// of other pages can't emit an empty registry.
if (Object.keys(BANNERS).length) {
  writeFileSync(join(HERE, 'map_banners.json'), JSON.stringify(BANNERS, null, 1));
  console.log('wrote map_banners.json:', Object.keys(BANNERS).join(' '));
}

await browser.close();
