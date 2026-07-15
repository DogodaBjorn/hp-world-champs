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

## 2026-07-14 — v2 clean-room rebuild: second-build (pixel-perfect)

User supplied `design_handoff_powerbi/` (HTML hi-fi prototypes + per-page
specs + theme + tools) and the CLAUDE_CODE_PROMPT brief: rebuild from
scratch, prototype is the single source of truth, positions measured never
eyeballed. v1 (hp-world-champs.*) is FROZEN as reference — do not open,
patch, or refresh it; the submission candidate is now
`project/pbip/second-build.pbip`.

- **Measured truth:** tools/*.mjs shipped as one-line comments (silent
  no-op) — fixed; Playwright (local dev-dep) produced `layout.json` +
  7 reference screenshots @2x. All 7 screens exactly 1280×720 / 320×240.
- **Model:** 7 tables per data_model.md (HP-scoped star, firewall-proof
  staging M reused from v1), 14 measures. Every spec value re-derived from
  the CSVs first: all confirmed except era colors **corrected 67/80 →
  66/79** (prototype counted pseudo-color `[No Color/Any Color]`; its own
  "55 colors" for Diagon Alley uses the excluded rule) and 2006/08/09 =
  genuinely **zero-set years**, not missing data. Full ledger: TK_GAPS.md.
- **Report:** 7 pages, 206 visuals, `pbir validate --all` **0 errors**
  (424 warnings, all intended classes; textbox-height floor warnings are
  chrome micro-labels — see V9). Deneb (certified, AppSource) renders all
  brick charts/palette strips/composition bars incl. mortar courses + stud
  caps; specs in `project/deliverables/deneb-specs/` are the source of
  truth. Georgia substitutes Crimson Pro (user decision; the README's own
  documented fallback — flagged). Deviations list: 06-build.md.
- **Quiz:** `sorting-quiz-v2` packaged lint-clean; spans the full S5
  content band (score/reveal/reset are inside the visual — PBIR buttons
  cannot drive custom-visual state). Import steps: its README.
- **Contrast:** F-v2-1 RESOLVED 2026-07-14 — gold text recolored
  `#8A6A21` → `#7A5D1D` repo-wide in the W2 uplift (passes 4.5:1 on
  parchment). F-v2-2 (quiz focus ring) is moot: the quiz custom visual was
  replaced by the native Character Explorer (user decision, jury-safety).

### 2026-07-14 uplift (contract amendment v2.1 — readability + interactivity)

User rated the first render 3/10; contract amended: readability and
interactivity outrank pixel-fidelity to the prototype. Applied agent-side
(commits W0–W4): rename to `second-build` (era values → First/Second Build),
type floor 11pt with grown boxes, native single-visual nav buttons with hover
states, S1 title/KPI fixes, S2/S3 era explorers (clickable set bars + detail
panel + year/size slicers + dynamic palette share; bar clicks cross-FILTER
the Deneb charts), S5 native Character Explorer (quiz .pbiviz dropped —
jury machines need zero custom-visual installs beyond certified Deneb).
Authored-state renders: `project/deliverables/authored-render/*.png`.

### Manual steps in Desktop (w-checklist — replaces V1–V12)

| # | Step | Status |
|---|---|---|
| W1 | Open `second-build.pbip`; set `DataFolder` to the CSV folder; refresh (M is firewall-proof; no privacy prompts expected) | pending |
| W2 | Spot-check: 67/142 sets · 267/731 avg · 2,029/6,020 largest · 66/79 colors · 51%/41% gray · Diagon Alley 55 colors & 2,750 parts · 576 figs · bins 29/19/14/4/1 and 24/32/40/33/13 | pending |
| W3 | Deneb: visuals auto-fetch from AppSource via publicCustomVisuals on first open (needs sign-in). If placeholders show: import Deneb from AppSource once — same GUID, visuals rebind. (Contest rules explicitly allow Deneb; cited in footer) | pending |
| W4 | Image sizing (Format → Image size → fill the cell): fig strips S2 ×4 / S3 ×2 / T1 ×1 (~96px), NEW set photo `det_img` on S2+S3 (~120px), NEW cast list `tbl_cast` (~48px rows) + big portrait `img_char` (~380px) on S5; hide stray value columns where Desktop shows them | pending |
| W5 | Explorer spot-check S2/S3: click a bar → KPIs, palette, distribution and detail panel all follow; click again releases; year slider (Between) + size chips filter; multi-select via Ctrl | pending |
| W6 | Cast spot-check S5: click a character → headline, variants, first/latest, era bar, timeline and portrait follow | pending |
| W7 | Assign T1 as report-page tooltip to the fig matrices (Format → Properties → Tooltips) | pending |
| W8 | Verify bookmark flip S4a ↔ S4b (buttons on both pages; S4b hidden so tabs still show 5 pages) | pending |
| W9 | Confirm "Mark as date table" took effect on DimYear; slicer defaults show full era ranges | pending |
| W10 | Visual sweep at 100% zoom: any clipped label → nudge height (the 11pt floor + grown boxes should have removed these; report leftovers) | pending |
| W11 | Capture per-page PNGs at 100% zoom → `project/deliverables/diff-report/rendered/` → agent assembles the review (amended contract: judged on readability/interaction, not ±2px) | pending |
| W12 | Export .pbix for submission (deadline 2026-07-19 23:59 PT) | pending |
