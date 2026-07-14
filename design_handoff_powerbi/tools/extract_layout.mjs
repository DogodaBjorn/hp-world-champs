// tools/extract_layout.mjs - dump exact element rects from the HTML prototype
// usage: node tools/extract_layout.mjs <html file> > layout.json
import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import { resolve } from 'path';
const file = process.argv[2];
if (!file) { console.error('usage: node extract_layout.mjs <html file>'); process.exit(1); }
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
await page.goto(pathToFileURL(resolve(file)).href);
await page.waitForTimeout(4000); // let DC runtime + fonts render
const data = await page.evaluate(() => {
  const out = {};
  const r2 = (n) => Math.round(n * 10) / 10;
  for (const screen of document.querySelectorAll('[data-screen-label]')) {
    const sr = screen.getBoundingClientRect();
    const els = [];
    for (const el of screen.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const cs = getComputedStyle(el);
      const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
      els.push({
        tag: el.tagName.toLowerCase(),
        text: ownText.slice(0, 80) || undefined,
        rect: { x: r2(r.x - sr.x), y: r2(r.y - sr.y), w: r2(r.width), h: r2(r.height) },
        font: ownText ? { family: cs.fontFamily, size: cs.fontSize, weight: cs.fontWeight, color: cs.color, letterSpacing: cs.letterSpacing, transform: cs.textTransform } : undefined,
        bg: cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : undefined,
        bgImage: cs.backgroundImage !== 'none' ? cs.backgroundImage : undefined,
        border: cs.borderTopWidth !== '0px' ? cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor : undefined,
      });
    }
    out[screen.dataset.screenLabel] = { size: { w: r2(sr.width), h: r2(sr.height) }, elements: els };
  }
  return out;
});
console.log(JSON.stringify(data, null, 1));
await browser.close();
