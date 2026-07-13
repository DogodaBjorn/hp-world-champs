"""Generate the PBIR report tree for hp-world-champs from the design handoff.

One source of truth for ~40 visual.json files: every shape below was verified
against on-disk references (starter Round-2 report, KTO MVP report) and the
published page schema — see 06-build.md. UTF-8 throughout (no cp1252 round
trip). Re-runnable: overwrites the Report definition deterministically.
Idempotency note: visual ids are stable handoff ids, so bookmarks and diffs
survive regeneration (pbir-style rule).

Run:  python project/analysis/gen_report.py   (from the repo root)
Then: python scripts/validate_json.py && pbir validate ... --all
"""

import json
import os
import shutil
import sys

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PBIP = os.path.join(ROOT, "project", "pbip")
REPORT = os.path.join(PBIP, "hp-world-champs.Report")
DEF = os.path.join(REPORT, "definition")
EVIDENCE = os.path.join(ROOT, "project", "analysis", "evidence-manifest.json")
THEME_SRC = os.path.join(ROOT, "project", "deliverables", "theme.json")
STARTER_BASE_THEME = r"e:\PowerBI Set-up\World Champs BCN 26 - Round 2.Report\StaticResources\SharedResources\BaseThemes\Fluent2-CY26SU05.json"

SCHEMAS = {
    "pbir": "https://developer.microsoft.com/json-schemas/fabric/item/report/definitionProperties/2.0.0/schema.json",
    "version": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/versionMetadata/1.0.0/schema.json",
    "report": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/report/3.3.0/schema.json",
    "pages": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/pagesMetadata/1.1.0/schema.json",
    "page": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json",
    "visual": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.10.0/schema.json",
    "bookmark": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/bookmark/2.1.0/schema.json",
    "bookmarks": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/bookmarksMetadata/1.0.0/schema.json",
    "platform": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json",
}

# hp-bricks tokens (design-brief contract — single source in this generator)
T = {
    "canvas": "#F7F1E3", "surface": "#FFFFFF", "ink": "#05131D",
    "ink2": "#6C6E68", "hairline": "#DCD2BD", "accent": "#720E0F",
    "gold": "#AA7F2E", "green": "#184632",
    "d_canvas": "#05131D", "d_surface": "#101820", "d_ink": "#F5F1E6",
    "d_ink2": "#A0A5A9", "d_accent": "#DBAC34", "d_hairline": "#2A313B",
}
ERA1 = "First marriage (2001–2011)"
ERA2 = "Second marriage (2018– )"
ATTRIBUTION = "Source: Rebrickable LEGO Database (rebrickable.com)"

FIGS_P2 = ["fig-000471", "fig-000593", "fig-006049", "fig-000594", "fig-006056", "fig-006093"]
FIGS_P3 = ["fig-001818", "fig-008935", "fig-012280", "fig-010514", "fig-002136", "fig-013042"]


def lit(v):
    if isinstance(v, bool):
        return {"expr": {"Literal": {"Value": "true" if v else "false"}}}
    if isinstance(v, (int, float)):
        return {"expr": {"Literal": {"Value": f"{v}D"}}}
    return {"expr": {"Literal": {"Value": "'" + str(v).replace("'", "''") + "'"}}}


def solid(hexcolor):
    return {"solid": {"color": {"expr": {"Literal": {"Value": f"'{hexcolor}'"}}}}}


def col(entity, prop):
    return {"Column": {"Expression": {"SourceRef": {"Entity": entity}}, "Property": prop}}


def meas(entity, prop):
    return {"Measure": {"Expression": {"SourceRef": {"Entity": entity}}, "Property": prop}}


def proj(field, entity, prop, **kw):
    p = {"field": field, "queryRef": f"{entity}.{prop}", "nativeQueryRef": prop}
    p.update(kw)
    return p


def cproj(entity, prop, **kw):
    return proj(col(entity, prop), entity, prop, **kw)


def mproj(entity, prop, **kw):
    return proj(meas(entity, prop), entity, prop, **kw)


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
                "Values": [[{"Literal": {"Value": "'" + v.replace("'", "''") + "'"}}] for v in values],
            }}}],
        },
        "howCreated": "User",
    }


