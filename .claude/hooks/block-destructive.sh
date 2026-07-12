#!/usr/bin/env bash
# PreToolUse(Bash) hook: deny destructive and publish commands.
# Receives the tool-call payload as JSON on stdin; emits a permission
# decision as JSON on stdout. Fails open (exit 0, no output) when Python
# is unavailable — the settings.json deny list remains the backstop.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON="$(command -v python || command -v python3 || command -v py)" || exit 0
exec "$PYTHON" "$DIR/block_destructive.py"
