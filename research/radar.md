# Tech radar

Living record of techniques, tools, and patterns assessed for this toolkit.
Rings: **adopted** (in the repo) · **trial** (in, unproven on a real
project) · **assess** (promising, not built) · **hold** (deliberately not,
with reason). Maintained by `/scout` runs and stage-7 retrospectives.

Last updated: 2026-07-07 (scout: ui-ux-modules).

## Adopted

| Item | Owner in repo | Since |
|---|---|---|
| Button-slicer UI patterns (segmented/tabs/toggle/KPI cards/image items) | nav-studio | v0.2.0 |
| Functional SVG icons + state variants | icon-studio | v0.2.0 |
| SVG-in-DAX dynamic marks | icon-studio guide; reused by table-studio | v0.2.0 |
| Brand kit → theme + hard-rule tokens compilation | theme-from-brand-kit (core) | v0.1.0 |
| Insight titles, semantic color, focal-contrast polish moves | dataviz-polish (core) | v0.1.0 |

## Trial (implemented v0.3.0 — first real project use decides)

| Item | Owner in repo | Watch for |
|---|---|---|
| Deneb/Vega-Lite bespoke visuals with token-injected specs | deneb-studio | spec maintenance cost; Deneb/Vega-Lite version churn |
| Premium table architecture + in-cell micro-viz | table-studio | native cell-elements surface evolving |
| Report-page tooltip patterns (mini-trend, trust, breakdown) | tooltip-studio | headless tooltip-assignment support in PBIR |
| Wireframe-first SVG page backgrounds | canvas-studio | background-image format support; regeneration discipline |
| Scripted WCAG contrast gate + audit checklist | a11y-studio + scripts/check_contrast.py | alt-text/tab-order property surface in PBIR |

## Assess (natural /scout subjects)

| Item | Why interesting | Note |
|---|---|---|
| New card visual reference labels & collage layouts | native modern KPI cards (GA Nov 2025), still evolving fast | fold into dataviz-polish/table-studio when the surface stabilizes |
| Light/dark report variants | reader-environment fit | extension of theme-from-brand-kit, not a module |
| Mobile canvas layouts | underserved delivery surface | needs a real project demand first |
| backend-stories (PBIP DAX/M → backend user stories) | reverse-engineering add-on | carried from v0.1.0 future-ideas |
| fabric-deploy (deployment pipelines / Fabric CLI adapter) | delivery automation with safety hooks | deploys stay user-run regardless |
| data-profiler (source quality profiling feeding stage 1) | evidence over hearsay in requirements | carried from v0.1.0 future-ideas |

## Hold

| Item | Reason |
|---|---|
| Glassmorphism / gradient-heavy styling | conflicts with the design doctrine's restraint principle and the hard-rules forbidden list; revisit only if the doctrine changes |
| Persona-pack module | stage-1 audience/decision mapping already covers the need |
| Performance-tooling module | real subject, different skillset (model/DAX perf, not UI/UX); reconsider as its own track |
| Hand-rolled DAX bar-charts-in-SVG beyond simple marks | maintenance trap; real charts belong in visuals (icon-studio guide draws the line) |