def textbox(name, x, y, w, h, runs_or_paras, tab, z=100, alt=None, bg=None, halign=None):
    paras = runs_or_paras if isinstance(runs_or_paras[0], dict) and "textRuns" in runs_or_paras[0] else [
        {"textRuns": runs_or_paras, **({"horizontalTextAlignment": halign} if halign else {})}
    ]
    vco = {}
    if alt:
        vco["general"] = [{"properties": {"altText": lit(alt)}}]
    if bg:
        vco["background"] = [{"properties": {"color": solid(bg), "transparency": lit(0)}}]
    return {
        "$schema": SCHEMAS["visual"], "name": name,
        "position": {"x": x, "y": y, "z": z, "height": h, "width": w, "tabOrder": tab},
        "visual": {
            "visualType": "textbox",
            "objects": {"general": [{"properties": {"paragraphs": paras}}]},
            **({"visualContainerObjects": vco} if vco else {}),
            "drillFilterOtherVisuals": False,
        },
    }


def run(text, size="12pt", family="Segoe UI", color=None, bold=False, italic=False):
    style = {"fontFamily": family, "fontSize": size}
    if color:
        style["color"] = color
    if bold:
        style["fontWeight"] = "bold"
    if italic:
        style["fontStyle"] = "italic"
    return {"value": text, "textStyle": style}


def chart(name, vtype, x, y, w, h, roles, tab, title_measure=None, title_text=None,
          alt=None, filters=None, z=200, sort=None, extra_objects=None, dark=False):
    ink = T["d_ink"] if dark else T["ink"]
    surface = T["d_surface"] if dark else T["surface"]
    border = T["d_hairline"] if dark else T["hairline"]
    vco = {
        "title": [{"properties": {
            "show": lit(True),
            "text": {"expr": {"Measure": meas("_Measures", title_measure)["Measure"]}} if title_measure else lit(title_text or name),
            "fontColor": solid(ink), "fontFamily": lit("Georgia"), "fontSize": lit(14),
        }}],
        "background": [{"properties": {"color": solid(surface), "transparency": lit(0)}}],
        "border": [{"properties": {"show": lit(True), "color": solid(border), "radius": lit(8)}}],
    }
    if alt:
        vco["general"] = [{"properties": {"altText": lit(alt)}}]
    query = {"queryState": {r: {"projections": p} for r, p in roles.items()}}
    if sort:
        query["sortDefinition"] = {"sort": [sort]}
    v = {
        "$schema": SCHEMAS["visual"], "name": name,
        "position": {"x": x, "y": y, "z": z, "height": h, "width": w, "tabOrder": tab},
        "visual": {"visualType": vtype, "query": query,
                   **({"objects": extra_objects} if extra_objects else {}),
                   "visualContainerObjects": vco, "drillFilterOtherVisuals": False},
    }
    if filters:
        v["filterConfig"] = {"filters": filters}
    return v


def nav_button(name, x, label, target_page, tab, dark=False):
    ink = T["d_ink"] if dark else T["ink"]
    return {
        "$schema": SCHEMAS["visual"], "name": name,
        "position": {"x": x, "y": 44, "z": 500, "height": 24, "width": 92, "tabOrder": tab},
        "visual": {
            "visualType": "actionButton",
            "objects": {
                "icon": [{"properties": {"shapeType": lit("blank")}, "selector": {"id": "default"}}],
                "text": [
                    {"properties": {"show": lit(True)}},
                    {"properties": {"text": lit(label), "fontColor": solid(ink)}, "selector": {"id": "default"}},
                ],
            },
            "visualContainerObjects": {
                "title": [{"properties": {"text": lit(f"Go to {label}")}}],
                "general": [{"properties": {"altText": lit(f"Navigate to page {label}")}}],
                "visualLink": [{"properties": {
                    "show": lit(True), "type": lit("PageNavigation"),
                    "navigationSection": lit(target_page),
                }}],
            },
            "drillFilterOtherVisuals": False,
        },
    }


