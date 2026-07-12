# canvas-studio

Wireframe-first layout and designed page backgrounds. Reports that look
*designed* usually are: the grid, card surfaces, and chrome zones were
decided on paper first and then baked into a single background image the
visuals sit on. This module formalizes both steps.

The workflow draws on the design-tool-first school of Power BI layout
(Mara Pereira's Figma approach, bibb.pro's wireframing and layout writing —
consulted as inspiration; the method here is re-derived for this repo's
agent-driven flow, with SVG generation replacing a design tool when none is
in play).

## Why a background image

- **Coherence:** one SVG carries the entire page's furniture — canvas wash,
  card surfaces with radius and hairline, section dividers, chrome zones —
  guaranteeing pixel-identical structure across pages.
- **Performance:** one image renders faster than a stack of shape visuals,
  and it can't be nudged out of alignment by a stray drag.
- **Separation:** furniture in the background, data in visuals, chrome
  (`z_*`) on top. Each layer changes independently.

## Doctrine

1. **Wireframe before visuals.** The design handoff's layout line becomes a
   real wireframe: slots drawn and sized on the 8px grid before any
   visual.json exists. A visual without a slot doesn't get built.
2. **The background is furniture, never data.** No numbers, labels, or
   meaning-bearing marks in the image — data ink belongs to visuals that
   filter and update. Decoration inside data areas is banned by the design
   hard rules regardless of layer.
3. **Tokens only.** Background colors, hairlines, radii from the brand
   kit / design brief — the background regenerates on rebrand like the
   theme does.
4. **Transparent cards over painted slots.** Visuals sitting on background
   card slots run transparent backgrounds — one surface, not two stacked
   ones fighting at the corners.

## Flow

Enable `canvas-studio` in `project/project.yaml` → the `ca-canvas` skill
wireframes pages at stage 5, generates per-page background SVGs into
`project/deliverables/canvas/`, and hands the registration steps (page
background image, fit, transparency) to the BUILD_LOG. Details:
[canvas-guide.md](canvas-guide.md).
