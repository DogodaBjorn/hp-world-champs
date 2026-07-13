# hpSortingQuiz — "The Sorting Quiz"

Matching game custom visual for page V of the hp-world-champs contest entry.
Justification, interaction model, and accessibility contract: see
`project/deliverables/design-handoff.md` (page V) and mission §6.

## Versions (recorded at scaffold time, 2026-07-13)

| Thing | Version |
|---|---|
| powerbi-visuals-tools (pbiviz) | **7.1.1** (via npx — no global install) |
| powerbi-visuals-api | **5.11.0** (npm dependency); `pbiviz.json` apiVersion 5.3.0 (tools 7.1.1 scaffold default) |
| Node | v24.16.0 |
| Visual GUID | `hpSortingQuizC5E71AA64D2B441BB9BD1B65FFFA17A6` |

## Build & package

```bash
cd project/custom-visuals/hp-sorting-quiz
npm install                                   # local only; node_modules gitignored
npx --yes powerbi-visuals-tools@7.1.1 package # -> dist/hpSortingQuiz.pbiviz
```

## Import into the report (Desktop, manual — BUILD_LOG D9)

1. Power BI Desktop → Visualizations pane → ⋯ → *Import a visual from a file*
   → `dist/hpSortingQuiz.pbiviz`.
2. On page V, replace the `hero_quiz` placeholder textbox with the visual in
   the same 792×560 slot at (24, 96).
3. Bind ALL data roles from the disconnected `QuizQuestions` table:
   questionNo ← question_no · figureId ← fig_num · figureImage ← fig_img_url ·
   character ← character · era ← era · setName ← set_name · setImage ← set_img_url.
4. Verify the WebAccess privilege prompt (cdn.rebrickable.com) is accepted so
   figure images render.
5. Set visual title off (the game carries its own header); alt text per the
   handoff row.

## Game rules implemented

Click (or Tab+Enter) a minifigure, then a character. Match is **by value** —
the two Harry Potter figures both accept the one Harry Potter card. Correct:
gold locked line + era chip and set name reveal in column three + score.
Wrong: red dashed line fades, cards shake, screen reader hears "Not X. Try
again." Reveal/Reset in the header. All state internal; nothing filters the
report (QuizQuestions is deliberately disconnected).

## Accessibility

Keyboard: Tab to any card, Arrow Up/Down within a column, Enter/Space to act.
3px focus ring in the correct-match color. `aria-live` region announces every
selection, match, miss, and the final score. High-contrast: `forced-colors`
media query maps cards/lines to system colors. Text fallback: every reveal
card carries a full text `aria-label` ("Minifigure 3: Hermione Granger,
First marriage (2001–2011), from set Diagon Alley Shops").

## Formatting pane

All colors surface under **Game colors**, defaulted to hp-bricks theme slots
(gold `#AA7F2E`, dark red `#720E0F`, ink `#05131D`, surface `#FFFFFF`, bad
`#A95500`) — set them to the dark-state tokens if the visual is ever placed
on a dark page. No hex is hardcoded in the render path (CSS variables only).

## Known limitations

- Images require connectivity to cdn.rebrickable.com (contest dataset CDN).
- The score is game state, not LEGO data — the page labels it scenario logic.
- Era chip labels are shortened ("2001–2011" / "2018–now") for card width.
- Maintenance owner: the entrant. Lifetime: contest entry (one-shot).
