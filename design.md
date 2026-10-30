# Yokogawa — Style Reference
> Industrial blue and signal yellow over cool, light surfaces

**Theme:** light

The Yokogawa variables center on a deep corporate blue, a bright yellow accent, and cool neutral surfaces. Semantic color roles sit in a separate `Color System` collection: some map to local Yokogawa colors, while others alias a published TDS library. Open Sans is the primary font across all Figma text styles and the global `Essential` font token.

Variable values and aliases below are exported from Figma. Roles and recommendations are interpreted from variable names and descriptions. Figma's Desktop and Mobile modes are kept distinct. No layout or component measurements are inferred where the variable collections do not define them.

## Tokens — Colors

### Yokogawa palette

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blue | `#00478C` | `yg-blue` · `var(--yg-blue)` | Brand primary; use for primary actions and key highlights. |
| Blue Action | `#004F9B` | `yg-blue-action` · `var(--yg-blue-action)` | Action blue; the palette's brighter focus and interaction shade. |
| Blue Deep | `#00376D` | `yg-blue-deep` · `var(--yg-blue-deep)` | Deeper brand blue; the palette's pressed and high-contrast shade. |
| Blue Soft | `#E8F1F8` | `yg-blue-soft` · `var(--yg-blue-soft)` | Soft blue surface for low-emphasis brand areas. |
| Border | `#CCCCCC` | `yg-border` · `var(--yg-border)` | Default border color. |
| Canvas | `#F6F6F7` | `yg-canvas` · `var(--yg-canvas)` | Cool light page canvas. |
| Error | `#B42318` | `yg-error` · `var(--yg-error)` | Error status. |
| Info | `#1A61A5` | `yg-info` · `var(--yg-info)` | Informational status. |
| Ink | `#222222` | `yg-ink` · `var(--yg-ink)` | Primary dark text and icon color. |
| Muted | `#666666` | `yg-muted` · `var(--yg-muted)` | Muted text and supporting labels. |
| Success | `#1F7A4D` | `yg-success` · `var(--yg-success)` | Success status. |
| Surface | `#FFFFFF` | `yg-surface` · `var(--yg-surface)` | White surface. |
| Warning | `#B56A00` | `yg-warning` · `var(--yg-warning)` | Warning status. |
| Yellow | `#F9E300` | `yg-yellow` · `var(--yg-yellow)` | Secondary brand accent. |

### Semantic color aliases

The source collection mixes local brand aliases with published TDS aliases. External aliases are preserved as references; their values depend on the TDS library mode.

| Name | Alias target | Token | Role | Source note |
|------|--------------|-------|------|-------------|
| `background/disabled` | TDS Color System V.2/Tokenization/background/disabled (external ID: VariableID:e5a65c40c346453ce01b8be52f8e3828ad091115/1221:24) | `Color System/background/disabled` | Disabled background | Source: TDS - Color System V.2 / Tokenization / background/disabled. Direct alias to the published TDS color. |
| `background/inverse` | TDS Color System V.2/Tokenization/background/inverse (external ID: VariableID:7738d7852e3e8aad70a4c8954625984bcac48d51/1221:42) | `Color System/background/inverse` | Inverse background | Source: TDS - Color System V.2 / Tokenization / background/inverse. Direct alias to the published TDS color. |
| `background/muted` | TDS Color System V.2/Tokenization/background/muted (external ID: VariableID:d007b196194fcf5926dc21ae118e687ea716c484/1221:12) | `Color System/background/muted` | Muted background | Source: TDS - Color System V.2 / Tokenization / background/muted. Direct alias to the published TDS color. |
| `background/primary` | TDS Color System V.2/Tokenization/background/primary (external ID: VariableID:19983984e91cd2acccb11f2890e5cb44d9419711/1221:40) | `Color System/background/primary` | Primary background | Source: TDS - Color System V.2 / Tokenization / background/primary. Direct alias to the published TDS color. |
| `background/secondary` | TDS Color System V.2/Tokenization/background/secondary (external ID: VariableID:f155c7c7d5d715962312fe5abfe87f9e7af36f3e/1221:29) | `Color System/background/secondary` | Secondary background | Source: TDS - Color System V.2 / Tokenization / background/secondary. Direct alias to the published TDS color. |
| `background/tertiary` | TDS Color System V.2/Tokenization/background/tertiary (external ID: VariableID:e74f08bbd096b269b351f931d1506da4e0ec81b7/1221:41) | `Color System/background/tertiary` | Tertiary background | Source: TDS - Color System V.2 / Tokenization / background/tertiary. Direct alias to the published TDS color. |
| `border/disabled` | TDS Color System V.2/Tokenization/border/disabled (external ID: VariableID:431e9e6d6e78b26e0db6bcca105fc97ed56e8cf3/1221:56) | `Color System/border/disabled` | Disabled border | Source: TDS - Color System V.2 / Tokenization / border/disabled. Direct alias to the published TDS color. |
| `border/inverse` | TDS Color System V.2/Tokenization/border/inverse (external ID: VariableID:7fe6668eed5ea38658a95ef2ed8fce125bc19756/1221:11) | `Color System/border/inverse` | Inverse border | Source: TDS - Color System V.2 / Tokenization / border/inverse. Direct alias to the published TDS color. |
| `border/primary` | TDS Color System V.2/Tokenization/border/primary (external ID: VariableID:43a39cc29bf16de955d6d2c1f81dc3a0ed4c1a41/1221:48) | `Color System/border/primary` | Primary border | Source: TDS - Color System V.2 / Tokenization / border/primary. Direct alias to the published TDS color. |
| `border/secondary` | TDS Color System V.2/Tokenization/border/secondary (external ID: VariableID:1fa6087cac883ce96132c6b9595cc28b2a8703f0/1221:44) | `Color System/border/secondary` | Secondary border | Source: TDS - Color System V.2 / Tokenization / border/secondary. Direct alias to the published TDS color. |
| `border/strong` | TDS Color System V.2/Tokenization/border/strong (external ID: VariableID:0dd6e9d0c65ea5504a73e6d355300ecdf5e25c09/1221:0) | `Color System/border/strong` | Strong border | Source: TDS - Color System V.2 / Tokenization / border/strong. Direct alias to the published TDS color. |
| `border/subtle` | TDS Color System V.2/Tokenization/border/subtle (external ID: VariableID:ed3febfc266542310f675b37709225fbc1636b9d/1221:20) | `Color System/border/subtle` | Subtle border | Source: TDS - Color System V.2 / Tokenization / border/subtle. Direct alias to the published TDS color. |
| `primary/border` | `Yokogawa Colors/yg-blue` | `Color System/primary/border` | Primary action border | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue. |
| `primary/content` | `Yokogawa Colors/yg-surface` | `Color System/primary/content` | Content on primary surface | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-surface. |
| `primary/focus` | `Yokogawa Colors/yg-blue-action` | `Color System/primary/focus` | Primary focus | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue-action. |
| `primary/hover` | `Yokogawa Colors/yg-blue-deep` | `Color System/primary/hover` | Primary hover | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue-deep. |
| `primary/main` | `Yokogawa Colors/yg-blue` | `Color System/primary/main` | Primary brand fill | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue. |
| `primary/pressed` | `Yokogawa Colors/yg-blue-deep` | `Color System/primary/pressed` | Primary pressed | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue-deep. |
| `primary/surface` | `Yokogawa Colors/yg-blue-soft` | `Color System/primary/surface` | Primary tinted surface | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue-soft. |
| `secondary/border` | `Yokogawa Colors/yg-yellow` | `Color System/secondary/border` | Secondary accent border | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-yellow. |
| `secondary/content` | `Yokogawa Colors/yg-blue-deep` | `Color System/secondary/content` | Content on secondary surface | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-ink. |
| `secondary/focus` | `Yokogawa Colors/yg-yellow` | `Color System/secondary/focus` | Secondary focus | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-yellow. Secondary accent only; use a contrasting primary focus ring for visible keyboard focus. |
| `secondary/main` | `Yokogawa Colors/yg-yellow` | `Color System/secondary/main` | Secondary brand fill | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-yellow. |
| `text/disabled` | TDS Color System V.2/Tokenization/text/disabled (external ID: VariableID:a238b548e789e1e632e871e3dea34e00c9816830/1221:4) | `Color System/text/disabled` | Disabled text | Source: TDS - Color System V.2 / Tokenization / text/disabled. Direct alias to the published TDS text color. |
| `text/helper` | TDS Color System V.2/Tokenization/text/helper (external ID: VariableID:0aab0eb16d71bde3114c7b5975e9011a253ffa6d/1221:17) | `Color System/text/helper` | Helper text | Source: TDS - Color System V.2 / Tokenization / text/helper. Direct alias to the published TDS text color. |
| `text/inverse` | TDS Color System V.2/Tokenization/text/inverse (external ID: VariableID:6e0c792cb167fe6dc9d8e5999fc7f8ee74a8df1e/1221:23) | `Color System/text/inverse` | Inverse text | Source: TDS - Color System V.2 / Tokenization / text/inverse. Direct alias to the published TDS text color. |
| `text/on-disabled` | TDS Color System V.2/Tokenization/text/on-disabled (external ID: VariableID:64c28cb2e0cdddfa9a308282e92b77618ac351e5/1221:3) | `Color System/text/on-disabled` | Text on disabled surfaces | Source: TDS - Color System V.2 / Tokenization / text/on-disabled. Direct alias to the published TDS text color. |
| `text/on-primary` | TDS Color System V.2/Tokenization/text/on-primary (external ID: VariableID:09c21be6d50be4dd1027727b2bdd3479a9894d54/1221:34) | `Color System/text/on-primary` | Text on primary surfaces | Source: TDS - Color System V.2 / Tokenization / text/on-primary. Direct alias to the published TDS text color. |
| `text/placeholder` | TDS Color System V.2/Tokenization/text/placeholder (external ID: VariableID:2466fa4175d3c39326bed7f630edd363ccaa65d5/1221:37) | `Color System/text/placeholder` | Placeholder text | Source: TDS - Color System V.2 / Tokenization / text/placeholder. Direct alias to the published TDS text color. |
| `text/primary` | TDS Color System V.2/Tokenization/text/primary (external ID: VariableID:9ea9b29721fde79ec563fd63026e9ae8001c9492/1221:36) | `Color System/text/primary` | Primary text | Source: TDS - Color System V.2 / Tokenization / text/primary. Direct alias to the published TDS text color. |
| `text/secondary` | TDS Color System V.2/Tokenization/text/secondary (external ID: VariableID:c59969f43326bef8c7e685e456a03d7815996d3a/1221:30) | `Color System/text/secondary` | Secondary text | Source: TDS - Color System V.2 / Tokenization / text/secondary. Direct alias to the published TDS text color. |
| `text/tertiary` | TDS Color System V.2/Tokenization/text/tertiary (external ID: VariableID:b001c8aa0f1d45e1c9c93e84db45f5bb50069586/1221:26) | `Color System/text/tertiary` | Tertiary text | Source: TDS - Color System V.2 / Tokenization / text/tertiary. Direct alias to the published TDS text color. |

