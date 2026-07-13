# 07 · Validation & delivery — hp-world-champs

**Date:** 2026-07-13 · **Deadline:** submission 2026-07-19 23:59 PT ·
content-complete target 2026-07-17 (four days of buffer remain).

## 1 · Technical sweep (final state, this environment)

| Check | Result |
|---|---|
| `validate_tmdl.py --strict` | 13 files, 0 errors, 0 warnings |
| `validate_json.py` | 106 files, 0 errors |
| `pbir validate --all` | **Valid** — 0 errors; 129 intended warnings (itemized in BUILD_LOG) |
| `check_state.py` | consistent, stage 7 |
| Encoding sweep | 0 mojibake sequences in the Report tree |
| hpSortingQuiz | packaged, eslint clean, 9.8 KB `.pbiviz` |

## 2 · ax-audit (named gate item — run on the delivered state)

- **Contrast measured, not assumed:** kit 10/10 PASS · compiled theme 8/8
  PASS · 16 ad-hoc pairs across light AND dark states PASS · 4 fresh pairs
  measured at this gate. **Two findings found and fixed at s7:**
  F1 era-chip gold text on canvas (3.22:1 → marker dot + ink label),
  F2 quiz era-1 chip white-on-gold (3.63:1 → ink on gold, 5.18:1). Both
  re-verified; report regenerated; visual repackaged.
- **Color never alone:** era encoding always paired with text (axis years,
  chip labels, legend text); rank highlight paired with set names + margin
  note; palette strips carry names in tooltips (color IS the data there —
  G5-signed).
- **Alt text:** authored from contracted intents on all 80 visuals
  (generator-enforced); quiz announces every state change via aria-live.
- **Tab order:** explicit on every visual — content first, chrome last;
  rendered verification = D10.
- 🖥 items (rendered focus order, screen-reader walk, keyboard-only walk of
  the dark state) → UAT script below, per the mission §7 checklist.

## 3 · Contest compliance sweep (mission §1, item by item)

| # | Rule | Status |
|---|---|---|
| 1 | Power BI Desktop, single .pbix submitted (not a URL) | ◐ user: open PBIP, run D1–D11, File → Export → .pbix (D5) |
| 2 | Max 5 pages | ✅ exactly 5 visible; 1 hidden tooltip page (type Tooltip, HiddenInViewMode) — assumption documented in BUILD_LOG; tooltip page carries no report content beyond definitions |
| 3 | Provided dataset only | ✅ all queries read the 10 contest CSVs via DataFolder; all imagery from dataset img_url CDN columns |
| 4 | ≥3 core Power BI visuals | ✅ column charts, bar charts, matrices, cards, multi-row cards, buttons — the custom visual is additive (page V also has core card + textboxes) |
| 5 | Key Takeaway ≤50 words on landing page | ✅ 35 words, drop-cap paragraph on page I; every claim in it re-derived (evidence manifest) |
| 6 | Attribution on the report | ✅ "Source: Rebrickable LEGO Database (rebrickable.com)" in the footer of all five pages, both P4 states; CREDITS.md + source register carry Rebrickable & Stephanie Bruno |
| 7 | Accessibility expectations | ✅ audit above; dark state contrast-verified; quiz fully keyboard/ARIA |
| 8 | Judging criteria optimized | ✅ traceability table in 01-requirements.md |

## 4 · Business validation (metric contracts vs independent derivation)

Expected values below were derived **independently of the model** by
`project/analysis/derive_evidence.py` over the raw CSVs with the contracted
rules. The user validates observed values in Desktop after refresh (UAT-2);
agreement = pass.

