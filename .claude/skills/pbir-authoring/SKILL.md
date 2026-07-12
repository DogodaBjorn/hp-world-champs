---
name: pbir-authoring
description: PBIR (enhanced report format) authoring knowledge - file anatomy, schema discipline, encoding gotchas, required explicit properties, and the direct-JSON fallback when the pbir CLI is unavailable. Use when creating or editing report JSON under project/pbip/.
---

# pbir-authoring

How to hand-author PBIR safely. Prefer the `pbir-cli` adapter when the tool
is installed; this skill is the knowledge layer and the fallback path.

## Anatomy (verify, don't memorize)

A PBIR report folder holds `definition.pbir`, `report.json`, `pages/` (one
folder per page: `page.json` + `visuals/<id>/visual.json`), a pages registry,
and `StaticResources/` (registered theme files). **Research first:** the
format evolves monthly — before creating a file type for the first time in a
project, read a sibling file's `$schema` and follow *that* version. Never
copy a structure from memory.

## Schema discipline

- Every JSON file declares `$schema`; keep it and validate your properties
  against it. Unknown properties don't error — they silently do nothing,
  which is worse.
- IDs: pages and visuals get contracted names per
  `design/naming-conventions.md` at creation time. Never rename on edit.
- Visual `z`-order and position are explicit numbers on the 8px grid from
  the design handoff.

## Encoding

Write all PBIR JSON as **UTF-8 without BOM**. When piping JSON through
shells on Windows, beware codepage mangling of `€`, `–`, accented letters:
write files with an explicit encoding (Python `encoding="utf-8"`, or the
Write tool) instead of `echo`-style redirection.

## Required explicit properties (the "not approved" list)

Per the `pbir-style` rule, every visual sets explicitly: title (text or
measure-bound via the title's field-value expression, or a recorded decision
to hide), background, border/shadow per the design contract, and data colors
(theme slots or a bound semantic-color measure). Conditional formatting via
measure returning hex is the sanctioned way to color by meaning.

## Fragile territory — prefer Desktop

Some surfaces are riskier to hand-author (fine-grained table cell elements,
some analytics-pane reference lines, visual-specific niches). When the
handoff needs one and the CLI can't do it: implement what is safe, and put
the rest on the BUILD_LOG's **manual-Desktop-steps checklist** — a smaller
honest build beats a broken clever one.

## Verification loop

Hooks JSON-validate every touched file. After each page:
`pbir validate` (if available) or `python scripts/validate_json.py` +
a structural read-back of the page (ids present, bindings resolve against
the model inventory).
