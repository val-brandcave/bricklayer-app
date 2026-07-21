---
Meeting: Bricklayer Discovery — Cody course-correction (screen-share walkthrough of HubSpot)
Date: July 15, 2026
Attendees: Cody Miles (Brandcave), Val Vinnakota (Brandcave)
Product: Bricklayer (RealWired intelligence suite)
Recording: https://fathom.video/share/b4LEzyNSg3fVQeaQ-DKcupxNoPyHRkPq (15 min)
Raw transcript: ../raw-calls/meeting-7-15-2026.md
Screenshots (timestamped to video): ../meeting-screenshots/7-15-2026/ · index: ../meeting-screenshots/7-15-2026/SCREENSHOT-CATALOG.md
Prior call: ./july-14-2026-bricklayer.md
Status ledger updated: ../../DISCOVERY-LOG.md
---

> **How to read this doc.** This is the *processed* record of the meeting — the durable reference. The raw transcript carries the verbatim; this file carries the meaning, the decisions, and what they change. Timestamps in `[m:ss]` point back to the transcript/recording. Screenshot references like `SS @4:28` point to the frame at that video time in the screenshot folder. This is the template we use for every meeting going forward — see **§9 Template** at the bottom.

---

## 1. TL;DR — what changed in one breath

Cody course-corrected our mental model. **Bricklayer's BI skeleton is HubSpot Reporting** — that is literally where Ed is getting his dashboard ideas, so we should study HubSpot and borrow its patterns and its vocabulary. Three concrete resets came out of this call:

