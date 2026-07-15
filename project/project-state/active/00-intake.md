# 00 · Intake — hp-world-champs

**Date:** 2026-07-12 · **Classification:** new-build · **Deadline:** 2026-07-19
23:59 PT (content-complete 2026-07-17) · **Contract:** [intake.contract.yaml](intake.contract.yaml)

## The request

Contest entry for **Power BI Dataviz World Champs Barcelona, Round 2**, built
from the requester's mission brief
[MISSION-hp-world-champs.md](../MISSION-hp-world-champs.md) ("The Boy Who Came
Back — LEGO and Harry Potter's two builds"). The mission is the stage-0
source of truth and seeds every later stage:

- **Evidence pack (E1–E10)** = hypotheses with high prior; every number must be
  re-derived from the model at stage 4/6 and recorded in the evidence manifest.
- **Page map (5 pages, §4) and game spec (§6)** = contractual. Stage 5
  divergence explores mood/metaphor/layout only; story and page map are fixed.
- **Contest constraints (§1)** = blocker-severity, swept item-by-item at stage 7.

## Feasibility

Feasible in the window, with one scheduled risk decision:

- Dataset on disk and complete (10 CSVs); starter PBIP available as read-only
  reference. Toolchain: Python 3.14 ✓, Node 24 ✓, pbir 0.9.25 ✓ (pinned),
  Power BI Desktop assumed present for export/rendered review.
- `pbiviz` **not yet installed** — needed for the P5 custom visual
  (`hpSortingQuiz`). Install + scaffold research happens when custom-visual
  work starts; **fallback decision point 2026-07-16** (mission §6: degrade to
  disconnected slicers + DAX validation + bookmarks — pre-approved deviation
  path to be written into the design handoff at stage 5).

## Risks

| Risk | Mitigation |
|---|---|
| pbiviz toolchain/timeline fails | §6 fallback, decision by Jul 16, pre-approved in design handoff |
| Dark-side bookmark state fails contrast | `check_contrast.py` runs on both states at stage 5 + 7; highest-risk surface named in mission §1.7 |
| True-hex palette visuals vs design hard rules 2/6 | Not worked around: recorded deviation goes into the stage-5 design contract for explicit G5 sign-off (color IS the data on P2/P3/P4) |
| Rebrickable CDN images need connectivity | Verify at stage 7; note for judges in BUILD_LOG / gallery post |
| 5-page limit vs hidden tooltip pages | Assumption (tooltip pages don't count) documented in BUILD_LOG; tooltip pages kept minimal |
| Render time on P4 (bookmark flip doubles visual count) | Mission §4 build note honored: lean states, grouped in Selection pane |

## Knowledge sources scoped

All four register tiers apply as usual. Project additions (recorded in
`contracts/source-register.yaml` → `project_additions`): Rebrickable database
& CDN, the Round 2 contest brief (fabric community article 5272049), and
Stephanie Bruno's starter model. Credits added to CREDITS.md in the same
change (attribution rule 5).

## Open questions

- Gray-set edge cases for `Grayscale Share %` ("Glow in Dark White"?
  trans-black?) — decide and record at stage 2 (mission §3 leaves this open).
- Key Takeaway word count — re-count at stage 6/7 after verified numbers land.
- Current `pbiviz` version / visual API version — research when custom-visual
  work starts (research-first rule; record in the visual's README).
- Does Desktop embed the imported .pbiviz in the exported .pbix such that it
  opens clean on a judge's machine? Verify at stage 7 sweep (mission §7 says
  yes — treat as hypothesis).

## Gate G0

Passed 2026-07-12: classification and scope confirmed in writing via the
requester-authored mission file and the approved execution plan (see
`intake.contract.yaml` → `gate_g0.confirmation_note`).
