# figma-taste changelog

## 2026-10-22 (c) — after run 3 (token budget: plan and build sessions)

Applied `notes/run-3.md`. Rule kept: **no downgrade**. Step 1 still reads the whole PRD and sitemap; it now
happens in a short planning session, and the build session never repeats it.

### Measured (run 3, Arunika homepage, one option, no reference sites)
- Run 2 in one session: 104 turns, 31.5M tokens of context re-read, 188k output, about 20% of a session's
  usage (user's estimate). Run 3 as plan + build: 40 turns, 4.9M, 71k output, 11% (27% → 38%), audit
  PASS with no fix round. Run 2 also had two reference sites and two options, so this is an upper bound
  for the split alone; run 4 repeats it on equal work.
- Shorter prose (caveman) is about 2% of the cost: the assistant's text was 3.9% of run 2's content.

### Verified here (Node tests)
- **§4** `foundations.figma.js` default `CONFIG` was the assistant palette the audit fails (paper
  `#F3F0E9` in the cream band, accent `#9C5B2E` in the terracotta band). New defaults: paper `#F2F1EE`,
  accent `#24566B` (petrol). A new check in `foundations-mock.test.mjs` fails on the old defaults and
  passes on the new ones; contrast and the token check still pass (a first choice, `#2F4A6B`, duplicated
  the `blue` ramp's lightest step; a deep teal missed 4.5:1 on `accent/on` by 0.03).

### Documentation
- **§1** `SKILL.md`: new "Two sessions: `plan`, then `build`" section. `plan` runs steps 1–4 plus the
  step 5 decisions and step 7 queries without Figma tools and writes `.figma-taste/plan.md`; `build`
  starts in a new conversation from that file. New `references/plan-format.md` fixes the file's format.
  "Read the file" moves to the start of the build session.
- **§2** Sections per call: as many as fit under about 40k characters (was one or two). Audit with
  `SUMMARY = true`, one screenshot per wrapper per round. `figma-generate-library` only when foundations
  fail or a component needs a pattern the helpers do not cover.
- **§3** Read each script once, in the form that is pasted; the plan reads only foundations' `CONFIG` block.
- The audit min size in the hard API facts is now ≈19k.

### Still to verify
- **Run 4:** the same brief with the two reference sites and two options, in two sessions, against run 2.

## 2026-10-22 (b) — first selftest run inside Figma

`selftest.figma.js` ran in a real design file (file key not published) through the Figma MCP, all three
phases, and the file was left clean (no fixture, style or collection left behind). It had never run in
Figma before; this round fixed what it found. Rule kept: **no downgrade**.

### Verified in Figma
- Phase 1: 29 of 29 checks pass after the fixes below, including the compare-1 probes: per-side stroke
  weights read back `[4, 0, 0, 0]` (§2.1) and `gridColumnSpan` reads `7` on a GRID cell (§3.3).
- Phase 2: exactly one `eyebrow` fail (Selftest/Above), one `emoji` fail (🚀) and a `left-stripe`
  warning on `selftest/stripe`. The other fails (`image-floor`, `no-title`, `unbound-colour` on a default
  rectangle, `repeat-adjacent`) come from the bare fixture, as before.

### Found and fixed
- **`fill(node, token, opacity)` lost the opacity** (1.2): Figma drops a paint's opacity when a
  colour-bound paint is assigned to a node, whether it was set before or after binding. `fill()` now
  assigns the bound paint, then reassigns the node's fills with the opacity, which keeps it (probed in
  Figma). Same name, same arguments.
- **The audit crashed on real nodes.** Figma throws when a node is asked for a property its type does not
  have (`no such property 'strokeLeftWeight' on TEXT node`), where the mock returned `undefined`. Two
  crashes:
  - the new `left-stripe`, `status-dot`, `soft-radius` and `bento` reads (this round): now guarded with
    `in` or `hasLayout()`;
  - the existing `no-title` and `untitled-section` checks called `findOne` on a section that is a leaf
    (a TEXT or a RECTANGLE straight under the page wrapper): now `hasTextAtLeast()`, which reads a TEXT's
    own size and asks only nodes that have children. A page whose first child is a text layer used to
    crash the audit; it now fails `no-title` unless that text is set at 40px or more.
- **The mock now behaves like Figma here:** TEXT, ELLIPSE and RECTANGLE nodes throw on layout, padding,
  children, `findAll`/`findOne` and (where the type lacks them) per-side stroke weights and corner radius,
  and `in` reports them missing. Both crashes reproduce in `audit-mock.test.mjs` without the fix; a new
  case covers a text layer as the page's first child.
- **Selftest fixture:** the wrapper had 32px padding, so every span and column check measured a 1856-wide
  section and failed (4 checks); the wrapper now has no padding, like a page wrapper. The component
  height check compared against 100, which the content happens to add up to; it now compares with the
  content height.

### Documentation
- `SKILL.md` hard API facts: Figma throws on a property the node type lacks; guard with `in`.

## 2026-10-22 — after comparison 1 (design-taste-frontend, antislop-ui)

Applied `notes/compare-1.md` §1, §2, §3 (rules and audit), §5 and the test prerequisite of §4. Rule kept
throughout: **no downgrade**. Every audit rule that existed is unchanged, every public helper name still
exists, and every pinned deal gives the same result as before.

### Verified here (Node regression tests in `scripts/test/`, mock Figma API)
- **New `deal.test.mjs`** pins four deals (three single directions, one `--options-deal 3`) as of today.
  It passed before and after the direction rewrite in §1, so that rewrite does not move any deal.
- **§1** `deal.mjs`: the type and palette lines of `editorial-grid`, `quiet-luxury` and `warm-craft` no
  longer point at the "warm editorial" look (no yellow-cream, no terracotta/rust accent, serif display
  no longer the default, no oversized italic serif headline). Ids, heroes and composition pools are unchanged.
- **§1** audit fail `assistant-palette`: cream ground + terracotta paint fails; a white ground with the
  same accent and a cream ground with a deep ink accent pass. New `BRAND_PALETTE = false` setting for a
  brand that owns the palette.
- **§2** audit warnings `left-stripe`, `status-dot`, `button-arrows`, `soft-radius`, `all-centred`, each
  with its Verify case and its counter-case.
- **§3.1** warning `popular-tier`; **§3.3** warning `bento`; **§5** warning `micro-meta`.
- The new checks raise nothing on the existing Arunika mock root, and full and min audits still return
  identical results on all four mock roots.
- `audit.min.figma.js` grew from about 14k to 18.6k characters (full: 25.6k). Helpers min + audit min
  is still about 26k, well under the 50k per-call cap.

### Still to verify inside Figma
- ~~`selftest.figma.js` probes for §2.1 and §3.3~~: verified the same day, see 2026-10-22 (b).
- One real build with `warm-craft` that passes the audit (§1).
- The colour bands of `assistant-palette` and the 10–20 band of `soft-radius` are starting points; tune
  them on real files.

### Documentation
- `references/house-rules.md`: "No assistant palette" is now ⚙ and explains the third-wave look; new ⚙
  "No small tells" list; two new allowed exceptions (`BRAND_PALETTE`, interface dots).
- `SKILL.md` step 4: no copy tells, process steps not three by habit, pricing tiers at equal weight.
  Step 8 lists the new audit rules. Files table mentions the deal test.

### Open items
- **§3.1 pricing composition** moves to §4 batch 2: adding it changes deals for the `pricing` role, so it
  belongs with the other pool changes and their one-time update of `deal.test.mjs`.
- **§4 library batches 1–4** not started. `deal.test.mjs` is in place for them. design-taste-frontend
  states no licence for its library: write every recipe here, never copy its files.

## 2026-10-19 (c) — pointer to figma-design-review

Documentation only; no script, rule or output changed (tests still pass).
- The skill description now sends requests to review or lightly fix a design the user already made to
  the new `figma-design-review` skill, which keeps the designer's own system and never edits the
  original. figma-taste still handles "redesign" and "polish" when the page is built or rebuilt here.

## 2026-10-19 (b) — after run 2 (Arunika, two options)

Applied `figma-taste-revision-notes.md` (run 2). Rule kept throughout: **no downgrade**. Every v2 audit
rule is still present, every public helper name still exists, and a single deal with the same arguments
gives the same result as before.

### Verified here (Node regression tests in `scripts/test/`, mock Figma API: 43 checks)
- **1** `row()` helper: flex rows with `span/N`, `SPACE_BETWEEN` when spans < 12; GRID kept for 2D.
  Docs switched to flex-first (SKILL step 6, autolayout.md, compositions.md "How to read").
- **2.8** `audit.min.figma.js` (14k vs 19k; same checks, same messages) generated by a dependency-free
  minifier in `build-min.mjs`. **Short of the 9k target:** getting there would mean shortening result
  messages, which would be a downgrade. Full helpers + audit.min fit one call (≈35k). The test proves
  audit and audit.min return byte-identical results.
- **4.1** headline rule only for Display/Heading styles (unstyled text ≥ 48px still checked);
  **4.2** wrapper message suggests `span/N`; **4.3** hug-width children checked on the left edge only.
- **3.1** hero/footer dropped from `--sections` with a note; "pinned" only when `--require` matched.
- **3.2** `--options-deal N` / `--avoid`: different direction, hero and per-role composition where the
  content allows, with a table of what differs. Plus a lookahead: a composition that is the only fit for
  a later section is kept for it (found while testing: three projects lost `s-sticky-pair` to services).
- **3.3** deals saved as `deal-<option>.json`; `--show A`, `--redraw … --option A`.
- **8.1** ids with a hyphen (`Pk-KuizxQv8`) parsed from the last 11 characters.
- **8.2** `unsplash.mjs preview`: small JPEGs, keyless, per-photo timeout, never the full file.
- **8.3** intake `target` may be an array; **8.4** `filters` (grade) applied and existing grades kept.
- **9** ref-extract reports inline CSS read from SPAs and points to the browser skills.
- **12, 13, 15, 16** `foundations.figma.js`: five collections (primitives, theme, layout, system,
  figma helpers), 31 colour roles, OKLCH ramps (base colour kept exactly), full type scale (18 styles,
  percent line height/tracking, only fontSize and option fontFamily bound), system constants, spans,
  overlay effect, grid styles; idempotent; contrast checks returned. Default roles pass contrast in a
  light theme and a dark option (two defaults were adjusted after the test caught them: field outline
  K600, warning amber800).
- **15.5** `tokens.figma.js` token check finds every row of table 15.2; on a fresh system it reports
  0 issues besides "unused" (`layout/container-max` now aliases `breakpoint/xl` instead of duplicating it).
- **14** `manifest.figma.js` writes the design-system manifest; **15.4** `collapse-options.figma.js`
  turns the chosen option into the default `Light` mode, archives the other, replaces font variables
  with the family in the styles, moves the image radius to `radius/image` (dry run by default).

### Changed, still to verify inside Figma (`selftest.figma.js` now covers them)
- **2.1** `grid()` sets HUG row tracks; **2.2** `cell(..., valign)`; **2.3** `scrim()` defaults to
  `scrim/base` at `opacity/scrim`; **2.4** `component({ fixedMain, hugCounter })` (`hugWidth` still works);
  **2.6** `inst()` no longer logs variant props; **2.7** `FONTS` preloaded in the prelude.
- `row()` edges on the layout guide (Stats 7+5, Services/Head 6+5).
- The Figma-side scripts new in this version (foundations, tokens, manifest, collapse) ran only against
  a mock of the Plugin API; run them in a scratch file first.

### Documentation
- **5.1** one text-style set for all options, family bound to theme font variables; **5.2** per-option
  `shape/image-radius`; **5.3** Foundations board per option and the grid-strip fix.
- **6** a third existing-system case (generic starter template); **7** PRD conflicts in the step 1
  question (Tablet, 360px, concepts).
- **10** the hero does not repeat the big figure; **11** Logo/Slot wordmark uses Body/Strong.
- **14** system inventory from the sitemap; core components with states; every state token bound in a
  component before the page; manifest read first and updated every run.
- **2.5** variant label defaults documented.
- Tablet is supported when the PRD asks (LAYOUT_MODES), still off by default.

### Open
- The Mobile grid (390 · 4 · 20 / 16) and the Tablet values (768 · 8 · 40 / 24) are proposals until the
  user confirms them.
- The core component set is specified, not generated: components are built per project with
  `component()`; a generator may come after a run shows the shapes that work.

## 2026-10-19 — after the Arunika test run

Applied every item in `figma-taste-improvement-notes.md`. Numbers refer to that file.

### Verified here (Node, or mocked network)
- 3.1 `deal.mjs` enforces `needs` when `--have` is given; `photography`/`unsplash` alias `photo,photos`;
  `--items role:n` enforces minimums (`work:3` no longer gets `s-catalogue`); `--require` pins slots
  and prints them as "Pinned (brief)"; `--help`, `--list have`. Old `deal.json` files still read.
- 3.2 roles `clients` / `logos` and composition `s-logo-wall` (recipe in compositions.md).
- 4.1 `ref-extract.mjs` prints `vw`/`clamp()`/`calc()`/`rem` sizes as px at 1440 and 390
  (`3.73vw ≈ 54px @1440 / 15px @390`); 0 stylesheets → "SPA or inline CSS: rely on screenshots."
- 4.2 `unsplash.mjs`: no-key `search` prints the WebFetch fallback; tracking recorded per photo as
  `sent` / `failed (…)` / `not sent (reason)`; CDN ids accepted; `place --intake --intake-frame <id>`
  uploads to plain intake rectangles and writes `intake-transfer.figma.js` (tested with a mocked
  download and upload).
- 2.2 emoji rule: `© 2026` and `Brand™` pass, `🚀` fails (regex tested in Node).
- 6.4 span maths: `spanWidth(7, 1920, 12, 60, 30) = 1037.5`, span 5 = 732.5.
- All scripts pass a syntax check; `helpers.min.figma.js` is generated by `build-min.mjs`.

### Changed, still to verify inside Figma (run `scripts/selftest.figma.js`)
- 1.1 `txt(..., { maxW })` binds `width` (FIXED + `textAutoResize = 'HEIGHT'`) instead of `maxWidth`.
- 1.2 `paint()` sets opacity before binding.
- 1.3 `COLLECTION_PREFIX` / `STYLE_PREFIX` filters (styles keyed without the prefix).
- 1.4 new helpers `component()`, `toColumn()`, `textProp()`, plus `scrim()`, `dummy()`, `spanWidth()`,
  `spanTo()`, `columnGrid()`; `inst()` now picks a variant from variant props.
- 2.1 audit sibling lookup by id (eyebrow / pill-badge false positives inside instances).
- 2.3 logo wall exempt from `card-row` (`Clients/…`, `Logos/…`, `Logo/…` instances).
- 2.4 audit takes `ROOT_IDS` (several wrappers per call) and `SUMMARY`.
- 6.5 audit `off-grid` check (left edges on column starts; split children also on column ends) and
  `no-layout-grid`; reports wrapper height vs the sum of its sections; counts dummy layers.

### Documentation
- 5.1 step 1 asks once for the file URL, number of options and Mobile grid confirmation; brand prefix
  for shared files; sections on one page in shared files.
- 5.2 DesignAgent-only fallback route.
- 5.3–5.7 compositions in column spans with `s-logo-wall`; component variants planned up front;
  `toColumn()` and the height check in Mobile; the tested flat scrim; imagery no-key / intake / tracking.
- 5.8 nav may exceed five links when the sitemap mandates it.
- 5.9 required six-question short critique; the fourteen-pass critique is optional.
- 6 house defaults: Desktop 1920, 12 columns, margin 60, gutter 30, red 10% grid; tokens rescaled for
  1920; `grid/columns` and `span/*` tokens; grid styles; grid strip on Foundations.
- 7 design options (different direction and hero per option, own colour mode and text styles,
  Desktop first, Mobile after the pick); breakpoints Desktop and Mobile only.
- 8 dummy-filled content by default, marked with annotation and name suffix; real-only mode opt-in;
  "No invented proof presented as real".

### Open
- The Mobile grid (390 · 4 columns · 20 / 16) is a proposal until the user confirms it.
