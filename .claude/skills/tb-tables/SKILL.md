---
name: tb-tables
description: Design and build premium tables and matrices (table-studio module) - typography/alignment doctrine, variance columns, in-cell micro-viz, layered headers, density presets, works-with-the-user checklist. Use for any table or matrix work in a report.
---

# tb-tables

**Module gate:** requires `table-studio` in `project/project.yaml` →
`modules`. If disabled, say so and stop.

## Procedure

1. **Confirm the table is the right form** (`design/visual-selection.md`):
   detail-lookup or ranking intent from the page-purpose contract. A shape
   question gets a chart recommendation instead.
2. **Architect the columns** per `modules/table-studio/table-patterns.md`
   §2: identity → context → actual → comparison → variance → trend; pick Δ
   or Δ% by what the audience decides with; headers in metric-contract
   language with units.
3. **Choose the encodings:** micro-viz by the preference order (native data
   bars → native sparklines → SVG-in-DAX via icon-studio, with the plain
   value always present); heat encodings only as a deliberate heatmap with
   ramp + legend + contrast check.
4. **Set the typography:** alignment rules, decimal discipline via
   formatString, density preset (executive/working/operational — one per
   table), hairlines-only gridlines, no zebra by default.
5. **At stage 5:** write it into the design handoff — column spec table,
   density preset, default sort, expand state (matrix), micro-viz per
   column, drill-through target.
6. **At stage 6:** pbir-operator builds per spec; research-first on cell
   elements/sparkline property names; what can't be authored headlessly
   goes on the BUILD_LOG manual list.
7. **Review with the works-with-the-user checklist** (patterns file §end);
   failures become review findings, not shrugs.

## Done when

Every table has a contracted intent, an explicit column architecture,
deliberate defaults (sort/expand/density), rationed color, and passes the
works-with-the-user checklist at the report's real canvas size.
