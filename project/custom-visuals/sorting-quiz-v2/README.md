# The Sorting Ceremony (sorting-quiz-v2)

Three-column matching quiz for the **Two Marriages** v2 report (S5), built
per `design_handoff_powerbi/custom_visual_quiz.md`. Supersedes v1
hpSortingQuiz (clean-room rebuild; v1 stays frozen as reference).

- GUID `sortingQuizV2D76FC5E4C1D342358190662509ED4D3A` · version 2.0.0.0
- pbiviz 7.1.1 (local devDependency, no global install) · API 5.3.0
- Package: `npm install && npm run package` → `dist/sortingQuizV2….pbiviz`
- Lint: `npm run lint` (eslint-plugin-powerbi-visuals) — clean

## What it renders

The **entire S5 content band** (place at x33 y102, 1214 × 570): the quiz
panel (fig tiles / character names / era·year labels with the SVG connector
gutter), plus the score card, **Reveal answers**, and **Reset** — those
controls must live inside the visual because PBIR buttons cannot drive a
custom visual's state (recorded deviation, 06-build.md).

Interaction: click a minifig **tile** → its **character name** → its
**era** label. Correct chain locks in gold (animated line draw, name/era
get " ✓"); wrong pick flashes a red dashed line for 400 ms. Ten rounds,
five per wave; the second wave loads when the first is complete. Score
counts player matches only (revealed answers don't score). Line tokens per
spec: idle 1.5px dashed #B5AB95 (3 5) · locked 3px #C9A227 · wrong 3px
dashed #B33A2B (7 6) · focus ring 2px #C9A227 offset 2px.

Accessibility: every tile/name/era is keyboard-operable (Tab + Enter/Space),
focus-visible rings, ARIA labels, and an aria-live region announcing
matches, wrong picks, wave changes, and resets.

## Import & bind (Desktop)

1. Visualizations pane → ⋯ → *Import a visual from a file* →
   `dist/sortingQuizV2D76FC5E4C1D342358190662509ED4D3A.2.0.0.0.pbiviz`.
2. On page **Chapter IV**: delete the placeholder textbox
   (`c_quiz_placeholder`) and the frame shape (`z_quiz_frame`), add the
   visual in the same slot — x 33 · y 102 · width 1214 · height 570.
3. Bind from **QuizPool** (order matters only for reading, roles are
   explicit): Match key ← `fig_num` · Minifig image URL ← `fig_img_url` ·
   Character name ← `character_name` · Era label ← `era_set_label`.
4. Verify CDN images render (WebAccess privilege for
   cdn.rebrickable.com is declared and essential).

## Maintenance

Owner: Bjorn (dogoda.nl). Data contract: any table shaped like QuizPool
(≤10 rows, 4 text columns). Known limitations: fixed-pixel inner layout
tuned to the 1214×570 slot; no localization; no cross-visual selection
(deliberate — the pool is disconnected from the filter graph).
