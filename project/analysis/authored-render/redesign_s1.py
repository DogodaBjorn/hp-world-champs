"""v2.2 redesign — S1 landing (magazine cover; Key Takeaway as the headline).

Run from repo root:  python project/analysis/authored-render/redesign_s1.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from v22 import *  # noqa

P = "s1-home"

# ---------------------------------------------------------------- de-clutter
delete(P, "img_ornament")        # brick strip that collided with takeaway text
for z in ("z_kpi_strip_1", "z_kpi_strip_2", "z_kpi_strip_3"):
    delete(P, z)                 # old KPI underlines; the card carries structure
delete(P, "z_takeaway_box")      # flat box -> designed card (rebuilt below)
delete(P, "z_rule_v")            # vertical divider; whitespace defines columns now
for v in ("c_axis_1", "c_axis_2", "c_axis_3", "z_axis_rule",
          "z_brk_h", "z_brk_l", "z_brk_r"):
    delete(P, v)                 # manual axis band labels; Deneb draws its own axis

# ---------------------------------------------------------------- brand lockup
rect(P, "img_mark_spectacles", x=48, y=40, width=42, height=26, z=130)
rect(P, "img_mark_brick", x=98, y=42, width=40, height=24, z=130)

# ---------------------------------------------------------------- masthead
set_text(P, "c_eyebrow",
         [("A LEGO RETROSPECTIVE · 2001–2026",
           {"size": "11pt", "color": GOLD, "bold": True, "spacing": 1.5})])
rect(P, "c_eyebrow", x=48, y=80, width=344, height=20, z=140)

set_text(P, "c_title",
         [("The Boy Who Came Back",
           {"font": "Georgia", "size": "40pt", "color": INK, "bold": True})])
rect(P, "c_title", x=44, y=104, width=360, height=190, z=150)

# ---------------------------------------------------------------- KPI trio
KPI = [("67", "142", "sets"), ("267", "731", "avg parts"),
       ("66", "79", "colors")]
xs = [48, 166, 284]
for i, (a, b, lab) in enumerate(KPI, start=1):
    x = xs[i - 1]
    set_text(P, f"c_kpi_v_{i}",
             [(a, {"font": "Georgia", "size": "20pt", "color": FAINT, "bold": True, "inline": True}),
              (" → ", {"size": "13pt", "color": GOLD, "inline": True}),
              (b, {"font": "Georgia", "size": "20pt", "color": INK, "bold": True, "inline": True})])
    rect(P, f"c_kpi_v_{i}", x=x, y=318, width=112, height=30, z=210)
    set_text(P, f"c_kpi_l_{i}",
             [(lab.upper(), {"size": "9.5pt", "color": MUT, "spacing": 1})])
    rect(P, f"c_kpi_l_{i}", x=x, y=350, width=112, height=18, z=220)

# a single hairline under the trio (thin gold rule) reused from a strip name
make_card(P, "z_kpi_rule", 48, 306, 348, 2, z=60, fill=GOLD,
          radius=0, shadow=False, hairline=None)

# ---------------------------------------------------------------- nav pills
NAV = {"btn_nav_1": (48, 452), "btn_nav_2": (224, 452),
       "btn_nav_3": (48, 524), "btn_nav_4": (224, 524)}
for vid, (x, y) in NAV.items():
    doc = load(P, vid)
    doc["position"].update(x=x, y=y, width=168, height=60, z=900)
    co = doc["visual"].setdefault("visualContainerObjects", {})
    co["border"] = [obj({"show": lit("true"), "color": solid(HAIR),
                         "radius": lit("12D")})]
    co["dropShadow"] = [obj({"show": lit("true"), "color": solid(INK),
                             "position": lit("'Outer'"), "preset": lit("'Bottom'"),
                             "shadowBlur": lit("16D"), "shadowDistance": lit("3D"),
                             "shadowSpread": lit("0D"), "transparency": lit("90D")})]
    save(P, vid, doc)

# ---------------------------------------------------------------- takeaway hero
# card behind the takeaway, gold left-accent bar, big headline + support
make_card(P, "z_takeaway_card", 424, 48, 808, 168, z=60)
make_card(P, "z_takeaway_accent", 424, 48, 6, 168, z=70, fill=GOLD,
          radius=0, shadow=False, hairline=None)
textbox(P, "c_takeaway_eyebrow", 456, 70, 740, 20,
        [("KEY TAKEAWAY", {"size": "11pt", "color": GOLD, "bold": True, "spacing": 2})],
        z=190)
set_text(P, "c_takeaway_body",
         [("Seven years dark — back at nearly triple the scale.",
           {"font": "Georgia", "size": "21pt", "color": INK, "bold": True}),
          ("LEGO Harry Potter went quiet after 2011, then returned in 2018: bigger "
           "sets, more colours, aimed at the kids who had grown up. Two builds of "
           "one franchise, told across 576 minifigures.",
           {"size": "13pt", "color": MUT})])
rect(P, "c_takeaway_body", x=456, y=100, width=748, height=104, z=190)

# ---------------------------------------------------------------- hero chart card
card_chrome(P, "dn_hero")
rect(P, "dn_hero", x=424, y=248, width=808, height=384, z=470)
# chart title + legend ride on the card's top edge
set_text(P, "c_chart_title",
         [("PARTS SHIPPED PER YEAR", {"size": "11pt", "color": MUT, "bold": True, "spacing": 1})])
rect(P, "c_chart_title", x=452, y=266, width=360, height=20, z=490)
rect(P, "c_legend", x=812, y=266, width=396, height=20, z=490)
# annotations float over the plot
rect(P, "c_silence_1", x=724, y=330, width=210, height=30, z=800)
rect(P, "c_silence_2", x=724, y=360, width=210, height=18, z=800)

# ---------------------------------------------------------------- footer
rect(P, "c_footer_l", x=48, y=684, width=560, height=24, z=580)
rect(P, "c_footer_r", x=672, y=684, width=560, height=24, z=580)

print("s1 redesign applied")
