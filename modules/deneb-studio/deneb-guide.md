# Deneb / Vega-Lite spec conventions

How specs are authored, tokened, stored, and handed over in this repo.
Research-first: check which **Vega-Lite schema version the installed Deneb
build bundles** (Deneb's own docs/changelog) before authoring — encoding
options differ across versions, and a spec written for the wrong `$schema`
fails quietly or noisily.

## Spec storage & naming

- One spec per visual: `project/deliverables/deneb-specs/<visual-id>.json`
  where `<visual-id>` follows `design/naming-conventions.md`
  (e.g. `hero_flow.json`).
- The spec file is the source of truth and is versioned; what lives inside
  the report is a paste of it. Any edit happens in the file first, then is
  re-pasted (BUILD_LOG tracks the sync).
- Keep Deneb's config (spec + config split) inside the single file where
  practical, so one file fully describes the visual.

## Brand-token injection (mandatory)

Specs never hardcode arbitrary colors. All colors, fonts, and radii come
from the active brand kit / design brief tokens, placed in the spec's
`config` block (mark defaults, axis/legend/label styling, `range.category`
from the categorical ramp, good/bad pair for semantic encodings). When the
kit changes, regenerating the config block re-brands every spec — record
which tokens each spec consumes in a comment-style `"description"` field
(Vega-Lite has no comments; `description` is the sanctioned annotation).

Fonts: use the kit's **fallback-safe families** — Deneb renders with the
fonts available on the reader's machine, same as the rest of the report.

## Dataset mapping

- Deneb receives the fields added to its data roles as a flat `dataset`.
  Keep the contract explicit: list, at the top of the spec's `description`,
  the exact measures/columns (by model name) the spec expects, in order.
- Field names in `encoding` must match the model's display names exactly —
  a renamed measure silently breaks the spec; the stage-4 rule "never rename
  on edit" protects this, and any deliberate rename must grep the spec files.
- Pre-aggregate in DAX, not in the spec: Vega-Lite transforms on large
  datasets cost render time and hide logic from the definition catalog. The
  spec receives the numbers it draws — calculation stays in the model.

## Sizing & layout

- Design specs responsive: `"width": "container", "height": "container"`
  where the chart form allows, so the visual honors the grid slot the design
  handoff gives it. Fixed-size internals (e.g. dense small multiples) note
  their minimum slot size in the handoff.
- Respect the page grid: paddings inside the spec should not fight the
  card padding the theme applies to the visual container.

## Interactivity

- Native Power BI cross-filtering and tooltips require the spec to opt in
  (selection/tooltip signals per Deneb's docs — verify the current
  mechanism). Decide per visual in the design handoff whether the Deneb
  visual participates in cross-filtering or is display-only, and record it.
- Keep interaction inside the spec minimal — page-level interaction design
  belongs to nav-studio patterns, not to a chart's internal state.

## Quality bar

- Spec passes JSON validation (`python scripts/validate_json.py <file>`).
- Every encoding channel maps to a listed dataset field; no orphan fields.
- Colors trace to tokens; text meets the contrast the design brief demands.
- The chart form serves a contracted intent (`design/visual-selection.md`) —
  a Deneb spec is never the place to smuggle in a chart the critique
  rejected.

## Handoff

Pasting the spec into the Deneb editor, adding the visual's data roles, and
verifying render are **Desktop-manual steps** — each spec gets a BUILD_LOG
entry: file, visual id, fields to bind, expected render, verify-by note.