def chrome(page_no, title, era_chip=None, dark=False, suffix=""):
    """Masthead + rule + nav + footer. Returns list of visuals."""
    ink = T["d_ink"] if dark else T["ink"]
    ink2 = T["d_ink2"] if dark else T["ink2"]
    accent = T["d_accent"] if dark else T["accent"]
    hairline = T["d_hairline"] if dark else T["hairline"]
    numerals = ["I", "II", "III", "IV", "V"]
    vis = []
    head_runs = [
        run(numerals[page_no - 1] + " · ", size="20pt", family="Georgia", color=accent, italic=True),
        run(title, size="20pt", family="Georgia", color=ink),
    ]
    if era_chip:
        head_runs.append(run("   " + era_chip[0], size="12pt", family="Segoe UI Semibold", color=era_chip[1]))
    vis.append(textbox(f"z_masthead{suffix}", 24, 8, 900, 36, head_runs, 90000,
                       alt=f"Chapter {numerals[page_no - 1]}: {title}"))
    vis.append({
        "$schema": SCHEMAS["visual"], "name": f"z_rule{suffix}",
        "position": {"x": 24, "y": 72, "z": 50, "height": 2, "width": 1232, "tabOrder": 95000},
        "visual": {"visualType": "shape",
                   "objects": {"shape": [{"properties": {"tileShape": lit("rectangle")}}],
                               "fill": [{"properties": {"fillColor": solid(hairline), "show": lit(True)}}],
                               "outline": [{"properties": {"show": lit(False)}}]},
                   "visualContainerObjects": {"general": [{"properties": {"altText": lit("Decorative chapter rule")}}]},
                   "drillFilterOtherVisuals": False},
    })
    labels = [("I", "p1-home"), ("II", "p2-first-marriage"), ("III", "p3-second-marriage"),
              ("IV", "p4-color-dark-side"), ("V", "p5-sorting-quiz")]
    x = 792
    for i, (lab, target) in enumerate(labels):
        vis.append(nav_button(f"btn_nav_{i + 1}{suffix}", x, lab, target, 91000 + i * 100, dark=dark))
        x += 94
    vis.append(textbox(f"z_footer{suffix}", 24, 684, 1232, 28,
                       [run(ATTRIBUTION, size="10pt", color=ink2)], 99000,
                       alt=ATTRIBUTION))
    return vis


def card_multi(name, x, y, w, h, values, tab, title_text, alt, category=None, filters=None, dark=False):
    # multiRowCard supports only Values (pbir validate); a category split becomes
    # a slim matrix with the category on Columns — same KPI-band reading.
    if category:
        roles = {"Columns": [cproj(*category)],
                 "Values": [mproj("_Measures", m) for m in values]}
        return chart(name, "pivotTable", x, y, w, h, roles, tab, title_text=title_text,
                     alt=alt, filters=filters, dark=dark)
    roles = {"Values": [mproj("_Measures", m) for m in values]}
    return chart(name, "multiRowCard", x, y, w, h, roles, tab, title_text=title_text,
                 alt=alt, filters=filters, dark=dark)


# ------------------------------------------------------------------ pages ---

def p1_visuals(ev):
    vis = chrome(1, "The Boy Who Came Back")
    vis.append(textbox("c_takeaway", 24, 96, 792, 116, [
        run("L", size="28pt", family="Georgia", color=T["accent"], bold=True),
        run("EGO Harry Potter vanished for seven years. It returned in 2018 at nearly triple the scale — "
            "bigger sets, more colors, aimed at the readers who grew up. Two marriages, one franchise, "
            "told in 576 minifigures.", size="12pt", color=T["ink"]),
    ], 1000, alt="Key takeaway: LEGO Harry Potter vanished for seven years and returned in 2018 at nearly triple the scale — bigger sets, more colors, aimed at the readers who grew up. Two marriages, one franchise, told in 576 minifigures."))
    vis.append(chart(
        "hero_parts_timeline", "clusteredColumnChart", 24, 228, 792, 436,
        {"Category": [cproj("DimYear", "Year")],
         "Y": [mproj("_Measures", "Parts Shipped")]},
        2000, title_measure="Title Home Hero",
        alt="Columns of Harry Potter parts shipped per year 2001 to 2027; 2012 through 2017 are empty — the seven-year hiatus.",
        filters=[in_filter("flt_p1_years", "DimYear", "Year",
                           [str(y) for y in range(2001, 2028)])],
        sort={"field": col("DimYear", "Year"), "direction": "Ascending"},
    ))
    vis.append(textbox("c_note_hiatus", 380, 300, 180, 32,
                       [run("— seven silent years —", size="14pt", family="Georgia", color=T["ink2"], italic=True)],
                       3000, alt="Annotation: seven silent years, 2012 to 2017", halign="center"))
    era_f = [in_filter("flt_eras", "DimSets", "Era", [ERA1, ERA2])]
    vis.append(card_multi("kpi_sets_by_era", 832, 96, 424, 168, ["Sets"], 4000,
                          "Sets per marriage", "Sets per era: first marriage 67, second marriage 142.",
                          category=("DimSets", "Era"), filters=era_f))
    vis.append(card_multi("kpi_avg_size_by_era", 832, 280, 424, 168, ["Avg Parts per Set"], 5000,
                          "Average set size — 2.7× bigger", "Average parts per set: 267 in the first marriage, 731 in the second — 2.7 times bigger.",
                          category=("DimSets", "Era"), filters=era_f))
    vis.append(card_multi("kpi_colors_by_era", 832, 464, 424, 168, ["Distinct Colors Used"], 6000,
                          "Distinct colors used", "Distinct colors: 66 in the first marriage, 79 in the second.",
                          category=("DimSets", "Era"), filters=era_f))
    return vis, [in_filter("flt_p1_hp", "DimSets", "Root Theme", ["Harry Potter"])]


