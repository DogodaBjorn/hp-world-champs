"""PreToolUse(Bash) helper: deny destructive and publish commands.

Reads the hook payload JSON from stdin. When the proposed Bash command
matches a deny pattern, prints a PreToolUse permission decision that blocks
the call and explains why. Anything unmatched passes through silently.
"""

import json
import re
import sys

DENY = [
    (r"\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r", "recursive force delete (rm -rf)"),
    (r"\bgit\s+push\b[^&|;]*(--force\b|-f\b)", "git force push"),
    (r"\bgit\s+reset\s+--hard\b", "git reset --hard"),
    (r"\bgit\s+clean\b[^&|;]*-[a-z]*f", "git clean -f"),
    (r"\bfab\b[^&|;]*\b(deploy|publish)\b", "Fabric deploy/publish"),
    (r"\bpbir\b[^&|;]*\bpublish\b", "pbir publish"),
    (r"\bdel\s+/[sq]\b", "recursive Windows delete (del /s)"),
    (r"\bformat\s+[a-z]:", "drive format"),
    (r"\bmkfs\b", "filesystem format"),
]


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return 0

    command = (payload.get("tool_input") or {}).get("command", "")
    if not isinstance(command, str) or not command:
        return 0

    for pattern, label in DENY:
        if re.search(pattern, command, re.IGNORECASE):
            print(
                json.dumps(
                    {
                        "hookSpecificOutput": {
                            "hookEventName": "PreToolUse",
                            "permissionDecision": "deny",
                            "permissionDecisionReason": (
                                f"pbi-atelier safety hook: blocked {label}. "
                                "Destructive and publish commands are reserved for the "
                                "user to run explicitly outside the agent."
                            ),
                        }
                    }
                )
            )
            return 0
    return 0


if __name__ == "__main__":
    sys.exit(main())
