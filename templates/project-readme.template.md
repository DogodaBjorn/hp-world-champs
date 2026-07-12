# <project name>

<!-- README for an instantiated client project. Replace the template README
with this after /project-init. -->

Power BI report project built with [pbi-atelier](<template repo url>)
(template version <x.y.z>). Client alias: `<alias>` · Language: `<en|nl>`.

## Status

See `project/project-state/status.yaml` — currently stage <n> (<stage name>).
Run `/next` in Claude Code to continue.

## What's here

| Path | Content |
|---|---|
| `project/project-state/active/` | The numbered decision record (00-intake … 07-delivery) |
| `project/pbip/` | The Power BI project (semantic model + report) |
| `project/deliverables/` | Design handoff quartet, BUILD_LOG, UAT plan, evidence manifest |
| everything else | The pbi-atelier framework (read-only reference at project time) |

## Working on this project

1. Open in Claude Code; the session-start hook reports the state.
2. `/next` routes to the current stage. Gates are closed only with evidence.
3. Data samples go in `project/data-samples/` (gitignored — never commit
   client data).
4. Deploys/publishes are run by a human, never by the agent.

## Dependencies

See `DEPENDENCIES.md` — note the pbir CLI's non-commercial license terms
before using it in paid work.
