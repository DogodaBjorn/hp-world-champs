# Accessibility audit checklist

Run by the `ax-audit` skill at gate G6 (build) and re-confirmed at G7
(delivery). Each unchecked item is a review finding (dimension: design,
severity per impact) — fixed or explicitly user-accepted, never silently
shrugged. Items marked 🖥 need Desktop/Service and go on the rendered-review
handoff when the agent cannot verify them.

## 1. Contrast (measured, not eyeballed)

- [ ] `python scripts/check_contrast.py` passes: text tokens ≥ 4.5:1 on
      their backgrounds; non-text meaning-carriers (accent, good/bad,
      icons) ≥ 3:1.
- [ ] Heat encodings: label text readable at **both ends** of the ramp
      (check the extremes as pairs).
- [ ] Text over chrome washes (masthead, footer) checked as pairs, not
      assumed from the canvas result.

## 2. Color never alone

- [ ] Every good/bad encoding pairs color with a sign, arrow, icon, or
      label (design hard rule 3 — verify per visual, not per page).
- [ ] Slicer/selection states distinguishable without color (accent bar,
      fill *and* weight/underline).
- [ ] Report legible in grayscale (squint test on a desaturated screenshot
      🖥 or reasoned per-visual).

## 3. Alt text & titles

- [ ] Every non-decorative visual has alt text stating its **message**, not
      its type — authored from the design handoff's intent + the insight
      title measure where one exists ("Bar chart" is a finding; "North
      leads revenue, 32% above average" passes).
- [ ] Decorative elements (`z_*` chrome, background images) marked
      decorative / hidden from assistive tech where the property exists.
- [ ] Visual titles visible or deliberately hidden with the decision
      recorded (explicit-properties rule).

## 4. Tab & reading order

- [ ] Tab order set per page to match the reading order (top-left →
      bottom-right, hero before support), not creation order. 🖥 verify by
      tabbing through.
- [ ] Hidden/decorative elements removed from tab order.
- [ ] Tooltip content is never the only path to information (tooltips are
      hover-only — tooltip-studio doctrine).

## 5. Type & size

- [ ] No text below 10pt (caption tier); body ≥ 12pt where reading is
      sustained (tables).
- [ ] Fonts verified in the **fallback** rendering (brand-kit rule) — a
      fallback that renders smaller/tighter can break these minimums.

## 6. Consistency & language

- [ ] Slicers, nav, and recurring elements identical in position, font, and
      behavior across pages.
- [ ] Jargon and acronyms expanded on first use or defined on the
      Definitions page.
- [ ] Number/date formats consistent report-wide (locale per project
      language).

## 7. Interaction

- [ ] Everything reachable by mouse is reachable by keyboard (native
      visuals: largely given; custom/Deneb visuals: verify 🖥).
- [ ] No information conveyed *only* by motion or hover; bookmark states
      have visible, labeled controls (nav-studio doctrine).

## Evidence

Attach to the gate: the check_contrast output, the per-visual alt-text
list (from the design handoff), the tab-order note per page, and open
findings with their resolutions. The rendered-review checklist (stage 7)
carries the 🖥 items.
