---
name: s6-report-build
description: Lifecycle stage 6 - report build. The pbir-operator authors PBIR exactly per the design handoff quartet, applies the specified polish moves, maintains the BUILD_LOG, and passes the fidelity review. Produces the report under project/pbip/ and 06-build.md.
---

# s6-report-build

**Question answered:** does the built report honor the design contract?
Primary agent: `pbir-operator`; `qa-reviewer` + `design-critique` close the gate.

## Procedure

1. Re-read the quartet (`design-handoff.md`, `data-model.md`, `measures.dax`,
   `theme.json`). The handoff is the specification — a build idea that isn't
   in it goes back to stage 5, not into the report.
2. Implement `measures.dax` into the model's `_Measures` table first (display
   measures: insight titles, semantic colors), per `tmdl-patterns`. Names
   byte-identical to the handoff.
3. Register and apply `theme.json`, then build page chrome (`z_*`) once and
   replicate it — chrome drift across pages is the most common fidelity
   finding.
4. Build page by page from the handoff tables: create each visual with its
   contracted id (`design/naming-conventions.md`), bind its data, set its
   **explicit properties** (a visual missing them is not approved), and apply
   its listed polish moves (`dataviz-polish`).
   - Prefer the `pbir-cli` adapter for creation, formatting, conditional
     formatting, and validation; fall back to direct JSON per `pbir-authoring`.
   - Small diffs; hooks validate every touched file.
5. Maintain `project/deliverables/BUILD_LOG.md` (via the `build-log` skill)
   **as you go**: decisions, assumptions, and every step that must be finished
   in Desktop — never at the end from memory.
6. After the last page: full `validate-project` sweep, then the
   `design-critique` **fidelity review** against the handoff and the fidelity
   checklist. Deviations become review findings: fix or get user acceptance.
7. Write `06-build.md`: build summary, findings and their resolutions,
   inventory of pages/visuals.

## Gate G6 checklist

- [ ] `validate-project` green (JSON, TMDL strict, naming, state)
- [ ] Every visual matches its handoff row (id, data, properties, polish)
- [ ] Fidelity review clean or every deviation user-accepted
- [ ] BUILD_LOG current, including the manual-Desktop-steps checklist

Then hand back to `/next`.
