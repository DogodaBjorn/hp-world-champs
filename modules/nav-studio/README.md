# nav-studio

Navigation and selection UI that feels like a modern product, built from
native Power BI parts — the button slicer, buttons, page navigation, field
parameters, and (sparingly) bookmarks. The catalog lives in
[nav-patterns.md](nav-patterns.md).

Inspiration and further reading: the bibb.pro article
[*Power BI Button Slicer: Modern UI Patterns for Better Dashboards*](https://bibb.pro/post/power-bi-button-slicer-modern-ui-patterns-for-better-dashboards/)
(consulted as a reference; patterns re-derived here in this repo's own terms).

## UX doctrine

1. **Selected state is always visible.** A reader must see at a glance what
   is selected and what the alternatives are — no mystery-meat filters.
2. **Navigation is chrome.** Cross-page navigation lives in the shared
   `z_nav` chrome, identical in position and behavior on every page. A
   reader who learns page 1 has learned the report.
3. **Never hide the answer behind a click.** Interaction reveals *more*
   depth (dataviz-polish rule); the page's 3-second message renders before
   anyone touches anything. Default states are deliberate and documented.
4. **The lightest pattern wins.** Catalog order is deliberate: pure native
   formatting before image-based patterns before bookmark machinery. Every
   step up buys capability and costs maintenance.
5. **Motion is rationed.** At most one bookmark-driven state change per page
   (dataviz-polish move 10), and its states are named and documented.

## Position in the lifecycle

- **Stage 5:** the report-designer picks patterns per page-purpose contract
  and specs them in the design handoff (pattern name, states, defaults,
  visual ids, required icon assets).
- **Stage 6:** pbir-operator builds per spec; anything the format can't do
  headlessly (image uploads per item, bookmark wiring quirks) goes on the
  BUILD_LOG manual-steps list.
- **Pairs with icon-studio** for toggle/image patterns and selection
  pictograms; with field parameters (`dataviz-polish` move 9) for metric
  switching.
