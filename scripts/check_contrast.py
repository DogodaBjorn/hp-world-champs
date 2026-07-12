"""WCAG contrast checker for pbi-atelier tokens, themes, and ad-hoc pairs.

Usage:
    python scripts/check_contrast.py                  # auto-resolve (see below)
    python scripts/check_contrast.py --kit design/brand-kits/<kit>/brand.yaml
    python scripts/check_contrast.py --theme project/deliverables/theme.json
    python scripts/check_contrast.py --pair "#1F2933" "#F5F6F8"
    python scripts/check_contrast.py --self-test

Auto-resolve order: project/deliverables/theme.json if present, else the
active brand kit from project/project.yaml, else the built-in neutral
defaults (mirror of .claude/rules/design-hard-rules.md — keep in sync).

Thresholds (WCAG 2.x): text 4.5:1, large text / non-text meaning carriers
3:1. Exit 1 when any standard pair fails its threshold.
"""

import json
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import miniyaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Mirror of the neutral defaults in .claude/rules/design-hard-rules.md.
NEUTRAL_DEFAULTS = {
    "canvas": "#F5F6F8",
    "surface": "#FFFFFF",
    "ink": "#1F2933",
    "ink_secondary": "#5B6770",
    "accent": "#2563A8",
    "good": "#1E7F4F",
    "bad": "#B3402E",
    "neutral_data": "#8A97A3",
}

# (foreground, background, threshold, note)
STANDARD_PAIRS = [
    ("ink", "canvas", 4.5, "primary text on canvas"),
    ("ink", "surface", 4.5, "primary text on cards"),
    ("ink_secondary", "surface", 4.5, "labels/captions on cards"),
    ("ink_secondary", "canvas", 4.5, "labels/captions on canvas"),
    ("accent", "canvas", 3.0, "focal accent (non-text) on canvas"),
    ("accent", "surface", 3.0, "focal accent (non-text) on cards"),
    ("good", "canvas", 3.0, "direction-good marker on canvas"),
    ("good", "surface", 3.0, "direction-good marker on cards"),
    ("bad", "canvas", 3.0, "direction-bad marker on canvas"),
    ("bad", "surface", 3.0, "direction-bad marker on cards"),
]


def parse_hex(value):
    value = str(value).strip().lstrip("#")
    if len(value) == 3:
        value = "".join(ch * 2 for ch in value)
    if len(value) != 6:
        raise ValueError(f"not a hex color: {value!r}")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def relative_luminance(rgb):
    def channel(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (channel(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(fg_hex, bg_hex):
    l1 = relative_luminance(parse_hex(fg_hex))
    l2 = relative_luminance(parse_hex(bg_hex))
    lighter, darker = max(l1, l2), min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


def tokens_from_kit(path):
    doc = miniyaml.load(path)
    color = doc.get("color") or {}
    tokens = {k: v for k, v in color.items() if isinstance(v, str) and v.strip().startswith("#")}
    return tokens, f"brand kit {path}"


def tokens_from_theme(path):
    with open(path, encoding="utf-8-sig") as handle:
        theme = json.load(handle)
    mapping = {
        "canvas": theme.get("background"),
        "surface": theme.get("background"),
        "ink": theme.get("foreground"),
        "good": theme.get("good"),
        "bad": theme.get("bad"),
        "accent": (theme.get("dataColors") or [None])[0],
    }
    tokens = {k: v for k, v in mapping.items() if isinstance(v, str) and v.startswith("#")}
    return tokens, f"theme {path} (note: theme.json carries fewer tokens than a kit)"


def check_pairs(tokens, source):
    print(f"check_contrast: {source}")
    failures = 0
    checked = 0
    for fg, bg, threshold, note in STANDARD_PAIRS:
        if fg not in tokens or bg not in tokens:
            continue
        checked += 1
        ratio = contrast_ratio(tokens[fg], tokens[bg])
        ok = ratio >= threshold
        failures += not ok
        print(
            f"  {'PASS' if ok else 'FAIL'}  {fg} on {bg}: {ratio:.2f}:1 "
            f"(needs {threshold}:1) - {note}"
        )
    if checked == 0:
        print("  no checkable token pairs found")
        return 1
    print(f"check_contrast: {checked} pair(s), {failures} failure(s)")
    return 1 if failures else 0


def self_test():
    cases = [
        ("#000000", "#FFFFFF", 21.0),
        ("#FFFFFF", "#000000", 21.0),
        ("#777777", "#FFFFFF", 4.48),
        ("#1F2933", "#1F2933", 1.0),
    ]
    failures = 0
    for fg, bg, expected in cases:
        got = contrast_ratio(fg, bg)
        ok = abs(got - expected) < 0.02
        failures += not ok
        print(f"{'PASS' if ok else 'FAIL'}: {fg}/{bg} -> {got:.2f} (expected ~{expected})")
    neutral_rc = check_pairs(NEUTRAL_DEFAULTS, "built-in neutral defaults")
    if neutral_rc != 0:
        failures += 1
        print("FAIL: neutral defaults should pass their own thresholds")
    print(f"check_contrast self-test: {failures} failure(s)")
    return 1 if failures else 0


def resolve_auto():
    theme = os.path.join(ROOT, "project", "deliverables", "theme.json")
    if os.path.isfile(theme):
        return tokens_from_theme(theme)
    project_yaml = os.path.join(ROOT, "project", "project.yaml")
    if os.path.isfile(project_yaml):
        kit = miniyaml.load(project_yaml).get("brand_kit", "none")
        kit_file = os.path.join(ROOT, "design", "brand-kits", str(kit), "brand.yaml")
        if kit != "none" and os.path.isfile(kit_file):
            return tokens_from_kit(kit_file)
    return NEUTRAL_DEFAULTS, "built-in neutral defaults"


def main(argv):
    if "--self-test" in argv:
        return self_test()
    if "--pair" in argv:
        index = argv.index("--pair")
        fg, bg = argv[index + 1], argv[index + 2]
        ratio = contrast_ratio(fg, bg)
        print(
            f"{fg} on {bg}: {ratio:.2f}:1 -> text(4.5): "
            f"{'PASS' if ratio >= 4.5 else 'FAIL'}, non-text(3.0): "
            f"{'PASS' if ratio >= 3.0 else 'FAIL'}"
        )
        return 0 if ratio >= 3.0 else 1
    if "--kit" in argv:
        tokens, source = tokens_from_kit(argv[argv.index("--kit") + 1])
    elif "--theme" in argv:
        tokens, source = tokens_from_theme(argv[argv.index("--theme") + 1])
    else:
        tokens, source = resolve_auto()
    return check_pairs(tokens, source)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
