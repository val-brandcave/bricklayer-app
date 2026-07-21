# HubSpot Walkthrough — Screenshot Catalog (7/15/2026)

Reference material for the Bricklayer design discovery. 31 screenshots captured from a screen-share recording (video length 14:55) in which Cody Miles walks Val through how HubSpot does dashboards, reports, the chart editor, and how the scientist.com reference app does chat + "MCP apps." The final screenshot is Val's own Bricklayer concept artifact.

Video timestamp is read from the bottom-left of each frame. Where a frame is a tight crop with no video scrubber visible, the timestamp is marked "not visible" and the moment is inferred from surrounding frames.

Source transcript: `../../raw-calls/meeting-7-15-2026.md`

---

## Per-screenshot catalog

### 1. Screenshot 2026-07-20 204311.png — 0:41
- **Screen/state:** HubSpot dashboard, populated grid view. Dashboard title "Sophy Love - General" (favorite star + dropdown caret) top-left; "Manage dashboards / Create dashboard / Actions / Share / Add content" actions top-right.
- **UI pattern:** Full dashboard grid of report tiles: a **column/vertical bar** chart ("Closed revenue by month with deal total and closed revenue breakdown"), a **horizontal bar** chart ("Deals with most recent revenue totals by source"), a **KPI tile** ("Contacts created and worked totals…"), and an **activity feed** ("Team activities by activity date"). Cursor sits on the top-left of the revenue chart (start of a drag). Per-tile header controls: refresh, add, expand, kebab menu. Per-tile date/filter chips ("LAST QUARTER | MONTHLY", "FILTERS (1)").
- **Transcript moment (~0:27–0:41):** "What you're looking at are charts in HubSpot. Notice how when I hover on a chart, I have the ability of dragging… you can see the tooltip."

### 2. Screenshot 2026-07-20 204321.png — 0:43
- **Screen/state:** Same dashboard, chart-hover state.
- **UI pattern:** **"Drag to move" tooltip** displayed at the top-left of the hovered revenue chart tile — the drag affordance called out in the transcript.
- **Transcript moment (~0:43):** "I can drag and drop to rearrange."

### 3. Screenshot 2026-07-20 204340.png — 0:52
- **Screen/state:** Dashboard mid-drag / rearrange.
- **UI pattern:** **Grid overlay visible while dragging** — empty dashed placeholder cells show the underlying layout grid; a tile is being dragged with the "Drag to move" tooltip; **"Autosaved"** indicator appears top-right (replacing filter row). Demonstrates the drag-to-rearrange + snap-to-grid behavior.
- **Transcript moment (~0:41–0:52):** "Notice also that the grid is inherently seen here… when I'm moving this chart, you can see the parts of the grid."

### 4. Screenshot 2026-07-20 204403.png — timestamp not visible (tight crop; context ≈ 0:52–1:00)
- **Screen/state:** Close-up of a single KPI tile ("Contacts created and worked totals with deals created and won totals").
- **UI pattern:** **Resize handle** — the dotted/hatched triangle in the **bottom-right corner** of the tile, the affordance used to resize a widget across grid squares.
- **Transcript moment (~0:53):** "in the bottom right corner you can see the little dragger. I can rearrange the size… however many squares I want."

### 5. Screenshot 2026-07-20 204416.png — timestamp not visible (tight crop; context ≈ 0:52–1:00)
- **Screen/state:** Dashboard during a resize, KPI tile ("Contacts creat…") active.
- **UI pattern:** KPI tile with **bottom-right resize handle** highlighted; adjacent **empty dashed grid cells** show where the tile will reflow. Reinforces the resize-by-grid-squares pattern.
- **Transcript moment (~0:53):** same resize-handle moment as above.

### 6. Screenshot 2026-07-20 204520.png — 2:01
- **Screen/state:** **Reference app — scientist.com** (browser tab "Scientist — AI Co-pilot"). Request detail page "Targeted NGS panel — somatic variant calling," left rail of request metadata, "Insights from Elisa" AI summary card at top. No chat panel open yet.
- **UI pattern:** A product page with an inline AI insight card ("Talk more with Elisa" CTA). Establishes the page a co-working chat can be pulled out from.
- **Transcript moment (~1:20–2:01):** "if I go to scientist.com as a reference… there's some information, I can also pull out a co-working experience and chat with it."

