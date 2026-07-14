# Data model

Source: Rebrickable database extracts (CSV). Suggested tables:

## Sets
| column | type | notes |
|---|---|---|
| set_num | text | key |
| name | text | |
| year | int | 2001–2026 |
| num_parts | int | |
| era | text | calculated: "First marriage" (year<=2011) / "Silence" (2012–2017) / "Second marriage" (>=2018) |
| size_bin | text | calculated: 1–100 / 101–300 / 301–700 / 701–2k / 2k+ |
| img_url | text | Rebrickable CDN |

## Minifigs
fig_num (key), character_name, set_num (FK), year, era, skin ("yellow"/"flesh"), img_url

## SetColors  (per set × color, for palette strips and composition bars)
set_num (FK), color_id, color_hex (real brick hex), part_count, is_grayscale (bool)

## Colors  (dim)
color_id (key), name, hex, is_grayscale

## Measures (DAX)
- Total Sets = COUNTROWS(Sets)  — era-filtered: 67 / 142
- Avg Parts = AVERAGE(Sets[num_parts]) — 267 / 731
- Largest Set = MAX(Sets[num_parts]) — 2,029 / 6,020
- Distinct Colors = DISTINCTCOUNT(SetColors[color_id]) — 67 / 80
- Grayscale % = DIVIDE(CALCULATE(SUM(SetColors[part_count]), Colors[is_grayscale]), SUM(SetColors[part_count])) — 51% / 41%
- Parts per Year = SUM(Sets[num_parts]) by year (hero chart)
- Minifig Variants = COUNTROWS(Minifigs) per character
- Total Minifigures = 576 (all eras)

## Known values (hero chart, parts per year)
2001: 2,326 · 2002: 2,423 · 2003: 332 · 2004: 3,591 · 2005: 2,115 · 2006: [TK] · 2007: 946 · 2008: [TK] · 2009: [TK] · 2010: 3,180 · 2011: 2,960 · 2012–2017: 0 · 2018: 15,234 · 2019: 2,863 · 2020: 9,852 · 2021: 10,252 · 2022: 11,730 · 2023: 14,419 · 2024: 11,317 · 2025: 16,150 · 2026: 11,993

## Character facts used in copy
Harry: 22 old / 59 new variants · Hermione: 9 old / 33 new · 44 characters span both eras · 576 total minifigures · Diagon Alley Wizarding Shops (2025): 55 distinct colors, #2 most colorful LEGO set ever · Vader's TIE Advanced (2006): 97.9% grayscale, Star Wars ~72% gray vs Harry Potter ~42%.
