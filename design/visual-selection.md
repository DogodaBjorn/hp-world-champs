# Visual selection: intent → form

Choose the chart from the analytical intent, never from what "looks good" or
what the previous page used. Ten intents cover report work; each visual on a
page declares its intent in the page-purpose contract. (Intent-first chart
selection descends from the Financial Times' *Visual Vocabulary* — see
CREDITS.md; the table below is our Power BI-native re-derivation.)

| # | Intent | The reader asks | First choice | Also valid | Avoid |
|---|--------|-----------------|--------------|-----------|-------|
| 1 | **Magnitude** | "How much is it?" | KPI card (hero number + micro-context) | Bar | Gauge (context-poor), pie |
| 2 | **Change over time** | "How is it developing?" | Line | Area (one series), column (few periods) | Smoothed lines that invent data |
| 3 | **Comparison across categories** | "Which is bigger?" | Horizontal bar, sorted | Dot plot | Pie/donut beyond 2-3 slices; radar |
| 4 | **Ranking** | "Who leads, who lags?" | Sorted bar with value labels | Table with data bars | Pie for ranking (forbidden) |
| 5 | **Part-to-whole** | "What is it made of?" | 100% stacked bar (few parts) | Treemap (many parts), waterfall (build-up) | Exploded pies, sunbursts |
| 6 | **Distribution** | "How is it spread?" | Histogram | Box plot, strip/dot plot | Averages hiding the spread |
| 7 | **Correlation** | "Do these move together?" | Scatter | Bubble (3rd variable, sparingly) | Dual-axis lines implying causation |
| 8 | **Flow / decomposition** | "What drove the change?" | Waterfall | Decomposition tree (interactive) | Stacked areas for driver analysis |
| 9 | **Deviation** | "How far off plan/prior?" | Bar from a zero/target baseline, diverging colors | Bullet-style bar; variance column beside actuals | Two fat bars per category (actual vs target) |
| 10 | **Detail lookup** | "Give me the records" | Table/matrix, restrained styling, sparklines/data bars where they aid scanning | — | Matrix-as-decoration; endless scroll without search intent |

## Selection discipline

- **One intent per visual.** A visual serving two intents serves neither;
  split it or pick the one the page's question needs.
- **The question dictates orientation.** Time flows horizontal (line/column);
  category names read horizontal (horizontal bars).
- **Small multiples over clutter.** More than ~4 series on one line chart →
  small multiples with synced axes, gray context + one accent per panel.
- **Tables are visuals too.** Right-align numbers, one decimal discipline,
  data bars/sparklines instead of extra columns, no zebra noise.
- **Custom visuals are the exception**, not the toolkit: native first; a
  custom visual needs a written justification (what intent native can't
  serve) — the custom-visual-studio module handles the build when justified.

## Baselines and axes (trust rules)

- Bar lengths encode value → bars start at zero, always.
- Line charts may zoom, but say so (axis labels visible, break noted).
- Periods on the axis are explicit ("Jan–Jun 2026", not "recently").
- Deviation charts show the baseline as a line, not as a memory.
