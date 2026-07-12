---
name: theme-from-brand-kit
description: Compile a brand kit (design/brand-kits/<kit>/brand.yaml) or the neutral defaults into a valid Power BI theme.json plus concrete design-hard-rule token values. Use at stage 5, when a brand kit changes, or when the user asks for a report theme.
---

# theme-from-brand-kit

One source of truth, two compiled outputs: the same tokens drive both Power BI
(via `theme.json`) and the agents (via the design hard rules), so design and
build can never drift apart.

## Inputs

- The active kit: `project/project.yaml` → `brand_kit`, resolved to
  `design/brand-kits/<kit>/brand.yaml`. If `none`, use the neutral defaults
  from `.claude/rules/design-hard-rules.md`.
- The stage-5 `design-brief.contract.yaml` (direction-specific overrides win
  over the kit for this project).

## Procedure

1. **Research first — fetch the current report theme `$schema`** (via the
   source register's Microsoft schema entry) and validate every property name
   you emit against it. Theme JSON silently ignores unknown properties;
   silent is the enemy.
2. Build `project/deliverables/theme.json`:
   - `name`, correct `$schema`;
   - `dataColors` from the categorical ramp (accent first);
   - semantic slots: `good`/`neutral`/`bad` and diverging
     `minimum`/`center`/`maximum` from the kit;
   - `background`, `foreground`, `tableAccent`;
   - `textClasses` (title/header/label…) mapping the type scale, using the
     **fallback-safe font stacks** from the kit — design for the fallback;
   - `visualStyles` `*` defaults: surface background, hairline border,
     radius, shadow per kit, title styling, visual header visibility.
3. Validate: `python scripts/validate_json.py project/deliverables/theme.json`
   and re-check emitted properties against the schema.
4. Report which design-hard-rule tokens now have kit values (canvas, surface,
   ink, accent, good/bad, radius, shadow, type scale) so stage-6 checks use
   the kit's numbers, not the neutral defaults. Record the mapping in
   `05-design.md`.

## Rules

- Never emit a property you could not verify against the schema.
- The good/bad pair must keep AA contrast on both canvas and surface.
- One theme per report; visual-level overrides in PBIR are the exception and
  each one needs a reason in the design handoff.