### 7. Screenshot 2026-07-20 204535.png — 2:06
- **Screen/state:** scientist.com request page **with the "Elisa" co-working chat panel docked on the RIGHT**.
- **UI pattern:** **Co-working chat modality** — secondary chat sits on the right, page content remains on the left; the chat is context-aware of the request. Panel has expand/close controls. This is the "chat as a secondary/co-working experience → right side" example Val and Cody later discuss.
- **Transcript moment (~2:06):** "I can pull out a co-working experience… the co-working experience should be optional and I should be able to call it out at any time."

### 8. Screenshot 2026-07-20 204559.png — 2:20
- **Screen/state:** scientist.com **full-page chat** (URL `/chat`).
- **UI pattern:** **Full-page chat modality** — left sidebar with "New chat," Search, and a "Recent" **thread list** (CROs for in vivo PK studies, Pooled human liver microsomes, etc.); large empty conversation canvas; chat composer pinned at bottom ("Ask Elisa about products"). The full-screen, threaded natural-language experience.
- **Transcript moment (~2:12–2:20):** "There should also be the ability to go to a full page chat like this where I have threads and I can ask questions about my data."

### 9. Screenshot 2026-07-20 204610.png — 2:25
- **Screen/state:** scientist.com full-page chat with an exchange in progress (user message + assistant reply, thumbs up/down feedback controls).
- **UI pattern:** Standard threaded chat message list; feedback affordances under each assistant turn.
- **Transcript moment (~2:20–2:25):** demonstrating the full-page thread experience.

### 10. Screenshot 2026-07-20 204640.png — 2:47
- **Screen/state:** scientist.com full-page chat showing an **MCP app of the "agent-needs-input" type**.
- **UI pattern:** A **numbered single-select list widget** — "What service are you looking to source?" (1 In Vivo DMPK, 2 Bioanalytical Testing, 3 Toxicology, 4 Antibody Production, 5 Assay Development, 6 Custom Synthesis, 7 Cell Line Engineering, 8 Sequencing), paginated "1 of 2," with a "Something else / Skip" row. Rendered **directly above the chat composer**. This is the "agent needs something from me → multiple selection" example.
- **Transcript moment (~2:35–2:47):** "There are two types of MCP apps. There are MCP apps where the agent needs something from me… a multiple selection… it's above the chat window directly."

### 11. Screenshot 2026-07-20 204654.png — 2:54
- **Screen/state:** scientist.com chat, second **agent-needs-input MCP app**.
- **UI pattern:** **Multi-select criteria widget** — "Any specific criteria?" (2 of 2) with **Country chips** (United States, European Union, United Kingdom, Switzerland, China, India, Japan) and **Certifications chips** (GLP, GMP, ISO 17025, AAALAC, FDA-inspected); "Skip" / "Continue" buttons. Another agent-requests-input pattern (chip multi-select).
- **Transcript moment (~2:47–2:54):** "here's another example of an MCP app where the agent needs something from me."

### 12. Screenshot 2026-07-20 204714.png — 3:05
- **Screen/state:** scientist.com chat, **MCP app of the "agent-gives-output" type**.
- **UI pattern:** A **custom list-view result widget** — "top vetted suppliers for Bioanalytical Testing" as cards (Charles River Laboratories 4.5★, Pharmaron 4.0★, WuXi AppTec 4.5★) each with request counts, RFIs submitted, agreement badges, bookmark. Rendered inline in the conversation. This is the "agent is giving me something → custom list-view widget" example.
- **Transcript moment (~2:55–3:05):** "There are also MCP apps where the agent is giving me something… kind of custom to a list-view widget."

### 13. Screenshot 2026-07-20 204809.png — 3:36
- **Screen/state:** HubSpot "Sophy Love - General" dashboard, scrolled down.
- **UI pattern:** Shows "Alannah Activity" feed tile and the selected "Deals with most recent revenue totals by source" **horizontal bar** chart with its **bottom-right resize handle** visible; more empty grid cells below. Reinforces dashboard grid + widget selection.
- **Transcript moment:** general dashboard tour (bridging back from the scientist.com detour).

