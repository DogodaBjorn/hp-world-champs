---
name: bk-brand-kit
description: Create or refine a brand kit by structured interview (brand-kit-studio module) - translate brand materials into design roles, validate contrast and fallbacks, write design/brand-kits/<kit>/brand.yaml. Use when the user wants a brand kit, house style, or client theme foundation.
---

# bk-brand-kit

**Module gate:** requires `brand-kit-studio` in `project/project.yaml` →
`modules` (in the template repo, outside a project, proceed — kits are
template assets). If disabled, say so and stop; `/project-init` or a one-line
edit enables it.

## Procedure

1. Collect materials: style guide, website URL, logo files, an existing
   report or deck if one exists. Read them before asking anything.
2. Interview per `modules/brand-kit-studio/interview-guide.md` — roles, not
   favorites. Confirm what materials imply; ask only what they don't answer.
3. Copy `design/brand-kits/_template/` to `design/brand-kits/<kit>/`
   (kebab-case kit name, client alias not real name in shareable repos) and
   fill `brand.yaml` completely — no `<placeholders>` left.
4. Place assets (logo) in the kit's `assets/`; record usage constraints.
5. **Validate before declaring done:**
   - AA contrast: ink/canvas, ink/surface, accent/both, good/both, bad/both
     (compute contrast ratios; don't eyeball);
   - good vs bad distinct under color-blind simulation (avoid pure
     red/green pairs; check hue + lightness separation);
   - categorical ramp: ≤6, mutually distinguishable, accent first;
   - every font family has a realistic Power BI-safe fallback.
   Record failed-and-accepted checks as comments in the kit.
6. Offer activation: set `brand_kit: <kit>` in `project/project.yaml`; if a
   project is past stage 5, note that `theme-from-brand-kit` must be re-run
   and the theme re-applied.

## Done when

`brand.yaml` is complete and validated, assets are in place, and the user
knows how the kit flows into theme.json via `theme-from-brand-kit`.
