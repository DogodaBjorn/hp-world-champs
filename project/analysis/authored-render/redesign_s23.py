"""v2.2 redesign — S2 & S3 era explorers (density cut + card grouping).

From ~45 visuals to a focused explorer: header + 3-KPI band + (set explorer |
detail panel) + signature palette strip. The size-distribution chart and the
minifig cast strip are removed (redundant here; the cast lives on S5).

Run from repo root:  python project/analysis/authored-render/redesign_s23.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from v22 import *  # noqa

ERA = {"s2-chapter1": ERA1, "s3-chapter2": ERA2}
SUBTITLE = {
    "s2-chapter1": "One quiet decade in classic yellow — small sets, few colours.",
    "s3-chapter2": "The relaunch that changed everything — bigger, bolder, more colourful.",
}
TITLE = {
    "s2-chapter1": [("The Yellow Years", {"font": "Georgia", "size": "26pt", "color": INK, "bold": True, "inline": True}),
                    ("  ·  2001–2011", {"font": "Georgia", "size": "26pt", "color": FAINT, "inline": True})],
    "s3-chapter2": [("The Boy Who Grew Up", {"font": "Georgia", "size": "26pt", "color": INK, "bold": True, "inline": True}),
                    ("  ·  2018–", {"font": "Georgia", "size": "26pt", "color": FAINT, "inline": True})],
}

# per-page cut lists
CUT_COMMON = ["dn_dist", "c_dist_title",
              "kpi_3", "c_kpi_l_3", "kpi_5", "c_kpi_l_5",
              "z_kpi_strip_1", "z_kpi_strip_2", "z_kpi_strip_3",
              "z_kpi_strip_4", "z_kpi_strip_5",
              "z_header_rule"]
CUT = {
    "s2-chapter1": CUT_COMMON + ["tbl_fig_1", "tbl_fig_2", "tbl_fig_3", "tbl_fig_4",
                                 "c_figcap_1", "c_figcap_2", "c_figcap_3", "c_figcap_4",
                                 "c_figcard_title", "z_figcard"],
    "s3-chapter2": CUT_COMMON + ["tbl_fig_old", "tbl_fig_new", "c_figcap_old",
                                 "c_figcap_new", "c_oldnew_title", "c_oldnew_note",
                                 "z_oldnew_box"],
}


def build(page):
    era = ERA[page]
    for vid in CUT[page]:
        delete(page, vid)

    # ---- header ----
    set_text(page, "c_eyebrow",
             [(("CHAPTER I" if page == "s2-chapter1" else "CHAPTER II"),
               {"size": "11pt", "color": GOLD, "bold": True, "spacing": 2})])
    rect(page, "c_eyebrow", x=48, y=44, width=300, height=18, z=140)
    set_text(page, "c_title", TITLE[page])
    rect(page, "c_title", x=46, y=62, width=640, height=42, z=150)
    set_text(page, "c_subtitle", [(SUBTITLE[page], {"size": "13pt", "color": MUT})])
    rect(page, "c_subtitle", x=48, y=108, width=640, height=22, z=150)

    # ---- filter bar (top-right) ----
    make_card(page, "z_filter_card", 726, 44, 506, 78, z=40)
    textbox(page, "c_filter_label", 748, 54, 200, 16,
            [("EXPLORE", {"size": "9pt", "color": FAINT, "bold": True, "spacing": 2})], z=300)
    doc = load(page, "sl_year")
    doc["position"].update(x=748, y=72, width=222, height=42, z=320)
    save(page, "sl_year", doc)
    doc = load(page, "sl_size")
    doc["position"].update(x=986, y=72, width=228, height=42, z=320)
    save(page, "sl_size", doc)

    # ---- KPI band (full width, 3 era-defining metrics) ----
    make_card(page, "z_kpi_card", 48, 146, 1184, 92, z=40)
    kpis = [("kpi_1", "c_kpi_l_1", 96), ("kpi_2", "c_kpi_l_2", 492),
            ("kpi_4", "c_kpi_l_4", 888)]
    for val, lab, x in kpis:
        doc = load(page, val)
        doc["position"].update(x=x, y=162, width=180, height=40, z=210)
        doc["visual"]["objects"] = {
            "labels": [obj({"fontSize": lit("26D"), "color": solid(INK),
                            "fontFamily": lit("'Georgia'"), "bold": lit("true")})],
            "categoryLabels": [obj({"show": lit("false")})]}
        doc["visual"].setdefault("visualContainerObjects", {})
        doc["visual"]["visualContainerObjects"]["background"] = [obj({"show": lit("false")})]
        doc["visual"]["visualContainerObjects"]["border"] = [obj({"show": lit("false")})]
        save(page, val, doc)
        rect(page, lab, x=x, y=204, width=190, height=18, z=220)
        set_text(page, lab, [(load_label(page, lab), {"size": "10pt", "color": MUT, "spacing": 0.5})])

    # ---- explorer card ----
    make_card(page, "z_explorer_card", 48, 252, 660, 306, z=40)
    doc = load(page, "bar_sets")
    doc["position"].update(x=64, y=284, width=628, height=238, z=310)
    doc["visual"].setdefault("visualContainerObjects", {})["title"] = [
        obj({"show": lit("true"),
             "text": lit("'EVERY SET IN VIEW — TAP A BAR TO INSPECT'"),
             "fontColor": solid(MUT), "fontSize": lit("11D"),
             "fontFamily": lit("'Segoe UI'"), "bold": lit("true")})]
    save(page, "bar_sets", doc)
    textbox(page, "c_explore_hint", 64, 530, 628, 18,
            [("Click a bar to inspect that set — click again to release. Year & size filters apply to all.",
              {"size": "9.5pt", "color": FAINT, "italic": True})], z=320)

    # ---- detail card ----
    make_card(page, "z_detail_card", 728, 252, 504, 306, z=40)
    textbox(page, "c_detail_eyebrow", 752, 268, 300, 16,
            [("SELECTED SET", {"size": "9pt", "color": GOLD, "bold": True, "spacing": 2})], z=300)
    doc = load(page, "det_img")
    doc["position"].update(x=752, y=292, width=150, height=150, z=320)
    save(page, "det_img", doc)
    # name + rank to the right of the photo
    doc = load(page, "det_title")
    doc["position"].update(x=920, y=294, width=292, height=70, z=330)
    doc["visual"]["objects"] = {
        "labels": [obj({"fontSize": lit("17D"), "color": solid(INK),
                        "fontFamily": lit("'Georgia'"), "bold": lit("true")})],
        "categoryLabels": [obj({"show": lit("false")})]}
    save(page, "det_title", doc)
    doc = load(page, "det_rank")
    doc["position"].update(x=920, y=372, width=292, height=24, z=330)
    doc["visual"]["objects"] = {
        "labels": [obj({"fontSize": lit("11D"), "color": solid(MUT),
                        "fontFamily": lit("'Segoe UI'")})],
        "categoryLabels": [obj({"show": lit("false")})]}
    save(page, "det_rank", doc)
    # three stats along the bottom of the detail card
    stats = [("det_parts", "lbl_parts", 752), ("det_colors", "lbl_colors", 912),
             ("det_gray", "lbl_gray", 1072)]
    for val, lab, x in stats:
        doc = load(page, val)
        doc["position"].update(x=x, y=468, width=150, height=38, z=330)
        doc["visual"]["objects"] = {
            "labels": [obj({"fontSize": lit("21D"), "color": solid(INK),
                            "fontFamily": lit("'Georgia'"), "bold": lit("true")})],
            "categoryLabels": [obj({"show": lit("false")})]}
        save(page, val, doc)
        rect(page, lab, x=x, y=510, width=150, height=18, z=330)

    # ---- palette strip (signature) ----
    make_card(page, "z_palette_card", 48, 572, 1184, 96, z=40)
    set_text(page, "c_palette_title",
             [("THE PALETTE IN VIEW", {"size": "11pt", "color": MUT, "bold": True, "spacing": 1, "inline": True}),
              ("   — each bar is its true brick hex; pick a set and it collapses to that set's colours",
               {"size": "10pt", "color": FAINT, "inline": True})])
    rect(page, "c_palette_title", x=72, y=586, width=900, height=20, z=310)
    doc = load(page, "crd_palette_pct")
    doc["position"].update(x=1000, y=584, width=210, height=24, z=310)
    doc["visual"]["objects"] = {
        "labels": [obj({"fontSize": lit("11D"), "color": solid(GOLD),
                        "fontFamily": lit("'Segoe UI'"), "bold": lit("true")})],
        "categoryLabels": [obj({"show": lit("false")})]}
    save(page, "crd_palette_pct", doc)
    doc = load(page, "dn_palette")
    doc["position"].update(x=72, y=612, width=1136, height=44, z=310)
    save(page, "dn_palette", doc)

    # ---- footer ----
    rect(page, "c_footer_l", x=48, y=684, width=560, height=24, z=580)
    rect(page, "c_footer_r", x=672, y=684, width=560, height=24, z=580)
    delete(page, "z_footer_rule")

    # ---- cross-filter: a set click collapses the palette to its true colours ----
    # (dn_dist was removed this pass, so only the palette interaction remains)
    pj_path = os.path.join(PAGES, page, "page.json")
    with open(pj_path, encoding="utf-8") as h:
        pj = json.load(h)
    pj["visualInteractions"] = [
        {"source": "bar_sets", "target": "dn_palette", "type": "DataFilter"}]
    with open(pj_path, "w", encoding="utf-8", newline="\n") as h:
        json.dump(pj, h, indent=2, ensure_ascii=False)
    print(f"{page} redesign applied")


# helper: read a label textbox's current text so we can restyle in place
def load_label(page, vid):
    doc = load(page, vid)
    for e in doc["visual"].get("objects", {}).get("general", []):
        for p in e.get("properties", {}).get("paragraphs", []):
            for r in p.get("textRuns", []):
                return r.get("value", "")
    return ""


for pg in ("s2-chapter1", "s3-chapter2"):
    build(pg)
