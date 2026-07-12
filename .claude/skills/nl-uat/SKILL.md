---
name: nl-uat
description: Generate a Dutch UAT/testplan (nl-deliverables module) from the metric and page-purpose contracts plus the BUILD_LOG - cijfercontroles, paginacontroles, gebruikstest, bevindingenlijst. Use at stage 7 for Dutch-language projects or on request.
---

# nl-uat

**Module gate:** requires `nl-deliverables` in `project/project.yaml` →
`modules`. If disabled, say so and stop (an English UAT script per
`s7-deliver` step 4 is the alternative).

## Procedure

1. Read the sources — the plan derives from contracts, never from memory:
   metric contracts (definitions, edge cases), page-purpose contracts
   (questions, interactions), `BUILD_LOG.md` (manual steps, known
   limitations), the not-available list.
2. Generate `project/deliverables/uat-testplan.nl.md` from
   `modules/nl-deliverables/uat-testplan.template.nl.md`:
   - **Cijfercontroles:** one block per metric; expected values must come
     from an *independent* source (bronsysteem, bekend totaal) — ask the
     user where to anchor each if unknown; never let the report validate
     itself.
   - **Paginacontroles:** one block per page, the page's question verbatim
     from its contract.
   - **Gebruikstest:** realistic user questions from the stage-1
     requirements; the definitiepagina check; the real-screen check.
   - Known limitations from the BUILD_LOG appear as notes, not surprises.
3. Language: zakelijk maar helder, geschreven voor de eindgebruiker. Metric
   names exactly as the report shows them; Dutch number/date conventions in
   prose.
4. Stamp generation date and template version; link the plan from
   `07-delivery.md`.

## Done when

A tester who never saw this project can run the plan start-to-finish and
every "verwacht" is concrete enough to mark akkoord/afwijking.