def era_page_visuals(page_no, title, era, chip_color, figs, era_alt):
    vis = chrome(page_no, title, era_chip=(era, chip_color))
    vis.append(card_multi("kpi_era_band", 24, 96, 1232, 88,
                          ["Sets", "Avg Parts per Set", "Distinct Colors Used", "Grayscale Share %"],
                          1000, "This marriage in four numbers", era_alt))
    vis.append(chart(
        "tbl_top_sets", "pivotTable", 24, 200, 608, 456,
        {"Rows": [dict(cproj("DimSets", "img_url"), active=True),
                  dict(cproj("DimSets", "Set Name"), active=True),
                  cproj("DimSets", "year")],
         "Values": [mproj("_Measures", "Avg Parts per Set")]},
        2000, title_text="The era's biggest builds",
        alt="Matrix of the era's largest sets with box images, names, year and part count.",
        sort={"field": meas("_Measures", "Avg Parts per Set"), "direction": "Descending"},
    ))
    vis.append(chart(
        "ch_size_distribution", "clusteredColumnChart", 648, 200, 608, 148,
        {"Category": [cproj("DimSets", "num_parts")],
         "Y": [mproj("_Measures", "Sets")]},
        3000, title_measure="Title Size Dist",
        alt="Distribution of set sizes in this era; horizontal axis is parts per set.",
        sort={"field": col("DimSets", "num_parts"), "direction": "Ascending"},
    ))
    vis.append(chart(
        "ch_palette_strip", "hundredPercentStackedBarChart", 648, 364, 608, 72,
        {"Category": [cproj("DimSets", "Root Theme")],
         "Series": [cproj("DimColors", "Color Name")],
         "Y": [mproj("_Measures", "Parts Shipped")]},
        4000, title_text="Every brick color, to scale",
        alt="Single bar of the era's entire palette: every color's share of all parts, in the bricks' true colors.",
        extra_objects={"legend": [{"properties": {"show": lit(False)}}]},
    ))
    vis.append(chart(
        "tbl_fig_gallery", "pivotTable", 648, 452, 608, 204,
        {"Rows": [dict(cproj("DimMinifigures", "img_url"), active=True),
                  cproj("DimMinifigures", "Character")],
         "Values": [mproj("_Measures", "Unique Minifigures")]},
        5000, title_text="The yellow-skin years" if page_no == 2 else "The same faces, grown up",
        alt=("Gallery of six 2001-era yellow-skin minifigures with character names."
             if page_no == 2 else "Gallery of six modern flesh-tone minifigures of the same characters."),
        filters=[in_filter("flt_gallery_figs", "DimMinifigures", "fig_num", figs)],
    ))
    return vis, [in_filter(f"flt_p{page_no}_era", "DimSets", "Era", [era])]


