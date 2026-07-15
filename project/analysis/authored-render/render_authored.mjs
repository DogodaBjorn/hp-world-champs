// authored-render: draw the AUTHORED state of a PBIR report to PNGs.
//
// Power BI cannot render headlessly (see project/deliverables/diff-report.md),
// so this renders what the PBIR JSON *declares* — exact positions, fonts,
// sizes, colors, text — as absolutely-positioned HTML, then screenshots it
// with Playwright. Data visuals (Deneb, tables, cards) draw as labeled
// placeholders with correct chrome, so this is a LAYOUT/READABILITY truth,
// not a data render.
//
// Usage: node render_authored.mjs [pageName ...]   (default: all pages)
// Output: project/deliverables/authored-render/<page>.png (@2x)
//
// Playwright usage pattern credited to the design handoff's tools
// (design_handoff_powerbi/tools/*.mjs); vendored Playwright reused from there.

import { createRequire } from 'module';
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..');
const REPORT = join(REPO, 'project', 'pbip', 'second-build.Report', 'definition');
const RESOURCES = join(REPO, 'project', 'pbip', 'second-build.Report', 'StaticResources', 'RegisteredResources');
const OUT = join(REPO, 'project', 'deliverables', 'authored-render');

const require2 = createRequire(join(REPO, 'design_handoff_powerbi', 'package.json'));
const { chromium } = require2('playwright');

