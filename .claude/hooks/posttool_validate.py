"""PostToolUse(Edit|Write) helper: validate a just-written PBIP file.

Usage: posttool_validate.py {json|tmdl}

Reads the hook payload from stdin, extracts the edited file path, and runs
the matching validator from scripts/. Files outside project/pbip/ (for json
mode) or without the target extension are ignored. On validation failure the
errors go to stderr and the exit code is 2, which surfaces them to the agent.
"""

import json
import os
import subprocess
import sys

HOOK_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.environ.get(
    "CLAUDE_PROJECT_DIR", os.path.dirname(os.path.dirname(HOOK_DIR))
)


def target_file(payload: dict) -> str:
    tool_input = payload.get("tool_input") or {}
    return tool_input.get("file_path") or tool_input.get("notebook_path") or ""


def main() -> int:
    if len(sys.argv) < 2 or sys.argv[1] not in ("json", "tmdl"):
        return 0
    mode = sys.argv[1]

    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return 0

    path = target_file(payload)
    if not path or not os.path.isfile(path):
        return 0

    normalized = os.path.abspath(path).replace("\\", "/").lower()

    if mode == "json":
        if not normalized.endswith(".json") or "/project/pbip/" not in normalized:
            return 0
        validator = os.path.join(REPO_ROOT, "scripts", "validate_json.py")
    else:
        if not normalized.endswith(".tmdl"):
            return 0
        validator = os.path.join(REPO_ROOT, "scripts", "validate_tmdl.py")

    if not os.path.isfile(validator):
        return 0  # scripts not present (partial checkout) — do not block

    result = subprocess.run(
        [sys.executable, validator, path], capture_output=True, text=True
    )
    if result.returncode != 0:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        sys.stderr.write(
            f"\npbi-atelier hook: {os.path.basename(validator)} failed for {path}. "
            "Fix the file before continuing; do not work around the validator.\n"
        )
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
