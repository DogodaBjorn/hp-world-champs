"""W4: s5 'Chapter IV' becomes the native Character Explorer (The Cast).

Replaces the custom-visual quiz concept (jury-safety: no private .pbiviz).
Run once from repo root after the pbir CLI adds:
    python project/analysis/authored-render/uplift_w4_cast.py
"""

import json
import os
import shutil

PAGE = os.path.join("project", "pbip", "second-build.Report", "definition",
                    "pages", "s5-sorting-quiz")
INK, MUT, GOLD = "#211B14", "#5C5346", "#7A5D1D"
SCHEMA = ("https://developer.microsoft.com/json-schemas/fabric/item/report/"
          "definition/visualContainer/2.9.0/schema.json")


def vp(vid):
    return os.path.join(PAGE, "visuals", vid, "visual.json")


def load(vid):
    with open(vp(vid), encoding="utf-8") as h:
        return json.load(h)


def save(vid, doc):
    with open(vp(vid), "w", encoding="utf-8", newline="\n") as h:
        json.dump(doc, h, indent=2, ensure_ascii=False)


def lit(v):
    return {"expr": {"Literal": {"Value": v}}}


def solid(c):
    return {"solid": {"color": lit("'" + c + "'")}}


def obj(props):
    return {"properties": props}


def sort_measure(entity, prop, direction):
    return {"sort": [{"field": {"Measure": {"Expression": {"SourceRef":
            {"Entity": entity}}, "Property": prop}}, "direction": direction}],
            "isDefaultSort": True}


def sort_column(entity, prop, direction):
    return {"sort": [{"field": {"Column": {"Expression": {"SourceRef":
            {"Entity": entity}}, "Property": prop}}, "direction": direction}],
            "isDefaultSort": True}


# quiz placeholder goes; frame stays as the band border
if os.path.isdir(os.path.join(PAGE, "visuals", "c_quiz_placeholder")):
    shutil.rmtree(os.path.join(PAGE, "visuals", "c_quiz_placeholder"))
print("placeholder deleted")

# subtitle copy
doc = load("c_subtitle")
for e in doc["visual"]["objects"]["general"]:
    for p in e["properties"]["paragraphs"]:
        for r in p["textRuns"]:
            r["value"] = "Choose your character — the whole page follows your click."
save("c_subtitle", doc)
print("subtitle updated")

# cast list: readable rows, photo column, sorted by variants
doc = load("tbl_cast")
doc["position"].update(z=310, tabOrder=20500)
doc["visual"]["query"]["sortDefinition"] = sort_measure("_Measures", "Minifig Variants", "Descending")
doc["visual"]["objects"] = {
    "columnHeaders": [obj({"fontColor": solid(MUT), "fontSize": lit("10D"),
                           "fontFamily": lit("'Segoe UI'")})],
    "values": [obj({"fontColorPrimary": solid(INK), "fontSize": lit("11D"),
                    "fontFamily": lit("'Segoe UI'")})],
    "grid": [obj({"gridVertical": lit("false"),
                  "rowPadding": lit("6D")})],
}
save("tbl_cast", doc)

# character headline + stat cards
CARDS = {"crd_char": ("22D", INK, True), "crd_variants": ("12D", INK, False),
         "crd_first": ("12D", INK, False), "crd_latest": ("12D", INK, False)}
for vid, (fs, color, bold) in CARDS.items():
    doc = load(vid)
    doc["position"]["z"] = 320
    props = {"fontSize": lit(fs), "color": solid(color),
             "fontFamily": lit("'Georgia'" if bold else "'Segoe UI'")}
    if bold:
        props["bold"] = lit("true")
    doc["visual"]["objects"] = {"labels": [obj(props)],
                                "categoryLabels": [obj({"show": lit("false")})]}
    doc["visual"]["visualContainerObjects"] = {
        "background": [obj({"show": lit("false")})],
        "border": [obj({"show": lit("false")})]}
    save(vid, doc)

# era split bar
doc = load("bar_eras")
doc["position"]["z"] = 320
doc["visual"]["objects"] = {
    "categoryAxis": [obj({"show": lit("true"), "labelColor": solid(MUT),
                          "fontSize": lit("10D"), "fontFamily": lit("'Segoe UI'")})],
    "valueAxis": [obj({"show": lit("false")})],
    "labels": [obj({"show": lit("true"), "color": solid(MUT),
                    "fontSize": lit("9D"), "fontFamily": lit("'Segoe UI'")})],
    "dataPoint": [obj({"defaultColor": solid(GOLD)})],
}
doc["visual"]["visualContainerObjects"] = {
    "title": [obj({"show": lit("true"), "text": lit("'VARIANTS BY BUILD'"),
                   "fontColor": solid(MUT), "fontSize": lit("10D"),
                   "fontFamily": lit("'Segoe UI'"), "bold": lit("true")})],
}
save("bar_eras", doc)

# variants timeline
doc = load("tbl_appear")
doc["position"]["z"] = 320
doc["visual"]["query"]["sortDefinition"] = sort_column("Minifigs", "year", "Ascending")
doc["visual"]["objects"] = {
    "columnHeaders": [obj({"fontColor": solid(MUT), "fontSize": lit("10D"),
                           "fontFamily": lit("'Segoe UI'")})],
    "values": [obj({"fontColorPrimary": solid(INK), "fontSize": lit("11D"),
                    "fontFamily": lit("'Segoe UI'")})],
    "grid": [obj({"gridVertical": lit("false"), "rowPadding": lit("4D")})],
}
doc["visual"]["visualContainerObjects"] = {
    "title": [obj({"show": lit("true"),
                   "text": lit("'EVERY VARIANT — YEAR · NAME · SKIN'"),
                   "fontColor": solid(MUT), "fontSize": lit("10D"),
                   "fontFamily": lit("'Segoe UI'"), "bold": lit("true")})],
}
save("tbl_appear", doc)

# big portrait
doc = load("img_char")
doc["position"]["z"] = 320
doc["visual"]["objects"] = {
    "columnHeaders": [obj({"show": lit("false")})],
    "grid": [obj({"gridVertical": lit("false"), "gridHorizontal": lit("false")})],
}
save("img_char", doc)


# labels + hint
def make_textbox(vid, x, y, w, h, text, pt="10pt", italic=False):
    style = {"fontFamily": "Segoe UI", "fontSize": pt, "color": MUT}
    if italic:
        style["italic"] = True
    doc = {"name": vid,
           "position": {"x": x, "y": y, "z": 340, "width": w, "height": h,
                        "tabOrder": 26000},
           "visual": {"visualType": "textbox",
                      "objects": {"general": [{"properties": {"paragraphs": [
                          {"textRuns": [{"value": text, "textStyle": style}]}]}}]},
                      "visualContainerObjects": {
                          "background": [obj({"show": lit("false")})],
                          "border": [obj({"show": lit("false")})]},
                      "drillFilterOtherVisuals": False},
           "$schema": SCHEMA}
    os.makedirs(os.path.dirname(vp(vid)), exist_ok=True)
    save(vid, doc)


make_textbox("lbl_variants", 397, 220, 140, 18, "variants")
make_textbox("lbl_first", 549, 220, 150, 18, "first seen")
make_textbox("lbl_latest", 711, 220, 150, 18, "latest")
make_textbox("c_cast_hint", 875, 534, 372, 80,
             "Click a character in the cast — every panel follows. "
             "Minifig photos: Rebrickable (rebrickable.com).", pt="11pt",
             italic=True)
print("labels + hint created")
