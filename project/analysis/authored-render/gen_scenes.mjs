// gen_scenes.mjs — generate the cinematic hero art for the storybook.
//
// Uses TrainerBjornOps' Gemini 2.5 Flash Image ("Nano Banana") via @google/genai.
// Key is read from E:\TrainerBjornOps\secrets\google-api-config.json (the same
// config the LinkedInContentOps image pipeline uses). Nothing is published.
//
// Output: project/analysis/authored-render/scenes/<name>.png  (raw cinematic
// scenes; render_bg.mjs composites them into the page backgrounds).
//
// Usage: node gen_scenes.mjs [name ...]   (default: all not already present)
//        node gen_scenes.mjs --force <name>   (regenerate one)

import { createRequire } from 'module';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OPS = 'E:/TrainerBjornOps/LinkedInContentOps';
const require2 = createRequire(join(OPS, 'package.json'));
const { GoogleGenAI } = require2('@google/genai');

const cfg = JSON.parse(readFileSync('E:/TrainerBjornOps/secrets/google-api-config.json', 'utf8'));
const apiKey = cfg.apiKey;
const model = cfg.model || 'gemini-2.5-flash-image';
if (!apiKey) { console.error('no apiKey in config'); process.exit(1); }

const OUT = join(HERE, 'scenes');
mkdirSync(OUT, { recursive: true });

const NEG = 'text, words, letters, numbers, logos, watermark, signature, human faces, people portraits, blurry, low quality, flat vector, cartoon, daytime, bright white background';
const COMMON = 'Built entirely from LEGO bricks and minifigure-scale, photoreal LEGO product-render look, cinematic dramatic lighting, deep shadows, richly detailed, moody atmospheric.';

// Each scene leaves negative space (dark sky) for text/cards on one side.
const SCENES = {
  cover: `A wide cinematic establishing shot of Hogwarts castle at night on a cliff above a black glassy lake. Hundreds of windows glow warm gold; deep midnight-blue starry sky with a faint golden aurora, a large pale moon, and a few owls in flight; loose LEGO bricks drift in the foreground catching gold rim light and reflecting in the water. Left third is darker open night sky (negative space). Gold and midnight-blue palette. ${COMMON}`,

  yellow: `A nostalgic, humble early-2000s LEGO Harry Potter scene: a smaller, simpler classic brick-built Hogwarts wing and the Hogwarts Express steam train, lit by warm amber candlelight and lantern glow, a few bright-yellow classic minifigures in lit windows, cosy and old-fashioned. Warm sepia-gold and brown palette, soft golden haze, dark surroundings. Negative space of dark warm sky on the right. ${COMMON}`,

  cameback: `Triumphant multicoloured magical fireworks bursting in the night sky over a grand LEGO Hogwarts castle, vivid rainbow sparks — gold, red, teal, purple, green — reflecting on the lake below, a celebratory sense of return and glory, the castle glowing. Midnight sky with an explosion of colour. Negative space lower-left. ${COMMON}`,

  colours: `LEGO Diagon Alley at dusk exploding with colour — vivid magical shopfronts in purple, teal, crimson, gold and orange, glowing lanterns and signage, swirling magical sparks, a rainbow of loose LEGO bricks drifting in the air, celebratory and richly saturated yet cinematic and moody. Dark sky above with negative space at the top. ${COMMON}`,

  dark: `A shadowy, desaturated LEGO scene of a cold stone vault / the Chamber of Secrets, near-black and grey, faint sickly green and dim red glow from torches, ominous serpentine carvings, heavy darkness, minimal colour, low-key cinematic lighting, oppressive shadow. Large areas of near-black negative space. ${COMMON}`,

  explore: `The interior of Ollivanders wand shop built from LEGO, towering shelves of dusty wand boxes receding into shadow, warm golden shafts of light with floating dust motes and magical sparks, a single wand glowing softly, inviting and mysterious, a sense of discovery and choice. Warm gold and deep brown, dark edges, negative space on the right. ${COMMON}`,

  sources: `The Hogwarts library at night built from LEGO, towering bookshelves of tiny spellbooks receding into darkness, warm candlelight on a reading table, quiet and scholarly, floating dust and faint gold sparkles, deep shadows. Muted gold and midnight palette, generous dark negative space. ${COMMON}`,

  // --- spellbook textures (not LEGO scenes; override COMMON via full prompt) ---
  parchment: `A high-resolution flat aged parchment paper texture filling the whole frame. Warm cream and tan tones, subtle brown foxing stains and faint water marks, delicate paper fibres, gently darkened and worn edges with a soft vignette, uneven handmade surface. Even soft lighting, flat top-down lay, completely empty. No text, no writing, no drawings, no objects, no logos, no watermark.`,

  tome: `A closed antique leather-bound wizarding spellbook resting on a dark aged wooden table in warm candlelight. Deep oxblood and umber leather cover with an intricate gold-embossed filigree border, ornate corner flourishes and a central emblem, a dark red wax seal, a frayed silk ribbon bookmark peeking from the pages, brass corner guards, gilded page edges, aged and magical, cinematic shallow depth of field, rich shadows. Centred with dark negative space around it. No text, no letters, no words, no logos, no watermark.`,

  hogwarts_map: `A hand-drawn antique map of Hogwarts castle and its grounds, drawn in fine sepia-brown ink line art on aged cream parchment, in the style of a mischievous old wizarding document. High-angle aerial view, landscape orientation. The castle drawn as detailed pen-and-ink architecture: many pointed towers and turrets, the Great Hall with its long roof, an astronomy tower, arched bridges, courtyards, a grand staircase tower. Around the castle: a large lake at one side drawn with fine wavy ink lines, an oval quidditch pitch with tiny hoop towers, a small round gamekeeper's hut with a chimney, the edge of a dark pine forest, a lone gnarled willow tree, and a winding dotted path leading off toward a distant shack. Decorative fine-line cross-hatching and stipple shading, delicate ink flourishes in the corners, small pairs of tiny ink footprints wandering along corridors and paths. Warm cream, tan and sepia palette only. Completely empty of writing: absolutely no text, no letters, no words, no numbers, no labels, no banners, no cartouche, no compass rose letters, no watermark.`,
};

const ai = new GoogleGenAI({ apiKey });
const args = process.argv.slice(2);
const force = args.includes('--force');
const only = args.filter(a => a !== '--force');

for (const [name, scene] of Object.entries(SCENES)) {
  if (only.length && !only.includes(name)) continue;
  const outPath = join(OUT, `${name}.png`);
  if (existsSync(outPath) && !force) { console.log('skip (exists)', name); continue; }
  const promptText =
    `Create ONE ultra-detailed 16:9 landscape cinematic illustration.\n\nSCENE: ${scene}\n\n` +
    `Do NOT include: ${NEG}.\n\nOutput a single image only.`;
  process.stdout.write(`generating ${name} ... `);
  try {
    const resp = await ai.models.generateContent({ model, contents: [{ role: 'user', parts: [{ text: promptText }] }] });
    const parts = resp?.candidates?.[0]?.content?.parts || [];
    let saved = false;
    for (const p of parts) {
      if (p?.inlineData?.data) { writeFileSync(outPath, Buffer.from(p.inlineData.data, 'base64')); saved = true; break; }
    }
    console.log(saved ? 'ok' : 'NO IMAGE RETURNED');
  } catch (e) {
    console.log('FAILED:', e.message);
  }
}
console.log('done.');
