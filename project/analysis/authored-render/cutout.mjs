// cutout.mjs — turn a Rebrickable product photo into a true-alpha transparent
// PNG so LEGO minifigs/sets can float on the parchment (no white boxes).
//
// Two steps: (1) Gemini 2.5 Flash Image isolates the subject on a solid CHROMA
// background (magenta), which it does with clean semantic edges even when the
// subject itself contains white; (2) Playwright/canvas keys the magenta out to
// real alpha and writes an RGBA PNG.
//
// Usage: node cutout.mjs --input <img> --output <out.png>

import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join, extname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..', '..', '..');
const OPS = 'E:/TrainerBjornOps/LinkedInContentOps';
const req = createRequire(join(OPS, 'package.json'));
const { GoogleGenAI } = req('@google/genai');
const reqPw = createRequire(join(REPO, 'design_handoff_powerbi', 'package.json'));
const { chromium } = reqPw('playwright');

const cfg = JSON.parse(readFileSync('E:/TrainerBjornOps/secrets/google-api-config.json', 'utf8'));
const ai = new GoogleGenAI({ apiKey: cfg.apiKey });
const model = cfg.model || 'gemini-2.5-flash-image';
const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : null; };
const input = arg('input'), output = arg('output');
const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' }[extname(input).toLowerCase()] || 'image/jpeg';

const prompt = `Isolate ONLY the LEGO subject in this photo. Replace the entire original background with a SINGLE FLAT solid pure magenta colour (hex #FF00FF), edge to edge, behind and around the subject. Keep the subject's own colours exactly as they are, with clean crisp edges. Do NOT put any magenta, pink or purple tint on the subject itself, and add no shadow, floor, gradient or text. Output one image: the LEGO subject on a pure #FF00FF background.`;

const resp = await ai.models.generateContent({ model, contents: [{ role: 'user', parts: [
  { inlineData: { mimeType: mime, data: readFileSync(input).toString('base64') } }, { text: prompt }] }] });
let raw = null;
for (const p of (resp?.candidates?.[0]?.content?.parts || [])) if (p?.inlineData?.data) { raw = p.inlineData.data; break; }
if (!raw) { console.error('no image returned'); process.exit(1); }

// key the magenta -> alpha in a canvas
const browser = await chromium.launch();
const page = await browser.newPage();
const dataUrl = await page.evaluate(async (b64) => {
  const img = new Image();
  await new Promise(r => { img.onload = r; img.src = 'data:image/png;base64,' + b64; });
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, c.height); const a = d.data;
  for (let i = 0; i < a.length; i += 4) {
    const r = a[i], g = a[i + 1], bl = a[i + 2];
    const magenta = Math.min(r, bl) - g;      // high for #FF00FF, low for real colours
    if (magenta > 90 && r > 120 && bl > 120) { a[i + 3] = 0; }
    else if (magenta > 45 && r > 100 && bl > 100) { a[i + 3] = Math.max(0, 255 - (magenta - 45) * 5); a[i] = Math.min(r, 60); a[i + 2] = Math.min(bl, 60); }
  }
  ctx.putImageData(d, 0, 0);
  return c.toDataURL('image/png');
}, raw);
await browser.close();
writeFileSync(output, Buffer.from(dataUrl.split(',')[1], 'base64'));
console.log('wrote', output, '(alpha PNG)');
