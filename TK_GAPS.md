# TK_GAPS — outstanding [TK] data in the v2 handoff

Per the v2 brief: every [TK] in the prototypes/specs gets the **real measure
bound anyway**; this file tracks each one and how it resolved. States:
`resolved-by-binding` (live model value fills it), `static-copy` (needs a
copy edit once the value is known), `open`.

| # | Where | [TK] item | State | Notes |
|---|---|---|---|---|
| 1 | S1 hero chart / data_model.md | 2006, 2008, 2009 parts totals | pending build | Data exists in sets.csv → will resolve by binding; hatch treatment per brick_chart_recipe applies only if truly null |
| 2 | S4a body copy | Diagon Alley Wizarding Shops part count | pending build | `[TK parts] parts across 55 real brick colors` — value derivable from Sets[num_parts] |
| 3 | S2/S3 distribution charts | Bin counts (5 bins × both eras) | pending build | Resolve by binding Sets[size_bin] × count |
| 4 | S2 gallery | Set cards 3–4 names/metadata (era I) | pending build | Pick from data: next-largest era-I sets after Hogwarts Castle & Diagon Alley |
| 5 | S3 gallery | Set card 3 (era II) | pending build | Same rule, era II |
| 6 | S2 minifig card | Ron & Dumbledore variant counts | pending build | COUNTROWS(Minifigs) per character |
| 7 | S2 gallery | Hogwarts Castle (2001) part count | pending build | In sets.csv |
| 8 | S1 footer | "2006, 2008, 2009 totals [TK]" footer note | static-copy | Footer copy updates once #1 confirms values exist |
