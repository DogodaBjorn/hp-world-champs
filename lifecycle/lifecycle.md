# The pbi-atelier lifecycle

Eight gated stages take a request from first contact to a delivered report.
Machine state lives in `project/project-state/status.yaml`
(schema: [status.schema.yaml](status.schema.yaml)); human truth lives in the
numbered files under `project/project-state/active/`. The `/next` skill routes;
stage skills (`/s0-intake` … `/s7-deliver`) execute.

Two stages exist precisely because skipping them is where quality dies:
**metric architecture** (stage 2 — definitions before DAX) and **creative
direction** (stage 5 — divergence before convergence). Do not fold them into
their neighbors.

---

## Stage 0 — Intake

**Question answered:** what is actually being asked, and is it feasible here?

- Classify the request: new build / redesign of an existing report / extension
  of an existing model / analysis only.
- Identify sources, stakeholders, deadline, delivery target (Desktop file,
  workspace, embedded).
- Scope which knowledge sources apply (see `contracts/source-register.yaml`).

**Outputs:** `active/00-intake.md` + a filled `contracts/intake.contract.yaml`.
**Gate G0:** the user confirms the classification and scope in writing (recorded
in the intake file).

## Stage 1 — Requirements analysis

**Question answered:** who decides what, using which questions, on which data?

- Audiences and the *decisions* they take; the questions each decision needs
  answered; frequency and latency expectations.
- Data landscape: systems, owners, access, known quality issues.
- Requirement vs. design: capture *what* is needed; resist specifying visuals here.

**Outputs:** `active/01-requirements.md` + `requirements.contract.yaml`.
**Gate G1:** every requirement traces to an audience decision; open questions are
listed and none of them blocks stage 2.

## Stage 2 — Metric architecture

**Question answered:** what does every number mean, exactly?

- One `metric.contract.yaml` per KPI: definition, formula in words, grain,
  filters/exclusions, direction-is-good, targets, owner, edge cases.
- Hunt ambiguity: same-name metrics that differ, different-name metrics that
  collide, silent unit mismatches.

**Outputs:** `active/02-metrics.md` (the glossary) + metric contracts.
**Gate G2:** the definition-steward review finds no unresolved ambiguity, and the
user signs the glossary.

## Stage 3 — Model design

**Question answered:** what star schema serves those metrics, at which grains?

- **Declare grain first** for every fact. Then dimensions, relationships,
  the Date dimension, and the measure-table plan.
- Map every stage-2 metric to a concrete table/column path.
- Write the **"metrics NOT available — do not fabricate"** list for anything the
  sources cannot support.

**Outputs:** `active/03-model-blueprint.md` + `model-blueprint.contract.yaml`.
**Gate G3:** every metric maps to a path or is on the not-available list; the
star-schema rule is satisfied; the user accepts the blueprint.

## Stage 4 — Model build

**Question answered:** does the model on disk match the blueprint?

- `pbir-operator` authors TMDL under `project/pbip/` per the `tmdl-patterns`
  skill: parameterized sources, marked Date dimension, measure table with
  docstrings and display folders.
- Run `python scripts/tmdl_inventory.py` and diff against the blueprint.

**Outputs:** TMDL semantic model; `active/04-model-build.md` (decisions,
deviations, inventory summary).
**Gate G4:** `validate_tmdl` passes (strict); inventory-vs-blueprint diff is
empty or every difference is explained and accepted.

## Stage 5 — Creative direction & design contract

**Question answered:** what should this report *be*, and exactly how will it look?

- Report story first: pages as a narrative, one purpose per page
  (`page-purpose.contract.yaml` each).
- **Three divergent creative directions** (different metaphor/mood/layout, not
  three shades of one idea), critiqued against `design/design-doctrine.md`;
  the user picks one (recorded in `creative-direction.contract.yaml`).
- Compile the winner into the **design handoff quartet** in
  `project/deliverables/`: `design-handoff.md` (per page: layout grid, every
  visual with intent + exact PBIR property expectations), `data-model.md`,
  `measures.dax`, `theme.json`.

**Outputs:** `active/05-design.md`, page-purpose contracts, the quartet.
**Gate G5:** each page's 3-second message and 3-minute trust path are written
down and defensible; the user chose a direction; the quartet is complete.

## Stage 6 — Report build

**Question answered:** does the built report honor the design contract?

- `pbir-operator` authors PBIR per the quartet, using the `pbir-cli` adapter
  where available, naming per `design/naming-conventions.md`.
- Apply the `dataviz-polish` moves specified in the contract.
- Maintain `project/deliverables/BUILD_LOG.md`: what was built, assumptions,
  and the **manual-steps-still-required-in-Desktop** checklist.

**Outputs:** PBIR report; BUILD_LOG.md; `active/06-build.md`.
**Gate G6:** all validators pass; naming and required explicit properties
verified; qa-reviewer's fidelity review finds no unapproved deviation from the
design contract.

## Stage 7 — Validation & delivery

**Question answered:** is it true, usable, and handed over?

- Full `validate-project` sweep; rendered review in Desktop (or a documented
  handoff asking the user to perform it); business validation of numbers
  against the metric contracts.
- Delivery notes, UAT/test plan (via the `nl-deliverables` module when the
  project language is Dutch), and a short retrospective.

**Outputs:** `active/07-delivery.md`; `evidence-manifest.yaml` referencing every
gate's evidence; UAT plan in `project/deliverables/`.
**Gate G7:** definition of done holds on all four dimensions — technical
(validators green), semantic (numbers match contracts), design (hard rules +
contract fidelity), delivery (user acceptance recorded).

---

## Gate mechanics

- A gate is `passed` only when its criteria hold **and** the evidence file
  exists; `status.yaml` records both.
- The user may `waive` a gate; the waiver reason is recorded. Waived is not
  passed — the evidence manifest shows it.
- Going **back** a stage is normal (a stage-5 insight may reopen stage 3);
  record the reason, set `current_stage` back, and mark the reopened stage
  `in_progress`. Never edit history to hide the loop.
