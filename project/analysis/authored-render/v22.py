"""Shared helpers for the v2.2 design uplift (2026-07-15).

Design system distilled from the 2026-07-15 scout run
(research/log/2026-07-15-dashboard-design-uplift.md): modern card surfaces
(rounded corners + soft shadow, no hard 1px border), 8px grid, one hero per
page, restrained type scale. Credits: Lukas Reese, Draft BI, Numerro,
MoonStory, Cole Nussbaumer Knaflic (see CREDITS.md).

Import from a page redesign script:
    from v22 import *
    P = page_dir("s1-home")
"""

import json
import os
import shutil

REPORT = os.path.join("project", "pbip", "second-build.Report", "definition")
PAGES = os.path.join(REPORT, "pages")
SCHEMA_VC = ("https://developer.microsoft.com/json-schemas/fabric/item/report/"
             "definition/visualContainer/2.10.0/schema.json")

# ---- design tokens ----
PARCH = "#F5EFE3"      # canvas
CARD = "#FCF9F1"       # card surface
INK = "#211B14"        # primary text
MUT = "#5C5346"        # secondary text
FAINT = "#706757"      # tertiary / captions (WCAG AA 4.5:1 on card & parchment)
HAIR = "#EAE2D1"       # faint card hairline
GOLD = "#7A5D1D"       # accent (AA on parchment)
ERA1 = "#8C7A5B"       # First Build
ERA2 = "#6E2B25"       # Second Build

# 8px grid
MARGIN = 40
GUTTER = 20
PAD = 24
RADIUS = 14


def page_dir(page):
    return os.path.join(PAGES, page)


def vp(page, vid):
    return os.path.join(PAGES, page, "visuals", vid, "visual.json")


def load(page, vid):
    with open(vp(page, vid), encoding="utf-8") as h:
        return json.load(h)


def save(page, vid, doc):
    with open(vp(page, vid), "w", encoding="utf-8", newline="\n") as h:
        json.dump(doc, h, indent=2, ensure_ascii=False)


def exists(page, vid):
    return os.path.isfile(vp(page, vid))


def delete(page, vid):
    folder = os.path.join(PAGES, page, "visuals", vid)
    if os.path.isdir(folder):
        shutil.rmtree(folder)
        return True
    return False


def lit(v):
    return {"expr": {"Literal": {"Value": v}}}


def solid(c):
    return {"solid": {"color": lit("'" + c + "'")}}


def obj(props, sel=None):
    e = {"properties": props}
    if sel:
        e["selector"] = {"id": sel}
    return e


def rect(page, vid, **kw):
    doc = load(page, vid)
    doc.setdefault("position", {}).update(kw)
    save(page, vid, doc)


def set_z(doc, z):
    doc.setdefault("position", {})["z"] = z


# ---- modern card: rounded shape rectangle with a soft shadow ----
def make_card(page, vid, x, y, w, h, z=40, fill=CARD, radius=RADIUS,
              shadow=True, hairline=HAIR, blur=22, dist=5, transp=88):
    """A designed card background (shape rectangle). Content floats above it."""
    objects = {
        "shape": [obj({"tileShape": lit("'rectangle'"),
                       "rectangleRoundedCurve": lit(f"{radius}D")})],
        "fill": [obj({"show": lit("true"), "fillColor": solid(fill)})],
        "outline": [obj({"show": lit("true" if hairline else "false"),
                         **({"lineColor": solid(hairline),
                             "weight": lit("1D")} if hairline else {})})],
    }
    if shadow:
        objects["shadow"] = [obj({"show": lit("true"), "color": solid(INK),
                                  "shadowBlur": lit(f"{blur}D"),
                                  "shadowDistance": lit(f"{dist}D"),
                                  "transparency": lit(f"{transp}D"),
                                  "shadowPositionPreset": lit("'bottom'")})]
    doc = {
        "$schema": SCHEMA_VC,
        "name": vid,
        "position": {"x": x, "y": y, "z": z, "width": w, "height": h,
                     "tabOrder": 0},
        "visual": {
            "visualType": "shape",
            "objects": objects,
            "visualContainerObjects": {
                "title": [obj({"show": lit("false")})],
                "background": [obj({"show": lit("false")})],
                "border": [obj({"show": lit("false")})],
                "general": [obj({"altText": lit("'Card surface'")})],
            },
        },
    }
    os.makedirs(os.path.dirname(vp(page, vid)), exist_ok=True)
    save(page, vid, doc)


