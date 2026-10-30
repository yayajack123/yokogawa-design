# `.figma-taste/plan.md`: the handoff from `plan` to `build`

The planning session writes this file; the build session reads it and nothing else from the brief. It has
to be complete: whatever is missing here, the build session would have to read the PRD for, which is the
cost the split avoids. Write plain Markdown, in the page language for copy and in English for the rest,
with these headings in this order. Keep it to what the build needs (usually 10–20k characters).

```markdown
# Plan: <Brand> · <Page>

## Run
- Figma file: <URL, or "ask at the start of build">
- Frames: Desktop 1920 [+ Mobile 390 · 4 · 20/16, confirmed yes/no] [+ Tablet 768]
- Design options: <1 | 2 …>; content mode: <dummy | real-only>
- PRD conflicts and how they were settled: <one line each, or "none">
- Existing system: <".figma-taste/design-system.json exists" | "none known; build checks the file">

## Inventories
- Subject inventory: <8–12 items>
- System inventory: page types, UI states, repeated units (from the sitemap). Step 5 builds all of it.

## Argument
One line per section: claim, proof. Mandated sections and treatments marked "(PRD)".

## Direction and deal
- Command: `node <skill>/scripts/deal.mjs …` (exact, with seed; `.figma-taste/deal.json` holds the result)
- Direction, idea sentence, hero id, then each section: role → composition id, pins, redraws with reason.
- Per option (when several): what makes it different.

## References
Per site: what is adopted (type ratio, density, rhythm, image treatment) in px at 1920, and what is not.
"None" when no sites were given.

## Design system decisions
- `CONFIG` for `foundations.figma.js`, ready to paste: BRAND, RAMPS, THEMES (ground, ink, accent,
  dark, radiusImage, display, text per mode), STYLES, LAYOUT_MODES.
- Fonts with the exact style names to verify.
- Components to build (from the system inventory), with variants and states.

## Copy deck
Per section, the final text: headline, supporting sentence, action, every item. Dummy items marked
`(dummy)`; real facts from the brief unmarked.

## Images
Per slot: `image/<slot>` → Unsplash query from the subject inventory, ratio, and the shared grade.

## Dummy content
Grouped by section, for the report and the small board.
```

The build session may change a decision only for a reason it can state (a font that is not available, a
contrast failure, the file already holding a system), and records the change and the reason in the report.