def p4_visuals(ev):
    top_colorful = [e["set_num"] for e in ev["E6_most_colorful_sets"][:6]]
    grayest = [e["set_num"] for e in ev["E7_grayest_big_sets"][:6]]
    vis = chrome(4, "The Most Colorful Set", suffix="")
    dark_chrome = chrome(4, "…and the Dark Side", dark=True, suffix="_dark")
    vis += dark_chrome
    # LIGHT state
    vis.append(chart(
        "hero_color_composition", "barChart", 24, 96, 792, 560,
        {"Category": [cproj("DimColors", "Color Name")],
         "Y": [mproj("_Measures", "Parts Shipped")]},
        1000, title_measure="Title Color Hero",
        alt="55 colors of Diagon Alley Wizarding Shops ranked by part count, each bar in the brick's true color.",
        filters=[in_filter("flt_hero_set", "DimSets", "set_num", ["76444-1"])],
        sort={"field": meas("_Measures", "Parts Shipped"), "direction": "Descending"},
    ))
    vis.append(card_multi("kpi_theme_grayness", 832, 96, 424, 140,
                          ["Grayscale Share %", "Distinct Colors Used"], 2000,
                          "Two licenses, two palettes",
                          "Harry Potter is 42.4 percent grayscale with 99 lifetime colors — the most colorful license. Star Wars is 71.8 percent grayscale — the grayest major theme.",
                          category=("DimSets", "Root Theme"),
                          filters=[in_filter("flt_two_themes", "DimSets", "Root Theme",
                                             ["Harry Potter", "Star Wars"])]))
    vis.append(chart(
        "ch_colorful_rank", "barChart", 832, 252, 424, 224,
        {"Category": [cproj("DimSets", "Set Name")],
         "Y": [mproj("_Measures", "Distinct Colors Used")]},
        3000, title_text="The most colorful sets ever",
        alt="Bar ranking of the six most colorful LEGO sets ever; Diagon Alley Wizarding Shops is second with 55 colors.",
        filters=[in_filter("flt_rank_sets", "DimSets", "set_num", top_colorful)],
        sort={"field": meas("_Measures", "Distinct Colors Used"), "direction": "Descending"},
    ))
    vis.append({
        "$schema": SCHEMAS["visual"], "name": "btn_dark_side",
        "position": {"x": 832, "y": 492, "z": 400, "height": 48, "width": 424, "tabOrder": 4000},
        "visual": {
            "visualType": "actionButton",
            "objects": {
                "icon": [{"properties": {"shapeType": lit("blank")}, "selector": {"id": "default"}}],
                "text": [{"properties": {"show": lit(True)}},
                         {"properties": {"text": lit("Want the least colorful? Come to the dark side →"),
                                         "fontColor": solid(T["surface"])}, "selector": {"id": "default"}}],
                "fill": [{"properties": {"show": lit(True), "fillColor": solid(T["ink"]), "transparency": lit(0)},
                          "selector": {"id": "default"}}],
            },
            "visualContainerObjects": {
                "title": [{"properties": {"text": lit("Switch to the dark side view")}}],
                "general": [{"properties": {"altText": lit("Button: switch to the dark side — the grayest large Star Wars set")}}],
                "visualLink": [{"properties": {"show": lit(True), "type": lit("Bookmark"),
                                               "bookmark": lit("bm_p4_dark")}}],
            },
            "drillFilterOtherVisuals": False,
        },
    })
    vis.append(textbox("c_rank_note", 832, 556, 424, 100, [
        run("Five mosaic sculptures are 100% gray — Vader's TIE is the grayest large ", size="12pt", family="Georgia", color=T["ink2"], italic=True),
        run("Star Wars", size="12pt", family="Georgia", color=T["ink2"], bold=True, italic=True),
        run(" set. Honest ranks only.", size="12pt", family="Georgia", color=T["ink2"], italic=True),
    ], 5000, alt="Note: five mosaic sculptures are 100 percent gray; Vader's TIE Advanced is the grayest large Star Wars set."))
    # DARK state
    vis.append(chart(
        "hero_gray_composition", "barChart", 24, 96, 792, 560,
        {"Category": [cproj("DimColors", "Color Name")],
         "Y": [mproj("_Measures", "Parts Shipped")]},
        1100, title_measure="Title Gray Hero",
        alt="Colors of Vader's TIE Advanced ranked by part count — 97.9 percent of its 1,212 parts are grayscale.",
        filters=[in_filter("flt_hero_set_dark", "DimSets", "set_num", ["10175-1"])],
        sort={"field": meas("_Measures", "Parts Shipped"), "direction": "Descending"},
        dark=True,
    ))
    vis.append(chart(
        "ch_gray_rank", "barChart", 832, 252, 424, 224,
        {"Category": [cproj("DimSets", "Set Name")],
         "Y": [mproj("_Measures", "Grayscale Share %")]},
        3100, title_text="The grayest big sets (≥1,000 parts)",
        alt="Bar ranking of the grayest large LEGO sets; Vader's TIE Advanced leads Star Wars at 97.9 percent.",
        filters=[in_filter("flt_gray_sets", "DimSets", "set_num", grayest)],
        sort={"field": meas("_Measures", "Grayscale Share %"), "direction": "Descending"},
        dark=True,
    ))
    vis.append(chart(
        "img_voldemort", "pivotTable", 1064, 540, 192, 116,
        {"Rows": [cproj("DimMinifigures", "img_url")],
         "Values": [mproj("_Measures", "Unique Minifigures")]},
        6000, title_text="He's back too",
        alt="Voldemort minifigure image.",
        filters=[in_filter("flt_voldemort", "DimMinifigures", "fig_num", ["fig-002136"])],
        dark=True,
    ))
    vis.append({
        "$schema": SCHEMAS["visual"], "name": "btn_light_side",
        "position": {"x": 832, "y": 492, "z": 410, "height": 48, "width": 424, "tabOrder": 4100},
        "visual": {
            "visualType": "actionButton",
            "objects": {
                "icon": [{"properties": {"shapeType": lit("blank")}, "selector": {"id": "default"}}],
                "text": [{"properties": {"show": lit(True)}},
                         {"properties": {"text": lit("← Back to the light"),
                                         "fontColor": solid(T["d_canvas"])}, "selector": {"id": "default"}}],
                "fill": [{"properties": {"show": lit(True), "fillColor": solid(T["d_accent"]), "transparency": lit(0)},
                          "selector": {"id": "default"}}],
            },
            "visualContainerObjects": {
                "title": [{"properties": {"text": lit("Switch back to the light view")}}],
                "general": [{"properties": {"altText": lit("Button: switch back to the colorful light view")}}],
                "visualLink": [{"properties": {"show": lit(True), "type": lit("Bookmark"),
                                               "bookmark": lit("bm_p4_light")}}],
            },
            "drillFilterOtherVisuals": False,
        },
    })
    vis.append({
        "$schema": SCHEMAS["visual"], "name": "z_bg_dark",
        "position": {"x": 0, "y": 0, "z": 10, "height": 720, "width": 1280, "tabOrder": 98000},
        "visual": {"visualType": "shape",
                   "objects": {"shape": [{"properties": {"tileShape": lit("rectangle")}}],
                               "fill": [{"properties": {"fillColor": solid(T["d_canvas"]), "show": lit(True)}}],
                               "outline": [{"properties": {"show": lit(False)}}]},
                   "visualContainerObjects": {"general": [{"properties": {"altText": lit("Dark background")}}]},
                   "drillFilterOtherVisuals": False},
    })
    return vis, []


