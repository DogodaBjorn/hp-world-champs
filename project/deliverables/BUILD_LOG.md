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

## 2026-07-13 — stage 6, report + custom visual

- **PBIR report generated** from the design handoff by
  `project/analysis/gen_report.py`: 6 pages (5 + hidden tooltip), 80 visuals,
  2 bookmarks (`bm_p4_light`/`bm_p4_dark`), hp-bricks theme registered
  (customTheme name WITH `.json` + RegisteredResources — the known gotcha).
  `pbir validate --all`: **Valid, 0 errors** (129 warnings, all intended:
  13 hidden dark-state visuals, 12 visual-level filters, P4 visual count,
  small chrome textboxes, offline-schema notices).
- **Conditional formatting** applied via `pbir visuals cf` (7 bindings:
  Color Era on the P1 hero; Color Hex on both palette strips + both P4
  heroes; Color Set Highlight on both rank charts). ⚠ If `gen_report.py` is
  ever re-run, re-apply these seven cf commands (recorded in git history of
  this commit) — the generator does not emit them.
- **hpSortingQuiz packaged**: `project/custom-visuals/hp-sorting-quiz/dist/
  hpSortingQuizC5E71AA64D2B441BB9BD1B65FFFA17A6.1.0.0.0.pbiviz` —
  pbiviz 7.1.1 (npx/local devDependency, no global install), API 5.11.0
  (pbiviz.json apiVersion 5.3.0 scaffold default), lint clean, WebAccess
  privilege for cdn.rebrickable.com. Import/bind/a11y details in the
  visual's README. Fallback path NOT needed (packaged 3 days before the
  2026-07-16 decision point).
- **Build deviations from the handoff** (fidelity review, 06-build.md):
  P4 chrome is duplicated into dark twins (`z_*_dark`) instead of shared —
  literal color swaps are impossible in one textbox across states; the
  fidelity requirement (attribution visible in both states) is met. Era KPI
  cards are slim matrices (multiRowCard rejects a Category role). Footer
  carries attribution only (page-role text dropped). "Show items with no
  data" could not be encoded schema-safely → Desktop step D6.

## 2026-07-14 — accepted validator finding: DataFolder current value

Desktop serializes the parameter's CURRENT VALUE into `expressions.tmdl` on
save — since the user set `DataFolder` to the real CSV folder (D1),
`validate_tmdl --strict` now reports one machine-path error on that line.
**Accepted deviation** (user's own Desktop action; reverting would break
refresh and Desktop would re-write it on every save). The path contains no
client-identifiable content. Port-back to template: the validator should
exempt a parameter expression's current value. All other files stay 0-error.

## 2026-07-13 — D1 finding: Formula.Firewall fix

User's first refresh hit `Formula.Firewall` on several queries: any query
that reads a CSV directly (via `fnCsv`) AND references another query — or
joins two file-reading step chains inside one query (DimParts) — trips the
firewall ("references other queries or steps … rebuild this data
combination"). Fix, applied uniformly: **only `Raw*` staging expressions
touch File.Contents** (RawSets, RawInventoryParts, RawInventoryMinifigs,
RawColors, RawMinifigs, RawParts, RawPartCategories — plus ThemesResolved
and V1Inventories which each read exactly one file); **every loaded table
query is references-only**. This is definitionally firewall-proof, needs no
Desktop privacy setting, and works on any machine. **If Desktop still has
the PBIP open: close WITHOUT saving, reopen, then refresh** (Desktop caches
the old definition in memory and saving would overwrite the fix).

### Manual steps still required in Desktop (running checklist)

| # | Step | Status |
|---|---|---|
| D1 | Set `DataFolder` parameter to the CSV folder on first open; refresh | pending |
| D2 | Confirm DimYear "Mark as date table" took effect (`dataCategory: Time` + isKey encoding) | pending |
| D3 | Confirm ImageUrl data categories render images in table/matrix visuals | pending |
| D4 | Spot-check refreshed numbers vs evidence manifest (67/142 sets; 15,053 parts in 2018; 55 colors 76444-1; SW 71.8% gray; 576 HP figs) | pending |
| D5 | Export single .pbix for submission after s7 sweep | pending |
| D6 | P1 hero: enable "Show items with no data" on the Year axis so the 2012–2017 hiatus renders as empty slots (fixed axis filter 2001–2027 already in PBIR) | pending |
| D7 | `ch_size_distribution` (II & III): group `num_parts` into bins of 250 (grouping UI is Desktop-only) | pending |
| D8 | Assign `tt-definitions` as report-page tooltip to: hero_parts_timeline (I), kpi_era_band (II & III), kpi_theme_grayness (IV) | pending |
| D9 | Import `hpSortingQuiz…pbiviz` from file on page V; replace the hero_quiz placeholder in the same slot; bind all 7 QuizQuestions roles; verify CDN images render (visual README has the exact steps) | pending |
| D10 | Verify bookmark flip: btn_dark_side/btn_light_side swap states incl. dark chrome; tab order sensible in both states | pending |
| D11 | Sort `tbl_fig_gallery` rows by fig_num and hide the Unique Minifigures value column if Desktop shows it (binding requires one measure) | pending |
