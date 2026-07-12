---
name: ms-authoring
description: Adapter for Microsoft's official Power BI authoring plugin/skills for Claude Code, when installed - detection, division of labor with this repo's lifecycle, and graceful degradation when absent. Optional dependency.
---

# ms-authoring (adapter)

Microsoft ships official agentic authoring skills for Power BI. When the
user has them installed, use them as an *execution surface* — they do not
replace this repo's lifecycle, contracts, or design system.

## Detection

Check whether Microsoft authoring skills are available in the session (they
appear in the available-skills list; also check `DEPENDENCIES.md` for a
recorded installed version). If absent: proceed with `pbir-cli` /
`pbir-authoring` — nothing in the lifecycle depends on the plugin.

## Division of labor

- **This repo decides *what*:** stages, gates, contracts, design handoff,
  naming, hard rules. Method is not delegated.
- **The plugin may execute *how*:** creating/editing report artifacts,
  model operations it supports — treat it like the pbir CLI: discover, act,
  validate.
- Everything it writes is still subject to the repo's validators, naming
  conventions, explicit-properties rule, and the fidelity review.

## Cautions

- Official tooling is a **volatile preview surface** — capabilities move.
  Re-check what the installed version actually does before relying on it;
  record the version and notable behavior in `DEPENDENCIES.md` when adopting.
- If plugin output conflicts with the design contract, the contract wins;
  regenerate or correct rather than accepting drift.
- Never let any plugin publish/deploy; those remain user actions.
