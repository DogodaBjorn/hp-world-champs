---
name: s1-requirements
description: Lifecycle stage 1 - requirements analysis. Map audiences to the decisions they take, derive the questions the report must answer, and chart the data landscape. Produces 01-requirements.md and the requirements contract.
---

# s1-requirements

**Question answered:** who decides what, using which questions, on which data?
Primary agent: `requirements-analyst`.

## Procedure

1. **Audiences first, decisions second, questions third.** For each audience:
   which decisions do they take with this report, at what cadence? A report
   requirement that traces to no decision is decoration — challenge it.
2. Derive requirements as *business questions*, phrased the way the audience
   would ask them. Record history depth, freshness/latency, and priority
   (must/should/could) per requirement.
3. Chart the data landscape: systems, owners, finest available grain, known
   quality issues. Where samples are available, put extracts in
   `project/data-samples/` (gitignored) and note what was examined.
4. **Requirement vs. design discipline:** capture *what* is needed. If the
   requester says "I want a gauge", record the underlying question and park
   the visual preference in the stage file's notes for stage 5.
5. Fill `requirements.contract.yaml` (copied into `project-state/active/`);
   write `01-requirements.md` with narrative, risks, and `## Open questions`
   (mark each `blocking: true/false`).
6. Review open questions from stage 0: resolve, or escalate the blocking ones
   to the user now.

## Gate G1 checklist

- [ ] Every requirement references a real audience and a decision
- [ ] Data landscape covers every system a requirement depends on
- [ ] No open question marked blocking remains unanswered
- [ ] Priorities agreed with the user

Then hand back to `/next`.
