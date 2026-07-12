"""Deterministic part of project instantiation (driven by the /project-init skill).

Usage:
    python scripts/init_project.py --name NAME [--client-alias ALIAS]
        [--language en|nl] [--modules a,b] [--brand-kit NAME] [--force]
    python scripts/init_project.py --list-modules
    python scripts/init_project.py --list-brand-kits

Writes project/project.yaml and project/project-state/status.yaml (stage 0),
creating project-state/active/ if needed. Refuses to overwrite an existing
project.yaml without --force.
"""

import datetime
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import miniyaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGE_KEYS = [
    "s0_intake",
    "s1_requirements",
    "s2_metrics",
    "s3_model_design",
    "s4_model_build",
    "s5_design",
    "s6_report_build",
    "s7_delivery",
]


def discover_modules():
    modules = {}
    modules_dir = os.path.join(ROOT, "modules")
    if not os.path.isdir(modules_dir):
        return modules
    for name in sorted(os.listdir(modules_dir)):
        manifest = os.path.join(modules_dir, name, "module.yaml")
        if os.path.isfile(manifest):
            try:
                modules[name] = miniyaml.load(manifest)
            except miniyaml.MiniYamlError as exc:
                modules[name] = {"error": str(exc)}
    return modules


def discover_brand_kits():
    kits = []
    kits_dir = os.path.join(ROOT, "design", "brand-kits")
    if not os.path.isdir(kits_dir):
        return kits
    for name in sorted(os.listdir(kits_dir)):
        if name.startswith("_"):
            continue
        if os.path.isfile(os.path.join(kits_dir, name, "brand.yaml")):
            kits.append(name)
    return kits


def template_version():
    version_file = os.path.join(ROOT, "VERSION")
    try:
        with open(version_file, encoding="utf-8") as handle:
            return handle.read().strip()
    except OSError:
        return "unknown"


def arg_value(argv, flag, default=None):
    if flag in argv:
        index = argv.index(flag)
        if index + 1 < len(argv):
            return argv[index + 1]
    return default


def write_project_yaml(path, name, client_alias, language, modules, brand_kit, version):
    today = datetime.date.today().isoformat()
    lines = [
        "# pbi-atelier project configuration (see GETTING-STARTED.md)",
        f"name: {name}",
        f"client_alias: {client_alias}",
        f"language: {language}",
        f"template_version: {version}",
        f"created: {today}",
        f"brand_kit: {brand_kit}",
    ]
    if modules:
        lines.append("modules:")
        lines += [f"  - {module}" for module in modules]
    else:
        lines.append("modules: []")
    with open(path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write("\n".join(lines) + "\n")


def write_status_yaml(path, name, version):
    today = datetime.date.today().isoformat()
    lines = [
        "# pbi-atelier project state — schema: lifecycle/status.schema.yaml",
        f"project: {name}",
        f"template_version: {version}",
        "current_stage: 0",
        f"updated: {today}",
        "stages:",
    ]
    for index, key in enumerate(STAGE_KEYS):
        lines += [
            f"  {key}:",
            f"    status: {'in_progress' if index == 0 else 'pending'}",
            '    evidence: ""',
            '    gate_note: ""',
        ]
    with open(path, "w", encoding="utf-8", newline="\n") as handle:
        handle.write("\n".join(lines) + "\n")


def main(argv):
    if "--list-modules" in argv:
        modules = discover_modules()
        if not modules:
            print("No modules found under modules/.")
        for name, manifest in modules.items():
            summary = manifest.get("description", manifest.get("error", ""))
            print(f"{name}: {summary}")
        return 0
    if "--list-brand-kits" in argv:
        kits = discover_brand_kits()
        print("\n".join(kits) if kits else "No brand kits found under design/brand-kits/.")
        return 0

    name = arg_value(argv, "--name")
    if not name:
        print("ERROR: --name is required (or use --list-modules / --list-brand-kits)")
        return 1

    client_alias = arg_value(argv, "--client-alias", "none")
    language = arg_value(argv, "--language", "en")
    if language not in ("en", "nl"):
        print("ERROR: --language must be en or nl")
        return 1

    modules_arg = arg_value(argv, "--modules", "")
    modules = [m.strip() for m in modules_arg.split(",") if m.strip()]
    known = discover_modules()
    unknown = [m for m in modules if m not in known]
    if unknown:
        print(f"ERROR: unknown module(s): {', '.join(unknown)}. Known: {', '.join(known) or 'none'}")
        return 1

    brand_kit = arg_value(argv, "--brand-kit", "none")
    if brand_kit != "none" and brand_kit not in discover_brand_kits():
        print(f"ERROR: brand kit not found: design/brand-kits/{brand_kit}/brand.yaml")
        return 1

    project_yaml = os.path.join(ROOT, "project", "project.yaml")
    if os.path.isfile(project_yaml) and "--force" not in argv:
        print("ERROR: project/project.yaml already exists. Use --force to overwrite.")
        return 1

    state_dir = os.path.join(ROOT, "project", "project-state")
    os.makedirs(os.path.join(state_dir, "active"), exist_ok=True)
    version = template_version()
    write_project_yaml(project_yaml, name, client_alias, language, modules, brand_kit, version)
    write_status_yaml(os.path.join(state_dir, "status.yaml"), name, version)

    print(f"Initialized project {name!r} (template {version}, language {language}).")
    print(f"  brand kit: {brand_kit} | modules: {', '.join(modules) or 'none'}")
    print("  state: project/project-state/status.yaml at stage 0 (intake).")
    print("Next: run /next to start stage 0.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
