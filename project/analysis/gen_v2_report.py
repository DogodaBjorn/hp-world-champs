"""two-marriages-v2 report generator — pixel-perfect rebuild from the HTML
handoff (design_handoff_powerbi/). Every position in this file is a MEASURED
value from design_handoff_powerbi/layout.json (Playwright getBoundingClientRect
against the hi-fi prototype at exactly 1280x720) — never eyeballed, per the
powerbi-pixel-perfect skill. Text px sizes map to PBIR pt as round(px * 0.75)
(deviation <= 0.4pt, recorded in 06-build.md).

All JSON shapes are proven: v1 report (textbox/shape/actionButton/pivotTable/
bookmarks/filters), the Round 2 starter report (image + RegisteredResources),
the KTO repo (card), and the official Deneb PBIR guide (visualType GUID +
objects.vega). Deneb specs live in project/deliverables/deneb-specs/ (source
of truth) and are embedded verbatim.

Run:  python project/analysis/gen_v2_report.py   (rewrites the whole
two-marriages-v2.Report definition; RegisteredResources images are produced
by fetch_v2_assets.py and left untouched).
"""

import json
import os
import shutil
import sys

sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
REPORT = os.path.join(REPO, "project", "pbip", "two-marriages-v2.Report")
DEF = os.path.join(REPORT, "definition")
PAGES = os.path.join(DEF, "pages")
SPECS = os.path.join(REPO, "project", "deliverables", "deneb-specs")
HANDOFF = os.path.join(REPO, "design_handoff_powerbi")

VC_SCHEMA = "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.10.0/schema.json"
PAGE_SCHEMA = "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json"
DENEB = "deneb7E15AEF80B9E4D4F8E12924291ECE89A"

SERIF = "Georgia"          # user-approved Crimson Pro fallback (flagged)
SANS = "Segoe UI"
INK = "#211B14"; MUT = "#5C5346"; RULE = "#D8CFBC"; GOLD = "#8A6A21"
CARD_BG = "#FCF9F1"; PAGE_BG = "#F5EFE3"
ERA1 = "#8C7A5B"; ERA2 = "#6E2B25"; GREEN = "#2E5941"
D_BG = "#15120E"; D_TXT = "#CFC9BE"; D_MUT = "#948D80"; D_ACC = "#D95F4B"; D_RULE = "#3A342B"

_written = []


def lit(v):
    if isinstance(v, bool):
        return {"expr": {"Literal": {"Value": "true" if v else "false"}}}
    if isinstance(v, (int, float)):
        return {"expr": {"Literal": {"Value": f"{v}D"}}}
    return {"expr": {"Literal": {"Value": "'" + str(v).replace("'", "''") + "'"}}}


def sol(hexv):
    return {"solid": {"color": lit(hexv)}}


def col(entity, prop):
    return {"Column": {"Expression": {"SourceRef": {"Entity": entity}}, "Property": prop}}


def mea(entity, prop):
    return {"Measure": {"Expression": {"SourceRef": {"Entity": entity}}, "Property": prop}}


def proj(field, entity, prop, display=None, active=None):
    p = {"field": field, "queryRef": f"{entity}.{prop}", "nativeQueryRef": display or prop}
    if display:
        p["displayName"] = display
    if active is not None:
        p["active"] = active
    return p


def in_filter(name, entity, prop, values):
    return {
        "name": name,
        "field": col(entity, prop),
        "type": "Categorical",
        "filter": {
            "Version": 2,
            "From": [{"Name": "f", "Entity": entity, "Type": 0}],
            "Where": [{"Condition": {"In": {
                "Expressions": [{"Column": {"Expression": {"SourceRef": {"Source": "f"}}, "Property": prop}}],
                "Values": [[{"Literal": {"Value": f"'{v}'"}}] for v in values],
            }}}],
        },
        "howCreated": "User",
    }


