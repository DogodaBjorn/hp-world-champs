# Dependencies

pbi-atelier vendors **no** third-party code or documentation. Everything below is an
external tool you install yourself. Adapter skills check presence and version at use
time and degrade gracefully when a tool is absent.

## Pinned dependencies

| Dependency | Pin | Role | License |
|---|---|---|---|
| Python | ≥ 3.11 | `scripts/` validators, hooks' JSON parsing. Stdlib only — no pip installs required. | PSF |
| `pbir-cli` (PyPI) | `== 0.9.25` | Headless PBIR report authoring, driven via the `pbir-cli` adapter skill. | **Custom Non-Commercial — read below** |
| Microsoft powerbi-authoring plugin | optional; record installed version here when adopted | Alternative agent authoring surface, via the `ms-authoring` adapter skill. | Microsoft terms |
| Node.js + `pbiviz` | ≥ 20 / latest | Only if the `custom-visual-studio` module is enabled. Never commit `node_modules`. | MIT |
| Power BI Desktop | current monthly | Rendered review; the small set of steps that cannot be done headlessly (tracked per-project in BUILD_LOG). | Microsoft terms |

Install `pbir`:

```bash
uv tool install pbir-cli==0.9.25
# or: pip install pbir-cli==0.9.25
pbir --version
```

Update the pin deliberately: bump the version here, re-run a project validation
sweep, and note breaking changes. The `pbir-cli` adapter skill reads this file's pin
and warns on mismatch.

## The pbir license — read before client work

`pbir` (by Kurt Buhler and Maxim Anatsko) ships under a **Custom Non-Commercial
License**. As of the pinned version it states, among other things, that:

- commercial purposes include *"using the Software to provide paid consulting or
  development services"*, and
- creation of derivative works is forbidden without the authors' consent.

Consequences for this repository and its users:

1. **This repo contains zero pbir code or documentation** — only references to the
   tool and our own usage conventions. The repo itself is therefore cleanly
   MIT-licensed and shareable.
2. **If you use `pbir` in paid client work, obtain written permission from its
   authors first** (the license invites commercial licensing inquiries), or work
   without it: the `pbir-authoring` skill documents the direct-JSON-editing
   fallback, which produces identical artifacts.
3. If you fork or share this template, these terms travel with you — point your
   users at this file.

## Version provenance

Projects instantiated from this template record `TEMPLATE_VERSION` in
`project/project.yaml`. When the template evolves, that field tells you which
migration notes apply.
