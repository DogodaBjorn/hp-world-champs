---
name: s2-metrics
description: Lifecycle stage 2 - metric architecture. Write one contract per KPI (definition, grain, direction, edge cases), hunt definition ambiguity, and get the glossary signed. Produces 02-metrics.md and one metric contract per KPI.
---

# s2-metrics

**Question answered:** what does every number mean, exactly?
Primary agent: `definition-steward`. This stage exists because definitions,
not DAX, are where BI projects fail.

## Procedure

1. Extract every metric implied by the stage-1 requirements. Include the
   quiet ones (denominators, "active" filters, period conventions).
2. One `contracts/metric.contract.yaml` per KPI, filled completely:
   plain-language definition, formula **in words**, grain, standing filters,
   unit, direction-is-good, edge cases, owner. Leave the `implementation`
   block empty — that belongs to stage 4.
3. **Ambiguity hunt** (the steward's core job):
   - same name, different meaning (e.g. two departments' "revenue");
   - different names, same meaning (merge, record synonyms);
   - unit and period traps (fiscal vs calendar, timezone, inclusive ends);
   - targets: real (sourced) or scenario logic (must be labeled as such).
4. Anything that needs data the sources may not have → flag now; stage 3
   decides whether it lands on the not-available list.
5. Write `02-metrics.md`: the glossary table (id, name, one-line definition,
   direction, owner) + notes on every resolved ambiguity.
6. Walk the user through the glossary and record their sign-off.

## Gate G2 checklist

- [ ] Every requirement's metrics have a contract; no contract half-filled
- [ ] `conflicts_checked: true` on every contract, with the hunt documented
- [ ] Scenario logic (composite scores, assumed targets) explicitly labeled
- [ ] User signed the glossary (recorded in 02-metrics.md)

Then hand back to `/next`.
