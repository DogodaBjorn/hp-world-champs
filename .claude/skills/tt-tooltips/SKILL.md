---
name: tt-tooltips
description: Design and build the hover layer (tooltip-studio module) - report-page tooltips: mini-trend, definition/trust from metric contracts, mini-breakdown; per-visual mapping and wiring handoff. Use when adding tooltips, hover details, or on-hover definitions.
---

# tt-tooltips

**Module gate:** requires `tooltip-studio` in `project/project.yaml` →
`modules`. If disabled, say so and stop.

## Procedure

1. **Doctrine check** (`modules/tooltip-studio/README.md`): tooltips deepen,
   never carry — anything gate-relevant belongs on the canvas or the
   Definitions page. Reject tooltip ideas that hide the answer.
2. **Map per visual** (stage 5): add the tooltip column to the design
   handoff's visual tables — `default`, `tt-<name>`, or `none`. Recommend
   the trust tooltip (T2) for every KPI card. Design the *fewest* tooltip
   pages that cover the map (reuse by grain).
3. **Design each page** per `modules/tooltip-studio/tooltip-patterns.md`:
   T1 mini-trend / T2 definition-trust / T3 mini-breakdown; tooltip canvas,
   `tt-` naming, theme tokens, one-step-down type scale, grain stated, all
   content visible with longest realistic values.
4. **T2 discipline:** definition text comes verbatim from `02-metrics.md` /
   the metric contracts — never paraphrase the steward. If the project
   language is Dutch and nl-deliverables is enabled, source the wording via
   `nl-definities` so page and tooltip match word-for-word.
5. **Build** (stage 6, via pbir-operator): tooltip pages like any page —
   research-first on the tooltip canvas/allow-use-as-tooltip properties;
   validators run per file.
6. **Wire and log:** per-visual assignment is typically Desktop-manual —
   BUILD_LOG entries: visual id → tooltip page → verify-by (hover renders
   with hovered context). If the current PBIR surface supports headless
   assignment, set it and note the validation evidence instead.

## Done when

The tooltip map covers every visual deliberately (including `none`), each
`tt-` page passes the patterns' constraints (non-interactive, no scroll,
themed, grain-correct), T2 text is contract-verbatim, and the wiring list
is in the BUILD_LOG with verify-by notes.