class Page:
    def __init__(self, name, display, w=1280, h=720, bg=PAGE_BG, hidden=False,
                 tooltip=False, filters=None):
        self.name, self.display = name, display
        self.w, self.h, self.bg = w, h, bg
        self.hidden, self.tooltip, self.filters = hidden, tooltip, filters
        self.visuals = []
        self._z = 100
        self._tab = 1000

    def nz(self, z=None):
        self._z += 10
        return z if z is not None else self._z

    def nt(self):
        self._tab += 1000
        return self._tab

    def add(self, name, rect, visual, z=None, tab_last=False, filters=None):
        x, y, w, h = rect
        node = {
            "$schema": VC_SCHEMA,
            "name": name,
            "position": {"x": x, "y": y, "z": self.nz(z), "height": h, "width": w,
                         "tabOrder": 99000 if tab_last else self.nt()},
            "visual": visual,
        }
        if filters:
            node["filterConfig"] = {"filters": filters}
        self.visuals.append(node)
        return node

    # ---------------------------------------------------------- factories
    def container(self, alt, bg=None, border=None, radius=0, title=None):
        vco = {}
        vco["title"] = [{"properties": {"show": lit(False)}}] if title is None else [
            {"properties": {"show": lit(True), "text": lit(title)}}]
        vco["background"] = [{"properties": ({"show": lit(True), "color": sol(bg), "transparency": lit(0)}
                                             if bg else {"show": lit(False)})}]
        vco["border"] = [{"properties": ({"show": lit(True), "color": sol(border), "radius": lit(radius), "width": lit(1)}
                                         if border else {"show": lit(False)})}]
        vco["general"] = [{"properties": {"altText": lit(alt)}}]
        return vco

    def textbox(self, name, rect, paras, alt, align=None, bg=None, border=None, z=None):
        paragraphs = []
        for p in paras:
            runs = []
            for r in p:
                style = {"fontFamily": r.get("font", SANS), "fontSize": f"{r['pt']}pt", "color": r.get("color", INK)}
                if r.get("bold"):
                    style["fontWeight"] = "bold"
                if r.get("italic"):
                    style["fontStyle"] = "italic"
                runs.append({"value": r["t"], "textStyle": style})
            para = {"textRuns": runs}
            if align:
                para["horizontalTextAlignment"] = align
            paragraphs.append(para)
        return self.add(name, rect, {
            "visualType": "textbox",
            "objects": {"general": [{"properties": {"paragraphs": paragraphs}}]},
            "visualContainerObjects": self.container(alt, bg=bg, border=border),
        }, z=z)

    def shape(self, name, rect, fill, alt="Decorative rule", outline=None, z=None):
        objs = {
            "shape": [{"properties": {"tileShape": lit("rectangle")}}],
            "fill": [{"properties": ({"show": lit(True), "fillColor": sol(fill)} if fill else {"show": lit(False)})}],
            "outline": [{"properties": ({"show": lit(True), "lineColor": sol(outline), "weight": lit(1)}
                                        if outline else {"show": lit(False)})}],
        }
        return self.add(name, rect, {"visualType": "shape", "objects": objs,
                                     "visualContainerObjects": self.container(alt)}, z=z)

    def image(self, name, rect, item, alt, scaling="Fit", z=None):
        return self.add(name, rect, {
            "visualType": "image",
            "objects": {"image": [{"properties": {"sourceFile": {"image": {
                "name": lit(item),
                "url": {"expr": {"ResourcePackageItem": {"PackageName": "RegisteredResources",
                                                         "PackageType": 1, "ItemName": item}}},
                "scaling": lit(scaling),
            }}}}]},
            "visualContainerObjects": self.container(alt),
            "drillFilterOtherVisuals": True,
        }, z=z)

    def card(self, name, rect, entity, measure, alt, pt, color=INK, font=SERIF, bold=True, z=None):
        return self.add(name, rect, {
            "visualType": "card",
            "query": {"queryState": {"Values": {"projections": [proj(mea(entity, measure), entity, measure)]}}},
            "objects": {
                "labels": [{"properties": {"fontFamily": lit(font), "fontSize": lit(pt),
                                           "bold": lit(bold), "color": sol(color)}}],
                "categoryLabels": [{"properties": {"show": lit(False)}}],
                "wordWrap": [{"properties": {"show": lit(False)}}],
            },
            "visualContainerObjects": self.container(alt),
            "drillFilterOtherVisuals": True,
        }, z=z)

    def deneb(self, name, rect, spec_file, projections, alt, z=None, filters=None):
        with open(os.path.join(SPECS, spec_file), encoding="utf-8") as fh:
            spec = json.load(fh)
        node = {
            "visualType": DENEB,
            "objects": {"vega": [{"properties": {
                "jsonSpec": lit(json.dumps(spec, separators=(",", ":"))),
                "jsonConfig": lit("{}"),
                "provider": lit("vegaLite"),
            }}]},
            "visualContainerObjects": self.container(alt),
            "drillFilterOtherVisuals": True,
        }
        if projections:
            node["query"] = {"queryState": {"dataset": {"projections": projections}}}
        return self.add(name, rect, node, z=z, filters=filters)

    def button(self, name, rect, alt, action, target, tooltip=None, z=None):
        link = {"show": lit(True), "type": lit(action)}
        if action == "PageNavigation":
            link["navigationSection"] = lit(target)
        else:
            link["bookmark"] = lit(target)
        vco = self.container(alt)
        vco["visualLink"] = [{"properties": link}]
        if tooltip:
            vco["title"] = [{"properties": {"text": lit(tooltip)}}]
        return self.add(name, rect, {
            "visualType": "actionButton",
            "objects": {"icon": [{"properties": {"shapeType": lit("blank")}, "selector": {"id": "default"}}]},
            "visualContainerObjects": vco,
        }, z=z if z is not None else 900)

    def fig_matrix(self, name, rect, fig_nums, alt, z=None):
        """Single-image (or few-image) minifig strip: v1's proven pivotTable
        ImageUrl pattern; hosts the T1 report-page tooltip (wired in Desktop)."""
        q = {"queryState": {
            "Rows": {"projections": [proj(col("Minifigs", "img_url"), "Minifigs", "img_url", active=True)]},
            "Values": {"projections": [proj(mea("_Measures", "Minifig Variants"), "_Measures", "Minifig Variants")]},
        }}
        return self.add(name, rect, {
            "visualType": "pivotTable",
            "query": q,
            "objects": {
                "grid": [{"properties": {"gridVertical": lit(False), "gridHorizontal": lit(False),
                                         "rowPadding": lit(2), "textSize": lit(8)}}],
                "columnHeaders": [{"properties": {"fontColor": sol(CARD_BG), "backColor": sol(CARD_BG), "fontSize": lit(8)}}],
                "rowHeaders": [{"properties": {"fontColor": sol(INK), "backColor": sol(CARD_BG)}}],
                "values": [{"properties": {"fontColorPrimary": sol(CARD_BG), "backColorPrimary": sol(CARD_BG), "fontSize": lit(8)}}],
                "subTotals": [{"properties": {"rowSubtotals": lit(False), "columnSubtotals": lit(False)}}],
            },
            "visualContainerObjects": self.container(alt),
            "drillFilterOtherVisuals": True,
        }, z=z, filters=[in_filter(f"flt_{name}", "Minifigs", "fig_num", fig_nums)] if fig_nums else None)

    # ------------------------------------------------------ composite bits
    def footer(self, right_text, rule=RULE, txt=MUT):
        self.shape("z_footer_rule", (0, 692, 1280, 1), rule, z=50)
        self.textbox("c_footer_l", (28, 695, 520, 22),
                     [[{"t": "Source: Rebrickable LEGO Database (rebrickable.com)", "pt": 9, "color": txt}]],
                     "Source: Rebrickable LEGO Database (rebrickable.com)")
        self.textbox("c_footer_r", (700, 695, 552, 22),
                     [[{"t": right_text, "pt": 9, "color": txt}]], right_text, align="right")

    def header_band(self, eyebrow, eyebrow_color, title, subtitle, sub_font=SERIF, sub_italic=True, sub_pt=14):
        self.textbox("c_eyebrow", (28, 44, 110, 24),
                     [[{"t": eyebrow, "pt": 10, "bold": True, "color": eyebrow_color}]], f"Chapter eyebrow: {eyebrow}")
        self.textbox("c_title", (121, 25, 560, 48),
                     [[{"t": title, "pt": 29, "bold": True, "font": SERIF, "color": INK}]], f"Page title: {title}")
        self.textbox("c_subtitle", (800, 42, 448, 26),
                     [[{"t": subtitle, "pt": sub_pt, "italic": sub_italic, "font": sub_font, "color": MUT}]],
                     f"Subtitle: {subtitle}", align="right")
        self.shape("z_header_rule", (0, 83, 1280, 1), RULE, z=50)

    # ------------------------------------------------------------- output
    def write(self):
        pdir = os.path.join(PAGES, self.name)
        os.makedirs(pdir, exist_ok=True)
        page = {
            "$schema": PAGE_SCHEMA,
            "name": self.name,
            "displayName": self.display,
            "displayOption": "FitToPage",
            "height": self.h,
            "width": self.w,
        }
        if self.tooltip:
            page["type"] = "Tooltip"
        if self.hidden:
            page["visibility"] = "HiddenInViewMode"
        if self.filters:
            page["filterConfig"] = {"filters": self.filters}
        page["objects"] = {"background": [{"properties": {"color": sol(self.bg), "transparency": lit(0)}}]}
        _write_json(os.path.join(pdir, "page.json"), page)
        for v in self.visuals:
            vdir = os.path.join(pdir, "visuals", v["name"])
            os.makedirs(vdir, exist_ok=True)
            _write_json(os.path.join(vdir, "visual.json"), v)


