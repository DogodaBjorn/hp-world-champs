# Getting started with pbi-atelier

This guide takes you from a fresh copy of the template to a running project.

## 1. Prerequisites

| Tool | Required? | Why |
|---|---|---|
| [Claude Code](https://claude.com/claude-code) | Yes | The agent runtime everything here is built for |
| Python ≥ 3.11 on PATH | Yes | Validators, hooks, inventory scripts (stdlib only — no pip installs) |
| Git (incl. Git Bash on Windows) | Yes | Version control; hooks run under bash |
| `pbir` CLI (PyPI `pbir-cli`) | Recommended | Headless PBIR report authoring — see [DEPENDENCIES.md](DEPENDENCIES.md), **including its license terms** |
| Power BI Desktop | Recommended | Rendered review, and the few steps agents cannot do headlessly |
| Node.js ≥ 20 + `pbiviz` | Only for the custom-visual-studio module | Custom visual scaffolding |

Everything degrades gracefully: without `pbir`, agents edit PBIR JSON directly
(slower, same result); without Desktop, rendered review becomes a manual handoff step.

## 2. Instantiate a project

One client project = one repository. The template stays clean and publishable;
client work never shares git history with anything else.

**Via GitHub:** click *Use this template* → create a private repo → clone it.

**Locally:**

```bash
git clone --depth 1 <template-url-or-path> my-client-project
cd my-client-project
rm -rf .git && git init
```

Then open the folder in Claude Code and run:

```
/project-init
```

The skill will:

1. Ask for a project name, a client alias (never put real client names in anything
   you might make public), and the working language (`en` or `nl`).
2. Fill in `project/project.yaml`, including `TEMPLATE_VERSION` for provenance.
3. Create `project/project-state/status.yaml` at stage 0 (Intake).
4. Offer discovered modules (`modules/*/module.yaml`) for enabling.
5. Optionally activate a brand kit from `design/brand-kits/`.

## 3. The lifecycle

The full definition lives in [lifecycle/lifecycle.md](lifecycle/lifecycle.md).
The short version — eight stages, each with required outputs and a gate:

| # | Stage | You get | Gate |
|---|---|---|---|
| 0 | Intake | Classified request, scoped sources | You confirm scope |
| 1 | Requirements | Audiences, decisions, data landscape | Every requirement traces to a decision |
| 2 | Metric architecture | A KPI glossary with one contract per metric | No ambiguity; you sign the glossary |
| 3 | Model design | Grain-first star-schema blueprint + "not available" list | Every metric maps to a data path |
| 4 | Model build | TMDL semantic model in `project/pbip/` | Validators pass; inventory matches blueprint |
| 5 | Creative direction | 3 design directions → 1 chosen → design contract (handoff quartet) | Critique gate; you pick the direction |
| 6 | Report build | PBIR report + BUILD_LOG with manual-Desktop-steps checklist | Validators, naming, fidelity vs. contract |
| 7 | Validation & delivery | UAT plan, delivery notes, retrospective | Definition of done, all four dimensions |

Drive it with one command:

```
/next
```

`/next` reads `project/project-state/status.yaml`, tells you which stage you are in
and what the gate still needs, then routes into the right stage skill (`/s0-intake`
through `/s7-deliver`). You can invoke a stage skill directly, but `/next` prevents
running stages out of order.

## 4. Where things land

```
project/
├── project.yaml            # Identity, language, enabled modules, brand kit
├── project-state/
│   ├── status.yaml         # Machine-readable state: stage, gates, evidence paths
│   └── active/             # 00-intake.md … 07-delivery.md — the durable truth
├── pbip/                   # The Power BI project (TMDL + PBIR) — pbir-operator only
├── data-samples/           # Sample extracts for analysis (gitignored)
└── deliverables/           # Design handoff quartet, BUILD_LOG, UAT plans
```

## 5. Safety model

- `.claude/settings.json` scopes write access to `project/**` and denies edits to
  hooks, settings, and dependency pins.
- `block-destructive.sh` refuses `rm -rf`, force pushes, and deploy commands.
- Every write to `project/pbip/` triggers JSON/TMDL validation hooks; a broken file
  is surfaced immediately, not at review time.
- A session-start hook warns when the project state is missing or inconsistent.

## 6. Modules

Enable modules in `project/project.yaml` (or during `/project-init`):

- **brand-kit-studio** — interview-driven creation of a brand kit that compiles into
  a Power BI theme and concrete design hard-rules.
- **custom-visual-studio** — scaffold and develop a `pbiviz` TypeScript custom visual.
- **nl-deliverables** — Dutch deliverables: UAT/testplan and definitie-pagina content
  generated from the metric contracts.

A module's skills check the enablement flag and refuse politely when the module is off.

## 7. Keeping the template healthy

If you improve skills or rules while on a client project, port the change back to
your template repo — that's the whole point of the template. Run the repo self-check
before tagging a new template version:

```bash
python scripts/validate_json.py
python scripts/check_state.py --self-test
```
