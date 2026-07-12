---
name: s7-deliver
description: Lifecycle stage 7 - validation and delivery. Full validation sweep, rendered review, business validation of numbers against the metric contracts, UAT handoff, evidence manifest, and retrospective. Produces 07-delivery.md and closes the project.
---

# s7-deliver

**Question answered:** is it true, usable, and handed over?
Primary agent: `qa-reviewer`.

## Procedure

1. **Technical:** full `validate-project` sweep on the final state.
2. **Rendered review:** the agent cannot see pixels. Prepare a rendered-review
   checklist (per page: chrome intact, fonts fell back acceptably, labels
   unclipped, interactions behave) and either walk the user through it in
   Desktop or record their delegation of it. Findings → review-finding
   contracts.
3. **Business validation:** for each metric contract, verify a rendered
   number against an independent expectation (source query, known total,
   hand calculation). Record metric id → expected vs observed in
   `07-delivery.md`. A number nobody validated is a number nobody should
   trust.
4. **UAT handoff:** if the project language is `nl` and the module is
   enabled, generate the plan via `nl-uat`; otherwise write a concise English
   UAT script from the page-purpose + metric contracts (what to click, what
   to verify, what "pass" means).
5. **Evidence manifest:** fill `contracts/evidence-manifest.contract.yaml` →
   `project/deliverables/evidence-manifest.yaml`; every gate points at real
   evidence; waivers visible.
6. **Delivery notes:** deployment target and steps (the user runs deploys —
   never the agent), refresh configuration, open findings accepted by the
   user.
7. **Retrospective (10 lines max):** what the next project should reuse or
   avoid; improvements to port back to the template repo.
8. Write `07-delivery.md`; record the user's acceptance.

## Gate G7 checklist — definition of done

- [ ] Technical: validators green
- [ ] Semantic: numbers validated against metric contracts
- [ ] Design: hard rules + fidelity review hold on the delivered state
- [ ] Delivery: UAT handed over, evidence manifest complete, user accepted

Then `/next` marks s7 passed — project closed.
