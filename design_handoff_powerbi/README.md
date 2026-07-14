# Handoff: LEGO Harry Potter — "Two Marriages" Retrospective Dashboard

Target: **Power BI Project (PBIP format)** built by Claude Code agents in VS Code.
Report canvas: **1280 × 720 px** per page (+ one 320 × 240 tooltip page).

## Overview
A 5-page (plus dark-state variant + tooltip page) narrative dashboard telling the story of LEGO Harry Potter's two production eras ("marriages"): 2001–2011 and 2018–2026, separated by seven silent years. Data source: Rebrickable LEGO Database extracts.

## About the Design Files
Files in `design_references/` are **HTML design prototypes** — the visual truth for look, layout, and behavior. They are NOT production code. Your task is to **recreate them in Power BI**: native visuals where possible, a custom visual (TypeScript, powerbi-visuals-tools) for the Sorting Quiz, and image/SVG assets for decorative elements. Open `Phase 2 - Hi-fi Screens.dc.html` in a browser to see all screens pixel-accurate.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy are final. Recreate pixel-perfectly within Power BI's constraints. Where Power BI can't match exactly (e.g. repeating-gradient "brick course" fills), use the documented fallback in each page spec.

## For Claude Code agents
Copy `.claude/skills/powerbi-pixel-perfect/` into the target repo's .claude/skills/ before starting. The skill defines the pixel-perfect workflow: PBIP/PBIR project format, measured positions via tools/extract_layout.mjs (Playwright), Deneb for all custom charts, and a screenshot-diff verification loop against reference_screenshots/.

## Reading order
1. `theme.json` — import as report theme first.
2. `data_model.md` — tables, fields, measures, and outstanding [TK] data.
3. `pages/` — one spec per page with visual-by-visual type, position (x/y/w/h), formatting, and field bindings.
4. `brick_chart_recipe.md` — the shared brick-style bar chart treatment used everywhere.
5. `custom_visual_quiz.md` — spec for the Sorting Quiz TypeScript custom visual.

## Design system (tokens)
Colors:
- Parchment page bg `#F5EFE3` · Card bg `#FCF9F1` · Canvas around pages `#E7E1D2`
- Ink (text) `#211B14` · Muted text `#5C5346` · Rule/border `#D8CFBC` · Frame border `#B5AB95`
- Era I (first marriage) `#8C7A5B` (course highlight `#A08E6C`)
- Era II (second marriage) `#6E2B25` (course highlight `#84443D`)
- Gold accent (labels, links) `#8A6A21` · Gold-bright (focus/locked) `#C9A227`
- Chapter IV green `#2E5941` (hover `#254A36`) · Error red `#B33A2B`
- Dark page: bg `#15120E`, text `#CFC9BE`, muted `#948D80`, accent `#D95F4B`, rule `#3A342B`
- LEGO brights (nav glyphs only): yellow `#F2CD37`, red `#C91A09`, blue `#0055BF`

Typography:
- Display serif: **Crimson Pro** (600 for headings, italic for asides). Ship the font with the theme or substitute Power BI's closest (Georgia/"Palatino Linotype") ONLY if embedding is impossible — flag it if so.
- UI sans: **Segoe UI** (native to Power BI).
- Scale: page title 38px/600 serif · hero numbers 150–170px serif · KPI value 30px serif 600 · KPI label 11.5px sans `#5C5346` · section eyebrow 11–13px sans 600, letter-spacing 0.12–0.14em, UPPERCASE · body 15px/1.5 · footer 11.5px.

Structural conventions (every page):
- Page background `#F5EFE3`, 1px `#B5AB95` outline.
- Footer strip: 28px tall at y=692, top border 1px `#D8CFBC`, left text "Source: Rebrickable LEGO Database (rebrickable.com)", right text page name + "N of 5", 11.5px `#5C5346`, 32px side padding.
- Header band (S2/S3/S5): 26px top padding, bottom border 1px `#D8CFBC` at y≈78; eyebrow "Chapter N" in accent + serif title 38px on one baseline; italic serif subtitle right-aligned.
- KPI row: cards separated by 24px gap, each with 2px top border in era color, value above label.
- Side padding is 32px everywhere (left panel on S1 uses 28px).

## IP-safety rules (binding)
- No LEGO or Warner Bros. logos, no branded fonts, no film imagery.
- Recognition devices are original vectors only: brick-with-two-studs glyph, spectacles + lightning bolt mark, yellow smiley heads.
- Set/minifig photos come from Rebrickable CDN (attributed in footer). Slots marked [IMG: rebrickable] in the prototypes.

## Assets to produce
- `spectacles-bolt.svg` and `brick-glyph.svg` — copy the inline SVGs from S1's left panel in the prototype (exact paths there).
- Brick-course fills: see brick_chart_recipe.md.

## Outstanding data ([TK] in prototypes — resolve before ship)
- 2006, 2008, 2009 parts totals (hero chart)
- Diagon Alley Wizarding Shops (2025) part count
- Distribution bin counts (both eras, 5 bins each)
- Names/metadata for gallery sets 3–4 (era I) and 3 (era II)
- Ron & Dumbledore variant counts

## Files
- tools/capture_references.mjs — run this FIRST to generate reference_screenshots/ (exact 1280x720 @2x PNG per screen, the pixel-diff targets)
- tools/extract_layout.mjs — Playwright rect extractor (exact x/y/w/h per element)
- pbir_templates/ — PBIR page + textbox visual JSON skeletons
- deneb_specs/hero_brick_chart.md — Vega-Lite starting spec
- .claude/skills/powerbi-pixel-perfect/SKILL.md — Claude Code skill
- `design_references/Phase 2 - Hi-fi Screens.dc.html` — hi-fi truth (all 7 screens)
- `design_references/Phase 1 - Tokens + Lo-fi.dc.html` — token exploration + wireframes
- `design_references/image-slot.js`, `support.js` — runtime for viewing the prototypes only; do not port
