# pbiviz scaffold & development loop

Guidance for the `cv-custom-visual` skill. Research-first applies double
here: the pbiviz toolchain and API versions move — verify current commands
against Microsoft's custom-visuals documentation before running them.

## Prerequisites (user-installed; see DEPENDENCIES.md)

- Node.js ≥ 20
- `pbiviz` CLI (`npm install -g powerbi-visuals-tools`)
- A certificate for live preview (`pbiviz install-cert`) if using dev mode

## Scaffold

```bash
cd project/custom-visuals
pbiviz new <VisualName>      # generates the TypeScript project
```

The generated tree (`pbiviz.json`, `capabilities.json`, `src/`, …) is
committed **without** `node_modules/` or `dist/` (gitignored). Record the
pbiviz/API versions in the visual's README at scaffold time.

## Design integration

- `capabilities.json` data roles named for the analytical intent they bind
  (measure/category names from the design handoff).
- Colors come in through the formatting pane defaulted to theme slots —
  never hardcoded hex in the render path.
- Formatting pane options follow the same explicit-properties doctrine as
  native visuals: title, background, and data colors settable.

## Development loop

1. `npm install` (local only), `pbiviz start` for live preview in the
   service, or `pbiviz package` for a `.pbiviz` file.
2. Test against the real semantic model early — synthetic data hides
   binding and cardinality issues.
3. Accessibility is in scope: keyboard focus, high-contrast support, and
   textual fallbacks are part of "done", not polish.

## Delivery

- `pbiviz package` output goes to the user for import/tenant registration
  (organizational visuals are an admin action — the agent never uploads).
- BUILD_LOG entries: package version, API version, import steps, and the
  maintenance owner.
