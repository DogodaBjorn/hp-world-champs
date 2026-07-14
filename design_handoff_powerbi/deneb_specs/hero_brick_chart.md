# Deneb (Vega-Lite) starting spec — S1 hero brick chart
Dataset fields: year, parts, era ('first'/'silence'/'second'), label.

```json
{
  "width": 860, "height": 540, "background": "transparent",
  "data": {"name": "dataset"},
  "layer": [
    {"mark": {"type": "bar", "width": {"band": 0.9}},
     "encoding": {
       "x": {"field": "year", "type": "ordinal", "axis": {"labelAngle": -90, "labelFontSize": 10.5, "labelColor": "#5C5346", "title": null, "domain": false, "ticks": false}},
       "y": {"field": "parts", "type": "quantitative", "axis": null},
       "color": {"condition": [
         {"test": "datum.parts === null", "value": "#D8CFBC"},
         {"test": "datum.era === 'first'", "value": "#8C7A5B"}], "value": "#6E2B25"}}},
    {"mark": {"type": "bar", "width": 8, "height": 5, "cornerRadiusTopLeft": 2, "cornerRadiusTopRight": 2},
     "transform": [{"filter": "datum.parts > 500"}],
     "description": "stud caps: two 8x5 rounded rects above bar top; use xOffset +-6 in two sublayers",
     "encoding": {"x": {"field": "year", "type": "ordinal"}, "y": {"field": "parts", "type": "quantitative"}, "yOffset": {"value": -5}, "color": {"condition": {"test": "datum.era === 'first'", "value": "#8C7A5B"}, "value": "#6E2B25"}}},
    {"mark": {"type": "text", "dy": -22, "fontSize": 11, "fontWeight": 600},
     "encoding": {"text": {"field": "label"}, "x": {"field": "year", "type": "ordinal"}, "y": {"field": "parts", "type": "quantitative"}}}
  ]
}
```

Mortar course lines: overlay a rule layer generated from a sequence transform (step 15px in pixel space), clipped to each bar, stroke #A08E6C (era I) / #84443D (era II) at 1px — or accept flat fill as documented debt.
Palette strips: bar chart, x = color index (ordinal, bandPaddingInner 0.05), y constant, color = {"field": "hex", "scale": null}.
Composition bars: normalized horizontal stacked bar, color = {"field": "hex", "scale": null}, order by part_count desc, 1px stroke #F5EFE3.
