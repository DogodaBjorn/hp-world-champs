---
name: powerbi-pixel-perfect
description: Recreate HTML design prototypes as pixel-perfect Power BI reports using PBIP/PBIR format. Use when building or editing the Two Marriages LEGO HP dashboard, or any report from this handoff bundle.
---

# Skill: Pixel-perfect Power BI from HTML prototypes

## Golden rules
1. **The HTML prototype is the source of truth.** Never eyeball positions — measure them with `tools/extract_layout.mjs`, which dumps exact getBoundingClientRect() values for every element of every screen.
2. **Work in PBIP + PBIR format** (`.pbip` with `definition/` folder, PBIR enhanced report format). Every visual is a `visual.json` file with an explicit `position: {x, y, z, width, height}` — copy the measured rects verbatim. Never place visuals by drag-and-drop.
3. **One page per spec file** in `pages/`. Page size 1280x720 (T1: 320x240, pageBinding type Tooltip).
4. **Import `theme.json`** into `definition/report.json` themeCollection before creating pages.
5. **Generate references first**: run tools/capture_references.mjs once to produce exact @2x PNGs of every screen. **Then verify visually in a loop**: after building each page, screenshot the rendered report (Desktop or Fabric) and diff against `reference_screenshots/<page>.png`. Iterate until rects, text sizes, and colors match within +-2px.

## Workflow per page
1. Read `pages/<page>.md` (visual list, bindings, copy) + run the extractor for exact rects.
2. Scaffold the page JSON from `pbir_templates/page.json`.
3. Static text (eyebrows, titles, footers) -> textbox visuals (`pbir_templates/textbox.visual.json`). Fonts: Crimson Pro must be installed on the build machine and named exactly 'Crimson Pro'; fallback Georgia only if impossible (flag it).
4. KPI values -> card visuals bound to DAX measures from `data_model.md`; bind [TK] measures anyway and let them show blank.
5. All brick charts, palette strips, composition bars -> **Deneb (Vega-Lite)** visuals. Recipes in `brick_chart_recipe.md`; starting spec in `deneb_specs/`. Deneb gives exact pixel control — always prefer it over native charts for these.
6. Buttons -> Power BI button visuals with page-navigation / bookmark actions; match border, fill, hover fill from spec.
7. Images (SVG glyphs, Rebrickable photos) -> image visuals; register assets in report resourcePackages.
8. Sorting Quiz -> custom visual project per `custom_visual_quiz.md` (pbiviz new, TypeScript). Build once, import the .pbiviz.

## Measuring layout
```bash
npm i -D playwright && npx playwright install chromium
node tools/extract_layout.mjs "design_references/Phase 2 - Hi-fi Screens.dc.html" > layout.json
node tools/capture_references.mjs "design_references/Phase 2 - Hi-fi Screens.dc.html" reference_screenshots/
```
Output: per screen (keyed by data-screen-label), every element with tag, own text, rect {x,y,w,h} **relative to the screen's top-left** (= report-canvas coordinates), computed font family/size/weight/color, background, border. Use these rects directly as PBIR positions.

## Colors & tokens
All hexes are in README.md. Never approximate; Deneb specs and JSON must use exact hex strings.

## Definition of done (per page)
- [ ] All visuals at measured rects (+-2px)
- [ ] Copy verbatim (typographic middle-dot and em-dash preserved)
- [ ] Screenshot diff vs reference accepted
- [ ] Footer + source attribution present
- [ ] Nav wired (S1 grid, S4a<->S4b bookmarks)
- [ ] Tooltip page bound to minifig/set data points
