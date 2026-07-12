---
name: next
description: The daily driver - read the project state machine, report where the project stands and what the current gate still needs, then route into the correct stage skill (s0-intake through s7-deliver). Use whenever the user says "next", "continue", "where are we", or wants to advance the lifecycle.
---

# next

The single entry point for lifecycle work. Prevents stages from running out of
order and makes gate status visible before anything happens.

## Procedure

1. Run `python scripts/check_state.py`. If it reports problems, fix the state
   first (usually: reconcile `status.yaml` with what actually exists on disk;
   `/project-init` repairs missing files). Never work on top of a broken state.
2. Read `project/project-state/status.yaml` and the current stage's numbered
   file in `project-state/active/` (if it exists).
3. Report to the user, briefly:
   - current stage and its gate criteria (from `lifecycle/lifecycle.md`);
   - what evidence already exists, what is still missing;
   - any `## Open questions` recorded in the stage file.
4. Route:
   - If the current stage's gate is **not yet passed** → invoke that stage's
     skill (`s0-intake` … `s7-deliver`) and continue the work.
   - If the gate **is passed** → update `status.yaml` (stage → `passed`,
     evidence path, date; bump `current_stage`; next stage → `in_progress`),
     then invoke the next stage's skill.
   - If the user asks to **skip** a gate → that is a waiver: record
     `status: waived` with their reason in `gate_note`. Never silently skip.
5. Going backward is allowed and normal: set `current_stage` back, mark the
   reopened stage `in_progress`, and note the reason in its stage file.

## Never

- Advance `current_stage` without updating the stage's evidence.
- Run a later stage's work while an earlier gate is open, unless the user
  explicitly waives it.
