"""W2 readability uplift for second-build.Report (one-shot transform).

Contract amendment 2026-07-14: readability + interactivity outrank
pixel-fidelity to the HTML prototype. This script applies the global type
floor, contrast fix, box growth, and button rebuild documented in
project-state/active/06-build.md. Run once from repo root:
    python project/analysis/authored-render/uplift_w2.py
"""

import json
import os
import shutil

ROOT = os.path.join("project", "pbip", "second-build.Report", "definition")
PAGES = os.path.join(ROOT, "pages")
THEME = os.path.join("project", "pbip", "second-build.Report",
                     "StaticResources", "RegisteredResources", "second-build.json")

GOLD_OLD, GOLD_NEW = "#8A6A21", "#7A5D1D"
FONT_MAP = {"8pt": "10pt", "9pt": "11pt", "10pt": "11pt"}
FONT_MAP_T1 = {"8pt": "9pt", "9pt": "10pt"}

log = []


def vpath(page, vid):
    return os.path.join(PAGES, page, "visuals", vid, "visual.json")


def load(page, vid):
    with open(vpath(page, vid), encoding="utf-8") as h:
        return json.load(h)


def save(page, vid, doc):
    with open(vpath(page, vid), "w", encoding="utf-8", newline="\n") as h:
        json.dump(doc, h, indent=2, ensure_ascii=False)


def lit(value):
    return {"expr": {"Literal": {"Value": value}}}


def solid(color):
    return {"solid": {"color": lit(f"'{color}'")}}


# ---------- global passes ----------

def bump_textruns(doc, font_map):
    changed = False
    general = doc.get("visual", {}).get("objects", {}).get("general", [])
    for entry in general:
        for para in entry.get("properties", {}).get("paragraphs", []) or []:
            for run in para.get("textRuns", []) or []:
                style = run.get("textStyle") or {}
                size = style.get("fontSize")
                if size in font_map:
                    style["fontSize"] = font_map[size]
                    changed = True
                if style.get("color") == GOLD_OLD:
                    style["color"] = GOLD_NEW
                    changed = True
    return changed


def bump_card_labels(doc):
    changed = False
    labels = doc.get("visual", {}).get("objects", {}).get("labels", [])
    for entry in labels:
        props = entry.get("properties", {})
        fs = props.get("fontSize", {}).get("expr", {}).get("Literal", {})
        if fs.get("Value") in ("22.5D", "22.5"):
            fs["Value"] = "26D"
            changed = True
    return changed


def global_pass():
    for page in sorted(os.listdir(PAGES)):
        vdir = os.path.join(PAGES, page, "visuals")
        if not os.path.isdir(vdir):
            continue
        font_map = FONT_MAP_T1 if page.startswith("t1") else FONT_MAP
        for vid in sorted(os.listdir(vdir)):
            try:
                doc = load(page, vid)
            except FileNotFoundError:
                continue
            changed = bump_textruns(doc, font_map)
            if page in ("s2-chapter1", "s3-chapter2") and vid.startswith("kpi_"):
                changed |= bump_card_labels(doc)
            if changed:
                save(page, vid, doc)
                log.append(f"{page}/{vid}: fonts/colors bumped")


# ---------- targeted rect ops ----------

def set_rect(page, vid, **kw):
    doc = load(page, vid)
    pos = doc.setdefault("position", {})
    before = {k: pos.get(k) for k in kw}
    pos.update(kw)
    save(page, vid, doc)
    log.append(f"{page}/{vid}: rect {before} -> {kw}")


def delete_visual(page, vid):
    folder = os.path.join(PAGES, page, "visuals", vid)
    if os.path.isdir(folder):
        shutil.rmtree(folder)
        log.append(f"{page}/{vid}: DELETED")


def get_textbox_text(page, vid):
    doc = load(page, vid)
    runs = []
    for entry in doc["visual"]["objects"]["general"]:
        for para in entry.get("properties", {}).get("paragraphs", []) or []:
            for run in para.get("textRuns", []) or []:
                runs.append(run.get("value", ""))
    return " ".join(runs).strip()


def style_button(page, vid, text, font_pt=12, fill="#FCF9F1", hover="#EFE6D4",
                 line="#211B14", font_color="#211B14"):
    doc = load(page, vid)
    objects = doc["visual"].setdefault("objects", {})
    objects["icon"] = [{"properties": {"shapeType": lit("'blank'")},
                       "selector": {"id": "default"}}]
    objects["text"] = [
        {"properties": {"show": lit("true")}},
        {"properties": {
            "text": lit(f"'{text}'"),
            "fontColor": solid(font_color),
            "fontSize": lit(f"{font_pt}D"),
            "fontFamily": lit("'Segoe UI'"),
            "bold": lit("true"),
        }, "selector": {"id": "default"}},
    ]
    objects["fill"] = [
        {"properties": {"show": lit("true")}},
        {"properties": {"fillColor": solid(fill), "transparency": lit("0D")},
         "selector": {"id": "default"}},
        {"properties": {"fillColor": solid(hover), "transparency": lit("0D")},
         "selector": {"id": "hover"}},
    ]
    objects["outline"] = [
        {"properties": {"show": lit("true")}},
        {"properties": {"lineColor": solid(line), "weight": lit("1D")},
         "selector": {"id": "default"}},
    ]
    save(page, vid, doc)
    log.append(f"{page}/{vid}: button styled '{text}'")