# ---- give an existing data visual (Deneb/table) card chrome via container ----
def card_chrome(page, vid, radius=RADIUS, fill=CARD, hairline=HAIR,
                shadow=True, blur=20, dist=4, transp=88):
    doc = load(page, vid)
    co = doc["visual"].setdefault("visualContainerObjects", {})
    co["background"] = [obj({"show": lit("true"), "color": solid(fill),
                             "transparency": lit("0D")})]
    co["border"] = [obj({"show": lit("true" if hairline else "false"),
                         "color": solid(hairline or HAIR),
                         "radius": lit(f"{radius}D")})]
    if shadow:
        co["dropShadow"] = [obj({"show": lit("true"), "color": solid(INK),
                                 "position": lit("'Outer'"),
                                 "preset": lit("'Bottom'"),
                                 "shadowBlur": lit(f"{blur}D"),
                                 "shadowDistance": lit(f"{dist}D"),
                                 "shadowSpread": lit("0D"),
                                 "transparency": lit(f"{transp}D")})]
    save(page, vid, doc)


# ---- textbox authoring ----
def textbox(page, vid, x, y, w, h, runs, z=300, align="left", tab=25000):
    """runs: list of (text, {style overrides}). One paragraph per run unless
    a run's dict has 'inline': True to keep it on the same line."""
    paras = []
    cur = None
    for text, st in runs:
        style = {"fontFamily": st.get("font", "Segoe UI"),
                 "fontSize": st.get("size", "11pt"),
                 "color": st.get("color", MUT)}
        if st.get("bold"):
            style["fontWeight"] = "bold"
        if st.get("italic"):
            style["italic"] = True
        if "spacing" in st:
            style["letterSpacing"] = st["spacing"]
        run = {"value": text, "textStyle": style}
        if st.get("inline") and cur is not None:
            cur["textRuns"].append(run)
        else:
            cur = {"textRuns": [run], "horizontalTextAlignment": align}
            paras.append(cur)
    doc = {
        "$schema": SCHEMA_VC,
        "name": vid,
        "position": {"x": x, "y": y, "z": z, "width": w, "height": h,
                     "tabOrder": tab},
        "visual": {
            "visualType": "textbox",
            "objects": {"general": [{"properties": {"paragraphs": paras}}]},
            "visualContainerObjects": {
                "background": [obj({"show": lit("false")})],
                "border": [obj({"show": lit("false")})],
            },
            "drillFilterOtherVisuals": False,
        },
    }
    os.makedirs(os.path.dirname(vp(page, vid)), exist_ok=True)
    save(page, vid, doc)


def set_text(page, vid, runs, align=None):
    """Rewrite a textbox's paragraphs in place (preserve position)."""
    doc = load(page, vid)
    paras = []
    cur = None
    for text, st in runs:
        style = {"fontFamily": st.get("font", "Segoe UI"),
                 "fontSize": st.get("size", "11pt"),
                 "color": st.get("color", MUT)}
        if st.get("bold"):
            style["fontWeight"] = "bold"
        if st.get("italic"):
            style["italic"] = True
        if "spacing" in st:
            style["letterSpacing"] = st["spacing"]
        run = {"value": text, "textStyle": style}
        if st.get("inline") and cur is not None:
            cur["textRuns"].append(run)
        else:
            a = align or "left"
            cur = {"textRuns": [run], "horizontalTextAlignment": a}
            paras.append(cur)
    doc["visual"]["objects"]["general"] = [{"properties": {"paragraphs": paras}}]
    save(page, vid, doc)
