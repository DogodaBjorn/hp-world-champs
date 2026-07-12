---
name: s3-model-design
description: Lifecycle stage 3 - model design. Declare fact grains first, design the star schema on paper, map every metric to a data path, and write the "not available - do not fabricate" list. Produces 03-model-blueprint.md and the model-blueprint contract.
---

# s3-model-design

**Question answered:** what star schema serves the metrics, at which grains?
Primary agent: `model-auditor` (read-only — nothing is built at this stage).

## Procedure

1. **Grain first.** For each candidate fact, finish the sentence
   "one row means …" before naming a single column. If two grains hide in one
   source, that's two facts (or an aggregation decision — write it down).
2. For `redesign`/`model-extension` projects: have `model-auditor` inventory
   the existing model first (`python scripts/tmdl_inventory.py <path>`), and
   design against reality, not assumptions.
3. Design dimensions (wide, descriptive), relationships (single-direction,
   many-to-one; bidirectional needs written justification), and the marked
   **Date dimension** with the business flags stage 1 surfaced (fiscal
   periods, campaign windows, working days…).
4. Plan the measure table and its numbered display-folder taxonomy (see the
   `tmdl-patterns` skill).
5. **Metric map:** every stage-2 metric gets a concrete path
   (Fact[column] + aggregation) — or an entry on the
   **"metrics NOT available — do not fabricate"** list with the reason and the
   nearest honest proxy (plus its caveat) if one exists.
6. Fill `model-blueprint.contract.yaml`; write `03-model-blueprint.md` with a
   schema diagram (ASCII is fine), the reasoning, and `## Open questions`.
7. Review with the user, especially the not-available list — surprises there
   must surface now, not at delivery.

## Gate G3 checklist

- [ ] Every fact's grain declared before its columns
- [ ] Every metric mapped or explicitly not-available
- [ ] Star-schema rule satisfied (no unjustified snowflakes/bidirectional)
- [ ] Sources parameterized in the plan (no machine paths)
- [ ] User accepted the blueprint including the not-available list

Then hand back to `/next`.
