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

## 2026-07-14 — G6 reopened: second-build clean-room rebuild

Brief (`CLAUDE_CODE_PROMPT.md`, user-supplied): rebuild from scratch as
`project/pbip/second-build.*`, treating the v1 attempt as untrusted.
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

`second-build.SemanticModel`: 7 tables per the blueprint addendum, 4
single-direction relationships, 11 measures (8 core per data_model.md + 3
T1 tooltip texts). Strict TMDL clean. All expected values re-derived from
the CSVs before build — every data_model.md number confirmed except the
era color counts, **corrected 67/80 → 66/79** (pseudo-color inflation;
TK_GAPS #9), and 2006/08/09 which are genuinely zero-set years (TK_GAPS
#1). Deviation: Minifig Variants uses DISTINCTCOUNT(fig_num), not
data_model.md's COUNTROWS — at fig × set grain COUNTROWS counts
appearances, not variants (22/59 Harry check only passes with
DISTINCTCOUNT).

### v2 report built (2026-07-14) — S1→S2→S3→S4a→S4b→T1 per brief order

`second-build.Report`: 7 pages, 206 visuals, generated by
`project/analysis/gen_v2_report.py` — every rect a measured layout.json
value. `pbir validate --all`: **0 errors** (424 warnings, all intended
classes: offline-schema fallback ×206, pixel-perfect composites →
overlap/too-many/undersized, 6 visual-level fig filters). Zero mojibake;
`·`/`—` verbatim. Deneb: certified AppSource GUID via publicCustomVisuals
(auto-loads); 7 specs in deliverables/deneb-specs (source of truth,
embedded verbatim). Bookmarks bm_light/bm_dark switch S4a↔S4b (S4b
HiddenInViewMode → visible page count stays 5).

Deviations (recorded for fidelity review):
- Georgia substitutes Crimson Pro everywhere (user decision; README's own
  documented fallback).
- Font sizes: px→pt rounding ≤0.4pt.
- Letter-spacing/uppercase tracking on eyebrows: PBIR textboxes have no
  letter-spacing property — uppercase text kept, tracking dropped.
- KPI values are bound `card` visuals; the old card centers text, so each
  card rect is sized to its rendered value width (measured) to sit at the
  prototype's left edge. S4a hero "55" same trick (±5px).
- 2006/08/09 hero columns render as zero slivers, not "[TK]" hatch — they
  are verified zero-set years (TK_GAPS #1); S1 footer copy updated.
- Era color counts corrected 67/80 → 66/79 in copy + live measures
  (TK_GAPS #9, user attention requested).
- S5 quiz visual slot spans the full content band (x33..1247): score,
  reveal and reset live INSIDE the custom visual — PBIR buttons cannot
  drive a custom visual's state. Prototype's dev-note legend card dropped
  (its own note sanctions this).
- S2/S3 minifig faces + S3 Hermione pair are pivotTable ImageUrl strips
  (T1 tooltip hosts); image cell height needs a Desktop nudge (D-steps).
- S4b hero "97.9%", duo chart, and gray composition are static verified
  values (Star Wars data is outside the HP-scoped v2 model; sourced from
  the v1 evidence manifest, quoted in the handoff spec).

### v2 quiz visual + ax-audit (2026-07-14)

`sorting-quiz-v2` packaged lint-clean (GUID sortingQuizV2D76FC5E4…,
2.0.0.0); chain interaction, waves, built-in score/reveal/reset, keyboard +
ARIA. Contrast audit: 13 pairs measured, 11 PASS. Two review findings, both
spec-contractual hexes (pixel-perfect brief says never approximate) —
**user acceptance requested**:

- **F-v2-1 (major):** gold `#8A6A21` eyebrow text on page bg `#F5EFE3` =
  4.40:1 (needs 4.5 at 10pt bold; the same gold on card bg passes 4.79).
  Affected: S1/S2/S3/S4a eyebrows, S1 "KEY TAKEAWAY". Fix would be a
  slightly darker gold (e.g. #7A5D1D) — a one-token generator change.
- **F-v2-2 (minor):** gold-bright `#C9A227` quiz focus ring / locked lines
  on `#FCF9F1` = 2.30:1 (non-text needs 3.0). Mitigation already in place:
  state is never color-alone (locked = bold + " ✓" + solid vs dashed
  pattern); finding covers the focus indicator specifically.

The "seven silent years" annotation (18pt italic ≈ large text, 3.0 floor)
passes at 4.40. Wrong-flash red `#B33A2B` passes 5.61.


## Contract amendment v2.1 — 2026-07-14 (uplift session)

User rated the first render 3/10 ("buttons/cards unreadable, static, clearly
Power BI"). Decisions (user, via questions): (1) contract amended — readability
+ interactivity outrank pixel-fidelity to the HTML prototype; (2) S2/S3 =
click-driven era explorers PLUS header slicers; (3) S5 quiz -> native
Character Explorer (no private .pbiviz for the jury); (4) custom-visual course
per contest rules review: Deneb explicitly allowed (certified, auto-loads) ->
kept; rules confirmed Key Takeaway + Rebrickable citation requirements.
(5) Naming veto: 'marriage' removed everywhere -> second-build / First Build /
Second Build; story title 'The Boy Who Came Back'.

Implemented in commits: W0 rename; W1 authored-render tool (PBIR->HTML->
Playwright PNG review loop, project/analysis/authored-render/); W2 type floor
11pt + boxes + native buttons + gold recolor #7A5D1D (F-v2-1 resolved);
W3 era explorers (Sets[Set Label] column, 4 explorer measures, bar_sets +
det panel + sl_year/sl_size + crd_palette_pct, DataFilter interaction
overrides so set clicks collapse the Deneb palette); W4 Character Explorer
(Fig Image measure, cast table + stats + era bar + timeline + portrait).
Desktop checklist rewritten (W1-W12 in BUILD_LOG).

## Contract amendment v2.2 — 2026-07-15 (design-system redesign)

User rated the v2.1 render still weak: "placement and sizing still don't
work… a very basic plain 1998 kind of page… too many information on every
sheet… the key takeaway is very small." Directive: research current best
practice online (PBI design + data storytelling + high-end UI/UX), then
rebuild. Scout run logged at `research/log/2026-07-15-dashboard-design-uplift.md`
(sources: Lukas Reese, Draft BI, Numerro, MoonStory, Cole Nussbaumer Knaflic,
DataViz WC judging notes; credits added to CREDITS.md + source-register.yaml).

Design system adopted (v22.py library):
- **Modern card surfaces** — rounded corners (`shape.rectangleRoundedCurve` 14)
  + soft shadow (`shape.shadow` / container `dropShadow`, transparency ~88), no
  hard 1px borders. This is the single biggest lever against the "1998" read.
  Schema verified before authoring (shadow presets, border radius enums).
- **8px grid** — 40px page margin, 20px gutter, 24px padding.
- **One hero per page**; restrained type scale (Georgia display + Segoe UI);
  captions de-emphasised by size + a WCAG-safe tertiary tone.
- **Density cut** — 206 → 158 visuals. S2/S3 dropped from ~45 to ~28 each:
  removed the redundant size-distribution chart and the minifig cast strip
  (that story lives on S5), and cut 5 KPIs → the 3 era-defining ones.

Per page: **S1** Key Takeaway rebuilt as a hero pull-quote (Georgia 21pt
headline + gold accent bar) on a card; masthead de-cluttered (dead decorative
strip + axis-band labels + vertical rule removed); nav → rounded pill buttons;
hero chart carded. **S2/S3** four-card layout (KPI band · explorer · detail ·
signature palette strip); stale `dn_dist` interactions cleaned so only
`bar_sets → dn_palette` remains. **S4a** editorial spread — hero number fixed
(128pt→100pt, no clip), Diagon Alley photo carded, native button, composition
strip carded. **S4b** dark twin — same in dark chrome, 97.9% hero resized,
button/strip overlap fixed. **S5** three clean cards (cast · detail · portrait),
dead quiz frame removed.

Renderer upgraded to draw rounded corners, shadows, container chrome, and
registered-resource images so authored-render is honest about the new depth.

Verification: `pbir validate` **Valid, 0 errors**; TMDL strict 0 errors (bar
the accepted DataFolder deviation); **contrast all pairs ≥4.5:1** — tertiary
tone darkened `#8C8377`→`#706757` (5.30:1 card / 4.87:1 parchment), dark caption
`#8C8272`→`#9A907E` (5.29:1). Transforms: `project/analysis/authored-render/
redesign_s1.py`, `redesign_s23.py`, `redesign_s4.py`, `redesign_s5.py`, `v22.py`.
