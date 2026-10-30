# Yokogawa FAQ build report

- Desktop: 2526:2128, 1440 × 2088.
- Mobile: 2526:2359, 360 × 2748.
- Components board: 2526:1728. Main navbar 2526:1790 / 2526:1848; footer 2526:1914 / 2526:1980; CTA derived from existing main 2460:958: 2526:1981 / 2526:2025; accordion set 2526:2127; mobile open menu 2527:2460.
- Source homepage 2415:233 remains intact. Open Sans and existing brand variables/text styles reused. FAQ CTA uses a flat brand surface for legible responsive contact content; source image/gradient removed from FAQ derivatives only.
- Structural audit PASS with explicit utility-page exceptions: breadcrumb is navigation, repeated icon rows are required accordion items, and a navbar does not require a heading. Zero off-grid counts, zero unstyled text, wrapper heights equal summed section heights. Guides hidden intentionally; banner H1 supplies list context without repeated section headings.
- Visual critique: first screen identifies FAQ clearly; no photo scrim/lede issue; headings fit two lines including mobile; section compositions differ; no empty image slots; draft layers annotated; mobile height matches stacked sections. Read-back found no horizontal text overflow; all rendered text uses Open Sans. Editable vector/text/frame/instance structure, no UI screenshot raster.
- Prototype: accordion trigger click changes Open/Closed variants; desktop navigation and CTA text link to existing file frames. Keyboard semantics documented for implementation, not browser-tested. Mobile expanded menu and focus specimens supplied on component board.
- PRD: Indonesian content, banner, FAQ accordion, contact CTA, desktop 1440/mobile 360; no online enrolment or payment promises.
- Draft content: banner, six FAQ questions/answers, CTA copy, translated footer summary require Yokogawa copy validation. Contact details reused from source.
- Token hygiene: global source-system check reports existing bound typography metrics, missing code syntax, broad scopes and unused/duplicate tokens. Existing shared system is retained to preserve homepage consistency; this is not a clean full-system token audit. See token-check.txt. New spacing tokens carry GAP scopes and WEB syntax. One mobile FAQ heading style uses Open Sans SemiBold 28/36 to satisfy two-line mobile title.

