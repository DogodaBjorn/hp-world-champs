# MISSION — "The Boy Who Came Back"
### Power BI Dataviz World Champs Barcelona · Round 2 · build brief for pbi-atelier

This file is the **stage-0 source of truth** for a contest build. Drop it into
`project/` of a fresh pbi-atelier project copy and reference it from the kickoff
prompt (bottom of this file). It seeds every lifecycle stage so the agents spend
their effort building, not rediscovering.

**Read me under pbi-atelier's invariants.** Everything below labeled *evidence*
was derived from the actual contest CSVs by prior analysis and is trustworthy as
direction — but per the *do-not-fabricate* and *research-first* rules, every
number that lands in a visual or the Key Takeaway must be **re-derived from the
model** at stage 4/6 and recorded in the evidence manifest. Treat my figures as
hypotheses with high prior, not as citable facts.

---

## 0 · Project initialization

```
python scripts/init_project.py --name hp-world-champs --client-alias fabric-contest \
  --language en --modules custom-visual-studio,brand-kit-studio,icon-studio,nav-studio,tooltip-studio,a11y-studio,table-studio --brand-kit none
```

- `deneb-studio` is deliberately **not** enabled — see §6 (game) for why the
  escalation goes straight to pbiviz.
- Brand kit: none at init; stage 5 creates a bespoke kit (`brand-kit-studio`)
  from the dataset's own palette — see §5.
- After init: `/next` as usual. Do not skip gates; the deadline (§1) is tight
  but the gates are what make this entry championship-grade.

## 1 · Contest constraints (hard requirements — treat as blocker-severity)

Source: "Power BI Dataviz World Champs Barcelona | Round 2" blog post
(community.fabric.microsoft.com, article 5272049). Deadline: **July 19, 2026,
11:59pm Pacific** (today is July 12 — seven days).

1. Built in **Power BI Desktop**, submitted as a **single .pbix**.
   → Submit the .pbix file itself, *not* a Publish-to-Web URL: the report will
   contain an imported custom visual and bookmark states; the file is the safe
   rendering path for judges.
2. **Max 5 pages.** The design contract must use exactly 5 (see §4) — hidden
   tooltip pages do not count as report pages in the contest's sense, but keep
   them minimal and document the assumption in the BUILD_LOG.
3. **Use the provided dataset** (Rebrickable-derived CSVs / starter pbix).
   Cleaning, transforming, enriching, and remodeling are explicitly allowed.
4. **At least three core Power BI visuals.** The build uses many (column, bar,
   matrix, card, slicer); the custom visual is additive, never a substitute.
5. **Visible Key Takeaway statement on the landing page**: ≤50 words, general
   audience. Candidate text in §4/page 1 — word-count it after final numbers.
6. **Visible attribution on the report**: exactly
   `Source: Rebrickable LEGO Database (rebrickable.com)` — put it in the footer
   of *every* page. Missing attribution = ineligible. This also satisfies the
   repo's own `attribution.md` rule; add Rebrickable to CREDITS.md.
7. **Accessibility expectations**: alt text on every visual, strong contrast,
   intentional layout and tab/reading order. Run the `ax-audit` skill as a
   named stage-7 gate item, and `scripts/check_contrast.py` on the theme —
   including the dark-side bookmark state (§4/page 4), which is the highest
   contrast-risk surface in the report.
8. Judging criteria to optimize, in the contest's own words: Insightfulness,
   Visual Effectiveness, Creativity & Innovation, Accessibility,
   Storytelling & Communication.

## 2 · The story (stage 0/1 seed)

**Concept: "The Boy Who Came Back — LEGO and Harry Potter's two marriages."**

LEGO Harry Potter ran 2001–2011, disappeared for **seven years**, and returned
in 2018 at a scale that dwarfs the original: more sets per year, sets ~2.7×
larger on average, a wider and less-gray palette, aimed at the readers who grew
up during the hiatus. The report tells this in five acts: the resurrection
(home), the first marriage, the second marriage, a color deep-dive with a
cheeky "dark side" flip to Star Wars, and an interactive minifig matching game.

