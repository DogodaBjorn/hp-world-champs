"""Inventory a TMDL semantic model: tables, columns, measures, relationships.

Usage:
    python scripts/tmdl_inventory.py [PATH] [--json FILE] [--md FILE]

PATH defaults to project/pbip. Prints a markdown summary to stdout; --json
and --md write machine/human inventories for blueprint diffing (stage 4 gate).
Dependency-free line parser: good enough for structural diffs, not a TMDL
compiler — names, counts, folders, and relationship endpoints.
"""

import json
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

TABLE_RE = re.compile(r"^table\s+(?P<name>'[^']+'|\S+)")
CHILD_RE = re.compile(
    r"^\t(?P<kind>measure|column|calculatedColumn|hierarchy|partition|calculationGroup)"
    r"\s+(?P<name>'[^']+'|[^=\s]+)"
)
PROP_RE = re.compile(r"^\t\t(?P<key>displayFolder|formatString|dataType|isHidden)\s*[:=]\s*(?P<value>.+)$")
REL_FROM_RE = re.compile(r"^\tfromColumn:\s*(?P<value>.+)$")
REL_TO_RE = re.compile(r"^\ttoColumn:\s*(?P<value>.+)$")
EXPR_RE = re.compile(r"^expression\s+(?P<name>'[^']+'|\S+)")


def unquote(name):
    return name[1:-1] if name.startswith("'") and name.endswith("'") else name


def parse_table_file(path):
    with open(path, encoding="utf-8-sig") as handle:
        lines = handle.read().splitlines()
    table = None
    current_child = None
    for line in lines:
        match = TABLE_RE.match(line)
        if match:
            table = {
                "name": unquote(match.group("name")),
                "file": path,
                "columns": [],
                "measures": [],
                "partitions": 0,
                "hierarchies": [],
                "is_calc_group": False,
            }
            continue
        if table is None:
            continue
        child = CHILD_RE.match(line)
        if child:
            kind, name = child.group("kind"), unquote(child.group("name"))
            current_child = None
            if kind == "measure":
                current_child = {"name": name, "displayFolder": "", "formatString": ""}
                table["measures"].append(current_child)
            elif kind in ("column", "calculatedColumn"):
                current_child = {"name": name, "dataType": "", "isHidden": False}
                table["columns"].append(current_child)
            elif kind == "partition":
                table["partitions"] += 1
            elif kind == "hierarchy":
                table["hierarchies"].append(name)
            elif kind == "calculationGroup":
                table["is_calc_group"] = True
            continue
        prop = PROP_RE.match(line)
        if prop and current_child is not None:
            key, value = prop.group("key"), prop.group("value").strip()
            if key in current_child:
                current_child[key] = value if key != "isHidden" else value.lower() == "true"
    return table


def parse_relationships(path):
    with open(path, encoding="utf-8-sig") as handle:
        lines = handle.read().splitlines()
    relationships, current = [], None
    for line in lines:
        if line.startswith("relationship "):
            current = {"from": "", "to": ""}
            relationships.append(current)
        elif current is not None:
            match = REL_FROM_RE.match(line)
            if match:
                current["from"] = match.group("value").strip()
            match = REL_TO_RE.match(line)
            if match:
                current["to"] = match.group("value").strip()
    return relationships


def build_inventory(root):
    inventory = {"root": root, "tables": [], "relationships": [], "expressions": []}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in {".git", ".pbi"}]
        for name in sorted(filenames):
            if not name.lower().endswith(".tmdl"):
                continue
            path = os.path.join(dirpath, name)
            if name.lower() == "relationships.tmdl":
                inventory["relationships"] = parse_relationships(path)
                continue
            with open(path, encoding="utf-8-sig") as handle:
                head = handle.read(4096)
            if EXPR_RE.search(head):
                inventory["expressions"] += [
                    unquote(m.group("name")) for m in EXPR_RE.finditer(head)
                ]
            table = parse_table_file(path)
            if table:
                inventory["tables"].append(table)
    return inventory


def to_markdown(inv):
    lines = [f"# TMDL inventory — `{inv['root']}`", ""]
    total_measures = sum(len(t["measures"]) for t in inv["tables"])
    lines.append(
        f"{len(inv['tables'])} table(s), {total_measures} measure(s), "
        f"{len(inv['relationships'])} relationship(s), "
        f"{len(inv['expressions'])} shared expression(s)"
    )
    lines.append("")
    lines.append("| Table | Columns | Measures | Partitions | Notes |")
    lines.append("|---|---|---|---|---|")
    for table in inv["tables"]:
        notes = "calc group" if table["is_calc_group"] else ""
        lines.append(
            f"| {table['name']} | {len(table['columns'])} | {len(table['measures'])} "
            f"| {table['partitions']} | {notes} |"
        )
    if inv["relationships"]:
        lines += ["", "## Relationships", ""]
        for rel in inv["relationships"]:
            lines.append(f"- `{rel['from']}` -> `{rel['to']}`")
    measures = [(t["name"], m) for t in inv["tables"] for m in t["measures"]]
    if measures:
        lines += ["", "## Measures", "", "| Table | Measure | Folder | Format |", "|---|---|---|---|"]
        for table_name, measure in measures:
            lines.append(
                f"| {table_name} | {measure['name']} | {measure['displayFolder']} "
                f"| {measure['formatString']} |"
            )
    return "\n".join(lines) + "\n"


def main(argv):
    positional = [a for a in argv if not a.startswith("-")]
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    root = positional[0] if positional else os.path.join(repo_root, "project", "pbip")
    if not os.path.isdir(root):
        print(f"tmdl_inventory: path not found: {root}")
        return 1
    inventory = build_inventory(root)
    markdown = to_markdown(inventory)
    if "--json" in argv:
        out = argv[argv.index("--json") + 1]
        with open(out, "w", encoding="utf-8", newline="\n") as handle:
            json.dump(inventory, handle, indent=2)
        print(f"wrote {out}")
    if "--md" in argv:
        out = argv[argv.index("--md") + 1]
        with open(out, "w", encoding="utf-8", newline="\n") as handle:
            handle.write(markdown)
        print(f"wrote {out}")
    if "--json" not in argv and "--md" not in argv:
        print(markdown)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
