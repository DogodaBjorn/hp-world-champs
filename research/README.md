# research/

The repo's institutional memory for staying first-in-class. Fed by the
`/scout` skill; read by every future scout run before it searches the web.

| File | What it is |
|---|---|
| [radar.md](radar.md) | The living tech radar: every technique/tool the repo has assessed, in four rings |
| `log/` | One dated brief per scout run: subject, sources, findings, shortlist, decision |

## The rings

- **adopted** — implemented in the repo (names the module/skill/doc that owns it)
- **trial** — implemented but unproven on a real project; first project use decides
- **assess** — looks promising, not yet built; a natural `/scout` subject
- **hold** — considered and deliberately not adopted, with the reason (as
  valuable as an adoption — it stops re-litigating)

Ring moves happen through scout runs or project retrospectives (stage 7),
never silently.

## Log entry format

`log/<YYYY-MM-DD>-<subject-slug>.md`:

```markdown
# Scout: <subject> — <date>

**Trigger:** <what prompted the run>
**Sources consulted:** <links — everything cited, nothing copied>

## Findings
<what the landscape offers on this subject, in this repo's terms>

## Shortlist
| Candidate | Source(s) | Improves | Classification | Impact/effort |
|---|---|---|---|---|

## Decision
<what the user picked, when, and what was implemented (or "not built — reason")>
```

## Rules

- Research is recorded even when nothing is built — the decision line says
  why not.
- Consult and cite; never copy text/specs/assets; check tool licenses
  before recommending (see DEPENDENCIES.md for the precedent).
- Community sources live in the community tier of
  `contracts/source-register.yaml`; scout runs propose additions there.
- **Credit is non-negotiable** (`.claude/rules/attribution.md`): anything
  adopted lands with a named credit in its implementing file and in
  `CREDITS.md`, in the same change. Log entries name every source
  consulted, adopted or not.
