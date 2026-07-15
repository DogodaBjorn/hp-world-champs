# Evidence manifest — hp-world-champs

**Re-derived 2026-07-13** from the contest CSVs by
[project/analysis/derive_evidence.py](../../analysis/derive_evidence.py)
(machine detail: [evidence-manifest.json](../../analysis/evidence-manifest.json)).
Definitions as signed at G2/G3: strict HP scope (root 246), v1 inventories,
spares excluded, gray = name rule, pseudo-colors excluded from color counts.
**Every number visible in the report cites this manifest, never the mission.**

## Verified numbers (the citable set)

| Claim | Verified value | vs mission hypothesis |
|---|---|---|
| E1 First Build 2001–2011 | **67 sets · avg 267 parts · max 2,029** (Diagon Alley 10217) | exact match |
| E2 Second Build 2018– | **142 sets · avg 731 parts · max 6,020** (Hogwarts Castle 71043) | exact match |
| E2 era size ratio | avg 731 ÷ 267 = **2.74× bigger sets** ("nearly triple") | confirmed |
| E3 hiatus | **0 HP sets every year 2012–2017** | exact match — premise holds |
| E4 relaunch scale | **15,053 parts shipped in 2018** vs **8,141 total 2001–2004** = **1.85×** | 15,053 vs hypothesized 15,234 — use "nearly twice", cite 15,053 |
| E5 palette era1 | **66 distinct colors · 51.1% grayscale** | 66 vs 67: pseudo-color exclusion (signed at G2) |
| E5 palette era2 | **79 distinct colors · 40.9% grayscale** | 79 vs 80: same |
| E6 most colorful HP set | **Diagon Alley Wizarding Shops 76444-1 (2025): 55 colors, #2 ever** behind D&D Red Dragon's Tale 21348-1 (**56**) | rank confirmed; D&D 56 vs 57: same exclusion |
| E7 grayest large SW set | **Vader's TIE Advanced 10175-1 (2006): 97.9% gray of 1,212 parts** | exact match. **Copy caution:** it is #6 globally — five mosaic/sculpture sets are 100% gray. Say "grayest large *Star Wars* set", never "grayest ever" |
| E8 theme grayness | **Star Wars 71.8% = grayest major theme; HP 42.4%** | ≈72 / ≈42 confirmed |
| E8 most colorful license | **HP 99 lifetime colors** — #1 licensed (Disney 90, SW 81, Marvel 77); only in-house Duplo (123) beats it overall | 99 vs 100: pseudo-color exclusion; claim holds |
| E9 minifigs | **576 unique HP figs, 0 missing img_url; 44 characters in both eras; Harry 22→59, Hermione 9→33** | exact match |
| E10 yellow skin | 2001–03 fig names literally contain "Yellow Skin" (e.g. fig-000471 Harry, fig-000593 Hermione, fig-000594 Ron); modern figs flesh-toned | confirmed textually |

## Scope & hygiene records (G3 commitments)

- Look-alikes excluded by strict scope: **51 sets** (25 + 19 CMF Fantastic
  Beasts series, 7 HP advent calendars under Advent). Recorded, not HP.
- HP sets without a v1 inventory: **0** — M-002 has no blank-set edge in HP scope.
- Character heuristic artifacts observed as predicted (M-007): Polyjuice
  dual-names ("Albert Runcorn / Harry Potter"), disguise variants, and
  "Professor Minerva McGonagall" vs "Minerva McGonagall" split. Quiz pool is
  therefore **hand-curated by fig_num**, never generated from Character alone.

## Copy guidance locked by evidence (for stages 5–6)

1. Key Takeaway can say **"nearly triple"** only about set size (2.74×);
   relaunch-year parts is **"nearly twice"** (1.85×).
2. P4 dark-side copy: **"the grayest large Star Wars set"** (97.9%), and
   **"LEGO's grayest major theme"** (71.8%) — both true; "grayest ever" is not.
3. "Most colorful license" (99 colors) is the precise flagship phrase; HP is
   *not* lowest-gray (Disney is) — never claim "least gray".
4. Palette-strip and brand-kit source: HP top colors by quantity are
   structural neutrals (Black, Tan, Dark Bluish Gray, Reddish Brown) — the
   *distinctive* accents for the kit (dark reds, greens, golds) come from the
   full hp color-quantity table in the JSON, chosen at stage 5.

## Deltas requiring nothing

All deltas (−1 color counts, E4 −181 parts) trace to the G2-signed
pseudo-color exclusion and grouping rules; direction and story unaffected.
No contradiction reaches the G3 premise-challenge threshold.
