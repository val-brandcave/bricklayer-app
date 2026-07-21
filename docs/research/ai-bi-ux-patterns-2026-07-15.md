# AI-Analytics Interaction Pattern Research for Bricklayer

*Research date: July 15, 2026. Multi-agent web research across vendor docs, launch blogs, third-party teardowns (2024–2026). Confidence flags: [solid] = documented; [likely] = strongly indicated; [uncertain] = inferred. Informs the IA artifact (https://claude.ai/code/artifact/e5dbbd95-166d-4c8e-b613-cb207e572b96) and flow wireframes.*

## 1. How chat and dashboard coexist spatially

- **Split-view chat beside dashboard (dashboard-first).** Omni's Dashboard Agent: floating avatar on any dashboard opens a **side-by-side split view**; users can **scope the chat to a specific tile** by clicking it (a "chart chip" appears in the composer with an X to unfocus) [solid]. (https://docs.omni.co/ai/dashboard-assistant)
- **Chat-first, dashboard as destination.** ThoughtSpot Spotter: question box on Home, a dedicated conversation page, and a **Spotter button on hover over any Liveboard viz** (chat inherits chart context). Input at bottom, answer/viz above, history panel [solid]. (https://docs.thoughtspot.com/cloud/26.3.0.cl/spotter-getting-started)
- **Chat space as governed room, embedded in every dashboard.** Databricks Genie: every AI/BI Dashboard includes an integrated Genie space; Genie also standalone as a curated chat environment [solid]. (https://www.databricks.com/blog/aibi-genie-now-generally-available)
- **Chat + artifact side-canvas.** Claude Artifacts / ChatGPT Canvas: thread as "reasoning trail," deliverable pinned in a right pane [solid]. Perplexity Labs: dashboards/apps render inline below the query; all generated files in an "Assets" tray [solid]. (https://www.perplexity.ai/hub/blog/introducing-perplexity-labs)
- **Infinite canvas.** Count: cells on a 2D canvas; canvas regions = lines of inquiry; parallel AI agents per region [solid]. (https://count.co/blog/bye-bye-notebooks-hello-canvas)
- **Hex Threads**: chat-first for consumers, runs on notebooks underneath; thread shows step-by-step reasoning, artifacts open as real notebooks [solid]. (https://hex.tech/blog/introducing-threads/)
- **Anti-pattern (Power BI Copilot)**: pane bolted onto a dense authoring UI; competes with rather than composes with the report surface [solid]. (https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction, https://velvetech.com/blog/why-power-bi-copilot-falls-short/)

## 2. Chat-generated chart → persistent dashboard item

- **Pin (ThoughtSpot)**: every Answer has a Pin button → Liveboard or specific tab; last-used target one-click [solid]. Pinned items remain live queries — no staleness; curation of pin-cluttered boards is the failure mode [likely]. (https://docs.thoughtspot.com/cloud/26.5.0.cl/liveboards)
- **Zenlytic Zoë**: "add this to a new dashboard for me" builds a live dashboard from conversation [solid]. (https://zenlytic.com/)
- **Hex promotion chain**: thread → persistent notebook → published app; published assets become retrieval context for future Threads (flywheel) [solid]. Fall 2025: Generative Apps agent builds a whole dashboard from a description [solid]. (https://hex.tech/blog/fall-2025-launch/)
- **Genie**: corrected SQL saved "Add as instruction" — persisted to the space's knowledge store, not a canvas [solid]. (https://docs.databricks.com/aws/en/genie/talk-to-genie)
- **Ownership/staleness**: live-query pins avoid staleness; "who owns the AI-made dashboard" is open design space [uncertain].

## 3. Drill-down / staying zoomed-in

- **ThoughtSpot "drill anywhere"**: click any datapoint → drill on any column, underlying data, or SpotIQ analyze; model-derived, not pre-authored. Spotter adds conversational drill [solid]. (https://www.thoughtspot.com/blog/introducing-spotter-ai-analyst)
- **Omni tile-scoped conversation**: click tile → agent context narrows; drill by asking; dashboard stays visible [solid].
- **Palantir entity pages**: every datapoint is an object with an Object View; Object Explorer drill = object-graph navigation; Quiver linear→branched analyses [solid]. (https://www.palantir.com/docs/foundry/object-explorer/overview)
- **HubSpot record page**: three-column entity page — left identity rail, middle tabbed workspace (**About, Activities, Catch-up, Intelligence, Revenue**), right associated records. Intelligence tab puts AI health/data-quality cards inside the entity page [solid]. (https://knowledge.hubspot.com/records/understand-the-default-record-layout)
- **ThoughtSpot Present mode**: still drillable/filterable mid-presentation [solid].

## 4. Trust / verification UX

1. **Show the query** — Genie "Show generated code"; editors fix SQL, save as instruction [solid].
2. **Show the interpretation, editable** — ThoughtSpot query tokens: hover detail, click a token to change aggregation/column; "Show work" restates the question [solid].
3. **Verified-answer badges** — Genie **trusted assets**: curator-registered parameterized SQL; matching answers labeled **"Trusted"** with editable parameters [solid] (https://docs.databricks.com/en/genie/trusted-assets.html). Snowflake Cortex Analyst **Verified Query Repository**: verified question→SQL pairs; auto-suggests candidates from high-frequency novel queries [solid] (https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst/verified-query-repository). Power BI analog "verified answers" [likely].
4. **Feedback → curation loop** — Spotter thumbs-down with structured categories routed to admins; "Add to Coaching." Genie "Ask for Review" + monitoring page + user-approved knowledge snippets [solid]. (https://docs.databricks.com/aws/en/genie/monitor)
5. **Reasoning graph (Palantir AIP)**: interactive dependency graph from question to answer with inline citations; inspect/adjust steps [solid].

**Negative reference (Power BI Copilot)**: "Mistakes are possible" disclaimer, no confidence indicators, non-deterministic answers unexplained. Data Goblins: "the business expects only one answer — the correct one." (https://data-goblins.com/power-bi/copilot-in-power-bi)

## 5. Proactive insights / digests

- **ThoughtSpot**: SpotIQ change analysis (auto root-cause of KPI movement), anomaly alerts, **Monitor/Watchlist** — KPI subscriptions, threshold/anomaly notifications, scheduled digests. Attaches to *metrics*, not boards — which is how it avoids duplicating the dashboard [solid]. (https://docs.thoughtspot.com/cloud/26.6.0.cl/monitor)
- **Zenlytic Proactive Analytics**: always-on monitoring agents; Slack/Teams delivery [likely]. (https://www.zenlytic.com/proactive)
- **Genie One scheduled tasks** in chat [solid, thin detail].
- **HubSpot Breeze "Catch-up" tab**: per-entity "what changed since you last looked" — best pattern for avoiding a duplicate global feed [solid].
- **Synthesis**: winning digest items are *deltas with a cause hypothesis* deep-linking into the drilled state; a global feed restating the dashboard is the failure mode.

## 6. Export / presentation / report generation

- **ThoughtSpot Liveboards**: Present mode (live slideshow, drillable), PDF download (composite or per-viz), scheduled email snapshots incl. to non-account holders [solid]. (https://docs.thoughtspot.com/cloud/latest/liveboard-schedule)
- **Count**: dashboards, notebooks, and slide decks are **views of the same canvas document**; presentation is a lens, not an export [solid].
- **Perplexity Labs**: dashboards/slides/apps as disposable artifacts attached to a query; Assets tray — the purest "ephemeral dashboard" precedent [solid].
- **Equals**: "board-ready dashboards" positioning for finance execs [solid]. **Hex**: published app = the report, scheduled runs [solid].

## 7. Widget/chart libraries for agents

- **ThoughtSpot ~20 chart types** + subtypes; chart↔table toggle [solid]. (https://docs.thoughtspot.com/cloud/latest/chart-types)
- **Genie**: deliberately small chart vocabulary [likely].
- **Vega-Lite as agent chart grammar** — Databricks engineering: declarative JSON specs are compact for context windows, schema-validatable (fast auto-correction), safe (no generated plotting code), accessible defaults [solid]. (https://www.databricks.com/blog/bringing-visualizations-life-multi-agent-systems-vega-lite) Academic: VegaChat [solid]. (https://arxiv.org/html/2601.15385v1)
- **Vercel AI SDK / AI Elements**: "Router Pattern" — AI decides intent → data layer runs query → UI renders typed component; latency the primary constraint [solid]. (https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces)
- **Consensus**: small closed set of typed chart primitives + declarative spec + schema validation; never agent-authored chart code [synthesis].

## Recommended pattern stack for Bricklayer

1. **Spatial**: dashboard-first split view with tile-scoped chat (Omni) + entity pages for properties (HubSpot/Palantir).
2. **Persistence**: ThoughtSpot Pin (explicit board/tab picker, live queries) + Zenlytic whole-board generation; "pinned from conversation" provenance on tiles.
3. **Drill-down**: drill-anywhere on charts + property/borrower/market entity pages with Catch-up/Intelligence tabs; breadcrumbs record the drill path.
4. **Trust**: editable interpretation ("how I read your question") + Trusted badge from a verified-query repository + show-SQL for the few + "Ask for review" routing. Badges and plain language matter more than SQL for bank execs.
5. **Proactive**: KPI/entity subscriptions with root-cause deltas deep-linking into drilled state; entity-scoped Catch-up. Subscribing to metrics/entities, not boards, prevents feed-duplicates-dashboard.
6. **Reports/ephemera**: one board object rendered as dashboard/deck/PDF (Count); ephemeral boards with visible "unsaved/expires" state and one-click promote; Present mode stays live and drillable.
7. **Chart library**: closed set of ~10–14 typed primitives as declarative validated specs rendered by the design system; invest design budget in the primitives.
