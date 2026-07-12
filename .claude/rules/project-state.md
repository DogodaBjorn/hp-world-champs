# Project state

- **The durable truth is the repository, not the chat.** Any decision, finding, or
  open question that matters tomorrow is written to
  `project/project-state/active/` in the stage's numbered file — in the same turn
  it is made, not "later".
- `project/project-state/status.yaml` is the single source of stage/gate truth.
  Update it at every gate transition with the evidence file path. **Never advance
  a stage silently**, never skip a gate because the work "obviously" passes.
- A gate may be **waived** only by the user, and the waiver is recorded in
  status.yaml with a reason.
- On session start, read status.yaml before doing anything else; if reality on
  disk contradicts it (artifacts missing, stage impossible), reconcile the state
  file first.
- Open questions live in the stage file under an `## Open questions` heading —
  not in your head, not only in the chat.
