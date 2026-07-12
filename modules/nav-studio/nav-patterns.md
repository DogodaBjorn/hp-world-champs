# Navigation pattern catalog

Each pattern: what it is, the UX problem it solves, the build recipe, and its
pitfalls. Ordered lightest-first — pick the first pattern that solves the
problem. Research-first applies throughout: the button slicer is a young
visual whose type name and formatting properties evolve; verify in current
Desktop / the visual's schema before authoring PBIR, and expect some
formatting to be Desktop-manual (BUILD_LOG it).

## A. Button-slicer family (in-page selection)

### A1. Segmented control

- **Solves:** choosing one of 2–5 options (period, unit, scenario) without a
  dropdown's extra click.
- **Build:** button slicer, single row; container fill = surface token,
  radius per design brief, tight uniform spacing; selected state = accent
  fill with AA-contrast text; unselected = surface + ink-secondary.
- **Pitfalls:** styling applies visual-wide, not per button — designs
  needing per-button treatment belong in A5/A6. Beyond ~5 options a
  segmented control becomes a ruler; use a dropdown or tabs.

### A2. Tabs

- **Solves:** switching between views/metrics while signaling "you are
  here" — the pattern readers know from every browser.
- **Build:** button slicer with the **accent bar** enabled (top or bottom),
  accent = theme accent token; transparent/canvas background so only the
  bar and label carry the state; generous horizontal padding.
- **Pitfalls:** tabs promise *different content* — don't use them for
  filters that merely re-shade the same visual (that's A1). Bind to a field
  parameter when tabs switch measures.

### A3. Toggle

- **Solves:** a binary state (actual/budget, absolute/%, include/exclude)
  with one glance, one click.
- **Build:** button slicer on a two-value field; per-state images (a
  switch/pill drawn in the two states) from icon-studio — default and
  selected variants per item.
- **Pitfalls:** the two states must be labeled (the image alone is not
  accessible); defaults documented in the handoff. Image upload per item is
  typically a Desktop-manual step.

### A4. Selection icons (native)

- **Solves:** instant recognition of the active option, zero custom assets.
- **Build:** enable the button slicer's built-in selection indicator; align
  it consistently; keep it in every slicer of the same family.
- **Pitfalls:** none worth naming — this is the free polish; the mistake is
  forgetting it on some slicers and not others.

### A5. Clickable KPI cards

- **Solves:** "click the number you want to explore" — the KPI band *is*
  the navigation; the page reconfigures around the chosen metric.
- **Build:** field parameter (or disconnected table + supporting measures)
  holding the KPI list; button slicer bound to it; per-item **SVG
  backgrounds** (icon-studio) rendering each card's framing in default and
  selected states; downstream visuals respond to the parameter selection.
  Card values themselves stay live measures where the layout allows —
  numbers baked into SVGs go stale in screenshots and lose formatting.
- **Pitfalls:** the heaviest selection pattern — every KPI needs two SVG
  states and the parameter wiring; reserve it for the overview page where
  it earns its keep. Selected state must survive the squint test.

### A6. Image items

- **Solves:** categories with strong visual identities (brands, channels,
  countries) scan faster as pictograms than as words.
- **Build:** button slicer with per-item images (default + selected
  variants, consistent geometry, from icon-studio); label text stays on or
  beside the image.
- **Pitfalls:** images without labels fail accessibility and new readers;
  inconsistent pictogram styles read as clutter — one geometry system, per
  the icon guide.

## B. Cross-page navigation

### B1. Nav bar (sidebar or topbar)

- **Solves:** moving between pages without hunting browser-style page tabs.
- **Build:** part of the `z_nav` chrome, identical every page: page
  navigator visual (auto-syncs with pages, styles per theme) or individual
  `btn_` buttons for full control (icons via icon-studio + labels);
  current page indicated (accent bar or fill).
- **Pitfalls:** hidden pages (tooltip/drill-through, `tt-`/`dt-` prefixed)
  must be excluded; buttons hand-built means every new page is a manual
  nav update — note it in BUILD_LOG.

### B2. Back button & breadcrumb

- **Solves:** drill-through dead ends — the reader who arrived with context
  must get back with one click and know where they are.
- **Build:** every `dt-` page gets a back button (top-left, chrome-styled);
  a breadcrumb text (title measure stating the carried filter, e.g.
  "Detail — North region, Q2") anchors orientation.
- **Pitfalls:** a drill-through page without a visible filter statement
  fails 3-minute trust — the breadcrumb measure is not optional.

## C. Bookmark-driven panels (rationed)

### C1. Slide-out filter panel

- **Solves:** many secondary filters that would clutter the canvas but must
  stay reachable.
- **Build:** a panel group (surface rectangle + slicers + close button)
  toggled by two bookmarks (`bm_<page>_filters-open` / `-closed`); opener
  is a chrome `btn_` with the filter icon; bookmarks scoped to selected
  visuals only, data: off / display: on (verify current bookmark options).
- **Pitfalls:** primary filters (the ones the page's question needs) stay
  on canvas — the panel is for the long tail. Bookmark wiring is fragile
  under page edits; re-verify after visual changes and BUILD_LOG the check.

### C2. View swap (chart ↔ table)

- **Solves:** "can I see the numbers behind this?" without a second page.
- **Build:** two overlapping visuals + two bookmarks toggling visibility,
  driven by a small segmented control (A1) or two `btn_` buttons; state
  labeled ("Chart | Table").
- **Pitfalls:** counts against the one-motion-per-page budget; if the table
  matters often, consider a Detail page instead.

## D. Field-parameter switching

- **Solves:** one chart, many metrics/dimensions — collapses near-duplicate
  visuals (dataviz-polish move 9). The engine behind A2/A5.
- **Build:** field parameter table with display names ordered as the design
  intends; bound slicer styled per A1/A2; axis/legend titles that follow
  the selection.
- **Pitfalls:** parameter display names are UI copy — business language,
  not column names; number formats must survive the switch (format strings
  per measure, checked per option).

## Naming

Slicer-based patterns: `sl_<qualifier>` (e.g. `sl_period_tabs`,
`sl_kpi_cards`). Navigation chrome: `z_nav`, buttons `btn_<target>`
(`btn_back`, `btn_filters`). Bookmarks: `bm_<page>_<state>`. Images placed
as standalone visuals: `img_<qualifier>`.
