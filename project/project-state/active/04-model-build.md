# 04 · Model build — hp-world-champs

**Date:** 2026-07-13 · **Model:** `project/pbip/hp-world-champs.SemanticModel/`
**Validation:** `validate_tmdl.py --strict` 13 files, 0 errors, 0 warnings ·
`validate_json.py` clean · inventory diffed against blueprint below.

## What was built

9 tables (2 facts, 5 dims, DimYear, disconnected QuizQuestions, _Measures),
6 single-direction relationships exactly as blueprinted (zero bidirectional),
7 contracted measures with docstrings/folders/format strings, 4 shared
expressions (`DataFolder` parameter, `fnCsv` reader, `ThemesResolved` and
`V1Inventories` staging). All metric contracts' `implementation` blocks filled.

**QuizQuestions curation (M-009):** 10 questions hand-picked by fig_num from
the verified evidence: 5 per era, 8 characters, two same-character
yellow-vs-flesh teaching pairs (Harry fig-000471/fig-001818, Hermione
fig-000593/fig-008935), plus era icons (glow-head Snape 2001, Rise of
Voldemort 2019). Era strings equal DimSets[Era] exactly. No distractor
columns: the option pool is the question set itself (match-by-value), which
the visual spec at s6 must honor.

## Evidence re-derivation

Done first, in [evidence-manifest.md](evidence-manifest.md): all E1–E10
confirmed (deltas −1 color / −181 parts traced to signed pseudo-color rule);
copy constraints locked (2.74× "nearly triple" set size; 1.85× relaunch parts;
"grayest large *SW* set", "most colorful license by color count").

## Deviations (each with reason)

1. **No queryGroups** — syntax unverifiable against reachable docs
   (research-first rule 3, conservative option); `Dim*/Fact*` naming carries
   the organization. Can be added in Desktop's TMDL view later.
2. **DimYear generated in M, not a DAX calculated table** — blueprint amended
   (same content; avoids unverified calculated-table column syntax).
3. **DataFolder ships as a placeholder string** — the repo validator errors on
   ANY absolute path in TMDL, including a parameter's current value. First
   Desktop open: set the parameter (see Desktop follow-ups). Judges are
   unaffected: import-mode data travels inside the .pbix.
4. **Date-table marking encoded as `dataCategory: Time` + `isKey` on hidden
   `Year Start Date`** — TOM-faithful but not verifiable offline; confirm in
   Desktop (Mark as date table) and record in BUILD_LOG.
5. **Inventory script reports "0 shared expressions"** — it only counts files
   *beginning* with `expression`; ours opens with a docstring. 4 expressions
   verified present by eye; script is framework-owned (fix belongs in the
   template repo, noted for port-back).

## Inventory vs blueprint diff

Tables 9/9 ✓ · relationships 6/6 with identical endpoints/direction ✓ ·
measures 7 = the 7 contracted implementables (M-007 shares M-006's measure by
design; M-008 is a column) ✓ · grains enforced in queries (v1 + no-spares in
facts; group-by to declared grain) ✓ · no machine paths (validator-enforced) ✓.

## Desktop follow-ups (carried to BUILD_LOG)

1. Open the PBIP (created at s6 with the Report), set `DataFolder` to the CSV
   folder, refresh (~1M-row fact: expect minutes, not seconds).
2. Confirm date-table marking on DimYear; confirm ImageUrl categories render.
3. Spot-check against the evidence manifest: HP era1 sets 67 / era2 142;
   Parts Shipped 2018 = 15,053; Diagon Alley Wizarding Shops distinct colors
   = 55; Grayscale Share (Star Wars) = 71.8%; Unique Minifigures (HP) = 576.

## Open questions

None new. Q3 (pbiviz) and Q4 (.pbix embed) remain owned by s6/s7.
