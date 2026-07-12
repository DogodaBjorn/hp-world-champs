# a11y-studio

Accessibility as an **auditable gate**, not a preference. The design
doctrine already demands color-never-alone and AA contrast; this module
makes those claims checkable — including a script that computes WCAG
contrast ratios instead of eyeballing them.

Grounded in WCAG 2.2 (Tier 1 in the source register) and the practitioner
work of Meagan Longoria, whose Power BI accessibility checklist defined the
field (consulted as references; the audit here is expressed in this repo's
own gate structure).

## Why this is a differentiator

Most premium-looking reports fail the first contrast measurement taken of
them. A repo that *gates* on accessibility ships reports that more people
can actually use — including the projector-in-a-meeting-room case, the
color-blind director, and the keyboard-navigating analyst. Accessibility
work is trust work; it belongs with the 3-minute-trust doctrine.

## What the module adds

- **[a11y-checklist.md](a11y-checklist.md)** — the audit, mapped to gates
  G6 (build) and G7 (delivery); failures become review-finding contracts
  like any other finding.
- **`scripts/check_contrast.py`** (core script, stdlib-only) — computes
  WCAG relative-luminance contrast ratios from the active brand kit, the
  project's `theme.json`, or any ad-hoc color pair. Runs standalone at any
  time: `python scripts/check_contrast.py` (auto-resolves what to check),
  `--pair "#1F2933" "#F5F6F8"`, `--self-test`.
- **`ax-audit` skill** — runs the script + checklist, emits findings,
  and attaches the results as gate evidence.

## Division of labor

The brand-kit interview (`bk-brand-kit`) validates contrast at *kit
creation*; this module validates the *built report* — themes drift,
visual-level overrides creep in, and a kit that passed can still be
assembled into a page that fails. Both checks exist on purpose.
