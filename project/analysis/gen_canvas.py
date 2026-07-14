"""Generate the v2 'Storybook App' background art (canvas-studio doctrine:
furniture only, tokens only) from the normative geometry in layout.py.

Outputs, per page, into project/deliverables/canvas/:
  <page>.svg           (source of truth, hand-readable, grouped per zone)
  <page>.png           (@2x export via @resvg/resvg-js — see canvas-tools/)

Pages: p1..p5 light, p4-dark (full-bleed dark twin), tt-definitions mini.
Run:  python project/analysis/gen_canvas.py
"""

import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding="utf-8")
from layout import (CANVAS_W, CANVAS_H, APPBAR_H, FOOTER_LINE_Y, T2, PAGES,
                    TT_PAGE, NAV_W, NAV_GAP, NAV_Y, NAV_H, NAV_X0, nav_chip_rect)

OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "deliverables", "canvas"))
TOOLS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "canvas-tools")


def studs(y, color, x0=24, x1=None, r=3, gap=20):
    x1 = x1 if x1 is not None else CANVAS_W - 24
    dots = []
    x = x0
    while x <= x1:
        dots.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}"/>')
        x += gap
    return "\n    ".join(dots)


def well(rect, fill, line, dark=False):
    x, y, w, h = rect
    shadow_opacity = "0.35" if dark else "0.10"
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{T2["radius"]}" '
            f'fill="{fill}" stroke="{line}" stroke-width="1" '
            f'filter="url(#soft)" />')


def svg_page(page_id, spec, dark=False):
    field = T2["d_field"] if dark else T2["field"]
    wfill = T2["d_well"] if dark else T2["well"]
    wline = T2["d_well_line"] if dark else T2["well_line"]
    parts = []
    parts.append(f'<?xml version="1.0" encoding="UTF-8"?>')
    parts.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CANVAS_W} {CANVAS_H}" '
        f'width="{CANVAS_W}" height="{CANVAS_H}">')
    parts.append(
        '<defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%">'
        f'<feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="{T2["shadow"]}" '
        f'flood-opacity="{0.45 if dark else 0.12}"/></filter></defs>')

    # field
    parts.append(f'<g id="field"><rect width="{CANVAS_W}" height="{CANVAS_H}" fill="{field}"/></g>')

    # app bar (always the dark chrome band)
    parts.append('<g id="appbar">')
    parts.append(f'<rect width="{CANVAS_W}" height="{APPBAR_H}" fill="{T2["appbar"]}"/>')
    # ghost numeral in the bar, left of the nav chips (chrome, not data zone)
    parts.append(
        f'<text x="{NAV_X0 - 48}" y="60" font-family="Georgia" font-size="64" '
        f'font-style="italic" fill="#16222E" text-anchor="end">{spec["numeral"]}</text>')
    # gold hairline under the bar + stud strip riding on it
    parts.append(f'<rect x="0" y="{APPBAR_H - 2}" width="{CANVAS_W}" height="2" fill="{T2["gold"]}"/>')
    parts.append(f'<g id="studs">{studs(APPBAR_H - 12, T2["stud"])}</g>')
    # active-nav underline pill
    cx, cy, cw, ch = nav_chip_rect(spec["nav_index"])
    parts.append(
        f'<rect x="{cx + 10}" y="{NAV_Y + NAV_H + 6}" width="{cw - 20}" height="4" rx="2" '
        f'fill="{T2["gold"]}"/>')
    parts.append('</g>')

    # wells
    parts.append('<g id="wells">')
    for name, rect in spec.get("wells", {}).items():
        parts.append(f'<!-- {name} -->')
        parts.append(well(rect, wfill, wline, dark=dark))
    parts.append('</g>')

    # footer hairline
    line = T2["d_well_line"] if dark else T2["well_line"]
    parts.append(
        f'<g id="footer"><rect x="24" y="{FOOTER_LINE_Y}" width="{CANVAS_W - 48}" '
        f'height="1" fill="{line}"/></g>')

    parts.append('</svg>')
    return "\n  ".join(parts)


def svg_tooltip():
    x, y, w, h = TT_PAGE["well"]
    return (
        f'<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {TT_PAGE["w"]} {TT_PAGE["h"]}" '
        f'width="{TT_PAGE["w"]}" height="{TT_PAGE["h"]}">\n'
        f'<defs><filter id="soft" x="-20%" y="-20%" width="140%" height="140%">'
        f'<feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="{T2["shadow"]}" '
        f'flood-opacity="0.14"/></filter></defs>\n'
        f'<rect width="{TT_PAGE["w"]}" height="{TT_PAGE["h"]}" fill="{T2["field"]}"/>\n'
        f'<rect x="0" y="0" width="{TT_PAGE["w"]}" height="6" fill="{T2["appbar"]}"/>\n'
        f'<rect x="0" y="6" width="{TT_PAGE["w"]}" height="1.5" fill="{T2["gold"]}"/>\n'
        f'<rect x="{x}" y="{y + 8}" width="{w}" height="{h - 8}" rx="{T2["radius"]}" '
        f'fill="{T2["well"]}" stroke="{T2["well_line"]}" filter="url(#soft)"/>\n'
        f'</svg>')


def main():
    os.makedirs(OUT, exist_ok=True)
    jobs = []
    for pid, spec in PAGES.items():
        svg = svg_page(pid, spec, dark=False)
        path = os.path.join(OUT, f"{pid}.svg")
        open(path, "w", encoding="utf-8", newline="\n").write(svg)
        jobs.append((f"{pid}.svg", f"{pid}.png", 2))
    # dark twin for p4 (same geometry, dark fills; wells for the dark-state slots)
    p4 = dict(PAGES["p4-color-dark-side"])
    svg = svg_page("p4-dark", p4, dark=True)
    open(os.path.join(OUT, "p4-dark.svg"), "w", encoding="utf-8", newline="\n").write(svg)
    jobs.append(("p4-dark.svg", "p4-dark.png", 2))
    # tooltip mini
    open(os.path.join(OUT, "tt-definitions.svg"), "w", encoding="utf-8", newline="\n").write(svg_tooltip())
    jobs.append(("tt-definitions.svg", "tt-definitions.png", 2))

    # SVG -> PNG via local resvg (canvas-tools)
    manifest = os.path.join(OUT, "_jobs.txt")
    with open(manifest, "w", encoding="utf-8", newline="\n") as fh:
        for src, dst, scale in jobs:
            fh.write(f"{src}\t{dst}\t{scale}\n")
    r = subprocess.run(["node", os.path.join(TOOLS, "svg2png.mjs"), OUT, manifest],
                       capture_output=True, text=True)
    print(r.stdout.strip())
    if r.returncode != 0:
        print(r.stderr.strip())
        sys.exit(1)
    print(f"canvas: {len(jobs)} backgrounds in {OUT}")


if __name__ == "__main__":
    main()
