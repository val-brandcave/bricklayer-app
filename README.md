# Bricklayer

An AI/BI **intelligence suite for banks** — it turns a bank's entire book of
commercial-real-estate **appraisal reports** into a queryable data lake with
dashboards and an analytics copilot.

This repository is the **design-led frontend** — a polished, functional demo
running on **mock data**. It is built so the mock data can be swapped for real
APIs behind a single adapter layer, with **no changes to any UI code**.

> ### 👉 Pointing this at your real data?
> **Read [`docs/INTEGRATING-REAL-DATA.md`](docs/INTEGRATING-REAL-DATA.md) first.**
> It's a step-by-step guide (for your engineers or Claude Code) covering the one
> file to implement, the data contract, and an honest list of what the prototype
> simulates and still needs wiring.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  (or :3001 if 3000 is taken)
```

A committed `.env` sets `NEXT_PUBLIC_DATA_SOURCE=mock`, so a fresh clone runs the
full demo on seeded fixtures out of the box — no setup, no backend.

```bash
npm run build      # production build
npm run start      # serve the production build
```

## What's inside

- **Next.js (App Router) + React + TypeScript**, deployed on Vercel.
- **Zustand** for state; **Tailwind v4** mapped to CSS-variable **design tokens**.
- **Recharts** for charts; **Framer Motion** for the motion system; **Geist Sans**.
- Five destinations: **Insights · Dashboards · Reports · Properties · Chat**.
- A strict **data-adapter pattern** (mock ↔ API) — the reason real data drops in cleanly.

## Key docs

| Doc | What it's for |
|---|---|
| [`docs/INTEGRATING-REAL-DATA.md`](docs/INTEGRATING-REAL-DATA.md) | **Wiring real data in** (start here for that) |
| [`CLAUDE.md`](CLAUDE.md) | Project guide — architecture, vocabulary, golden rules |
| [`docs/data-adapter-pattern-guide.md`](docs/data-adapter-pattern-guide.md) | The adapter architecture in depth |
| [`docs/DIRECTION-v2-hubspot-anchored.md`](docs/DIRECTION-v2-hubspot-anchored.md) | Product direction / north star |

## Project layout

```
src/
├── app/          # App Router routes (insights, dashboards, reports, properties, chat)
├── components/   # atoms / molecules / organisms (atomic design)
├── templates/    # page layouts
├── hooks/        # page hooks (store-only)
├── store/        # Zustand stores (the only layer that touches the adapter)
├── data/         # adapters (mock | api | factory), collections, seed fixtures, datasets
├── types/        # domain types — the data contract
├── lib/          # motion system, formatting, lenses, chat router
└── styles/       # design tokens
```

Mock data only, behind the adapter. Design tokens only (both light + dark).
Motion through the shared system. See `CLAUDE.md` for the full rules.
