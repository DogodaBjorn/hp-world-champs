---
name: ax-audit
description: Run the accessibility audit (a11y-studio module) - scripted WCAG contrast checks, color-never-alone, alt text from contracted intents, tab order, consistency; findings as review-finding contracts, results as gate evidence. Use at gates 6-7 or whenever accessibility is in question.
---

# ax-audit

**Module gate:** requires `a11y-studio` in `project/project.yaml` →
`modules`. If disabled, say so and stop (and note that the design hard
rules' baseline — AA contrast, color-never-alone — still apply without it).

## Procedure

1. **Measure contrast:** `python scripts/check_contrast.py` (auto-resolves
   theme → kit → neutral defaults). Then check the pairs the standard set
   can't know: heat-ramp extremes with their label color, text over chrome
   washes — each via `--pair "<fg>" "<bg>"` with values from the design
   brief/handoff.
2. **Walk the checklist** (`modules/a11y-studio/a11y-checklist.md`) section
   by section against the built report and the design handoff:
   - color-never-alone verified per visual (not per page);
   - alt text authored from each visual's contracted intent — message, not
     chart type; write missing ones now and hand them to pbir-operator (or
     the BUILD_LOG if the property needs Desktop);
   - tab/reading order noted per page; 🖥 items go to the rendered-review
     handoff, never silently skipped.
3. **Emit findings:** every failed item becomes a `review-finding` contract
   entry (dimension: design; severity by impact — unreadable text is a
   blocker, a missing alt text on a support visual is major, wording polish
   is minor). No finding is closed by discussion; only by fix or recorded
   user acceptance.
4. **Attach evidence:** contrast output, alt-text list, tab-order notes,
   findings + resolutions — into `06-build.md` / `07-delivery.md` as part
   of the gate evidence.
5. Re-run at G7 on the delivered state; drift between G6 and G7 (a late
   visual, a swapped color) is exactly what the re-run catches.

## Done when

Contrast is measured (not assumed) for every meaning-carrying pair, the
checklist has no unhandled item, every failure is a tracked finding, and
the gate evidence shows the run — so "accessible" is a claim the repo can
prove, not a vibe.
