# Bricklayer Discovery — Status & Decision Ledger

**Last updated:** July 20, 2026 (post-Cody course-correction, July 15)
**Owner:** Val (Brandcave) · **Client:** Ed Kruger (RealWired) · **Reviewer:** Cody Miles (Brandcave)

This is the single human-readable ledger for the Bricklayer discovery. Artifacts carry the full arguments; this file tracks *status*. Everything below marked **PROPOSED** is Brandcave's current take awaiting Cody's review — treat as hypotheses, not decisions.

> **⚠️ July 15 course-correction.** Cody rebased our mental model onto **HubSpot Reporting** (that's where client Ed's dashboard ideas come from). Nouns change: **Dashboards + Reports**, not "Boards." Chat = a right-docked **co-working** assistant + a **full-page** threaded chat. New primitive: **MCP apps** (each widget also ships as an in-chat UI element). Full reasoning + recommendations in **`DIRECTION-v2-hubspot-anchored.md`**; meeting record in `meetings/processed-calls/july-15-2026-bricklayer.md`. Rows below are updated with dated REVISED notes.

---

## 1. Source of truth map

| What | Where |
|---|---|
| **Direction v2 (current north star)** | `docs/DIRECTION-v2-hubspot-anchored.md` |
| Raw call transcript (7/14) | `docs/meetings/raw-calls/meeting-7-14-2026.md` |
| Processed call insights (7/14) | `docs/meetings/processed-calls/july-14-2026-bricklayer.md` |
| Raw call transcript (7/15, Cody course-correction) | `docs/meetings/raw-calls/meeting-7-15-2026.md` |
| **Processed call insights (7/15)** | `docs/meetings/processed-calls/july-15-2026-bricklayer.md` |
| HubSpot screenshot catalog (timestamp-mapped) | `docs/meetings/meeting-screenshots/7-15-2026/SCREENSHOT-CATALOG.md` |
| POC screenshots (7/14, timestamped to video) | `docs/meetings/meeting-screenshots/7-14-2026/` |
| **Ed POC catalog + reconciliation audit (Direction-v2 vs what Ed built)** | `docs/meetings/meeting-screenshots/7-14-2026/ED-POC-CATALOG.md` |
| CoStar competitive research (full, cited) | `docs/research/costar-competitive-research-2026-07-15.md` |
| AI-BI UX pattern research (full, cited) | `docs/research/ai-bi-ux-patterns-2026-07-15.md` |
| Voltagent DS (deliverable styling only, NOT the app's DS) | `docs/docs-desingn-sys/DESIGN-System-voltagent.md` |

## 2. Deliverables (v0.1, July 15–16, 2026)

| Artifact | URL | Status |
|---|---|---|
| 🧱 **Product Model & IA** (HubSpot object model · 5 destinations · 2 chat surfaces · lenses · deliverables-as-actions) | https://claude.ai/code/artifact/e5dbbd95-166d-4c8e-b613-cb207e572b96 | ✅ REBASED (7/20) — source `docs/artifacts/ia-object-model.html` |
| 🧭 **User-Flow Wireframes** (6 flows: entry/lens, daily loop, ask→save, build-a-dashboard, explain-this, deliverables) | https://claude.ai/code/artifact/4aeeab19-c7a7-4cb2-a54a-a2522be7c20e | ✅ REBASED (7/20) — source `docs/artifacts/user-flows.html` |
| 📦 **Review Package (front door / index)** | https://claude.ai/code/artifact/c7c9aa07-00ba-468d-9bfe-251fbe6c85cc | ✅ NEW (7/20) — course-correction + decisions + all 5 in reading order; source `docs/artifacts/review-index.html` |
| 🧩 **Widget Library v1** (14 types × two forms · two-layer catalog · modal builder · property-workspace set) | https://claude.ai/code/artifact/c30b5b83-bc42-48d5-9c98-a7f40ad8b141 | ✅ REBUILT (7/20) — redeployed in place; source `docs/artifacts/widget-library-v1.html` |
| 🧠 **Insights — per-lens landing** (AI TODAY read · finding-cards · surprising links · focus panel + BRICKLAYER'S READ · Explain-this · Insights≠Dashboard) | https://claude.ai/code/artifact/b2e392c0-7ef7-48e4-99a6-b050b4122409 | ✅ NEW (7/20) — source `docs/artifacts/insights-concept.html` |
| 🔭 CoStar Competitive Brief | https://claude.ai/code/artifact/914b397b-d326-4f4c-a019-224214adaf80 | Research — factual, cited (unaffected) |
| 🖥️ **UI Concepts — Chat × Dashboard** (canvas · right-docked co-working · full-page chat · placement rule · MCP-app directions · save modal · build-a-dashboard) | https://claude.ai/code/artifact/ba767cff-1c9b-4a9b-9091-7ef9e5876301 | ✅ REBASED (7/20) — source `docs/artifacts/ui-concepts.html` |

## 3. Decision ledger

| # | Call | Status | Rationale (short) |
|---|---|---|---|
| D1 | Insights tab → **Briefing** (opinion layer: claim + evidence + action; never duplicates board widgets) | REVISED (7/20) | Concept survives, re-slotted: **pinned generative-AI insight cards atop the active dashboard** + a light Home/Briefing (per scientist.com pattern), not a second dashboard. Awaiting Cody. See DIRECTION-v2 §6 |
| D2 | ~~IA = four destinations (Briefing / **Boards** / Properties / Deliverables)~~ → **IA = HubSpot object model: Dashboards + Reports (library) + Chat (co-working & full-page) + Properties + Briefing** | REVISED (7/20) | "Boards" retired. Deliverables demoted from a tab to export/present **actions** (DIRECTION-v2 §7). See DIRECTION-v2 §1 |
| D3 | Role = **RBAC lens badge at provisioning**, no switcher | CONFIRMED by Ed (7/14, 19:44) | Demo switcher was demo-only |
| D4 | Board **lifecycle**: draft / saved / ephemeral / present mode | REVISED (7/20) | Lifecycle idea **kept**, re-hung on **Dashboards** (ephemeral dashboard + Present mode). Only the word "Board" dies |
| D5 | **Layered trust**: editable "how I read it" + ✓ Verified + provenance-to-appraisal-page + review routing | PROPOSED | Ed's eval question; CoStar's black-box Compass is the foil — "analyst with receipts" |
| D6 | ~~Widget system = ~12 bespoke primitives~~ → **the ~9 HubSpot chart types + domain adds (scatter/pivot/combination/list), each in TWO forms: dashboard tile + MCP app** | REVISED (7/20) | Anchored to HubSpot's editor (9 types: v-bar, h-bar, line, area, donut, pie, KPI, gauge, table). Dual-form = biggest new ask. See DIRECTION-v2 §3–4 |
| D7 | ~~Chat posture: Variant A vs B~~ → **RESOLVED: co-working chat docks RIGHT (secondary); full-page threaded chat is its own destination; LEFT only if chat is the driver (not us)** | RESOLVED (7/20) by Cody | Cody's rule [13:21]; placement encodes AI role. Supersedes the A/B question |
| D8 | Positioning: "CoStar is a database with reports; Bricklayer is an analyst with receipts" | PROPOSED (strengthened) | Familiar HubSpot chassis + our depth/provenance; HubSpot's own AI (Breeze) is weak & single-object — our opening. See DIRECTION-v2 §8 |
| D9 | Deliverable docs styled in Voltagent DS; app's product DS = later phase | CONFIRMED by Val | Val's call, 7/15 |

## 4. Open questions (need Cody / Ed)

1. **Chat posture** — A vs B (see D7). The main design ruling needed.
2. **Default board content per lens** — deliberately deferred until product understanding deepens (Cody's own framing); Ed's Friday bank demo + his walkthrough video should inform it.
3. **How opinionated is "good"?** — Briefing's model: fixed per lens vs tuned per bank at onboarding vs learned from dismissals. (Brandcave lean: start prescriptive per lens.)
4. **Naming** — "Briefing" vs "Insights"; "Boards" vs "Dashboards." (Brandcave lean: Briefing / Boards.)
5. **Eval surfacing** — how much of RealWired's eval/verification machinery shows up in-product (badges only vs a visible review queue)?

## 5. Known unknowns / waiting on

- **Ed's video walkthrough** (action item from 7/14) — check flows against behavior stills couldn't show.
- **Ed's CoStar links/examples** (action item) — fold into the competitive brief when received.
- **Friday bank demo reactions** — first real user signal; may reshape default boards and the Briefing.
- CoStar for Lenders has **no public screenshots** — consider requesting a demo for a firsthand UI read.

## 6. Next steps (updated 7/20)

1. **Val ratifies DIRECTION-v2 §9** (naming, Briefing model, widget set, dual-form, deliverables-as-actions) — ideally a quick Cody check on naming + Briefing before we redraw.
2. **Val into HubSpot** (Cody is adding her) → Reporting → Dashboards & Reports & chart editor; confirm the 9 chart types, frequency options, and per-type breakdown constraints firsthand.
3. **Rework artifacts in priority order** (same URLs, redeploy in place): **Widget Library v1 first** (9 + adds × two forms + builder pattern) → IA/object model → UI concepts (right co-working + full-page + MCP apps).
4. Only after Cody signs off on direction: the app's real design system + hi-fi mocks (D9 — later phase).
5. Still open from 7/14: Ed's video walkthrough + CoStar links; Friday bank-demo reactions → revisit default lens dashboards.
