---
name: dn-deneb
description: Author bespoke Deneb/Vega-Lite visuals (deneb-studio module) - justification gate, brand-token spec authoring, dataset mapping, validation, and the Desktop handoff. Use when a contracted analytical intent cannot be served by native visuals plus theming and polish.
---

# dn-deneb

**Module gate:** requires `deneb-studio` in `project/project.yaml` →
`modules`. If disabled, say so and stop. Also confirm the user has (or will
install) the Deneb visual — a free, certified AppSource visual; its license
terms are the user's to check at adoption.

## Procedure

1. **Justification gate first.** Name the contracted analytical intent
   (page-purpose contract) and why native visuals + theming + the
   dataviz-polish moves cannot serve it. No justification → recommend the
   native alternative and stop. If even Vega-Lite can't express the need
   (heavy custom interactivity, external APIs), escalate to
   custom-visual-studio instead.
2. **Research the schema.** Verify which Vega-Lite version the installed
   Deneb bundles and consult its docs for the encodings you plan to use —
   never author against remembered syntax.
3. **Author the spec** per `modules/deneb-studio/deneb-guide.md`:
   - file at `project/deliverables/deneb-specs/<visual-id>.json`;
   - all colors/fonts/radii from brand-kit/design-brief tokens in `config`;
   - dataset fields listed in `description`, matching model display names
     exactly; aggregation stays in DAX;
   - container sizing unless the form demands fixed dimensions;
   - cross-filter/tooltip participation decided and recorded.
4. **Validate:** `python scripts/validate_json.py <spec file>`; desk-check
   every encoding channel against the listed fields; check text contrast
   against the brief.
5. **Hand off:** BUILD_LOG entry per spec — paste into Deneb editor, bind
   the listed fields in order, expected render, verify-by. The spec file
   remains the source of truth; edits go file-first, then re-paste.
6. In the design handoff, the visual appears like any other: id, intent,
   grid slot (with minimum size if fixed), spec file reference.

## Done when

The spec file validates, traces every color to a token and every field to
the model, the justification is on record, and the BUILD_LOG tells the user
exactly how to wire and verify it in Desktop.
