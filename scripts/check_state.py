"""Validate the project state machine (project/project-state/status.yaml).

Usage:
    python scripts/check_state.py [--root PATH] [--hook] [--self-test]

Modes:
    default      Validate and print a summary. Exit 1 on any problem.
    --hook       SessionStart-friendly: print a one-line status when healthy,
                 warnings when not; always exit 0.
    --self-test  Run built-in schema tests (valid doc passes, broken docs
                 fail). Used before tagging a template release.

Checks implement lifecycle/status.schema.yaml: required fields, stage keys,
status enums, evidence-file existence for passed/waived gates, waiver notes,
and stage/current_stage consistency. Also cross-checks project.yaml (name
match, enabled modules exist on disk).
"""

import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import miniyaml

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
STATUSES = {"pending", "in_progress", "passed", "waived"}
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def validate_status(doc, project_dir=None):
    """Return a list of problem strings for a parsed status.yaml document."""
    problems = []

    for field in ("project", "template_version", "current_stage", "updated", "stages"):
        if field not in doc:
            problems.append(f"missing required field: {field}")
    if problems:
        return problems

    if not isinstance(doc["project"], str) or not doc["project"]:
        problems.append("project must be a non-empty string")
    if not isinstance(doc["current_stage"], int) or not 0 <= doc["current_stage"] <= 7:
        problems.append("current_stage must be an integer 0..7")
    if not DATE_RE.match(str(doc["updated"])):
        problems.append("updated must be an ISO date (YYYY-MM-DD)")

    stages = doc["stages"]
    if not isinstance(stages, dict):
        return problems + ["stages must be a mapping"]
    if list(stages.keys()) != STAGE_KEYS:
        problems.append(
            f"stages must contain exactly {STAGE_KEYS} in order, got {list(stages.keys())}"
        )
        return problems

    current = doc.get("current_stage")
    for index, key in enumerate(STAGE_KEYS):
        entry = stages[key]
        if not isinstance(entry, dict):
            problems.append(f"{key}: must be a mapping")
            continue
        status = entry.get("status")
        if status not in STATUSES:
            problems.append(f"{key}: status must be one of {sorted(STATUSES)}")
            continue
        evidence = entry.get("evidence", "")
        if status in ("passed", "waived"):
            if not evidence:
                problems.append(f"{key}: {status} requires an evidence path")
            elif project_dir is not None:
                if not os.path.isfile(os.path.join(project_dir, evidence)):
                    problems.append(f"{key}: evidence file not found: {evidence}")
        if status == "waived" and not entry.get("gate_note"):
            problems.append(f"{key}: waived requires gate_note with the user's reason")
        if isinstance(current, int):
            if index < current and status not in ("passed", "waived"):
                problems.append(
                    f"{key}: stage before current_stage={current} must be passed/waived"
                )
            if index == current and status in ("passed", "waived"):
                problems.append(
                    f"{key}: stage AT current_stage should be in_progress/pending "
                    "(advance current_stage after passing the gate)"
                )
            if index > current and status != "pending":
                problems.append(f"{key}: stage after current_stage must be pending")
    return problems


def cross_check_project(root, status_doc):
    problems = []
    project_yaml = os.path.join(root, "project", "project.yaml")
    try:
        project = miniyaml.load(project_yaml)
    except (OSError, miniyaml.MiniYamlError) as exc:
        return [f"project.yaml unreadable: {exc}"]
    if project.get("name") != status_doc.get("project"):
        problems.append(
            f"project.yaml name ({project.get('name')!r}) does not match "
            f"status.yaml project ({status_doc.get('project')!r})"
        )
    for module in project.get("modules", []) or []:
        manifest = os.path.join(root, "modules", str(module), "module.yaml")
        if not os.path.isfile(manifest):
            problems.append(f"enabled module has no manifest: modules/{module}/module.yaml")
    return problems


def run_check(root, hook_mode):
    project_yaml = os.path.join(root, "project", "project.yaml")
    status_yaml = os.path.join(root, "project", "project-state", "status.yaml")

    if not os.path.isfile(project_yaml):
        if not hook_mode:
            print("check_state: template mode (no project/project.yaml) - nothing to check")
        return 0

    if not os.path.isfile(status_yaml):
        print(
            "pbi-atelier WARNING: project/project.yaml exists but "
            "project-state/status.yaml is missing. Run /project-init to repair "
            "the state before doing any work."
        )
        return 0 if hook_mode else 1

    try:
        doc = miniyaml.load(status_yaml)
    except miniyaml.MiniYamlError as exc:
        print(f"pbi-atelier WARNING: status.yaml does not parse: {exc}")
        return 0 if hook_mode else 1

    problems = validate_status(doc, project_dir=os.path.join(root, "project"))
    problems += cross_check_project(root, doc)

    if problems:
        print("pbi-atelier WARNING: project state is inconsistent:")
        for problem in problems:
            print(f"  - {problem}")
        print("Reconcile status.yaml with reality before advancing any stage.")
        return 0 if hook_mode else 1

    stage = doc["current_stage"]
    stage_key = STAGE_KEYS[stage]
    print(
        f"pbi-atelier state OK: project {doc['project']!r} at stage {stage} "
        f"({stage_key}, {doc['stages'][stage_key]['status']}), updated {doc['updated']}."
    )
    return 0


def self_test():
    valid = """
project: demo
template_version: 0.1.0
current_stage: 1
updated: 2026-01-01
stages:
  s0_intake:
    status: passed
    evidence: project-state/active/00-intake.md
    gate_note: ""
  s1_requirements:
    status: in_progress
    evidence: ""
    gate_note: ""
  s2_metrics:
    status: pending
    evidence: ""
    gate_note: ""
  s3_model_design:
    status: pending
    evidence: ""
    gate_note: ""
  s4_model_build:
    status: pending
    evidence: ""
    gate_note: ""
  s5_design:
    status: pending
    evidence: ""
    gate_note: ""
  s6_report_build:
    status: pending
    evidence: ""
    gate_note: ""
  s7_delivery:
    status: pending
    evidence: ""
    gate_note: ""
"""
    cases = [
        ("valid document", valid, 0),
        ("bad status enum", valid.replace("status: in_progress", "status: doing"), 1),
        ("stage skipped ahead", valid.replace("current_stage: 1", "current_stage: 3"), 1),
        ("missing field", valid.replace("updated: 2026-01-01\n", ""), 1),
        ("waived without note", valid.replace("status: passed", "status: waived"), 1),
    ]
    failures = 0
    for name, text, expect_problems in cases:
        doc = miniyaml.parse(text)
        problems = validate_status(doc, project_dir=None)
        got = 1 if problems else 0
        verdict = "PASS" if got == expect_problems else "FAIL"
        if verdict == "FAIL":
            failures += 1
        print(f"{verdict}: {name} (problems: {problems if problems else 'none'})")
    print(f"check_state self-test: {len(cases)} cases, {failures} failure(s)")
    return 1 if failures else 0


def main(argv):
    if "--self-test" in argv:
        return self_test()
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if "--root" in argv:
        root = os.path.abspath(argv[argv.index("--root") + 1])
    return run_check(root, hook_mode="--hook" in argv)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
