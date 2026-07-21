# Bricklayer — Direction v2 (post-Cody, HubSpot-anchored)

**Date:** July 20, 2026 · **Owner:** Val (Brandcave) · **Trigger:** Cody course-correction call, July 15 (`docs/meetings/processed-calls/july-15-2026-bricklayer.md`)

**What this doc is.** The July 14 discovery (v0.1 artifacts) built a bespoke IA — *Briefing / Boards / Properties / Deliverables*. On July 15 Cody course-corrected: **Bricklayer's BI skeleton should be HubSpot's Reporting product**, because that is literally where the client (Ed) is drawing his mental model. This doc rebases our direction onto that skeleton, says explicitly what we keep / rename / kill, and answers the open product questions with a recommendation on each. It is backed by three parallel deep-dives run July 20 (HubSpot mechanics, a timestamp-mapped screenshot catalog, and external MCP-app / generative-UI research) — cited inline as **[HS]**, **[SS]**, **[GEN]**.

---

## 0. The reframe in one paragraph

Stop inventing an IA. **Adopt HubSpot's object model — Dashboards (collections of reports) + Reports (individual charts) + a Reports library — and layer our real differentiator on top: a genuinely good analytics copilot.** HubSpot gives us the *familiar, boring, correct* BI chassis Ed already has in his head; its own AI ("Breeze") is weak and single-object-bound **[HS]**, which is precisely the gap we win on. Chat is not one thing — it's a **summonable, page-aware co-working assistant (docked right)** *and* a **full-page threaded chat** where the agent builds charts on the fly. Every chart we design must exist in **two forms**: a dashboard **tile** and an in-chat **MCP app**. That dual-form widget library is the core of the build.

---

## 0.5 Canonical vocabulary (locked July 20) — Widget vs Report vs Dashboard

Adopted to end the term-collision between Ed's, Cody's, and HubSpot's usage:

