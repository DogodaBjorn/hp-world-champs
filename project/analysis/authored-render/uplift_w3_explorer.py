"""W3: turn s2/s3 into interactive era explorers (one-shot transform).

Run after the pbir CLI added bar_sets / sl_year / sl_size / det_* / crd_* to
both chapter pages. Deletes the static gallery + split-rule visuals, creates
the caption/label textboxes, styles the new visuals with brand tokens, fixes
s3's lower band geometry, and writes the cross-filter interaction overrides.
Run once from repo root: python project/analysis/authored-render/uplift_w3_explorer.py
"""

import json
import os
import shutil

PAGES = os.path.join("project", "pbip", "second-build.Report", "definition", "pages")
S2, S3 = "s2-chapter1", "s3-chapter2"
ERA = {S2: "#8C7A5B", S3: "#6E2B25"}
INK, MUT, GOLD = "#211B14", "#5C5346", "#7A5D1D"
SCHEMA = ("https://developer.microsoft.com/json-schemas/fabric/item/report/"
          "definition/visualContainer/2.9.0/schema.json")


def vp(page, vid):
    return os.path.join(PAGES, page, "visuals", vid, "visual.json")


def load(page, vid):
    with open(vp(page, vid), encoding="utf-8") as h:
        return json.load(h)


def save(page, vid, doc):
    with open(vp(page, vid), "w", encoding="utf-8", newline="\n") as h:
        json.dump(doc, h, indent=2, ensure_ascii=False)


def lit(v):
    return {"expr": {"Literal": {"Value": v}}}


def solid(c):
    return {"solid": {"color": lit("'" + c + "'")}}


def obj(props, sel=None):
    entry = {"properties": props}
    if sel:
        entry["selector"] = {"id": sel}
    return entry


# ---- deletions: static gallery, split rules, static palette pct ----
DEL = {
    S2: ["z_gcard_1", "z_gcard_2", "z_gcard_3", "z_gcard_4",
         "img_gset_1", "img_gset_2", "img_gset_3", "img_gset_4",
         "c_gname_1", "c_gname_2", "c_gname_3", "c_gname_4",
         "c_gmeta_1", "c_gmeta_2", "c_gmeta_3", "c_gmeta_4",
         "z_split_l", "z_split_r", "c_split_l", "c_split_r", "c_palette_pct"],
    S3: ["z_gcard_1", "z_gcard_2", "z_gcard_3",
         "img_gset_1", "img_gset_2", "img_gset_3",
         "c_gname_1", "c_gname_2", "c_gname_3",
         "c_gmeta_1", "c_gmeta_2", "c_gmeta_3",
         "z_split_l", "z_split_r", "c_split_l", "c_split_r", "c_palette_pct"],
}
for page, vids in DEL.items():
    for vid in vids:
        folder = os.path.join(PAGES, page, "visuals", vid)
        if os.path.isdir(folder):
            shutil.rmtree(folder)
print("deletions done")

# ---- palette title copy: counts now live in the dynamic card ----
NEW_TITLE = "THE PALETTE IN VIEW — EACH BAR ITS TRUE BRICK HEX"
for page in (S2, S3):
    doc = load(page, "c_palette_title")
    for entry in doc["visual"]["objects"]["general"]:
        for para in entry["properties"].get("paragraphs", []):
            for run in para.get("textRuns", []):
                run["value"] = NEW_TITLE
    save(page, "c_palette_title", doc)
print("palette titles updated")


# ---- caption / label textboxes ----
def make_textbox(page, vid, x, y, w, h, text, pt="11pt", color=MUT,
                 italic=False, bold=False):
    style = {"fontFamily": "Segoe UI", "fontSize": pt, "color": color}
    if italic:
        style["italic"] = True
    if bold:
        style["fontWeight"] = "bold"
    doc = {
        "name": vid,
        "position": {"x": x, "y": y, "z": 340, "width": w, "height": h,
                     "tabOrder": 25000},
        "visual": {
            "visualType": "textbox",
            "objects": {"general": [{"properties": {"paragraphs": [
                {"textRuns": [{"value": text, "textStyle": style}]}]}}]},
            "visualContainerObjects": {
                "background": [obj({"show": lit("false")})],
                "border": [obj({"show": lit("false")})]},
            "drillFilterOtherVisuals": False,
        },
        "$schema": SCHEMA,
    }
    os.makedirs(os.path.dirname(vp(page, vid)), exist_ok=True)
    save(page, vid, doc)


HINT_Y = {S2: 464, S3: 476}
LBL_Y = {S2: 604, S3: 612}
for page in (S2, S3):
    make_textbox(page, "c_explore_hint", 33, HINT_Y[page], 430, 22,
                 "Click a set to inspect it — click again to release.",
                 italic=True)
    for vid, x, label in (("lbl_parts", 589, "parts"),
                          ("lbl_colors", 693, "colors"),
                          ("lbl_gray", 797, "grayscale")):
        make_textbox(page, vid, x, LBL_Y[page], 96, 20, label, pt="10pt")
