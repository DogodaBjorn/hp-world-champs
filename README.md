# pbi-atelier

**An agent-driven studio for building premium Power BI reports, start to finish.**

pbi-atelier is a Claude Code repository template for Power BI consultants and BI teams
who want AI agents to do the heavy lifting — without giving up rigor or design quality.
It takes a project through a gated lifecycle:

```
Intake → Requirements → Metric architecture → Model design → Model build
      → Creative direction & design contract → Report build → Validation & delivery
```

Three things make it different from "generate me a dashboard":

1. **Metric architecture is a first-class stage.** Every KPI gets a written contract
   (definition, grain, direction-is-good, edge cases) before a single measure is written.
   Same-name metrics that mean different things get caught here, not in UAT.
2. **Creative direction is a first-class stage.** The agents propose three divergent
   design directions, critique them against a "3-second clarity / 3-minute trust" gate,
   and only then converge on a design contract that the build must honor.
3. **Guidance and enforcement are split.** Skills and rules teach the agents *how to
   reason*; hooks, validators, and scoped permissions make the dangerous mistakes
   *impossible* rather than merely discouraged.

## What's in the box

| Area | Contents |
|---|---|
| `.claude/` | 6 agents, ~24 skills, 7 rules, 4 safety/validation hooks, scoped permissions |
| `lifecycle/` | The 8-stage lifecycle definition and the project state-machine schema |
| `contracts/` | Machine-readable YAML contract templates (intake → evidence manifest) |
| `templates/` | Human deliverable templates (BUILD_LOG, design handoff, data model, DAX) |
| `design/` | The premium-design knowledge core: doctrine, visual selection, page archetypes, naming conventions, brand-kit scaffold |
| `scripts/` | Dependency-free Python validators and a TMDL inventory tool |
| `modules/` | Optional add-ons: brand-kit-studio, custom-visual-studio, nl-deliverables |
| `project/` | The empty working scaffold your actual project lives in |

## Quickstart (5 minutes)

1. **Get the template.** Use this repo as a GitHub template (or clone and re-init) —
   one client project = one private repo. Never build client work inside the template.
2. **Install dependencies.** See [DEPENDENCIES.md](DEPENDENCIES.md). Minimum: Python ≥ 3.11.
   Recommended: the `pbir` CLI for headless report authoring.
3. **Open the repo in Claude Code** and run `/project-init`. It personalizes
   `project/project.yaml`, creates the state machine, and lets you enable modules
   and a brand kit.
4. **Run `/next`.** It reads the project state, reports where you are, and routes to
   the right stage skill. That's the daily driver — you rarely need anything else.
5. **Work the gates.** Each stage produces durable artifacts in
   `project/project-state/active/` and won't advance until its gate criteria are met.

Full setup and a tour of the lifecycle: [GETTING-STARTED.md](GETTING-STARTED.md).

## Design philosophy

- **The durable truth is the repository, not the chat.** Every decision lands in a
  numbered file under `project/project-state/`; sessions can end and resume freely.
- **Declare grain first.** No model object exists before its fact grain is written down.
- **Do not fabricate.** Every model blueprint carries an explicit "metrics NOT available"
  list; scenario logic is labeled as such.
- **Premium-minimal design.** Never default Power BI styling; never chart junk.
  One message per page in 3 seconds, full trust after 3 minutes.
- **One mutator.** Only the `pbir-operator` agent may touch `project/pbip/`,
  and it validates after every change.

## Credits — non-negotiable

This toolkit stands on the shared work of the Power BI design community —
tool builders, practitioners, and authors. **Credit where it is due is a
core principle here, enforced as a rule** (`.claude/rules/attribution.md`):
every adopted idea is credited in the file that carries it and in
[CREDITS.md](CREDITS.md), nothing is ever copied, and forks inherit the
duty. Read CREDITS.md — the people in it are why this repo is any good.

## License

The content of this repository is MIT-licensed — see [LICENSE](LICENSE).
External tools it drives (notably the `pbir` CLI) have their **own licenses,
including non-commercial terms**; read [DEPENDENCIES.md](DEPENDENCIES.md) before
using them in paid work.
