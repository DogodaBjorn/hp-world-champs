# nl-deliverables

Dutch-language client deliverables, generated from the same contracts that
drive the build — so the Dutch documents can never drift from what was
actually built.

| Skill | Generates | From |
|---|---|---|
| `nl-uat` | `project/deliverables/uat-testplan.nl.md` | page-purpose + metric contracts, BUILD_LOG |
| `nl-definities` | Definitions-page content (report page and/or `definities.nl.md`) | metric contracts / 02-metrics.md glossary |

## Conventions

- Templates in this folder set tone and structure: zakelijk maar helder —
  written for the eindgebruiker, not the engineer. Jargon gets a Dutch
  explanation on first use.
- Metric names stay **exactly** as they appear in the report (English or
  Dutch — whatever the report shows); the definition text is Dutch.
- Number/date formats follow Dutch conventions (decimale komma, dd-mm-jjjj)
  in prose; the report's own formats are decided by the design brief.
- Generated documents carry a generation date and the template version.
