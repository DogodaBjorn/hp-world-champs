---
name: ca-canvas
description: Wireframe pages and generate designed background SVGs (canvas-studio module) - slot maps on the 8px grid, furniture-only background images in brand tokens, registration handoff. Use for page layout, backgrounds, or making a report look designed.
---

# ca-canvas

**Module gate:** requires `canvas-studio` in `project/project.yaml` →
`modules`. If disabled, say so and stop.

## Procedure

1. **Wireframe first** (stage 5): for each page, draw the slot map on the
   8px grid per `modules/canvas-studio/canvas-guide.md` §1 — margins and
   gutters from the design brief, every slot named with its visual id,
   chrome zones included. Put it in the design handoff; it is part of gate
   G5. No slot, no visual.
2. **Generate the background SVG** per guide §2 into
   `project/deliverables/canvas/<page-id>.svg`: exact canvas viewBox,
   furniture only (canvas wash, card-slot rects with surface/radius/
   hairline tokens, chrome washes, dividers), grouped with ids matching
   slot names, tokens baked from the active brand kit or neutral defaults.
   **Never**: text, data marks, logos, decoration inside data areas.
3. **Validate:** XML-parse each SVG; desk-check slot coordinates against
   the wireframe; confirm token hexes match the design brief/theme.
4. **Hand over** per guide §3: BUILD_LOG entries per page — set page
   background image, fit = Fit, transparency 0% (typically Desktop-manual);
   visuals at slot coordinates; **transparent visual backgrounds on card
   slots** recorded as the explicit-property decision; z-order background <
   data < chrome.
5. **Change discipline:** rebrand → regenerate SVGs from tokens; layout
   change → wireframe first, then SVG, then visuals. Hand-tweaked images
   are drift — flag them.
6. If the user works with a design tool (Figma etc.), follow guide §5: the
   wireframe remains the contract; exported background lands in the same
   folder; tool files stay out of the repo.

## Done when

Every page has a wireframe in the handoff and a matching furniture-only
background SVG in brand tokens, registration steps are logged with
verify-by notes, and visuals-on-slots are specced transparent.
