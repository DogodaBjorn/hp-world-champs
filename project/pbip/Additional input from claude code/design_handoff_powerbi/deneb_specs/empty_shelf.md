# Cover hero visual: "The Empty Shelf" (Deneb / Vega-Lite)

The chosen cover visual (design ref: `reference_screenshots/S0_cover_1a.png`, bottom band). Sets released per year rendered as **book spines standing on an engraved shelf** — yellow foil spines 2001–2011, seven empty slots with dashed ghost outlines and dust 2012–2017, polychrome spines 2018–2026. The 2011 spine leans into the void.

## Competition constraints (Power BI Data Viz World Championships)
- **One Deneb visual** (certified, allowed) renders the entire shelf. No custom .pbiviz, no images-as-charts, no shapes stacked over the plot — everything data-driven inside one Vega-Lite spec.
- Visual background **transparent**; the leather cover, frame, title block, takeaway line and stats are separate native elements on the page (see pages/S0_cover.md).
- Keep tooltips on (judges check interactivity): year, sets released, era.
- Optional cross-highlight: switch `"data": {"values": …}` to `"data": {"name": "dataset"}` and add Deneb's standard selection usermeta once the shelf drives other visuals.

## Data contract
One row per year **2001–2026 inclusive** — zero years must exist (build a Year table and LEFT JOIN set counts; a bare Sets aggregation drops 2012–2017 and the void collapses).

| column | notes |
|---|---|
| year | int 2001–2026 |
| sets | real count of sets released that year (**sample values in the spec — replace**) |
| era | 'yellow' (≤2011) / 'silence' (2012–2017) / 'colour' (≥2018) |
| eraLabel | display string for tooltip |
| spineColor | hex, computed in Power Query: yellow era → #C69A31; colour era cycles [#D9A733, #7FA06A, #C97B4A, #8FA7C7, #B5533C, #E3C878] by (year−2018) mod 6, then hand-tune to avoid adjacent repeats (target order 2018–26: gold, sage, copper, steel, ember, bright, sage, gold, ember) |
| ghostH | only on 2013 / 2015 / 2017: ghost-spine heights ≈ 5 / 5.8 / 4.4 (data units) |
| dust | only on 2012 / 2014 / 2016: 0.6 / 0.5 / 0.7 (dust-mote y) |

## Geometry
- Visual viewport on the cover page: **x 40 · y 668 · w 640 · h 250** at 720×1020 page size (scale proportionally if the page differs). width/height "container".
- Shelf top line = y datum 0 (#A97E2F 1.5px), under-line +7px (#6B3323), y domain [0, 22] → tune domain max to ~110% of real max(sets).
- Spines: band paddingInner 0.38, corner radius 1.5 top. Foil bands: tick marks at 90% height (colour era, #E9CF8B .55) / 86% (yellow era, #2B0A06 .35).
- Leaning 2011 spine: a filled **path point mark** (rect path, 15:64 aspect), angle 9°, anchored on the shelf. `size = (desired px height)²` — 5184 ≈ 72px; recompute if the y scale changes so it matches its neighbours' scale. If it fights you, ship 2011 as a normal upright bar first (move the filter), flag as debt.
- Below-baseline labels (years dy 26, era captions dy 48) need `"clip": false` + bottom padding 64.
- Vega has no letter-spacing; era captions approximate the design's tracking — acceptable deviation.

## Spec
Paste `empty_shelf.vl.json` into Deneb (Vega-Lite mode). It renders standalone with sample data — swap real data in after it matches the reference.

## Acceptance
- [ ] Side-by-side vs S0_cover_1a.png bottom band: shelf lines, void position, spine rhythm match
- [ ] 2012–2017 slots visibly empty with 3 ghost outlines + dust + caption
- [ ] Real set counts bound; era totals reconcile (67 / 142)
- [ ] Tooltips work on spines AND ghost slots
- [ ] Transparent background over the leather; Crimson Pro rendering (font installed)
