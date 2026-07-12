---
name: nv-navigation
description: Design and build modern navigation and selection UI (nav-studio module) - segmented controls, tabs, toggles, clickable KPI cards, nav bars, back buttons, slide-out panels, field-parameter switching. Use when a report needs navigation, filtering UI, or view switching.
---

# nv-navigation

**Module gate:** requires `nav-studio` in `project/project.yaml` →
`modules`. If disabled, say so and stop.

## Procedure

1. **Start from the interaction need, not the pattern.** Read the page's
   `page-purpose.contract.yaml` (question, interactions, leaves-out) — a
   navigation element that serves no contracted interaction is clutter with
   a click.
2. Pick the **lightest pattern that solves it** from
   `modules/nav-studio/nav-patterns.md` (catalog order is the preference
   order: native formatting → images → bookmarks). Check the doctrine in
   the module README: visible selected state, chrome consistency, never
   hide the answer, one motion pattern per page.
3. **At stage 5 (specifying):** write the pattern into the design handoff —
   pattern id (A1–D), bound field/parameter, states and default selection,
   visual ids per naming conventions (`sl_`/`btn_`/`z_nav`/`bm_`), required
   icon assets (delegate to `ic-icons` when icon-studio is enabled;
   otherwise list them as user-supplied).
4. **At stage 6 (building):** pbir-operator implements per spec —
   research-first on the button slicer's current visual type and formatting
   properties; explicit properties per `pbir-style`; bookmark states named
   `bm_<page>_<state>`. Formatting the format can't reach headlessly
   (per-item image uploads, some bookmark options) goes on the BUILD_LOG
   manual-steps list with a verify-by note.
5. **Verify the UX, not just the JSON:** selected state visible at squint
   distance; defaults render the contracted 3-second message before any
   interaction; back path exists from every drill-through; the same
   interaction lives in the same place on every page.

## Done when

Every navigation element traces to a contracted interaction, uses the
lightest sufficient pattern, has its states/defaults documented in the
handoff, and its manual steps (if any) are on the BUILD_LOG list.
