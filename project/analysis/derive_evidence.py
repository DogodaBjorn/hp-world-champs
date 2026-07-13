"""Re-derive the mission's evidence pack (E1-E10) from the contest CSVs.

Contracted definitions (stage 2/3, user-signed):
- HP scope: strict — sets whose theme flattens to root id 246 "Harry Potter".
- Parts Shipped: version-1 inventories only, is_spare excluded (M-002).
- Avg Parts per Set: mean of sets.num_parts (M-003), NOT parts/sets.
- Distinct Colors Used: excludes pseudo-colors -1 and 9999 (M-004).
- Grayscale set: color name contains gray/grey/black/white, case-insensitive;
  silvers/titaniums NOT included (M-005).
- Era (M-008): <=2011 era1, 2012-2017 hiatus, >=2018 era2; HP root only.

Output: evidence-manifest.json next to this script (markdown authored from it).
Stdlib only. Windows-safe stdout (UTF-8 reconfigure, repo convention).
"""

import csv
import json
import os
import re
import sys
from collections import defaultdict

sys.stdout.reconfigure(encoding="utf-8")

DATA = r"e:\PowerBI Set-up\World Champs Round 2 Data"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "evidence-manifest.json")

HP_ROOT = 246
SW_NAME_RE = re.compile(r"star wars", re.I)
GRAY_RE = re.compile(r"gray|grey|black|white", re.I)
PSEUDO = {-1, 9999}


def read(name):
    with open(os.path.join(DATA, name), encoding="utf-8-sig", newline="") as fh:
        yield from csv.DictReader(fh)


# ---- themes: root + name ---------------------------------------------------
parent = {}
tname = {}
for r in read("themes.csv"):
    tid = int(r["id"])
    tname[tid] = r["name"]
    parent[tid] = int(r["parent_id"]) if r["parent_id"] else None


def root_of(tid):
    seen = set()
    while parent.get(tid) is not None and tid not in seen:
        seen.add(tid)
        tid = parent[tid]
    return tid


# ---- sets -------------------------------------------------------------------
sets = {}
for r in read("sets.csv"):
    tid = int(r["theme_id"])
    rt = root_of(tid)
    year = int(r["year"])
    era = (
        ("era1" if year <= 2011 else "hiatus" if year <= 2017 else "era2")
        if rt == HP_ROOT
        else "n/a"
    )
    sets[r["set_num"]] = {
        "name": r["name"],
        "year": year,
        "theme_id": tid,
        "root": rt,
        "root_name": tname[rt],
        "num_parts": int(r["num_parts"]),
        "img_url": r["img_url"],
        "era": era,
    }

hp_sets = {k: v for k, v in sets.items() if v["root"] == HP_ROOT}

# look-alikes excluded by strict scope (G3 record)
lookalike_themes = {656, 691, 710}
lookalikes = {k: v for k, v in sets.items() if v["theme_id"] in lookalike_themes}

# ---- colors ------------------------------------------------------------------
colors = {}
for r in read("colors.csv"):
    cid = int(r["id"])
    colors[cid] = {
        "name": r["name"],
        "rgb": r["rgb"],
        "is_trans": r["is_trans"] == "True",
        "gray": bool(GRAY_RE.search(r["name"])),
        "pseudo": cid in PSEUDO,
    }

# ---- inventories: set -> v1 inventory ids ------------------------------------
v1_inv = {}          # inventory_id -> set_num, for version-1 inventories only
sets_with_v1 = set()
for r in read("inventories.csv"):
    if r["version"] == "1":
        v1_inv[int(r["id"])] = r["set_num"]
        sets_with_v1.add(r["set_num"])

hp_no_v1 = sorted(k for k in hp_sets if k not in sets_with_v1)

# ---- inventory_parts sweep (the 130 MB pass) ----------------------------------
set_parts = defaultdict(int)            # set -> shipped qty
set_gray = defaultdict(int)             # set -> gray qty
set_colors = defaultdict(set)           # set -> distinct real color ids
root_parts = defaultdict(int)           # root theme -> qty
root_gray = defaultdict(int)
root_colors = defaultdict(set)
era_parts = defaultdict(int)            # HP era -> qty
era_gray = defaultdict(int)
era_colors = defaultdict(set)
hp_year_parts = defaultdict(int)        # HP: year -> qty
era1_color_qty = defaultdict(int)       # HP era1: color -> qty (palette strip / brand kit)
era2_color_qty = defaultdict(int)
hp_color_qty = defaultdict(int)

