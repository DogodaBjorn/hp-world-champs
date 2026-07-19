# Page S1 · Home — "The Boy Who Came Back"

Canvas 1280×720, bg #F5EFE3. Vertical rule 1px #D8CFBC at x356 (full height above footer).

## Left panel (x0 y0 w356 h692, padding 28 L/R, 26 top)
| # | element | x y w h | spec |
|---|---|---|---|
| 1 | Spectacles+bolt SVG (image) | 28 26 66 30 | asset spectacles-bolt.svg |
| 2 | Brick glyph SVG (image) | 108 27 46 27 | asset brick-glyph.svg, #C91A09 fill, #211B14 stroke |
| 3 | Eyebrow text | 28 70 300 18 | "A LEGO RETROSPECTIVE · 2001–2026" 13px 600 ls0.14em #8A6A21 |
| 4 | Title text | 28 92 300 152 | "The Boy Who Came Back" Crimson Pro 48px 600, lh 1.04, #211B14 |
| 5 | Two-brick ornament (image) | 28 250 116 22 | two brick glyphs, #8C7A5B and #6E2B25 |
| 6 | Key Takeaway card | 28 286 300 148 | bg #FCF9F1, border 1px #D8CFBC, pad 16. Eyebrow "KEY TAKEAWAY" 11.5px #8A6A21; body 15px/1.47: "LEGO Harry Potter vanished for seven years. It returned in 2018 at nearly triple the scale — bigger sets, more colors, aimed at the readers who grew up. Two marriages, one franchise, told in 576 minifigures." |
| 7 | Mini-KPI row (3 cards) | 28 448 300 52 | 3 equal cards, 10px gap, 2px top border #8C7A5B. Values "67 → 142" / "267 → 731" / "67 → 80" Crimson Pro 20px 600; labels "sets"/"avg parts"/"colors" 11.5px #5C5346. Static text (or measures). |
| 8 | Nav button grid 2×2 | 28 574 300 102 | 4 buttons w145 h46, gap 10. Border 1px #211B14, bg #FCF9F1, hover #F0E8D6. 18×12 brick glyph + label 13px 600. Buttons→page nav actions: "I · The Yellow Years" (#F2CD37), "II · The Boy Who Grew Up" (#C91A09), "III · Chamber of Colors" (#0055BF), "IV · The Sorting Ceremony" (#2E5941). |

## Hero chart (x356 y0 w924 h692, padding 32 L/R, 30 top)
| # | element | x y w h | spec |
|---|---|---|---|
| 9 | Chart title | 388 30 400 18 | "PARTS SHIPPED PER YEAR" 13px 600 ls0.12em #5C5346 |
| 10 | Legend (custom text) | right-aligned 1248 30 | 12px swatches: #8C7A5B "First marriage 2001–2011", #6E2B25 "Second marriage 2018–2026", 12.5px |
| 11 | Brick column chart | 388 82 860 540 | 26 columns (2001–2026). Bind: Sets[year] × [Parts per Year]. See brick_chart_recipe.md. Max height 380px = 16,150. Value labels only on 2004/2018/2025 + [TK] cols. Year labels rotated −90° 10.5px. |
| 12 | "Seven silent years" annotation | 744 140 185 60 | Crimson Pro 24px italic #8A6A21 "seven silent years"; below "2012–2017 · zero sets" 12px #5C5346; bottom bracket 1px #8A6A21 with 5px end ticks. Overlay text box, no bg. |
| 13 | Era axis strip | 388 640 860 20 | 3 centered labels 11px #5C5346 above nothing: "First marriage" (w 42.3%), "the silence" (italic, w 23%), "Second marriage" (w 34.7%), top border 1px #D8CFBC |

Footer — x0 y692 w1280 h28, top border 1px #D8CFBC, transparent bg.
- Left text: x32, "Source: Rebrickable LEGO Database (rebrickable.com)" 11.5px #5C5346
- Right text: right-aligned x1248, "Home · 1 of 5 · 2006, 2008, 2009 totals [TK]" 11.5px #5C5346
