# Integrating Real Data — Bricklayer

**Read this first if you've cloned Bricklayer to point it at a real backend.**
This is a design-led **frontend prototype on mock data**. It was built so that
swapping mock data for your real APIs is a **contained, low-risk change**: you
implement one file and set one environment variable. **No UI, component, store,
or page code needs to change.**

> Audience: your engineers, and Claude Code running in this repo. If you're
> Claude Code: read `CLAUDE.md` (project guide) and `docs/data-adapter-pattern-guide.md`
> (the architecture, written for Vite — this repo is **Next.js**, so translate
> `import.meta.env.VITE_*` → `process.env.NEXT_PUBLIC_*`). Then follow this doc.

---

## TL;DR

1. **Set the environment** → `.env.local`: `NEXT_PUBLIC_DATA_SOURCE=api` and `NEXT_PUBLIC_API_BASE_URL=https://your-api`.
2. **Implement `src/data/adapters/api-adapter.ts`** — 7 read/write methods against your endpoints. Every method currently throws a "not implemented" error, so nothing runs silently against a missing backend.
3. **Make your API return objects that match the domain types** in `src/types/domain.types.ts` (the data contract).

Then work through the **Reconciliation** section — a handful of places where the
prototype *simulates* things (aggregated charts, the AI/chat, the Insights copy)
that a real deployment needs to wire to live analytics or an LLM. Those are
called out honestly below so you don't mistake a demo shortcut for finished
product.

---

## How data flows (and why only one layer changes)

The layering is strict and one-directional — each layer imports **only** from the
layer directly below it:

```
Page (app/**/page.tsx)
  → Page hook (src/hooks/useX.ts)     — lens-scoping, view-models; store-only
    → Zustand store (src/store/*.ts)  — the ONLY layer that touches the adapter;
      → Data adapter (src/data/adapters)   owns IDs, timestamps, loading state
        → mock (localStorage)  |  api (HTTP)   ← you implement this
```

The **factory** (`src/data/adapters/index.ts`) picks the implementation from the
env var at build time:

```ts
const source = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "api";
export const adapter = source === "mock" ? mockAdapter : apiAdapter;
```

Because every screen reaches data only through `adapter`, replacing `mockAdapter`
with a real `apiAdapter` is invisible to everything above it. That is the whole
point of the pattern — the prototype and the production app share 100% of the UI.

---

## Step 1 — Environment

A committed `.env` sets `NEXT_PUBLIC_DATA_SOURCE=mock` so a fresh clone runs the
**working demo** immediately (`npm install && npm run dev`). To point at your
backend, create a **`.env.local`** (gitignored — it overrides `.env`):

```bash
NEXT_PUBLIC_DATA_SOURCE=api
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
```

`NEXT_PUBLIC_*` values are **inlined into the client bundle** (not secrets).
Keep real secrets (tokens, keys) on your server, never here. See `.env.example`.

---

## Step 2 — Implement the API adapter

`src/data/adapters/api-adapter.ts` implements the `DataAdapter` contract
(`src/data/adapters/types.ts`). It is generic over a **collection name** (string)
and a row type `<T>`. The mock adapter (`mock-adapter.ts`) is a complete, working
reference implementation against `localStorage` — mirror its behavior against
HTTP. The methods:

| Method | Purpose | Suggested endpoint |
|---|---|---|
| `getAll<T>(collection)` | list a collection | `GET /api/{collection}` |
| `getById<T>(collection, id)` | one row (or `null`) | `GET /api/{collection}/{id}` |
| `getWhere<T>(collection, predicate)` | filtered list | see note ↓ |
| `create<T>(collection, item)` | insert (item has an `id`) | `POST /api/{collection}` |
| `createMany<T>(collection, items)` | bulk insert | `POST /api/{collection}/bulk` |
| `update<T>(collection, id, partial)` | patch | `PATCH /api/{collection}/{id}` |
| `remove(collection, id)` | delete | `DELETE /api/{collection}/{id}` |
| `seed(force?)` | no-op for API (server owns data) | — |
| `clear()` | throw / no-op for API | — |

Notes:
- **`getWhere` takes a JS predicate function** — you can't send a function over
  HTTP. Either (a) fetch `getAll` and filter client-side (fine for these
  collection sizes), or (b) translate the common filters into query params. The
  stores mostly use `getAll` + derive in the hook, so a client-side filter in
  `getWhere` is an acceptable first pass.
- The commented lines already in `api-adapter.ts` sketch an `axios` version; use
  `fetch` or `axios` — your call.
- **IDs & timestamps:** stores currently generate the `id` (`generateId()`) and
  `createdAt`/`updatedAt` (`Date.now()`) *before* calling `create`. If your API
  generates IDs server-side instead, return the created row from `create()` and
  the store will use it (see `src/store/reports.store.ts` for the pattern).

---

## Step 3 — Match the data contract

Your endpoints must return JSON that deserializes into the **domain types** in
[`src/types/domain.types.ts`](../src/types/domain.types.ts) — that file is the
contract, single source of truth. All entities extend `BaseEntity` (`id: string`
UUID, `createdAt: number` epoch-ms); enums are string union types; cross-refs are
by id.

| Collection (`src/data/collections.ts`) | Type | What it is |
|---|---|---|
| `users` | `User` | the person + their **lens** (RBAC role) |
| `properties` | `Property` | individual CRE assets (cap rate, price/SF, flood zone, `latestAppraisalId`…) |
| `appraisals` | `Appraisal` | appraisal reports (appraiser, firm, approach weights, comps, provenance) |
| `reports` | `Report` | a **saved widget instance** — `widgetType` + `dataKey` + config |
| `dashboards` | `Dashboard` | a grid of `Tile`s (`reportId` + `x/y/w/h`) |
| `insights` | `Insight` | curated/discovered findings + "Bricklayer's Read" |
| `watchlist` | `WatchlistItem` | scored risk-review items (0–100 + reasons) |

