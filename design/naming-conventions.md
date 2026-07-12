# Naming conventions

Agent-authored PBIR must produce diffs a human can read. Desktop's hash IDs
(`27cfbbea…`) make review impossible; role-prefixed names make the report's
structure legible from a file listing alone.

## Pages

`p<n>-<kebab-name>` — e.g. `p1-overview`, `p2-drivers`, `p9-definitions`.
Tooltip and drill-through pages: `tt-<name>` / `dt-<name>` (hidden pages keep
their role visible in the name).

## Visuals

`<role>_<qualifier>` — the role prefix tells a reviewer what a visual *is*
before opening its JSON:

| Prefix | Role | Examples |
|---|---|---|
| `kpi_` | KPI value card | `kpi_revenue`, `kpi_margin` |
| `dlt_` | Delta / prior-period comparison card | `dlt_revenue_yoy` |
| `hero_` | The page's hero visual | `hero_trend`, `hero_waterfall` |
| `ch_` | Supporting chart | `ch_top_products`, `ch_mix` |
| `tbl_` | Table / matrix | `tbl_orders` |
| `sl_` | Slicer | `sl_period`, `sl_region` |
| `c_` | Callout / annotation text | `c_note_definition_change` |
| `z_` | Page chrome (never data) | `z_masthead`, `z_nav`, `z_footer`, `z_bg_band` |
| `btn_` | Button / navigation action | `btn_to_detail`, `btn_back`, `btn_filters` |
| `img_` | Image / icon placed as a standalone visual | `img_channel_mark` |

Rules:

- Lowercase, underscores inside the name, prefix always present.
- The qualifier names the *content*, not the chart type (`ch_top_products`,
  not `ch_bar1`) — chart types change, questions don't.
- Never rename an existing visual when editing it; bookmarks, filters, and
  diffs depend on stable IDs.
- Bookmarks: `bm_<page>_<state>` (e.g. `bm_p1_filters-open`) — the pair of
  states a toggle switches between must both be named.

## Semantic model

- Tables: singular business names (`Sale`, `Customer`, `Date`) or the
  project's agreed plural convention — pick one at stage 3 and record it.
- Measure table: `_Measures` (leading underscore sorts it to the top).
- Measures: business names as displayed (`Net Revenue`, `Orders YoY %`) —
  no `msr_` prefixes; the measure table is the namespace.
- Display folders: numbered taxonomy (`01 Core`, `02 Time intelligence`, …)
  per the `tmdl-patterns` skill.
- Columns used only by relationships/sort: suffix `Key` / `Sort`.

## Deliverables

Stage artifacts keep their numbered names (`00-intake.md` …
`07-delivery.md`); the design quartet is always `design-handoff.md`,
`data-model.md`, `measures.dax`, `theme.json`; the build log is
`BUILD_LOG.md`.
