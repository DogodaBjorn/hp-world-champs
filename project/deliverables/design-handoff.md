# Design handoff — hp-world-champs

Direction: **D1 · The Illuminated Storybook** (creative-direction contract, user-chosen 2026-07-13)
Canvas: 1280×720 · Theme: `theme.json` · Brand kit: `hp-bricks` (dataset-derived)

---

# v2 ADDENDUM — "Storybook App" (2026-07-14, user-directed uplift; SUPERSEDES the v1 chrome and layout tables below)

**Intent (user, verbatim):** "a high end almost web application like look and
feel that breathes Harry Potter Lego." Story, page map, metric bindings, alt
text, tab-order rules and all G5 deviations stand; the *visual system* is
replaced.

## System

1. **Designed background art per page** (canvas-studio doctrine): one PNG
   @2x per page from SVG sources in `deliverables/canvas/` — dark app bar
   (72px, #05131D) with brick-stud dot strip, faint oversized Georgia
   chapter-numeral watermark, pre-painted white card wells (radius 12, soft
   baked shadow #E9E0CC offset), footer hairline, and the current page's
   gold nav underline. Furniture only — no data, no text besides the
   watermark numeral.
2. **Normative geometry:** `project/analysis/layout.py` — single source
   shared by `gen_canvas.py` (wells) and `gen_report.py` (visuals). Charts
   inset 16px inside their wells with transparent backgrounds; cardVisuals
   float directly on the field carrying their own surface + dropShadow
   (radius 12).
3. **App-bar chrome per page:** numeral (Georgia 26pt, #DBAC34) + title
   (Georgia 22pt, #F5F1E6) + kicker (Segoe UI 10pt, #A0A5A9); nav chips I–V
   right-aligned, white 12pt on transparent buttons (active page = baked
   gold underline). Footer: attribution 10pt #6C6E68 (unchanged text).
4. **KPI slots → `cardVisual`** (new card): callout = era-2 value,
   reference labels = era-1 value + ×delta (new 05 Display\Cards measures);
   white surface, radius 12, dropShadow Outer 90D, no title (recorded hide —
   the card's own labels carry meaning).
5. **Chart declutter:** no axis titles, axis labels 10pt #6C6E68, legends
   off (insight titles carry the series meaning), gridlines via theme
   (#EFE6D0); bar/column data labels on via theme visualStyles.
6. **Galleries/matrices:** transparent over wells; headers styled
   (#6C6E68 on transparent, no vertical grid, rowPadding 6, textSize 11);
   image columns sized via columnWidth.
7. **Quiz visual:** product-grade CSS (tile cards radius 12 + soft shadow +
   hover lift, fig images ≥48px, gold score pill, Georgia column headings,
   animated locked-line draw). Same data roles and a11y contract.

## v2 wireframes (slot → well; exact rects in layout.py)

- **P1** — takeaway well (24,96,792,132) · hero well (24,244,792,424) ·
  KPI rail: 3 cardVisuals (832, y=96/232/368, 424×120) · quote card well
  (832,504,424,164) hosting the "seven silent years" note (Georgia italic
  16pt) — replaces the chart overlay note.
- **P2/P3 (mirror)** — 4 cardVisuals (y96, 296×104, x=24/336/648/960) ·
  fig-gallery well (24,216,400,404; ~64px images) · top-sets well
  (440,216,816,244) · palette-strip well (440,476,816,72) · size-dist well
  (440,564,816,120).
- **P4** — hero well (24,96,660,560) · theme-grayness cardVisual
  (700,96,556,120) · rank well (700,232,556,236) · state button
  (700,484,556,56) · rank-note well (700,556,380,100) · Voldemort image
  (1096,540,160,116, dark only) · dark state = full-bleed designed dark PNG
  (image visual, bookmark-toggled).
- **P5** — quiz well (24,96,792,572) · quiz-questions cardVisual
  (832,96,424,104) · era-legend well (832,216,424,88) · how-to-play well
  (832,320,424,180) · fact-card well (832,516,424,152) with a verified
  evidence line.
- **tt-definitions** — 320×200 mini background, one well (8,8,304,184).

---

## Reading me

- Visual ids follow `design/naming-conventions.md` and match `measures.dax`.
- "Polish" references the numbered moves in the `dataviz-polish` skill.
- Anything unspecified defaults to the theme; visual-level overrides carry reasons.
- **Signed deviations (G5):** (1) true-hex palette visuals on II/III/IV exceed the
  6-hue cap — color IS the data; cap holds everywhere else. (2) `DimColors[Hex]`
  field-value conditional formatting = the semantic-color path. (3) Definitions
  ship on the `tt-definitions` tooltip page, not a report page.
- **Every number in copy cites `evidence-manifest.md`** — never the mission file.

## Page chrome (identical on every page; all chrome tab-order LAST)

| Element | Id | Spec |
|---|---|---|
| Masthead | `z_masthead` | 1232×56 at (24,16): chapter numeral (Georgia italic 20pt, accent #720E0F) + title (Georgia 20pt, ink) + era chip (II gold / III dark-red, rounded 8px, white 12pt Segoe UI Semibold text); hairline "chapter rule" beneath |
| Navigation | `z_nav` | five text buttons "I · Home … V · Quiz" right-aligned in masthead row, Segoe UI 12pt; current page underlined accent; button alt text = full page name |
| Footer | `z_footer` | 1232×24 at (24,680): left "Source: Rebrickable LEGO Database (rebrickable.com)" Segoe UI 10pt ink_secondary; right page role text. PRESENT IN BOTH P4 STATES |

---

## Page I — `p1-home` (overview)

**Question:** what happened to LEGO HP over time? · **3-second:** *he vanished for seven years and returned three times bigger.*
**Layout:** masthead row; left column 792px (hero + takeaway), right margin column 424px (KPI stack + margin note), 16px gutter.

| Id | Visual | Intent | Data | Polish | Explicit properties |
|---|---|---|---|---|---|
| `c_takeaway` | text box | Key Takeaway (≤50 words, re-count at s7) | static copy, drop cap first letter (Georgia 28pt accent) | 1 | no title; transparent bg; body Segoe UI 12pt ink |
| `hero_parts_timeline` | column chart | change over time | `[Parts Shipped]` by `DimYear[Year]`, page filter `Root Theme = Harry Potter`; axis fixed 2001–2027 categorical, **show items with no data ON** | 1, 3, 4 | title = `[Title Home Hero]` (insight sentence); columns: Era-coded — era1 gold, era2 dark red via `[Color Era]` fx; hiatus years render as gaps under a bracket annotation; y-axis #,0; alt text: "Columns of Harry Potter parts shipped per year 2001 to 2027; 2012 through 2017 are empty — the seven-year hiatus" |
| `c_note_hiatus` | text box | margin annotation | static: "— seven silent years —" Georgia italic 14pt ink_secondary, positioned over the gap | 2 | transparent; not in tab order (decorative duplicate of hero alt text) |
| `kpi_sets_by_era` | new card | magnitude | `[Sets]` per Era (era1 vs era2 reference labels: 67 → 142) | 7 | title hidden (recorded); callout 28pt; label "sets" |
| `kpi_avg_size_by_era` | new card | magnitude | `[Avg Parts per Set]` 267 → 731 with "×2.7" delta text | 7 | as above; delta in accent |
| `kpi_colors_by_era` | new card | magnitude | `[Distinct Colors Used]` 66 → 79 | 7 | as above |

**Interactions:** nav only; hero hover → `tt-definitions`. **Leaves out:** slicers, theme comparisons, minifig detail.

---

## Pages II & III — `p2-first-marriage` / `p3-second-marriage` (mirror twins)

**Questions:** what did each build look like? · **3-second:** II *a modest toy line in classic yellow* / III *it came back for the grown-ups.*
**Layout (identical grid, both pages):** masthead; KPI band 1232×88; below: left 608px `tbl_top_sets`, right 608px stacked `ch_size_distribution` (over) + `ch_palette_strip` (under); bottom band 1232×160 `tbl_fig_gallery`. Page filter: `Era = <the era>`.

| Id | Visual | Intent | Data | Polish | Explicit properties |
|---|---|---|---|---|---|
| `kpi_era_band` | new card multi | era stats | `[Sets]`, `[Avg Parts per Set]`, `[Distinct Colors Used]`, `[Grayscale Share %]` | 7 | title hidden (recorded); II shows 67 · 267 · 66 · 51.1%; III shows 142 · 731 · 79 · 40.9% (verify on refresh) |
| `tbl_top_sets` | matrix | detail-list w/ images | `DimSets[img_url]` (Image URL) + `Set Name`, `year`, `num_parts`; top 6 by `num_parts` | 5 | image height 64px; hairline row lines only; title "The era's biggest builds" (Georgia 14pt); alt text names the top set |
| `ch_size_distribution` | column chart | distribution | `[Sets]` by `num_parts` bins (Desktop grouping, bin size 250) | 3 | single-hue: era color; axis labeled "parts per set"; title = `[Title Size Dist]` |
| `ch_palette_strip` | 100% stacked bar (single bar) | part-to-whole | `[Parts Shipped]` by `DimColors[Color Name]`, **data colors fx = `DimColors[Hex]` (SIGNED DEVIATION)**, sorted by value | 2 | no legend (colors ARE the data; names on tooltip); 48px tall; title "Every brick color, to scale"; alt text states top-3 colors + gray share |
| `tbl_fig_gallery` | matrix (horizontal) | detail-list w/ images | `DimMinifigures[img_url]` + `Character`; II filtered to the six E10 yellow-skin figs, III to their flesh-tone counterparts (fig_num list in build notes) | 5 | image 72px; caption row Character; title II "The yellow-skin years" / III "The same faces, grown up" |

**Interactions:** paging II↔III (nav); `kpi_era_band` hover → `tt-definitions`; gallery hover shows fig name + set. **Leaves out:** cross-era deltas on-page (mirror carries the comparison).

---

## Page IV — `p4-color-dark-side` (detail + bookmark twin)

**Question:** most colorful set ever — and the opposite? · **3-second:** *HP is LEGO's most colorful license — Star Wars its grayest.*
**Layout:** masthead; left 792px `hero_color_composition`; right 424px stack: `kpi_theme_grayness`, `ch_colorful_rank`, `btn_dark_side`, `c_rank_note`. Dark state swaps content in the same slots (+ `img_voldemort` 160×160 bottom-right).

| Id | Visual | Intent | Data | Polish | Explicit properties |
|---|---|---|---|---|---|
| `hero_color_composition` | bar chart | part-to-whole detail | LIGHT: `[Parts Shipped]` by `Color Name` for set 76444-1, bars fx `DimColors[Hex]` (SIGNED) · DARK: same for 10175-1 | 1, 2 | title = `[Title Color Hero]` / `[Title Gray Hero]`; 55 bars is intentional (the point); category labels off below top 12, tooltip carries the rest; alt text: "55 colors of Diagon Alley Wizarding Shops, ranked" / "12 colors of Vader's TIE Advanced, 97.9% gray" |
| `kpi_theme_grayness` | new card | magnitude compare | `[Grayscale Share %]` HP 42.4% vs SW 71.8%; sub-label "99 lifetime colors — most colorful license" | 7 | tooltip page teases the dark side (mission §4) |
| `ch_colorful_rank` | bar chart | ranking | LIGHT: top-6 sets by `[Distinct Colors Used]`, 76444-1 highlighted accent, others neutral · DARK: grayest ≥1,000-part sets by `[Grayscale Share %]`, 10175-1 highlighted | 3, 6 | reference labels give rank numbers; honest copy: D&D 56 above 76444-1's 55 |
| `btn_dark_side` | button | state flip | action: bookmark `bm_p4_dark` · dark state twin `btn_light_side` → `bm_p4_light` | — | label "Want the least colorful? Come to the dark side →" / "← Back to the light"; Segoe UI Semibold 12pt; keyboard-operable; alt text explicit; 3:1 focus ring |
| `img_voldemort` | image | dark-state motif | `DimMinifigures[img_url]` for a Voldemort fig (fig-002136) via filtered card/image visual | — | DARK STATE ONLY; alt text "Voldemort minifigure"; decorative flag OFF (it anchors the joke) |
| `c_rank_note` | text box | honesty margin note | static: "Five mosaic sculptures are 100% gray — Vader's TIE is the grayest large *Star Wars* set." italic 12pt | 2 | keeps the claim honest per evidence manifest |

**Bookmarks:** `bm_p4_light` / `bm_p4_dark` — group both state stacks in Selection pane (`grp_p4_light`, `grp_p4_dark`); bookmarks capture display+data; **footer/masthead/nav shared, never hidden**. Dark state uses dark_state tokens (page bg swap via shape `z_bg_dark` behind content, ink via per-visual overrides — build note: theme has one page background, so the dark canvas is a full-bleed rectangle `z_bg_dark` + dark-token text overrides on the five dark-state visuals; all pairs pre-verified). Keep each state ≤7 data visuals (render budget).

**Interactions:** the flip; hero hover → `tt-definitions`. **Leaves out:** era mechanics, per-part detail.

---

## Page V — `p5-sorting-quiz` (interactive game)

**Question:** can you tell the eras apart from the figs alone? · **3-second:** *ten minifigures, two eras — can you sort them?*
**Layout:** masthead; left 792px `hero_quiz`; right 424px stack: `c_how_to_play`, `kpi_quiz_questions`, `c_era_legend`.

| Id | Visual | Intent | Data | Polish | Explicit properties |
|---|---|---|---|---|---|
| `hero_quiz` | **custom visual `hpSortingQuiz`** | matching game (justification gate: native/Deneb cannot hold pair state + draw connections — mission §6 verbatim) | data roles ← `QuizQuestions`: figureImage=fig_img_url, figureId=fig_num, characterOptions=character, eraOptions=era, setOptions=set_name (+set_img_url), answerKey=question_no | — | all colors via format pane defaulted to theme slots (NO hardcoded hex in render path); title bound; keyboard: tab to figure, arrows between options, Enter to connect; ARIA labels "match made: Hermione — 2001, correct"; visible 3:1 focus ring; match-by-value (duplicate characters accept either slot); Reveal/Reset buttons internal |
| `kpi_quiz_questions` | new card | score slot | `[Quiz Questions]` labeled **"scenario logic — game state lives in the visual"**; fallback mode: becomes live `[Quiz Score]` | 7 | title "The game" hidden (recorded); sub-label carries the scenario note |
| `c_era_legend` | text box + shapes | era legend | gold chip = First Build · dark-red chip = Second Build (chips + text, color never alone) | — | 12pt |
| `c_how_to_play` | text box | rules + keyboard path | 2 sentences + "keyboard: Tab, arrows, Enter" | — | 12pt ink_secondary |

**FALLBACK (pre-approved deviation path — decision by 2026-07-16):** same slots; `hero_quiz` replaced by three disconnected slicers (figure image gallery / character / era) + `[Quiz Score]` DAX validation measure + 10 per-question bookmarks `bm_p5_q01…q10`. No G5 reopen required.

**Interactions:** game internal; QuizQuestions stays disconnected. **Leaves out:** any live model binding beyond QuizQuestions.

---

## Tooltip page — `tt-definitions` (hidden; assumed not to count toward the 5-page cap — BUILD_LOG)

Canvas 320×200, parchment bg; `c_definition` (metric name + plain-language definition + exclusions, verbatim from metric contracts) + `kpi_context_value`. Assigned to: `hero_parts_timeline`, `kpi_era_band` (II/III), `kpi_theme_grayness`.

## Manual steps expected in Desktop

1. Set `DataFolder`, refresh; confirm date-table marking + ImageUrl categories (BUILD_LOG D1–D3).
2. Import packaged `hpSortingQuiz.pbiviz` from file; bind roles; verify it embeds in the exported .pbix (Q4).
3. Column-chart binning for `ch_size_distribution` (grouping UI is Desktop-only).
4. Verify "show items with no data" renders the hiatus gap as intended on the fixed axis.
5. Tab order per page: takeaway/rules → hero → KPIs → supporting → buttons → chrome last.

## Fidelity checklist (from the creative-direction contract — s6 is judged on these)

- [ ] Chapter numerals I–V + attribution footer on every page
- [ ] Ornament budget: drop cap + chapter rule + italic margin notes ONLY
- [ ] P1 hiatus visibly empty on a contiguous axis with margin-note bracket
- [ ] II/III exact mirror grids; era chips gold/dark-red
- [ ] P4 flip via real button; both states pass contrast; footer visible in both
- [ ] Georgia only ≥14pt; gold never text <18pt
- [ ] Every visual: explicit title (or recorded hide), background, alt text; 6-hue cap outside the three signed palette visuals
