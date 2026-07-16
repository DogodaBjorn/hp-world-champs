# v3 — remaining Desktop steps (after the refinement round)

Most of what this file used to list is now **wired headlessly** and validated
(`pbir validate` = 0 errors): the empty FIGURE frames are filled, the bar overflow
is fixed, the **minifig-tip reveal/hide + Expecto-Patronum banish bookmarks** are
authored, the game is rebuilt (tile controls + live minifig photo + wrapped result
seals), storybook **navigation buttons** are placed, and a disconnected
**Star Wars vs Harry Potter** greyscale table (`ThemeGreyscale`) feeds the dark
chamber. What remains below genuinely needs Power BI Desktop.

> ⚠️ **Desktop prunes unreferenced resources on save.** All tip/patronus PNGs are now
> referenced by visuals, so they are safe. Don't register images you won't reference.

Open `project/pbip/second-build.pbip`.

## 1 · Refresh first — confirms the Star Wars load (do this before anything)
- **Refresh**. This loads the new **`ThemeGreyscale`** table (Star Wars, Harry Potter,
  Friends, City greyscale composition — disconnected, no relationships) plus the
  measures **Theme Grayscale % / Theme Color Parts** (folder `04 Themes`) and
  **Set Parts** (`01 Core`). If the model won't load, that table is isolated —
  removing `tables/ThemeGreyscale.tmdl` + its two measures + its `ref` line reverts
  cleanly (fallback: HP-only greyscale). No error expected.

## 2 · Colour-by-real-hex (the one genuinely-Desktop piece) — 2 clicks each
- **fig_colourmap** (s4a), **fig_colours_s2** (s2), **fig_colours_s3** (s3) treemaps
  and **fig_spectrum** (s4a): Format ▸ Colors ▸ *fx* ▸ Format style **Field value**
  ▸ based on **Colors[Hex]** → every tile/segment becomes its true brick hex.
- **dk_composition** (s4b, 100% stacked): set the two series colours by hand —
  **Grey** → a mid grey, **Colour** → gold `#B8912E`.
- **dk_greyrank** / **fig_sets** / **fig_gap** bars: fill gold `#B8912E`.

## 3 · Game polish (s5)
- **img_minifig** (the live photo): Format ▸ set **Image height** large, turn the
  **column header off** so it reads as a photo, not a table. Confirm it shows the
  picked minifig (single-select character + minifig).
- **sl_set_guess**: turn on **Search** (Slicer ▸ … ▸ Search) — many sets. (The
  headless toggle was blocked by a schema-validation quirk; it's a 1-click here.)
- Tile styling: colour the **sl_era_guess** two buttons + character/minifig tiles to
  the parchment/red palette. Optional: colour the result cards (✓ green / ✗ red —
  the glyph + words already carry the meaning, so colour is a bonus, not required).

## 4 · Chart polish (parchment aesthetic)
Per chart: gridlines off, axes minimal/off (captions are baked), data labels on where
they read well, legends off (treemaps self-label; the composition legend can stay).

## 5 · Click-test the interactions (all pre-wired — just verify)
- **Tooltips:** on s2/s3/s4a tap each ✦ clue → the minifig-tip appears; tap it (or its
  ✕) → it closes; tapping another clue swaps tips (mutually exclusive). Bookmarks:
  `bm_rev_*` (reveal), `bm_hide_s2/s3/s4a` (close).
- **Patronus (s4b):** tap **Expecto Patronum** → the Dementor vanishes, the Patronus
  glow appears (`bm_banish`); tap the glow → the Dementor returns (`bm_reset`).
- **Navigation:** cover "open the book" → chapters; "turn the page"/"back"; s4a
  "dark side" ↔ s4b "back to the colour"; right-edge ribbon tabs I·II·III·✦.
- **Cross-filter:** click a bar in **FIG1** (s2/s3) → **FIG2** stats + **FIG3** palette
  update to that set.

## 6 · Shareability (the contest deliverable must work for anyone)
- The report is **100% native visuals** (+ image visuals + bookmarks) — **no custom/
  AppSource visuals**, so it is **Publish-to-web compatible** and needs no certification.
- All art (backgrounds, tips, patronus) is bundled inside the .pbix as static resources.
- **One external dependency:** the game's live minifig **photo** and any set photos load
  from **Rebrickable image URLs** (`cdn.rebrickable.com`). These render in the Service /
  Publish-to-web as long as that CDN is reachable. If a fully self-contained entry is
  required, swap `img_minifig` to a bundled static image (loses per-selection change).
- Verify in **Publish to web** (or a shared Service link) that images + interactions work.

## 7 · Finish
- Re-capture page screenshots, update the contest submission, export **.pbix** before
  **2026-07-19 23:59 PT**.