def s1_ops():
    page = "s1-home"
    set_rect(page, "c_title", height=180)
    # KPI trio: widen and space out (values + labels share columns)
    xs = [24, 192, 360]
    for i, x in enumerate(xs, start=1):
        set_rect(page, f"c_kpi_v_{i}", x=x, width=150)
        set_rect(page, f"c_kpi_l_{i}", x=x, width=150)
    # Nav buttons: one styled actionButton each; drop box/label/glyph stacks
    for i in range(1, 5):
        label = get_textbox_text(page, f"c_btn_label_{i}")
        style_button(page, f"btn_nav_{i}", label)
        for garbage in (f"z_btn_box_{i}", f"c_btn_label_{i}", f"img_btn_glyph_{i}"):
            delete_visual(page, garbage)
    for vid in ("c_footer_l", "c_footer_r"):
        set_rect(page, vid, y=690, height=26)


def chapter_ops(page):
    set_rect(page, "c_title", width=660, height=54)
    set_rect(page, "c_eyebrow", width=170, height=28)
    widths = {1: 90, 2: 130, 3: 130, 4: 90, 5: 110}
    for i, w in widths.items():
        set_rect(page, f"kpi_{i}", width=w, height=48)
        set_rect(page, f"c_kpi_l_{i}", y=155, height=22)
    set_rect(page, "c_dist_title", y=166, height=26)
    # keep chart bottoms; drop tops by 6 to clear the grown titles
    for vid in ("dn_dist", "dn_palette"):
        doc = load(page, vid)
        pos = doc["position"]
        pos["y"] = pos["y"] + 6
        pos["height"] = pos["height"] - 6
        save(page, vid, doc)
        log.append(f"{page}/{vid}: top +6 for title clearance")
    set_rect(page, "c_palette_title", y=166, height=26)
    set_rect(page, "c_palette_pct", y=166, height=26)
    for vid in ("c_split_l", "c_split_r"):
        set_rect(page, vid, height=24)
    for vid in ("c_footer_l", "c_footer_r"):
        set_rect(page, vid, y=690, height=26)


def s2_ops():
    page = "s2-chapter1"
    chapter_ops(page)
    for i in range(1, 5):
        doc = load(page, f"c_gmeta_{i}")
        doc["position"]["height"] = doc["position"]["height"] + 14
        save(page, f"c_gmeta_{i}", doc)
    for i in range(1, 5):
        set_rect(page, f"c_figcap_{i}", height=42)
    set_rect(page, "c_figcard_title", height=26)


def s3_ops():
    page = "s3-chapter2"
    chapter_ops(page)
    for i in range(1, 4):
        doc = load(page, f"c_gmeta_{i}")
        doc["position"]["height"] = doc["position"]["height"] + 14
        save(page, f"c_gmeta_{i}", doc)
    set_rect(page, "c_oldnew_title", height=26)
    for vid in ("c_figcap_old", "c_figcap_new"):
        set_rect(page, vid, height=26)
    doc = load(page, "c_oldnew_note")
    doc["position"]["width"] = 130
    doc["position"]["height"] = 100
    save(page, "c_oldnew_note", doc)


def s4_ops():
    style_button("s4a-most-colorful", "btn_dark_side",
                 "Come to the dark side →", font_pt=11)
    style_button("s4b-dark-state", "btn_light_side",
                 "← Back to the light", font_pt=11,
                 fill="#211B14", hover="#3A3228", line="#C9A227",
                 font_color="#C9A227")


def theme_ops():
    with open(THEME, encoding="utf-8") as h:
        theme = json.load(h)
    tc = theme.setdefault("textClasses", {})
    for cls, size in (("label", 11), ("header", 12), ("title", 20)):
        if cls in tc:
            tc[cls]["fontSize"] = size
    with open(THEME, "w", encoding="utf-8", newline="\n") as h:
        json.dump(theme, h, indent=2, ensure_ascii=False)
    log.append("theme: textClasses label 11 / header 12 / title 20")


global_pass()
s1_ops()
s2_ops()
s3_ops()
s4_ops()
theme_ops()
print(f"{len(log)} operations:")
for line in log:
    print(" ", line)
