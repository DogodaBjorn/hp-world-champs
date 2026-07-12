# table-studio

The table is the workhorse of consulting reports — the Detail archetype, the
standings board, the thing every stakeholder eventually exports. This module
turns it from a number grid into a visual that **works with the reader**:
scan (find my row fast) → compare (see who's ahead/behind) → verify (trust
the exact figure).

The subject owes much to the practitioner community around premium table
design — notably Valerie Junk's tables-and-matrix work and Kerry Kolosko's
in-cell micro-viz techniques (consulted as inspiration; every recipe here is
re-derived in this repo's own conventions).

## Doctrine

1. **A table is chosen, not defaulted.** It serves the *detail-lookup* and
   *ranking* intents (`design/visual-selection.md`). If the reader needs a
   shape, give them a chart; if they need records and exact values, give
   them a well-made table.
2. **Scanability is typography.** Alignment, number discipline, and row
   rhythm do more than any color ever will.
3. **Color marks exceptions.** In a table, color is rationed to the cells
   that need attention — a fully colored table is a heatmap that lost its
   way (heatmaps are deliberate, see the patterns file).
4. **Micro-viz earns its column.** A sparkline or data bar replaces a column
   of numbers the reader would otherwise have to mentally chart — it never
   sits beside them as decoration.
5. **The total row is a test.** If a column's total is meaningless, blank it
   deliberately — an honest blank beats a misleading sum.

## Flow

Enable `table-studio` in `project/project.yaml` → the `tb-tables` skill
applies [table-patterns.md](table-patterns.md) when specifying tables at
stage 5 (design handoff) or building them at stage 6, and runs the
works-with-the-user checklist at review.