print("captions/labels created")

# ---- s3 band sits 15px lower than s2 ----
S3_RECT = {"bar_sets": dict(y=498, height=174),
           "det_img": dict(y=480, height=130),
           "det_title": dict(y=480), "det_rank": dict(y=518),
           "det_parts": dict(y=550), "det_colors": dict(y=550),
           "det_gray": dict(y=550),
           "sl_year": dict(y=620, height=52), "sl_size": dict(y=620, height=52)}
for vid, kw in S3_RECT.items():
    doc = load(S3, vid)
    doc["position"].update(kw)
    save(S3, vid, doc)
print("s3 geometry adjusted")

# ---- styling ----
for page in (S2, S3):
    era = ERA[page]

    doc = load(page, "bar_sets")
    doc["position"].update(z=310, tabOrder=20500)
    doc["visual"]["objects"] = {
        "categoryAxis": [obj({"show": lit("true"), "labelColor": solid(MUT),
                              "fontSize": lit("10D"),
                              "fontFamily": lit("'Segoe UI'"),
                              "maxMarginFactor": lit("40D")})],
        "valueAxis": [obj({"show": lit("false")})],
        "labels": [obj({"show": lit("true"), "color": solid(MUT),
                        "fontSize": lit("9D"),
                        "fontFamily": lit("'Segoe UI'")})],
        "dataPoint": [obj({"defaultColor": solid(era)})],
    }
    doc["visual"]["visualContainerObjects"] = {
        "title": [obj({"show": lit("true"),
                       "text": lit("'EVERY SET IN VIEW — TAP A BAR TO INSPECT'"),
                       "fontColor": solid(MUT), "fontSize": lit("10D"),
                       "fontFamily": lit("'Segoe UI'"), "bold": lit("true")})],
    }
    save(page, "bar_sets", doc)

    cards = {"det_title": ("14D", INK, True),
             "det_rank": ("10D", MUT, False),
             "det_parts": ("20D", INK, True),
             "det_colors": ("20D", INK, True),
             "det_gray": ("20D", INK, True),
             "crd_palette_pct": ("10D", MUT, False)}
    for vid, (fs, color, bold) in cards.items():
        doc = load(page, vid)
        doc["position"]["z"] = 330
        props = {"fontSize": lit(fs), "color": solid(color),
                 "fontFamily": lit("'Georgia'" if bold else "'Segoe UI'")}
        if bold:
            props["bold"] = lit("true")
        doc["visual"]["objects"] = {
            "labels": [obj(props)],
            "categoryLabels": [obj({"show": lit("false")})]}
        if vid in ("det_title", "det_rank", "crd_palette_pct"):
            doc["visual"]["visualContainerObjects"] = {
                "background": [obj({"show": lit("false")})],
                "border": [obj({"show": lit("false")})]}
        save(page, vid, doc)

    doc = load(page, "sl_year")
    doc["position"]["z"] = 320
    doc["visual"]["objects"] = {
        "data": [obj({"mode": lit("'Between'")})],
        "header": [obj({"show": lit("true"), "fontColor": solid(MUT),
                        "textSize": lit("10D")})],
        "items": [obj({"fontColor": solid(INK), "textSize": lit("10D")})],
        "slider": [obj({"color": solid(GOLD)})],
    }
    doc["visual"]["visualContainerObjects"] = {
        "background": [obj({"show": lit("false")})],
        "border": [obj({"show": lit("false")})]}
    save(page, "sl_year", doc)

    doc = load(page, "sl_size")
    doc["position"]["z"] = 320
    doc["visual"]["visualContainerObjects"] = {
        "background": [obj({"show": lit("false")})],
        "border": [obj({"show": lit("false")})]}
    save(page, "sl_size", doc)

    doc = load(page, "det_img")
    doc["position"]["z"] = 320
    doc["visual"]["objects"] = {
        "columnHeaders": [obj({"show": lit("false")})],
        "grid": [obj({"gridVertical": lit("false"),
                      "gridHorizontal": lit("false")})]}
    save(page, "det_img", doc)
print("styling done")

# ---- cross-filter overrides: bar/size clicks FILTER the Deneb charts ----
for page in (S2, S3):
    pj_path = os.path.join(PAGES, page, "page.json")
    with open(pj_path, encoding="utf-8") as h:
        pj = json.load(h)
    pj["visualInteractions"] = [
        {"source": "bar_sets", "target": "dn_dist", "type": "DataFilter"},
        {"source": "bar_sets", "target": "dn_palette", "type": "DataFilter"},
        {"source": "sl_size", "target": "dn_dist", "type": "DataFilter"},
    ]
    with open(pj_path, "w", encoding="utf-8", newline="\n") as h:
        json.dump(pj, h, indent=2, ensure_ascii=False)
print("interactions set")
