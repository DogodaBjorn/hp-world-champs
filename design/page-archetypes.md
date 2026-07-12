# Page archetypes

Five compositions cover nearly every report page. Each page declares its
archetype in the page-purpose contract; mixing archetypes on one page is the
most common way pages fail the 3-second test.

## 1. Overview ("How are we doing?")

The landing page. A KPI band (3-5 cards max: hero number + delta + micro
trend), one hero visual that carries the page's message (usually change over
time), and one supporting breakdown. Global slicers live in consistent page
chrome. **Failure mode:** KPI wallpaper — a wall of cards with no hero visual
is a lookup table, not an overview.

## 2. Drivers ("Why did it change?")

Decomposition of one headline movement. Hero: waterfall or driver breakdown
from the headline number; support: the underlying trend and the top
movers (ranked bars with diverging colors). Reads top-left (what changed) to
bottom-right (what drove it). **Failure mode:** showing every driver instead
of the movers that matter.

## 3. Comparison ("Where should I look?")

Ranking and deviation across units — regions, products, teams. Hero: sorted
bar or heat matrix with reference line (average/target); the outliers carry
the accent, everything else grays back. Drill-through to Detail. **Failure
mode:** rainbow categories — color should mark the exceptions, not decorate
every row.

## 4. Detail ("Give me the records")

The working table behind the story: filters/search up top, a well-typed
table/matrix (right-aligned numbers, data bars or sparklines where they aid
scanning), export-friendly. Reached by drill-through carrying context.
**Failure mode:** promoting Detail onto Overview because "someone asked once".

## 5. Definitions ("What exactly am I reading?")

The trust anchor: every metric's plain-language definition (from the metric
contracts), period conventions, data freshness, known caveats, and the
not-available list where honesty requires it. Plain typography, no charts.
Linked from every page's chrome. **Failure mode:** omitting it — the
3-minute trust path needs somewhere to land.

## Composition rules (all archetypes)

- Layout on the 8px grid; margins and gutters from the design brief.
- Reading order top-left → bottom-right; the 3-second message lives top-left.
- Shared page chrome (masthead with title + question, nav, footer with
  freshness stamp) identical on every page — see `naming-conventions.md`
  (`z_*` elements).
- Slicers: few, consistent position, defaults documented. A slicer nobody
  needs is clutter with a dropdown.
