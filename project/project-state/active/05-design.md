# 05 · Creative direction & design contract — hp-world-champs

> **v2 changelog (2026-07-14):** user-directed uplift after first rendered
> review — "high-end, almost web-application look and feel that breathes
> Harry Potter LEGO". Design-brief tokens amended (radius 12, soft baked
> shadows, dark app-bar chrome); design-handoff carries the v2 addendum with
> background-art wireframes; story, page map, metric bindings, and all G5
> signed deviations unchanged. Recorded in creative-direction.contract.yaml
> → user_directed_uplift.

**Date:** 2026-07-13 · **Direction:** D1 "The Illuminated Storybook" (user pick)
**Contracts:** [creative-direction](creative-direction.contract.yaml) ·
[design-brief](design-brief.contract.yaml) · [pages/](pages/) (6 page-purpose files)
**Quartet:** `deliverables/design-handoff.md` · `data-model.md` · `measures.dax` · `theme.json`

## Story → pages

The fixed mission story ("two marriages, one franchise") maps to five
chapters: I resurrection overview · II/III mirror-twin era portraits ·
IV color superlative with the dark-side flip · V the Sorting Quiz. Every page
contract carries its 3-second message and 3-minute trust path; definitions
ship as the `tt-definitions` tooltip layer (signed deviation 3).

## Divergence → critique → choice

Three directions different in kind — D1 storybook (nostalgic book language),
D2 museum retrospective (curatorial minimalism), D3 built-from-bricks
(toy-forward furniture) — argued honestly against the doctrine in the
creative-direction contract. **User chose D1** (2026-07-13): the voice
matches the two-marriages arc; ornament risk is capped by the fidelity
checklist (drop cap + chapter rule + margin notes ONLY, serif ≥14pt, flat
parchment tint, no texture images).

## Brand kit "hp-bricks" — the report dressed in its own bricks

Every meaning-bearing color is a verified HP brick color (evidence manifest
`hp_color_table_full`): ink = Black (14.5% of all HP parts), canvas = Tan
tint, accent = Dark Red, era pair = Pearl Gold ↔ Dark Red (light-vs-dark
luminance keeps it CVD-legible), neutrals = the Bluish Grays. Dark-side state
tokens come from the same table (Black canvas, Metallic Gold accent).

**Contrast evidence (check_contrast.py, all PASS):** kit 10/10 standard
pairs; compiled theme 8/8; 16 ad-hoc pairs across light AND dark states —
worst passing text pair 4.58:1 (ink_secondary on canvas), dark-state floor
7.2:1. One deliberate constraint: **Pearl Gold fails 4.5:1 as text**
(3.2–3.6:1) → forbidden as text below 18pt, markers only (kit `forbidden`).

## Signed deviations (G5, user, 2026-07-13)

1. True-hex palette visuals (II/III `ch_palette_strip`, IV
   `hero_color_composition`) exceed the 6-hue cap — color IS the data; the
   cap holds on every other visual.
2. `DimColors[Hex]` field-value conditional formatting accepted as the
   documented semantic-color path.
3. No Definitions report page (contest 5-page cap) — definitions as tooltips.

## Gate G5

- Every page has a purpose contract with 3-second message + 3-minute path ✓
- Three genuinely divergent directions, honest critique, **user chose** ✓
- Quartet complete and internally consistent (kit tokens = brief = theme.json
  = handoff; visual ids in handoff = measures.dax) ✓
- Fidelity checklist written into the creative-direction contract and
  repeated in the handoff ✓

## Open questions

- None blocking. s6 build notes carried in the handoff (Desktop-only binning,
  show-items-with-no-data behavior, .pbiviz import); fallback decision date
  2026-07-16 stands.

## 2026-07-14 — v2 pivot: external pixel-perfect handoff supersedes the quartet

The user rejected the rendered v1 report ("not even worth being called a
first draft") and, after one abandoned in-repo uplift attempt (storybook,
archived in git), supplied a **complete external design handoff**:
`design_handoff_powerbi/` — HTML hi-fi prototypes (visual truth), per-page
specs S1/S2/S3/S4a/S4b/S5/T1, theme.json, data_model.md, brick-chart recipe,
Deneb starting specs, quiz-visual spec, and Playwright measurement tools.

That bundle is now the stage-5 design contract for the v2 build
(`two-marriages-v2`). Decisions recorded:

- **Font:** Crimson Pro is not installed and Power BI cannot embed fonts —
  judges would hit silent fallback. User chose the handoff's own documented
  fallback: **Georgia everywhere** (flagged, per README §Typography).
- **Positions are measured, never eyeballed** — `tools/extract_layout.mjs`
  output is normative; page-spec tables are cross-checks.
- **Deneb** (free, certified AppSource visual) renders all brick charts,
  palette strips, and composition bars → `deneb-studio` module enabled.
- v1 report, model, and hpSortingQuiz stay frozen as reference. The v1
  quartet and its G5 sign-offs remain valid history for v1 only.
