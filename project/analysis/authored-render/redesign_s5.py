"""v2.2 redesign — S5 Character Explorer (The Sorting Ceremony).

Three clean cards: the cast list (tap a name) | the character detail (name,
stats, era split, variants timeline) | the portrait. Removes the big empty
quiz frame that made the page read as dead space.

Run from repo root:  python project/analysis/authored-render/redesign_s5.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from v22 import *  # noqa

P = "s5-sorting-quiz"

# ---- de-clutter: the outer frame + rules ----
delete(P, "z_quiz_frame")
delete(P, "z_header_rule")
delete(P, "z_footer_rule")

# ---- header ----
set_text(P, "c_eyebrow",
         [("CHAPTER IV", {"size": "11pt", "color": "#2E5941", "bold": True, "spacing": 2})])
rect(P, "c_eyebrow", x=48, y=44, width=300, height=18, z=110)
set_text(P, "c_title",
         [("The Sorting Ceremony", {"font": "Georgia", "size": "26pt", "color": INK, "bold": True})])
rect(P, "c_title", x=46, y=62, width=640, height=42, z=120)
set_text(P, "c_subtitle",
         [("Tap any character — the whole panel follows your choice.",
           {"size": "13pt", "color": MUT})])
rect(P, "c_subtitle", x=48, y=108, width=700, height=22, z=130)

# ---- left card: the cast ----
make_card(P, "z_cast_card", 48, 140, 340, 528)
textbox(P, "c_cast_title", 72, 158, 300, 18,
        [("THE CAST — TAP A NAME", {"size": "10pt", "color": GOLD, "bold": True, "spacing": 1.5})], z=300)
doc = load(P, "tbl_cast")
doc["position"].update(x=64, y=186, width=308, height=468, z=310)
save(P, "tbl_cast", doc)

# ---- center card: character detail ----
make_card(P, "z_detail_card", 408, 140, 480, 528)
textbox(P, "c_detail_eyebrow", 432, 158, 300, 16,
        [("SELECTED CHARACTER", {"size": "9pt", "color": GOLD, "bold": True, "spacing": 2})], z=315)
doc = load(P, "crd_char")
doc["position"].update(x=432, y=176, width=432, height=44, z=320)
doc["visual"]["objects"] = {
    "labels": [obj({"fontSize": lit("25D"), "color": solid(INK),
                    "fontFamily": lit("'Georgia'"), "bold": lit("true")})],
    "categoryLabels": [obj({"show": lit("false")})]}
doc["visual"].setdefault("visualContainerObjects", {})["background"] = [obj({"show": lit("false")})]
doc["visual"]["visualContainerObjects"]["border"] = [obj({"show": lit("false")})]
save(P, "crd_char", doc)
# three stat cards
stats = [("crd_variants", "lbl_variants", 432), ("crd_first", "lbl_first", 584),
         ("crd_latest", "lbl_latest", 736)]
for val, lab, x in stats:
    doc = load(P, val)
    doc["position"].update(x=x, y=232, width=148, height=44, z=330)
    doc["visual"]["objects"] = {
        "labels": [obj({"fontSize": lit("20D"), "color": solid(INK),
                        "fontFamily": lit("'Georgia'"), "bold": lit("true")})],
        "categoryLabels": [obj({"show": lit("false")})]}
    doc["visual"].setdefault("visualContainerObjects", {})["background"] = [obj({"show": lit("false")})]
    doc["visual"]["visualContainerObjects"]["border"] = [obj({"show": lit("false")})]
    save(P, val, doc)
    rect(P, lab, x=x, y=278, width=150, height=18, z=330)
# era split bar
doc = load(P, "bar_eras")
doc["position"].update(x=432, y=320, width=432, height=116, z=320)
doc["visual"].setdefault("visualContainerObjects", {})["title"] = [
    obj({"show": lit("true"), "text": lit("'VARIANTS BY BUILD'"),
         "fontColor": solid(MUT), "fontSize": lit("10D"),
         "fontFamily": lit("'Segoe UI'"), "bold": lit("true")})]
save(P, "bar_eras", doc)
# variants timeline
doc = load(P, "tbl_appear")
doc["position"].update(x=432, y=450, width=432, height=202, z=320)
doc["visual"].setdefault("visualContainerObjects", {})["title"] = [
    obj({"show": lit("true"), "text": lit("'EVERY VARIANT — YEAR · NAME · SKIN'"),
         "fontColor": solid(MUT), "fontSize": lit("10D"),
         "fontFamily": lit("'Segoe UI'"), "bold": lit("true")})]
save(P, "tbl_appear", doc)

# ---- right card: portrait ----
make_card(P, "z_portrait_card", 908, 140, 324, 528)
textbox(P, "c_portrait_title", 932, 158, 280, 18,
        [("THE MINIFIGURE", {"size": "10pt", "color": GOLD, "bold": True, "spacing": 1.5})], z=300)
doc = load(P, "img_char")
doc["position"].update(x=932, y=186, width=276, height=340, z=320)
save(P, "img_char", doc)
set_text(P, "c_cast_hint",
         [("Each character's main minifigure. Photos: Rebrickable (rebrickable.com).",
           {"size": "11pt", "color": FAINT, "italic": True})])
rect(P, "c_cast_hint", x=932, y=540, width=276, height=100, z=330)

# ---- footer ----
rect(P, "c_footer_l", x=48, y=684, width=560, height=22, z=340)
rect(P, "c_footer_r", x=672, y=684, width=560, height=22, z=340)

print("s5 redesign applied")
