---
name: cv-custom-visual
description: Scaffold and develop a pbiviz TypeScript custom visual (custom-visual-studio module) - justification gate, scaffold, theme-integrated development, packaging handoff. Use when native visuals genuinely cannot serve a required analytical intent.
---

# cv-custom-visual

**Module gate:** requires `custom-visual-studio` in `project/project.yaml` →
`modules`. If disabled, say so and stop. Also verify prerequisites
(`node --version` ≥ 20, `pbiviz --version`); if missing, point at
DEPENDENCIES.md and stop — never install global tooling yourself.

## Procedure

1. **Justification gate first.** Locate (or elicit and write) the design
   handoff's justification: which analytical intent, why native + theming +
   polish moves cannot serve it, who maintains the visual. No justification,
   no build — offer the native alternative instead.
2. Scaffold per `modules/custom-visual-studio/pbiviz-scaffold.md` into
   `project/custom-visuals/<name>/` (research current pbiviz commands
   first). Confirm `node_modules/`/`dist/` are ignored before the first
   commit.
3. Develop with the design system: data roles named from the handoff,
   colors via formatting-pane options defaulted to theme slots, explicit
   properties settable, accessibility (keyboard, high contrast, text
   fallback) in scope.
4. Test against the real model — bind the actual measures/dimensions the
   handoff names.
5. Package (`pbiviz package`) and hand the `.pbiviz` to the user for
   import/registration; the agent never uploads to a tenant.
6. BUILD_LOG: package + API versions, import steps, maintenance owner,
   known limitations.

## Done when

The packaged visual renders the handoff's intent with theme tokens, the
source (sans generated dirs) is committed, and the BUILD_LOG tells a
stranger how to import and maintain it.
