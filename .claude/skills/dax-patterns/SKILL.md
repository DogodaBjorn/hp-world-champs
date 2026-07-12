---
name: dax-patterns
description: DAX conventions for pbi-atelier - measure layering, time intelligence on the marked Date table, display measures, format discipline, and when to consult SQLBI-tier sources. Use when writing or reviewing measures.
---

# dax-patterns

Conventions over cleverness. When a pattern gets nontrivial (semi-additive,
currency, events-in-progress), consult the Tier-2 sources
(`contracts/source-register.yaml` — SQLBI/DAX Patterns) rather than
improvising; cite what you followed in the stage file.

## Layering

1. **Base:** one measure per metric contract, referencing columns
   (`Net Revenue = SUM(Sales[Amount])` style). The contract's
   `implementation` block records name/folder/format.
2. **Time intelligence:** built *on base measures*, using the marked Date
   table only (`DATEADD`, `DATESYTD`…). Choose PY vs prior-equivalent-period
   deliberately per metric contract — they answer different questions;
   record the choice.
3. **Display:** insight titles, semantic-color tokens, narrative strings
   (folder `03 Display`). These serve the design and live in `measures.dax`
   at stage 5 before being implemented at stage 6.

## Discipline

- **Variables for readability and single evaluation:** `VAR` per logical
  step, `RETURN` one expression.
- **No magic numbers:** thresholds/targets are either sourced (a target
  table) or SCENARIO CHOICES marked in the docstring and in `data-model.md`.
- **Divide safely:** `DIVIDE(n, d)` — and decide what blank means for the
  metric (contract's edge cases).
- **Filter honestly:** prefer `CALCULATE` with explicit filters over
  implicit context tricks a reviewer can't see. `ALLSELECTED` only with a
  comment explaining whose selection it respects.
- **Format everything:** explicit `formatString`; percentages as
  percentages, not pre-multiplied numbers.
- **Totals are a test:** check every measure at total level — does the
  aggregate mean something, or should the total be blanked?

## Naming

Business names as displayed (`Orders YoY %`), suffix conventions:
`<M> PY`, `<M> Δ`, `<M> YoY %`, `Title <Visual>`, `Color <Measure>`.
Same names in measures.dax, TMDL, and the design handoff — byte-identical.
