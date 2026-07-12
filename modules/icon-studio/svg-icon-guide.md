# SVG icon guide

How icons are crafted, colored, and embedded in Power BI. Research-first
applies to every embedding surface: property names and image support evolve —
verify in current Desktop / the file's `$schema` before authoring PBIR.

## Crafting rules

- **One geometry system:** `viewBox="0 0 24 24"`, consistent stroke width
  (2px at 24, `stroke-linecap="round"`, `stroke-linejoin="round"`), minimal
  paths. Icons from different geometry systems read as clutter.
- **Bake colors at generation time.** Power BI does not resolve
  `currentColor` or CSS variables in imported images — every variant carries
  literal hex values from the brand kit / theme tokens.
- **State variants per icon,** named `<icon>--<state>.svg`:
  - `--default` (ink or ink-secondary), `--selected` (accent),
    `--disabled` (hairline gray), and semantic variants `--good` / `--bad`
    only where the icon itself encodes direction.
- **Sizing:** icons render small (12–24px). No detail that disappears at
  16px; test by viewing at target size, not at 400%.
- **Accessibility:** the icon never carries meaning alone — the adjacent
  label, sign, or tooltip states it in text. Add `<title>` inside the SVG
  as a courtesy, but don't rely on it.
- Keep files self-contained: no external refs, no scripts, no fonts —
  convert any text to paths.

## Embedding surfaces (verify names before authoring)

| Surface | How | Notes |
|---|---|---|
| Image visual | insert image / PBIR image element | chrome marks (`z_`), empty states |
| Button custom icon | button formatting → custom icon image | nav affordances (`btn_`); upload is often a Desktop-manual step — BUILD_LOG it |
| Button slicer / new slicer images | per-state image on items (default + selected) | powers nav-studio's toggle/image patterns |
| Table & matrix cells | column or **measure** with Image URL data category | data-URI works here — the dynamic pattern below |
| KPI/card visuals | image via conditional formatting where supported | verify per visual type |
| Page background / wallpaper | page formatting image | subtle only; never behind data ink |

Static files live in `project/deliverables/icons/`; when a report needs them
inside the PBIP, register them as report resources (research the current
StaticResources mechanism at build time) and note the step in BUILD_LOG.

## The dynamic SVG-in-DAX pattern

A measure returns a complete SVG as a **data URI**, and a visual with the
Image URL data category renders it. This turns tables and cards into hosts
for state chips, direction markers, and micro-gauges that respond to filter
context.

Shape of the measure (adapt, don't paste blindly):

```dax
/// Chip: green/red state dot with label, rendered via Image URL.
Chip Status =
VAR Color = IF([Delta] >= 0, "%231E7F4F", "%23B3402E")  -- '#' must be %23
VAR Label = FORMAT([Delta], "+0.0%;-0.0%")
RETURN
"data:image/svg+xml;utf8," &
"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 20'>" &
"<circle cx='10' cy='10' r='5' fill='" & Color & "'/>" &
"<text x='22' y='14' font-size='11' fill='%231F2933'>" & Label & "</text>" &
"</svg>"
```

Rules of engagement:

- **URL-encode inside the string:** `#` → `%23` is the classic silent
  failure; avoid raw `"` inside attributes (use `'`).
- Set the measure's data category to **Image URL**; sizes are controlled by
  the SVG's own `viewBox`/aspect and the host cell.
- Keep generated SVGs *tiny* (one shape + one text). A micro-gauge is fine;
  a hand-rolled bar chart in DAX is a maintenance trap — use a real visual.
- Colors come from theme tokens (the same hex the theme.json uses), so
  rebrands stay one-touch.
- Every dynamic SVG measure lives in `03 Display` with a `///` docstring,
  and appears in the design handoff like any other visual element.
- Text inside SVG is invisible to screen readers in this context — the same
  value must exist as a regular column/measure nearby.

## File vs. measure

| Use a static file when… | Use SVG-in-DAX when… |
|---|---|
| The mark is fixed (nav icon, category pictogram, chrome) | The mark depends on data (state, magnitude) |
| Needed as button/slicer imagery | Needed per-row in tables/matrices |
| Crisp brand geometry matters | A simple chip/dot/delta suffices |
