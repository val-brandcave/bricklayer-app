# Bricklayer — Project Guide (CLAUDE.md)

Bricklayer is RealWired's AI/BI **intelligence suite for banks**: it turns a bank's entire book of commercial-real-estate **appraisal reports** into a queryable data lake with dashboards + an analytics copilot. This repo builds the **design-led frontend shell** — a polished, functional-feeling demo on **mock data**, deployed to Vercel for demo links. Real devs later swap mock data for real APIs behind the adapter (below). **We build the frontend and the experience; we do not build the backend.**

> **Product source of truth:** `docs/DIRECTION-v2-hubspot-anchored.md`. Read it before building product surfaces. The discovery artifacts in `docs/artifacts/*.html` show every pattern (widget library, Insights, IA, flows) — they are the visual spec (styled in the Voltagent discovery wrapper; the **app** uses our own design system, below).

---

## Golden rules (non-negotiable)

1. **Mock data only, behind the adapter.** No component ever hard-codes data or hits `localStorage`/`fetch` directly. Everything flows through the data adapter (`src/data/adapters`). See *Architecture*.
2. **Design tokens only.** No literal hex, px font sizes, or ad-hoc greys in components. Use the CSS variables from `docs/design-system/design-tokens.md` (→ `src/styles/tokens.css`). One token edit must reskin the whole app.
3. **Strict atomic design.** Every UI piece has an atomic level (atom / molecule / organism / template / page). Determine it *before* writing the component and put it in the right folder. See *Component architecture*.
4. **Both themes, always.** Light-first with a real dark mode. Never branch on theme inside a component — style through tokens that are defined for both.
5. **Accessibility is AA.** Keyboard-operable, visible focus, labelled inputs, semantic HTML, AA contrast. This is a bank tool — it must be credible.
6. **The vocabulary is fixed.** Widget / Report / Dashboard / Tile / MCP app / Insights / Lens mean specific things (below). Use them exactly in code, types, and UI copy.
7. **Motion is a feature, through the motion system.** The app should feel alive — smooth transitions, purposeful entrances, and *simulated* skeleton loading on every data surface. Animate with **Framer Motion** via the shared variants/tokens in `src/lib/motion.ts` — never ad-hoc `duration`/`ease` literals. Motion must be tasteful and fast (this is a bank tool), and always degrade gracefully (see *Motion & loading*).

---

## The product in one screen (domain vocabulary)

