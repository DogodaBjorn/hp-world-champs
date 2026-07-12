---
name: dataviz-polish
description: The finishing pass that takes a correct report to premium - ten ranked high-leverage moves (insight titles, semantic color, focal contrast, sparklines, small multiples...) plus anti-patterns. Use during stage 5 design specification and stage 6 build, and whenever the user asks to polish or level up a report.
---

# dataviz-polish

Polish is specified at stage 5 (the handoff names each move per visual) and
executed at stage 6 — it is not freelance decoration at build time. Gate for
every move: does it sharpen the 3-second message or deepen the 3-minute
trust? If neither, it's ornament — skip it. (The declutter/focus lineage
here owes Tufte's data-ink principle and Knaflic's *Storytelling with
Data*; micro-viz craft owes Kerry Kolosko — see CREDITS.md.)

## The ten moves, ranked by impact ÷ effort

1. **Insight titles.** A DAX measure composes the title sentence
   ("Margin +2.1pt vs Q1, driven by North") bound via title → fx → field
   value. The single biggest perceived-intelligence upgrade a report can get.
2. **Semantic color.** A measure returns a hex token (from the theme's
   good/bad/neutral) through conditional formatting, so color states the
   verdict. Always paired with a sign or label — never color alone.
3. **One focal point.** The story series carries the accent; every other
   series drops to the neutral gray. If everything is highlighted, nothing is.
4. **Reference lines and bands.** Target, average, or last-year as a quiet
   line/band turns "a number" into "a number in context".
5. **Sparklines and data bars in tables.** A standings board instead of a
   number grid — trend and magnitude scannable per row.
6. **Small multiples.** Beyond ~4 series, split into panels with synced axes;
   gray context + one accent per panel.
7. **Hero number + micro-context.** KPI cards carry a delta and a tiny trend
   next to the big number; a number without context is a quiz question.
8. **Progressive disclosure.** Overview stays clean; depth lives in
   drill-through and hover tooltips (tooltip pages). Nothing important is
   *only* in a tooltip.
9. **Field parameters.** One chart, a slicer to switch metric/dimension —
   collapses near-duplicate visuals and pages.
10. **Sparing motion.** At most one bookmark-driven state change per page,
    and only when it answers a real question. Motion is salt, not sauce.

## Anti-patterns (reject on sight)

3-D anything; pies for ranking; dual axes implying causation; rainbow
categorical palettes; KPI-card wallpaper; decorative icons on every card;
gridlines darker than data; legends when direct labels fit; "creative"
interactions that hide the answer behind a click.

## Review pass (5 steps, any page)

1. Read the page for 3 seconds — write down the message you got. Is it the
   contracted one?
2. Delete test: name one element that could go. If you can, it goes.
3. Squint test: does the visual hierarchy survive blur? (hero > support > chrome)
4. Trust walk: periods labeled, baselines honest, definitions one step away.
5. Consistency sweep: formats, colors, terminology identical across pages.
