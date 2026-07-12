---
globs: project/pbip/**
---

# Star schema doctrine

- **Declare grain first.** A fact table's grain is written in the model blueprint
  (`project-state/active/03-model-blueprint.md`) before the table exists. One row
  means one *what*? If you cannot finish that sentence, stop.
- Facts are thin (keys + measures' raw ingredients); dimensions are wide
  (descriptive attributes). Attributes never live on facts.
- One relationship path between any fact and dimension; no bidirectional filters
  without a written justification in the blueprint.
- No snowflaking without a written justification. Flatten by default.
- Every model has a marked **Date dimension** (contiguous, flagged business
  periods) related to every date-keyed fact.
- Measures live in a dedicated measure table (see the `tmdl-patterns` skill),
  never scattered across facts.
- Anything the sources cannot support goes on the blueprint's
  **"metrics NOT available — do not fabricate"** list. Never approximate silently.
