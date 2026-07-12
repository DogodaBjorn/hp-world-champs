#!/usr/bin/env bash
# PostToolUse(Edit|Write) hook: JSON well-formedness check for files written
# under project/pbip/. Delegates to posttool_validate.py; exit 2 on failure
# surfaces the validator output to the agent.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON="$(command -v python || command -v python3 || command -v py)" || exit 0
exec "$PYTHON" "$DIR/posttool_validate.py" json