Keep the **enum values** (`AssetClass`, `FloodZone`, `ValuationStatus`,
`WidgetType`, `DataSeriesKey`, `InsightKind`, `Severity`, `InsightOrigin`,
`Lens`) exactly as typed — the UI switches on them. If your real vocabulary
differs, change the union types in one place and let TypeScript surface every
call site.

---

## Reconciliation — where the prototype simulates, and what to wire

This is the honest part: the adapter swap makes the **object-backed** surfaces
(Properties, Reports, Dashboards, saving/pinning) real. But several things are
**demo simulations** by design. Address each before calling the app
production-ready.

### 1. Aggregated chart data is curated, not computed
`src/data/datasets.ts` holds **hand-curated chart series** (by `DataSeriesKey`)
and `bookStats` (the `$6.51B` / `3,935` headline figures). The seeded
`properties` collection is only a *representative drill-down sample*; these
aggregates stand in for the whole book. `src/data/resolve.ts` maps a report's
`dataKey` → its chart data via `datasets`.
**To make real:** compute these aggregates from your real `appraisals`/`properties`
data — either add server-side aggregation endpoints keyed by `DataSeriesKey`, or
aggregate client-side in `resolve.ts`/a hook. Replace `bookStats` with live
book-wide figures.

### 2. `resolve.ts` reads some seed arrays directly (bypasses the adapter)
The collection-backed getters (`getWatchlist`, `getMapPoints`, `getTable`) in
`src/data/resolve.ts` currently **import the seed files directly** — a known
prototype shortcut (flagged in the file's own header comment). These must be
rewired to read their collections through the **store/adapter** (pass the data in
from a page hook), so they reflect real data.

### 3. Chat / "Ask Bricklayer" is a keyword router, not an LLM
`src/lib/chat-router.ts` maps keywords → a pre-seeded `Report` + written
preamble. The docked assistant and full-page `/chat` return these **pre-baked**
MCP apps; there is **no real model call**. `src/store/chat.store.ts` simulates
"thinking" latency.
**To make real:** replace the router with a call to your agent/LLM backend that
returns (a) a narrative and (b) a report spec (`widgetType` + `dataKey`/query)
the existing `Widget` can render. The save/pin/edit affordances already work.

### 4. Insights content is authored, not generated
`src/data/seed/insights.seed.ts` (the findings + each "Bricklayer's Read"
critique) and `src/lib/insight-digests.ts` (the per-lens "TODAY" synthesis) are
**hand-written demo copy**, grounded in the seed numbers. Real Insights must be
**produced by your analytics + LLM** over the actual book and written into the
`insights` collection; the per-lens digest copy should likewise be generated.
The UI (finding list, focus panel, TODAY digest) renders whatever the data says.

### 5. Simulated latency
`src/store/latency.ts` adds artificial delays (`LATENCY.read/quick/write`) so the
demo's skeletons are visible. Real network latency replaces this — you can leave
the `latency()` calls (harmless) or remove them.

### 6. Lens / RBAC is a dev switcher
The "VIEW AS LENS" control (profile menu) is **demo-only**. In production the
lens comes from the authenticated user's role at provisioning. Lens currently
lives in `src/store/ui.store.ts` (persisted to localStorage); wire it to your
real user/session and remove the dev switcher.

### 7. Auth
There is **no authentication** in the prototype. Add your auth in front of the
app and populate the current `User`/lens from the session.

---

## What's real structure vs demo-only (don't mistake one for the other)

| Real product structure (keep) | Demo-only (replace/remove) |
|---|---|
| The adapter pattern & data contract | Mock `localStorage` adapter + `src/data/seed/*` |
| Domain types & collections | `bookStats` + curated `datasets.ts` series |
| Widget/Report/Dashboard/Tile model | Keyword chat router (`lib/chat-router.ts`) |
| Insights two-type model (curated/discovered) + focus panel + TODAY digest **layout** | Authored insight **content** & digest copy |
| Design tokens, motion system, atomic components | Simulated latency, dev lens switcher, `/dev/*` galleries |
| Lens-shaped RBAC concept | The in-app lens **switcher** |

The `/dev/components` and `/dev/widgets` routes are QA galleries — safe to delete.

---

## Verify it works on real data

1. `.env.local` → `api` + your base URL; `npm run dev`.
2. Open each destination: **Insights · Dashboards · Reports · Properties · Chat**.
3. Confirm data loads (no "API adapter not implemented" errors in the console).
4. Exercise writes: create a report, pin to a dashboard, drag/resize a tile — confirm they persist via your API.
5. Check both **light and dark** themes and tablet/desktop widths.
6. Work through the Reconciliation list; anything still on curated/authored data will look right but won't reflect your book until wired.
7. `npm run build` for a production build.

---

## Reference
- `CLAUDE.md` — project guide, vocabulary, golden rules.
- `docs/data-adapter-pattern-guide.md` — the architecture in depth (Vite-flavored; translate env + bootstrap to Next.js as noted above).
- `docs/DIRECTION-v2-hubspot-anchored.md` — product direction / north star.
- `src/types/domain.types.ts` — the data contract.
- `src/data/adapters/` — the contract (`types.ts`), the reference impl (`mock-adapter.ts`), and your target (`api-adapter.ts`).