- **Widget** — a *type* of visualization (bar, line, scatter, map, heatmap, KPI, table, gauge, donut/pie, watchlist, scenario…). A reusable component. ~14 of them. *This is what we build.*
- **Report** — a *saved, data-bound instance* of a widget ("Avg cap rate by vintage"). The object: listable, reusable, attaches to many dashboards.
- **Dashboard** — a saved *collection of reports* on a grid. (Never "board" — that word is retired.)
- **Tile** — a report rendered *on a dashboard*. **MCP app** — the *same* report rendered *in chat*, with Save/Edit. Same component, two frames.
- **Insights** — the **per-lens landing**: the opinion/critique layer (claim → evidence → *Bricklayer's Read* → action), not a dashboard copy.
- **Chat** — two surfaces: a **right-docked co-working assistant** (summonable, page-aware, takes write actions) and a **full-page threaded chat** (returns MCP apps).
- **Lens** — the user's RBAC role, set at provisioning (Portfolio Manager / Credit-Lending Officer / Chief Appraiser). No in-app switcher; the lens shapes what's surfaced. *(For the demo shell we may expose a dev-only lens switcher — clearly marked.)*
- **Create/edit** happens in **app-level modals**, never trapped in a chat drawer — one editor reached from both the dashboard and chat.

Destinations (left-nav): **Insights · Dashboards · Reports · Properties · Chat**.

---

## Stack

- **Next.js (App Router) + React + TypeScript**, deployed to **Vercel** (its native platform). This is a heavily client-interactive demo on mock data, so most product surfaces are **client components** (`'use client'`).
- **Zustand** for state (stores are the only layer that touches the adapter; client-side).
- **Tailwind CSS v4** mapped to our **CSS-variable tokens** (utilities resolve to `var(--…)`; no literal values). Co-locate a CSS module only when an atom needs styles utilities can't express.
- **Charts:** a token-driven lib (recommend **Recharts** or **visx**) — decide in-build; colors come from `--c1…--c8`, never hard-coded.
- **Motion:** **Framer Motion** (`framer-motion`), driven by the shared motion system in `src/lib/motion.ts`. Wrapped app-wide by `MotionProvider` (`reducedMotion="user"`). See *Motion & loading*.
- **Icons:** inline SVG (e.g. `lucide-react`) — no icon fonts.
- **Fonts:** self-hosted via the `geist` package / `next/font` (no external font requests).
- Path alias `@/*` (tsconfig).

---

## Architecture — the data adapter pattern

Full guide: `docs/data-adapter-pattern-guide.md`. **Read it before writing any data code.** The layering is strict:

```
Page component → Page hook (useX) → Zustand store → adapter (factory) → mock | api
```

- Each layer imports **only** from the layer directly below. Pages never touch stores or the adapter; stores never skip the adapter.
- The **factory** (`src/data/adapters/index.ts`) picks mock vs API from `NEXT_PUBLIC_DATA_SOURCE`. For this project: **`.env.local` → `NEXT_PUBLIC_DATA_SOURCE=mock`** (read via `process.env.NEXT_PUBLIC_DATA_SOURCE`).
- Mock adapter = localStorage; API adapter = stubbed (throws) until real devs implement it. Swapping to real APIs changes **zero** UI code.
- IDs (`generateId()`), timestamps (`Date.now()`), and loading/error state live in the **store**, not the page.
- Domain entities extend `BaseEntity` (`id`, `createdAt`); enums are union types; cross-refs by `UUID`.

**Next.js adaptation of the guide** (the guide is written for Vite — translate these specifics; everything else applies unchanged):
- `import.meta.env.VITE_*` → `process.env.NEXT_PUBLIC_*`. The guide's `main.tsx` bootstrap → a client **`SeedProvider`** in the root layout.
- **localStorage is browser-only.** The mock adapter runs client-side — guard `typeof window !== 'undefined'`, and mark stores / hooks / data-touching components `'use client'`. Seed on mount in the `SeedProvider` and gate the app behind a loader until `adapter.seed()` resolves.

**Our collections** (grow as needed): `appraisals`, `properties`, `dashboards`, `reports`, `insights`, `watchlist`, `users`. Seed them with realistic CRE fixtures (below).

---

## Component architecture — atomic design (strict)

Determine the atomic level first, then scope and place the component. Keep each piece single-responsibility; extract shared patterns instead of duplicating.

| Level | What | Bricklayer examples | Folder |
|---|---|---|---|
| **Atoms** | Indivisible primitives, no business logic, sensible default props | Button, Input, Badge/Pill, KpiValue (mono, tabular), Icon, Skeleton, ProvenanceLine | `src/components/atoms/` |
| **Molecules** | Small combos of atoms | SearchField, StatTile, ChartFrame, FindingCardHeader, DimensionChip | `src/components/molecules/` |
| **Organisms** | Complex sections | **A widget** (chart + frame + provenance + actions), DashboardGrid, InsightsFocusPanel, CoWorkingChatPanel, AppNav, ReportBuilderModal | `src/components/organisms/` |
| **Templates** | Page layout, structure without real data | DashboardTemplate, InsightsTemplate, PropertyWorkspaceTemplate | `src/templates/` |
| **Pages** | Templates + real (mock) data via a page hook | InsightsPage, DashboardsPage, ReportsPage, PropertyPage, ChatPage | `src/pages/` |

**Mapping to the domain:** a **chart primitive** ≈ molecule; a **widget/report tile** ≈ organism; a **dashboard** ≈ template/page. Props over hard-coded text; components self-contained; no external state unless via a page hook.

Naming: `ComponentName.tsx` (+ co-located `ComponentName.module.css` and `ComponentName.test.tsx` when needed).

---

## Design system & tokens

Defined in `docs/design-system/design-tokens.md` → implement as `src/styles/tokens.css`.

- **Brand** seeds everything: gradient `#1420B9 → #653ED3 → #B65CEE`, ink `#171D3D`. Gradient = **brand moments only** (logo, sign-in hero, empty-state art) — never behind data.
- **Primary (interactive):** indigo `#5037CC` (light) / `#8E7BF2` (dark) — buttons, links, active/selected.
- **Neutrals are cool** (blue-violet-biased) — never a pure grey.
- **Semantics** (`--success/danger/warning/info`) are separate from brand and from the **data-viz series** (`--c1…--c8`). Three distinct color jobs.
- **Type:** Geist Sans everywhere — **no mono, ever**. All figures/KPIs use `tabular-nums` on Geist Sans (the `.tnum` class / `[data-numeric]`). Self-host via the `geist` package (no external font requests).
- Logos in `brand/logo/` → copy to `public/logo/`.

---

## Motion & loading

Motion is a first-class part of the experience — the demo should feel alive and considered, not static. All animation goes through **Framer Motion** and the shared motion system so it stays consistent and re-timable from one place.

- **Single source of truth: `src/lib/motion.ts`.** Import its `DUR`, `EASE`, `SPRING`, and variants (`fadeUp`, `fade`, `scaleIn`, `slideInRight`, `staggerContainer`/`staggerItem`, `pageVariants`, `pressable`, `liftable`). **Never** hard-code `duration`/`ease` numbers in a component — add or reuse a variant instead. These mirror the CSS motion tokens (`--dur*`, `--ease`) in `tokens.css`.
- **Reduced motion is global.** `MotionProvider` wraps the app with `<MotionConfig reducedMotion="user">`, and `globals.css` has an `@media (prefers-reduced-motion)` guard. **Do not** branch on reduced-motion inside components — it's handled for you. (`KpiValue` reads `useReducedMotion()` only to skip its count-up; follow that pattern for JS-driven number animations.)
- **Skeletons on every data surface — always simulate latency.** No surface should pop in with instant data in the demo. Show `Skeleton` / `SkeletonText` / `ChartSkeleton` (see `atoms/Skeleton.tsx`, `molecules/ChartFrame.tsx`) while the (store-simulated) delay resolves. Skeletons must occupy the **same layout** as the loaded content so there's **no layout shift**. Simulated delay belongs in the **store** (with the adapter call), not the component.
- **Entrances & transitions.** Route changes animate via `PageTransition` (in `AppShell`). Lists/grids of tiles use `staggerContainer` + child `fadeUp` (pass `inStagger` on `StatTile`/`ChartFrame` so the parent orchestrates). Panels/modals use `scaleIn` / `slideInRight` with `AnimatePresence` for exit.
- **Micro-interactions.** Interactive surfaces get spring press/hover feedback (`whileTap`/`whileHover`, `SPRING.*`). Keep it subtle: small `y`/`scale` deltas, fast springs — credible for a bank, never bouncy or slow.
- **Creative, not decorative.** Animation should clarify (where a thing came from, that a number was just computed, that data is loading), not distract. When in doubt, faster and quieter.

---

## Project structure (target)

```
bricklayer/
├── CLAUDE.md, README.md
├── package.json, next.config.*, tsconfig.json, tailwind.*, .env.local
├── public/logo/                      # brand SVGs
├── docs/                             # discovery (DIRECTION-v2, artifacts, meetings, adapter guide, design-tokens)
└── src/
    ├── app/                          # App Router
    │   ├── layout.tsx                # fonts, ThemeProvider, MotionProvider, SeedProvider
    │   ├── globals.css               # imports styles/tokens.css; skeleton/spinner keyframes
    │   └── insights|dashboards|reports|properties|chat/page.tsx   # route "pages" (client)
    ├── styles/tokens.css
    ├── lib/           (motion.ts [motion system], lenses.ts)
    ├── types/         (common.types.ts + domain types, barrel)
    ├── data/          (collections.ts, adapters/, seed/)
    ├── store/         ('use client' Zustand stores + barrel)
    ├── components/    (atoms/ molecules/ organisms/ — each with an index.ts barrel)
    ├── templates/
    └── providers/     (SeedProvider, ThemeProvider, MotionProvider)
```
Route `page.tsx` files are the atomic "pages" (client components), composed from templates + organisms via a page hook.

---

## Mock data conventions

The demo must feel real. Seed realistic CRE fixtures consistent with the discovery numbers: a **~$6.5B book across 3,935 appraisals**, class concentration (Residential ~25% / $1.55B), a scored **risk watchlist** (0–100 + WHY), valuation staleness (1,233 aged >24mo), an appraiser-workload outlier, per-property detail (cap rate, price/SF, flood zone, comps). Hardcoded IDs, epoch-ms timestamps, cross-referenced by UUID. Keep fixtures in `src/data/seed/*.seed.ts` — pure typed arrays, no logic.

---

## Commands & deployment

```bash
npm install
npm run dev          # next dev
npm run build        # next build (Vercel runs this)
npm run start        # serve the production build
npm run lint         # next lint
```

- **Never** suppress output to `nul` on Windows (see global rules). Use `/dev/null` in Git Bash if needed.
- **Vercel:** Next.js is auto-detected (its native platform) — app at repo root, no special config. Set `NEXT_PUBLIC_DATA_SOURCE=mock` in Vercel env; no other secrets for demos. Push to GitHub → Vercel builds per branch/PR → demo links.

---

## Definition of done (before committing)

- Renders correctly in the browser (drive the actual flow — don't assume).
- Works in **both themes** and at tablet + desktop widths.
- No console errors/warnings; keyboard-operable with visible focus.
- Data flows through the adapter; colors/type through tokens; correct atomic placement.
- Motion goes through `src/lib/motion.ts` (no ad-hoc durations/easings); data surfaces show skeletons while a simulated delay resolves, with no layout shift; reduced-motion still works.

---

## References

- **Product direction:** `docs/DIRECTION-v2-hubspot-anchored.md` (north star)
- **Visual spec (patterns):** `docs/artifacts/*.html` — widget-library, insights-concept, ui-concepts, ia-object-model, user-flows, review-index
- **Data architecture:** `docs/data-adapter-pattern-guide.md`
- **Design tokens:** `docs/design-system/design-tokens.md`
- **Status ledger:** `docs/DISCOVERY-LOG.md`
- **Meeting records:** `docs/meetings/processed-calls/`