### 14. Screenshot 2026-07-20 204819.png — 3:39
- **Screen/state:** scientist.com chat — the supplier **list-view MCP app** again (same as #12).
- **UI pattern:** agent-gives-output list widget (supplier cards). Duplicate view of the output-type MCP app.
- **Transcript moment (~3:05–3:39):** continuing the "agent gives me something" example.

### 15. Screenshot 2026-07-20 205137.png — 4:28
- **Screen/state:** HubSpot dashboard with the **dashboard switcher dropdown open** (top-left, under "Sophy Love - General").
- **UI pattern:** **Dashboard switcher** — tabs "All / Favorites / My dashboards," a "Search dashboards" field, and a list of dashboards ("Sophy Love - General," "Sales"). This is the top-left control Cody says Ed's mockup is modeled on.
- **Transcript moment (~4:12–4:28):** "in the top left corner… this is how you switch dashboards in HubSpot. This is where Ed clearly got his dashboard switcher from."

### 16. Screenshot 2026-07-20 205209.png — 4:51
- **Screen/state:** HubSpot "Service Dashboard" with the left-nav **Reporting flyout menu** open.
- **UI pattern:** **Reporting IA navigation** — flyout lists **Dashboards / Reports / Goals**. Behind it a full-width horizontal bar chart ("Tickets By Source") and line charts ("Ticket average time to close over time," "Ticket Volume Over Time"). Establishes the Dashboards-vs-Reports top-level split.
- **Transcript moment (~4:40–5:00):** "go to reporting, and then you have dashboards and reports."

### 17. Screenshot 2026-07-20 205227.png — 5:01
- **Screen/state:** HubSpot **Reports list view** ("My reports," URL `/reports-list/…`).
- **UI pattern:** **Report list view** — left rail "My dashboards (4) / My reports (39)" and "Analytics suites" (Marketing / Sales / Service / Revenue); tabs "All reports / Custom reports / Favorites"; table columns Name, Dashboards, Owner, Total Views, Assigned, Tags, Last Viewed. Rows are individual reports (e.g., "Chat conversation totals over time"). Confirms reports are individually listed/managed items.
- **Transcript moment (~5:01):** "there's a list view of all the reports you might have generated or that the AI agent generated for you… consider this in your information architecture."

### 18. Screenshot 2026-07-20 205255.png — 5:10
- **Screen/state:** Reports list view with the **"Create" dropdown open** (top-right).
- **UI pattern:** Create menu offers **"Create dashboard / Create report / Create report with AI."** Confirms standalone report creation and an AI-assisted creation path.
- **Transcript moment (~5:05–5:14):** "you have the ability of creating a standalone report without a dashboard, and you can create reports with AI using their co-working experience."

### 19. Screenshot 2026-07-20 205308.png — 5:14
- **Screen/state:** Reports list with the **AI co-working panel open on the RIGHT** in its **null state**.
- **UI pattern:** **"Let's build your report" co-working panel** — "What I can do / What I can't do" lists and **"Try one of these prompts"** suggestion chips ("What content drove the most revenue…," "Create a report of contacts grouped by owner…," "How much revenue was brought in…"). The composer at the bottom shows an **"MCP Apps" pill/button** next to attach controls. This is the suggested-prompts null state.
- **Transcript moment (~5:14–5:30):** "you can see here in the null state, it's like, here's try these types of prompts… let's do 'how many leads were generated last month? I want to see a bar chart by day.'"

### 20. Screenshot 2026-07-20 205359.png — 6:35
- **Screen/state:** HubSpot co-working chat **expanded to FULL PAGE** (record-mention chat).
- **UI pattern:** **Full-page chat** with a left thread list ("Monthly Lead Generation Analytics," "March Meeting Count Inqui…," "Thank You and Demo Invitation SMS") and a large canvas; user prompt shown: *"how many contacts were generated last month? I want to see a bar chart by day."* Composer: "Type @ to mention a record." Shows the co-working panel promoted to a full-screen natural-language experience.
- **Transcript moment (~6:09–6:35):** "notice how I can go full page with this… that might be how you get into your natural language experience."

### 21. Screenshot 2026-07-20 205430.png — 7:09
- **Screen/state:** Reports list with the co-working panel (right) having **returned an interactive chart MCP app**.
- **UI pattern:** Agent-generated **horizontal bar chart** ("Contacts created by day," 67 total for June 1–30) rendered inline in chat, with **"Save" and "Edit" buttons** beneath it. This is the "on-the-fly chart = MCP app that I can save or edit" moment.
- **Transcript moment (~7:17–7:31):** "Notice how it did create it… This is an interactive bar chart. This is an MCP app. And importantly, I can save it or edit it."

### 22. Screenshot 2026-07-20 205446.png — 7:31
- **Screen/state:** Same chart MCP app, scrolled to fully show the **Save / Edit** actions.
- **UI pattern:** Reinforces chart-in-chat with Save/Edit affordances (Save → drawer; Edit → full report builder).
- **Transcript moment (~7:31):** "I could click save, and then it opens up… it's a drawer, but it could have been a modal."

### 23. Screenshot 2026-07-20 205459.png — 7:37
- **Screen/state:** **"Save report" drawer** (right side) — step 1.
- **UI pattern:** **Save-to-dashboard drawer** — Report name ("Contacts created by day"), Tags, AI-generated Description ("Generate again"), and **"Add this report to a dashboard?"** radio options: **Don't add to a dashboard / Add to existing dashboard / Add to new dashboard**. Core save-and-place flow.
- **Transcript moment (~7:22–7:37):** "I can add it to an existing dashboard… it's calling modals or drawers in the app in order to perform actions."

### 24. Screenshot 2026-07-20 205516.png — 7:47
- **Screen/state:** "Save report" drawer — step 2 (permissions).
- **UI pattern:** **"Who can access this report?"** — Private to owner (me) / Everyone (View and edit / View only) / Only specific users and teams. Back + Save. Completes the save flow.
- **Transcript moment:** continuation of the save-report drawer flow.

### 25. Screenshot 2026-07-20 205532.png — 7:52
- **Screen/state:** **Report Builder (full chart editor)**, URL `/report-builder/…`, "Contacts created by day," Visualization tab. **Horizontal bar** chart selected.
- **UI pattern:** THE CHART-TYPE PICKER — left "Chart" panel with a **9-icon grid** (row 1: horizontal bar [selected], vertical bar/column, line, area, donut, pie; row 2: KPI/number "1", gauge, table). Below: **"Displaying:"** = *Deleted Property (hs_createdate)*, **"measured by"** = *(Count) Contacts*, **"Available properties to display"** + **"Manage properties (1)"**. Top toolbar: Trends, Anomalies, Use Fiscal Year, Frequency (Daily), property search chip, date-range chip, Add quick filter, Advanced filters, Color, Display options. This is the "search & select property → display → measure" pattern; the data table renders below the chart.
- **Transcript moment (~7:37–8:00):** "this is the editor's version, very advanced… you select the type of chart you want. Vertical bar, line, area, donut, pie, KPI, gauges, table… 1,2,3,4,5,6,7,8,9. So 9 MCP app charts and 9 types of widgets."

### 26. Screenshot 2026-07-20 205553.png — 8:06
- **Screen/state:** Report Builder — **Line chart** selected.
- **UI pattern:** "Configure line chart"; same Displaying = *Deleted Property (hs_createdate)*, measured by = *(Count) Contacts*. Demonstrates switching chart type via the picker (line icon highlighted).
- **Transcript moment (~8:00):** enumerating chart types by clicking through them.

### 27. Screenshot 2026-07-20 205636.png — 8:42
- **Screen/state:** Report Builder — **"Select properties to display" modal**.
- **UI pattern:** **Property search-and-select modal** — "PROPERTIES YOU CAN ADD" with a "Search properties" field and grouped, checkbox properties (Your Company, Your Title; Zoom group: Average Zoom webinar attendance duration, Last registered Zoom webinar, Total number of Zoom webinar registrations…; Contact Lifecycle Stage Properties); "MANAGE PROPERTIES (1)" pane; Apply / Cancel. This is the searchable property picker feeding the X/Y and breakdown selections.
- **Transcript moment (~8:20–8:42):** "You should be able to filter by available properties… I can add another property."

### 28. Screenshot 2026-07-20 205710.png — 9:45
- **Screen/state:** Report Builder — **Column (vertical bar)** chart selected.
- **UI pattern:** "Configure column chart"; **Displaying = Create Date**, **measured by = (Count) Contacts** (now that a valid date property is dragged in, the daily-frequency column chart renders correctly). Confirms the X (property to display) / Y (measure) model. Column icon highlighted in the picker.
- **Transcript moment (~9:22–9:45):** "I had to drag in create date measured by contacts… I should see it by daily. Ah, there it is… you have X and Y. Search and select the property, then display and measure it."

### 29. Screenshot 2026-07-20 205722.png — 9:50
- **Screen/state:** Report Builder — **"Save report" drawer**, "Add to existing dashboard" selected.
- **UI pattern:** Same save drawer as #23 but reached from the full builder; **"Add to existing dashboard"** radio active with a **dashboard Search** field. Save flow from within the editor.
- **Transcript moment (~9:45):** "then you can save that report and add it to an existing dashboard or to a new dashboard."

### 30. Screenshot 2026-07-20 205749.png — 11:39
- **Screen/state:** Report Builder — **Donut chart** selected, with a **breakdown by a third property**.
- **UI pattern:** "Configure donut chart"; **Displaying = Original Source**, **measured by = (Count) Contacts**; **Manage properties (2)** and an extra property chip ("Original Source") in the toolbar — the **breakdown-by-third-property** pattern. Donut renders with per-segment % and counts; data table (Original Source × contact count) below. Donut icon highlighted.
- **Transcript moment (~10:20–11:39):** "you have your breakdown of month and then by source… add a third one, original source, and drag that in… count of contacts measured by source."

### 31. Screenshot 2026-07-20 205816.png — 13:30
- **Screen/state:** **Val's own Bricklayer concept artifact** (claude.ai code artifact, tab "Bricklayer — UI Concepts: Chat × Dashboard"; Windows taskbar visible, clock 4:19 PM 7/15/2026). NOT HubSpot.
- **UI pattern:** Bricklayer mock "Credit Risk Overview" **board** — top nav Briefing / **Boards** / Properties / Deliverables; KPI stat tiles; bar/table/scatter widgets; a right-side **"Ask Bricklayer" co-working chat scoped to "this board"** that returns a **scatter-plot MCP app** ("Value vs. cap rate — income appraisals") with "Pin to board / Open as space / Explain outlier" actions. Val's translation of the HubSpot patterns (co-working chat on the right, board of widgets, chart-as-MCP-app with save/pin).
- **Transcript moment (~12:20–13:30):** Val: "I'll take a minute to show where I'm at… the briefing, the evidence, your digest, how the chats work out… thinking about the widget library."

---

## SYNTHESIS

### 1. The chart/widget types in the HubSpot chart editor (Cody's "~9")
The Report Builder "Chart" panel shows a 9-icon type picker (confirmed across screenshots #25, #26, #28, #30, and named in transcript ~7:52). Cody frames these as both the report widget types AND the corresponding "MCP app charts":

1. **Horizontal bar**
2. **Vertical bar / column**
3. **Line**
4. **Area**
5. **Donut**
6. **Pie**
7. **KPI / number** (the circled "1")
8. **Gauge**
9. **Table**

Quote (~8:00): *"vertical bar, line, area, donut, pie, KPI, gauges, table… 1,2,3,4,5,6,7,8,9. So 9 MCP app charts, and then 9 types of widgets on the report."*

### 2. IA nomenclature confirmed (use HubSpot's language — Val agreed at 13:56/14:17)
- **Dashboards** = collections of reports (the grid canvas of tiles). Switched via the top-left **dashboard switcher** (#15). Left-nav "Reporting" splits into **Dashboards / Reports / Goals** (#16).
- **Reports** = individual charts/widgets. Each is a first-class, listable object.
- **Standalone reports** = a report can be created and saved without being added to any dashboard ("Don't add to a dashboard," #23; "Create report," #18).
- **Report list view** = "My reports" table (39 reports) with Name/Owner/Dashboards/Views/Tags columns (#17), plus "My dashboards (4)" and Analytics suites (Marketing/Sales/Service/Revenue).
- Decision: Bricklayer adopts **Dashboards + Reports** (Val had used "Boards," is switching to "Reports"; note his current artifact still labels the tab "Boards," #31).

### 3. Chart-editor interaction pattern (the X/Y model)
Pattern Cody says to replicate: **search-and-select a property → set it as "Displaying" (the X / dimension) → set a measure under "measured by" (the Y, e.g. (Count) Contacts) → optionally add breakdown properties → save.**
- Property selection is via a **searchable property picker modal** grouped by object (#27) and per-chip property selectors in the toolbar.
- "Displaying" + "measured by" fields with an "Available properties to display / Manage properties" area (#25, #28).
- **Breakdown by a third property** (e.g., add "Original Source" on top of date) shown on the donut (#30); "Manage properties (2)."
- Frequency/date-range/trends/filters controls in the top toolbar.
- Some chart types constrain the model (Cody notes pie/donut need the date removed and only work "measured by"; the API-style measure differs).
- **Save flow:** Save → **drawer** (name, tags, AI-generated description, "Add to dashboard?" don't/existing/new) → permissions step (who can access) (#23, #24, #29). Cody notes a drawer "could have been a modal."

### 4. Dashboard-canvas interaction patterns
- **Drag to rearrange** tiles; "Drag to move" tooltip on hover (#1, #2).
- **Grid overlay appears while dragging** — dashed placeholder cells; tiles snap to the grid (#3).
- **Resize handle** in each tile's **bottom-right corner** (dotted/hatched triangle); resize spans grid squares (#4, #5, #13).
- **Autosave** ("Autosaved" indicator) after edits (#3).
- **Dashboard switcher** top-left: All/Favorites/My dashboards tabs + search + list (#15). Per-tile controls: refresh, add, expand, kebab, date/filter chips.

### 5. The two chat modalities
- **Co-working panel (secondary, docked on the RIGHT):** context/page-aware chat pulled out over an existing page — scientist.com Elisa panel (#7) and HubSpot's "Let's build your report" panel (#19, #21–#22). Optional, callable anytime; returns chart MCP apps with Save/Edit inline. Cody's rule (13:21): co-working chat lives on the **right** (secondary); a chat that **drives** the whole experience (Lovable/V0/Cursor style) lives on the **left**.
- **Full-page chat (primary):** dedicated `/chat`-style page with a left thread list ("Recent"), new-chat/search, large canvas, bottom composer — scientist.com (#8, #9) and HubSpot's expanded record-mention chat (#20). The same co-working conversation can be **promoted to full-page** ("notice how I can go full page with this," 6:09).
- Val's Bricklayer artifact (#31) applies the co-working-on-the-right rule (scoped "Ask Bricklayer" panel on the right of a board).

### 6. "MCP apps" — unopinionated UI elements returned in chat
Cody's definition (~1:30): an **MCP app is an unopinionated UI element** the agent returns in the chat (e.g., a chart shown in chat is delivered as an MCP app). Two types:
- **Agent-needs-input type** — the agent requests something from the user; rendered **directly above the chat composer**. Examples: numbered single-select service list "What service are you looking to source?" (#10); multi-select criteria chips "Any specific criteria?" with Country + Certifications (#11).
- **Agent-gives-output type** — the agent hands the user a result widget, often custom. Examples: the **supplier list-view widget** (#12, #14); an on-the-fly **interactive bar chart** with Save/Edit (#21). Cody's ask: build MCP-app versions of **all 9 widget/chart types**, in addition to building them as report widgets — so the agent can generate any of them on the fly in a natural-language chat.
- **The demonstrated end-to-end flow:** a user can either (a) sit on a dashboard and ask page/context-aware questions via the co-working panel, or (b) use a full natural-language chat where the agent creates charts on the fly — each returned as an MCP app, savable/editable into a report and placeable on a dashboard.
