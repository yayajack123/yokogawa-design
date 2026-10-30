# figma-taste: revision notes (comparison 1)

Source: a desk comparison on 2026-10-22, not a test run. figma-taste was read against two other skills
installed for the same user: **design-taste-frontend** (tasteskill v2, code-side art direction with a
library distilled from 247 gallery sites) and **antislop-ui** (a catalogue of generated-UI tells). The
question was whether figma-taste's references are on the same level. Nothing here ran in Figma.

The answer: the direction is the same and figma-taste already audits many of the same tells in the
canvas, but its library is much smaller, three of its ten directions lean on the look that
design-taste-frontend now calls the most recognisable generated style, and a handful of antislop-ui tells
are neither in the house rules nor in the audit.

Paths are relative to `figma-taste/`. Patch one file at a time. Keep public helper names.

Priority: **P1** breaks the result, **P2** costs quality, **P3** polish.

## Rule for this revision: no downgrade

- Every audit rule, check and output that passes today must still pass. New checks are added next to the
  old ones; thresholds that are already stricter than the other skills stay as they are (for example
  `type-sizes` warns over 7 sizes, design-taste-frontend over 9).
- Section 4 adds compositions to the deal pool. That changes the result of a `deal.mjs` run with the same
  arguments, which the project rules forbid unless a note asks for it: **this note asks for it**, for
  section 4 only. Deals already saved to `.figma-taste/deal-*.json` stay readable with `--show`. Record
  the break in the CHANGELOG.
- Licence: the design-taste-frontend README states licences for its photographs, found pictures and fonts,
  but none for its own library (`library/*.json`, `references/*.md`). This repo is public. **Do not copy
  its JSON, blueprints or site list.** Use it only as a checklist of which roles and situations need
  coverage, and write every recipe here in our own words, in column spans on the 1920 grid.

## Summary

**Already covered (no work):** gradient, glass, shadow at rest, hairline, monospace, emoji, pill badge,
icon cards, identical card rows, index numbers, tiny caps (eyebrows), unbound colour/spacing/radius,
repeated adjacent compositions, too many typefaces and sizes. These are in `scripts/audit.figma.js`
and match antislop-ui and design-taste-frontend `references/tells.md` §1–§5.

**Fix**
- Three directions describe the "warm editorial" look that became the generated default (1)

**Improve**
- Audit checks for tells that are measurable in the canvas but not checked yet (2)
- Pricing, process and bento rules for the deal and dummy content (3)
- A bigger composition and direction library, written here (4)
- Copy tells in dummy content (5)

## 1. Directions that lean on the third-wave look (P1)

- **Symptom:** design-taste-frontend `tells.md` §3 lists the "fix that became the look": yellow-cream
  ground with a terracotta/rust/clay accent (banned together), a high-contrast or soft serif display as the
  shortcut to "premium", the oversized italic serif headline, and broadsheet cosplay. In `deal.mjs`:
  - `editorial-grid`: serif display + "paper ground 70%".
  - `quiet-luxury`: "a high-contrast serif for display (e.g. Cormorant, Playfair Display, Bodoni Moda)".
  - `warm-craft`: accent "the material (leather, clay, wood, linen)", so clay becomes terracotta.
  A brief that sounds premium or crafted lands on one of these three and produces that look.
- **Cause:** `references/house-rules.md` has "No assistant palette" (cream + terracotta), but it is not
  marked ⚙ and the audit does not check it. The direction text itself points toward it.
- **Change:**
  - Rewrite the three palette and type lines so they no longer default to the look: "paper" means a
    neutral white or cool stone, never yellow-cream; `warm-craft` takes warmth from a photograph, a
    low-chroma stone or a full field, and its accent may not sit in the terracotta hue band; serif display
    stays allowed but each line names a non-serif alternative of equal standing.
  - Make "No assistant palette" a ⚙ rule: new audit fail `assistant-palette` when the resolved ground
    colour is in the cream band and any accent is in the terracotta band. Bands, as a starting point to
    tune: cream = hue 35–60°, saturation 25–70%, lightness ≥ 88%; terracotta = hue 8–28°, saturation
    35–75%, lightness 35–60%.
  - Direction ids and composition pools do not change, so deals stay the same.
- **Verify:** mock test with a cream ground (`#F4ECD8`) and a terracotta accent (`#C2643C`) fails
  `assistant-palette`; a white ground with the same accent, and the cream ground with a deep ink accent,
  pass. `deal.mjs --list directions` shows the new lines. A deal with the same arguments gives the same
  compositions as before. **In Figma:** one build with `warm-craft` passes the audit.

## 2. `scripts/audit.figma.js`: tells not checked yet (P2)

Each is a warning (`W`), not a fail, so nothing that passes today fails after the patch. Exclude layers
inside instances and UI components the same way the existing checks do (`inInst`, `isUI`).

### 2.1 `left-stripe`

- antislop-ui "Colored Left Stripe": a thin accent bar on one side of a card or quote.
- Detect: a frame whose only stroke is on the left (`strokeLeftWeight > 0`, other sides 0), or a child
  RECTANGLE ≤ 8 wide at the parent's left edge covering ≥ 70% of its height.
- **Verify:** mock card with a 4×120 rectangle at x 0 warns; a 4×120 rectangle in the middle of a row does not.

### 2.2 `status-dot`

- antislop-ui "Decorative Status Dot": a small coloured dot in front of a label.
- Detect: an ELLIPSE ≤ 12×12 as a sibling of a TEXT in a horizontal auto-layout row, outside UI components.
- **Verify:** mock row `[ellipse 8×8, text]` warns; the same ellipse inside a node named `Toggle` does not.

