"""Normative v2 'Storybook App' geometry — single source of truth shared by
gen_canvas.py (background wells) and gen_report.py (visual placement), so art
and visuals can never drift (design-handoff v2 addendum).

Conventions:
- rects are (x, y, w, h) on the 1280x720 canvas, 8px grid.
- "wells" are painted in the background PNG; the visual named by the key sits
  transparent on top, inset by INSET on charts/textboxes.
- "cards" are cardVisual slots: NO well painted (the card carries its own
  surface + dropShadow).
"""

CANVAS_W, CANVAS_H = 1280, 720
APPBAR_H = 72
FOOTER_LINE_Y = 684
INSET = 16          # chart/text inset inside a well
SCALE = 2           # PNG export scale

# nav chips (right-aligned in the app bar), chip i at NAV_X0 + i*(NAV_W+NAV_GAP)
NAV_W, NAV_H, NAV_GAP, NAV_Y = 56, 28, 8, 22
NAV_X0 = CANVAS_W - 24 - 5 * NAV_W - 4 * NAV_GAP   # = 944

# v2 tokens (design-brief v2)
T2 = {
    "field": "#F7F1E3", "well": "#FFFFFF", "well_line": "#DCD2BD",
    "appbar": "#05131D", "appbar_ink": "#F5F1E6", "appbar_ink2": "#A0A5A9",
    "gold": "#DBAC34", "ink": "#05131D", "ink2": "#6C6E68",
    "stud": "#16222E", "shadow": "#05131D",
    "d_field": "#05131D", "d_well": "#101820", "d_well_line": "#2A313B",
    "radius": 12,
}

PAGES = {
    "p1-home": {
        "numeral": "I", "title": "The Boy Who Came Back",
        "kicker": "LEGO Harry Potter vanished for seven years — this is the size of the return",
        "nav_index": 0,
        "wells": {
            "c_takeaway":          (24, 96, 792, 132),
            "hero_parts_timeline": (24, 244, 792, 424),
            "c_note_hiatus":       (832, 504, 424, 164),
        },
        "cards": {
            "kpi_sets_by_era":     (832, 96, 424, 120),
            "kpi_avg_size_by_era": (832, 232, 424, 120),
            "kpi_colors_by_era":   (832, 368, 424, 120),
        },
    },
    "p2-first-marriage": {
        "numeral": "II", "title": "The First Marriage",
        "kicker": "2001–2011 · a modest toy line in classic yellow",
        "nav_index": 1,
        "wells": {
            "tbl_fig_gallery":      (24, 216, 400, 452),
            "tbl_top_sets":         (440, 216, 816, 244),
            "ch_palette_strip":     (440, 476, 816, 72),
            "ch_size_distribution": (440, 564, 816, 104),
        },
        "cards": {
            "kpi_sets":   (24, 96, 296, 104),
            "kpi_size":   (336, 96, 296, 104),
            "kpi_colors": (648, 96, 296, 104),
            "kpi_gray":   (960, 96, 296, 104),
        },
    },
    "p3-second-marriage": {
        "numeral": "III", "title": "The Second Marriage",
        "kicker": "2018–now · it came back for the grown-ups",
        "nav_index": 2,
        "wells": {
            "tbl_fig_gallery":      (24, 216, 400, 452),
            "tbl_top_sets":         (440, 216, 816, 244),
            "ch_palette_strip":     (440, 476, 816, 72),
            "ch_size_distribution": (440, 564, 816, 104),
        },
        "cards": {
            "kpi_sets":   (24, 96, 296, 104),
            "kpi_size":   (336, 96, 296, 104),
            "kpi_colors": (648, 96, 296, 104),
            "kpi_gray":   (960, 96, 296, 104),
        },
    },
    "p4-color-dark-side": {
        "numeral": "IV", "title": "The Most Colorful Set",
        "kicker": "…and its dark side — Harry Potter vs Star Wars in brick color",
        "nav_index": 3,
        "wells": {
            "hero_color_composition": (24, 96, 660, 560),
            "ch_colorful_rank":       (700, 232, 556, 236),
            "c_rank_note":            (700, 556, 380, 100),
        },
        "cards": {
            "kpi_theme_grayness": (700, 96, 556, 120),
        },
        "extra_slots": {
            "btn_dark_side":  (700, 484, 556, 56),
            "img_voldemort":  (1096, 540, 160, 116),
        },
    },
    "p5-sorting-quiz": {
        "numeral": "V", "title": "The Sorting Quiz",
        "kicker": "ten minifigures, two eras — can you sort them?",
        "nav_index": 4,
        "wells": {
            "hero_quiz":     (24, 96, 792, 572),
            "c_era_legend":  (832, 216, 424, 88),
            "c_how_to_play": (832, 320, 424, 180),
            "c_fact":        (832, 516, 424, 152),
        },
        "cards": {
            "kpi_quiz_questions": (832, 96, 424, 104),
        },
    },
}

TT_PAGE = {"w": 320, "h": 200, "well": (8, 8, 304, 184)}


def inset(rect, pad=INSET):
    x, y, w, h = rect
    return (x + pad, y + pad, w - 2 * pad, h - 2 * pad)


def nav_chip_rect(i):
    return (NAV_X0 + i * (NAV_W + NAV_GAP), NAV_Y, NAV_W, NAV_H)
