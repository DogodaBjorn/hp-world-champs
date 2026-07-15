"""v2.2 redesign — S4a (Chamber of Colors) & S4b (dark twin).

Editorial feature spread: hero stat card + story + native button on the left,
a carded photo on the right, a full-width composition strip below. Fixes the
clipping 128pt hero number and replaces the 3-visual button stacks with native
buttons. S4b mirrors it in dark chrome (the bookmark-flip state).

Run from repo root:  python project/analysis/authored-render/redesign_s4.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from v22 import *  # noqa

# dark tokens for the S4b twin
D_CARD = "#241D14"
D_HAIR = "#4A4034"
D_INK = "#EFE7D6"
D_MUT = "#B8AE9C"
D_GOLD = "#C9A227"


def native_button(page, vid, text, fill, font_color, line, hover):
    doc = load(page, vid)
    doc["visual"].setdefault("objects", {})
    o = doc["visual"]["objects"]
    o["text"] = [obj({"show": lit("true")}),
                 obj({"text": lit(f"'{text}'"), "fontColor": solid(font_color),
                      "fontSize": lit("12D"), "fontFamily": lit("'Segoe UI'"),
                      "bold": lit("true")}, sel="default")]
    o["fill"] = [obj({"show": lit("true")}),
                 obj({"fillColor": solid(fill), "transparency": lit("0D")}, sel="default"),
                 obj({"fillColor": solid(hover), "transparency": lit("0D")}, sel="hover")]
    o["outline"] = [obj({"show": lit("true")}),
                    obj({"lineColor": solid(line), "weight": lit("1D")}, sel="default")]
    co = doc["visual"].setdefault("visualContainerObjects", {})
    co["border"] = [obj({"show": lit("true"), "color": solid(line), "radius": lit("12D")})]
    save(page, vid, doc)


# ============================================================ S4a (light)
def build_s4a():
    P = "s4a-most-colorful"
    set_text(P, "c_eyebrow",
             [("CHAPTER III · THE CHAMBER OF COLORS",
               {"size": "11pt", "color": GOLD, "bold": True, "spacing": 2})])
    rect(P, "c_eyebrow", x=48, y=44, width=520, height=20, z=110)

    # hero stat card
    make_card(P, "z_hero_card", 48, 82, 404, 208)
    doc = load(P, "kpi_hero_colors")
    doc["position"].update(x=68, y=96, width=368, height=132, z=120)
    doc["visual"]["objects"]["labels"][0]["properties"]["fontSize"] = lit("100D")
    save(P, "kpi_hero_colors", doc)
    set_text(P, "c_subhead",
             [("distinct colours in a single set",
               {"font": "Georgia", "size": "15pt", "color": MUT, "italic": True})])
    rect(P, "c_subhead", x=70, y=228, width=368, height=40, z=130)

    # story
    rect(P, "c_body", x=48, y=316, width=404, height=132, z=140)

    # native button (drop the box + label stack)
    delete(P, "z_btn_dark_box")
    delete(P, "c_btn_dark")
    doc = load(P, "btn_dark_side")
    doc["position"].update(x=48, y=470, width=404, height=54, z=900)
    save(P, "btn_dark_side", doc)
    native_button(P, "btn_dark_side", "Prefer the least colourful? Enter the dark →",
                  CARD, INK, HAIR, "#EFE6D4")

    # photo card
    card_chrome(P, "img_diagon")
    rect(P, "img_diagon", x=480, y=82, width=752, height=442, z=180)

    # composition strip card
    make_card(P, "z_comp_card", 48, 556, 1184, 112)
    set_text(P, "c_comp_title",
             [("COLOUR COMPOSITION", {"size": "11pt", "color": MUT, "bold": True, "spacing": 1, "inline": True}),
              ("   — all 55 marks in true hex, ordered by part count",
               {"size": "10pt", "color": FAINT, "inline": True})])
    rect(P, "c_comp_title", x=72, y=572, width=760, height=20, z=190)
    set_text(P, "c_comp_note",
             [("segment width = parts per colour", {"size": "10pt", "color": FAINT, "italic": True})])
    rect(P, "c_comp_note", x=948, y=572, width=264, height=20, z=200)
    rect(P, "dn_comp", x=72, y=600, width=1136, height=54, z=210)

    rect(P, "c_footer_l", x=48, y=684, width=560, height=22, z=230)
    rect(P, "c_footer_r", x=672, y=684, width=560, height=22, z=240)
    delete(P, "z_footer_rule")
    print("s4a redesign applied")


# ============================================================ S4b (dark twin)
def build_s4b():
    P = "s4b-dark-state"
    set_text(P, "c_eyebrow",
             [("CHAPTER III · THE CHAMBER OF GRAYS",
               {"size": "11pt", "color": D_GOLD, "bold": True, "spacing": 2})])
    rect(P, "c_eyebrow", x=48, y=44, width=520, height=20, z=110)

    # hero stat card (dark)
    make_card(P, "z_hero_card", 48, 82, 404, 200, fill=D_CARD, hairline=D_HAIR,
              blur=24, transp=82)
    set_text(P, "c_hero_gray",
             [("97.9%", {"font": "Georgia", "size": "84pt", "color": "#CFC9BE", "bold": True})])
    rect(P, "c_hero_gray", x=70, y=104, width=372, height=118, z=120)
    set_text(P, "c_subhead",
             [("of every brick is greyscale", {"font": "Georgia", "size": "15pt",
                                               "color": D_MUT, "italic": True})])
    rect(P, "c_subhead", x=72, y=222, width=368, height=40, z=130)

    rect(P, "c_body", x=48, y=292, width=404, height=92, z=140)

    # HP vs SW duo comparison card
    make_card(P, "z_duo_card", 48, 394, 404, 92, fill=D_CARD, hairline=D_HAIR,
              blur=20, transp=84)
    rect(P, "c_duo_sw", x=68, y=410, width=180, height=20, z=150)
    rect(P, "c_duo_hp", x=68, y=436, width=180, height=20, z=160)
    rect(P, "dn_duo", x=256, y=410, width=176, height=60, z=170)

    # native button (dark → gold)
    delete(P, "z_btn_light_box")
    delete(P, "c_btn_light")
    doc = load(P, "btn_light_side")
    doc["position"].update(x=48, y=500, width=404, height=44, z=900)
    save(P, "btn_light_side", doc)
    native_button(P, "btn_light_side", "← Back to the colour",
                  D_CARD, D_GOLD, D_GOLD, "#3A3020")

    # photos
    card_chrome(P, "img_tie", fill=D_CARD, hairline=D_HAIR, transp=82)
    rect(P, "img_tie", x=480, y=82, width=556, height=430, z=210)
    rect(P, "img_voldemort", x=1060, y=110, width=172, height=210, z=220)
    set_text(P, "c_curator",
             [("Curator of the grey collection", {"size": "10pt", "color": D_MUT, "italic": True})])
    rect(P, "c_curator", x=1044, y=326, width=200, height=40, z=230)

    # composition strip card (dark)
    make_card(P, "z_comp_card", 48, 556, 1184, 112, fill=D_CARD, hairline=D_HAIR,
              blur=24, transp=82)
    set_text(P, "c_comp_title",
             [("COLOUR COMPOSITION", {"size": "11pt", "color": D_MUT, "bold": True, "spacing": 1, "inline": True}),
              ("   — almost entirely grey, in true hex", {"size": "10pt", "color": "#9A907E", "inline": True})])
    rect(P, "c_comp_title", x=72, y=572, width=760, height=20, z=240)
    set_text(P, "c_comp_note",
             [("2.1% of parts carry any colour at all", {"size": "10pt", "color": "#9A907E", "italic": True})])
    rect(P, "c_comp_note", x=920, y=572, width=292, height=20, z=250)
    rect(P, "dn_comp_gray", x=72, y=600, width=1136, height=54, z=260)

    rect(P, "c_footer_l", x=48, y=684, width=560, height=22, z=280)
    rect(P, "c_footer_r", x=672, y=684, width=560, height=22, z=290)
    delete(P, "z_footer_rule")
    print("s4b redesign applied")


build_s4a()
build_s4b()