### 2.3 `button-arrows`

- antislop-ui "Small Arrows on Every Button".
- Detect: three or more buttons (instance or frame named `Button…`) and every one ends in an arrow glyph
  (`→ ↗ › ➝`) or a child vector named `arrow`.
- **Verify:** three mock buttons with `→` warn; three buttons where only one has an arrow do not.

### 2.4 `soft-radius`

- design-taste-frontend `tells.md` §5 and antislop-ui "Excessive Border Radius": one medium radius on
  everything.
- Detect: ≥ 70% of the frames with a corner radius share one resolved value between 10 and 20.
- **Verify:** five mock cards at radius 16 warn; radius 0 or 999 on all of them does not.

### 2.5 `all-centred`

- design-taste-frontend `tells.md` §5: everything centred, warned over 72%.
- Detect: more than 72% of TEXT nodes with a Display or Heading style have `textAlignHorizontal === 'CENTER'`.
- **Verify:** a mock page with four centred headings out of five warns; two out of five does not.

## 3. Deal and dummy content (P2/P3)

### 3.1 Pricing has no composition of its own (P2)

- **Symptom:** `--sections intro,pricing,… --direction editorial-grid --seed 1` dealt `pricing → s-index-list`.
  `pricing` is a role, but no composition is written for it, and nothing in the house rules stops the
  "Most popular" tier (antislop-ui "Most Popular Pricing Card"). It is mentioned only in the SKILL.md intro.
- **Change:** add a pricing composition (tiers of equal weight; the difference is in the words and the
  figure, not a raised or coloured card) and a ⚙ house rule "No highlighted tier". Audit warning
  `popular-tier`: inside a section named `Pricing`, exactly one of three or more sibling cards has a
  different fill or a badge.
- **Verify:** `deal.mjs --list compositions` shows the new id for `pricing`; mock pricing row with one
  differently filled card warns.

### 3.2 Process defaults to three steps (P3)

- antislop-ui "How It Works Always 3 Steps". `s-flow` needs `real-process`, which is right, but dummy
  content has no rule for the step count.
- **Change:** in step 4 (dummy content), a dummy process takes the number of steps the real work has; when
  unknown, not three.
- **Verify:** documentation only.

### 3.3 Bento (P3)

- antislop-ui "Bento Grid". No composition is a bento, but `grid()` can build one in a Reference or a
  redraw.
- **Change:** ⚙ house rule "No bento". Audit warning `bento`: a GRID frame with four or more children,
  at least two different column or row spans, and every child carded (fill or stroke).
- **Verify:** mock 2D grid of mixed-span filled cells warns; a gallery of image cells with equal spans does not.

### 3.4 Logo wall: no change

- antislop-ui bans the "Trusted by" logo bar. `s-logo-wall` already needs `logos`, accepts only real logos
  with permission or marked dummy wordmarks with invented names, and the brief decides whether the role
  exists. That matches design-taste-frontend's "real proof, or none". Keep it.

## 4. Library size (P2, large, in batches)

- **Symptom:** figma-taste deals from 10 directions, 8 heroes, 16 section compositions and 2 footers.
  design-taste-frontend deals from 20 directions, 58 heroes, 185 section compositions across 16 roles,
  56 palettes and 44 type pairings. When photographs are not available, figma-taste has three heroes
  left (`hero-field`, `hero-index` with items, `hero-ui` with product UI), so pages from different projects
  start to look alike.
- **Change:** grow the pool in batches, each batch one commit with its own CHANGELOG entry:
  1. Heroes that need no photograph (target: five more), because that is where repetition shows first.
  2. One or more compositions per role that today falls back to a generic one: `pricing` (3.1),
     `testimonial`, `stats` without a real figure, `cta`, `features`.
  3. Directions that do not lean on serif display or warm grounds (target: 14–16 in total).
  4. Optional: palettes and type pairings as their own lists, so a direction can be dealt with more than
     one pairing.
  Every recipe is written here, in column spans, with its `needs`, following the licence note above.
- **Verify:** a test that every role in `--list roles` has at least two compositions reachable without
  photographs; `--options-deal 3` still gives three different heroes. There is no deal test in
  `scripts/test/` yet: add one before batch 1 that pins today's output for a fixed seed, then update its
  expected output once per batch, in the same commit, and say so in the CHANGELOG.

## 5. Copy tells in dummy content (P3)

- design-taste-frontend `tells.md` §3–§4: performative section labels ("Field notes", "Quietly trusted
  by", "On our desks") and agency micro-meta (local time, coordinates, weather, version stamps,
  "©2026 — Scroll", middle-dot strings).
- **Change:** list both in step 4 as things dummy copy never uses. Audit warning `micro-meta`: TEXT that
  matches a clock time with a city or timezone, a coordinate pair, or three or more middle-dot-separated
  fragments.
- **Verify:** mock texts `Jakarta 14:32 WIB` and `6.2°S, 106.8°E` warn; `Mon–Fri 09:00–17:00` in a
  section named `Contact` does not.

## Not adopted, and why

- Motion tells and the real-browser inspector of design-taste-frontend: figma-taste builds static frames
  and has its own in-canvas audit.
- antislop-ui "Dark Mode Default for No Reason": the dealt direction decides the ground, so the reason
  is recorded in the direction sheet already.
- antislop-ui "Lucide Icons" and "Generic AI Icons": figma-taste builds few icons; `icon-cards` already
  catches the common case. Revisit if a run shows icon slop.