| Metric | Where | Expected (independent) |
|---|---|---|
| M-001 Sets | kpi_sets_by_era (I) | era1 67 · era2 142 |
| M-002 Parts Shipped | hero (I), 2018 column | 15,053 (2001–04 total 8,141) |
| M-003 Avg Parts per Set | kpi (I), band (II/III) | 267 · 731 |
| M-004 Distinct Colors Used | band (II/III), hero (IV) | 66 · 79 · 76444-1 = 55 |
| M-005 Grayscale Share % | band (II/III), kpi (IV) | 51.1% · 40.9% · HP 42.4% · SW 71.8% · 10175-1 = 97.9% |
| M-006 Unique Minifigures | context | HP lifetime 576 |
| M-008 Era | slicers/legends | zero HP sets in Hiatus |
| M-009 Quiz Questions | kpi (V) | 10 |

## 5 · UAT script (English; pass = all boxes tick)

1. Open `project/pbip/hp-world-champs.pbip` in Desktop → set `DataFolder` →
   refresh (D1). Expect ~1M-row fact load in minutes.
2. Walk pages I–V against §4's expected numbers (D4). Any mismatch → stop,
   record a review finding; do not hand-edit numbers.
3. Page I: enable "Show items with no data" on the hero axis (D6) → six empty
   hiatus slots appear with the italic bracket note.
4. Pages II/III: page between them — grids must be pixel-identical; bin the
   size distribution (D7); confirm images render (D3).
5. Page IV: click the dark-side button — dark chrome swaps in, Voldemort
   appears, footer attribution still visible; click back (D10). Keyboard-only:
   Tab to the button, Enter — same flip. Contrast should read comfortably.
6. Page V: import the .pbiviz (D9, README steps), bind roles, play the game —
   mouse and keyboard-only; with Narrator on, every match is announced.
7. Assign tooltip page (D8); hover the hero and era bands — definitions show.
8. Export the single .pbix (D5); reopen it on a machine (or profile) without
   the dev toolchain; confirm the quiz still renders (Q4 embed check).

## 6 · Delivery notes

- **Deployment:** none (contest file submission — the user submits; the agent
  never publishes).
- **Refresh:** one-shot dataset; no scheduled refresh; DataFolder is the only
  machine-specific value and lives outside version control's reach (placeholder).
- **Submission package:** the exported .pbix + gallery post. Suggested post
  description (credits per attribution.md, tag **World Champs BCN**):

  > *The Boy Who Came Back — LEGO Harry Potter's two marriages.* Five
  > chapters: a seven-year silence made visible, two mirror-image eras, the
  > most colorful set in LEGO history (with a cheeky dark side), and a
  > Sorting Quiz built as a custom visual. Every number re-derived from the
  > Round 2 dataset. Data: Rebrickable LEGO Database (rebrickable.com).
  > Starter model by Stephanie Bruno. Built with an agent-driven PBIP
  > pipeline (TMDL + PBIR authored as code).

- **Open findings accepted:** none open besides the D-steps (environment
  boundary, not defects). F1/F2 fixed pre-delivery.

## 7 · Retrospective (≤10 lines)

1. Re-deriving the evidence pack BEFORE modeling made every later copy
   decision instant — keep stage-4-first evidence derivation.
2. The report generator (one spec → 80 visuals) beats hand-authoring for
   mirror-grid designs; pair it with a recorded cf-command block since
   `pbir visuals cf` edits don't survive regeneration.
3. pbir's bundled schemas lag Desktop's — write conservative PBIR, keep a
   Desktop-steps ledger from day one (D1–D11 was painless because of it).
4. npx-local pbiviz (no global install) works; ts-loader needs the tools as
   a local devDependency — port this note to the template's scaffold doc.
5. Port back to template: tmdl_inventory expression-counting fix; the
   bookmark visible/hidden serialization note; check_contrast pair presets
   for chip-on-chip text.

## Gate G7 — definition of done

Technical ✅ · Semantic: independent expectations locked, Desktop observation
= UAT-2 ◐ · Design: hard rules + fidelity hold on delivered state (ax-audit
re-run at this gate) ✅ · Delivery: UAT handed over, evidence manifest
complete ✅ · **User acceptance: pending Desktop run + export** — G7 closes
when the user records acceptance here.