## Tokens — Typography

**Primary font:** Open Sans

All 66 local Figma text styles use Open Sans. The style hierarchy is grouped as `hero-title`, `header-web`, `header-mobile`, `paragraph`, `label`, and `button`. Text styles bind to the Figma Typography variables where available, so the Desktop/Mobile values below follow the collection modes.

### Font variants

| Figma variant | Weight/style | CSS weight |
|---------------|--------------|------------|
| `default` | Regular | 400 |
| `italic` | Italic | 400 italic |
| `semibold` | SemiBold | 600 |
| `bold` | Bold | 700 |

### Hero title

| Style | Size / line height | Weight | Letter spacing |
|-------|--------------------|--------|----------------|
| `hero-title/t1` | 132px / 156px | Regular (400) | -2% |
| `hero-title/t2` | 124px / 148px | Regular (400) | -2% |
| `hero-title/t3` | 112px / 132px | Regular (400) | -1.5% |
| `hero-title/t4` | 100px / 120px | Regular (400) | -1.5% |

Hero title sizes are static text-style values in Figma; this group has no separate Mobile-mode binding.

### Header styles

| Style | Desktop size / line height | Mobile size / line height | Weight | Letter spacing |
|-------|---------------------------|--------------------------|--------|----------------|
| `header-web/h1` | 80px / 96px | 40px / 48px | SemiBold (600) | -2% |
| `header-web/h2` | 56px / 64px | 36px / 44px | SemiBold (600) | -2% |
| `header-web/h3` | 40px / 48px | 28px / 36px | SemiBold (600) | -2% |
| `header-web/h4` | 36px / 44px | 24px / 32px | SemiBold (600) | -1.5% |
| `header-mobile/h1` | 80px / 96px | 40px / 48px | SemiBold (600) | +2% |
| `header-mobile/h2` | 56px / 64px | 36px / 44px | Regular (400) | -2% |
| `header-mobile/h3` | 40px / 48px | 28px / 36px | Regular (400) | -2% |
| `header-mobile/h4` | 36px / 44px | 24px / 32px | Regular (400) | -1.5% |

### Paragraph, label, and button scales

