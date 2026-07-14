# TK_GAPS — outstanding [TK] data in the v2 handoff

Per the v2 brief: every [TK] in the prototypes/specs gets the **real measure
bound anyway**; this file tracks each one and how it resolved. All values
below re-derived 2026-07-14 directly from the Round 2 CSVs with the
v1-verified rules (HP root-theme subtree, v1 inventories, spares excluded,
pseudo-colors excluded). States: `resolved` (live binding or copy filled
with the derived value), `corrected` (prototype number was wrong),
`derived-rule` (value computed by a documented rule, not sourced).

| # | Where | [TK] item | State | Resolution |
|---|---|---|---|---|
| 1 | S1 hero chart | 2006, 2008, 2009 parts totals | **resolved — zero** | LEGO shipped **no HP sets** in 2006, 2008, 2009. Not missing data — genuinely zero. The hatched "[TK]" columns become zero-slivers (same treatment as the silence years); footer note updated to say so. |
| 2 | S4a body copy | Diagon Alley Wizarding Shops part count | resolved | **2,750 parts** (76444-1). |
| 3 | S2/S3 distribution charts | Bin counts (5 bins × both eras) | resolved | Era I: 29 / 19 / 14 / 4 / 1 · Era II: 24 / 32 / 40 / 33 / 13 (live-bound; values verified). |
| 4 | S2 gallery | Set cards 3–4 (era I) | resolved | "Motorized Hogwarts Express · 2004 · 713 parts" (10132-1) and "Hogwarts Castle · 2010 · 1,291 parts" (4842-1). |
| 5 | S3 gallery | Set card 3 (era II) | resolved | "Diagon Alley · 2020 · 5,548 parts" (75978-1). |
| 6 | S2 minifig card | Ron & Dumbledore era-I variant counts | resolved | Ron Weasley **10**, Albus Dumbledore **4**. |
| 7 | S2 gallery | Hogwarts Castle (2001) part count | resolved | **696 parts** (4709-1). |
| 8 | S1 footer | "2006, 2008, 2009 totals [TK]" | resolved | Copy becomes "no sets released 2006 · 2008 · 2009" (see #1). |
| 9 | S1 KPI, S2/S3 palette titles, data_model.md | Era color counts "67 → 80" | **corrected → 66 / 79** | The prototype's 67/80 includes the pseudo-color `[No Color/Any Color]` (id 9999) — a bookkeeping row, not a brick color. The prototype's own Diagon Alley "55 colors" already uses the excluded rule, so exclusion is the intended definition (and the v1 G2-signed one). Measures and copy both say 66 / 79. **User attention requested** — overriding back to 67/80 is a one-line change. |
| 10 | Minifigs[skin], T1 tooltip | yellow/flesh skin classification | derived-rule | Rebrickable has no skin column. Rule: year ≤ 2003 = "yellow", else "flesh" (LEGO moved licensed lines to flesh tones in 2004). Documented in Minifigs.tmdl docstring. |

Character facts cross-checked while deriving: Harry 22 old / 59 new ✓ ·
Hermione 9 / 33 ✓ · 576 total minifigures ✓ · grayscale 51% / 41% ✓ ·
largest sets 2,029 / 6,020 ✓ · avg parts 267 / 731 ✓ · sets 67 / 142 ✓.
