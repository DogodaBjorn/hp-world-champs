---
name: design-critique
description: Run the divergence-critique-convergence process for report design - produce three genuinely different creative directions, argue each against the design doctrine, and after the build run the fidelity review. Used inside stage 5 and again at the stage 6 gate.
---

# design-critique

Two jobs: force real creative divergence before stage 5 converges, and check
fidelity after stage 6 builds.

## Divergence (stage 5)

Produce three directions in `creative-direction.contract.yaml`. A direction
is a *stance*, not a palette:

- **Organizing concept** — the metaphor or editorial frame that makes the
  report memorable (a briefing, a control room, a ledger, a field report…).
- **Visual language** — type feel, color temperature, density, and the one
  signature layout move that follows from the concept.
- **Signature moment** — the single element a reader would describe to a
  colleague afterward.
- **Risk** — every direction has one; naming it is part of the work.

Divergence test: if two directions could swap accent colors and be the same
report, they are one direction — replace one. Anchor each in the audience:
a daily operational crew and a quarterly board read differently.

## Critique (stage 5, before the user chooses)

For each direction, argue honestly against `design/design-doctrine.md`:

1. Does the concept *serve* the 3-second message, or perform around it?
2. Does it survive the 3-minute trust path (density, labeling, definitions)?
3. Does it hold up on the worst page (the Detail table), not just the hero?
4. Accessibility: contrast, color-never-alone, realistic font fallbacks.
5. Will it still look deliberate after six months of small edits?

Recommend one, but present all three with their risks. **The user decides**;
record `chosen_because` in their words and write the fidelity checklist —
the 3-5 elements that define the direction and must survive the build.

## Fidelity review (stage 6 gate)

Walk the built PBIR against the fidelity checklist and the design handoff,
page by page, property by property (theme applied? chrome consistent? hero
where the contract says? polish moves present?). Every deviation becomes a
`review-finding` (dimension: design) — fixed, or accepted by the user in
writing. "Close enough" is a finding, not a verdict.
