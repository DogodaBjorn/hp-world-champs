# v3 wiring — remaining Desktop steps

The v3 report is wired headlessly as far as is reliable: portrait cover +
full-canvas backgrounds on every page, 5 native charts + the Match-the-Minifig
game (DAX + slicers + ✓/✗ cards), all validated (`pbir validate` = 0 errors).
The steps below are the ones that must (or are safest to) be done in Power BI
Desktop — the fragile-to-author-blind surfaces (conditional colour-by-hex, and
bookmark visibility capture, which Power BI populates from the live UI).

Open `project/pbip/second-build.pbip`, **refresh** the model first.

## 1 · Verify the model loads
- Refresh. Confirm the new tables load: **EraGuess** (First/Second Build),
  **SetGuess** (every set), and measures **Era Result / Set Result** (folder
  "03 Match Game"). No errors expected.

## 2 · Colour-by-real-hex (the colours page's whole point) — 2 clicks each
- **fig_colourmap** (treemap, s4a): Format ▸ Colors ▸ *fx* ▸ Format style
  **Field value** ▸ based on **Colors[Hex]**. Now every colour tile is its true
  brick hex.
- **fig_spectrum** (100% stacked bar, s4a): same — data colours by **Colors[Hex]**.
- **fig_gap** (cover column): set the column fill to gold `#B8912E` (or by year/era).
- **fig_sets** (s2/s3 bars): fill gold `#B8912E`; s3 optionally by a colour measure.

## 3 · Chart polish (parchment aesthetic)
For each chart: gridlines **off**, category/value axes minimal or off (captions
are baked into the background), data labels on where it reads well, legend off
(treemap/spectrum self-label). Tune to the baked FIGURE captions.

## 4 · Hidden minifig-tips — place overlays + capture bookmarks
For each tale: add an **Image** visual bound to the tip PNG (it's already a
registered resource), set it **Hidden** in the Selection pane, add a transparent
**Blank button** over the ✦ clue, and a small transparent button over the tip's
baked ✕. Then Bookmarks: one "show" (tip visible) assigned to the clue button,
one "hide" (tip hidden) assigned to the ✕ button. Use **selected-visuals** scope
so a reveal doesn't disturb the charts.

Exact positions (canvas coords = px):

| Page | Tip image (resource) | tip x,y,w,h | Clue button x,y (36×36) |
|---|---|---|---|
| s4a colours | tip_harry.png | 120,250,476,250 | 150,506 |
| s4a colours | tip_vold.png | 360,250,476,250 | 446,508 |
| s2 yellow | tip_yellow_duo.png | 110,344,600,252 | 232,486 |
| s2 yellow | tip_dementor.png | 150,360,476,250 | 406,558 |
| s3 colour | tip_colour_duo.png | 110,344,600,252 | 140,462 |
| s3 colour | tip_marge.png | 120,360,542,250 | 392,470 |
| s3 colour | tip_appearances.png | 110,344,600,252 | 250,578 |

## 5 · Dark page — Expecto Patronum banish (s4b)
- Add **cut_dementor2.png** image at ~566,84 (h≈302) — the looming Dementor.
- Add **patronus_btn.png** image at ~560,406 (≈260×70) with a transparent Blank
  button over it → action = bookmark **bm_banish**.
- Add **patronus_glow.png** image at ~590,110 (≈250×250) + two text boxes
  ("Expecto Patronum!" / "The Dementor flees…"), all set Hidden.
- bm_banish: Dementor + button hidden, glow + text visible. (Optional: a reset.)

## 6 · Colours ↔ Greys flip + nav
- The "…or come to the dark side ❦" (s4a) and "❦ back to the colour" (s4b) are
  baked into the backgrounds. Add transparent Blank buttons over them:
  s4a→s4b and s4b→s4a (Page navigation). Same for the cover's "open the book"
  (→ s2) and each spread's "turn the page ❦" / "❦ back".
- Ribbon tabs (I·II·III·✦·?) on the right edge are baked — optionally add
  transparent page-nav buttons over each.

## 7 · Match-the-Minifig tuning (s5)
- Slicers: sl_character single-select; sl_minifig single-select (it filters to
  the chosen character automatically via the model); sl_era_guess &
  sl_set_guess single-select. Style each as a clean dropdown/list, text ink.
- Optional: an image visual at ~110,520,270,128 bound to measure
  **_Measures[Fig Image]** to show the chosen minifig.
- Confirm crd_era_result / crd_set_result show the ✓/✗ verdicts as you guess.

## 8 · Finish
- Re-capture page screenshots reflecting v3, update the contest submission,
  export **.pbix** before **2026-07-19 23:59 PT**.
