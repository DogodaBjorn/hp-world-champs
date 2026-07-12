#!/usr/bin/env bash
# SessionStart hook: warn when the project state is missing or inconsistent.
# Output on stdout is added to the session context. Always exits 0 — this
# hook informs, it never blocks.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$DIR/../.." && pwd)}"
PYTHON="$(command -v python || command -v python3 || command -v py)" || exit 0

if [ -f "$ROOT/scripts/check_state.py" ]; then
  "$PYTHON" "$ROOT/scripts/check_state.py" --hook --root "$ROOT" || true
fi
exit 0
