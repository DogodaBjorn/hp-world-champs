# Canvas guide: wireframes & background SVGs

## 1. The wireframe step (stage 5)

Before any visual is specced, each page gets a wireframe in the design
handoff — an annotated slot map on the 8px grid:

```
┌──────────────────────────────────────────────── 1280×720 ─┐
│ z_masthead (1280×72)                                       │
├──────────┬──────────┬──────────┬──────────────────────────┤
│ kpi slot │ kpi slot │ kpi slot │ sl_period (256×48)        │
│ 288×112  │ 288×112  │ 288×112  │                           │
├──────────┴──────────┴──────────┼──────────────────────────┤
│ hero slot (824×360)            │ side slot (368×360)       │
├────────────────────────────────┴──────────────────────────┤
│ z_footer (1280×40)                                         │
└────────────────────────────────────────────────────────────┘
```

Rules: page margin and gutters from the design brief; every slot named with
the visual id that will fill it; slots snap to the 8px grid; unplaced
visuals don't exist. The wireframe is part of gate G5 — layout arguments
happen here, not at build time.

## 2. Generating the background SVG

One SVG per page in `project/deliverables/canvas/<page-id>.svg`, sized
exactly to the canvas (e.g. `viewBox="0 0 1280 720"`), containing only
furniture:

- full-canvas rect in the canvas token;
- one rect per card slot: surface token fill, radius token, hairline
  stroke (and the shadow spec only if the brief says shadows — as an SVG
  filter kept subtle, or omitted and left to visual-level effects);
- chrome zone washes (masthead band, footer strip) in their brief colors;
- section dividers as hairlines.

Discipline: tokens only (bake hex values — same rule as icon-studio); no
text, no data marks, no logos (the logo is a `z_` image visual so it stays
crisp and swappable); keep the SVG hand-readable — grouped per zone with
`id` attributes matching slot names, so diffs review like the wireframe.

Raster fallback: if the background must be PNG (verify current image-format
support for page backgrounds at build time), export at 2× canvas size to
stay sharp; keep the SVG as the source of truth beside it.

## 3. Using it in the report

Registration is typically **Desktop-manual** (BUILD_LOG per page):
page background image → the page's file, fit = Fit, transparency 0%.
Then:

- visuals placed at their slot coordinates from the wireframe — the slot
  map *is* the layout spec;
- visuals on card slots run **transparent backgrounds** (the slot is the
  surface); the explicit-properties rule still applies — transparency is
  the recorded decision;
- z-order: background image (page) < data visuals < chrome (`z_*`) < nav.

## 4. Change discipline

The SVG regenerates from the wireframe + tokens; hand-tweaking the image
without updating the wireframe is drift. On rebrand: regenerate all page
SVGs from the new kit (colors change, geometry doesn't). On layout change:
wireframe first, then SVG, then move the visuals — same order as the first
build.

## 5. Optional design-tool path (e.g. Figma)

When a designer works in Figma (or similar): set the artboard to the exact
canvas size, mirror the brand-kit tokens as styles, design the same
furniture-only background, export SVG/PNG into
`project/deliverables/canvas/`. The design handoff still records the slot
map — the wireframe is the contract either way. Keep tool files out of the
repo; the exported background + wireframe are the versioned artifacts.
