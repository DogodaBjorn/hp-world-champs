# Table & matrix patterns

Recipes for premium tables. Research-first: the table/matrix formatting
surface (cell elements, sparklines, styling presets) evolves monthly —
verify current property names in Desktop / the visual's schema before
authoring PBIR, and expect some settings to be Desktop-manual (BUILD_LOG).

## 1. Typography & alignment (the free 80%)

- **Numbers right-aligned, text left-aligned, headers align with their
  column's content.** Center-aligned anything in a data table is a smell.
- **One decimal discipline per column**, set in the measure's formatString —
  never mixed precision down a column.
- Row height generous enough to breathe (the 8px grid applies inside
  visuals too); header row visually distinct by weight, not by a heavy fill.
- Gridlines: horizontal hairlines only (hairline token), or none with
  enough row spacing. Vertical gridlines almost never earn their ink.
- **No zebra striping by default** — it's rhythm noise; use it only when
  rows are so wide the eye loses the line.
- Font sizes from the type scale (body for cells, section for headers);
  never below the accessibility minimum in the design brief.

## 2. Column architecture

Order columns the way the reader reasons:

```
identity | context | actual | comparison | variance | trend
(name)     (dims)    (now)    (PY/plan)   (Δ, Δ%)    (micro-viz)
```

- **Variance pattern:** actual + prior/plan + `Δ` and/or `Δ%` with the
  good/bad pair applied to the variance cells only (sign always shown —
  color never alone).
- Don't ship both `Δ` and `Δ%` unless both answer a contracted question;
  pick the one the audience decides with.
- Column headers are business language (metric contract names), units in
  the header (`Revenue (€K)`) — not repeated in every cell.

## 3. In-cell micro-viz

Preference order:

1. **Native data bars** — magnitude scanning down a column; bar color =
   neutral data token (accent only if the column *is* the story).
2. **Native sparklines** — trend per row; one accent-colored line, no
   markers except an endpoint where it aids reading.
3. **SVG-in-DAX marks** (icon-studio's pattern) — where native can't: state
   chips, delta arrows with value, bullet-style target bars. Keep each mark
   one shape + one text; the value must also exist as plain text/column for
   accessibility and export.

A micro-viz column *replaces* number columns; if the numbers stay, the
micro-viz goes.

## 4. Heat encodings (deliberate heatmaps)

Background conditional formatting across a measure column/matrix is a
**heatmap decision**, not table styling: use the kit's sequential ramp
(or diverging for variance around a center), keep text readable at both
ends (contrast — a11y-studio's script checks the extremes), and legend the
scale in the header or a callout.

## 5. Matrix specifics

- Layered/grouped headers: group columns under period or scenario bands;
  keep to two header layers — three reads as a pivot-table accident.
- Stepped vs. tabular row hierarchy: stepped saves width for deep
  hierarchies; tabular scans better at ≤2 levels.
- **Expand/collapse discipline:** default state is a design decision in the
  handoff (usually top level expanded, rest collapsed); +/- icons on.
- Subtotals only at the levels the audience decides with; label them
  ("Total North", not just bold).

## 6. Density presets

| Preset | Row height | Use |
|---|---|---|
| Executive | ~1.5× body size | ≤ 15 rows, scanned in a glance |
| Working | ~1.25× | the standard Detail page |
| Operational | ~1.1× | dense monitoring lists; needs the strongest alignment discipline |

Pick one per table in the handoff; never mix presets on a page.

## 7. Interaction

- Sort default set deliberately (usually the ranking column, descending)
  and recorded — "whatever it happened to be" is not a default.
- Drill-through from identity columns to the Detail page carries context
  (nav-studio's back/breadcrumb pattern applies on the target).
- Export-friendliness: hidden helper columns stay out of the visual; what
  the reader exports should be what they see.

## Pitfalls (reject on sight)

Zebra + gridlines + borders together (triple rhythm noise); rainbow
conditional formatting; center-aligned numbers; icons in every cell;
bold-everything; totals that sum ratios; sparklines with four series;
matrix-as-layout-hack for non-tabular content.

## Works-with-the-user checklist

- [ ] Find-my-row in under 5 seconds (sort/identity column placement)
- [ ] Best/worst visible without reading every number (one encoded column)
- [ ] Exact value verifiable for any cell (no value only-in-viz)
- [ ] Column headers answer "what & in which unit" without a legend hunt
- [ ] Total row honest (meaningful or deliberately blank)
- [ ] Renders clean at the report's real canvas — no clipped headers,
      no scrollbar surprise on the hero rows
