# 06 · Report build — hp-world-champs

**Date:** 2026-07-13 · **Handoff honored:** `deliverables/design-handoff.md` (D1 Illuminated Storybook)
**Report:** `project/pbip/hp-world-champs.Report/` · **Visual:** `project/custom-visuals/hp-sorting-quiz/`

## What was built

- **6 pages** (I–V + hidden `tt-definitions` tooltip page, type Tooltip /
  HiddenInViewMode), **80 visuals**, all ids per naming conventions, all with
  explicit title-or-recorded-hide, background, border, and alt text.
- **Chrome replicated identically** per page from one generator function
  (masthead numeral + chapter rule + 5 nav buttons + attribution footer) —
  chrome drift is structurally impossible.
- **Dark-side flip (IV):** two bookmarks toggling grouped light/dark stacks;
  dark visuals ship `isHidden` so the page loads in the light state; both
  states use the s5 contrast-verified token sets.
- **7 display measures** added to `_Measures` (titles + 3 color-fx),
  docstrings/folders/format strings, strict-validator clean.
- **Measure-driven conditional formatting** via `pbir visuals cf` on 7
  visuals (the G5-signed true-color path).
- **hpSortingQuiz** scaffolded (pbiviz 7.1.1 via npx — no global tooling),
  implemented (~350 lines TS: match-by-value pairing, SVG connection lines,
  shake/fade feedback, Reveal/Reset, aria-live announcements, full keyboard
  path, forced-colors support, WebAccess privilege for the Rebrickable CDN),
  lint-clean, packaged to `dist/…pbiviz`. Justification gate: handoff page V
  carries the mission §6 justification verbatim. Fallback path unused.

## Verification (this environment)

- `pbir validate --all`: **Valid, 0 errors**; 129 warnings all intended and
  itemized in BUILD_LOG (hidden dark-state visuals, intended visual-level
  filters, P4 state-twin count, chrome textbox sizes, offline schema notices).
- `validate_tmdl.py --strict`: 0 errors / 0 warnings (13 files).
- `validate_json.py`: clean. `check_state.py`: consistent.
- Encoding sweep: zero mojibake sequences in the Report tree (UTF-8 authored
  directly; the cp1252 `--from-json` path was never used).
- Rendered review in Desktop is a user step (this environment has no
  Desktop): BUILD_LOG D1–D11 is the complete list, then the s7 sweep.

## Fidelity review vs the G5 checklist

| Checklist item | Verdict |
|---|---|
| Chapter numerals + attribution footer every page | ✅ (dark state has its own footer twin) |
| Ornament budget (drop cap, chapter rule, margin notes only) | ✅ |
| P1 hiatus visible on contiguous axis | ◐ fixed-axis filter 2001–2027 in PBIR; "show items with no data" is Desktop-only → **D6** |
| II/III exact mirror grids, era chips | ✅ (identical generator function, era parameter only) |
| P4 flip: real button, both states contrast-pass, footer both states | ✅ (keyboard-native actionButtons) |
| Georgia ≥14pt, gold never text <18pt | ✅ (c_rank_note bumped to 14pt during review; quiz h3 raised to 1.3em) |
| Explicit properties + 6-hue cap outside signed visuals | ✅ |

## Deviations (recorded, none reopen G5)

1. **P4 chrome twins** instead of shared chrome: one textbox cannot swap ink
   color across bookmark states; the contract's *requirement* (attribution
   visible in both states, identical geometry) is met. Handoff's "chrome
   shared" note superseded — build-level implementation detail.
2. **Era-split KPI cards are slim matrices** — `multiRowCard` rejects a
   Category role (pbir validate); same KPI-band reading, same slots.
3. **Footer role-text dropped** (attribution only) — attribution is the
   contest-critical content; right-aligned role text added visual noise.
4. **`showAll` not encoded in PBIR** (schema-unverifiable offline) → D6.
5. **Quiz "era+set" column** is a reveal column (unlocks per match) — this IS
   the handoff's three-column layout; noted because the reveal mechanic is
   the game's teaching moment.

## Gate G6

- validate-project green ✅ · handoff rows matched (deviations above,
  user-visible in this file + BUILD_LOG) ✅ · fidelity review done, one item
  Desktop-dependent (D6) ✅ · BUILD_LOG current with D1–D11 ✅

Rendered confirmation of D6–D11 lands in the s7 sweep (user runs Desktop).

## 2026-07-14 — G6 reopened: two-marriages-v2 clean-room rebuild

Brief (`CLAUDE_CODE_PROMPT.md`, user-supplied): rebuild from scratch as
`project/pbip/two-marriages-v2.*`, treating the v1 attempt as untrusted.
Order S1→S2→S3→S4a→S4b→T1→S5; per-page DoD from the
`powerbi-pixel-perfect` skill; [TK]s logged in `TK_GAPS.md`.

### Model blueprint addendum (grains declared before build)

| table | 1 row means | source |
|---|---|---|
| Sets | one HP set (2001–2026) | sets.csv, root-246 subtree (v1-verified filter) |
| Minifigs | one minifig appearance in one set | inventory_minifigs × minifigs, v1 inventories |
| SetColors | one (set × color) with its part count | inventory_parts aggregated to set×color |
| Colors | one LEGO color | colors.csv |
| DimYear | one year 2001–2026, marked date table | generated |
| QuizPool | one curated quiz round (10 rows) | curated fig_nums from v1 evidence |

Metric formulas follow `design_handoff_powerbi/data_model.md` (set-catalog
grain: Parts per Year = SUM(Sets[num_parts]) — deliberately NOT the v1
inventory-based Parts Shipped; the two disagree, e.g. 2018: 15,234 vs
15,053, and the handoff wins for v2). M layer reuses the v1 firewall-proof
staging architecture (Raw* expressions only touch File.Contents; loaded
tables are references-only).

### v2 model built (2026-07-14)

`two-marriages-v2.SemanticModel`: 7 tables per the blueprint addendum, 4
single-direction relationships, 11 measures (8 core per data_model.md + 3
T1 tooltip texts). Strict TMDL clean. All expected values re-derived from
the CSVs before build — every data_model.md number confirmed except the
era color counts, **corrected 67/80 → 66/79** (pseudo-color inflation;
TK_GAPS #9), and 2006/08/09 which are genuinely zero-set years (TK_GAPS
#1). Deviation: Minifig Variants uses DISTINCTCOUNT(fig_num), not
data_model.md's COUNTROWS — at fig × set grain COUNTROWS counts
appearances, not variants (22/59 Harry check only passes with
DISTINCTCOUNT).
