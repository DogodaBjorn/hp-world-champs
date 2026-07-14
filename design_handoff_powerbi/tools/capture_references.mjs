// tools/capture_references.mjs - render each screen of the prototype to an exact-size PNG
// usage: node tools/capture_references.mjs "design_references/Phase 2 - Hi-fi Screens.dc.html" reference_screenshots/
import { chromium } from 'playwright';
import { pathToFileURL } from 'url';
import { resolve, join } from 'path';
import { mkdirSync } from 'fs';
const [file, outDir = 'reference_screenshots'] = process.argv.slice(2);
if (!file) { console.error('usage: node capture_references.mjs <html file> [outDir]'); process.exit(1); }
mkdirSync(outDir, { recursive: true });
const ids = { 'S1 Home': 'S1_home', 'S2 Chapter I': 'S2_chapter1', 'S3 Chapter II': 'S3_chapter2', 'S4a Most Colorful': 'S4a_most_colorful', 'S4b Dark State': 'S4b_dark_state', 'S5 Sorting Quiz': 'S5_sorting_quiz', 'T1 Tooltip': 'T1_tooltip' };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(resolve(file)).href);
await page.waitForTimeout(5000); // DC runtime + webfonts
for (const el of await page.locator('[data-screen-label]').all()) {
  const label = await el.getAttribute('data-screen-label');
  const name = ids[label] || label.replace(/\W+/g, '_');
  await el.scrollIntoViewIfNeeded();
  await el.screenshot({ path: join(outDir, name + '.png') });
  console.log(name + '.png');
}
await browser.close();
