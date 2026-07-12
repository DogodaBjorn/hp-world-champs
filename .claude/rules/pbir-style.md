---
globs: project/pbip/**/*.json
---

# PBIR style

- **Human-readable IDs.** Visuals and pages get role-prefixed names from
  `design/naming-conventions.md` (`kpi_`, `sl_`, `z_`, `dlt_`, `c_`, …) — never
  Desktop-style hash IDs. Diffs must read like a sentence.
- **A visual missing its required explicit properties is not approved.** Title
  (or a deliberate, recorded decision to hide it), background, border/shadow per
  the design contract, and data colors are set explicitly — never left to
  whatever Desktop defaults to.
- Write JSON as **UTF-8 without BOM**. Mangled en-dashes and currency symbols in
  titles are an encoding bug, not a cosmetic issue.
- Respect the active theme: colors come from the theme or from documented
  semantic-color measures, never ad-hoc hex values sprinkled into visuals.
- Validate after every mutation (hooks enforce JSON well-formedness; run the
  fuller `validate-project` sweep at stage gates).
