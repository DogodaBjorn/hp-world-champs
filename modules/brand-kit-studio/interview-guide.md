# Brand-kit interview guide

Question script for the `bk-brand-kit` skill. Goal: translate brand
*materials* into design *roles* (the `brand.yaml` fields). Ask in this
order; later answers depend on earlier ones. Skip what the materials
already answer — but confirm, don't assume.

## 1. Materials & identity

- What exists? (style guide PDF, website, logo files, an existing deck)
- Three adjectives the reports should radiate. Three they must never.
- Who reads these reports, on what screens? (projector-in-a-meeting-room
  changes contrast decisions)

## 2. Color roles

- Of the brand colors: which one is **the accent** — the single color that
  marks "look here"? (If they say "all of them", the interview isn't done.)
- Which colors may carry **data**, and in what order? (max 6; test each
  against canvas and surface for AA contrast)
- The **good/bad pair**: what signals improvement, what signals a problem?
  Test explicitly: does the pair survive color-blind simulation, and does it
  differ from the categorical ramp enough to read as a verdict?
- Canvas and surface: warm or cool neutral? (never pure white canvas;
  derive hairline/ink-secondary from the same temperature)
- Anything banned? (competitor colors, "our red is only for the logo")

## 3. Typography

- Brand fonts — and are they *installed on readers' machines*? If not:
  choose the Power BI-safe fallback per family now, and show a sample in
  the fallback. The fallback is what most readers will see.
- Numeric style: are figures allowed a mono/tabular treatment?

## 4. Shape & density

- Corners: sharp, soft (8px), or round? Shadows: none or subtle?
- Density temperament: airy-executive or dense-operational as the default?

## 5. Voice

- Titles: insight sentences ("Margin recovered in Q2") or neutral labels
  ("Margin %")? One convention report-wide.
- Number formats: decimal comma or point, currency placement, thousands.

## Output

Fill `design/brand-kits/<kit>/brand.yaml` (from `_template`), place assets,
then run the validations: AA contrast for ink-on-canvas, ink-on-surface,
accent-on-both, good/bad-on-both; distinctness of the categorical ramp;
fallback stack realism. Record any failed-and-accepted check in the kit
file's comments — a kit with known compromises documents them.
