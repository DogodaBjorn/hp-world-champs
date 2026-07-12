---
name: project-init
description: Instantiate a pbi-atelier project from the template - personalize project.yaml, create the state machine at stage 0, enable modules, activate a brand kit. Use when starting a new project or repairing a missing/broken project state.
---

# project-init

Turns a fresh copy of the template into a working project. Idempotent repair:
if state files are broken, re-running with `--force` rebuilds them.

## Procedure

1. **Confirm this is a project copy, not the template repo itself.** If the
   working directory is the canonical template (e.g. it has a git remote you
   recognize as the template), stop and tell the user to instantiate a copy
   first (see GETTING-STARTED.md).
2. Gather from the user (ask only what they haven't given):
   - project name (kebab-case), client alias (**never a real client name if
     the repo could be shared**), language (`en`/`nl`).
   - modules to enable: run `python scripts/init_project.py --list-modules`
     and present the list with one-line descriptions.
   - brand kit: run `python scripts/init_project.py --list-brand-kits`; offer
     `none` (neutral defaults) or an existing kit; mention that the
     brand-kit-studio module can create one later.
3. Run the deterministic initializer:
   `python scripts/init_project.py --name <name> --client-alias <alias>
   --language <en|nl> --modules <a,b> --brand-kit <kit|none>`
   (add `--force` only when the user asked for a repair/overwrite).
4. Verify: `python scripts/check_state.py` must report state OK at stage 0.
5. If this copy still carries the template's git history, remind the user to
   re-init git for client work.

## Done when

- `project/project.yaml` and `project/project-state/status.yaml` exist and
  `check_state.py` passes.
- The user knows the next command is `/next`.