// ---------- PBIR expression unwrapping ----------
const lit = (node) => {
  // {"expr":{"Literal":{"Value":"'#211B14'"}}} -> "#211B14"; "12D" -> 12; "true" -> true
  const v = node?.expr?.Literal?.Value ?? node?.Literal?.Value;
  if (v === undefined) return undefined;
  if (typeof v !== 'string') return v;
  if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1);
  if (/^-?[\d.]+D$/.test(v)) return parseFloat(v);
  if (/^-?[\d.]+L?$/.test(v)) return parseFloat(v);
  if (v === 'true') return true;
  if (v === 'false') return false;
  return v;
};
const themeColor = (node) => {
  const solid = node?.solid?.color;
  if (!solid) return undefined;
  const l = lit(solid);
  if (l !== undefined) return l;
  return undefined; // ThemeDataColor etc. -> let caller default
};
const prop = (objects, objName, propName) => {
  const arr = objects?.[objName];
  if (!Array.isArray(arr)) return undefined;
  for (const entry of arr) {
    const p = entry?.properties?.[propName];
    if (p !== undefined) return p;
  }
  return undefined;
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- per-visual renderers ----------
function renderTextbox(vc, v) {
  const paragraphs = prop(v.objects, 'general', 'paragraphs') ?? [];
  let html = '';
  for (const p of paragraphs) {
    const align = p.horizontalTextAlignment ?? 'left';
    let line = '';
    for (const r of p.textRuns ?? []) {
      const st = r.textStyle ?? {};
      const css = [
        st.fontFamily ? `font-family:${st.fontFamily.replace(/'/g, '')}` : '',
        st.fontSize ? `font-size:${parseFloat(st.fontSize) / 0.75}px` : '',
        st.fontWeight === 'bold' ? 'font-weight:bold' : '',
        st.italic ? 'font-style:italic' : '',
        st.color ? `color:${st.color}` : '',
        st.letterSpacing !== undefined ? `letter-spacing:${st.letterSpacing}px` : '',
      ].filter(Boolean).join(';');
      line += `<span style="${css}">${esc(r.value ?? '')}</span>`;
    }
    html += `<div style="text-align:${align}">${line || '&nbsp;'}</div>`;
  }
  return html;
}

function renderShape(vc, v) {
  const fill = themeColor(prop(v.objects, 'fill', 'fillColor')) ?? 'transparent';
  const line = themeColor(prop(v.objects, 'outline', 'lineColor'));
  const weight = lit(prop(v.objects, 'outline', 'weight')) ?? 1;
  const show = lit(prop(v.objects, 'outline', 'show'));
  const border = line && show !== false ? `border:${weight}px solid ${line};` : '';
  return { style: `background:${fill};${border}`, html: '' };
}

function renderButton(vc, v) {
  const text = lit(prop(v.objects, 'text', 'text')) ?? '';
  const fontSize = lit(prop(v.objects, 'text', 'fontSize'));
  const fontColor = themeColor(prop(v.objects, 'text', 'fontColor')) ?? '#211B14';
  const bold = lit(prop(v.objects, 'text', 'bold'));
  const fill = themeColor(prop(v.objects, 'fill', 'fillColor'));
  const fillShow = lit(prop(v.objects, 'fill', 'show'));
  const outline = themeColor(prop(v.objects, 'outline', 'lineColor'));
  const outlineShow = lit(prop(v.objects, 'outline', 'show'));
  const style = [
    fillShow !== false && fill ? `background:${fill}` : '',
    outlineShow !== false && outline ? `border:1px solid ${outline}` : '',
    'display:flex;align-items:center;justify-content:center',
  ].filter(Boolean).join(';');
  const size = fontSize ? parseFloat(fontSize) / 0.75 : 16;
  const html = text
    ? `<span style="font-family:Segoe UI;font-size:${size}px;${bold ? 'font-weight:bold;' : ''}color:${fontColor};text-align:center">${esc(text)}</span>`
    : `<span style="font-size:11px;color:#999">[button]</span>`;
  return { style, html };
}

function renderCard(vc, v) {
  const q = v.query?.queryState?.Values?.projections?.[0]?.queryRef ?? v.prototypeQuery?.Select?.[0]?.Name ?? 'measure';
  const fontSize = lit(prop(v.objects, 'labels', 'fontSize')) ?? 22.5;
  const color = themeColor(prop(v.objects, 'labels', 'color')) ?? '#211B14';
  const family = lit(prop(v.objects, 'labels', 'fontFamily')) ?? 'Georgia';
  const bold = lit(prop(v.objects, 'labels', 'bold'));
  const px = fontSize / 0.75;
  const name = String(q).split('.').pop();
  return {
    style: 'display:flex;flex-direction:column;align-items:flex-start;justify-content:center;overflow:hidden',
    html: `<span style="font-family:${family};font-size:${px}px;${bold !== false ? 'font-weight:bold;' : ''}color:${color};line-height:1.05">1,234</span>` +
      `<span style="font-size:8px;color:#b09c7d;font-family:Segoe UI">[card: ${esc(name)}]</span>`,
  };
}

function renderImage(vc, v) {
  const nameNode = prop(v.objects, 'general', 'imageUrl') ?? prop(v.objects, 'imageScaling', 'imageUrl');
  let url = lit(nameNode);
  if (url && !/^https?:/.test(url)) {
    const local = join(RESOURCES, url.replace(/^.*\//, ''));
    if (existsSync(local)) url = pathToFileURL(local).href;
  }
  const rn = nameNode?.expr?.ResourcePackageItem?.ItemName;
  if (!url && rn) {
    const local = join(RESOURCES, rn);
    if (existsSync(local)) url = pathToFileURL(local).href;
  }
  return {
    style: '',
    html: url
      ? `<img src="${url}" style="width:100%;height:100%;object-fit:contain"/>`
      : `<div style="border:1px dashed #b09c7d;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:9px;color:#b09c7d">[image]</div>`,
  };
}

function renderPlaceholder(vc, v, label) {
  const fields = [];
  const proj = v.query?.queryState ?? {};
  for (const role of Object.values(proj)) {
    for (const p of role?.projections ?? []) fields.push(String(p.queryRef).split('.').pop());
  }
  return {
    style: 'border:1px dashed #a8956f;background:rgba(252,249,241,.5);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;overflow:hidden',
    html: `<span style="font-size:10px;color:#8a6a21;font-family:Segoe UI;font-weight:bold">[${esc(label)}]</span>` +
      `<span style="font-size:8px;color:#a8956f;font-family:Segoe UI;text-align:center">${esc(fields.join(' · '))}</span>`,
  };
}

// ---------- page assembly ----------
function renderPage(pageDir, pageName) {
  const page = JSON.parse(readFileSync(join(pageDir, 'page.json'), 'utf8'));
  const width = page.width ?? 1280, height = page.height ?? 720;
  const visualsDir = join(pageDir, 'visuals');
  const visuals = existsSync(visualsDir) ? readdirSync(visualsDir) : [];
  const boxes = [];
  for (const id of visuals) {
    const vj = join(visualsDir, id, 'visual.json');
    if (!existsSync(vj)) continue;
    const vc = JSON.parse(readFileSync(vj, 'utf8'));
    const pos = vc.position ?? {};
    const v = vc.visual ?? {};
    const type = v.visualType ?? (vc.visualGroup ? 'group' : '?');
    let inner = { style: '', html: '' };
    if (type === 'textbox') inner = { style: 'overflow:hidden', html: renderTextbox(vc, v) };
    else if (type === 'shape' || type === 'basicShape') inner = renderShape(vc, v);
    else if (type === 'actionButton') inner = renderButton(vc, v);
    else if (type === 'card') inner = renderCard(vc, v);
    else if (type === 'image') inner = renderImage(vc, v);
    else if (type.startsWith('deneb')) inner = renderPlaceholder(vc, v, 'Deneb');
    else if (type === 'pivotTable' || type === 'tableEx') inner = renderPlaceholder(vc, v, type);
    else if (type === 'slicer' || type === 'advancedSlicerVisual') inner = renderPlaceholder(vc, v, 'slicer');
    else if (type === 'barChart' || type === 'clusteredBarChart' || type === 'columnChart' || type === 'clusteredColumnChart') inner = renderPlaceholder(vc, v, type);
    else if (type === 'group') continue;
    else inner = renderPlaceholder(vc, v, type);
    boxes.push({ z: pos.z ?? 0, html:
      `<div title="${esc(id)}" style="position:absolute;left:${pos.x}px;top:${pos.y}px;width:${pos.width}px;height:${pos.height}px;z-index:${pos.z ?? 0};${inner.style}">${inner.html}</div>` });
  }
  boxes.sort((a, b) => a.z - b.z);
  const bg = '#F5EFE3';
  return `<!doctype html><meta charset="utf-8"><body style="margin:0"><div id="canvas" style="position:relative;width:${width}px;height:${height}px;background:${bg};overflow:hidden;font-family:Segoe UI">${boxes.map(b => b.html).join('\n')}</div></body>`;
}

// ---------- main ----------
const only = process.argv.slice(2);
const pagesDir = join(REPORT, 'pages');
const pageNames = readdirSync(pagesDir).filter(n => existsSync(join(pagesDir, n, 'page.json')));
const targets = only.length ? pageNames.filter(n => only.includes(n)) : pageNames;
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const bp = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
for (const name of targets) {
  const html = renderPage(join(pagesDir, name), name);
  const tmp = join(OUT, `_${name}.html`);
  writeFileSync(tmp, html);
  await bp.goto(pathToFileURL(tmp).href);
  await bp.waitForTimeout(400);
  await bp.locator('#canvas').screenshot({ path: join(OUT, `${name}.png`) });
  console.log('rendered', name);
}
await browser.close();
