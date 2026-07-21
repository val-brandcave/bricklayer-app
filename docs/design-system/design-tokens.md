# Bricklayer — App Design System (tokens)

**Status:** v0.1 recommendation, July 20 2026 · derived from the brand logo gradient · **for the product app, not the discovery artifacts** (those use Voltagent DS).
**Owner:** Val (Brandcave). This is a proposal to lock before screen-building — adjust and confirm in the build session.

> The whole system is seeded from one source of truth: the **logo gradient** (`#1420B9 → #653ED3 → #B65CEE`) and the **wordmark ink** (`#171D3D`). Neutrals are deliberately cool (blue-violet biased) so grey reads as *chosen*, not default. Semantics are kept distinct from the brand indigo. Two full themes — light-first, with a real dark mode.

---

## 1. Brand foundation (from the logo)

| Token | Value | Notes |
|---|---|---|
| `--brand-blue` | `#1420B9` | gradient stop 0 |
| `--brand-indigo` | `#5037CC` | gradient mid — the **primary** interactive hue |
| `--brand-indigo-2` | `#653ED3` | gradient 0.49 |
| `--brand-violet` | `#7645D9` | gradient 0.6 |
| `--brand-violet-2` | `#B65CEE` | gradient stop 1 |
| `--brand-ink` | `#171D3D` | wordmark navy — the darkest text in light mode |
| `--brand-gradient` | `linear-gradient(135deg, #1420B9 0%, #653ED3 55%, #B65CEE 100%)` | brand moments only (logo lockups, sign-in hero, empty-state art). **Never** behind body text or data. |

**Rule:** the gradient is a brand device, not a UI surface. Interactive UI uses the solid **primary** below.

---

## 2. Color tokens — light & dark

Paste-ready. Style every component through these variables — never hard-code a hex in a component.

```css
:root, [data-theme="light"] {
  /* surfaces (cool, blue-violet-biased neutrals) */
  --canvas:        #F7F8FC;   /* app background */
  --surface:       #FFFFFF;   /* cards, panels, tiles */
  --surface-2:     #F1F3FA;   /* subtle inset panels, table headers */
  --surface-3:     #E9ECF7;   /* hover fills */
  --hairline:      #E2E5F0;   /* default 1px borders */
  --hairline-2:    #EDEFF7;   /* faint dividers */
  --border-strong: #CDD2E4;   /* emphasized borders, inputs */

  /* text */
  --ink:    #171D3D;   /* headings / primary text (brand navy) */
  --body:   #434A67;   /* body copy */
  --muted:  #767D9C;   /* secondary / captions */
  --faint:  #A3A9C2;   /* disabled / placeholder */

  /* primary (interactive) */
  --primary:        #5037CC;
  --primary-hover:  #4229A8;
  --primary-active: #37217F;
  --on-primary:     #FFFFFF;
  --primary-soft:   #ECE9FA;   /* tinted bg for selected rows, badges */
  --ring:           #5037CC66; /* focus ring */

  /* semantics (distinct from brand) */
  --success:#1F8F5F; --success-soft:#E4F4EC;
  --danger: #D22B4E; --danger-soft: #FBE7EC;
  --warning:#B7791F; --warning-soft:#F7EEDB;
  --info:   #2563C9; --info-soft:   #E5EDFB;

  /* deltas (data) */
  --up:#1F8F5F; --down:#D22B4E; --watch:#B7791F;

  /* elevation (light = soft shadows) */
  --shadow-sm: 0 1px 2px rgba(23,29,61,.06), 0 1px 3px rgba(23,29,61,.05);
  --shadow-md: 0 4px 12px rgba(23,29,61,.08), 0 2px 4px rgba(23,29,61,.05);
  --shadow-lg: 0 16px 40px rgba(23,29,61,.14);
}

[data-theme="dark"] {
  /* surfaces (deep navy, from the brand ink — not pure black) */
  --canvas:        #0C0E1A;
  --surface:       #14172A;
  --surface-2:     #1B1F36;
  --surface-3:     #232842;
  --hairline:      #282D48;
  --hairline-2:    #1F2338;
  --border-strong: #3A4066;

  --ink:    #F5F6FC;
  --body:   #C3C8DE;
  --muted:  #888FB0;
  --faint:  #5B6188;

  --primary:        #8E7BF2;   /* lightened for contrast on dark */
  --primary-hover:  #A08FF6;
  --primary-active: #B6A8F9;
  --on-primary:     #16182E;
  --primary-soft:   #21203B;
  --ring:           #8E7BF288;

  --success:#34D399; --success-soft:rgba(52,211,153,.14);
  --danger: #FB7185; --danger-soft: rgba(251,113,133,.15);
  --warning:#FBBF4D; --warning-soft:rgba(251,191,77,.14);
  --info:   #60A5FA; --info-soft:   rgba(96,165,250,.14);

  --up:#34D399; --down:#FB7185; --watch:#FBBF4D;

  --shadow-sm: 0 1px 2px rgba(0,0,0,.4);
  --shadow-md: 0 6px 18px rgba(0,0,0,.45);
  --shadow-lg: 0 20px 50px rgba(0,0,0,.6);
}
```

**Theme switching:** default to `prefers-color-scheme` via a small script that stamps `data-theme` on `<html>`; a user toggle overrides it. All tokens are defined for both, so components never branch on theme.

