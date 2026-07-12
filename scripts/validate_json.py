"""Validate JSON files: parseable, and flag byte-order marks.

Usage:
    python scripts/validate_json.py [FILE ...]

Without arguments, walks the repository for *.json (skipping .git,
node_modules, .venv). Exit code 1 when any file fails to parse; BOMs are
reported as warnings (Desktop writes them sometimes; hand-written PBIR
should be UTF-8 without BOM).
"""

import json
import os
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SKIP_DIRS = {".git", "node_modules", ".venv", "__pycache__", "dist"}


def find_json_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if name.lower().endswith(".json"):
                yield os.path.join(dirpath, name)


def validate(path):
    """Return (errors, warnings) for one file."""
    errors, warnings = [], []
    try:
        with open(path, "rb") as handle:
            raw = handle.read()
    except OSError as exc:
        return [f"unreadable: {exc}"], []
    if raw.startswith(b"\xef\xbb\xbf"):
        warnings.append("UTF-8 BOM present (write hand-authored files without BOM)")
        raw = raw[3:]
    try:
        json.loads(raw.decode("utf-8"))
    except UnicodeDecodeError as exc:
        errors.append(f"not valid UTF-8: {exc}")
    except json.JSONDecodeError as exc:
        errors.append(f"invalid JSON: {exc}")
    return errors, warnings


def main(argv):
    targets = [p for p in argv if not p.startswith("-")]
    if not targets:
        repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        targets = list(find_json_files(repo_root))
    failed = 0
    for path in targets:
        errors, warnings = validate(path)
        for message in errors:
            print(f"ERROR {path}: {message}")
        for message in warnings:
            print(f"WARN  {path}: {message}")
        failed += bool(errors)
    print(f"validate_json: {len(targets)} file(s) checked, {failed} with errors")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
