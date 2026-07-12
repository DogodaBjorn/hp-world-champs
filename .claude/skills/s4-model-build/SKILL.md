---
name: s4-model-build
description: Lifecycle stage 4 - model build. The pbir-operator authors the TMDL semantic model per the blueprint, then the inventory is diffed against the blueprint. Produces the model under project/pbip/ and 04-model-build.md.
---

# s4-model-build

**Question answered:** does the model on disk match the blueprint?
Primary agent: `pbir-operator` (the only mutator); `model-auditor` verifies.

## Procedure

1. Re-read `03-model-blueprint.md` and the metric contracts. The blueprint is
   the specification; deviations require updating the blueprint first.
2. Scaffold the PBIP under `project/pbip/` (research-first: verify the current
   PBIP/TMDL folder layout against Microsoft Learn or an existing reference —
   never from memory).
3. Author TMDL per the `tmdl-patterns` skill, in this order:
   a. shared expressions / parameters for **all** data sources (hard paths are
      a validator error);
   b. dimensions, then facts, with `queryGroup` folders;
   c. the marked Date dimension with its business flags;
   d. relationships exactly as blueprinted;
   e. the `_Measures` table — every measure with `///` docstring,
      `formatString`, and a numbered `displayFolder`; fill each metric
      contract's `implementation` block as you go.
4. Work in small diffs; the TMDL hook validates every file you touch. After
   each coherent batch run `python scripts/validate_tmdl.py --strict`.
5. Verify: run `python scripts/tmdl_inventory.py project/pbip` and **diff the
   inventory against the blueprint** — tables, grains (by key columns),
   relationships, measure count. Every difference is either fixed or written
   into `04-model-build.md` with a reason.
6. Write `04-model-build.md`: what was built, deviations + reasons, the
   inventory summary, and any Desktop-only follow-ups (e.g. marking the date
   table if TMDL flags need confirmation) for the BUILD_LOG later.

## Gate G4 checklist

- [ ] `validate_tmdl.py --strict` passes
- [ ] Inventory-vs-blueprint diff empty or every difference explained
- [ ] All metric contracts' `implementation` blocks filled
- [ ] No machine-specific source paths anywhere

Then hand back to `/next`.
