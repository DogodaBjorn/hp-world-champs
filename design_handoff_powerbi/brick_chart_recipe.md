# Brick-chart recipe (shared treatment)

All bar charts render as "brick-built" columns. Power BI native bar charts cannot do the stud caps or course lines, so every brick chart is built one of two ways:

**Option A (preferred): SVG measure in a native visual.** Use an HTML/SVG-capable visual (e.g. HTML Content certified visual) or Deneb (Vega-Lite) to render:
- Column fill: era color with a 1px lighter "mortar" line every 15px vertically (era I: #8C7A5B base / #A08E6C line; era II: #6E2B25 / #84443D).
- Two stud caps centered on top of each column: rounded-top rects, width 8–9px, height 5px, radius 2px 2px 0 0, gap 4–5px, same era color. Only on columns tall enough (>~10px).
- Category labels below in 10.5px #5C5346; value labels above only for key columns.

**Option B (fallback): native clustered column chart** with flat era-color fill, no studs — acceptable for a first pass, flag as visual debt.

Hero chart specifics (S1): missing-data columns (2006/08/09) render at fixed 48px height with a 45° #D8CFBC/#F5EFE3 hatch and 1px dashed #B5AB95 border, label "[TK]". Zero years (2012–2017) render as a 2px #D8CFBC sliver. Year labels rotated −90°.

Palette strips (S2/S3): a 1-unit-gap horizontal strip of flex-equal cells, one per distinct color, filled with the real brick hex, grayscale cells first (sorted dark→light) then colors. Bind to Colors table filtered to era. Deneb rect mark or a 100% stacked bar with per-point fill.

Composition bars (S4a/S4b): single horizontal 100% stacked bar, segment width = part_count share, fill = true hex, 1px gaps, ordered by part count desc.
