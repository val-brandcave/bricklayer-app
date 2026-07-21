---
Meeting: Bricklayer Discovery / Review — RealWired
Date: July 14, 2026
Attendees: Edward Kruger (RealWired), Cody Miles (Brandcave), Val (Brandcave)
Product: Bricklayer (RealWired intelligence suite)
Recording: https://fathom.video/share/YUC_zaEZPgq5efV-YGz5pdyP2VXZc19P
Note: Bricklayer segment only. Parachute feedback captured separately.
---

> Copy everything from the "# Bricklayer" heading down into Notion — it's formatted to paste cleanly (headings, nested bullets, bold labels).

# Bricklayer

## Context — What it is & why it matters
- Bricklayer is RealWired's **intelligence suite**: it takes all of a bank's appraisal data, lands it in a **data lake**, and pushes an **LLM + BI dashboard** on top of it.
- The appraisal report is the source file — it's rich with dozens of data sets. Bricklayer turns the **entire asset portfolio of the bank** into a queryable, visual product.
- The people who manage these assets want to understand: **risk, segmentation, geographic exposure, over-exposure, potential risk rollovers, and who is doing what work.**
- **Before:** all of this lived only in PDF appraisal reports, and each user had to build their own "secret sauce" to make sense of it.
- **Now:** it's delivered as a BI platform. The whole point is to replace the PDF "book" with an **insightful, reasoning dashboard**.
- Example scale (an onboarded bank): a **~$6.5B appraisal book across 3,000+ appraisals** — this is the portfolio these teams manage day to day.

## Personas & Access
- The same data set serves **different roles, each with their own lens**:
  - **Portfolio Manager** — focused on the book.
  - **Credit / Lending Officer** — focused on risk.
  - **Chief Appraiser** — focused on quality.
- **Role is set at login via RBAC** — you log into one lens; you do not switch roles freely.
  - The role-switcher shown in the demo was **demo-only**, not the intended product behavior.
  - The lens shapes the backend: when you ask a question, the system **assumes that role's viewpoint** on the data.
- **Standalone app** — this is deliberately **not** launched from Uconnect (unlike Parachute).
  - Uconnect *may* feed data in, but users never log into Uconnect.
  - Rationale: the decision-makers here are **executives** who "don't even know what Uconnect is."

## Data & Onboarding
- **Data source:** Uconnect can feed the data, or for a non-Uconnect customer RealWired just **consumes it directly** → runs it **through a pipeline** → it lives in the **data lake**.
- **Extraction:** appraisal reports are run through a **~27-step extraction pipeline** that pulls the structured data out. This is an intense, heavy task.
- **Go-to-market is sales-led, not PLG:**
  - No self-serve signup — you can't just sign up online; there's a **vendor due-diligence** hurdle too.
  - Onboarding is **expensive and data-heavy** — one bank's POC was **~$25,000 for 3 years of data**, driven by the enormous volume consumed.
  - **Flow:** sales-led deal → structure/extract the bank's data → load into the GUI → RealWired sets up users in Bricklayer with their role → users are invited → they log in and see their dashboard.

## Core Experience
### Insights (the "daily digest" landing)
- On login you land in **the state of your book** with a high-focus area (e.g. "123 appraisals passed through this month").
- Intent: **show Bricklayer's intelligence up front, before the dashboards** — surface the surprising, the "wow, I found something you might not have noticed."
- Powered by **statistical analysis + reasoning**, e.g.:
  - "Condition explains ~10% of the variation in square footage" → properties in good/excellent condition carry an X% premium.
  - "Land-sales approaches rise with your vacancy rates" — correlations drawn from *your* data.
  - High collateral-risk trend lines.
- **Drill-down:** click any insight → it opens the specific property/building and gives insights on it.

### Full Board (portfolio overview)
- Sits alongside Insights; a **default board tied to your lens** — every role gets a different default.
- Surfaces notable signals, e.g. "this property has been reviewed more than once and increased **84% in value**."
- Click a signal → open that specific portfolio/property → see what's happening, why, and what you might be missing.

### Chat / Ask (conversational analytics)
- Ask questions in natural language, e.g. "show value vs. cap rate as a scatter graph."
- Bricklayer **reasons about the data and returns a chart**, which you can **pin to the dashboard** or **open into the dashboard**.

### Explain This
- Right-click any item (e.g. a risk watch-list entry) → **"Explain this"** → it pops into Bricklayer and **reasons about why the item is flagged**, telling you things about that property.

### Create New Board (most powerful function)
- Ask for an **entirely new board/dashboard** for a data set.
- The agent **reasons over the whole data set and builds a dashboard on the fly** from everything available.
- Framing: *"Whatever problem you want to solve, we help you digest the information."*

