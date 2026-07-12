---
name: nl-definities
description: Generate Dutch definitions-page content (nl-deliverables module) from the metric glossary - kengetallen, periodeafspraken, niet-beschikbaar lijst, scenariokeuzes. Use at stage 5/6 for the report's definitiepagina or as a standalone reference document.
---

# nl-definities

**Module gate:** requires `nl-deliverables` in `project/project.yaml` →
`modules`. If disabled, say so and stop.

## Procedure

1. Read the metric contracts and `02-metrics.md` — the definitions are
   *translated and formatted*, never re-derived or "improved". A definition
   the steward didn't write doesn't exist.
2. Generate from `modules/nl-deliverables/definitie-pagina.template.nl.md`:
   - one block per metric, ordered by report prominence; names exactly as
     displayed in the report;
   - **Berekening** in words (from `formula_in_words`), **Telt niet mee**
     (filters/exclusions), **Richting**, **Let op** (edge cases);
   - Periodeafspraken from the contracts' period conventions;
   - **Niet beschikbaar** verbatim from the blueprint's not-available list;
   - **Scenariokeuzes** with where the report labels them.
3. Two delivery forms, pick per the design handoff:
   - content for the report's definitiepagina (stage 6 implements it per
     the page-archetype spec — plain typography, no charts);
   - and/or `project/deliverables/definities.nl.md` as a standalone
     reference.
4. Stamp peildatum wording, refresh cadence, owner, and generation date.

## Done when

Every number in the report has its Dutch definition one step away, and the
honest lists (niet beschikbaar, scenariokeuzes) are present — an empty
section states explicitly that there was nothing to list.