def p5_visuals(ev):
    vis = chrome(5, "The Sorting Quiz")
    vis.append(textbox("hero_quiz", 24, 96, 792, 560, [
        run("The Sorting Quiz\n", size="20pt", family="Georgia", color=T["ink"], bold=True),
        run("Placeholder — the hpSortingQuiz custom visual is imported here from file in Desktop "
            "(BUILD_LOG D9). Ten curated minifigures, two eras: connect each figure to its character; "
            "wrong guesses shake, right ones lock in gold.", size="12pt", color=T["ink2"]),
    ], 2000, alt="Placeholder for the Sorting Quiz custom visual: match ten minifigures to their characters and eras.", bg=T["surface"]))
    vis.append(chart(
        "kpi_quiz_questions", "card", 832, 96, 424, 120,
        {"Values": [mproj("_Measures", "Quiz Questions")]},
        3000, title_text="Questions in the game — scenario logic",
        alt="Ten questions in the Sorting Quiz. The score lives inside the game; this card is scenario logic, not LEGO data.",
    ))
    vis.append(textbox("c_era_legend", 832, 232, 424, 72, [
        run("● ", size="14pt", color=T["gold"]),
        run("First marriage (2001–2011)    ", size="12pt", color=T["ink"]),
        run("● ", size="14pt", color=T["accent"]),
        run("Second marriage (2018– )", size="12pt", color=T["ink"]),
    ], 4000, alt="Era legend: gold dot is the first marriage 2001 to 2011; dark red dot is the second marriage since 2018."))
    vis.append(textbox("c_how_to_play", 832, 320, 424, 128, [
        run("How to play\n", size="14pt", family="Georgia", color=T["ink"], bold=True),
        run("Click a minifigure, then the character you think it is — the era is the real puzzle. "
            "Keyboard: Tab to a figure, arrow keys between options, Enter to connect.",
            size="12pt", color=T["ink2"]),
    ], 5000, alt="How to play: click a minifigure then a character. Keyboard: Tab to a figure, arrows between options, Enter to connect."))
    return vis, []