| Group | Desktop size / line height | Mobile size / line height | Variants | Letter spacing | Paragraph spacing |
|-------|---------------------------|--------------------------|----------|----------------|-------------------|
| `paragraph-xl` | 32px / 40px | 20px / 28px | Regular, Italic, SemiBold, Bold | 0% | 0px |
| `paragraph-lg` | 24px / 36px | 18px / 26px | Regular, Italic, SemiBold, Bold | 0% | 0px |
| `paragraph-md` | 20px / 28px | 16px / 24px | Regular, Italic, SemiBold, Bold | 0% | 20px |
| `paragraph-sm` | 18px / 26px | 14px / 20px | Regular, Italic, SemiBold, Bold | 0% | 0px |
| `paragraph-xs` | 16px / 24px | 12px / 16px | Regular, Italic, SemiBold, Bold | +2% | 0px |
| `paragraph-xxs` | 14px / 20px | 10px / 14px | Regular, Italic, SemiBold, Bold | +2% | 0px |
| `label-xl` | 32px / 40px | 20px / 28px | Regular, Italic, SemiBold, Bold | 0% | 0px |
| `label-lg` | 24px / 36px | 18px / 26px | Regular, Italic, SemiBold, Bold | 0% | 0px |
| `label-md` | 20px / 28px | 16px / 24px | Regular, Italic, SemiBold, Bold | 0% | 0px |
| `label-sm` | 18px / 26px | 14px / 20px | Regular, Italic, SemiBold, Bold | 0% | 0px |
| `label-xs` | 16px / 24px | 12px / 16px | Regular, Italic, SemiBold, Bold | +2% | 0px |
| `label-xxs` | 14px / 20px | 10px / 14px | Regular, Italic, SemiBold, Bold | +2% | 0px |
| `button-lg` | 24px / 36px | 18px / 26px | Regular, SemiBold, Bold | 0% | 0px |
| `button-md` | 20px / 28px | 16px / 24px | Regular, SemiBold, Bold | 0% | 0px |

Figma stores text-style letter spacing as percentages. The smaller `paragraph-xs`/`xxs` and `label-xs`/`xxs` groups use `+2%` tracking. `paragraph-md` has 20px paragraph spacing; other groups use 0px.

### Typography variable links

Figma text styles reference the `Typography` variable collection for family, weight, size, and line-height values. The global `Essential/Font Family/font-family` token is also set to Open Sans.

## Desktop Font Scaling (Figma 1920 × 1080 baseline)

**Reference:** SCALING v3.3 · `SOURCE_FRAME = 1920px` · `TARGET_FRAME = 1440px` · `MAX_FRAME = 2560px` · `BASE_REM_PX = 16` · `FONT_FLOOR_PX = 15`.

Figma typography values are authored at 1920 × 1080, so the Desktop size is the 1× reference. For viewports from 1440px to 2560px, use one fluid `clamp()` per Figma font size: it reaches the 1920px Figma value at the baseline, scales down to the 1440px floor, and caps at the 2560px ceiling. The fluid term uses viewport width, following the scaling reference.

| Figma size at 1920px | Figma text styles | Min at 1440px | Fluid term | Max at 2560px | Desktop CSS |
|----------------------|-------------------|---------------|------------|---------------|-------------|
| 132px | `hero-title/t1` | 99px / `6.1875rem` | `6.875vw` | 176px / `11rem` | `clamp(6.1875rem, 6.875vw, 11rem)` |
| 124px | `hero-title/t2` | 93px / `5.8125rem` | `6.4583vw` | 165.33px / `10.3333rem` | `clamp(5.8125rem, 6.4583vw, 10.3333rem)` |
| 112px | `hero-title/t3` | 84px / `5.25rem` | `5.8333vw` | 149.33px / `9.3333rem` | `clamp(5.25rem, 5.8333vw, 9.3333rem)` |
| 100px | `hero-title/t4` | 75px / `4.6875rem` | `5.2083vw` | 133.33px / `8.3333rem` | `clamp(4.6875rem, 5.2083vw, 8.3333rem)` |
| 80px | `header-web/h1`, `header-mobile/h1` | 60px / `3.75rem` | `4.1667vw` | 106.67px / `6.6667rem` | `clamp(3.75rem, 4.1667vw, 6.6667rem)` |
| 56px | `header-web/h2`, `header-mobile/h2` | 42px / `2.625rem` | `2.9167vw` | 74.67px / `4.6667rem` | `clamp(2.625rem, 2.9167vw, 4.6667rem)` |
| 40px | `header-web/h3`, `header-mobile/h3` | 30px / `1.875rem` | `2.0833vw` | 53.33px / `3.3333rem` | `clamp(1.875rem, 2.0833vw, 3.3333rem)` |
| 36px | `header-web/h4`, `header-mobile/h4` | 27px / `1.6875rem` | `1.875vw` | 48px / `3rem` | `clamp(1.6875rem, 1.875vw, 3rem)` |
| 32px | `paragraph-xl/*`, `label-xl/*` | 24px / `1.5rem` | `1.6667vw` | 42.67px / `2.6667rem` | `clamp(1.5rem, 1.6667vw, 2.6667rem)` |
| 24px | `paragraph-lg/*`, `label-lg/*`, `button-lg/*` | 18px / `1.125rem` | `1.25vw` | 32px / `2rem` | `clamp(1.125rem, 1.25vw, 2rem)` |
| 20px | `paragraph-md/*`, `label-md/*`, `button-md/*` | 15px / `0.9375rem` | `1.0417vw` | 26.67px / `1.6667rem` | `clamp(0.9375rem, 1.0417vw, 1.6667rem)` |
| 18px | `paragraph-sm/*`, `label-sm/*` | 15px / `0.9375rem` | `0.9375vw` | 24px / `1.5rem` | `clamp(0.9375rem, 0.9375vw, 1.5rem)` |
| 16px | `paragraph-xs/*`, `label-xs/*` | 15px / `0.9375rem` | `0.8333vw` | 21.33px / `1.3333rem` | `clamp(0.9375rem, 0.8333vw, 1.3333rem)` |
| 14px | `paragraph-xxs/*`, `label-xxs/*` | 15px / `0.9375rem` | `0.7292vw` | 18.67px / `1.1667rem` | `clamp(0.9375rem, 0.7292vw, 1.1667rem)` |

### CSS tokens and usage

Define these properties with a 100% root font size. The root must remain at the browser default so user zoom and accessibility settings continue to work.

```css
html { font-size: 100%; }

:root {
  --font-size-hero-t1: clamp(6.1875rem, 6.875vw, 11rem);
  --font-size-hero-t2: clamp(5.8125rem, 6.4583vw, 10.3333rem);
  --font-size-hero-t3: clamp(5.25rem, 5.8333vw, 9.3333rem);
  --font-size-hero-t4: clamp(4.6875rem, 5.2083vw, 8.3333rem);
  --font-size-h1: clamp(3.75rem, 4.1667vw, 6.6667rem);
  --font-size-h2: clamp(2.625rem, 2.9167vw, 4.6667rem);
  --font-size-h3: clamp(1.875rem, 2.0833vw, 3.3333rem);
  --font-size-h4: clamp(1.6875rem, 1.875vw, 3rem);
  --font-size-xl: clamp(1.5rem, 1.6667vw, 2.6667rem);
  --font-size-lg: clamp(1.125rem, 1.25vw, 2rem);
  --font-size-md: clamp(0.9375rem, 1.0417vw, 1.6667rem);
  --font-size-sm: clamp(0.9375rem, 0.9375vw, 1.5rem);
  --font-size-xs: clamp(0.9375rem, 0.8333vw, 1.3333rem);
  --font-size-xxs: clamp(0.9375rem, 0.7292vw, 1.1667rem);
}

/* Example: header-web/h1 = 80px / 96px in Figma Desktop */
.header-web-h1 {
  font-size: var(--font-size-h1);
  line-height: 1.2; /* 96 / 80: unitless line-height scales with the font */
  letter-spacing: -0.02em; /* Figma -2% */
}
```