### Individual Property View
- Beyond the portfolio view, there's an **individual property view** with small self-serve actions ("do things on your own"). *(Cody: "very HubSpot.")*

## How Insights Are Generated
- **Hybrid:** a mix of **predefined widgets** and **LLM-discovered correlations** (the model picks an X and Y axis and presents a relationship).
- **Guardrail / open design tension:** an LLM is *bad at deciding which two things belong together*, so they stay **prescriptive to a perspective** to avoid degrading data quality.
- Different lenses should get **genuinely unique** dashboards — e.g. tenant concentration, occupancy by property class, lease-rollover exposure — because what's irrelevant to one persona can be critical to another.

## Duplication Concern (raised by Cody)
- Insights currently **overlaps heavily with the main dashboard**, the main difference being the added **AI summary text**.
- Ed acknowledged the duplication. His intent for Insights is a **skim-able daily digest** that showcases the "wow" finds, not a second copy of the dashboard — this needs to be resolved so the two surfaces earn their place.

## Gaps & Opportunities
- **Export / deliverables is the biggest missing piece** — Ed sees this as what takes it from an *average* product to a *great* one:
  - "Export this as a **credit-ready portfolio** for my board meeting."
  - "Create me the **credit note** associated with this."
  - **Presentation mode** — including **temporary / ephemeral reports** (a dashboard built just for today's presentation).
- **Surface more eval actions** on charts and responses (see Value & Usage below).

## Value & Usage — Open Questions
- Consensus that **the data is worth its weight in gold**; the open question is **how it's used day to day**.
- It's **not an active ticker** — appraisals don't fly in and dramatically move the book in real time — so the daily-use case needs definition.
- **Standout example of real value:** Ed asked "what's the biggest risk I have?" and it **called out a person** — "this individual is doing ~300% more work than everyone else, is responsible for ~30% of the book, and that work has been passed without a second glance." A chief appraiser might reasonably ask, "is this person cutting corners?" — but it's unclear whether users would think to ask that.
- **Cody's framing of Insights:** the system should hold an **opinion of what "good" looks like for this bank**, run those questions as part of the job/harness, and **proactively raise concerns** — "here's something worth a look; disregard it or treat it as something you hadn't considered."

## Cody's Take (product framing)
- At its core this is **traditional BI + a chat assistant that can also take "write" actions** — create charts, add them to existing dashboards, and spin up new dashboards, with reasoning.
- **To succeed:** define the full library of **chart / widget types**, and make them **deliberately unopinionated** so the agent can pick the best chart for any "write" action.
- Everything else is then **a series of dashboards + the Insights layer**, across two altitudes: **portfolio view** and **individual property view**.
- Until there's deeper product understanding, we can't yet say "the lender needs *these specific* dashboards" — so for now, **get the right patterns/foundations in place** and design how it really works.
- The design challenge Ed wants Brandcave's help on: **the interaction between dashboard and intelligence** — the drill-down, staying "zoomed in," and making it feel **as powerful as Power BI without feeling like Power BI**; naturally moving between **conversing with your data** and **generating reports on the fly**.

## Competitor — CoStar
- **CoStar** is the closest thing to a competitor — *the* commercial real-estate data set. (Cody's note: their interface is weak.)
- **Their model:** anonymize everyone's data and **resell it**; they already have images, tabulated data, and site visits. They run a **marketplace** (listings feed their data) and even **pay people to drive around and photograph properties**.
- **RealWired's differentiator:** they believe they have **richer data than CoStar** — CoStar **infers from sales**, whereas RealWired **actually knows** the numbers because they come from the real appraisal.
- Direction: think **competitively** about bringing this into the space so any role/lens can clearly understand the view they're looking at.
- To review: **costar.com** and their product screenshots/snapshots.

## Status / Risk
- Ed is **"flying blind" and pushing deadlines** — there's a **demo Friday with one of the banks**, and he doesn't yet know how clients will respond.
- The client that **paid a discovery fee to structure their data is not yet using** Bricklayer.
- Open question raised: whether it's built on a **proper eval system**, and whether surfacing eval actions would help build confidence.

## Action Items
- **Ed → Cody:** send a **video walkthrough** of Bricklayer (connects to live data, so a video over a published HTML build). *Then Cody reviews and sends suggestions.*
- **Ed → Cody:** email **CoStar links / examples**.
- **Cody → Ed:** work through Bricklayer and send **product suggestions** (patterns for the dashboard ⇄ intelligence interaction).
- **Cody → Ed:** finish and send the **remaining Parachute feedback** to unblock the RealWired team.
