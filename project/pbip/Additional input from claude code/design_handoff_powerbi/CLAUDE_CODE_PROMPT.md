# Prompt for Claude Code — paste as your message (or save as the task brief)

You are rebuilding a Power BI report from scratch to pixel-perfect fidelity. A previous attempt exists in this repo — treat it as untrusted. Do not patch it.

## Task
Recreate the "Two Marriages" LEGO Harry Potter retrospective dashboard as a Power BI Project (PBIP + PBIR enhanced format), exactly matching the HTML design prototypes in `design_handoff_powerbi/`.

## Ground rules
1. Read `design_handoff_powerbi/.claude/skills/powerbi-pixel-perfect/SKILL.md` first and follow it exactly. Copy it into `.claude/skills/` if not already there.
2. **Start clean.** Create a NEW project folder `two-marriages-v2.pbip` (+ `two-marriages-v2.Report/`, `two-marriages-v2.SemanticModel/`). Do not reuse, copy, or reference any pages, visuals, or theme from the previous attempt. You MAY reuse its data source connection strings and any verified DAX measures — but only after checking each against `data_model.md`.
3. The HTML prototype is the single source of truth. Never eyeball a position: run `tools/extract_layout.mjs` and use the measured rects verbatim in every `visual.json`. Run `tools/capture_references.mjs` once and diff every built page against its reference PNG.
4. Work one page at a time, in this order: S1 → S2 → S3 → S4a → S4b → T1 → S5 (the quiz custom visual last). Do not start a page until the previous one passes its Definition of Done checklist in the skill.
5. Brick charts, palette strips, and composition bars are Deneb (Vega-Lite) visuals — never native column charts. Start from `deneb_specs/hero_brick_chart.md`.
6. Import `theme.json` before creating any page. All colors verbatim from README.md — no approximations.
7. Copy text exactly, including `·` and `—` characters.
8. Where data is marked [TK], bind the real measure anyway and leave it blank; log every [TK] you hit in a `TK_GAPS.md` at the repo root.
9. If Crimson Pro is not installed, stop and tell me — do not silently substitute.

## Definition of done (overall)
- All 7 pages built, each within ±2px of its reference screenshot
- Nav buttons on S1 navigate to their chapter pages; S4a ↔ S4b bookmarks work
- T1 configured as tooltip page and bound to minifig/set data points
- Sorting Quiz custom visual built per `custom_visual_quiz.md`, imported, and interactive
- `TK_GAPS.md` lists every outstanding data gap
- A final side-by-side diff report (reference vs rendered, per page) for my review

Work autonomously through the page order; only stop for the font issue (#9) or if a PBIR schema blocker makes a spec impossible — in that case document the deviation and the closest achievable alternative before continuing.
