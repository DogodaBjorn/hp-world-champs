# Data model — <project name>

<!-- The model as the design and build need it: a faithful, readable summary
of the stage-3/4 model, not a re-design. Copy to project/deliverables/. -->

## Star schema

```
<ASCII diagram: facts center, dimensions around, relationship arrows>
```

| Table | Kind | Grain (one row means…) | Source (parameterized) |
|---|---|---|---|
| <Fact> | fact | <grain sentence> | <expression/parameter name> |
| <Dimension> | dimension | <grain sentence> | <…> |
| Date | dimension (marked) | one calendar day | generated |
| _Measures | measure table | — | — |

## Field map (what the report binds to)

| Report element | Binding | Notes |
|---|---|---|
| <kpi_revenue> | `[Net Revenue]` | <format, folder> |
| <sl_period> | `Date[Month]` | <default selection> |

## Measure taxonomy

<numbered displayFolder tree, e.g.>
- 01 Core
- 02 Time intelligence
- 03 Display (insight titles, semantic colors)

## Metrics NOT available — do not fabricate

<!-- Verbatim from the model blueprint. This section is mandatory; an empty
section means "we checked and everything was available", stated explicitly. -->

| Asked for | Why not available | Nearest honest proxy (with caveat) |
|---|---|---|
| <metric> | <reason> | <proxy or none> |

## Scenario logic (labeled)

<!-- Targets, composite scores, classification thresholds that are choices,
not facts. Each entry names where the report labels it as scenario logic. -->

- <item — where labeled>

## Freshness & refresh

- Data through: <how the reader can tell>
- Refresh cadence: <expected>
