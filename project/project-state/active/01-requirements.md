# 01 · Requirements — hp-world-champs

**Date:** 2026-07-12 · **Contract:** [requirements.contract.yaml](requirements.contract.yaml)

## Audiences and decisions

The report has one decisive audience: **the judging panel (A1)**, whose only
"decision" is a score on the contest's five criteria. Every requirement traces
to at least one criterion — that tracing is the stage-1 spine:

| Requirement | Criterion it serves |
|---|---|
| R1 comeback arc, visible hiatus | Storytelling, Insightfulness |
| R2 era scale contrast | Insightfulness |
| R3 palette change | Insightfulness, Visual Effectiveness |
| R4 minifig evolution (yellow→flesh) | Storytelling, Insightfulness |
| R5 most colorful set, all-time rank | Insightfulness, Creativity |
| R6 grayest counterpart (SW flip) | Creativity & Innovation |
| R7 minifig matching game | Creativity & Innovation, engagement |
| R8 keyboard/screen-reader/contrast | Accessibility |
| R9 contest-rule compliance | eligibility (all criteria moot without it) |

The **entrant (A2)** takes two calendar decisions: custom-visual fallback
go/no-go by **2026-07-16**, content freeze by **2026-07-17**.

## Data landscape

Single source: the contest's Rebrickable CSV snapshot (verified 2026-07-12,
all 10 files, headers inspected, 50-row extracts in `project/data-samples/`).
Row counts: sets 27,069 · minifigs 16,960 · colors 275 · themes 494 ·
inventory_parts ~1.5M rows (130 MB). Finest grains and quality caveats are in
the contract's `data_landscape`. Two modeling-relevant findings:

1. **The full universe is required, not just Harry Potter.** R5 ranks an HP set
   against every LEGO set ever; R6 compares root themes. Facts therefore load
   all themes; `Era` is only meaningful where root theme = Harry Potter.
2. **`sets.num_parts` vs computed part counts** may disagree (Rebrickable's
   figure vs summing v1 no-spare inventory rows) — carried as Q2 into stage 2,
   where "Avg Parts per Set" gets its contracted source.

## Requirement-vs-design discipline

The mission pre-specifies visuals (column chart hero, image matrix, bookmark
flip, three-column game layout). Per the stage discipline these are **not**
requirements — they are parked here as the user's fixed design constraints and
re-enter at stage 5, where the page map is contractual and divergence is
limited to mood/metaphor/layout.

## Risks (carried from stage 0, unchanged)

pbiviz toolchain (fallback pre-approved, decide Jul 16) · dark-state contrast ·
CDN-dependent images · P4 render weight · tooltip-page count assumption.

## Open questions

All five (Q1–Q5 in the contract) are non-blocking for G1; each has a named
owner stage: Q1 gray-set edge cases → s2 · Q2 parts-per-set source → s2 ·
Q3 pbiviz research → s6 · Q4 .pbix embed check → s7 · Q5 tooltip-page
assumption → BUILD_LOG.

## Gate G1

Passed 2026-07-12: every requirement traces to an audience decision (table
above); the data landscape covers the single system all requirements depend
on; no blocking open questions; priorities are the requester's own (mission =
written prioritization; everything contractual is *must*).
