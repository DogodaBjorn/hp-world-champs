# Credits

**Credit where it is due — no negotiations.** This toolkit stands on the
work of the people and communities below. Nothing here was copied from
them: every technique is re-derived in this repo's own words and code, and
this file plus in-file credit lines say plainly where the ideas came from.
If you fork or share this repository, these credits travel with it. If you
adopt a new idea into it, add its source here in the same change
(see `.claude/rules/attribution.md` — this is a hard rule, not a courtesy).

## Tools this repo drives

| Who | What we owe them | Where it lands |
|---|---|---|
| **Kurt Buhler & Maxim Anatsko** — the [pbir CLI](https://pypi.org/project/pbir-cli/) | Headless PBIR authoring as a practice; the reason agent-driven report building is tractable at all. Custom non-commercial license — respected, never vendored. | `pbir-cli` adapter skill, DEPENDENCIES.md |
| **Daniel Marsh-Patrick** — [Deneb](https://deneb.guide/) | Declarative Vega-Lite visuals inside Power BI: the middle rung between native and custom-visual development. | deneb-studio |
| **Microsoft Power BI / Fabric teams** | PBIP/PBIR/TMDL open formats, the base themes, `pbiviz` tooling, and the core-visuals work (Miguel Myers and team: new card, reference labels, button slicer). | everywhere; custom-visual-studio; nav-studio |
| **UW Interactive Data Lab** — [Vega-Lite](https://vega.github.io/vega-lite/) | The grammar Deneb speaks. | deneb-studio |

## Practitioners whose published work shaped the modules

| Who | What we learned from them | Where it lands |
|---|---|---|
| **[bibb.pro](https://bibb.pro/)** | Modern button-slicer UI patterns (segmented controls, tabs, toggles, clickable KPI cards, image items), navbar thinking, wireframing and layout writing. | nav-studio, canvas-studio |
| **[Valerie Junk](https://www.valeriejunk.nl/)** (PorcuBI) | Tables and matrices as visuals that work *with* the user; storytelling per audience; adoption-first design. | table-studio |
| **[Kerry Kolosko](https://kerrykolosko.com/)** | SVG/HTML micro-visualization craft: sparklines, in-cell marks, SVG-in-DAX as a discipline. | icon-studio, table-studio |
| **[Davide Bacci](https://deneb.guide/community/resources)** | What Deneb can really do — the showcase that sets the bar. | deneb-studio |
| **[Mara Pereira](https://www.datapears.com/)** (Data Pears) | Design-tool-first canvases: wireframes and designed backgrounds as the foundation of premium layout. | canvas-studio |
| **[Reid Havens](https://www.havensconsulting.net/)** (Havens Consulting) | Report-page tooltips as a designed layer, including field-parameter-driven tooltip content. | tooltip-studio |
| **[Meagan Longoria](https://datasavvy.me/)** | The Power BI accessibility checklist that defined the practice: measured contrast, alt text, tab order, color-never-alone. | a11y-studio |
| **[Kurt Buhler](https://data-goblins.com/)** (Data Goblins) | Power BI design and agentic-development practice beyond the CLI itself. | source register, scout runs |

## Method & standards the doctrine stands on

| Who | What we owe them | Where it lands |
|---|---|---|
| **Ralph Kimball & Margy Ross** | Dimensional modeling: grain-first, star schemas, conformed dimensions. | star-schema rule, stage 3 |
| **Marco Russo & Alberto Ferrari** ([SQLBI](https://www.sqlbi.com/)) | DAX correctness and patterns; the standard the dax-patterns skill defers to. | dax-patterns, source register |
| **Daniel Otykier** ([Tabular Editor](https://tabulareditor.com/)) | Model-hygiene practice and the Best Practice Analyzer tradition. | source register |
| **Edward Tufte** | The data-ink principle — "ink serves data" is his idea in our words. | design-doctrine |
| **Cole Nussbaumer Knaflic** ([Storytelling with Data](https://www.storytellingwithdata.com/)) | Declutter-and-focus discipline; context in titles. | design-doctrine, dataviz-polish |
| **Financial Times** ([Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary)) | Intent-first chart selection — the ancestor of our 10-intent table. | design/visual-selection.md |
| **IBCS** (Rolf Hichert et al.) | Notation consistency and variance-visualization rigor. | source register, table-studio |
| **Nielsen Norman Group** | Evidence-based dashboard usability. | source register |
| **W3C** ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)) | The accessibility criteria our contrast script and audit implement. | a11y-studio, check_contrast.py |

## Built with

This repository was designed and authored with **Claude Code** (Anthropic),
which also does the heavy lifting inside it. Copyright and license of the
repo content: see [LICENSE](LICENSE) (MIT, © Bjorn / dogoda.nl).

---

*Missing or mis-stated credit? That's a defect — open an issue or fix it
directly. Over-attribution costs a line; under-attribution costs integrity.*
