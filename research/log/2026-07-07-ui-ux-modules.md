# Scout: UI/UX module candidates — 2026-07-07

**Trigger:** user request to review bibb.pro and the wider Power BI UI/UX/
dataviz guru landscape (Valerie Junk named explicitly) for the top module
candidates to add to the toolkit.

**Sources consulted (cited, nothing copied):**

- bibb.pro — button-slicer patterns article + blog catalog (layouts,
  light/dark, wireframing, navbar, personas, glassmorphism, theme generator)
  — https://bibb.pro/blog/
- Valerie Junk (PorcuBI) — tables/matrix "next step", storytelling per
  audience — https://www.valeriejunk.nl/
- Kerry Kolosko — SVG/HTML micro-viz templates, sparklines —
  https://kerrykolosko.com/
- Deneb ecosystem — Daniel Marsh-Patrick (author), Davide Bacci showcase —
  https://deneb.guide/
- Mara Pereira (Data Pears) — Figma-first backgrounds/layout workflow —
  https://www.datapears.com/
- Reid Havens (Havens Consulting) — report-page tooltip techniques —
  https://www.havensconsulting.net/
- Meagan Longoria — Power BI accessibility checklist —
  https://datasavvy.me/
- Miguel Myers (MS core visuals) — new card reference labels/collage —
  https://powerbi.microsoft.com/en-us/blog/new-cards-reference-labels-public-preview/

## Findings

The community's highest-leverage territory beyond what the repo already
covered (v0.2.0): declarative bespoke visuals (Deneb sits between native
and pbiviz), table craft as the workhorse discipline, the hover layer as
formalized progressive disclosure, design-tool-grade page backgrounds, and
accessibility as a measurable gate rather than a sentiment. Native feature
velocity (new card reference labels) argues for *assess* rather than build
where Microsoft is actively absorbing a technique.

## Shortlist

| Candidate | Source(s) | Improves | Classification | Impact/effort |
|---|---|---|---|---|
| deneb-studio | Marsh-Patrick, Bacci, Kolosko | bespoke visuals without pbiviz toolchain | new module | high / medium |
| table-studio | Junk, Kolosko | the workhorse visual on every Detail page | new module | high / low |
| tooltip-studio | Havens, MS guidance | hover layer; trust tooltips from metric contracts | new module | medium / low |
| canvas-studio | Pereira, bibb | wireframe-first + designed backgrounds | new module | medium / medium |
| a11y-studio | Longoria, WCAG 2.2 | measurable accessibility gate + contrast script | new module | high / medium |
| kpi-card reference labels | Miguel Myers / MS | modern KPI cards natively | hold→assess (feature still moving) | medium / low |
| light/dark variants | bibb | reader-environment fit | extension (theme-from-brand-kit), assess | low / medium |
| glassmorphism | bibb | visual novelty | hold — conflicts with design doctrine | — |

## Decision

2026-07-07: user chose review-only at first, then approved **build all
five** plus formalizing this process itself as the `/scout` skill (this
log's existence is that decision implemented). All five modules + scout +
radar shipped as v0.3.0. Community sources added to
`contracts/source-register.yaml` tier_4_community.
