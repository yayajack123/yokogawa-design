# figma-taste: revision notes (run 3, token budget)

Source: a measured test on 2026-10-22. The user reported that one prompt for a homepage used about 20% of a
session's usage. Two transcripts were compared:

- **Run 2 (2026-10-19)**: the Arunika homepage, two design options at Desktop, two reference sites
  (exoape.com, studiod.nu), one session.
- **Run 3 (2026-10-22)**: the same Arunika brief, one option at Desktop, no reference sites, split into a
  planning session and a build session that started with an empty context. Figma file "New Project
  (Copy)", page "Lean test" (file key not published). Skill version: branch `figma-taste-compare-1`.

The two runs did not do the same amount of work (run 2 had references and two options), so the saving below
is an upper bound for this change alone. What it does show is where the cost comes from.

Paths are relative to `figma-taste/`. Priority: **P1** breaks the build or the result, **P2** costs time
or quality, **P3** polish.

## Rule for this revision: no downgrade

- Every step, check and output stays. Step 1 still reads the whole PRD and sitemap: the system inventory
  comes from them. What changes is **where** the reading happens (a short planning session) and that the
  build session never repeats it.
- The single-session run stays possible when the user asks for it.

## Measurements

| | Run 2 | Run 3 (plan + build) |
| --- | --- | --- |
| Turns | 104 | 40 (12 + 28) |
| Context re-read over the session (sum of every turn's context) | 31.5M tokens | 4.9M (0.8M + 4.1M) |
| Output tokens | 188k | 71k |
| Largest context | 453k | 208k |
| Session usage | about 20% (user's estimate) | 11% (27% → 38%) |
| Audit | PASS | PASS, 0 fails, 1 warning, no fix round |

- In run 2, the assistant's own prose was 3.9% of the content; tool calls (code sent) were 228k characters
  and tool results 456k. Shorter prose (caveman style) saves about 2%; it is not the lever.
- The cost is **turns × context**. Every turn re-reads the whole conversation, so anything read early (the
  PRD, the Figma skills, a script) is paid again on every later turn.

## Summary

**Fix**
- The foundations default CONFIG is the assistant palette that the audit now fails (4)

**Improve**
- Plan and build in two sessions, with a fixed handoff file (1)
- Build-session budget rules (2)
- Read each script once, in the form that is pasted (3)

## 1. Two sessions: `plan`, then `build` (P1, user-approved)

- **Symptom:** run 2's context grew from 49k to 453k over 104 turns. The PRD and sitemap (+32k at turn 6),
  the Figma skills (98k characters) and every pasted script stayed in context through the whole build.
- **Change:**
  - `/figma-taste plan <brief or PRD> [reference URLs]`: steps 1–4 unchanged (whole PRD and sitemap,
    inventories, the one question, references, deal, idea, copy deck), plus the step 5 decisions (the
    foundations `CONFIG` values and the component list from the system inventory) and the step 7 image
    queries. No Figma tools. Writes `.figma-taste/plan.md` in the format of `references/plan-format.md`,
    then stops with one line: open a new conversation in this folder and type `/figma-taste build`.
  - `/figma-taste build [Figma URL]`: starts from `plan.md` (and `design-system.json` when it exists).
    Never reads the brief, PRD or sitemap, never re-deals, never rewrites the copy. Reads the file (step 1,
    "Read the file") at its start; a conflict with the plan (another brand's system in the file) is the
    one question of this session.
  - No mode given: run `plan`, then say how to continue. The user may ask for one session; then write
    `plan.md` anyway and continue.
  - Mobile in the build session when the Desktop build took 15 turns or fewer; otherwise
    `/figma-taste build mobile` in a new conversation.
- **Verify:** run 4 (below).

## 2. Build-session budget (P2)

- **Symptom:** run 2 used 34 `use_figma` calls; run 3 used 6 and passed the audit without a fix round.
  SKILL step 6 still said "build one or two sections per call".
- **Change:**
  - As many sections per call as fit under about 40k characters (helpers included); split only for
    recovery, as figma-use rule 5 says.
  - Audit with `SUMMARY = true`; one `get_screenshot` per wrapper per round; three rounds at most (as
    before).
  - Load `figma-use` and `figma-generate-design` once per session. Load `figma-generate-library` only
    when `foundations.figma.js` fails or a component needs a pattern `component()` / `textProp()` do not
    cover. Run 3 built foundations and seven components without it.
- **Verify:** run 4.

## 3. Read each script once, in the form that is pasted (P2)

- **Symptom:** in run 3's build session, `foundations.figma.js` was read twice in parts (9k, 9k, 5k), then
  printed again with CONFIG filled (20k) and pasted (20k). Helpers (21k) and the audit (19k) were each
  printed and then pasted.
- **Cause:** `use_figma` takes the code inline, so a script is always in context twice (read, then sent).
  Reading it in parts first adds a third and fourth copy.
- **Change:** the CONFIG block is the first thing in `foundations.figma.js` (it already is); read only that
  block to decide the values (`sed -n '/^const CONFIG/,/^};/p'`), write the values into `plan.md`, and in
  the build session print the finished call once (CONFIG substituted) and paste it. Use
  `helpers.min.figma.js` unless the call needs components, GRID, scrims, `toColumn()` or the layout grid.
- **Verify:** run 4: each script appears in the build transcript at most once as a tool result.

## 4. The foundations default CONFIG is the assistant palette (P1, bug)

- **Symptom:** `CONFIG.RAMPS` defaults to `paper: '#F3F0E9'` (hue 42°, saturation 29%, lightness 93%: the
  cream band) and `accent: '#9C5B2E'` (hue 25°, saturation 55%, lightness 40%: the terracotta band). A
  build that keeps the defaults fails `assistant-palette` (compare-1 §1).
- **Change:** neutral defaults outside both bands: `paper: '#F2F1EE'`, `accent: '#24566B'` (petrol; `#2F4A6B` was too close to the `blue` ramp for the token check, and a deep teal missed 4.5:1 for `accent/on` by 0.03).
- **Verify:** a Node test that the default ground and accent are outside the bands, and the foundations
  test still passes (contrast included).

## 5. Run 4 (to do)

The same Arunika brief **with** the two reference sites and two options, in two sessions, to compare with
run 2 on equal work. Record turns, context sum, output and the usage before and after each session.