def tt_visuals():
    vis = [
        textbox("c_definition", 8, 8, 304, 120, [
            run("What this number means\n", size="12pt", family="Georgia", color=T["ink"], bold=True),
            run("Parts Shipped counts the physical parts in the boxes of the sets in view — "
                "version-1 inventories only, spare parts excluded. The exclusions are the definition.",
                size="10pt", color=T["ink2"]),
        ], 1000, alt="Definition: Parts Shipped counts physical parts in version-1 inventories, spares excluded.", bg=T["surface"]),
        chart("kpi_context_value", "card", 8, 136, 304, 56,
              {"Values": [mproj("_Measures", "Parts Shipped")]},
              2000, title_text="Parts shipped in this slice",
              alt="Parts shipped in the hovered slice."),
    ]
    return vis, []


# -------------------------------------------------------------- assembly ---

def page_json(name, display, width=1280, height=720, ptype=None, visibility=None, filters=None):
    p = {"$schema": SCHEMAS["page"], "name": name, "displayName": display,
         "displayOption": "FitToPage", "height": height, "width": width}
    if ptype:
        p["type"] = ptype
    if visibility:
        p["visibility"] = visibility
    if filters:
        p["filterConfig"] = {"filters": filters}
    p["objects"] = {"background": [{"properties": {
        "color": solid(T["canvas"]), "transparency": lit(0)}}]}
    return p


def bookmark(name, display, page, hidden_visuals, shown_visuals, vtypes):
    # Desktop only ever serializes display.mode = "hidden"; a visual captured
    # WITHOUT a display block (just its visualType) is made visible on apply.
    containers = {}
    for v in hidden_visuals:
        containers[v] = {"singleVisual": {"visualType": vtypes[v],
                                          "display": {"mode": "hidden"}}}
    for v in shown_visuals:
        containers[v] = {"singleVisual": {"visualType": vtypes[v]}}
    return {
        "$schema": SCHEMAS["bookmark"], "name": name, "displayName": display,
        "options": {"targetVisualNames": sorted(hidden_visuals + shown_visuals),
                    "suppressData": True, "applyOnlyToTargetVisuals": True},
        "explorationState": {
            "version": "1.3", "activeSection": page,
            "sections": {page: {"visualContainers": containers}},
        },
    }


def write(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False)


