// SVG -> PNG @scale for canvas-studio backgrounds.
// Usage: node svg2png.mjs <dir> <manifest.tsv>   (manifest: src\tdst\tscale)
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [dir, manifest] = process.argv.slice(2);
const jobs = readFileSync(manifest, "utf-8").trim().split("\n").map(l => l.split("\t"));
for (const [src, dst, scale] of jobs) {
  const svg = readFileSync(join(dir, src), "utf-8");
  const resvg = new Resvg(svg, {
    fitTo: { mode: "zoom", value: Number(scale) },
    font: { loadSystemFonts: true },
  });
  const png = resvg.render().asPng();
  writeFileSync(join(dir, dst), png);
  console.log(`${src} -> ${dst} (${resvg.width * Number(scale)}x${resvg.height * Number(scale)})`);
}
