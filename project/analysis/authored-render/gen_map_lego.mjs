// gen_map_lego.mjs — "LEGO meets Hogwarts": image-to-image pass over the
// Gemini-drawn Marauder map (scenes/hogwarts_map.png), redrawing the castle as
// brick-built while keeping the composition identical so the 16 baked banner
// hotspots (map_banners.json) stay aligned. Same Gemini pattern as cutout.mjs.
//
// Usage: node gen_map_lego.mjs   -> scenes/hogwarts_map_lego.png

import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OPS = 'E:/TrainerBjornOps/LinkedInContentOps';
const req = createRequire(join(OPS, 'package.json'));
const { GoogleGenAI } = req('@google/genai');

const cfg = JSON.parse(readFileSync('E:/TrainerBjornOps/secrets/google-api-config.json', 'utf8'));
const ai = new GoogleGenAI({ apiKey: cfg.apiKey });
const model = cfg.model || 'gemini-2.5-flash-image';

const input = join(HERE, 'scenes', 'hogwarts_map.png');
const output = join(HERE, 'scenes', 'hogwarts_map_lego.png');

const prompt = `Redraw this hand-drawn ink map so that every building and structure is visibly CONSTRUCTED FROM LEGO BRICKS, while keeping the drawing otherwise IDENTICAL. Keep the exact same composition, the same positions and sizes of the castle, quidditch pitch, forest, small round hut, willow tree, distant shack, paths, lake shoreline, corner flourishes and parchment background — do not move, add or remove any structure. Change only the rendering of the structures: give the castle walls visible LEGO brick seams and stud rows along rooftops, tower tops and battlements drawn as rows of tiny round LEGO studs, the towers built from stacked round bricks, the hut and shack with studded roofs, the quidditch stands with brick texture. Also add a few small loose ink-drawn LEGO bricks (2x4 bricks with studs) lying scattered in the empty grounds, and one tiny ink-drawn LEGO minifigure silhouette walking on a path. Keep the exact same fine sepia-brown ink line art style on aged cream parchment, same line weight, same hatching. Absolutely no text, no letters, no numbers, no labels, no watermark, no colour other than the sepia ink and parchment.`;

const resp = await ai.models.generateContent({ model, contents: [{ role: 'user', parts: [
  { inlineData: { mimeType: 'image/png', data: readFileSync(input).toString('base64') } }, { text: prompt }] }] });
let raw = null;
for (const p of (resp?.candidates?.[0]?.content?.parts || [])) if (p?.inlineData?.data) { raw = p.inlineData.data; break; }
if (!raw) { console.error('no image returned'); process.exit(1); }
writeFileSync(output, Buffer.from(raw, 'base64'));
console.log('wrote', output);
