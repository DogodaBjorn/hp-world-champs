# Design hard rules

These are the enforceable floor of the design system. The reasoning behind them
lives in `design/design-doctrine.md`; the token values below are **neutral
defaults** — the `theme-from-brand-kit` skill overwrites them when a brand kit
is active. A build that violates a hard rule fails the stage-6 gate.

## Token table (neutral defaults)

| Token | Value | Note |
|---|---|---|
| Canvas | `#F5F6F8` | Light neutral; never pure white canvas |
| Card / surface | `#FFFFFF` | |
| Ink (primary text) | `#1F2933` | Near-black, never `#000000` |
| Ink secondary | `#5B6770` | Labels, captions |
| Hairline border | `#E2E6EA` | 1px |
| Corner radius | 8 px | All cards and visuals |
| Shadow | subtle only: ~10% opacity, small blur — or none | Consistent per report: all cards or no cards |
| Grid | 8 px base unit; page margin 24 px; card gutter 16 px | |
| Accent (focus) | `#2563A8` | One focal accent per page |
| Good / Bad pair | `#1E7F4F` / `#B3402E` | Direction encoding — replaced by brand kit; never assume green/red survives rebranding |
| Neutral data | `#8A97A3` | Context series |
| Type scale | 28 / 20 / 14 / 12 / 10 pt | Hero / page title / section / body / caption |

## Hard rules

1. Canvas size is decided once per project (default 1280×720 unless the design
   contract says otherwise) and identical on every page.
2. Maximum ~6 hues per page; context series are gray, the story series carries
   the accent.
3. Direction encoding is consistent report-wide: the good/bad pair means the same
   thing on every page, and color is **never the only carrier** — pair it with a
   sign, arrow, or label (accessibility hard rule).
4. Text contrast meets WCAG AA against its background.
5. Every page passes **3-second clarity** (one message readable at a glance) and
   **3-minute trust** (numbers labeled, periods explicit, definitions reachable).
6. Forbidden: default Power BI styling left as-is, 3-D charts, pie charts for
   ranking, rainbow palettes, KPI-card wallpaper (a page that is only cards),
   gradients/glassmorphism, decorative images that carry no data.
