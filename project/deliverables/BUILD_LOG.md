# BUILD_LOG — hp-world-champs

Contest: Power BI Dataviz World Champs Barcelona · Round 2 · deadline
2026-07-19 23:59 PT (content-complete target 2026-07-17).
Maintained continuously during stages 4 and 6 (never retroactively).

## Standing assumptions & risk notes

- **Page count:** hidden report-page tooltips are assumed NOT to count toward
  the contest's 5-page maximum (mission §1.2). Tooltip pages kept minimal.
- **Images are CDN-hosted** (cdn.rebrickable.com via img_url data columns) —
  judges need connectivity for images; noted for the gallery post too.
- **Custom-visual fallback decision point: 2026-07-16.** If the pbiviz
  toolchain or timeline fails, degrade to the pre-approved native pattern
  (disconnected slicers + DAX validation + bookmarks) without reopening G5.
- **pbir CLI 0.9.25** installed (non-commercial license; contest entry is
  compatible use). Invoke via the Python Scripts dir (not on Git Bash PATH).

## 2026-07-13 — stage 4, semantic model

- Authored `hp-world-champs.SemanticModel` (TMDL): 9 tables, 6 single-direction
  relationships, 7 measures, 4 shared expressions. `validate_tmdl.py --strict`
  clean. Details & deviations: `project-state/active/04-model-build.md`.
- Evidence pack E1–E10 re-derived from the CSVs before modeling
  (`project-state/active/evidence-manifest.md`); all confirmed, deltas
  explained by the G2-signed pseudo-color exclusion.
- Starter model consulted read-only: its 3 bidirectional relationships,
  hardcoded `C:\Users\...` paths, `Encoding=1252`, and `QuoteStyle.None`
  (mis-splits quoted set names) were all deliberately not inherited — our
  queries use UTF-8 (65001) + `QuoteStyle.Csv` via the `fnCsv` helper.

### Manual steps still required in Desktop (running checklist)

| # | Step | Status |
|---|---|---|
| D1 | Set `DataFolder` parameter to the CSV folder on first open; refresh | pending |
| D2 | Confirm DimYear "Mark as date table" took effect (`dataCategory: Time` + isKey encoding) | pending |
| D3 | Confirm ImageUrl data categories render images in table/matrix visuals | pending |
| D4 | Spot-check refreshed numbers vs evidence manifest (67/142 sets; 15,053 parts in 2018; 55 colors 76444-1; SW 71.8% gray; 576 HP figs) | pending |
| D5 | Export single .pbix for submission after s7 sweep | pending |