### Line height, tracking, and breakpoints

- Convert each Figma Desktop line-height pair to a unitless multiplier (`line-height ÷ font-size`), such as `96 ÷ 80 = 1.2` for `header-web/h1`. Unitless line-height scales with the fluid font size. Keep a separate ratio for the Mobile mode.
- Convert Figma letter spacing from percent to `em`: `-2%` becomes `-0.02em`; `+2%` becomes `0.02em`. Relative tracking scales with the font size and does not need its own `clamp()`.
- Apply fluid Desktop typography at viewport widths `>= 1025px`. At `<= 1024px`, use the Figma Mobile typography mode and its responsive layout overrides. At `<= 768px`, large hero titles need a mobile-specific clamp because `hero-title` has no Mobile-mode binding; the reference's starting pattern is `clamp(1.85rem, 7vw, 2.6rem)`.
- Keep `html { font-size: 100%; }`; do not set the root to `75%`, which would apply the scale twice.

### Font-floor exception in the Figma scale

The Figma Desktop scale includes 14px `paragraph-xxs` and `label-xxs`, while the scaling reference sets an absolute 15px font floor. Following that rule, `--font-size-xxs` resolves to 15px even at the 1920px baseline, so these two styles are intentionally 1px larger than their Figma source value. The Mobile mode still contains 12px and 10px XS/XXS styles; this desktop rule does not change those mobile values.

## Tokens — Spacing & Shapes

**Base unit:** 4px (`Spacing/1`)

**Spacing/rem:** 1 (raw Figma value; no unit is attached)

### Spacing scale

| Name | Value | Token |
|------|-------|-------|
| 0 | 0px | `Essential/Spacing/0` |
| 0․5 | 2px | `Essential/Spacing/0․5` |
| 1 | 4px | `Essential/Spacing/1` |
| 1․5 | 6px | `Essential/Spacing/1․5` |
| 2 | 8px | `Essential/Spacing/2` |
| 2․5 | 10px | `Essential/Spacing/2․5` |
| 3 | 12px | `Essential/Spacing/3` |
| 3․5 | 14px | `Essential/Spacing/3․5` |
| 4 | 16px | `Essential/Spacing/4` |
| 5 | 20px | `Essential/Spacing/5` |
| 6 | 24px | `Essential/Spacing/6` |
| 7 | 28px | `Essential/Spacing/7` |
| 8 | 32px | `Essential/Spacing/8` |
| 9 | 36px | `Essential/Spacing/9` |
| 10 | 40px | `Essential/Spacing/10` |
| 11 | 44px | `Essential/Spacing/11` |
| 12 | 48px | `Essential/Spacing/12` |
| 14 | 56px | `Essential/Spacing/14` |
| 16 | 64px | `Essential/Spacing/16` |
| 20 | 80px | `Essential/Spacing/20` |
| 24 | 96px | `Essential/Spacing/24` |
| 28 | 112px | `Essential/Spacing/28` |
| 32 | 128px | `Essential/Spacing/32` |
| 36 | 144px | `Essential/Spacing/36` |
| 40 | 160px | `Essential/Spacing/40` |
| 44 | 176px | `Essential/Spacing/44` |
| 48 | 192px | `Essential/Spacing/48` |
| 52 | 208px | `Essential/Spacing/52` |
| 56 | 224px | `Essential/Spacing/56` |
| 60 | 240px | `Essential/Spacing/60` |
| 64 | 256px | `Essential/Spacing/64` |
| 72 | 288px | `Essential/Spacing/72` |
| 80 | 320px | `Essential/Spacing/80` |
| 96 | 384px | `Essential/Spacing/96` |

### Border radius

| Element token | Value |
|---------------|-------|
| `rounded-none` | 0px |
| `rounded-sm` | 2px |
| `rounded` | 4px |
| `rounded-md` | 6px |
| `rounded-lg` | 8px |
| `rounded-xl` | 12px |
| `rounded-2xl` | 16px |
| `rounded-3xl` | 24px |
| `rounded-full` | 9999px |

## Surfaces

| Name | Value | Token | Purpose |
|------|-------|-------|---------|
| canvas | `#F6F6F7` | `Yokogawa Colors/yg-canvas` | Cool light page canvas. |
| surface | `#FFFFFF` | `Yokogawa Colors/yg-surface` | White surface. |
| blue soft | `#E8F1F8` | `Yokogawa Colors/yg-blue-soft` | Soft blue surface for low-emphasis brand areas. |

## Elevation

No elevation or shadow variables are defined in the exported collections. Shadow behavior is unspecified by this variable export.

## Layout

The variable set provides a spacing scale and border radii. It does not define container widths, breakpoints, grid columns, or component dimensions.

## Do's and Don'ts

### Do
- Use the `Desktop` and `Mobile` typography modes for their intended screen sizes.
- Scale Desktop text with the 1920px-based `clamp()` values below; use the 15px desktop font floor and the 2560px ceiling.
- Prefer semantic `Color System` aliases when applying text, border, background, and action roles.
- Use the 4px base spacing token and the named radius scale instead of introducing undocumented values.
- Keep the `Yokogawa Colors` web code syntax when generating CSS for the brand palette.

### Don't
- Don't replace a published TDS alias with a guessed hex value; the alias target is external to this file.
- Don't substitute other typefaces for Open Sans or collapse the separate text-style groups into one scale.
- Don't infer component dimensions, breakpoints, or shadow rules from the variable collections.
- Don't scale unitless line-height or `em` tracking separately from the font size.

## Agent Prompt Guide

**Quick Color Reference**
- `Yokogawa Colors/yg-blue`: #00478C
- `Yokogawa Colors/yg-blue-deep`: #00376D
- `Yokogawa Colors/yg-yellow`: #F9E300
- `Yokogawa Colors/yg-ink`: #222222
- `Yokogawa Colors/yg-muted`: #666666
- `Yokogawa Colors/yg-border`: #CCCCCC
- `Yokogawa Colors/yg-canvas`: #F6F6F7
- `Yokogawa Colors/yg-surface`: #FFFFFF

**Starter prompts**

