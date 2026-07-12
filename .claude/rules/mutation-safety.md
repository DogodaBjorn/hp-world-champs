# Mutation safety

- **Only the `pbir-operator` agent mutates `project/pbip/`** (TMDL and PBIR
  alike). Every other agent and the main thread treat that tree as read-only.
- Mutations are **small, single-concern diffs**: one measure, one visual, one
  property group per change. Bulk rewrites of generated trees are a last resort
  that requires a written plan first.
- **Validate after every mutation.** Hooks enforce JSON/TMDL checks per file;
  run `pbir validate` (or the `validate-project` sweep) after each coherent batch.
- Preserve identifiers: never regenerate an existing visual/page/table name when
  editing it — downstream bookmarks, filters, and diffs depend on stability.
- Back up before risky operations (`git commit` the working state first; the
  repo history is the undo mechanism).
- Never run deploy/publish commands; those are the user's to run. The
  destructive-command hook enforces this, and working around it is a defect.
