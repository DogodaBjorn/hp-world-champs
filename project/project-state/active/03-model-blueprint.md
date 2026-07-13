# 03 · Model blueprint — hp-world-champs

**Date:** 2026-07-13 · **Contract:** [model-blueprint.contract.yaml](model-blueprint.contract.yaml)
Designed on paper only (model-auditor is read-only); built at stage 4 by pbir-operator.

## Schema

```
                DimYear (1949–2027, contiguous, IsHiatusYear)
                   │ 1
                   ▼ *
DimParts ──┐    DimSets ──────────┬──────────┐        DimMinifigures
   │ 1     │       │ 1            │ 1        │              │ 1
   ▼ *     ▼ *     ▼ *            ▼ *        │              ▼ *
  FactPartsInSets ◄── DimColors   FactMinifigsInSets ◄──────┘
  (set,part,color)      1→*        (set, minifig)
  v1, no spares

  QuizQuestions (10 rows)  — disconnected island, no relationships, by design
  _Measures                — measure home, numbered folders 01–05
```

All relationships many-to-one, **single direction**, dimensions filter facts.
Zero bidirectional (any dim-through-fact count uses `CROSSFILTER` inside a
measure). One justified outrigger: `DimYear → DimSets` — written justification
in the contract (M-001 must count sets without inventories; hiatus years must
exist on the axis).

## Grains (declared before columns — the rule)

- **FactPartsInSets** — one row: *n copies of one part in one color in the v1
  inventory of one set, spares excluded*. The v1/no-spare filters live in the
  **query**, not in DAX (kills the starter's `Parts` measure filter). Grouped
  on (set, part, color) because raw inventory_parts rows split by `is_spare`
  and could repeat a (part,color) pair within one inventory.
- **FactMinifigsInSets** — one row: *n copies of one minifig design in the v1
  inventory of one set*.

## Starter-model audit (read-only, `tmdl_inventory.py`, 2026-07-13)

9 tables, 9 measures (flat, no folders), 7 relationships of which
**3 bidirectional — mission §5 claim verified exactly**. Structure snowflakes
facts through an `inventories` hub table; queries hardcode the author's local
paths. Decisions inherited from that audit: nothing is reused; `inventories`
disappears as a model table (its v1 filter moves into both fact queries);
`Versions`/`Parts all` starter measures have no contracted intent and are not
rebuilt.

## The scope decision surfaced at this gate

Strict recursive flattening of `themes.parent_id` gives every set a **Root
Theme** = topmost ancestor. Under that rule, three "Harry Potter"-named themes
do **not** land under root `246 Harry Potter`:

| Theme | Sits under | Root becomes |
|---|---|---|
| 710 Harry Potter (advent calendars) | 207 Advent | Seasonal branch, not HP |
| 656 HP & Fantastic Beasts Series 1 | 535 Collectible Minifigures | CMF |
| 691 HP & Fantastic Beasts Series 2 | 535 Collectible Minifigures | CMF |

The mission's evidence pack was derived with "root theme = Harry Potter", i.e.
the strict rule — so **HP scope = subtree of root 246**, and the advent/CMF
look-alikes stay outside. This preserves E1–E10 comparability and is the
defensible general-audience definition ("the Harry Potter product line").
Stage 4 records how many sets/figs the exclusion leaves out; if re-derivation
suggests the prior analysis actually included them, that contradiction comes
back to this gate rather than being absorbed silently.

## Metric map & not-available list

All nine metrics map (contract `metric_map`); the do-not-fabricate list names
revenue/price/box-office, hiatus causality, retirement dates, canonical
character identity, and bundle composition — none support data claims; two get
clearly-caveated narrative or heuristic proxies.

## Parameterization

Single `DataFolder` text parameter → `e:/PowerBI Set-up/World Champs Round 2 Data`
as *default value*, every query reads `DataFolder & "file.csv"`. No absolute
path appears outside the parameter's current value (tmdl-style rule).

## Open questions

- Date-table marking for a year-grain table (`isDateTable` semantics for a
  hidden `Year Start Date` column): verify against TMDL schema at stage 4 —
  research-first; if unsupported cleanly, record deviation (no date-keyed
  facts exist in this dataset).
- Whether any HP set lacks a v1 inventory (affects M-002 blanks) — count at
  stage 4, evidence manifest.

## Gate G3

Contract boxes: every metric mapped ✓ · grains declared first ✓ ·
**Accepted 2026-07-13** by the requester (in-session, explicit): strict scope
chosen (HP = root-246 subtree); not-available list accepted without surprises.
