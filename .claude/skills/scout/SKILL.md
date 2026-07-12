---
name: scout
description: Keep the toolkit first-in-class - research any focus subject (e.g. "mobile layouts", "tables", "AI visuals") across the guru/community landscape and latest Power BI releases, shortlist the best ideas, and on the user's pick fold them into the repo as modules, extensions, or doc updates. Run any time, on any subject.
---

# scout

The repo's self-improvement loop: research → shortlist → user decision →
implementation → durable record. This is how the toolkit absorbs what the
Power BI design community and Microsoft ship, without ever copying anyone's
work.

Invoke with a focus subject: `/scout mobile layouts`, `/scout tables`,
`/scout what's new in Power BI this quarter`. No subject → ask for one, or
offer the radar's "assess" ring as candidates.

## Procedure

1. **Mode check.** In the template repo → full run (may implement). In an
   instantiated project (`project/project.yaml` exists) → research +
   proposal only: framework files are read-only at project time (CLAUDE.md);
   deliver a portable proposal the user applies to the template repo.
2. **Recall before research.** Read `research/radar.md` and any
   `research/log/*` entries touching the subject. Prior findings are
   context, not conclusions — techniques move; note what changed since.
3. **Research.** Sources, in order:
   - the community tier of `contracts/source-register.yaml` (targeted
     fetches on the subject);
   - Microsoft's release notes / feature blog for native capabilities that
     may have obsoleted a workaround (a technique the product absorbed
     moves to *hold*);
   - open web search for practitioners not yet in the register — vet them
     (working artifacts and reasoning, not listicles) and propose register
     additions.
   **Hygiene:** consult and cite; never copy text, specs, or assets; check
   the license of any tool before recommending it (the pbir precedent);
   re-derive every technique in the repo's own terms.
4. **Synthesize.** A shortlist (typically 3-7) where each candidate has:
   what it is · which guru/source demonstrates it (links) · what it
   improves in *this* repo · classification — **new module / extension of
   an existing module or skill / core-doc update / hold** (with reason) ·
   an impact÷effort take. Prefer extensions over new modules when an
   existing module owns the territory.
5. **Record.** Write `research/log/<YYYY-MM-DD>-<subject-slug>.md` (see
   `research/README.md` for the entry format) and update the radar rings.
   The record happens **before** the user decides — research is durable
   even when nothing gets built.
6. **Decide & implement.** Present the shortlist; the user picks (never
   auto-adopt). Then implement per repo conventions: module pattern
   (manifest + README + guide + gated skill), or targeted edits to the
   owning module/skill/doc; hygiene sweep (no copied text, no client names,
   no absolute paths); bump `VERSION`; commit; tag when the user wants a
   release. Update the log entry's decision line and the radar.
7. **Credit — non-negotiable** (`.claude/rules/attribution.md`): every
   adopted idea gets a named credit in the implementing file **and** an
   entry in `CREDITS.md`, in the same change — plus the source-register
   addition from step 3. An adoption without its credits is incomplete,
   exactly like a failing validator.

## Quality bar

A scout run is done when: the log entry lets a future run skip re-research;
every claim links to its source; every recommendation names where it lands
in the repo; and anything adopted went through the same validators and
sweeps as the rest of the template. The radar reflects reality — including
*hold* entries with honest reasons, which are as valuable as adoptions.
