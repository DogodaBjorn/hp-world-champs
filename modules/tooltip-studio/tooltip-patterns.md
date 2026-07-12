# Tooltip patterns

Recipes for the hover layer. Research-first: tooltip page setup (canvas
type, per-visual tooltip assignment properties) evolves — verify current
names in Desktop / the schema before authoring PBIR.

## Page setup (all patterns)

- Tooltip pages are hidden, named `tt-<name>` per
  `design/naming-conventions.md`, and flagged as tooltip pages (canvas
  type "Tooltip" — small canvas; keep it small, a tooltip the size of a
  page is a page).
- Same theme and tokens as the report; surface background, hairline border
  feel; type scale one step down from the main canvas.
- All content visible without scrolling; test with the longest realistic
  values (long category names, wide numbers).
- The tooltip inherits the hovered element's filter context — design each
  page for the grain it will receive, and state that grain in the page's
  purpose note.

## Pattern T1 — Mini-trend

- **Deepens:** magnitude visuals (KPI cards, bars): "how did this value get
  here?"
- **Content:** compact line (last N periods) with endpoint value, one
  accent line + gray prior period; a delta caption in words.
- **Reuse:** one page serves every measure of the same grain via the
  hovered context; a field-parameter variant can switch the measure shown
  to match the hovered card.

## Pattern T2 — Definition / trust tooltip

- **Deepens:** any visual showing a contracted metric: "what exactly am I
  reading?"
- **Content:** generated from the metric contract — plain-language
  definition, formula in words, standing filters ("excludes internal
  orders"), period convention, data-through date. Text-only, plain
  typography — this is the Definitions page's pocket edition (and links
  the reader there in spirit; tooltips can't link, so it names the page).
- **Discipline:** definitions come *verbatim* from `02-metrics.md` — the
  steward's words, never paraphrased at build time.

## Pattern T3 — Mini-breakdown

- **Deepens:** aggregates: "what's inside this number?"
- **Content:** top-N horizontal bars or a 2-column mini-table of the
  hovered value's components (top contributors + "other"), sorted, values
  labeled. Never a pie.
- **Limit:** N ≤ 5 + other; if the breakdown deserves interaction, that's
  a drill-through page, not a tooltip.

## Choosing per visual

At stage 5, the design handoff's visual table gets a tooltip column:
`default` (Power BI's standard tooltip, fine for simple visuals),
`tt-<name>` (a pattern page), or `none` (chrome and slicers). The trust
tooltip (T2) is the default recommendation for every KPI card.

## Wiring & handoff

Assigning a tooltip page to a visual is typically a **Desktop-manual step**:
BUILD_LOG lists visual id → tooltip page → verify-by (hover shows the page
with the hovered context applied). Where the PBIR property surface allows
setting it headlessly (verify per current schema), pbir-operator sets it and
the validator run stands as evidence.

## Pitfalls

Tooltip as a second report page (too big, too dense); interactive elements
readers try to click; smoothed mini-trends that invent data; definitions
paraphrased away from the steward's contract; tooltips styled in defaults;
important caveats *only* in the tooltip (they belong on the canvas or the
Definitions page).
