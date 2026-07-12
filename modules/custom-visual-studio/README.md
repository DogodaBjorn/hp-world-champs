# custom-visual-studio

Builds `pbiviz` TypeScript custom visuals — for the rare case where the
justification gate passes: a written statement of which analytical intent
native visuals (plus theming, conditional formatting, and the polish moves)
cannot serve.

## Position in the lifecycle

The need surfaces at stage 5 (the report-designer must justify it in the
design handoff); the build runs parallel to stage 6; the packaged visual is
a delivery artifact with its own entry in the BUILD_LOG and the rendered
review.

## Ground rules

- **Native first, always.** A custom visual is a maintenance liability with
  its own update, signing, and tenant-policy story; the justification names
  what it buys and who maintains it.
- Scaffolds are generated on demand by the `pbiviz` CLI —
  **`node_modules/` and `dist/` are never committed** (gitignored
  repo-wide).
- Visual projects live in `project/custom-visuals/<name>/` inside the
  project repo, versioned as source only.
- Data role and formatting-pane design follow the same naming and design
  conventions as the rest of the report; the visual must respect the active
  theme's tokens rather than hardcoding its own palette.

See [pbiviz-scaffold.md](pbiviz-scaffold.md) for the scaffold and
development loop.
