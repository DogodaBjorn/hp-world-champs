---
name: s0-intake
description: Lifecycle stage 0 - classify the incoming request, identify sources and constraints, scope the knowledge sources, and get the user's written confirmation. Produces 00-intake.md and a filled intake contract.
---

# s0-intake

**Question answered:** what is actually being asked, and is it feasible here?
Primary agent: `requirements-analyst`.

## Procedure

1. Capture the request **in the requester's own words** — quote, don't
   paraphrase. Paraphrasing at intake is how scope drifts before work begins.
2. Classify: `new-build` | `redesign` | `model-extension` | `analysis-only`.
   If redesign/extension: locate the existing PBIP/model now and note where it
   lives; stage 3 will need a read-only audit of it.
3. Copy `contracts/intake.contract.yaml` into
   `project/project-state/active/` and fill it: sources (with access and known
   issues), constraints, delivery target, deadline, explicit out-of-scope list.
4. Scope knowledge sources: note in the contract which
   `contracts/source-register.yaml` entries apply, and add project-specific
   sources under `project_additions`.
5. Write `project/project-state/active/00-intake.md`: the classified request,
   feasibility notes, risks, and an `## Open questions` section.
6. Present the classification and scope to the user for confirmation; record
   their confirmation in the contract (`gate_g0.user_confirmed: true` + note).

## Gate G0 checklist

- [ ] Request quoted verbatim and classified
- [ ] Sources, constraints, out-of-scope, delivery target filled in
- [ ] Open questions listed (they don't block G0 — they block G1 if unresolved)
- [ ] User confirmed classification and scope, confirmation recorded

Then hand back to `/next` to close the gate in `status.yaml`.