for r in read("inventory_parts.csv"):
    inv = int(r["inventory_id"])
    sn = v1_inv.get(inv)
    if sn is None or r["is_spare"] == "True":
        continue
    qty = int(r["quantity"])
    cid = int(r["color_id"])
    c = colors[cid]
    s = sets.get(sn)
    if s is None:
        continue
    set_parts[sn] += qty
    if c["gray"]:
        set_gray[sn] += qty
    if not c["pseudo"]:
        set_colors[sn].add(cid)
    rt = s["root"]
    root_parts[rt] += qty
    if c["gray"]:
        root_gray[rt] += qty
    if not c["pseudo"]:
        root_colors[rt].add(cid)
    if s["era"] != "n/a":
        era_parts[s["era"]] += qty
        if c["gray"]:
            era_gray[s["era"]] += qty
        if not c["pseudo"]:
            era_colors[s["era"]].add(cid)
        hp_year_parts[s["year"]] += qty
        hp_color_qty[cid] += qty
        if s["era"] == "era1":
            era1_color_qty[cid] += qty
        elif s["era"] == "era2":
            era2_color_qty[cid] += qty

# ---- minifigs -----------------------------------------------------------------
figs = {}
for r in read("minifigs.csv"):
    figs[r["fig_num"]] = {
        "name": r["name"],
        "num_parts": int(r["num_parts"]),
        "img_url": r["img_url"],
    }


def character(fig_name):
    return re.split(r"[,(]", fig_name, 1)[0].strip()


fig_sets = defaultdict(set)              # fig -> HP sets containing it (v1)
for r in read("inventory_minifigs.csv"):
    sn = v1_inv.get(int(r["inventory_id"]))
    if sn is None:
        continue
    if sn in hp_sets:
        fig_sets[r["fig_num"]].add(sn)

hp_figs = sorted(fig_sets)
fig_eras = {}
for f in hp_figs:
    eras = {hp_sets[s]["era"] for s in fig_sets[f]}
    fig_eras[f] = eras

char_figs = defaultdict(lambda: {"era1": set(), "era2": set(), "hiatus": set()})
for f in hp_figs:
    ch = character(figs[f]["name"])
    for e in fig_eras[f]:
        char_figs[ch][e].add(f)

both_era_chars = sorted(
    ch for ch, d in char_figs.items() if d["era1"] and d["era2"]
)

# quiz pool: suggested characters, figs per era with img_urls; yellow-skin pairs
POOL = ["Harry Potter", "Hermione Granger", "Ron Weasley", "Draco Malfoy",
        "Albus Dumbledore", "Professor Severus Snape", "Severus Snape",
        "Professor McGonagall", "Minerva McGonagall", "Voldemort",
        "Lord Voldemort", "Luna Lovegood", "Ginny Weasley"]
quiz_pool = {}
for ch in sorted(char_figs):
    if any(p.lower() in ch.lower() or ch.lower() in p.lower() for p in POOL):
        d = char_figs[ch]
        quiz_pool[ch] = {
            "era1_figs": sorted(d["era1"]),
            "era2_figs": sorted(d["era2"]),
        }

yellow_figs = sorted(
    f for f in hp_figs if "yellow" in figs[f]["name"].lower()
)

# ---- assemble manifest ----------------------------------------------------------


def era_set_stats(era):
    ss = [v for v in hp_sets.values() if v["era"] == era]
    return {
        "sets": len(ss),
        "avg_num_parts": round(sum(s["num_parts"] for s in ss) / len(ss), 1) if ss else 0,
        "max_num_parts": max((s["num_parts"] for s in ss), default=0),
        "max_set": max(ss, key=lambda s: s["num_parts"])["name"] if ss else None,
    }


def pct(a, b):
    return round(100.0 * a / b, 1) if b else None


# E6: most colorful sets ever (distinct real colors per set)
colorful = sorted(set_colors.items(), key=lambda kv: -len(kv[1]))[:10]
e6_top = [
    {"set_num": k, "name": sets[k]["name"], "year": sets[k]["year"],
     "root": sets[k]["root_name"], "distinct_colors": len(v)}
    for k, v in colorful
]

# E7: grayest sets >= 1000 shipped parts
big = [(k, set_gray[k] / set_parts[k]) for k in set_parts if set_parts[k] >= 1000]
grayest = sorted(big, key=lambda kv: -kv[1])[:10]
e7_top = [
    {"set_num": k, "name": sets[k]["name"], "year": sets[k]["year"],
     "root": sets[k]["root_name"], "parts": set_parts[k],
     "gray_pct": round(100 * g, 1)}
    for k, g in grayest
]

# E8: gray share per root theme (>= 50k shipped parts = "major")
majors = sorted(
    ((rt, root_parts[rt], pct(root_gray[rt], root_parts[rt]))
     for rt in root_parts if root_parts[rt] >= 50000),
    key=lambda t: -(t[2] or 0),
)
e8 = [{"root": tname[rt], "parts": p, "gray_pct": g} for rt, p, g in majors]

