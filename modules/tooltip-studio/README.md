# tooltip-studio

The hover layer: custom report-page tooltips that reward curiosity without
cluttering the canvas. This is progressive disclosure made concrete
(`dataviz-polish` move 8) — the page stays clean, depth appears on demand.

The craft here owes much to Reid Havens' tooltip work and Microsoft's
report-page-tooltip guidance (consulted as references; patterns re-derived
in this repo's conventions).

## Doctrine

1. **Nothing important lives *only* in a tooltip.** A hover is an
   invitation, not a requirement — the 3-second message and every gate-level
   fact render without touching anything. Tooltips deepen; they never carry.
2. **Tooltips are non-interactive.** No slicers, no buttons, no scrolling —
   the reader can't click inside one. Everything visible at once, sized for
   the smallest content it must show.
3. **One tooltip page, many visuals.** Tooltip pages are reusable: a
   mini-trend tooltip serves every visual that shares its grain. Design the
   few that earn their place; don't hand-craft one per visual.
4. **The trust tooltip is the signature.** A definition tooltip generated
   from the metric contracts puts the 3-minute-trust path one hover away —
   definition, period convention, freshness — everywhere the metric appears.
5. **Styled like the report.** Tooltip pages use the same theme, tokens, and
   type scale; a default-styled tooltip on a designed report breaks the
   spell exactly when the reader leans in.

## Flow

Enable `tooltip-studio` in `project/project.yaml` → the `tt-tooltips` skill
picks patterns per visual at stage 5 (mapped in the design handoff), builds
the `tt-` pages at stage 6, and logs the per-visual wiring (typically a
Desktop-manual step) in the BUILD_LOG. Patterns:
[tooltip-patterns.md](tooltip-patterns.md).
