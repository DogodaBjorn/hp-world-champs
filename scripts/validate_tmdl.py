"""Lint TMDL files against the tmdl-style rule.

Usage:
    python scripts/validate_tmdl.py [--strict] [FILE ...]

Without file arguments, walks project/pbip/ for *.tmdl.

Errors (always fail, exit 1):
  - file not decodable as UTF-8
  - space-indented lines (TMDL is tab-indented; leading spaces corrupt parsing)
  - machine-specific absolute paths (C:\\..., D:/...) — sources must be
    parameterized

Warnings (fail only with --strict, as used at stage gates):
  - measure without a /// docstring on the preceding line
  - measure without displayFolder
  - measure without formatString
"""

import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ABS_PATH_RE = re.compile(r"\b[A-Za-z]:[\\/](?![\\/])")
MEASURE_RE = re.compile(r"^\tmeasure\s+(?P<name>'[^']+'|\S+)")
CHILD_PROP_RE = re.compile(r"^\t\t(?P<prop>displayFolder|formatString)\s*[:=]")


def find_tmdl_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in {".git", ".pbi"}]
        for name in filenames:
            if name.lower().endswith(".tmdl"):
                yield os.path.join(dirpath, name)


def lint(path):
    """Return (errors, warnings) lists of 'line N: message' strings."""
    errors, warnings = [], []
    try:
        with open(path, "rb") as handle:
            raw = handle.read()
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError as exc:
        return [f"not valid UTF-8: {exc}"], []
    except OSError as exc:
        return [f"unreadable: {exc}"], []

    lines = text.splitlines()
    for lineno, line in enumerate(lines, start=1):
        if line.startswith(" ") and line.strip():
            errors.append(f"line {lineno}: space indentation (TMDL requires tabs)")
        if ABS_PATH_RE.search(line):
            errors.append(
                f"line {lineno}: machine-specific absolute path — parameterize the source"
            )

    for index, line in enumerate(lines):
        match = MEASURE_RE.match(line)
        if not match:
            continue
        name = match.group("name")
        prev = ""
        for back in range(index - 1, -1, -1):
            if lines[back].strip():
                prev = lines[back].lstrip("\t")
                break
        if not prev.startswith("///"):
            warnings.append(f"line {index + 1}: measure {name} has no /// docstring")
        props = set()
        for probe in range(index + 1, len(lines)):
            candidate = lines[probe]
            if candidate.strip() and not candidate.startswith("\t\t"):
                break
            child = CHILD_PROP_RE.match(candidate)
            if child:
                props.add(child.group("prop"))
        for required in ("displayFolder", "formatString"):
            if required not in props:
                warnings.append(f"line {index + 1}: measure {name} has no {required}")
    return errors, warnings


def main(argv):
    strict = "--strict" in argv
    targets = [p for p in argv if not p.startswith("-")]
    if not targets:
        repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        targets = list(find_tmdl_files(os.path.join(repo_root, "project", "pbip")))
    if not targets:
        print("validate_tmdl: no TMDL files found")
        return 0
    error_count = warning_count = 0
    for path in targets:
        errors, warnings = lint(path)
        for message in errors:
            print(f"ERROR {path}: {message}")
        for message in warnings:
            print(f"WARN  {path}: {message}")
        error_count += len(errors)
        warning_count += len(warnings)
    print(
        f"validate_tmdl: {len(targets)} file(s), {error_count} error(s), "
        f"{warning_count} warning(s){' [strict]' if strict else ''}"
    )
    if error_count or (strict and warning_count):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
