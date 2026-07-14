"""Fetch/render every static asset the two-marriages-v2 report registers.

- SVG glyphs are copied verbatim from the hi-fi prototype's inline SVGs
  (design_references/Phase 2 - Hi-fi Screens.dc.html) and rendered to PNG
  @2x with the local resvg toolchain (canvas-tools).
- Set/minifig photos come from the Rebrickable CDN (attributed on every
  page footer); they are registered resources so the exported .pbix renders
  without connectivity.
- Derives the 2026 Hermione fig for S3's old-vs-new card from the CSVs.

Output: project/pbip/two-marriages-v2.Report/StaticResources/RegisteredResources/
Run:    python project/analysis/fetch_v2_assets.py
"""

import csv
import io
import os
import subprocess
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(REPO, "project", "pbip", "two-marriages-v2.Report",
                   "StaticResources", "RegisteredResources")
TOOLS = os.path.join(HERE, "canvas-tools")
DATA = r"E:\PowerBI Set-up\World Champs Round 2 Data"

sys.stdout.reconfigure(encoding="utf-8")

# ---------------------------------------------------------------- glyph SVGs
BRICK = ('<rect x="{x0}" y="9" width="42" height="16" fill="{f}" stroke="#211B14" stroke-width="1.5"/>'
         '<rect x="{x1}" y="2" width="12" height="7" rx="1" fill="{f}" stroke="#211B14" stroke-width="1.5"/>'
         '<rect x="{x2}" y="2" width="12" height="7" rx="1" fill="{f}" stroke="#211B14" stroke-width="1.5"/>')

SVGS = {
    # S1 masthead mark — verbatim from the prototype
    "glyph_spectacles.svg": (
        '<svg xmlns="http://www.w3.org/2000/svg" width="66" height="30" viewBox="0 0 64 30" fill="none">'
        '<circle cx="16" cy="18" r="10" stroke="#211B14" stroke-width="2.5"/>'
        '<circle cx="46" cy="18" r="10" stroke="#211B14" stroke-width="2.5"/>'
        '<path d="M26 18 Q31 14 36 18" stroke="#211B14" stroke-width="2.5" fill="none"/>'
        '<path d="M33 1 L28 8 L32 8 L27 15" stroke="#8A6A21" stroke-width="2.5" fill="none" stroke-linejoin="round"/>'
        '</svg>'),
    "glyph_brick_red.svg": (
        '<svg xmlns="http://www.w3.org/2000/svg" width="46" height="27" viewBox="0 0 44 26">'
        + BRICK.format(x0=1, x1=6, x2=26, f="#C91A09") + '</svg>'),
    # S1 title ornament: era-colored brick pair, 4px gap (two 54x22 bricks)
    "glyph_ornament.svg": (
        '<svg xmlns="http://www.w3.org/2000/svg" width="112" height="22" viewBox="0 0 112 22">'
        '<g><rect x="0.75" y="8" width="52.5" height="13.25" fill="#8C7A5B"/>'
        '<rect x="6" y="0.75" width="14" height="7.25" rx="1" fill="#8C7A5B"/>'
        '<rect x="34" y="0.75" width="14" height="7.25" rx="1" fill="#8C7A5B"/></g>'
        '<g transform="translate(58,0)"><rect x="0.75" y="8" width="52.5" height="13.25" fill="#6E2B25"/>'
        '<rect x="6" y="0.75" width="14" height="7.25" rx="1" fill="#6E2B25"/>'
        '<rect x="34" y="0.75" width="14" height="7.25" rx="1" fill="#6E2B25"/></g></svg>'),
}
NAV = {"glyph_nav_1.svg": "#F2CD37", "glyph_nav_2.svg": "#C91A09",
       "glyph_nav_3.svg": "#0055BF", "glyph_nav_4.svg": "#2E5941"}
for name, hexv in NAV.items():
    SVGS[name] = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12">'
        f'<rect x="0.75" y="4" width="16.5" height="7.25" fill="{hexv}" stroke="#211B14" stroke-width="1"/>'
        f'<rect x="3" y="0.75" width="4.5" height="3.25" fill="{hexv}" stroke="#211B14" stroke-width="1"/>'
        f'<rect x="10.5" y="0.75" width="4.5" height="3.25" fill="{hexv}" stroke="#211B14" stroke-width="1"/></svg>')

# ------------------------------------------------------------------- photos
SET_IMGS = ["4709-1", "10217-1", "10132-1", "4842-1",     # S2 gallery
            "71043-1", "76444-1", "75978-1",              # S3 gallery + S4a hero
            "10175-1"]                                    # S4b Vader's TIE
FIG_IMGS = ["fig-000471", "fig-000593", "fig-000594", "fig-006056",  # S2 faces
            "fig-002136"]                                            # Voldemort


def hermione_2026():
    """Newest flesh-era Hermione fig (S3 old-vs-new card, right photo)."""
    def rd(name):
        with io.open(os.path.join(DATA, name), encoding="utf-8") as f:
            return list(csv.DictReader(f))
    inv = {r["id"]: r["set_num"] for r in rd("inventories.csv") if r["version"] == "1"}
    sets = {s["set_num"]: int(s["year"]) for s in rd("sets.csv")}
    figs = {m["fig_num"]: m["name"] for m in rd("minifigs.csv")}
    best = (0, None)
    for r in rd("inventory_minifigs.csv"):
        sn = inv.get(r["inventory_id"])
        y = sets.get(sn, 0)
        if y >= 2018 and figs.get(r["fig_num"], "").startswith("Hermione"):
            if y > best[0]:
                best = (y, r["fig_num"])
    return best


def main():
    os.makedirs(OUT, exist_ok=True)
    jobs = []
    for name, svg in SVGS.items():
        with open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n") as fh:
            fh.write(svg)
        jobs.append((name, name.replace(".svg", ".png"), 2))
    manifest = os.path.join(OUT, "_glyph_jobs.txt")
    with open(manifest, "w", encoding="utf-8", newline="\n") as fh:
        for j in jobs:
            fh.write("\t".join(map(str, j)) + "\n")
    r = subprocess.run(["node", os.path.join(TOOLS, "svg2png.mjs"), OUT, manifest],
                       capture_output=True, text=True)
    print(r.stdout.strip())
    if r.returncode != 0:
        print(r.stderr.strip()); sys.exit(1)
    for p in [manifest] + [os.path.join(OUT, n) for n in SVGS]:
        os.remove(p)  # only the PNGs get registered

    y, fig = hermione_2026()
    print(f"hermione 2026-era fig: {fig} ({y})")
    fig_imgs = FIG_IMGS + [fig]

    for sid in SET_IMGS:
        dst = os.path.join(OUT, f"img_set_{sid.replace('-', '_')}.jpg")
        urllib.request.urlretrieve(f"https://cdn.rebrickable.com/media/sets/{sid}.jpg", dst)
        print("set", sid, os.path.getsize(dst))
    for fid in fig_imgs:
        dst = os.path.join(OUT, f"img_{fid.replace('-', '_')}.jpg")
        urllib.request.urlretrieve(f"https://cdn.rebrickable.com/media/sets/{fid}.jpg", dst)
        print("fig", fid, os.path.getsize(dst))
    with open(os.path.join(OUT, "_hermione2026.txt"), "w") as fh:
        fh.write(f"{fig}\t{y}\n")
    print("assets complete:", len(os.listdir(OUT)), "files in", OUT)


if __name__ == "__main__":
    main()
