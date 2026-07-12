---
name: pbir-cli
description: Adapter for the external pbir CLI (PyPI pbir-cli) - presence/version check, usage conventions, safety wrapper, and the fallback path when absent. Use whenever driving the pbir tool to browse, create, modify, or validate PBIR reports.
---

# pbir-cli (adapter)

Thin adapter around the external `pbir` CLI by Kurt Buhler & Maxim Anatsko.
**This repo vendors none of its code or docs** — for command reference, run
`pbir --help` / `pbir <command> --help` and read the tool's own documentation.

## Before first use in a session

1. `pbir --version` — if absent, say so and fall back to direct JSON editing
   per `pbir-authoring` (identical artifacts, more care needed).
2. Compare against the pin in `DEPENDENCIES.md` (`pbir-cli == 0.9.25`);
   warn on mismatch — flags may have changed, re-check `--help` before use.
3. **License gate:** the tool's license restricts commercial use (paid
   consulting counts) and this is the user's responsibility — if the project
   is client work and DEPENDENCIES.md's guidance hasn't been addressed,
   remind the user once and record their go-ahead in the stage file.

## Usage conventions (ours, not the tool's)

- Discover, then act: browse/inspect commands before any mutating command;
  never guess a path or property name the tool can list for you.
- One concern per invocation; validate after each batch (`pbir validate` or
  the repo validators) — the PostToolUse hooks only see files *we* write, so
  CLI-driven edits must be followed by an explicit validation run.
- Conditional formatting and measure-bound titles: prefer the CLI's dedicated
  commands over hand-writing the JSON blocks — fewer schema traps.
- Never use the CLI's publish/deploy/remote surface; deploys are the user's
  (the safety hook also blocks `pbir publish`).
- Anything the CLI writes still falls under `pbir-style` naming and
  explicit-properties rules — the tool executes, the contract governs.

## Failure handling

On CLI errors: read the message, re-check `--help` for the actual flag
surface, retry once corrected. If the tool can't express what the handoff
needs, do that piece per `pbir-authoring` and note it in the BUILD_LOG.
