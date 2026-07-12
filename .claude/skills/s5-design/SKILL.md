---
name: s5-design
description: Lifecycle stage 5 - creative direction and design contract. Develop the report story, propose three divergent design directions, run the critique gate, and compile the winner into the design handoff quartet. Produces 05-design.md, page-purpose contracts, and the quartet in deliverables/.
---

# s5-design

**Question answered:** what should this report *be*, and exactly how will it
look? Primary agent: `report-designer`. This stage is the studio's
differentiator — do not compress it into "pick a layout".

## Procedure

1. **Story first.** From the requirements and metrics, write the report
   narrative: which pages, in what order, each answering one question for one
   audience. One `contracts/page-purpose.contract.yaml` per page (archetype
   from `design/page-archetypes.md`, intents from
   `design/visual-selection.md`). Include a Definitions page.
2. **Diverge.** Invoke the `design-critique` skill to produce **three
   genuinely divergent directions** in `creative-direction.contract.yaml`.
   Different in kind — metaphor, mood, density — not three accent colors.
3. **Critique and converge.** Argue each direction against
   `design/design-doctrine.md` per audience; present all three honestly to
   the user; the user picks (record `chosen_because` in their terms) and the
   fidelity checklist is written.
4. **Compile the quartet** into `project/deliverables/`:
   - `design-handoff.md` (from `templates/design-handoff.template.md`) —
     per page: grid layout, every visual with id (naming conventions), intent,
     bound measures, polish moves, and exact property expectations;
   - `data-model.md` (from the template) — the model as the designer needs
     it, including the not-available list verbatim;
   - `measures.dax` (from the template) — paste-ready display/support
     measures the design adds (insight titles, semantic-color measures),
     layered on the stage-4 model;
   - `theme.json` — via the `theme-from-brand-kit` skill (brand kit or
     neutral defaults), including the design brief's tokens.
5. Fill `design-brief.contract.yaml`; write `05-design.md` tying it together
   with `## Open questions`.

## Gate G5 checklist

- [ ] Every page has a purpose contract with a written 3-second message and
      3-minute path
- [ ] Three directions documented, critique honest, user chose
- [ ] Quartet complete and internally consistent (same tokens in brief,
      theme.json, and handoff; same visual ids in handoff and measures)
- [ ] Fidelity checklist written (stage 6 will be judged against it)

Then hand back to `/next`.
