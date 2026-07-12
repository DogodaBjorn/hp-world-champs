# Modules

Optional add-ons that plug into the lifecycle without weighing down projects
that don't need them.

## How a module works

A module is two things:

1. **An asset folder** `modules/<name>/` with a `module.yaml` manifest
   (name, version, description, provides, skills) plus its guides and
   templates.
2. **Prefix-named skills** in `.claude/skills/` (`bk-*`, `cv-*`, `nl-*`)
   whose first step checks the module is enabled and stops politely if not.

Enablement is a list in `project/project.yaml` (set during `/project-init`,
editable any time):

```yaml
modules:
  - nl-deliverables
```

`init_project.py --list-modules` discovers modules by scanning
`modules/*/module.yaml`. No symlinks, no install step — the cost of a
disabled module is a few skill-description lines.

## Shipped modules

| Module | What it adds |
|---|---|
| [brand-kit-studio](brand-kit-studio/) | Interview-driven creation of brand kits (`design/brand-kits/<kit>/`) that compile into themes and hard-rule tokens |
| [custom-visual-studio](custom-visual-studio/) | Scaffold and develop a `pbiviz` TypeScript custom visual when native visuals genuinely can't serve an intent |
| [nl-deliverables](nl-deliverables/) | Dutch client deliverables: UAT/testplan and definitie-pagina content generated from the contracts |
| [icon-studio](icon-studio/) | Custom SVG icons and visual additions: brand-colored icon sets with state variants, chrome graphics, dynamic SVG-in-DAX marks |
| [nav-studio](nav-studio/) | Modern navigation/selection UI: button-slicer patterns (segmented controls, tabs, toggles, clickable KPI cards), nav bars, bookmark panels |
| [deneb-studio](deneb-studio/) | Bespoke declarative visuals via Deneb/Vega-Lite: token-injected specs, the middle rung between native and pbiviz |
| [table-studio](table-studio/) | Premium tables & matrices: typography doctrine, variance columns, in-cell micro-viz, density presets |
| [tooltip-studio](tooltip-studio/) | The hover layer: report-page tooltips — mini-trends, definition/trust tooltips from metric contracts, mini-breakdowns |
| [canvas-studio](canvas-studio/) | Wireframe-first layout and designed SVG page backgrounds in brand tokens |
| [a11y-studio](a11y-studio/) | Accessibility as an auditable gate: scripted WCAG contrast checks, alt text, tab order, consistency |

## Writing a new module

1. Create `modules/<name>/module.yaml` (keep it within the miniyaml subset —
   see `lifecycle/status.schema.yaml`'s header) + README + assets.
2. Add its skills under `.claude/skills/<prefix>-<name>/` with the
   enablement check as step 1.
3. Keep module knowledge in the module: lifecycle skills may *mention* a
   module (as s7 mentions nl-uat) but must degrade gracefully without it.
4. **Credit your sources — non-negotiable** (`.claude/rules/attribution.md`):
   the module README names the practitioners/tools whose work informed it,
   and `CREDITS.md` gets their entry in the same change.

## Future module ideas

Maintained on the living tech radar: see the **assess** ring in
[../research/radar.md](../research/radar.md) (backend-stories,
fabric-deploy, data-profiler, mobile layouts, and whatever the next
`/scout` run surfaces).
