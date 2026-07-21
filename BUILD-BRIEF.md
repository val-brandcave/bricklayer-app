# Bricklayer — Build Brief (start here in the build session)

**Purpose.** This is the handoff from discovery → build. Discovery is done and ratified (assume Cody's blessing). This session builds the **design-led frontend shell** on **mock data**, deployed to Vercel. Read `CLAUDE.md` first, then this.

---

## Read before building
1. `CLAUDE.md` — golden rules, stack, atomic design, adapter pattern, domain vocabulary.
2. `docs/DIRECTION-v2-hubspot-anchored.md` — the product north star.
3. `docs/design-system/design-tokens.md` — the color + type system (light & dark) to implement.
4. `docs/data-adapter-pattern-guide.md` — the mock→API architecture. **Written for Vite; translate to Next.js per `CLAUDE.md` → Architecture** (`NEXT_PUBLIC_*` env, client-only localStorage, seed in a `SeedProvider`, `'use client'` on stores/hooks).
5. `docs/artifacts/*.html` — the **visual spec**: how every surface looks/behaves (widget-library, insights-concept, ui-concepts, ia-object-model, user-flows). *Note: those are in the Voltagent discovery wrapper; the app uses our own tokens.*

Kickoff inputs are already in the repo: adapter guide (`docs/`), logos (`brand/logo/`), atomic-design rules (folded into `CLAUDE.md`).

---

## Confirm with Val at the start (quick)
- **Fonts:** Geist Sans + Geist Mono (recommended) vs IBM Plex Sans/Mono (more institutional). Token-level swap.
- **Chart library:** Recharts (fast, familiar) vs visx (lower-level, more control). Either way, colors come from `--c1…--c8`.
- **Dev lens switcher:** expose a clearly-marked dev-only lens switcher in the shell so the demo can show all three lenses? (Recommend yes, for demos.)

---

## Build sequence

**Phase 0 — Scaffold.** Next.js (App Router) + TS; Tailwind v4 wired to `tokens.css` (via `globals.css`); Zustand; path alias `@/*`; `.env.local` → `NEXT_PUBLIC_DATA_SOURCE=mock`; self-host Geist via `next/font`/`geist`; drop logos into `public/logo/`. Root `layout.tsx` with `ThemeProvider` (data-theme, prefers-color-scheme + toggle) and `SeedProvider`. App shell: left-nav (Insights · Dashboards · Reports · Properties · Chat), top bar with logo + theme toggle. **Gate: a themed empty shell that toggles light/dark cleanly.**

**Phase 1 — Data layer.** `types/` (BaseEntity + domain: Appraisal, Property, Dashboard, Report, Insight, WatchlistItem, User); `collections.ts`; adapters (mock + api stub) + factory (env-selected); `seed/*.seed.ts` with realistic CRE fixtures (the $6.5B / 3,935-appraisal book, class concentration, scored watchlist, staleness, per-property detail). **Seed client-side in `SeedProvider`** (guard `typeof window`), gating the app behind a loader until `adapter.seed()` resolves. **Gate: data readable through a store in a throwaway client page.**

**Phase 2 — Atomic foundation.** Atoms (Button, Input, Pill/Badge, KpiValue, ProvenanceLine, Icon, Skeleton, ThemeToggle) + molecules (SearchField, StatTile, ChartFrame, DimensionChip, FindingCardHeader). All token-driven, both themes, a11y.

**Phase 3 — Widgets (the ~14).** Each an organism: chart primitive + frame + provenance + Save/Edit affordances, fed from the adapter, colored from `--c1…--c8`. Cover the set in `widget-library-v1.html` (bar/h-bar/line/area/donut/pie/KPI/gauge/table + scatter/map/heatmap/watchlist/scenario). Build the **same component** used as a dashboard tile and an in-chat MCP app.

**Phase 4 — Screens (in this order).**
1. **Dashboards** — grid canvas, switcher, tiles, per-tile menu, resize/drag affordances, default-per-lens.
2. **Insights** — the per-lens landing: TODAY read + finding-cards + surprising links + focus panel with *Bricklayer's Read* (self-critiquing) + Explain-this.
3. **Reports** — the library/list (user- + AI-made), filters.
4. **Property workspace** — the per-property widget set + provenance.
5. **Chat** — right-docked co-working panel (summonable, page-aware, MCP-app replies) + full-page threaded chat.
6. **Modals** — the report builder (Dimensions/Measures) and save-to-dashboard; build-a-whole-dashboard flow.

**Phase 5 — Polish & ship.** Both-theme pass, responsive (tablet+desktop), a11y (keyboard/focus/contrast), then Git init → push → Vercel (Next.js auto-detected; set `NEXT_PUBLIC_DATA_SOURCE=mock` in Vercel env; no other secrets).

---

## Guardrails
- **No backend.** API adapter stays a stub that throws. Mock data is the product for now.
- **No hard-coded data or colors** in components — adapter + tokens only.
- Atomic placement decided before writing each component.
- Verify in the browser (drive the flow), both themes, before claiming done.

---

## What "great" looks like
A recruiter/banker opening the Vercel link sees a calm, credible, fast BI tool: lands on a per-lens Insights page that *reasons*, browses real-feeling dashboards of typed widgets, asks the copilot a question and gets a chart it can save, and drills into a property with receipts — all on mock data, both themes, no dead ends.
