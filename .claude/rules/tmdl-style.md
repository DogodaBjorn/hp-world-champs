---
globs: "**/*.tmdl"
---

# TMDL style

- **Tabs for indentation, never spaces.** TMDL is whitespace-sensitive; a single
  space-indented line corrupts the object tree.
- Every measure carries a `///` docstring (one line: business meaning, not the
  formula restated) and a `displayFolder` from the numbered taxonomy defined in
  the `tmdl-patterns` skill.
- `formatString` is explicit on every measure — no defaults.
- Tables are organized with `queryGroup` folders (facts vs. dimensions).
- **No machine-specific or absolute data-source paths.** Sources go through shared
  expressions / parameters so the model opens on any machine. A hard-coded
  `C:\Users\...` path is a validation failure, not a style nit.
- One object per edit where practical: small diffs review better and fail smaller.