**Contrast:** ink/body/muted on their surfaces and `--on-primary` on `--primary` all clear **WCAG AA** in both themes. Keep it that way when adjusting.

---

## 3. Data-visualization palette

Charts get their own categorical ramp — harmonized with the indigo/violet brand but engineered for distinguishability on both grounds. Series colors are theme-specific (dark = brighter).

```css
:root, [data-theme="light"] {
  --c1:#5037CC; --c2:#2E9BD6; --c3:#B65CEE; --c4:#E08A2B;
  --c5:#D94F6C; --c6:#1FA085; --c7:#B99A2E; --c8:#6E7699;
  --grid:#E7E9F3;              /* chart gridlines */
}
[data-theme="dark"] {
  --c1:#8E7BF2; --c2:#4FB3E6; --c3:#C77DF2; --c4:#F0A64D;
  --c5:#F2718E; --c6:#35C2A2; --c7:#D8BC4E; --c8:#8B93B5;
  --grid:#242A44;             /* chart gridlines (dark) */
}
```

- **Series order:** c1 (brand indigo, the primary/emphasis series) → c2 → … → c8.
- **Sequential** (single-metric heatmaps, e.g. concentration): a light→brand-indigo ramp.
- **Diverging** (staleness green↔red, deltas): `--success` ↔ `--danger` through a neutral midpoint.
- **Rules:** semantic colors (up/down/watch) are for *meaning*, not series identity. Emphasize an endpoint or the latest bar with `--primary`. Every chart: faint `--grid`, tabular numeric labels, an accessible legend.

---

## 4. Typography

**Recommendation — Geist Sans + Geist Mono.** Modern, clean, cohesive; self-hosted via the `geist` package / `next/font` (zero external requests → clean Vercel deploys); distinctive without the generic-Inter look; excellent for dense data UIs. *Alternative if a more institutional/financial tone is wanted: IBM Plex Sans + IBM Plex Mono.* Type is a token-level swap, so this is easy to change in the build session.

```css
:root {
  --font-sans: "Geist", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: "Geist Mono", "SFMono-Regular", Menlo, Consolas, monospace;
}
```

| Role | Size / line-height | Weight | Face | Use |
|---|---|---|---|---|
| display | 40 / 44 | 600 | sans | page hero (rare in-app) |
| h1 | 30 / 36 | 600 | sans | page titles |
| h2 | 24 / 30 | 600 | sans | section headers |
| h3 | 19 / 26 | 600 | sans | card / panel titles |
| body | 15 / 24 | 400 | sans | default copy |
| body-strong | 15 / 24 | 600 | sans | emphasis |
| small | 13 / 20 | 400 | sans | secondary |
| caption | 12 / 16 | 500 | sans | labels, eyebrows (uppercase, +0.06em) |
| **data / KPI** | contextual | 500–600 | **mono** | all figures, table cells, axis labels — **always `tabular-nums`** |

**Rule:** every number that sits in a column or a KPI uses the mono face (or `font-variant-numeric: tabular-nums`) so digits align. This is a data product — numbers are a first-class type role.

---

## 5. Shape, spacing, motion

```css
:root {
  --r-xs:4px; --r-sm:6px; --r-md:8px; --r-lg:12px; --r-xl:16px; --r-pill:9999px;
  /* spacing scale (4-based) */
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:20px; --s-6:24px; --s-8:32px; --s-10:40px; --s-12:48px; --s-16:64px;
}
```
- **Radius:** inputs/buttons `--r-sm`; cards/tiles `--r-md`/`--r-lg`; pills `--r-pill`.
- **Density:** this is a BI tool — default to a **compact, calm** rhythm (tables 36–40px rows, tight but breathable cards). "Regulator-grade calm," not airy marketing spacing.
- **Elevation:** light mode leans on **soft shadows** + hairlines; dark mode leans on **borders** + a faint shadow. (Opposite of the Voltagent artifact look — this is a real product, not a marketing page.)
- **Motion:** subtle and functional (120–180ms ease); always guard `prefers-reduced-motion`.

---

## 6. Usage rules (the short list)

1. **Tokens only** — components read `var(--…)`, never literal hex. One edit reskins everything.
2. **Primary is indigo `#5037CC`** (light) / `#8E7BF2` (dark) — buttons, links, active nav, selected states. The **gradient** is brand-only.
3. **Neutrals are cool** — never a pure `#808080` grey; use the blue-violet-biased scale.
4. **Semantics ≠ brand ≠ series** — three separate color jobs. Don't paint a chart series in `--danger` unless it *means* danger.
5. **Numbers are mono + tabular** everywhere they align.
6. **Both themes, always** — every token has a light and dark value; never branch on theme in a component.
7. **AA contrast** is the floor; verify when you touch a token.

---

## 7. Logo assets

In `brand/logo/` (copy to `public/logo/` in the app):
- `brick-layer-emblem.svg` — the gradient "B" emblem (favicon / collapsed-nav mark). viewBox 673×800.
- `brick-layer-emblem-full-white.svg` — white emblem (on brand/dark grounds).
- `brick-layer-full-logo.svg` — emblem + "bricklayer" wordmark (gradient emblem, `#171D3D` wordmark). viewBox 4161×800.
- `brick-layer-full-logo-white.svg` / `-full-white.svg` — wordmark lockups in white / all-white for dark & brand backgrounds.

**Favicon:** derive from the emblem gradient. **App bar:** full logo in light mode; white-wordmark lockup in dark mode.
