# Scout run — dashboard design & data-storytelling best practices (2026-07-15)

**Trigger:** user review of the second-build render after the W1 Desktop pass:
placement/sizing still off, "very basic plain 1998 kind of page", too much
information per sheet, Key Takeaway far too small for its role. Assignment:
research current best practice online, then rebuild the pages against it.

## Sources consulted (cite, never copy)

| Source | What it contributed |
|---|---|
| [Lukas Reese — Power BI Dashboard Design Best Practices](https://lukasreese.com/2025/08/20/power-bi-dashboard-design-best-practices-guide/) | 8px base grid (16/24/32 spacing steps), 8–12 visuals max per page, Z-pattern hierarchy, primary metric ~40% larger than secondary, 2-font cap, 3–5 color cap |
| [Draft BI — Power BI Report Layout Best Practices](https://draftbi.com/blog/power-bi-report-layout-best-practices) | Never touch the canvas edge; remove visuals before shrinking whitespace; 3-level type scale only; Gestalt grouping (proximity/enclosure); rename + tab-order discipline |
| [Numerro — The Complete Guide to Designing Power BI Reports](https://www.numerro.io/guides/the-complete-guide-to-designing-power-bi-reports) | 6–10 data points per page; top = KPIs, middle = trend, bottom = detail; de-emphasize secondary text by size/color, not more boxes |
| [MoonStory — Power BI Padding Tips](https://moonstory.design/post/powerbi-padding-tips) | 12px default inner padding (16–20px for calm layouts); titles never against borders; "if it feels tight, it IS tight" |
| [Cole Nussbaumer Knaflic — Storytelling with Data](https://www.storytellingwithdata.com/) | Declutter-and-focus; the takeaway is the headline, not a footnote (already tier-3 in the source register) |
| [CFI — Actionable Financial Dashboards](https://corporatefinanceinstitute.com/resources/fpa/financial-dashboards-that-drive-decisions/) | Action titles: state the insight ("so what"), not the metric name |
| [Fabric community — DataViz World Champs judging](https://community.fabric.microsoft.com/t5/Power-BI-Community-Blog/Announcing-the-results-of-round-1-of-the-Power-BI-Dataviz-World/ba-p/4938838) | Judges reward clarity + a memorable story + polish + restrained interactivity; visible Key Takeaway is the *headline* of the entry |
| [bibb.pro](https://bibb.pro/) | Card-surface + neutral-background harmony; one accent; theme-level consistency (already tier-4) |

## Distilled rules adopted for second-build v2.2

1. **One message per page.** Every page keeps one hero element ~40% larger
   than anything else; everything that serves a different message moves or dies.
2. **Density cap.** ≤ 12 visuals / ≤ 10 data points per page. Cut before
   shrinking whitespace.
3. **8px grid.** Page margin 32px, card gutter 16px, section gap 24px;
   nothing touches the canvas edge.
4. **Cards make the modern look.** Content sits on #FCF9F1 card surfaces with
   a 1px warm hairline, rounded corners, and 12–16px inner padding — not on
   naked canvas with 1px boxes.
5. **Type scale, 2 fonts.** Georgia (display/editorial) + Segoe UI (UI):
   32/28 display · 20 KPI · 12 section · 11 body · 10 caption. Secondary text
   de-emphasized by size + muted color, never by another box.
6. **The takeaway is the headline.** Key Takeaway gets display treatment on
   the landing page; chart titles state the insight, not the column names.
7. **Restraint in color.** Parchment neutrals + one gold accent; era colors
   only as data encodings.

## What this means for the report (delta plan)

- S1: takeaway becomes a display-size statement in a gold-ruled card;
  decorative image placeholders removed; action title on the hero chart.
- S2/S3: 5 KPIs → 3; size-distribution chart and minifig strip removed
  (the cast story lives on S5); remaining content grouped into three cards
  (KPI band · explorer · detail + palette).
- S4a/b: hero number resized to fit; editorial column re-spaced; strip carded.
- S5: three-column card layout, dead zones closed, portrait carded.
- Theme/renderer: card treatment (background, border radius, subtle shadow)
  verified against the PBIR schema before authoring.

Credits added to CREDITS.md and `contracts/source-register.yaml` in the same
change (attribution rule).