manifest = {
    "derived": "2026-07-13",
    "definitions": "strict HP scope (root 246); v1 inventories, no spares; gray = name rule; pseudo-colors excluded from color counts",
    "E1_era1": era_set_stats("era1"),
    "E2_era2": era_set_stats("era2"),
    "E2_era2_2018_2026_only": {
        "sets": sum(1 for v in hp_sets.values() if v["era"] == "era2" and v["year"] <= 2026),
    },
    "E3_hiatus_sets_by_year": {
        y: sum(1 for v in hp_sets.values() if v["year"] == y) for y in range(2012, 2018)
    },
    "E4_parts_2018": hp_year_parts.get(2018, 0),
    "E4_parts_2001_2004": sum(hp_year_parts.get(y, 0) for y in range(2001, 2005)),
    "E5_palette": {
        "era1_distinct_colors": len(era_colors["era1"]),
        "era1_gray_pct": pct(era_gray["era1"], era_parts["era1"]),
        "era2_distinct_colors": len(era_colors["era2"]),
        "era2_gray_pct": pct(era_gray["era2"], era_parts["era2"]),
    },
    "E6_most_colorful_sets": e6_top,
    "E7_grayest_big_sets": e7_top,
    "E8_gray_by_major_root_theme": e8,
    "E8_hp_lifetime_colors": len(root_colors[HP_ROOT]),
    "root_theme_lifetime_colors_major": sorted(
        ({"root": tname[rt], "distinct_colors": len(root_colors[rt]),
          "parts": root_parts[rt], "gray_pct": pct(root_gray[rt], root_parts[rt])}
         for rt in root_parts if root_parts[rt] >= 50000),
        key=lambda d: -d["distinct_colors"],
    ),
    "E9_minifigs": {
        "unique_hp_figs": len(hp_figs),
        "figs_missing_img": sum(1 for f in hp_figs if not figs[f]["img_url"]),
        "chars_in_both_eras": len(both_era_chars),
        "harry_variants": {
            "era1": len(char_figs.get("Harry Potter", {}).get("era1", [])),
            "era2": len(char_figs.get("Harry Potter", {}).get("era2", [])),
        },
        "hermione_variants": {
            "era1": len(char_figs.get("Hermione Granger", {}).get("era1", [])),
            "era2": len(char_figs.get("Hermione Granger", {}).get("era2", [])),
        },
    },
    "E10_yellow_skin_figs": [
        {"fig": f, "name": figs[f]["name"]} for f in yellow_figs[:15]
    ],
    "hp_parts_by_year": dict(sorted(hp_year_parts.items())),
    "scope_exclusions_lookalikes": {
        "sets": len(lookalikes),
        "by_theme": {tname[t]: sum(1 for v in lookalikes.values() if v["theme_id"] == t)
                     for t in lookalike_themes},
    },
    "hp_sets_without_v1_inventory": hp_no_v1,
    "hp_top_colors_era1": [
        {"color": colors[c]["name"], "hex": "#" + colors[c]["rgb"], "qty": q}
        for c, q in sorted(era1_color_qty.items(), key=lambda kv: -kv[1])[:12]
    ],
    "hp_top_colors_era2": [
        {"color": colors[c]["name"], "hex": "#" + colors[c]["rgb"], "qty": q}
        for c, q in sorted(era2_color_qty.items(), key=lambda kv: -kv[1])[:12]
    ],
    "quiz_pool_candidates": quiz_pool,
    "both_era_characters": both_era_chars,
}

with open(OUT, "w", encoding="utf-8") as fh:
    json.dump(manifest, fh, indent=2, ensure_ascii=False)

print(f"written: {OUT}")
for k in ("E1_era1", "E2_era2", "E3_hiatus_sets_by_year", "E4_parts_2018",
          "E4_parts_2001_2004", "E5_palette", "E8_hp_lifetime_colors"):
    print(k, "=", json.dumps(manifest[k], ensure_ascii=False))
print("E6 top3:", json.dumps(manifest["E6_most_colorful_sets"][:3], ensure_ascii=False))
print("E7 top3:", json.dumps(manifest["E7_grayest_big_sets"][:3], ensure_ascii=False))
print("E8 top5:", json.dumps(manifest["E8_gray_by_major_root_theme"][:5], ensure_ascii=False))
print("E9:", json.dumps(manifest["E9_minifigs"], ensure_ascii=False))
print("exclusions:", json.dumps(manifest["scope_exclusions_lookalikes"], ensure_ascii=False))
print("hp sets without v1:", len(hp_no_v1))
