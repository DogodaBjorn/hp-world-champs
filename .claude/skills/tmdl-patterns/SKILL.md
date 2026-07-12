---
name: tmdl-patterns
description: TMDL authoring patterns for pbi-atelier models - parameterized sources, marked Date dimension with business flags, the _Measures table with docstrings and numbered display folders, queryGroups. Use whenever writing or reviewing TMDL.
---

# tmdl-patterns

House patterns for semantic models. The `tmdl-style` rule states the laws
(tabs, docstrings, no machine paths); this skill shows the shapes. Research
first: verify exact syntax against current TMDL docs before writing —
patterns here describe *what*, the docs define *how*.

## Parameterized sources (mandatory)

All data access flows through shared expressions/parameters (e.g. a
`SourceRoot` or connection parameter in `expressions.tmdl`), so the model
opens on any machine and environment switches are one edit. A literal
`C:\Users\...` anywhere in TMDL is a validator **error**.

## The Date dimension

- Generated (DAX or M), contiguous over the data range plus the horizon the
  requirements need; **marked as date table**.
- Business flags come from stage 1, not from a generic template: fiscal
  periods, working days, campaign/season windows — each flag earns its
  column by a requirement.
- Sort columns for every display column (`MonthName` sorted by `MonthNo`).

## The `_Measures` table

- A measure-only table (leading underscore sorts it first); hide its
  placeholder column.
- Every measure: `///` docstring (business meaning, one line), explicit
  `formatString`, `displayFolder` from a numbered taxonomy agreed at stage 3:

```
01 Core                  -- base aggregations
02 Time intelligence     -- PY/PP, YTD, rolling, deltas
03 Display               -- insight titles, semantic colors (design layer)
04 <domain folders as the project needs>
```

- Layering: base measures reference columns; everything else references
  measures. One calculation, one home — no copy-pasted logic.

## Organization

- `queryGroup` folders separate facts / dimensions / parameters.
- Relationships live in the model/relationships file with explicit
  cardinality and cross-filter direction (single unless justified in the
  blueprint).
- Hide foreign keys and technical columns; what's visible is the interface.

## Verification loop

After each coherent batch: `python scripts/validate_tmdl.py --strict`, then
`python scripts/tmdl_inventory.py project/pbip` and diff against the
blueprint. The hook already validates per-file on every write.
