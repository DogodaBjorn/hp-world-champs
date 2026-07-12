# deneb-studio

Bespoke visuals through [Deneb](https://deneb.guide/) — a certified Power BI
custom visual (by Daniel Marsh-Patrick) that renders declarative
**Vega-Lite** JSON. It occupies the middle rung of the visual ladder:

```
native visuals + theming + polish     <- always first
        ↓ (intent can't be served)
Deneb / Vega-Lite spec                <- this module
        ↓ (needs interactivity/API Vega-Lite can't express)
pbiviz TypeScript visual              <- custom-visual-studio
```

## Why this rung matters

- **Specs are JSON** — reviewable diffs, versioned in the repo, and a natural
  fit for agent authoring under the repo's validate-everything discipline.
- **No toolchain**: no Node, no build, no tenant registration; the user
  installs one certified visual.
- **Nearly any chart form**: bespoke marks, layered composition, fine-grained
  encoding control that native visuals don't expose.

## The decision gate

Deneb still costs more than native (a per-report visual dependency, spec
maintenance, its own learning curve). The gate mirrors the custom-visual
policy in `design/visual-selection.md`: a written justification naming the
**contracted analytical intent** that native + theming + polish moves cannot
serve. No justification, no spec.

## Ecosystem (consult and cite — never copy)

- [deneb.guide](https://deneb.guide/) — official docs and community resources
- Davide Bacci's showcase and Kerry Kolosko's templates — proof of what the
  rung can do; study the *approach*, re-derive specs in this repo's own
  conventions with brand-kit tokens.

## Flow

Enable `deneb-studio` in `project/project.yaml` → the `dn-deneb` skill
handles justification, spec authoring per [deneb-guide.md](deneb-guide.md),
validation, and the BUILD_LOG handoff (pasting a spec into the Deneb editor
is a Desktop-manual step).
