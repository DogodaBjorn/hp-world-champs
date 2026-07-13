# Data model — hp-world-champs

The stage-4 model as the design and build need it. Source of truth:
`project/pbip/hp-world-champs.SemanticModel/` (validated) and
`project-state/active/03-model-blueprint.md`.

## Star schema

```
                DimYear (1949–2027, IsHiatusYear)
                   │ 1
                   ▼ *
DimParts ──┐    DimSets ──────────┬──────────┐        DimMinifigures
   │ 1     │       │ 1            │ 1        │              │ 1
   ▼ *     ▼ *     ▼ *            ▼ *        │              ▼ *
  FactPartsInSets ◄── DimColors   FactMinifigsInSets ◄──────┘
   (set,part,color)     1→*        (set, minifig)
   v1, no spares

  QuizQuestions — disconnected island (10 curated rows), by design
  _Measures     — measure home
```

| Table | Kind | Grain (one row means…) | Source |
|---|---|---|---|
| FactPartsInSets | fact | n copies of one part in one color in one set's v1 inventory, spares excluded | `fnCsv` ← `DataFolder` |
| FactMinifigsInSets | fact | n copies of one minifig design in one set's v1 inventory | idem |
| DimSets | dimension | one LEGO set (ALL themes; Era only for HP root) | idem + `ThemesResolved` |
| DimColors | dimension | one Rebrickable color (Hex, IsGrayscale, IsPseudoColor) | idem |
| DimParts | dimension | one part design (category flattened) | idem |
| DimMinifigures | dimension | one minifig design (Character heuristic) | idem |
| DimYear | dimension (marked Time) | one calendar year, contiguous | generated (M) |
| QuizQuestions | disconnected | one curated quiz question | entered data |
| _Measures | measure table | — | — |

## Field map (what the report binds to)

| Report element | Binding | Notes |
|---|---|---|
| `hero_parts_timeline` | `[Parts Shipped]` × `DimYear[Year]` | page filter Root Theme = Harry Potter; show-items-with-no-data ON |
| `kpi_*_by_era`, `kpi_era_band` | `[Sets]`, `[Avg Parts per Set]`, `[Distinct Colors Used]`, `[Grayscale Share %]` × `DimSets[Era]` | Era sorts by hidden EraSort |
| `ch_palette_strip`, `hero_color_composition` | `[Parts Shipped]` × `DimColors[Color Name]`, data-color fx = `DimColors[Hex]` | SIGNED DEVIATION (G5) |
| `tbl_top_sets` | `DimSets[img_url]` (Image URL) + Set Name/year/num_parts | top-N by num_parts |
| `tbl_fig_gallery` | `DimMinifigures[img_url]` + `Character` | fig_num lists in handoff build notes |
| `ch_colorful_rank` | `[Distinct Colors Used]` / `[Grayscale Share %]` × `DimSets[Set Name]` | dark state adds filter num_parts ≥ 1000 |
| `hero_quiz` | QuizQuestions columns (all 8) | disconnected; aggregation stays in DAX |
| `kpi_quiz_questions` | `[Quiz Questions]` | scenario-logic label mandatory |

## Measure taxonomy

- 01 Scale — Sets, Parts Shipped, Avg Parts per Set
- 02 Color — Distinct Colors Used, Grayscale Share %
- 03 Minifigures — Unique Minifigures
- 04 Quiz (scenario logic) — Quiz Questions (+ Quiz Score in fallback mode only)
- 05 Display — insight titles, era color fx (added by `measures.dax` at s6)

## Metrics NOT available — do not fabricate (verbatim from the blueprint)

| Asked for | Why not available | Nearest honest proxy (with caveat) |
|---|---|---|
| Revenue, retail price, units sold, box office | no commercial columns in the Rebrickable schema | Parts Shipped as physical-scale proxy — measures plastic, not money; narrative only |
| Why the hiatus happened | not data; real-world context | narrative text, visually separated from data claims |
| Set retirement dates / availability windows | only release year exists | none |
| Canonical character identity | free-text names; Character is a heuristic split | M-007 heuristic — caveat in contract; quiz hand-curated by fig_num |
| Set-bundle composition | inventory_sets out of scope (G3) | none needed |

## Scenario logic (labeled)

- **Quiz Score / Quiz Questions (M-009)** — game mechanic on disconnected
  tables; labeled "scenario logic" on `kpi_quiz_questions` (page V) and in the
  tooltip layer. Dual mode documented in the contract.

## Freshness & refresh

- Data through: the contest snapshot (CSVs dated 2026-07-12; max set year 2027).
- Refresh cadence: none — one-shot contest dataset; `DataFolder` parameter
  must be set before any refresh (BUILD_LOG D1).
