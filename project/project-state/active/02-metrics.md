# 02 · Metric architecture — hp-world-champs

**Date:** 2026-07-12 · **Contracts:** [metrics/](metrics/) (M-001…M-009, one per KPI)

## Glossary

| Id | Name | One-line definition | Direction | Owner |
|---|---|---|---|---|
| M-001 | Sets | Count of sets in the current slice (full universe loaded, all themes) | context | entrant |
| M-002 | Parts Shipped | Sum of part quantities, **v1 inventories only, spares excluded** — exclusions enforced in the fact query | context | entrant |
| M-003 | Avg Parts per Set | Average of Rebrickable's own `sets.num_parts` — deliberately **not** M-002 ÷ M-001 | context | entrant |
| M-004 | Distinct Colors Used | Distinct fact `color_id`, excluding pseudo-colors `-1` and `9999`; at set grain = the "most colorful set" ranking | up (narrative) | entrant |
| M-005 | Grayscale Share % | Share of Parts Shipped whose color name contains Gray/Grey/Black/White (34 of 275 colors) | context | entrant |
| M-006 | Unique Minifigures | Distinct `fig_num` through v1 inventories | context | entrant |
| M-007 | Minifig Variants per Character | Distinct figs per Character (name before first `,` or `(`) | context | entrant |
| M-008 | Era | Set attribute: First marriage ≤2011 · Hiatus 2012–2017 · Second marriage ≥2018; only for Root Theme = Harry Potter, else `n/a` | n/a | entrant |
| M-009 | Quiz Score | **Scenario logic** — correct matches out of 10 curated questions; disconnected tables; dual mode (visual-internal vs fallback DAX) | up | entrant |

## Ambiguities hunted and resolved

1. **"Parts" means two things** (biggest catch). *Parts Shipped* (M-002, inventory
   flow, v1/no-spares) ≠ *set size* (M-003, Rebrickable's `num_parts`). E4 uses
   M-002; E1/E2 averages use M-003. The starter model's `Parts` measure is
   M-002 with the v1 filter in DAX — superseded by fact-query filtering.
2. **Gray set defined by name rule with decided edge cases** (Q1 closed):
   *included* — Glow in Dark White, Trans-Black ×2, Speckle Black-*,
   Modulex/HO/Pearl/Chrome gray-black-white; *excluded* — metallic
   silvers/titaniums (7 colors: finish, not palette; also preserves
   comparability with the E7/E8 prior analysis). Implemented as a Power Query
   `IsGrayscale` column on DimColors, so the rule is inspectable data.
3. **Pseudo-colors** `-1 [Unknown]`, `9999 [No Color/Any Color]`: count as
   shipped parts (M-002 denominator) but never as palette (M-004/M-005 gray
   set). E5/E6 re-derivations must note any delta vs the mission's numbers.
4. **Same fig vs same character** — M-006 counts designs, M-007 counts designs
   per character; both stated to prevent the "576 figs" / "44 characters"
   numbers colliding in copy.
5. **Quiz Score is scenario logic** and labeled as such everywhere (invariant
   5); its dual mode (custom visual holds live state → DAX card shows quiz
   metadata; fallback → DAX computes real score) is written into M-009 so the
   Jul-16 fallback decision cannot change what the number means silently.

## Not-available flags for stage 3

Revenue, box office, sales, licensing terms — narrative context only, never
data claims (already in the mission's own metrics-NOT-available direction).
Stage 3 formalizes the list in the blueprint.

## Gate G2 — user sign-off

**Signed 2026-07-12** by the requester (in-session, explicit): glossary
accepted *as written*, including the three steward decisions put to them
verbatim — gray-set edge cases (silvers/titaniums excluded), M-003 sourced
from `sets.num_parts`, pseudo-color handling. No amendments requested.