1. Create a responsive Yokogawa page using `Yokogawa Colors/yg-canvas` for the canvas and `Color System/primary/main` for the primary brand fill. Use the typography variables' Desktop and Mobile modes and preserve the semantic aliases.
2. Create a primary action using `Color System/primary/main` and `Color System/primary/content`; use `Essential/Border Radius/rounded` and `Essential/Spacing/4` for its radius and horizontal padding.
3. Create status indicators from `Yokogawa Colors/yg-success`, `yg-warning`, `yg-error`, and `yg-info`, with supporting labels styled from the Typography collection.

## Typographic Voice

Open Sans is the primary typeface throughout the 66 Figma text styles. Hero titles use Regular from 100–132px; web headers use SemiBold; mobile headers preserve a separate style family; paragraph, label, and button groups share responsive size steps with Regular, Italic, SemiBold, and Bold variants where defined.

## Quick Start

### CSS Custom Properties

The following properties include the project-selected primary font and exact Figma `WEB` code syntax from `Yokogawa Colors`.
```css
:root {
  --font-family-primary: 'Open Sans', sans-serif;
  --yg-blue: #00478C;
  --yg-blue-action: #004F9B;
  --yg-blue-deep: #00376D;
  --yg-blue-soft: #E8F1F8;
  --yg-border: #CCCCCC;
  --yg-canvas: #F6F6F7;
  --yg-error: #B42318;
  --yg-info: #1A61A5;
  --yg-ink: #222222;
  --yg-muted: #666666;
  --yg-success: #1F7A4D;
  --yg-surface: #FFFFFF;
  --yg-warning: #B56A00;
  --yg-yellow: #F9E300;
}
```

## Variable Export

Raw values, modes, scopes, code syntax, descriptions, and publishing visibility from all local variable collections follow.

### Essential

**Modes:** `Value`

