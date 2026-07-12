# Design handoff — <project name>

<!-- The design source of truth. Stage 6 builds EXACTLY this; the fidelity
review judges the build against this file. Copy to project/deliverables/
and fill. Keep placeholders in <> until resolved. -->

Direction: **<chosen direction name>** (see creative-direction contract)
Canvas: <1280x720> · Theme: `theme.json` · Brand kit: <kit|neutral defaults>

## Reading me

- Visual ids follow `design/naming-conventions.md` and match `measures.dax`.
- "Polish" entries reference the numbered moves in the `dataviz-polish` skill.
- Anything not specified here defaults to the theme — visual-level overrides
  below are exceptions and each carries its reason.

## Page chrome (identical on every page)

| Element | Id | Spec |
|---|---|---|
| Masthead | `z_masthead` | <height, background token, title + page-question text spec> |
| Navigation | `z_nav` | <placement, states> |
| Footer | `z_footer` | <freshness stamp binding, definitions link> |

---

## Page 1 — `<p1-name>` (<archetype>)

**Question:** <from the page-purpose contract>
**3-second message:** <the sentence>
**Layout:** <grid description: rows/columns in px on the 8px grid>

| Id | Visual | Intent | Data | Polish | Explicit properties |
|---|---|---|---|---|---|
| `kpi_<x>` | KPI card | magnitude | <measure(s)> | 7 (hero + micro) | <title mode, background, border, radius> |
| `hero_<x>` | <type> | <intent> | <fields/measures> | 1, 3, 4 | <axis ranges, reference line, label spec> |
| `sl_<x>` | Slicer | — | <field> | — | <style, default state> |

**Interactions:** <cross-filter behavior, drill-through target, tooltip page>
**Leaves out:** <what was deliberately excluded>

<!-- Repeat the page block per page, Definitions page included. -->

---

## Definitions page — `<p9-definitions>`

Content from the metric contracts (02-metrics.md glossary), period
conventions, freshness, caveats, and the not-available list verbatim.

## Manual steps expected in Desktop

<!-- Anything the design knows cannot be authored headlessly; BUILD_LOG
will confirm or extend this list at stage 6. -->

- <step>

## Fidelity checklist (from the creative-direction contract)

- [ ] <defining element 1>
- [ ] <defining element 2>
- [ ] <defining element 3>
