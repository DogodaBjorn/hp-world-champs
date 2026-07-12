# icon-studio

Generates and manages the report's icon language: small SVG marks that carry
meaning — direction, state, category, affordance — plus the occasional
page-chrome graphic (masthead mark, divider, empty-state illustration).

## Doctrine: functional, never decorative

The `dataviz-polish` anti-pattern list bans "decorative icons on every card"
for a reason: icons that don't encode anything are noise wearing a costume.
An icon earns its place by answering one of:

- **Direction/state:** up/down/neutral, on-track/at-risk (always paired with
  a sign or label — color and shape never carry meaning alone).
- **Category mark:** a stable pictogram for a recurring dimension member
  (channel, region) that speeds scanning in tables and slicers.
- **Affordance:** navigation and interaction cues (back, filter, expand) —
  usually consumed by the nav-studio module's patterns.
- **Chrome:** one identity mark in the masthead; not sprinkled per visual.

If a proposed icon fits none of these, the answer is no — recommend the
native alternative (conditional formatting, labels).

## Flow

1. Enable `icon-studio` in `project/project.yaml`.
2. Run the `ic-icons` skill: it selects/generates icons per
   [svg-icon-guide.md](svg-icon-guide.md), colors them from the active brand
   kit (or neutral defaults), produces state variants, and writes them to
   `project/deliverables/icons/`.
3. Stage 5 references icons by filename in the design handoff; stage 6 embeds
   them per the guide's surface instructions; BUILD_LOG records any
   Desktop-manual steps (e.g. uploading button icons).

## What ships with the module

[assets/starter-icons/](assets/starter-icons/) — a minimal, stroke-consistent
starter set in the neutral ink color, ready to recolor: arrows (up/down/
right), dash-neutral, check, warning, info, target, filter, home. Treat them
as a base alphabet; project-specific icons are generated in the same style.

Dynamic, data-driven graphics (KPI state chips, micro-gauges) use the
**SVG-in-DAX** pattern in the guide — a measure builds the SVG string, the
report renders it as an image. Powerful and easy to overdo; the guide's
restraint rules apply.

## Credit

The SVG-in-DAX micro-viz discipline was pioneered and popularized in the
Power BI community above all by [Kerry Kolosko](https://kerrykolosko.com/),
whose sparkline and smart-graphics work defines the craft (consulted as
inspiration; every recipe here is re-derived — see CREDITS.md).