1. **Vocabulary flips to HubSpot's.** It's **Dashboards** (collections of reports) and **Reports** (individual charts/tiles) — **not "Boards."** Val conceded the point in-call.
2. **Chat is two distinct surfaces, not one.** A **co-working assistant** (page-aware, summonable, docked **on the RIGHT** because it's secondary) *and* a **full-page threaded chat** (its own destination, where the agent creates charts on the fly). Both must exist.
3. **New primitive: "MCP apps."** Every widget must exist in **two forms** — as a **report tile** on a dashboard *and* as an **MCP app** (an unopinionated UI element the agent returns inside chat). So the widget-library scope roughly doubles.

The prior "four destinations / Briefing / Boards" framing is partly superseded. See **§5 Impact on prior direction**.

---

## 2. Decisions & directives (what Cody instructed)

| # | Directive | Timestamp | Firmness |
|---|---|---|---|
| C1 | **Study HubSpot Reporting directly** — it is the reference model; Ed's dashboard concept comes straight from it. (Cody is adding Val to his HubSpot account: Reporting → Dashboards & Reports.) | [0:27], [11:00], [14:24] | Hard instruction |
| C2 | **Adopt HubSpot nomenclature: Dashboards = collections of Reports; Reports = individual charts.** Drop "Boards." | [4:30], [14:17] | Decided |
| C3 | **Support a standalone report** (a report created without a dashboard) **and a reports list view** (all reports the user or agent has generated). Reflect this in the IA. | [4:47], [5:07] | Decided |
| C4 | **Two chat modalities are both required:** (a) an optional, summonable **co-working experience** that is page/context-aware and can take write actions; (b) a **full-page chat** with threads that returns MCP apps. | [1:05], [2:10] | Decided |
| C5 | **Co-working chat docks on the RIGHT** (it's the secondary/assistant role). Chat only goes on the **LEFT** when it is the *driving force* of the app (Lovable / v0 / Cursor pattern). | [13:10], [13:21] | Decided — corrects our earlier open question |
| C6 | **Build "MCP apps" for every widget type**, in addition to the report-tile version of each. An MCP app = an unopinionated UI element returned in chat. **Two directional kinds:** agent-**needs**-input (e.g. a multi-select, appears above the chat input) and agent-**gives**-output (e.g. a chart or list-view widget). | [1:35], [2:30], [7:20] | Decided — new scope |
| C7 | **The widget library = ~9 chart types** (Cody counted them from HubSpot's chart editor): vertical bar, horizontal bar, line, area, donut, pie, KPI, gauge, table. Each needs its own settings and its MCP-app twin. | [7:40] | Decided (validate exact list against HubSpot) |
| C8 | **Replicate the chart-editor interaction pattern:** search & select a property → choose what to **display** vs **measure** (X/Y) → optionally add **breakdown** properties (2nd/3rd) → set frequency (daily/weekly/monthly) → filter by available properties → **Save** (opens a drawer/modal) → **add to existing or new dashboard**; **Edit** opens the full chart editor. | [7:20]–[11:20] | Decided |
| C9 | **Demonstrate the two headline flows:** (1) on a dashboard, ask a page-aware question via the co-working panel; (2) in full-page chat, the agent builds a chart on the fly and the user can save/pin it to a dashboard. | [3:00], [6:20] | Decided (build target) |

---

## 3. The HubSpot patterns Cody walked through (detailed)

### 3.1 The dashboard canvas
- Dashboards are a **grid of report tiles** (`SS @0:41` — "Sophy Love – General" dashboard: bar chart, horizontal bar, KPI cluster, activity feed). [0:27]
- **Hover a tile → drag to rearrange**; the **grid becomes visible** while dragging. [0:33]
- **Bottom-right resize handle** on each tile → size it to any number of grid squares. [0:45]
- **Dashboard switcher lives top-left** (`SS @4:28` — dropdown with **All / Favorites / My dashboards** tabs + a "Search dashboards" field). *"This is where Ed clearly got his dashboard [switcher] from."* [0:55], [4:30]
- Top-bar actions: **Manage dashboards · Create dashboard · Actions · Share · Add content**; an **Autosaved** indicator; a global **"Find or Ask"** search field; an **Assistant** entry point top-right. (`SS @0:41`, `SS @4:28`)

### 3.2 Dashboards vs Reports vs standalone reports
- HubSpot language, verbatim from Cody: *"You have **dashboards**, which are **collections of reports**. And you have **reports**."* [4:30]
- There is a **list view of all reports** (ones you generated or the AI generated for you). [4:47]
- You can **create a standalone report without a dashboard.** [4:52]
- **Implication for our IA:** the object model is Dashboard → (many) Reports, plus a first-class Reports library, plus AI-generated reports that land in that library. Fold this into the IA. [5:07]

### 3.3 The chart / report editor (the core builder pattern)
- Opened by **Edit** on a chart; *"very advanced."* [7:30]
- **Chart-type picker** at the top — the ~9 types (see C7). [7:40]
- **Data binding = search + select a property, then display it and measure it** — X and Y. *"You have to search and select the property, then display the property and measure it."* [9:40]
- Worked example: daily frequency 1st–30th; had to **drag "Create date" (X) measured by "Contacts" (Y)** to get a by-day bar chart. Getting the axis/frequency right was fiddly. [8:30]–[9:28]
- **Breakdowns:** add a **2nd and 3rd property** (e.g. month **by original source**) to segment a series. [10:20]
- **Per-type constraints:** pie/donut behave the same as each other; **can't hold a date breakdown the way bar/line can** (*"you'd have to remove Create date"*). Note these constraints per widget. [10:00]
- **Save flow:** Save → opens a **drawer** (*"could have been a modal"*) → **add to an existing dashboard or a new dashboard.** *"It's literally calling modals or drawers in the app to perform actions."* [7:20]

### 3.4 The two chat modalities
- **Co-working experience** — context-aware, page-aware, summonable at any time; can chat with the data *and* take **write actions** (create a report, add to a dashboard, spin up a new dashboard). *"That's a co-working experience and that's great because it's context-aware."* Docks **right**. [1:05], [13:10]
- **Full-page chat** — its own page, with **threads**; ask questions about your data; the agent replies with **MCP apps** (incl. charts generated on the fly). *"You also need a full-page chat… where I have threads and I can ask questions about my data and it returns MCP apps."* [1:20], [1:40]
- HubSpot's own co-working AI is **weak** — *"really unimpressive,"* it listed contents instead of just building the chart. That's our opening to do it better. [5:55], [6:55]–[7:17]
- **Null state** with **suggested prompts** — *"here, try these types of prompts"* (e.g. "how many leads last month? show a bar chart by day"). [5:20]

### 3.5 "MCP apps" — the new primitive (from the scientist.com reference)
- Definition Cody gave: an **MCP app is an unopinionated UI element the agent returns in chat**. [1:40]
- **Two directional kinds:**
  - **Agent needs something from me** → an input element (e.g. a multiple-selection prompt) rendered **above the chat input**. [1:50]
  - **Agent gives me something** → an output element (e.g. a **list-view widget**, a chart card). [2:05]
- After the agent generates a chart in chat, it's an **interactive MCP app** the user can **Save or Edit** — Save adds it to a dashboard, Edit opens the full chart editor. [7:20]
- **Reference — scientist.com** (Cody's example, [1:12]; firsthand look confirmed by Val 7/20): a full app shell (Requests / Tools / Products-Services / Search) with **(a)** a page-scoped **generative-AI insight card** ("Insights from Elisa") that streams a contextual narrative about the current record, and **(b)** a **summonable co-pilot** panel offering chat history, new chat, and **expand-to-full-page** — i.e. the exact "pull it out anytime, or go full-page threaded" behavior Cody described.

---

## 4. New / clarified vocabulary (glossary)

| Term | Meaning going forward |
|---|---|
| **Dashboard** | A saved collection of reports laid out on a grid (was "Board"). |
| **Report** | A single chart/visualization/tile. Can live on a dashboard or standalone. |
| **Reports library / list view** | The place all reports live (user-made or AI-made). |
| **MCP app** | An unopinionated interactive UI element the agent returns *inside chat*. Two kinds: input-seeking and output-giving. |
| **Co-working chat** | Summonable, page-aware assistant docked on the **right**; can take write actions. |
| **Full-page chat** | Threaded natural-language destination; agent returns MCP apps. |
| **Write action** | An agent action that changes app state — create report, add to dashboard, create dashboard. |

---

## 5. Impact on prior direction (ledger deltas)

Cross-reference `../../DISCOVERY-LOG.md`. This call revises several PROPOSED decisions from the 7/14 work:

| Prior (7/14–7/15 v0.1) | Now (after 7/15 call) | Action |
|---|---|---|
| **D2** IA = four destinations *Briefing / **Boards** / Properties / Deliverables* | IA reshapes around HubSpot's object model: **Dashboards + Reports (library) + Chat (co-working & full-page) + Properties**. "Boards" retired. Briefing & Deliverables need re-justification within this skeleton (see §6). | **REVISE** |
| **D6** widget system = "~12 typed primitives" | Anchor to **~9 HubSpot chart types**, each in **two forms** (report tile + MCP app). | **REVISE** |
| **D7** chat posture — "Variant A (right panel) vs B (left rail)," pick one | **Resolved & reframed:** it's **both**. Co-working = right (secondary). Full-page chat = its own destination. Left-rail chat is only for chat-as-driver apps, which we are not. | **RESOLVE / SUPERSEDE** |
| **D1** Insights → "Briefing" opinion layer | Not discussed 7/15; not contradicted. Must be re-slotted into the HubSpot skeleton and re-earn its place vs. the dashboard (the 7/14 duplication concern still stands). | **CARRY, re-justify** |
| **D3** RBAC lens at provisioning | Unaffected. | **KEEP (Confirmed)** |
| **D8** Positioning ("analyst with receipts") | Unaffected — arguably strengthened (HubSpot-familiar shell + our depth/provenance). | **KEEP** |

---

## 6. Open questions / tensions to resolve

1. **Does "Briefing" survive, and where?** The opinion/insight layer (7/14 D1) is genuinely valuable, but the HubSpot skeleton has no native home for it. Options: a landing "Home/Briefing" above the dashboards, vs. the scientist.com pattern of an **insight card pinned atop the active dashboard**. (Lean: the pinned-insight-card pattern — it dodges the 7/14 duplication problem.)
2. **Does "Boards" leave any useful idea behind?** The board *lifecycle* (draft / saved / ephemeral / present mode, 7/14 D4) is still useful — it maps cleanly onto **Dashboards** (ephemeral/present-mode dashboards). Keep the lifecycle, drop the name.
3. **Exact chart-type list.** Validate the "9" against HubSpot's live editor (vertical bar, horizontal bar, line, area, donut, pie, KPI, gauge, table) and confirm per-type breakdown constraints.
4. **How different are the two forms of each widget?** Is the MCP-app version literally the same component rendered in a chat bubble, or a lighter variant? (Design decision — lean: same visual component, chat-framed, with Save/Edit affordances.)
5. **Where does "Deliverables/Export" live** in a Dashboards+Reports world? (Likely: export actions on a dashboard/report + present mode, rather than a separate destination.)

---

## 7. Action items

| Owner | Action | Source |
|---|---|---|
| Val | **Get into HubSpot** (Cody is adding her — "4 seats for now") → Reporting → play with Dashboards & Reports & the chart editor; tell Cody when done so he can remove access. | [11:00], [11:40] |
| Val / Claude | Rework the artifacts to the HubSpot skeleton: update **Widget Library** (9 types × 2 forms), revise **IA** (Dashboards/Reports/Chat), reframe **UI Concepts** (right-docked co-working + full-page chat + MCP apps). | [2:30], this call |
| Claude | Produce the **updated direction + recommendations** (this pass) and update `DISCOVERY-LOG.md`. | — |
| — | (Carryover from 7/14, still open) Ed → Cody: video walkthrough; Ed → Cody: CoStar links; Cody → Ed: product suggestions + remaining Parachute feedback. | 7/14 |

---

## 8. Verbatim anchors (for quick citation)

- *"You have dashboards, which are collections of reports… and you have reports."* — Cody [4:30]
- *"The co-working experience should be optional and I should be able to call it out at any time… There should also be the ability to go to a full-page chat where I have threads… and it returns MCP apps."* — Cody [1:05]
- *"In addition to creating all the different types of charts in a widget library, [you] create MCP apps for all those different widgets too."* — Cody [2:30]
- *"Chat on the left if it's the driving force… but when it's just a co-working experience, it should be on the right."* — Cody [13:21]
- *"Really important that you somehow get into HubSpot and you play with this."* — Cody [11:00]
- *"Instead of reports it was called boards, but I guess report makes sense now — just stick with HubSpot nomenclature."* — Val, conceding [14:00]

---

## 9. Template — how we process meetings going forward

Every meeting gets one file in `docs/meetings/processed-calls/` named `<month>-<day>-<year>-<topic>.md`, with these sections:

1. **Frontmatter** — meeting, date, attendees, product, recording link, raw-transcript path, screenshot folder, prior-call link, ledger link.
2. **TL;DR** — the change in one breath (2–4 sentences).
3. **Decisions & directives** — a table of what was instructed/decided, each with a `[m:ss]` timestamp and a firmness rating (Hard instruction / Decided / Proposed).
4. **Detailed notes by theme** — grouped, timestamped, with `SS @m:ss` screenshot references.
5. **New/clarified vocabulary** — a glossary, so language stays consistent across docs.
6. **Impact on prior direction** — an explicit was → now → action delta table against the ledger.
7. **Open questions / tensions** — with our current lean noted.
8. **Action items** — owner → action → source timestamp.
9. **Verbatim anchors** — a handful of quotable lines with timestamps.

Rule: after writing the processed doc, **update `DISCOVERY-LOG.md`** (flip/RE­VISE decisions with a dated note) so the ledger and the meeting record never drift.
