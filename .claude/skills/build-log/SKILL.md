---
name: build-log
description: Create or refresh project/deliverables/BUILD_LOG.md - what was built, assumptions and scenario choices, validation status, and the manual-steps-still-required-in-Desktop checklist. Use continuously during stages 4 and 6, never retroactively from memory.
---

# build-log

The BUILD_LOG is the honest companion to the built artifact: what an agent
built, what it assumed, and what a human must still do. It is maintained
**during** the build — an entry written when the step happens, not
reconstructed at the end.

## Procedure

1. If `project/deliverables/BUILD_LOG.md` doesn't exist, create it from
   `templates/BUILD_LOG.template.md`.
2. On every build session, append/update:
   - **Built:** pages/visuals/measures touched, in handoff terms (ids).
   - **Decisions & assumptions:** anything chosen that the contracts didn't
     dictate, with the reason. Scenario choices get the SCENARIO CHOICE tag.
   - **Manual steps required in Desktop:** every step the headless build
     cannot or should not do (font verification, fragile property surfaces
     per `pbir-authoring`, refresh/credential setup, rendered checks). Each
     entry: what, where (page/visual id), how to verify it's done.
   - **Validation status:** last `validate-project` result.
   - **Known limitations:** honest, user-visible.
3. When a manual step is completed (user confirms), check it off with a date
   — the list must always reflect current reality.

## Quality bar

A reader who has never seen the chat must be able to: open the report, know
exactly what remains to be done by hand, know which numbers rest on which
assumptions, and know when the build was last validated. If the BUILD_LOG
can't deliver that, it's not done.
