# Design doctrine

Principles behind the hard rules (`.claude/rules/design-hard-rules.md`).
The rules are the floor; this is the reasoning that lets you design above it.

## The gate: 3-second clarity, 3-minute trust

Every page must pass both, and they pull in opposite directions — that tension
*is* report design:

- **3-second clarity.** A reader who glances at the page takes away one true
  sentence. Not a topic ("sales stuff") — a message ("sales grew, but only in
  the north"). If you cannot write that sentence, the page has no message yet;
  no amount of styling fixes that.
- **3-minute trust.** A skeptical reader who stays finds everything needed to
  believe the sentence: labeled axes, explicit periods, visible definitions
  (or one obvious click to them), honest baselines, no truncated bars
  pretending to be drama.

## Principles

1. **Hierarchy is the design.** One hero element per page earns its position;
   everything else supports it. If everything is big, nothing is.
2. **Ink serves data.** Every pixel that isn't data must justify itself.
   Declutter before decorating; remove before adding. (Edward Tufte's
   data-ink principle, in our words; the declutter-and-focus discipline
   owes Cole Nussbaumer Knaflic's *Storytelling with Data* — see CREDITS.md.)
3. **Color is meaning, never mood.** The accent marks the story; gray carries
   the context; the good/bad pair keeps one meaning across the whole report —
   and never works alone (pair with sign, arrow, or label).
4. **Words do heavy lifting.** A title that states the insight ("Margin
   recovered after the March price change") outperforms a label ("Margin %").
   Annotate on the chart, not in a legend the eye must shuttle to.
5. **Consistency compounds trust.** Same grid, same type scale, same number
   formats, same period conventions on every page. A reader who learns page 1
   has learned the report.
6. **Restraint reads as premium.** Generous whitespace, a strict palette, few
   typefaces, no effects that don't encode data. What makes a report look
   expensive is what it declines to do.
7. **Honesty is a design feature.** Scenario logic is labeled, proxies carry
   their caveat, missing data says so. A beautiful lie fails the 3-minute test.

## How the pieces fit

- Analytical intent → chart form: `visual-selection.md`
- Page composition patterns: `page-archetypes.md`
- Agent-authorable IDs and structure: `naming-conventions.md`
- Token values: brand kit (`brand-kits/`) compiled by `theme-from-brand-kit`
- Finishing pass: the `dataviz-polish` skill
- Divergence → convergence process: the `design-critique` skill at stage 5
