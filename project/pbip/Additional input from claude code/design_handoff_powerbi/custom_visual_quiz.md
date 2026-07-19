# Custom visual: Sorting Quiz (powerbi-visuals-tools, TypeScript)

Three-column matching game inside one visual viewport (~920×566):
- Col 1 (w130): 5 minifig photo tiles 76×80, border idle 1px #D8CFBC / selected 2px #C9A227; keyboard-focusable with 2px #C9A227 focus ring offset 2px.
- Col 2 (flex): 5 character names, Crimson Pro 23px; idle 400 #211B14, matched 600 #8A6A21 with " ✓" appended.
- Col 3 (flex): 5 era·set labels 14.5px, same state styling.
- Connector lines live in a fixed 38px gutter between col 1 and col 2 (SVG overlay at x≈124 from panel left, full height) — lines must NOT cross into columns.

Line states:
- idle guide: 1.5px dashed #B5AB95 (dash 3 5)
- locked (correct): 3px solid #C9A227
- wrong: 3px dashed #B33A2B (dash 7 6), 400ms flash then revert
- Interaction: click fig → click name → click era; correct locks the chain, wrong flashes.

Data roles: fig image URL, character_name, era label, correct-match key (fig_num). 10 rounds total ("match all ten"), 5 shown at a time.
Score: matched count / 10; expose via visual or keep the score card static for v1.
Sample state in the prototype shows rows 2 & 4 matched, one wrong flash between rows 2–3.
