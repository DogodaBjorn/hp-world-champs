"""Minimal YAML-subset parser shared by the pbi-atelier scripts.

The repo's machine-read YAML files (status.yaml, project.yaml, module.yaml)
are written in a deliberate subset so no third-party parser is needed:

- block mappings and block lists of scalars; simple inline lists ``[a, b]``
- 2-space indentation, spaces only
- scalars: quoted or plain strings, integers, true/false
- full-line comments; trailing comments after unquoted values (`` # ...``)

Not supported (by design): anchors, multi-line scalars, lists of mappings,
inline mappings, tabs. lifecycle/status.schema.yaml documents the contract.
"""

import re

_KEY_RE = re.compile(r"^([A-Za-z0-9_.\-]+):(?:\s+(.*))?$")


class MiniYamlError(ValueError):
    """Raised when a file steps outside the supported subset."""


def parse(text):
    """Parse subset-YAML text into nested dicts/lists/scalars."""
    lines = []
    for lineno, raw in enumerate(text.splitlines(), start=1):
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip(" "))
        if "\t" in raw[: indent + 1]:
            raise MiniYamlError(f"line {lineno}: tab indentation is not supported")
        lines.append((indent, raw.strip(), lineno))
    if not lines:
        return {}
    value, next_index = _parse_block(lines, 0, lines[0][0])
    if next_index != len(lines):
        indent, _, lineno = lines[next_index]
        raise MiniYamlError(f"line {lineno}: unexpected indentation {indent}")
    return value


def load(path):
    """Parse the file at *path* (UTF-8, BOM tolerated)."""
    with open(path, encoding="utf-8-sig") as handle:
        return parse(handle.read())


def _parse_block(lines, index, indent):
    if lines[index][1].startswith("- ") or lines[index][1] == "-":
        return _parse_list(lines, index, indent)
    return _parse_mapping(lines, index, indent)


def _parse_list(lines, index, indent):
    items = []
    while index < len(lines):
        line_indent, content, lineno = lines[index]
        if line_indent < indent:
            break
        if line_indent > indent:
            raise MiniYamlError(f"line {lineno}: unexpected indent inside list")
        if not (content.startswith("- ") or content == "-"):
            break
        items.append(_scalar(content[2:].strip() if content != "-" else ""))
        index += 1
    return items, index


def _parse_mapping(lines, index, indent):
    mapping = {}
    while index < len(lines):
        line_indent, content, lineno = lines[index]
        if line_indent < indent:
            break
        if line_indent > indent:
            raise MiniYamlError(f"line {lineno}: unexpected indentation")
        match = _KEY_RE.match(content)
        if not match:
            raise MiniYamlError(f"line {lineno}: expected 'key: value', got {content!r}")
        key, value = match.group(1), match.group(2)
        index += 1
        if value is None or value == "" or value.startswith("#"):
            if index < len(lines) and lines[index][0] > indent:
                mapping[key], index = _parse_block(lines, index, lines[index][0])
            else:
                mapping[key] = ""
        else:
            mapping[key] = _scalar(value)
    return mapping, index


def _scalar(text):
    text = text.strip()
    if not text:
        return ""
    if text[0] in "\"'":
        quote = text[0]
        end = text.find(quote, 1)
        return text[1:end] if end != -1 else text[1:]
    comment = text.find(" #")
    if comment != -1:
        text = text[:comment].rstrip()
    if text.startswith("[") and text.endswith("]"):
        inner = text[1:-1].strip()
        return [_scalar(part.strip()) for part in inner.split(",")] if inner else []
    lowered = text.lower()
    if lowered == "true":
        return True
    if lowered == "false":
        return False
    try:
        return int(text)
    except ValueError:
        return text