**Audience & decision (stage 1 framing):** the audience is the panel of
contest judges; the "decision" they take is a score on five criteria. Every
requirement must trace to a criterion, e.g. the dark-side flip → Creativity;
the era-mirrored pages → Storytelling; the quiz → Innovation + engagement;
alt-text discipline → Accessibility.

### Evidence pack (verify all at stage 4; grain noted per item)

| # | Claim (hypothesis) | Value found in prior analysis | Grain / method |
|---|---|---|---|
| E1 | Old era sets (2001–2011) | 67 sets, avg 267 parts/set, max 2,029 | sets table, root theme = Harry Potter |
| E2 | New era sets (2018–2026) | 142 sets, avg 731 parts/set, max 6,020 | idem |
| E3 | Hiatus | zero HP sets 2012–2017 | sets per year |
| E4 | 2018 relaunch scale | 15,234 parts shipped in 2018 alone ≈ 2× the 2001–2004 total | inventory_parts × inventories(v1) × sets, spares excluded |
| E5 | Palette old vs new | 67 distinct colors / 51.1% grayscale vs 80 / 40.9% | color_id distinct + quantity share where color name contains Gray/Black/White |
| E6 | Most colorful HP set | Diagon Alley Wizarding Shops (76444-1, 2025): 55 distinct colors — #2 most colorful LEGO set ever (behind D&D Red Dragon's Tale, 57) | distinct color_id per set, v1 inventories |
| E7 | Grayest large SW set | Vader's TIE Advanced (10175-1, 2006): 97.9% grayscale of 1,212 parts | gray-share per set, ≥1,000 parts |
| E8 | SW vs HP theme grayness | Star Wars ≈ 72% grayscale (LEGO's grayest major theme); HP ≈ 42% (most colorful licensed theme, 100 colors lifetime) | quantity share per root theme |
| E9 | HP minifigs | 576 unique figs, **all** with img_url; 44 characters exist in both eras (Harry 22 old / 59 new; Hermione 9 / 33) | inventory_minifigs × minifigs, character = name before first comma/paren |
| E10 | Yellow→flesh faces | 2001 fig names literally read "…, Yellow Skin, …"; modern figs are flesh-toned | minifigs.name text |

Anything not derivable from the CSVs (e.g. revenue, film box office) goes on
the **metrics-NOT-available list**. Real-world context (the 2012–2017 gap
coinciding with the film franchise ending, the adult-fan pivot) may appear as
*narrative text*, clearly separated from data claims.

## 3 · Model blueprint seed (stage 2/3)

Grain declarations first, per the star-schema rule:

- **FactPartsInSets** — grain: one row per (set, part, color) for **version-1
  inventories, spares excluded**. Source: inventory_parts ⋈ inventories(v1).
  Drop `img_url` here (high-cardinality string, ~1.5M rows; the images shown
  in the report come from Sets/Minifigures, not parts).
- **FactMinifigsInSets** — grain: one row per (set, minifig). Source:
  inventory_minifigs ⋈ inventories(v1).
- **DimSets** — one row per set. Enrich in Power Query: `Root Theme` and
  `Sub Theme` (flatten themes' parent_id recursion), and
  `Era = if year <= 2011 then "First marriage (2001–2011)" else if year >= 2018 then "Second marriage (2018– )" else "Hiatus"`
  (only meaningful where Root Theme = Harry Potter; other themes get "n/a").
  Keep `img_url` and set its data category to Image URL.
- **DimColors** — one row per color. Add `Hex = "#" & rgb` (this column drives
  every true-color conditional-formatting rule in the report), `is_trans`,
  and the lifespan columns y1/y2.
- **DimParts** — one row per part; merge part_categories in (one text column).
- **DimMinifigures** — one row per minifig. Enrich: `Character` (name split
  before first `,` or `(`), `img_url` as Image URL category.
- **DimYear** — calculated year table 1949–2027, marked as date-adjacent axis
  (a slim year dimension is enough; there are no dates below year grain).
- **Quiz tables (disconnected, no relationships)** — see §6: `QuizQuestions`
  (curated answer key) plus whatever the custom visual needs; document them in
  the blueprint as deliberately relationship-free.
- Relationships: single-direction only, dimensions filter facts. Any
  dim-through-fact count uses `CROSSFILTER` inside a measure, never a standing
  bidirectional relationship.
- inventory_sets (bundles) is **out of scope** — record that in the blueprint.

Metric contracts to write at stage 2 (one YAML each; names final at G2):
`Sets`, `Parts Shipped` (v1, no spares — the exclusions ARE the contract),
`Avg Parts per Set`, `Distinct Colors Used`, `Grayscale Share %` (define the
gray set: color name contains Gray/Black/White — write the edge cases:
"Glow in Dark White"? trans-black? decide and record), `Unique Minifigures`,
`Minifig Variants per Character`, `Era` semantics, `Quiz Score` (scenario
logic — label as such).

## 4 · Design contract seed (stage 5)

Stage 5 must still run properly — three divergent directions, critique,
convergence — but the user has pre-chosen the *story* and the page map below is
contractual. Divergence should therefore explore **mood/metaphor/layout**
(e.g. "illuminated storybook" vs "Hogwarts letter & parchment" vs "modern
museum retrospective"), not alternative stories.

**Theme direction:** build a brand kit from the dataset itself — the dominant
hex values of HP-era parts (dark reds, golds/tans, dark greens) so the report
is literally dressed in the bricks it describes. WCAG-check every
text/background pair (`check_contrast.py`), in both the light narrative theme
and the dark-side state. Avoid Warner Bros. trademark assets (film logos,
official crests, movie stills): all imagery comes from the dataset's own
Rebrickable CDN `img_url` columns (sets and minifigs), which is both
contest-clean and rights-clean. Fonts: licensed/embeddable only — no bootleg
"magic" fonts; a serif with strong italics + a clean sans is enough.

Page map (exactly 5 pages + hidden tooltip page(s)):

**P1 · Home — "The boy who came back."**
3-second message: *he vanished for seven years and returned three times bigger.*
Hero visual: column chart, HP parts shipped per year 2001–2026 — the seven-year
silence must be *visible* (keep empty years on the axis; annotate the gap).
KPI band: sets / avg size / colors, old vs new. Key Takeaway (candidate, 47
words — re-count after verification):
> "LEGO Harry Potter vanished for seven years. It returned in 2018 at nearly
> triple the scale — bigger sets, more colors, aimed at the readers who grew
> up. Two marriages, one franchise, told in 576 minifigures."
Navigation: nav-studio pattern styled as the journey (ticket / footprints),
plus standard visible nav for accessibility (never icon-only).

**P2 · First marriage (2001–2011).**
Mirror layout twin of P3 — same grid slots, same visual types, filtered to
Era 1, so paging between them makes the contrast physical. Content: set-size
distribution, palette strip (bars colored by the actual `Hex` field), top sets
as an image-URL matrix (core visual renders images natively), the yellow-skin
minifig gallery (E10). 3-second message: *a modest toy line in classic yellow.*

**P3 · Second marriage (2018– ).**
Identical grid, Era 2. Everything is simply *bigger and more colorful* —
that's the point. Call out max set 6,020 parts, 80 colors, flesh-tone figures.
3-second message: *it came back for the grown-ups.*

**P4 · The most colorful set of them all — with a dark side.**
Hero: Diagon Alley Wizarding Shops (76444-1) — 55 colors, #2 in LEGO history
(E6). Visuals: color composition (bar/treemap, every mark in its true hex),
"where it ranks" comparison vs famous sets. The flip: a button labeled
*"Want the least colorful? Come to the dark side →"* triggers a **bookmark
swap** to a grayscale twin state — same visual grammar, filtered to Vader's
TIE Advanced (10175-1, 97.9% gray, E7), dark theme surface, and the Voldemort
minifig image (from DimMinifigures.img_url — the dataset has 6 Voldemort figs)
fading in beside the SW stat. A report-page tooltip teases the SW grayness
before the flip. Build notes: group both states in the Selection pane; keep
each state lean (the flip doubles the page's visual count — watch render
time); the toggle is a real button with alt text and works via keyboard; the
dark state must independently pass contrast checks. 3-second message:
*Harry Potter is LEGO's most colorful license — Star Wars its grayest.*

**P5 · The Sorting Quiz — minifig matching game.**
See §6. Supporting core visuals around the custom visual: a score card
(DAX measure) and an era legend, so the page contributes to the ≥3-core-visuals
requirement independently of the game.

Every page: attribution footer (§1.6), page-purpose contract with its
3-second message and 3-minute trust path, alt text for every visual, explicit
tab order.

## 5 · Data prep recipes (stage 4 quick reference)

- Era column, theme flattening, character extraction: as in §3 — do them in
  Power Query so slicers/legends get clean columns, not DAX hacks.
- Data categories: `DimSets.img_url` and `DimMinifigures.img_url` → Image URL;
  `DimColors.Hex` → used only via conditional formatting (Format by: Field
  value) — never as a legend.
- Sources parameterized (repo rule 9): a `DataFolder` parameter, no absolute
  Windows paths (the starter pbix's queries hardcode the author's paths —
  replace them, don't inherit them).
- The starter model's three **bidirectional relationships must not survive**
  the rebuild; the starter's `Parts` measure filter
  (`inventories[version rev] = 1`) becomes unnecessary once v1-filtering moves
  into the fact query.

Key DAX (final form authored at stage 4 under dax-patterns; sketches):

```dax
Parts Shipped        := SUM ( FactPartsInSets[quantity] )        -- v1/no-spares by construction
Distinct Colors Used := DISTINCTCOUNT ( FactPartsInSets[color_id] )
Grayscale Share %    := DIVIDE (
    CALCULATE ( [Parts Shipped], DimColors[IsGrayscale] = TRUE () ),
    [Parts Shipped] )
Quiz Score           := -- scenario logic, disconnected tables; label as such in its contract
    COUNTROWS ( FILTER ( QuizAnswers, QuizAnswers[IsCorrect] ) )
```

## 6 · Page 5 — the custom visual ("Sorting Quiz")

**Justification gate (write this into the design handoff verbatim-ish):**
the contracted analytical intent is *"an interactive matching game — the user
connects a minifigure photo to its character, era, and set, with immediate
right/wrong feedback, running score, and drawn connection lines."* Native
visuals + bookmarks can fake a multiple-choice quiz but cannot hold game state,
draw user-created connections, or give per-attempt feedback without a
combinatorial bookmark explosion; Deneb/Vega-Lite has selections but no
arbitrary state machine or click-to-pair line drawing. Hence escalation
directly to **custom-visual-studio** (this is why deneb-studio stays
disabled — don't burn a day proving the intermediate step fails).
Maintenance owner: the user. Lifetime: contest entry (one-shot); note that in
the BUILD_LOG rather than pretending it's a product.

**Visual spec — `hpSortingQuiz` in `project/custom-visuals/hp-sorting-quiz/`:**

- Scaffold per `modules/custom-visual-studio/pbiviz-scaffold.md`
  (research current `pbiviz` command syntax first; record pbiviz + API
  versions in the visual's README). Node ≥ 20 required — verify before
  scaffolding, stop and point at DEPENDENCIES.md if absent.
- **Data roles** (bind from the model, aggregation stays in DAX):
  - `figureImage` (Grouping): DimMinifigures.img_url of the question figure
  - `figureId` (Grouping): fig_num
  - `characterOptions` (Grouping): candidate character names
  - `setOptions` (Grouping): candidate set names (+ set img_url if a second
    image role is wanted)
  - `answerKey` (Grouping): from the `QuizQuestions` table — correct
    character / era / set per fig_num
- **QuizQuestions curation (10 questions):** pick characters present in BOTH
  eras (E9) so era-guessing is a real puzzle, and include at least one
  yellow-skin vs flesh-tone pair of the *same* character (E10) — the game then
  *teaches* the report's thesis. Suggested pool: Harry, Hermione, Ron, Draco,
  Dumbledore, Snape, McGonagall, Voldemort, Luna, Ginny. Store as a small
  static table (entered data or CSV) with columns:
  fig_num, img_url, character, era, set_num, set_name, distractor lists.
- **Interaction model:** three columns (figure | character | era+set); click a
  figure then click a character to draw a connection line; wrong pair = shake
  + red line that fades; right pair = line locks in theme gold; score updates;
  "Reveal" and "Reset" buttons. All state internal to the visual.
- **Design-system compliance (repo rules):** every color surfaces through the
  formatting pane defaulted to theme slots — no hardcoded hex in the render
  path; title/background settable; respects the active theme in both the
  light and dark-side bookmark contexts.
- **Accessibility is in scope, not polish:** full keyboard operation
  (tab to a figure, arrow between options, Enter to connect), visible focus
  ring, high-contrast support, ARIA labels naming figure/character, and a
  text fallback ("match made: Hermione ↔ 2001, correct") for screen readers.
  This page will be scrutinized under the contest's accessibility criterion
  precisely because it's the flashy one.
- Test against the real model early (binding + cardinality), package with
  `pbiviz package`, import the `.pbiviz` into the report **from file** so it
  embeds in the .pbix. BUILD_LOG: package/API versions, import steps, known
  limitations.

**Fallback (risk management, decide by July 16):** if the pbiviz toolchain or
timeline fails, degrade to the native pattern — disconnected slicers
(character / era / set) + DAX validation measure + per-question bookmarks.
It's a lesser experience but fully compliant; the design handoff should
contain this fallback as a pre-approved deviation path so switching doesn't
require re-opening gate G5 mid-crunch.

## 7 · Stage-7 delivery checklist (beyond the standard gate)

- Contest compliance sweep against §1, item by item, recorded in the evidence
  manifest: page count, core-visual count, Key Takeaway word count, attribution
  present on every page, alt text everywhere, tab order set, single .pbix
  opens clean on a machine without the dev toolchain.
- Every number visible in the report traces to a measure + evidence-manifest
  entry (re-derived, not copied from §2).
- Image URLs load from Rebrickable's CDN — verify online rendering and note
  in the BUILD_LOG that judges need connectivity for images.
- Dark-side bookmark state: contrast re-check, screen-reader walk-through,
  keyboard-only walk-through.
- Submission package: .pbix + gallery post (image, description, tag
  "World Champs BCN") — the description should credit Rebrickable and
  Stephanie Bruno's starter model (attribution.md culture applies outward).
- Deadline buffer: content-complete by **July 17**, leaving two days for QA
  and submission mechanics.

---

## Kickoff prompt (paste into Claude Code in the project copy)

> Read `project/MISSION-hp-world-champs.md` in full — it is the stage-0 source
> of truth for a Power BI contest build with a hard deadline of July 19.
> Initialize the project exactly as its §0 specifies, then run the lifecycle
> via `/next` stage by stage. The mission file seeds each stage: treat its
> evidence pack as hypotheses to re-verify against the data, its page map and
> game spec as contractual, and its contest constraints as blocker-severity.
> At stage 5, run real divergence on mood/metaphor only — the story and page
> map are fixed. Flag anything in the mission that conflicts with a repo rule
> before working around it. First action: confirm the module list and ask me
> for the dataset folder path.

*Prepared July 12, 2026, from the Round 2 dataset (Rebrickable LEGO Database,
rebrickable.com) and the contest brief. All evidence-pack numbers derived with
version-1 inventories, spares excluded, unless noted.*