def _write_json(path, obj):
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    _written.append(path)


# ======================================================================= S1
def build_s1():
    p = Page("s1-home", "Home")
    p.shape("z_rule_v", (356, 0, 1, 692), RULE, z=40)
    p.image("img_mark_spectacles", (29, 27, 66, 30), "glyph_spectacles.png",
            "Round spectacles with a lightning bolt — the report's Harry Potter mark")
    p.image("img_mark_brick", (109, 28, 46, 27), "glyph_brick_red.png", "A red two-stud LEGO brick glyph")
    p.textbox("c_eyebrow", (24, 68, 310, 22),
              [[{"t": "A LEGO RETROSPECTIVE · 2001–2026", "pt": 10, "bold": True, "color": GOLD}]],
              "A LEGO retrospective, 2001 to 2026")
    p.textbox("c_title", (24, 92, 320, 108),
              [[{"t": "The Boy Who Came Back", "pt": 36, "bold": True, "font": SERIF, "color": INK}]],
              "The Boy Who Came Back")
    p.image("img_ornament", (29, 210, 112, 22), "glyph_ornament.png",
            "Two brick studs in the two era colors — decorative ornament")
    p.shape("z_takeaway_box", (29, 246, 299, 190), CARD_BG, outline=RULE, z=60)
    p.textbox("c_takeaway_eyebrow", (41, 260, 270, 22),
              [[{"t": "KEY TAKEAWAY", "pt": 9, "bold": True, "color": GOLD}]], "Key takeaway")
    p.textbox("c_takeaway_body", (41, 284, 275, 145),
              [[{"t": "LEGO Harry Potter vanished for seven years. It returned in 2018 at nearly triple the scale — bigger sets, more colors, aimed at the readers who grew up. Two marriages, one franchise, told in 576 minifigures.",
                 "pt": 11, "color": INK}]],
              "LEGO Harry Potter vanished for seven years and returned in 2018 at nearly triple the scale")
    minis = [("67 → 142", "sets"), ("267 → 731", "avg parts"), ("66 → 79", "colors")]
    for i, (v, l) in enumerate(minis):
        x = 29 + i * 103
        p.shape(f"z_kpi_strip_{i+1}", (x, 450, 93, 2), ERA1, z=60)
        p.textbox(f"c_kpi_v_{i+1}", (x - 5, 455, 103, 28),
                  [[{"t": v, "pt": 15, "bold": True, "font": SERIF, "color": INK}]], f"{l}: {v}")
        p.textbox(f"c_kpi_l_{i+1}", (x - 5, 480, 103, 20), [[{"t": l, "pt": 9, "color": MUT}]], l)
    nav = [("I · The Yellow Years", "s2-chapter1", "glyph_nav_1.png"),
           ("II · The Boy Who Grew Up", "s3-chapter2", "glyph_nav_2.png"),
           ("III · Chamber of Colors", "s4a-most-colorful", "glyph_nav_3.png"),
           ("IV · The Sorting Ceremony", "s5-sorting-quiz", "glyph_nav_4.png")]
    for i, (label, target, glyph) in enumerate(nav):
        bx = 29 + (i % 2) * 154.5
        by = 552 + (i // 2) * 66
        p.shape(f"z_btn_box_{i+1}", (bx, by, 144.5, 56), CARD_BG, outline=INK, z=200)
        p.image(f"img_btn_glyph_{i+1}", (bx + 12, by + 22, 18, 12), glyph, f"Brick glyph for chapter {i+1}", z=210)
        p.textbox(f"c_btn_label_{i+1}", (bx + 33, by + 8, 105, 44),
                  [[{"t": label, "pt": 10, "bold": True, "color": INK}]], label, z=220)
        p.button(f"btn_nav_{i+1}", (bx, by, 144.5, 56), f"Navigate to {label}", "PageNavigation", target,
                 tooltip=f"Go to {label}")
    p.textbox("c_chart_title", (384, 28, 400, 22),
              [[{"t": "PARTS SHIPPED PER YEAR", "pt": 10, "bold": True, "color": MUT}]], "Parts shipped per year")
    p.textbox("c_legend", (860, 28, 392, 22),
              [[{"t": "■ ", "pt": 9, "color": ERA1}, {"t": "First marriage 2001–2011   ", "pt": 9, "color": INK},
                {"t": "■ ", "pt": 9, "color": ERA2}, {"t": "Second marriage 2018–2026", "pt": 9, "color": INK}]],
              "Legend: warm brown is the first marriage 2001 to 2011, deep red is the second marriage 2018 to 2026",
              align="right")
    p.deneb("dn_hero", (389, 204, 859, 445), "dn_hero.json",
            [proj(col("DimYear", "Year"), "DimYear", "Year", display="Year"),
             proj(mea("_Measures", "Parts per Year"), "_Measures", "Parts per Year", display="Parts per Year")],
            "Brick-style column chart of catalog parts shipped per year, 2001 to 2026. The line vanishes to zero "
            "for 2012 through 2017 — the seven silent years — then returns in 2018 at nearly triple the scale.")
    p.textbox("c_silence_1", (714, 152, 182, 34),
              [[{"t": "seven silent years", "pt": 18, "italic": True, "font": SERIF, "color": GOLD}]],
              "seven silent years", align="center", z=800)
    p.textbox("c_silence_2", (714, 185, 182, 20),
              [[{"t": "2012–2017 · zero sets", "pt": 9, "color": MUT}]], "2012 to 2017, zero sets",
              align="center", z=800)
    p.shape("z_brk_h", (719, 210, 172, 1), GOLD, z=800)
    p.shape("z_brk_l", (719, 206, 1, 5), GOLD, z=800)
    p.shape("z_brk_r", (890, 206, 1, 5), GOLD, z=800)
    p.shape("z_axis_rule", (389, 656, 859, 1), RULE, z=50)
    p.textbox("c_axis_1", (389, 659, 363, 20), [[{"t": "First marriage", "pt": 8, "color": MUT}]],
              "Era band: first marriage", align="center")
    p.textbox("c_axis_2", (752, 659, 198, 20), [[{"t": "the silence", "pt": 8, "italic": True, "color": MUT}]],
              "Era band: the silence", align="center")
    p.textbox("c_axis_3", (950, 659, 298, 20), [[{"t": "Second marriage", "pt": 8, "color": MUT}]],
              "Era band: second marriage", align="center")
    p.footer("Home · 1 of 5 · no sets released 2006 · 2008 · 2009")
    return p


# ==================================================================== S2/S3
KPI_DEFS = [("Total Sets", "sets", 46), ("Avg Parts", "avg parts per set", 60), ("Largest Set", "largest set (parts)", 88),
            ("Distinct Colors", "distinct colors", 46), ("Grayscale %", "grayscale bricks", 64)]
KPI_X = [33, 280.6, 528.2, 775.8, 1023.4]


def build_era_page(name, display, era, strip, subtitle, kpi_color, kpi_labels_extra, dist_spec, dist_rect,
                   palette_rect, palette_title, pct_label, split_l, split_r, gallery, gallery_geo, figcard, footer_r):
    p = Page(name, display, filters=[in_filter(f"flt_{name}_era", "Sets", "Era", [era])])
    p.header_band(strip["eyebrow"], strip["color"], strip["title"], subtitle)
    for i, ((measure, label, w), x) in enumerate(zip(KPI_DEFS, KPI_X)):
        label = kpi_labels_extra.get(label, label)
        p.shape(f"z_kpi_strip_{i+1}", (x, 100, 215.6, 2), strip["era_hex"], z=60)
        p.card(f"kpi_{i+1}", (x - 4, 103, w, 44), "_Measures", measure,
               f"{label}: era value", pt=22.5, color=kpi_color)
        p.textbox(f"c_kpi_l_{i+1}", (x - 5, 139, 216, 20), [[{"t": label, "pt": 9, "color": MUT}]], label)
    p.textbox("c_dist_title", (28, 174, 435, 20),
              [[{"t": strip["dist_title"], "pt": 9, "bold": True, "color": MUT}]], strip["dist_title"])
    p.deneb("dn_dist", dist_rect, dist_spec,
            [proj(col("Sets", "Size Bin"), "Sets", "Size Bin", display="Size Bin"),
             proj(mea("_Measures", "Total Sets"), "_Measures", "Total Sets", display="Total Sets")],
            f"Brick-style column chart: number of sets per size bin for the {era.lower()} era.")
    p.textbox("c_palette_title", (482, 174, 430, 20),
              [[{"t": palette_title, "pt": 9, "bold": True, "color": MUT}]], palette_title)
    p.textbox("c_palette_pct", (1100, 174, 148, 20),
              [[{"t": pct_label[0], "pt": 9, "bold": True, "color": MUT}, {"t": " grayscale", "pt": 9, "color": MUT}]],
              f"{pct_label[0]} of parts are grayscale", align="right")
    p.deneb("dn_palette", palette_rect, "dn_palette.json",
            [proj(col("Colors", "Hex"), "Colors", "Hex", display="Hex"),
             proj(col("Colors", "IsGrayscale"), "Colors", "IsGrayscale", display="IsGrayscale"),
             proj(col("Colors", "Luminance"), "Colors", "Luminance", display="Luminance"),
             proj(mea("_Measures", "Color Parts"), "_Measures", "Color Parts", display="Color Parts")],
            f"The era palette: one vertical cell per distinct brick color used in the {era.lower()} era, "
            "grayscale cells first sorted dark to light, each cell filled with its true brick hex.")
    sy = split_l["y"]
    p.shape("z_split_l", (487, sy, split_l["w"], 2), INK, z=60)
    p.shape("z_split_r", (487 + split_l["w"], sy, split_r["w"], 2), GOLD, z=60)
    p.textbox("c_split_l", (482, sy + 3, 220, 18), [[{"t": split_l["t"], "pt": 8, "color": MUT}]], split_l["t"])
    p.textbox("c_split_r", (1030, sy + 3, 218, 18), [[{"t": split_r["t"], "pt": 8, "color": MUT}]],
              split_r["t"], align="right")
    gx, gy, gw, gh, img_h = gallery_geo
    for i, (img, gname, meta) in enumerate(gallery):
        x = gx + i * (gw + 20)
        p.shape(f"z_gcard_{i+1}", (x, gy, gw, gh), CARD_BG, outline=RULE, z=100)
        p.image(f"img_gset_{i+1}", (x + 11, gy + 11, gw - 22, img_h), img, f"Set photo: {gname}", z=120)
        p.textbox(f"c_gname_{i+1}", (x + 6, gy + 11 + img_h + 6, gw - 12, 20),
                  [[{"t": gname, "pt": 10, "bold": True, "color": INK}]], gname, z=130)
        p.textbox(f"c_gmeta_{i+1}", (x + 6, gy + 11 + img_h + 24, gw - 12, 34),
                  [[{"t": meta, "pt": 9, "color": MUT}]], meta, z=130)
    figcard(p)
    p.footer(footer_r)
    return p


def build_s2():
    def figcard(p):
        p.shape("z_figcard", (917, 477, 330, 195), CARD_BG, outline=RULE, z=100)
        p.textbox("c_figcard_title", (923, 483, 315, 18),
                  [[{"t": "THE YELLOW YEARS — CLASSIC FACES", "pt": 8, "bold": True, "color": MUT}]],
                  "The yellow years — classic faces", z=120)
        figs = [("fig-000471", "Harry · 22 variants"), ("fig-000593", "Hermione · 9"),
                ("fig-000594", "Ron · 10"), ("fig-006056", "Dumbledore · 4")]
        for i, (fig, cap) in enumerate(figs):
            x = 929 + i * 76
            p.fig_matrix(f"tbl_fig_{i+1}", (x, 505, 70, 100), [fig],
                         f"Minifigure photo, {cap} — hover for details", z=120)
            p.textbox(f"c_figcap_{i+1}", (x - 4, 606, 78, 34), [[{"t": cap, "pt": 8, "color": MUT}]],
                      cap, align="center", z=120)
    return build_era_page(
        "s2-chapter1", "Chapter I", "First marriage",
        {"eyebrow": "CHAPTER I", "color": GOLD, "title": "The Yellow Years · 2001–2011",
         "era_hex": ERA1, "dist_title": "SETS BY SIZE — PARTS PER SET"},
        "A modest toy line in classic yellow.", INK, {},
        "dn_dist_era1.json", (33, 190, 430, 267), (487, 205, 761, 230),
        "THE ERA PALETTE — 66 COLORS, EACH BAR ITS TRUE BRICK HEX", ("51%",),
        {"y": 439, "w": 387.6, "t": "grayscale · 51%"}, {"w": 372.4, "t": "color · 49%"},
        [("img_set_4709_1.jpg", "Hogwarts Castle", "2001 · 696 parts"),
         ("img_set_10217_1.jpg", "Diagon Alley", "2011 · 2,029 parts — the era's largest"),
         ("img_set_10132_1.jpg", "Motorized Hogwarts Express", "2004 · 713 parts"),
         ("img_set_4842_1.jpg", "Hogwarts Castle", "2010 · 1,291 parts")],
        (33, 477, 201, 195, 118), figcard, "Chapter I · 2 of 5")


def build_s3():
    def figcard(p):
        p.shape("z_oldnew_box", (867, 492, 380, 180), CARD_BG, outline=GOLD, z=100)
        p.textbox("c_oldnew_title", (873, 496, 368, 18),
                  [[{"t": "OLD VS NEW — HERMIONE · 9 OLD, 33 NEW", "pt": 8, "bold": True, "color": GOLD}]],
                  "Old versus new — Hermione: 9 old variants, 33 new", z=120)
        p.fig_matrix("tbl_fig_old", (878, 520, 121, 100), ["fig-000593"],
                     "Hermione minifigure from 2001, yellow skin — hover for details", z=120)
        p.fig_matrix("tbl_fig_new", (1009, 520, 121, 100), ["fig-013032"],
                     "Hermione minifigure from 2026, flesh tone — hover for details", z=120)
        p.textbox("c_figcap_old", (878, 622, 121, 18), [[{"t": "2001 · yellow skin", "pt": 8, "color": MUT}]],
                  "2001, yellow skin", align="center", z=120)
        p.textbox("c_figcap_new", (1009, 622, 121, 18), [[{"t": "2026 · flesh tone", "pt": 8, "color": MUT}]],
                  "2026, flesh tone", align="center", z=120)
        p.textbox("c_oldnew_note", (1138, 545, 100, 80),
                  [[{"t": "22 old vs 59 new Harrys · 44 characters span both eras", "pt": 8, "color": MUT}]],
                  "22 old versus 59 new Harry variants; 44 characters span both eras", z=120)
    return build_era_page(
        "s3-chapter2", "Chapter II", "Second marriage",
        {"eyebrow": "CHAPTER II", "color": GOLD, "title": "The Boy Who Grew Up · 2018–",
         "era_hex": ERA2, "dist_title": "SETS BY SIZE — SAME BINS, HEAVIER TAIL"},
        "It came back for the grown-ups.", ERA2, {"avg parts per set": "avg parts per set · 2.7×"},
        "dn_dist_era2.json", (33, 190, 430, 282), (487, 205, 761, 245),
        "THE ERA PALETTE — 79 COLORS, EACH BAR ITS TRUE BRICK HEX", ("41%",),
        {"y": 454, "w": 311.6, "t": "grayscale · 41%"}, {"w": 448.4, "t": "color · 59%"},
        [("img_set_71043_1.jpg", "Hogwarts Castle", "2018 · 6,020 parts — the era's largest"),
         ("img_set_76444_1.jpg", "Diagon Alley Wizarding Shops", "2025 · 55 colors"),
         ("img_set_75978_1.jpg", "Diagon Alley", "2020 · 5,548 parts")],
        (33, 492, 258, 180, 118), figcard, "Chapter II · 3 of 5")


# ====================================================================== S4a
def build_s4a():
    p = Page("s4a-most-colorful", "Chapter III",
             filters=[in_filter("flt_s4a_set", "Sets", "set_num", ["76444-1"])])
    p.textbox("c_eyebrow", (28, 30, 445, 22),
              [[{"t": "CHAPTER III · THE CHAMBER OF COLORS", "pt": 10, "bold": True, "color": GOLD}]],
              "Chapter III: the Chamber of Colors")
    p.card("kpi_hero_colors", (33, 64, 185, 150), "_Measures", "Distinct Colors",
           "55 — distinct brick colors in Diagon Alley Wizarding Shops, the page's hero number", pt=128)
    p.textbox("c_subhead", (28, 222, 445, 40),
              [[{"t": "distinct colors in one set", "pt": 21, "bold": True, "font": SERIF, "color": INK}]],
              "distinct colors in one set")
    p.textbox("c_body", (28, 268, 390, 80),
              [[{"t": "Diagon Alley Wizarding Shops", "pt": 11, "bold": True, "color": INK},
                {"t": " (2025) is the ", "pt": 11, "color": INK},
                {"t": "#2 most colorful LEGO set ever made — of any theme, ever.", "pt": 11, "bold": True, "color": INK},
                {"t": " 2,750 parts across 55 real brick colors.", "pt": 11, "color": INK}]],
              "Diagon Alley Wizarding Shops (2025) is the number 2 most colorful LEGO set ever made, "
              "of any theme: 2,750 parts across 55 real brick colors.")
    p.shape("z_btn_dark_box", (33, 476, 334, 42), CARD_BG, outline=INK, z=200)
    p.textbox("c_btn_dark", (42, 487, 320, 24),
              [[{"t": "Prefer the least colorful? Come to the dark side →", "pt": 10, "bold": True, "color": INK}]],
              "Prefer the least colorful? Come to the dark side", z=210)
    p.button("btn_dark_side", (33, 476, 334, 42), "Switch to the dark state: the grayest set",
             "Bookmark", "bm_dark", tooltip="Come to the dark side")
    p.image("img_diagon", (504, 32, 744, 520), "img_set_76444_1.jpg",
            "Product photo of LEGO set 76444, Diagon Alley Wizarding Shops")
    p.textbox("c_comp_title", (28, 548, 530, 20),
              [[{"t": "COLOR COMPOSITION — ALL 55 MARKS IN TRUE HEX, ORDERED BY PART COUNT", "pt": 9, "bold": True, "color": MUT}]],
              "Color composition: all 55 marks in true hex, ordered by part count")
    p.textbox("c_comp_note", (1008, 547, 240, 20),
              [[{"t": "segment width binds to part count per color", "pt": 9, "color": MUT}]],
              "Segment width binds to part count per color", align="right")
    p.deneb("dn_comp", (33, 574, 1214, 100), "dn_comp55.json",
            [proj(col("SetColors", "color_hex"), "SetColors", "color_hex", display="color_hex"),
             proj(mea("_Measures", "Color Parts"), "_Measures", "Color Parts", display="Color Parts")],
            "One horizontal stacked bar: the 55 colors of Diagon Alley Wizarding Shops, each segment's "
            "width its share of parts, each filled with its true brick hex, ordered by part count.")
    p.footer("Chapter III · 4 of 5")
    return p


# ====================================================================== S4b
def build_s4b():
    p = Page("s4b-dark-state", "Chapter III · Dark", bg=D_BG, hidden=True)
    p.textbox("c_eyebrow", (28, 30, 445, 22),
              [[{"t": "CHAPTER III · THE CHAMBER OF GRAYS", "pt": 10, "bold": True, "color": D_ACC}]],
              "Chapter III: the Chamber of Grays")
    p.textbox("c_hero_gray", (28, 64, 445, 135),
              [[{"t": "97.9%", "pt": 113, "bold": True, "font": SERIF, "color": D_TXT}]],
              "97.9 percent — grayscale share of Vader's TIE Advanced, the grayest large Star Wars set")
    p.textbox("c_subhead", (28, 205, 445, 40),
              [[{"t": "grayscale bricks", "pt": 21, "bold": True, "font": SERIF, "color": D_TXT}]],
              "grayscale bricks")
    p.textbox("c_body", (28, 250, 390, 58),
              [[{"t": "Vader's TIE Advanced", "pt": 11, "bold": True, "color": D_TXT},
                {"t": " (2006), from Star Wars — LEGO's grayest theme. Harry Potter is its most colorful license.",
                 "pt": 11, "color": D_TXT}]],
              "Vader's TIE Advanced (2006), from Star Wars, LEGO's grayest theme. "
              "Harry Potter is its most colorful license.")
    p.textbox("c_duo_sw", (28, 315, 140, 20),
              [[{"t": "Star Wars ", "pt": 9, "color": D_TXT}, {"t": "~72%", "pt": 9, "bold": True, "color": D_TXT},
                {"t": " gray", "pt": 9, "color": D_TXT}]], "Star Wars: about 72 percent gray")
    p.textbox("c_duo_hp", (172, 339, 140, 20),
              [[{"t": "Harry Potter ", "pt": 9, "color": D_TXT}, {"t": "~42%", "pt": 9, "bold": True, "color": D_TXT},
                {"t": " gray", "pt": 9, "color": D_TXT}]], "Harry Potter: about 42 percent gray")
    p.deneb("dn_duo", (33, 340, 274, 63), "dn_duo.json", None,
            "Two mini brick columns comparing grayscale share: Star Wars about 72 percent, "
            "Harry Potter about 42 percent.")
    p.shape("z_btn_light_box", (33, 476, 150, 42), None, outline=D_TXT, z=200)
    p.textbox("c_btn_light", (44, 487, 132, 24),
              [[{"t": "← Back to the light", "pt": 10, "bold": True, "color": D_TXT}]],
              "Back to the light", z=210)
    p.button("btn_light_side", (33, 476, 150, 42), "Switch back to the light state", "Bookmark", "bm_light",
             tooltip="Back to the light")
    p.image("img_tie", (504, 32, 550, 520), "img_set_10175_1.jpg",
            "Product photo of LEGO set 10175, Vader's TIE Advanced")
    p.image("img_voldemort", (1077, 164, 170, 200), "img_fig_002136.jpg",
            "Voldemort minifigure photo")
    p.textbox("c_curator", (1072, 368, 180, 44),
              [[{"t": "Curator of the gray collection", "pt": 11, "italic": True, "font": SERIF, "color": D_MUT}]],
              "Curator of the gray collection", align="center")
    p.textbox("c_comp_title", (28, 548, 400, 20),
              [[{"t": "COLOR COMPOSITION — ALMOST ENTIRELY GRAY, TRUE HEX", "pt": 9, "bold": True, "color": D_MUT}]],
              "Color composition: almost entirely gray, true hex")
    p.textbox("c_comp_note", (1008, 547, 240, 20),
              [[{"t": "2.1% of parts are any color at all", "pt": 9, "color": D_MUT}]],
              "2.1 percent of parts are any color at all", align="right")
    p.deneb("dn_comp_gray", (33, 574, 1214, 100), "dn_comp_gray.json", None,
            "One horizontal stacked bar of Vader's TIE Advanced color composition: six segments, "
            "almost entirely grays, 2.1 percent red.")
    p.footer("Chapter III · 4 of 5 · after closing time", rule=D_RULE, txt=D_MUT)
    return p


# ======================================================================= S5
def build_s5():
    p = Page("s5-sorting-quiz", "Chapter IV")
    p.header_band("CHAPTER IV", GREEN, "The Sorting Ceremony",
                  "Click a minifig, then its name, then its era — match all ten.",
                  sub_font=SANS, sub_italic=False, sub_pt=10)
    p.shape("z_quiz_frame", (33, 102, 1214, 570), CARD_BG, outline=GREEN, z=100)
    p.textbox("c_quiz_placeholder", (233, 350, 814, 60),
              [[{"t": "Sorting Quiz custom visual renders here — import sorting-quiz-v2 (.pbiviz) and swap it "
                      "into this slot (BUILD_LOG step D9). It draws the matcher, score, reveal and reset controls.",
                 "pt": 10, "color": MUT}]],
              "Placeholder for the Sorting Quiz custom visual", align="center", z=120)
    p.footer("Chapter IV · 5 of 5")
    return p


# ======================================================================= T1
def build_t1():
    p = Page("t1-tooltip", "Minifig tooltip", w=320, h=240, bg=CARD_BG, hidden=True, tooltip=True)
    p.fig_matrix("tbl_tt_fig", (14, 14, 104, 140), None, "Photo of the hovered minifigure")
    p.card("kpi_tt_name", (128, 12, 180, 30), "_Measures", "Character",
           "Hovered character's name", pt=16, color=INK)
    p.card("kpi_tt_era", (128, 42, 180, 20), "_Measures", "Era Upper",
           "Era of the hovered minifigure", pt=8, color=GOLD, font=SANS)
    p.card("kpi_tt_first", (128, 64, 180, 20), "_Measures", "First Appearance",
           "First appearance year and skin", pt=9, color=MUT, font=SANS, bold=False)
    p.card("kpi_tt_last", (128, 84, 180, 20), "_Measures", "Latest Appearance",
           "Latest appearance year and skin", pt=9, color=MUT, font=SANS, bold=False)
    p.card("kpi_tt_variants", (128, 104, 180, 20), "_Measures", "Variants Text",
           "Number of variants", pt=9, color=MUT, font=SANS, bold=False)
    p.shape("z_tt_rule", (131, 205, 174, 1), RULE, z=60)
    p.textbox("c_tt_attrib", (126, 208, 180, 24), [[{"t": "Rebrickable LEGO Database", "pt": 8, "color": MUT}]],
              "Rebrickable LEGO Database")
    return p


# =================================================================== shell
def write_shell():
    theme_src = json.load(open(os.path.join(HANDOFF, "theme.json"), encoding="utf-8"))
    def swap(o):
        if isinstance(o, dict):
            return {k: ("Georgia" if k == "fontFace" and "Crimson" in str(v) else swap(v)) for k, v in o.items()}
        if isinstance(o, list):
            return [swap(i) for i in o]
        return o
    theme = swap(theme_src)
    theme["name"] = "two-marriages"
    res_dir = os.path.join(REPORT, "StaticResources", "RegisteredResources")
    _write_json(os.path.join(res_dir, "two-marriages.json"), theme)

    items = [{"name": "two-marriages.json", "path": "two-marriages.json", "type": "CustomTheme"}]
    for f in sorted(os.listdir(res_dir)):
        if f.endswith((".png", ".jpg")):
            items.append({"name": f, "path": f, "type": "Image"})
    report = {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/report/3.3.0/schema.json",
        "themeCollection": {
            "baseTheme": {"name": "Fluent2-CY26SU05",
                          "reportVersionAtImport": {"visual": "2.9.0", "report": "3.3.0", "page": "2.3.1"},
                          "type": "SharedResources"},
            "customTheme": {"name": "two-marriages.json",
                            "reportVersionAtImport": {"visual": "2.10.0", "report": "3.4.0", "page": "2.3.1"},
                            "type": "RegisteredResources"},
        },
        "objects": {
            "section": [{"properties": {"verticalAlignment": lit("Top")}}],
            "outspacePane": [{"properties": {"expanded": lit(False)}}],
        },
        "resourcePackages": [
            {"name": "SharedResources", "type": "SharedResources",
             "items": [{"name": "Fluent2-CY26SU05", "path": "BaseThemes/Fluent2-CY26SU05.json", "type": "BaseTheme"}]},
            {"name": "RegisteredResources", "type": "RegisteredResources", "items": items},
        ],
        "publicCustomVisuals": [DENEB],
        "settings": {"useStylableVisualContainerHeader": True, "useEnhancedTooltips": True},
    }
    _write_json(os.path.join(DEF, "report.json"), report)
    _write_json(os.path.join(DEF, "version.json"), {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/versionMetadata/1.0.0/schema.json",
        "version": "2.0.0"})
    _write_json(os.path.join(REPORT, "definition.pbir"), {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definitionProperties/2.0.0/schema.json",
        "version": "4.0",
        "datasetReference": {"byPath": {"path": "../two-marriages-v2.SemanticModel"}}})
    _write_json(os.path.join(REPORT, ".platform"), {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json",
        "metadata": {"type": "Report", "displayName": "two-marriages-v2"},
        "config": {"version": "2.0", "logicalId": "c3c8f153-9797-4468-8b84-ede206930f8e"}})


def write_bookmarks():
    bdir = os.path.join(DEF, "bookmarks")
    os.makedirs(bdir, exist_ok=True)
    _write_json(os.path.join(bdir, "bookmarks.json"), {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/bookmarksMetadata/1.0.0/schema.json",
        "items": [{"name": "bm_light"}, {"name": "bm_dark"}]})
    for name, display, target in [("bm_light", "Back to the light", "s4a-most-colorful"),
                                  ("bm_dark", "The dark side", "s4b-dark-state")]:
        _write_json(os.path.join(bdir, f"{name}.bookmark.json"), {
            "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/bookmark/2.1.0/schema.json",
            "displayName": display,
            "name": name,
            "options": {"applyOnlyToTargetVisuals": True, "targetVisualNames": [], "suppressData": True},
            "explorationState": {"version": "1.0", "activeSection": target,
                                 "sections": {target: {"visualContainers": {}}}}})


def main():
    if os.path.isdir(DEF):
        for sub in ["pages", "bookmarks"]:
            shutil.rmtree(os.path.join(DEF, sub), ignore_errors=True)
    os.makedirs(PAGES, exist_ok=True)
    write_shell()
    write_bookmarks()
    pages = [build_s1(), build_s2(), build_s3(), build_s4a(), build_s4b(), build_s5(), build_t1()]
    for pg in pages:
        pg.write()
    _write_json(os.path.join(PAGES, "pages.json"), {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/pagesMetadata/1.1.0/schema.json",
        "pageOrder": [pg.name for pg in pages],
        "activePageName": "s1-home"})
    n_vis = sum(len(pg.visuals) for pg in pages)
    print(f"two-marriages-v2: {len(pages)} pages, {n_vis} visuals, {len(_written)} files")


if __name__ == "__main__":
    main()
