---
name: ic-icons
description: Generate, recolor, and place custom SVG icons and visual additions (icon-studio module) - brand-colored icon sets with state variants, chrome graphics, and dynamic SVG-in-DAX measures. Use when the report needs icons, pictograms, state chips, or graphic accents.
---

# ic-icons

**Module gate:** requires `icon-studio` in `project/project.yaml` →
`modules`. If disabled, say so and stop.

## Procedure

1. **Doctrine check first** (`modules/icon-studio/README.md`): the icon must
   be functional — direction/state, category mark, affordance, or a single
   chrome mark. Decorative requests get the native alternative recommended
   (conditional formatting, labels) instead of an icon.
2. Decide file vs. measure per the guide's table
   (`modules/icon-studio/svg-icon-guide.md`): fixed marks → static SVG;
   data-driven marks → SVG-in-DAX.
3. **Static icons:** start from `modules/icon-studio/assets/starter-icons/`
   where a base shape fits; generate new ones in the same geometry system
   (24×24, stroke 2, round caps). Color from the active brand kit (or the
   neutral defaults in `.claude/rules/design-hard-rules.md`) — bake hex
   values, produce the state variants the usage needs
   (`<icon>--<state>.svg`), write to `project/deliverables/icons/`, and
   XML-validate each file.
4. **Dynamic marks:** author the measure per the guide's SVG-in-DAX rules
   (`%23` encoding, tiny geometry, theme-token hex, `03 Display` folder,
   docstring, Image URL category noted). The same value must also exist as
   plain text nearby (accessibility).
5. **Hand over usage:** state the embedding surface per icon (image visual,
   button icon, slicer state image, table Image-URL) with the guide's
   caveats; anything requiring Desktop (uploads, resource registration)
   goes on the BUILD_LOG manual-steps list.
6. At stage 5, icons appear in the design handoff by filename; at stage 6,
   pbir-operator embeds them per spec — this skill produces assets and
   instructions, it does not edit `project/pbip/` itself.

## Done when

Assets exist in `project/deliverables/icons/`, validate as XML, use kit/theme
colors, and every icon has a stated functional job plus embedding
instructions (with Desktop-manual steps logged).