def main():
    ev = json.load(open(EVIDENCE, encoding="utf-8"))

    if os.path.isdir(DEF):
        shutil.rmtree(DEF)

    write(os.path.join(REPORT, ".platform"), {
        "$schema": SCHEMAS["platform"],
        "metadata": {"type": "Report", "displayName": "hp-world-champs"},
        "config": {"version": "2.0", "logicalId": "7f3f1e51-9c1e-4d4a-a2ab-5c25c1e0b0d4"},
    })
    write(os.path.join(REPORT, "definition.pbir"), {
        "$schema": SCHEMAS["pbir"], "version": "4.0",
        "datasetReference": {"byPath": {"path": "../hp-world-champs.SemanticModel"}},
    })
    write(os.path.join(DEF, "version.json"), {"$schema": SCHEMAS["version"], "version": "2.0.0"})
    write(os.path.join(DEF, "report.json"), {
        "$schema": SCHEMAS["report"],
        "themeCollection": {
            "baseTheme": {"name": "Fluent2-CY26SU05",
                          "reportVersionAtImport": {"visual": "2.9.0", "report": "3.3.0", "page": "2.3.1"},
                          "type": "SharedResources"},
            "customTheme": {"name": "hp-bricks.json",
                            "reportVersionAtImport": {"visual": "2.10.0", "report": "3.4.0", "page": "2.3.1"},
                            "type": "RegisteredResources"},
        },
        "objects": {"section": [{"properties": {"verticalAlignment": lit("Top")}}]},
        "resourcePackages": [
            {"name": "SharedResources", "type": "SharedResources",
             "items": [{"name": "Fluent2-CY26SU05", "path": "BaseThemes/Fluent2-CY26SU05.json", "type": "BaseTheme"}]},
            {"name": "RegisteredResources", "type": "RegisteredResources",
             "items": [{"name": "hp-bricks.json", "path": "hp-bricks.json", "type": "CustomTheme"}]},
        ],
        "settings": {"useStylableVisualContainerHeader": True,
                     "defaultDrillFilterOtherVisuals": False,
                     "useEnhancedTooltips": True},
    })

    # static resources
    rr = os.path.join(REPORT, "StaticResources", "RegisteredResources")
    os.makedirs(rr, exist_ok=True)
    shutil.copyfile(THEME_SRC, os.path.join(rr, "hp-bricks.json"))
    bt = os.path.join(REPORT, "StaticResources", "SharedResources", "BaseThemes")
    os.makedirs(bt, exist_ok=True)
    shutil.copyfile(STARTER_BASE_THEME, os.path.join(bt, "Fluent2-CY26SU05.json"))

    # pages
    p1v, p1f = p1_visuals(ev)
    p2v, p2f = era_page_visuals(2, "First Marriage 2001-2011", ERA1, T["gold"], FIGS_P2,
                                "This era in four numbers: 67 sets, 267 average parts, 66 colors, 51.1 percent grayscale.")
    p3v, p3f = era_page_visuals(3, "Second Marriage 2018-", ERA2, T["accent"], FIGS_P3,
                                "This era in four numbers: 142 sets, 731 average parts, 79 colors, 40.9 percent grayscale.")
    p4v, p4f = p4_visuals(ev)
    p5v, p5f = p5_visuals(ev)
    ttv, ttf = tt_visuals()

    pages = [
        ("p1-home", "The Boy Who Came Back", p1v, p1f, {}),
        ("p2-first-marriage", "First Marriage 2001-2011", p2v, p2f, {}),
        ("p3-second-marriage", "Second Marriage 2018-", p3v, p3f, {}),
        ("p4-color-dark-side", "The Most Colorful Set", p4v, p4f, {}),
        ("p5-sorting-quiz", "The Sorting Quiz", p5v, p5f, {}),
        ("tt-definitions", "Definitions", ttv, ttf,
         {"width": 320, "height": 200, "ptype": "Tooltip", "visibility": "HiddenInViewMode"}),
    ]
    write(os.path.join(DEF, "pages", "pages.json"), {
        "$schema": SCHEMAS["pages"],
        "pageOrder": [p[0] for p in pages],
        "activePageName": "p1-home",
    })
    for name, display, visuals, pfilters, kw in pages:
        write(os.path.join(DEF, "pages", name, "page.json"),
              page_json(name, display, filters=pfilters or None, **kw))
        for v in visuals:
            write(os.path.join(DEF, "pages", name, "visuals", v["name"], "visual.json"), v)

    # bookmarks — P4 flip
    dark_ids = ["hero_gray_composition", "ch_gray_rank", "img_voldemort", "btn_light_side",
                "z_bg_dark", "z_masthead_dark", "z_rule_dark", "z_footer_dark"] + \
               [f"btn_nav_{i}_dark" for i in range(1, 6)]
    light_ids = ["hero_color_composition", "ch_colorful_rank", "btn_dark_side",
                 "z_masthead", "z_rule", "z_footer"] + [f"btn_nav_{i}" for i in range(1, 6)]
    shared = ["kpi_theme_grayness", "c_rank_note"]
    p4_types = {v["name"]: v["visual"]["visualType"] for v in p4v}
    write(os.path.join(DEF, "bookmarks", "bookmarks.json"), {
        "$schema": SCHEMAS["bookmarks"],
        "items": [{"name": "bm_p4_light"}, {"name": "bm_p4_dark"}],
    })
    write(os.path.join(DEF, "bookmarks", "bm_p4_light.bookmark.json"),
          bookmark("bm_p4_light", "The light side", "p4-color-dark-side",
                   hidden_visuals=dark_ids, shown_visuals=light_ids + shared, vtypes=p4_types))
    write(os.path.join(DEF, "bookmarks", "bm_p4_dark.bookmark.json"),
          bookmark("bm_p4_dark", "The dark side", "p4-color-dark-side",
                   hidden_visuals=light_ids, shown_visuals=dark_ids + shared, vtypes=p4_types))

    # default state: dark visuals hidden on load — set isHidden via page-load? PBIR has no
    # page-load bookmark in-page; instead the dark visuals ship display.mode hidden in their
    # visual.json (position.z kept) — patch them:
    for vid in dark_ids:
        path = os.path.join(DEF, "pages", "p4-color-dark-side", "visuals", vid, "visual.json")
        d = json.load(open(path, encoding="utf-8"))
        d["isHidden"] = True
        write(path, d)

    # pbip pointer
    write(os.path.join(PBIP, "hp-world-champs.pbip"), {
        "$schema": "https://developer.microsoft.com/json-schemas/fabric/pbip/pbipProperties/1.0.0/schema.json",
        "version": "1.0",
        "artifacts": [{"report": {"path": "hp-world-champs.Report"}}],
        "settings": {"enableAutoRecovery": True},
    })

    total = sum(len(p[2]) for p in pages)
    print(f"generated: 6 pages, {total} visuals, 2 bookmarks, theme registered")


if __name__ == "__main__":
    main()