- **Widget (widget type)** = the *kind* of visualization — bar, line, scatter, map, heatmap, KPI, table, scenario… (~13). A reusable **design-system component / primitive**. This is what we *build*.
- **Report** = a *saved, data-bound instance* of a widget type ("Avg cap rate by vintage"). The **object** — listable in the Reports library, reusable, permissioned, droppable onto many dashboards. (HubSpot's core noun.)
- **Dashboard** = a *saved collection of reports* on a grid. (= Ed's "board.")
- **Tile** = a report rendered *on a dashboard*. **MCP app** = the *same report* rendered *in chat* (with Save/Edit).
- **Starter reports** = Ed's ~19 "pre-built widgets" = a catalog of ready-made report instances (the "Add a widget" modal is really "add a report").

> **One sentence:** a **widget** (type) is configured with data into a **report** (object), which appears as a **tile** on a **dashboard** or as an **MCP app** in **chat**.
>
> Standardize: reserve "widget" for the *type* (Cody's usage), "report" for the *instance* (HubSpot), "dashboard" for the *collection*. Ed's "widget" (the tile) = a report; Ed's "board" = a dashboard.

**Create/edit = app-level modals, NOT the in-chat drawer (decided by Val, July 20).** HubSpot traps the create/save flow inside the chat drawer; we use **general modals** instead. Consequence: the report editor / add-to-dashboard / new-dashboard flow is the **same modal whether opened from a dashboard's "Add content" or from Save/Edit on an MCP app in chat** — one editor, two entry points. Chat's write actions *call the shared app surfaces*; they don't rebuild them inside the conversation.

---

## 1. The object model & IA

**Adopt HubSpot's nouns verbatim** (Cody's instruction; Val conceded in-call):

```
Bricklayer
├── Home / Briefing            ← the opinion layer (see §6) — our differentiator, kept but re-slotted
├── Dashboards                 ← saved collections of Reports on a grid canvas
│     ├── default dashboard per lens (star-set; changeable via switcher — HubSpot pattern) [HS]
│     ├── Dashboard switcher (top-left: All / Favorites / Mine + search)    [SS]
│     └── Dashboards list / manage view (all dashboards, user- & AI-made)   [HS]
├── Reports                    ← the library / list view: every report, user- or AI-made
│     ├── standalone report (saved with no dashboard)                       [HS]
│     ├── filter/sort (owner · last-updated · dashboard · tags) + saved views [HS]
│     └── report → can attach to many dashboards
├── Properties                 ← the individual-asset altitude (portfolio → property drill-down)
└── Chat                       ← two surfaces, one agent (see §2)
```

**Object rules borrowed from HubSpot (so we don't re-litigate them) [HS]:**
- A **Report** is one visualization answering one question. A **Dashboard** is a collection of reports for one purpose/role.
- A report can live standalone in the library and be added to **many** dashboards.
- **Access inheritance:** once a report is placed on a dashboard it inherits that dashboard's access — worth mirroring given our RBAC lenses.
- Dashboard access levels: private / everyone-view / everyone-edit / assigned. Deleted dashboards restorable ~14 days.

**Left-nav = Dashboards · Reports · (Properties) · (Briefing)** — mirrors HubSpot's Reporting split (Dashboards / Reports / Goals) **[SS]**.

---

## 2. The two chat surfaces (this resolves old D7)

Cody's rule, now our rule — **placement encodes the AI's role** (the external research backs this taxonomy precisely) **[GEN]**:

| Surface | Role | Placement | Behaviour |
|---|---|---|---|
| **Co-working assistant** | Secondary — assists within the page you're on | **Right-docked, summonable** (⌘K / button), collapsible | Page- & context-aware. Chat with the data on screen + take **write actions** (create report, add to dashboard, new dashboard). Can be **promoted to full-page.** |
| **Full-page chat** | Primary NL destination | Its **own page**, threaded | Ask questions across the whole book; agent returns **MCP apps** incl. charts built on the fly; save/pin them into dashboards. Null state shows **suggested prompts** [SS]. |

**The rule for LEFT vs RIGHT** (settles the Cursor-side-swap idea Val raised): chat docks **left only when it is the driving force** of the app (Lovable / v0 / Cursor — "describe outcome, AI builds everything"). Bricklayer's chat is an **assistant over existing dashboards**, so it docks **right**. The design community's decision rule matches: *left = collaborative/iterative co-creation; right = task interpretation within an existing workflow* **[GEN]**.

**Two headline flows to demonstrate** (Cody's build target):
1. **On a dashboard →** summon co-working chat → ask a page-aware question → agent answers / adds a tile.
2. **In full-page chat →** ask a book-wide question → agent renders a chart MCP app → user **Saves** it to a dashboard.

---

## 3. MCP apps — the dual-form widget doctrine

**Definition (Cody's, confirmed by research):** an **MCP app is an unopinionated interactive UI element the agent returns inside chat** — not text, not a static image. This is now a shipping standard: **MCP Apps (SEP-1865)** — UI registered as a `ui://` resource, rendered in a sandboxed iframe, talking to the host over JSON-RPC — launched Jan 2026 across **Claude, ChatGPT, VS Code, Goose** with Anthropic/OpenAI/Microsoft/Google as partners **[GEN]**. We are designing *for a real, current pattern*, not a hypothesis.

**Two directional kinds** (Cody's framing, and both are established patterns) **[GEN][SS]**:

| Direction | What it is | Established mechanism | Bricklayer examples [SS] |
|---|---|---|---|
| **A — agent needs input FROM user** | Rendered above the composer | **MCP Elicitation** / approval cards (JSON-schema form the client renders) | numbered multi-select list, filter/criteria chips, a "which portfolio?" picker, a **confirm before write** card |
| **B — agent gives output TO user** | A widget the agent returns | tool-call → fixed component (Vercel `render`/`streamUI`; Thesys C1) | an on-the-fly chart with **Save / Edit**, a property **list-view** widget, a KPI card |

**The doctrine:** *every chart type in the library ships in two forms* — a **Dashboard tile** and an **MCP app** (same visual component, chat-framed, carrying **Save / Edit** affordances). Save adds it to a dashboard; Edit opens the full chart editor. This is why the widget-library scope roughly doubles — it's the single biggest new ask from the call.

**Build principle we should commit to:** the agent **composes from a closed set** of typed widgets — it never draws arbitrary UI. Expose each widget as a tool with a strict schema; the model picks and parameterizes, it does not invent markup. This is the consensus safe pattern (Vercel generative UI, MCP `ui://` templates, Thesys) and it's exactly Cody's "unopinionated primitives the agent picks from" from July 14 **[GEN]**. Practical detail worth stealing from the OpenAI Apps SDK: return **structured data to the widget separately from the model's context** so a full dataset can feed a chart without flooding the model **[GEN]**.

---

## 4. The widget library, v1 (replaces the old "12 primitives")

**Anchor set — the 9 HubSpot chart types Cody counted** (confirmed across the editor frames) **[SS][HS]:**

1. Vertical bar (column) · 2. Horizontal bar · 3. Line · 4. Area · 5. Donut · 6. Pie · 7. KPI / summary · 8. Gauge · 9. Table

**Recommended additions for CRE-appraisal analytics** (some are HubSpot builder types; the last three are **required by Ed's POC** and were *missing* from the first draft — see §11 audit) **[HS][POC]:**
- **Scatter plot** — Ed explicitly asked for "value vs cap rate as a scatter" on July 14; renders with a trend line in the POC. Non-negotiable for this domain.
- **Pivot table** — segmentation/concentration analysis (tenant, class, geography) is pivot-shaped.
- **Combination (dual-axis)** — e.g. value trend (bars) vs risk index (line).
- **List-view / feed / ranked-watchlist tile** — the "Priority signals" feed and the **Risk watchlist** (scored 0–100 + WHY column) in the POC. More specific than a generic list.
- **⭐ Geographic map** — the "Property distribution" US bubble map is a recurring POC tile and geographic exposure/over-exposure is a use case Ed named. **Was missing; now core.**
- **⭐ Heatmap / correlation matrix** — two variants render prominently (valuation-staleness class×age heatmap; "what moves with what" r-value matrix; a "Trend integrity / Simpson's-paradox" check). **Was missing; now core.**
- **⭐ Interactive scenario / stress tile** — the Credit-Officer "Direct-cap reprice" tile takes **editable Cap/Occ inputs** and recomputes scenario rows. An *output widget that also takes input in-place* — a class of its own (blurs the §3 A/B split). **Was missing; add as a distinct class.**

**Two layers, not one** (this is the reconciliation with Ed's actual build **[POC]**): the library has (a) **chart-type primitives** — the ~9 + above, the unopinionated blocks the agent composes from (Cody's framing); and (b) **pre-built domain widgets** — ~19 curated, parameterized reports Ed already defined (Avg cap rate by vintage, Value vs cap by class, Value by flood zone, Valuation approach mix, Trend integrity…), surfaced in an **"Add a widget" modal**. Ed's own words: *"some of these charts are predefined… I've defined a bunch from a predefined perspective,"* plus *"giving the LLM an opportunity to find an X and a Y."* **The widget-library artifact must show both layers** — the primitives *and* a starter catalog of domain widgets.

**Per-type constraints to encode** (from HubSpot, saves us discovering them the hard way) **[HS]:** bar/line/area/combination are the breakdown + multi-series workhorses (support break-down-by, stacking, multiple Y-axes); **pie caps at 25 sections**; pie/donut are single-metric (can't hold a date breakdown the way bar/line can — Cody hit this live); scatter takes only measures/date fields; KPI/gauge/summary are single-value, least breakdown-oriented.

**The builder pattern each widget shares** (replicate this — it's the core interaction) **[HS][SS]:**
- Data binding uses two field kinds: **Dimensions** (categories/dates — the X-axis / break-down; HubSpot renders them **grey**) and **Measures** (aggregated numbers — the Y-axis; rendered **green**).
- Flow: **search a property → place on axis (display) → measure it → break down by a 2nd/3rd property → set frequency (day/week/month…) → filter by available properties → pick chart type → Save.**
- **Save = an app-level modal** (Val's decision, §0.5 — not the in-chat drawer) with three options: *don't add to a dashboard* / *add to existing* / *add to new* → then set access **[HS][SS]**. Same modal whether opened from a dashboard or from Save/Edit on an MCP app in chat.

**Dashboard-canvas interactions to replicate [HS][SS]:** drag tile to rearrange (grid overlay + "Drag to move" tooltip while dragging), **bottom-right resize handle** spanning grid squares, autosave, per-tile ⋮ menu (rename / clone / remove / refresh / filter), **Add content → Report** to drop a tile.

---

## 5. Keep / Rename / Kill (explicit)

| Verdict | Item | Note |
|---|---|---|
| **KILL the word** | "Boards" | Retire it. It confused the model against Ed's HubSpot frame. |
| **KEEP the idea** | Board *lifecycle* (draft / saved / ephemeral / present-mode) | Re-hang it on **Dashboards**: an *ephemeral dashboard* (built for one meeting, expires) and a **Present mode**. This was genuinely good (7/14 D4) — only the name dies. |
| **RENAME** | Boards → **Dashboards**; individual charts → **Reports** | HubSpot nouns, verbatim. |
| **KEEP + re-slot** | "Briefing" / Insights opinion layer | See §6 — survives, but must earn its place vs. the dashboard. |
| **KEEP** | RBAC lens at provisioning (D3) | Unaffected. Confirmed. |
| **KEEP** | Positioning: "analyst with receipts" (D8) | Strengthened — familiar HubSpot chassis + our depth/provenance. |
| **RESCOPE** | "Deliverables" as a top-level destination | See §7 — becomes export/present actions on dashboards & reports, not its own tab. |
| **REPLACE** | Widget library "12 bespoke primitives" (D6) | → the 9 + domain additions above, each in **two forms**. |

---

## 6. Where "Briefing" goes now

The opinion layer (system holds a view of what "good" looks like, proactively raises concerns — Cody's own July 14 framing) is still our sharpest differentiator, but the HubSpot skeleton has no native home for it, and the July 14 duplication concern (Insights ≈ dashboard + AI text) still stands.

**Recommendation (revised after the POC audit — see §11):** keep Insights as a **real surface**, not a thin landing. Ed's POC Insights is his proudest work and a genuine differentiator: a three-column **workspace** — an AI "TODAY" narrative, a scrollable list of **finding-cards** + a **"surprising links"** (LLM-discovered correlations) row, and a **focus panel** where clicking a card swaps in a chart + a **"BRICKLAYER'S READ"** that *reasons about and critiques its own number* (e.g. "this outlier is almost certainly a data-entry artifact — rerun the regression") + **"DIG DEEPER" follow-up chips** + an inline **Ask** box. That read-and-critique behavior *is* the "analyst with receipts" made literal — don't throw it away.

The move to make: reconcile it with Cody's duplication concern by **not duplicating the dashboard's tiles** — Insights is the *opinion/critique* layer (claim → evidence → **AI read** → action), the dashboard is the *browse* layer. Keep:
- **Insights as a first-class destination** with the focus-panel + follow-up-chips + AI-read interaction.
- Optionally, the lighter **pinned insight card** atop a dashboard (scientist.com pattern) for the in-context case.

This keeps Ed's best idea, satisfies Cody (opinion layer ≠ dashboard copy), and matches both reference apps.

**Insights is per-lens — this is the landing (Val, July 20).** On login you land on Insights *for your lens*: the POC proves it (the Lender/Credit-Officer Insights and the Portfolio-Manager Insights are genuinely different — different findings, different focus charts, different "surprising links"). The lens shapes what's surfaced and how it's read. So Insights = **the role-based landing page**, not a side-tab.

**We lean on Ed's mock for the *kinds* of insight, not its layout (Val, July 20).** Take the insight *types* Ed proved valuable — book concentration, valuation staleness, condition/price premiums, the "surprising links" correlations, appraiser-workload/quality flags, data-health/extraction QA — but render them in **our own pattern**, keeping only what's beneficial. His three-column layout is a reference, not a spec; our job is the better pattern for the same intelligence. Open design question that now matters more: **how "good" is defined per lens** (fixed per lens / tuned per bank at onboarding / learned from dismissals) — see §9. Nailing this surface is a priority for the redraw.

---

## 7. Where "Deliverables / Export" goes now

Ed called export the "average → great" gap (7/14). In a Dashboards+Reports world it's **not a destination** — it's **actions**: "Export this dashboard as a credit-ready packet," "Create the credit note for this property," plus **Present mode** and **ephemeral dashboards**. Attach them to dashboards/reports (HubSpot has export-unsummarized-data + share; we go further with the credit-packet framing). Keep it first-class as *capability*, not as a *tab*.

---

## 8. How we beat HubSpot (the opening)

Cody called HubSpot's co-working AI "really unimpressive"; the research confirms why — **Breeze is a prompt-to-single-report generator, single-object only, HubSpot-data-bound, thin iteration** **[HS]**. Our wedge:
- **Cross-object, book-wide reasoning** (the whole appraisal data lake), not one-object reports.
- **A real copilot**, not a report wizard: page-aware co-working + threaded full-page, with **write actions** and **save-to-dashboard** as first-class (Hex/Julius do this well; HubSpot doesn't) **[GEN]**.
- **Provenance / "receipts"** — every number traceable to the appraisal page. This is the "analyst with receipts" line made literal, and it's the thing neither HubSpot nor CoStar has.

---

## 9. Decisions — LOCKED (Val, July 20)

All of the below are decided for now. Two (naming, chat dock) are also for Cody to bless; the rest are Brandcave's to run with.

1. **Naming — Dashboards + Reports** ("board" retired). ✅
2. **Chat dock — RIGHT** (co-working, summonable) + full-page threaded chat as its own destination. Ed's left-dock deliberately set aside. ✅
3. **Insights — a real, per-lens landing workspace** (focus-panel + AI "read"/critique + follow-up chips), leaning on Ed's mock for the *kinds* of insight in **our own pattern**. Opinion model: **fixed per lens now → tuned per bank at onboarding → learns from dismissals (v2).** ✅ (§6)
4. **Widget set — core 9 + domain (scatter, map, heatmap/matrix, list/watchlist, interactive-scenario) + a starter catalog of pre-built domain reports.** Pivot/combination = fast-follow. Every type ships in both forms. ✅ (§4)
5. **Both forms = the SAME component**, chat-framed with Save/Edit (not a separate lighter variant). ✅
6. **Deliverables = actions, not a tab** (export / credit-note / present-mode on dashboards & reports). ✅ (§7)
7. **Create/edit = app-level modals**, not the in-chat drawer; one editor, two entry points. ✅ (§0.5)
8. **Build order — Widget Library v1 and Insights concept in parallel** (shared DS/vocabulary brief prevents drift); IA + UI-concepts rework follows. Artifacts are Voltagent-DS **discovery** deliverables; the app's real design system/palette is a later, separately-directed deliverable. ✅

*Still genuinely open (not blocking the redraw):* **eval surfacing** — badges + provenance now vs. a visible review queue later (*lean: badges + provenance now*); and the per-lens **default dashboard content**, deferred until Ed's video + the Friday demo per Cody's own framing.

---

## 10. Artifact plan (what to redraw, in priority order)

The v0.1 artifacts redeploy in place (same URLs). Proposed order:

1. **Widget Library v1** — the 9 + additions, each shown in **both forms** (tile + MCP app), plus the builder pattern and per-type constraints. *(Highest priority — it's the concrete new ask.)*
2. **IA & object model** — Dashboards / Reports / Chat / Properties / Briefing; kill "Boards"; the object rules from §1.
3. **UI concepts** — right-docked co-working chat + full-page chat + the two MCP-app directions + save-to-dashboard flow; drop the A/B posture framing (resolved).
4. **(Later, after Cody signs off)** the app's real design system + hi-fi mocks.

> Gate: this is a direction reset. Recommend Val ratifies §9 (ideally a quick Cody check on naming + Briefing) **before** we invest in redrawing hi-fi artifacts, to avoid rework.

---

## 11. Reconciliation with Ed's POC (July 20 audit)

Before redrawing, we audited all 25 of Ed's July-14 POC screenshots against this direction (`docs/meetings/meeting-screenshots/7-14-2026/ED-POC-CATALOG.md`), verified against the raw transcript. **Verdict: the big mechanics hold — HubSpot object model, chat-builds-charts, save-to-dashboard, drill-down, provenance/"receipts," lens-specific dashboards, export-as-actions, ephemeral/present.** The reframe does not contradict Ed; in fact Cody said *"very HubSpot"* twice *during Ed's own demo*, and Ed himself said *"I want an entire new **dashboard**."* But the audit caught concrete things the first draft dropped or thinned. Folded in above; summarized here.

**Now folded into the direction:**
| Gap the audit found | Fix |
|---|---|
| No **map**, **heatmap/correlation-matrix**, or **interactive-scenario** widget | Added to the §4 library as core types (all three render in the POC). |
| Widget library modeled as one layer | §4 now models **two layers**: chart primitives + a starter catalog of Ed's ~19 pre-built domain widgets. |
| **Insights** downsized to a "light Home" | §6 restored to a real workspace (focus-panel + AI "read"/critique + follow-up chips). |
| **Individual-property workspace** named but not specced | Must be enumerated when the Widget Library is drawn: valuation-approaches variance bar, cap-rate sensitivity grid, comparable-sales table w/ CoV badge, appraisal-detail table (appraiser, license, flood zone, zoning), appraisal signals, "Worth a check" anomaly flags, per-tile provenance. Treated as its own widget set. |

**New named patterns to carry into the flows/UI artifacts:**
- **"Explain this" (right-click → reason).** Right-click a tile/table row (e.g. a Risk-watchlist entry) → **"Explain this property"** → the agent reasons *in chat* about why it's flagged (cap below class avg, stale, thin comps) → offers **"Open property workspace."** One of Ed's clearest "this is what we want people to feel" moments; it's a context-scoped co-working invocation. Name it explicitly.
- **Agent builds a whole dashboard on the fly** (Ed's "most powerful function") — not just one tile. The full flow: **"Build this board" empty state** → suggestion chips (*"concentration & cap-rate risk dashboard"*) → agent assembles → **"NEW BOARD READY · 13 widgets · Open board (your current one is kept)"** confirmation. Elevate whole-dashboard generation to a headline capability alongside single-report generation.
- **"BRICKLAYER'S READ" — the skeptical AI critique** attached to a focus chart (loading → populated; challenges its own number). This is the sharpest expression of "analyst with receipts" — make it a first-class component, not just narration.
- **Prescriptive-per-lens correlations.** Ed: *"an LLM is bad at deciding which two things belong together,"* so surfaced correlations stay curated per lens. A guardrail on the Insights/Briefing engine.

**On the two tensions the audit raised — both now settled (Val, July 20):** **chat dock = right** (Cody's read stands, Ed's left-dock set aside); **naming = Dashboards** ("board" retired despite being load-bearing in Ed's POC — a conscious, accepted change).

**Bottom line for Val:** same core conclusions — the HubSpot rebase is sound and does not lose Ed. What changed after the audit: **+3 widget types (map, heatmap, scenario), a two-layer widget model, Insights kept full-size, three named interactions restored (Explain-this, build-a-whole-board, AI-read), chat-dock settled right, and canonical vocabulary + a modal-based create flow locked (§0.5).**