| Variable | Type | Values by mode | Scopes | Web syntax | Description | Hidden from publishing |
|----------|------|-----------------|--------|------------|-------------|-------------------------|
| `Essential/Border Radius/rounded` | FLOAT | `Value`: 4 | TEXT_CONTENT, CORNER_RADIUS | — | — | Yes |
| `Essential/Border Radius/rounded-2xl` | FLOAT | `Value`: 16 | TEXT_CONTENT, CORNER_RADIUS | — | — | Yes |
| `Essential/Border Radius/rounded-3xl` | FLOAT | `Value`: 24 | TEXT_CONTENT, CORNER_RADIUS | — | — | Yes |
| `Essential/Border Radius/rounded-full` | FLOAT | `Value`: 9999 | TEXT_CONTENT, CORNER_RADIUS | — | — | Yes |
| `Essential/Border Radius/rounded-lg` | FLOAT | `Value`: 8 | TEXT_CONTENT, CORNER_RADIUS | — | — | Yes |
| `Essential/Border Radius/rounded-md` | FLOAT | `Value`: 6 | TEXT_CONTENT, CORNER_RADIUS | — | — | Yes |
| `Essential/Border Radius/rounded-none` | FLOAT | `Value`: 0 | TEXT_CONTENT, CORNER_RADIUS | — | — | Yes |
| `Essential/Border Radius/rounded-sm` | FLOAT | `Value`: 2 | TEXT_CONTENT, CORNER_RADIUS | — | — | Yes |
| `Essential/Border Radius/rounded-xl` | FLOAT | `Value`: 12 | TEXT_CONTENT, CORNER_RADIUS | — | — | Yes |
| `Essential/Font Family/font-family` | STRING | `Value`: Open Sans | ALL_SCOPES | — | — | No |
| `Essential/Spacing/0` | FLOAT | `Value`: 0 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/0․5` | FLOAT | `Value`: 2 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/1` | FLOAT | `Value`: 4 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/1․5` | FLOAT | `Value`: 6 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/10` | FLOAT | `Value`: 40 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/11` | FLOAT | `Value`: 44 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/12` | FLOAT | `Value`: 48 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/14` | FLOAT | `Value`: 56 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/16` | FLOAT | `Value`: 64 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/2` | FLOAT | `Value`: 8 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/2․5` | FLOAT | `Value`: 10 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/20` | FLOAT | `Value`: 80 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/24` | FLOAT | `Value`: 96 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/28` | FLOAT | `Value`: 112 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/3` | FLOAT | `Value`: 12 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/3․5` | FLOAT | `Value`: 14 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/32` | FLOAT | `Value`: 128 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/36` | FLOAT | `Value`: 144 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/4` | FLOAT | `Value`: 16 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/40` | FLOAT | `Value`: 160 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/44` | FLOAT | `Value`: 176 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/48` | FLOAT | `Value`: 192 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/5` | FLOAT | `Value`: 20 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/52` | FLOAT | `Value`: 208 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/56` | FLOAT | `Value`: 224 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/6` | FLOAT | `Value`: 24 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/60` | FLOAT | `Value`: 240 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/64` | FLOAT | `Value`: 256 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/7` | FLOAT | `Value`: 28 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/72` | FLOAT | `Value`: 288 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/8` | FLOAT | `Value`: 32 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/80` | FLOAT | `Value`: 320 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/9` | FLOAT | `Value`: 36 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/96` | FLOAT | `Value`: 384 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |
| `Essential/Spacing/rem` | FLOAT | `Value`: 1 | TEXT_CONTENT, WIDTH_HEIGHT, GAP | — | — | Yes |

### Typography

**Modes:** `Desktop`, `Mobile`

| Variable | Type | Values by mode | Scopes | Web syntax | Description | Hidden from publishing |
|----------|------|-----------------|--------|------------|-------------|-------------------------|
| `Typography/Font/Font Family/Body` | STRING | `Desktop`: Open Sans<br>`Mobile`: Open Sans | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Family/Title` | STRING | `Desktop`: Open Sans<br>`Mobile`: Open Sans | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Size/H1` | FLOAT | `Desktop`: 80<br>`Mobile`: 40 | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Size/H2` | FLOAT | `Desktop`: 56<br>`Mobile`: 36 | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Size/H3` | FLOAT | `Desktop`: 40<br>`Mobile`: 28 | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Size/H4` | FLOAT | `Desktop`: 36<br>`Mobile`: 24 | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Size/lg` | FLOAT | `Desktop`: 24<br>`Mobile`: 18 | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Size/md` | FLOAT | `Desktop`: 20<br>`Mobile`: 16 | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Size/sm` | FLOAT | `Desktop`: 18<br>`Mobile`: 14 | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Size/xl` | FLOAT | `Desktop`: 32<br>`Mobile`: 20 | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Size/xs` | FLOAT | `Desktop`: 16<br>`Mobile`: 12 | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Size/xxs` | FLOAT | `Desktop`: 14<br>`Mobile`: 10 | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Weight/Bold` | STRING | `Desktop`: Bold<br>`Mobile`: Bold | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Weight/Italic` | STRING | `Desktop`: Italic<br>`Mobile`: Italic | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Weight/Regular` | STRING | `Desktop`: Regular<br>`Mobile`: Regular | ALL_SCOPES | — | — | No |
| `Typography/Font/Font Weight/Semibold` | STRING | `Desktop`: SemiBold<br>`Mobile`: SemiBold | ALL_SCOPES | — | — | No |
| `Typography/Font/Line Height/H1` | FLOAT | `Desktop`: 96<br>`Mobile`: 48 | ALL_SCOPES | — | — | No |
| `Typography/Font/Line Height/H2` | FLOAT | `Desktop`: 64<br>`Mobile`: 44 | ALL_SCOPES | — | — | No |
| `Typography/Font/Line Height/H3` | FLOAT | `Desktop`: 48<br>`Mobile`: 36 | ALL_SCOPES | — | — | No |
| `Typography/Font/Line Height/H4` | FLOAT | `Desktop`: 44<br>`Mobile`: 32 | ALL_SCOPES | — | — | No |
| `Typography/Font/Line Height/lg` | FLOAT | `Desktop`: 36<br>`Mobile`: 26 | ALL_SCOPES | — | — | No |
| `Typography/Font/Line Height/md` | FLOAT | `Desktop`: 28<br>`Mobile`: 24 | ALL_SCOPES | — | — | No |
| `Typography/Font/Line Height/sm` | FLOAT | `Desktop`: 26<br>`Mobile`: 20 | ALL_SCOPES | — | — | No |
| `Typography/Font/Line Height/xl` | FLOAT | `Desktop`: 40<br>`Mobile`: 28 | ALL_SCOPES | — | — | No |
| `Typography/Font/Line Height/xs` | FLOAT | `Desktop`: 24<br>`Mobile`: 16 | ALL_SCOPES | — | — | No |
| `Typography/Font/Line Height/xxs` | FLOAT | `Desktop`: 20<br>`Mobile`: 14 | ALL_SCOPES | — | — | No |

### Yokogawa Colors

**Modes:** `Default`

| Variable | Type | Values by mode | Scopes | Web syntax | Description | Hidden from publishing |
|----------|------|-----------------|--------|------------|-------------|-------------------------|
| `Yokogawa Colors/yg-blue` | COLOR | `Default`: #00478C | ALL_SCOPES | `var(--yg-blue)` | — | No |
| `Yokogawa Colors/yg-blue-action` | COLOR | `Default`: #004F9B | ALL_SCOPES | `var(--yg-blue-action)` | — | No |
| `Yokogawa Colors/yg-blue-deep` | COLOR | `Default`: #00376D | ALL_SCOPES | `var(--yg-blue-deep)` | — | No |
| `Yokogawa Colors/yg-blue-soft` | COLOR | `Default`: #E8F1F8 | ALL_SCOPES | `var(--yg-blue-soft)` | — | No |
| `Yokogawa Colors/yg-border` | COLOR | `Default`: #CCCCCC | ALL_SCOPES | `var(--yg-border)` | — | No |
| `Yokogawa Colors/yg-canvas` | COLOR | `Default`: #F6F6F7 | ALL_SCOPES | `var(--yg-canvas)` | — | No |
| `Yokogawa Colors/yg-error` | COLOR | `Default`: #B42318 | ALL_SCOPES | `var(--yg-error)` | — | No |
| `Yokogawa Colors/yg-info` | COLOR | `Default`: #1A61A5 | ALL_SCOPES | `var(--yg-info)` | — | No |
| `Yokogawa Colors/yg-ink` | COLOR | `Default`: #222222 | ALL_SCOPES | `var(--yg-ink)` | — | No |
| `Yokogawa Colors/yg-muted` | COLOR | `Default`: #666666 | ALL_SCOPES | `var(--yg-muted)` | — | No |
| `Yokogawa Colors/yg-success` | COLOR | `Default`: #1F7A4D | ALL_SCOPES | `var(--yg-success)` | — | No |
| `Yokogawa Colors/yg-surface` | COLOR | `Default`: #FFFFFF | ALL_SCOPES | `var(--yg-surface)` | — | No |
| `Yokogawa Colors/yg-warning` | COLOR | `Default`: #B56A00 | ALL_SCOPES | `var(--yg-warning)` | — | No |
| `Yokogawa Colors/yg-yellow` | COLOR | `Default`: #F9E300 | ALL_SCOPES | `var(--yg-yellow)` | — | No |

### Color System

**Modes:** `Default`

| Variable | Type | Values by mode | Scopes | Web syntax | Description | Hidden from publishing |
|----------|------|-----------------|--------|------------|-------------|-------------------------|
| `Color System/background/disabled` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/background/disabled (external ID: VariableID:e5a65c40c346453ce01b8be52f8e3828ad091115/1221:24) | ALL_FILLS | — | Source: TDS - Color System V.2 / Tokenization / background/disabled. Direct alias to the published TDS color. | No |
| `Color System/background/inverse` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/background/inverse (external ID: VariableID:7738d7852e3e8aad70a4c8954625984bcac48d51/1221:42) | ALL_FILLS | — | Source: TDS - Color System V.2 / Tokenization / background/inverse. Direct alias to the published TDS color. | No |
| `Color System/background/muted` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/background/muted (external ID: VariableID:d007b196194fcf5926dc21ae118e687ea716c484/1221:12) | ALL_FILLS | — | Source: TDS - Color System V.2 / Tokenization / background/muted. Direct alias to the published TDS color. | No |
| `Color System/background/primary` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/background/primary (external ID: VariableID:19983984e91cd2acccb11f2890e5cb44d9419711/1221:40) | ALL_FILLS | — | Source: TDS - Color System V.2 / Tokenization / background/primary. Direct alias to the published TDS color. | No |
| `Color System/background/secondary` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/background/secondary (external ID: VariableID:f155c7c7d5d715962312fe5abfe87f9e7af36f3e/1221:29) | ALL_FILLS | — | Source: TDS - Color System V.2 / Tokenization / background/secondary. Direct alias to the published TDS color. | No |
| `Color System/background/tertiary` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/background/tertiary (external ID: VariableID:e74f08bbd096b269b351f931d1506da4e0ec81b7/1221:41) | ALL_FILLS | — | Source: TDS - Color System V.2 / Tokenization / background/tertiary. Direct alias to the published TDS color. | No |
| `Color System/border/disabled` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/border/disabled (external ID: VariableID:431e9e6d6e78b26e0db6bcca105fc97ed56e8cf3/1221:56) | STROKE_COLOR | — | Source: TDS - Color System V.2 / Tokenization / border/disabled. Direct alias to the published TDS color. | No |
| `Color System/border/inverse` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/border/inverse (external ID: VariableID:7fe6668eed5ea38658a95ef2ed8fce125bc19756/1221:11) | STROKE_COLOR | — | Source: TDS - Color System V.2 / Tokenization / border/inverse. Direct alias to the published TDS color. | No |
| `Color System/border/primary` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/border/primary (external ID: VariableID:43a39cc29bf16de955d6d2c1f81dc3a0ed4c1a41/1221:48) | STROKE_COLOR | — | Source: TDS - Color System V.2 / Tokenization / border/primary. Direct alias to the published TDS color. | No |
| `Color System/border/secondary` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/border/secondary (external ID: VariableID:1fa6087cac883ce96132c6b9595cc28b2a8703f0/1221:44) | STROKE_COLOR | — | Source: TDS - Color System V.2 / Tokenization / border/secondary. Direct alias to the published TDS color. | No |
| `Color System/border/strong` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/border/strong (external ID: VariableID:0dd6e9d0c65ea5504a73e6d355300ecdf5e25c09/1221:0) | STROKE_COLOR | — | Source: TDS - Color System V.2 / Tokenization / border/strong. Direct alias to the published TDS color. | No |
| `Color System/border/subtle` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/border/subtle (external ID: VariableID:ed3febfc266542310f675b37709225fbc1636b9d/1221:20) | STROKE_COLOR | — | Source: TDS - Color System V.2 / Tokenization / border/subtle. Direct alias to the published TDS color. | No |
| `Color System/primary/border` | COLOR | `Default`: alias → Yokogawa Colors/yg-blue | STROKE_COLOR | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue. | No |
| `Color System/primary/content` | COLOR | `Default`: alias → Yokogawa Colors/yg-surface | TEXT_FILL | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-surface. | No |
| `Color System/primary/focus` | COLOR | `Default`: alias → Yokogawa Colors/yg-blue-action | ALL_FILLS | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue-action. | No |
| `Color System/primary/hover` | COLOR | `Default`: alias → Yokogawa Colors/yg-blue-deep | ALL_FILLS | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue-deep. | No |
| `Color System/primary/main` | COLOR | `Default`: alias → Yokogawa Colors/yg-blue | ALL_FILLS | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue. | No |
| `Color System/primary/pressed` | COLOR | `Default`: alias → Yokogawa Colors/yg-blue-deep | ALL_FILLS | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue-deep. | No |
| `Color System/primary/surface` | COLOR | `Default`: alias → Yokogawa Colors/yg-blue-soft | ALL_FILLS | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-blue-soft. | No |
| `Color System/secondary/border` | COLOR | `Default`: alias → Yokogawa Colors/yg-yellow | STROKE_COLOR | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-yellow. | No |
| `Color System/secondary/content` | COLOR | `Default`: alias → Yokogawa Colors/yg-blue-deep | TEXT_FILL | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-ink. | No |
| `Color System/secondary/focus` | COLOR | `Default`: alias → Yokogawa Colors/yg-yellow | ALL_FILLS | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-yellow. Secondary accent only; use a contrasting primary focus ring for visible keyboard focus. | No |
| `Color System/secondary/main` | COLOR | `Default`: alias → Yokogawa Colors/yg-yellow | ALL_FILLS | — | Semantic role adapted from TDS - Color System V.2. Source: Yokogawa Colors / yg-yellow. | No |
| `Color System/text/disabled` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/text/disabled (external ID: VariableID:a238b548e789e1e632e871e3dea34e00c9816830/1221:4) | TEXT_FILL | — | Source: TDS - Color System V.2 / Tokenization / text/disabled. Direct alias to the published TDS text color. | No |
| `Color System/text/helper` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/text/helper (external ID: VariableID:0aab0eb16d71bde3114c7b5975e9011a253ffa6d/1221:17) | TEXT_FILL | — | Source: TDS - Color System V.2 / Tokenization / text/helper. Direct alias to the published TDS text color. | No |
| `Color System/text/inverse` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/text/inverse (external ID: VariableID:6e0c792cb167fe6dc9d8e5999fc7f8ee74a8df1e/1221:23) | TEXT_FILL | — | Source: TDS - Color System V.2 / Tokenization / text/inverse. Direct alias to the published TDS text color. | No |
| `Color System/text/on-disabled` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/text/on-disabled (external ID: VariableID:64c28cb2e0cdddfa9a308282e92b77618ac351e5/1221:3) | TEXT_FILL | — | Source: TDS - Color System V.2 / Tokenization / text/on-disabled. Direct alias to the published TDS text color. | No |
| `Color System/text/on-primary` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/text/on-primary (external ID: VariableID:09c21be6d50be4dd1027727b2bdd3479a9894d54/1221:34) | TEXT_FILL | — | Source: TDS - Color System V.2 / Tokenization / text/on-primary. Direct alias to the published TDS text color. | No |
| `Color System/text/placeholder` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/text/placeholder (external ID: VariableID:2466fa4175d3c39326bed7f630edd363ccaa65d5/1221:37) | TEXT_FILL | — | Source: TDS - Color System V.2 / Tokenization / text/placeholder. Direct alias to the published TDS text color. | No |
| `Color System/text/primary` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/text/primary (external ID: VariableID:9ea9b29721fde79ec563fd63026e9ae8001c9492/1221:36) | TEXT_FILL | — | Source: TDS - Color System V.2 / Tokenization / text/primary. Direct alias to the published TDS text color. | No |
| `Color System/text/secondary` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/text/secondary (external ID: VariableID:c59969f43326bef8c7e685e456a03d7815996d3a/1221:30) | TEXT_FILL | — | Source: TDS - Color System V.2 / Tokenization / text/secondary. Direct alias to the published TDS text color. | No |
| `Color System/text/tertiary` | COLOR | `Default`: alias → TDS Color System V.2/Tokenization/text/tertiary (external ID: VariableID:b001c8aa0f1d45e1c9c93e84db45f5bb50069586/1221:26) | TEXT_FILL | — | Source: TDS - Color System V.2 / Tokenization / text/tertiary. Direct alias to the published TDS text color. | No |

## Text Styles — Figma Export

These 66 local styles are read directly from the Figma file. Bound sizes and line heights show the resolved `Desktop` and `Mobile` Typography modes; hero-title styles retain their static Figma values. Font family is Open Sans throughout. Letter spacing and paragraph spacing are recorded in their Figma units.

| Text style | Font style | Desktop / base size · line height | Mobile size · line height | Letter spacing | Paragraph spacing |
|------------|------------|----------------------------------|----------------------------|----------------|-------------------|
| `hero-title/t1` | Regular (400) | 132px / 156px | — | -2% | 0px |
| `hero-title/t2` | Regular (400) | 124px / 148px | — | -2% | 0px |
| `hero-title/t3` | Regular (400) | 112px / 132px | — | -1.5% | 0px |
| `hero-title/t4` | Regular (400) | 100px / 120px | — | -1.5% | 0px |
| `header-web/h1` | SemiBold (600) | 80px / 96px | 40px / 48px | -2% | 0px |
| `header-web/h2` | SemiBold (600) | 56px / 64px | 36px / 44px | -2% | 0px |
| `header-web/h3` | SemiBold (600) | 40px / 48px | 28px / 36px | -2% | 0px |
| `header-web/h4` | SemiBold (600) | 36px / 44px | 24px / 32px | -1.5% | 0px |
| `header-mobile/h1` | SemiBold (600) | 80px / 96px | 40px / 48px | +2% | 0px |
| `header-mobile/h2` | Regular (400) | 56px / 64px | 36px / 44px | -2% | 0px |
| `header-mobile/h3` | Regular (400) | 40px / 48px | 28px / 36px | -2% | 0px |
| `header-mobile/h4` | Regular (400) | 36px / 44px | 24px / 32px | -1.5% | 0px |
| `paragraph-xl/default` | Regular (400) | 32px / 40px | 20px / 28px | 0% | 0px |
| `paragraph-xl/italic` | Italic (400) | 32px / 40px | 20px / 28px | 0% | 0px |
| `paragraph-xl/semibold` | SemiBold (600) | 32px / 40px | 20px / 28px | 0% | 0px |
| `paragraph-xl/bold` | Bold (700) | 32px / 40px | 20px / 28px | 0% | 0px |
| `paragraph-lg/default` | Regular (400) | 24px / 36px | 18px / 26px | 0% | 0px |
| `paragraph-lg/italic` | Italic (400) | 24px / 36px | 18px / 26px | 0% | 0px |
| `paragraph-lg/semibold` | SemiBold (600) | 24px / 36px | 18px / 26px | 0% | 0px |
| `paragraph-lg/bold` | Bold (700) | 24px / 36px | 18px / 26px | 0% | 0px |
| `paragraph-md/default` | Regular (400) | 20px / 28px | 16px / 24px | 0% | 20px |
| `paragraph-md/italic` | Italic (400) | 20px / 28px | 16px / 24px | 0% | 20px |
| `paragraph-md/semibold` | SemiBold (600) | 20px / 28px | 16px / 24px | 0% | 20px |
| `paragraph-md/bold` | Bold (700) | 20px / 28px | 16px / 24px | 0% | 20px |
| `paragraph-sm/default` | Regular (400) | 18px / 26px | 14px / 20px | 0% | 0px |
| `paragraph-sm/italic` | Italic (400) | 18px / 26px | 14px / 20px | 0% | 0px |
| `paragraph-sm/semibold` | SemiBold (600) | 18px / 26px | 14px / 20px | 0% | 0px |
| `paragraph-sm/bold` | Bold (700) | 18px / 26px | 14px / 20px | 0% | 0px |
| `paragraph-xs/default` | Regular (400) | 16px / 24px | 12px / 16px | +2% | 0px |
| `paragraph-xs/italic` | Italic (400) | 16px / 24px | 12px / 16px | +2% | 0px |
| `paragraph-xs/semibold` | SemiBold (600) | 16px / 24px | 12px / 16px | +2% | 0px |
| `paragraph-xs/bold` | Bold (700) | 16px / 24px | 12px / 16px | +2% | 0px |
| `paragraph-xxs/default` | Regular (400) | 14px / 20px | 10px / 14px | +2% | 0px |
| `paragraph-xxs/semibold` | SemiBold (600) | 14px / 20px | 10px / 14px | +2% | 0px |
| `paragraph-xxs/italic` | Italic (400) | 14px / 20px | 10px / 14px | +2% | 0px |
| `paragraph-xxs/bold` | Bold (700) | 14px / 20px | 10px / 14px | +2% | 0px |
| `label-xl/default` | Regular (400) | 32px / 40px | 20px / 28px | 0% | 0px |
| `label-xl/italic` | Italic (400) | 32px / 40px | 20px / 28px | 0% | 0px |
| `label-xl/semibold` | SemiBold (600) | 32px / 40px | 20px / 28px | 0% | 0px |
| `label-xl/bold` | Bold (700) | 32px / 40px | 20px / 28px | 0% | 0px |
| `label-lg/default` | Regular (400) | 24px / 36px | 18px / 26px | 0% | 0px |
| `label-lg/italic` | Italic (400) | 24px / 36px | 18px / 26px | 0% | 0px |
| `label-lg/semibold` | SemiBold (600) | 24px / 36px | 18px / 26px | 0% | 0px |
| `label-lg/bold` | Bold (700) | 24px / 36px | 18px / 26px | 0% | 0px |
| `label-md/default` | Regular (400) | 20px / 28px | 16px / 24px | 0% | 0px |
| `label-md/italic` | Italic (400) | 20px / 28px | 16px / 24px | 0% | 0px |
| `label-md/semibold` | SemiBold (600) | 20px / 28px | 16px / 24px | 0% | 0px |
| `label-md/bold` | Bold (700) | 20px / 28px | 16px / 24px | 0% | 0px |
| `label-sm/italic` | Italic (400) | 18px / 26px | 14px / 20px | 0% | 0px |
| `label-sm/default` | Regular (400) | 18px / 26px | 14px / 20px | 0% | 0px |
| `label-sm/semibold` | SemiBold (600) | 18px / 26px | 14px / 20px | 0% | 0px |
| `label-sm/bold` | Bold (700) | 18px / 26px | 14px / 20px | 0% | 0px |
| `label-xs/default` | Regular (400) | 16px / 24px | 12px / 16px | +2% | 0px |
| `label-xs/italic` | Italic (400) | 16px / 24px | 12px / 16px | +2% | 0px |
| `label-xs/semibold` | SemiBold (600) | 16px / 24px | 12px / 16px | +2% | 0px |
| `label-xs/bold` | Bold (700) | 16px / 24px | 12px / 16px | +2% | 0px |
| `label-xxs/default` | Regular (400) | 14px / 20px | 10px / 14px | +2% | 0px |
| `label-xxs/italic` | Italic (400) | 14px / 20px | 10px / 14px | +2% | 0px |
| `label-xxs/semibold` | SemiBold (600) | 14px / 20px | 10px / 14px | +2% | 0px |
| `label-xxs/bold` | Bold (700) | 14px / 20px | 10px / 14px | +2% | 0px |
| `button-lg/default` | Regular (400) | 24px / 36px | 18px / 26px | 0% | 0px |
| `button-lg/semibold` | SemiBold (600) | 24px / 36px | 18px / 26px | 0% | 0px |
| `button-lg/bold` | Bold (700) | 24px / 36px | 18px / 26px | 0% | 0px |
| `button-md/default` | Regular (400) | 20px / 28px | 16px / 24px | 0% | 0px |
| `button-md/semibold` | SemiBold (600) | 20px / 28px | 16px / 24px | 0% | 0px |
| `button-md/bold` | Bold (700) | 20px / 28px | 16px / 24px | 0% | 0px |

## Export Observation

`Color System/secondary/content` aliases to `Yokogawa Colors/yg-blue-deep`, while its Figma description cites `Yokogawa Colors/yg-ink`. The export records the alias and description as stored so the difference is visible for review.




