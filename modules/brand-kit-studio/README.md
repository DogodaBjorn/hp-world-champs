# brand-kit-studio

Creates brand kits — the single source of truth for a client's or product's
visual identity in report form. A kit lives in `design/brand-kits/<kit>/`
(`brand.yaml` + `assets/`) and is compiled by the core
`theme-from-brand-kit` skill into a Power BI `theme.json` and concrete
design-hard-rule token values.

## Flow

1. Enable the module in `project/project.yaml` (or at `/project-init`).
2. Run the `bk-brand-kit` skill. It interviews per
   [interview-guide.md](interview-guide.md), translating brand *materials*
   (style guide, website, logo) into design *roles* (accent, good/bad pair,
   canvas, type stack with Power BI-safe fallbacks).
3. The skill writes `design/brand-kits/<kit>/brand.yaml` from the
   `_template` scaffold and validates the choices (contrast, color-blind
   safety, fallback realism).
4. Activate the kit in `project/project.yaml` → `brand_kit: <kit>`; stage 5
   compiles it via `theme-from-brand-kit`.

## Principles

- **Roles, not favorites.** A brand's favorite orange may be the accent, a
  categorical member, or banned from data entirely — the interview decides
  its *job*.
- **The good/bad pair is a design decision, not a default.** Green/red fails
  color-blind readers and some brand palettes; the pair must contrast each
  other *and* both surfaces, and never carries meaning alone.
- **Design for the fallback.** Fonts not installed on a reader's machine
  fall back silently; every family in the kit names its Power BI-safe
  fallback and the kit is judged in the fallback rendering too.
- Kits are reusable across projects; client-identifying names stay out of
  kits in shareable repos (use the alias).
