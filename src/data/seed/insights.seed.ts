import type { Insight } from "@/types";

const T = 1_767_225_600_000;

/* Per-lens insights — the opinion / critique layer.
   Each carries a claim, evidence, a self-critiquing "Bricklayer's Read",
   and dig-deeper follow-ups. isSurprisingLink flags LLM-found correlations. */
export const seedInsights: Insight[] = [
  /* ---------------- Portfolio Manager ---------------- */
  {
    id: "ins-pm-1", lens: "portfolio-manager", kind: "concentration", severity: "high",
    title: "Residential is 24% of the book — concentration is climbing",
    claim: "Residential holds $1.55B of a $6.51B book; the top asset class share rose 3.1pts over four quarters.",
    evidence: [
      { label: "Residential book", value: "$1.55B" },
      { label: "Share of total", value: "23.8%", delta: "+3.1pt YoY" },
      { label: "HHI (class)", value: "0.19", delta: "+0.02" },
    ],
    bricklaysRead: "The concentration is real but not yet a policy breach — it sits under the 25% single-class soft limit. What I'd watch is that half the growth is one metro (Austin + Nashville multifamily); geographic concentration is the sharper risk than asset-class here. Recommend a metro-level cut before escalating.",
    followUps: ["Break down by metro", "Show vs. policy limits", "Project next 2 quarters"],
    isSurprisingLink: false, relatedReportId: "rep-value-by-class", createdAt: T,
  },
  {
    id: "ins-pm-2", lens: "portfolio-manager", kind: "correlation", severity: "watch",
    title: "Occupancy and cap rate move together more tightly than price/SF",
    claim: "Occupancy ↔ cap rate correlate at r = −0.61 across the book — stronger than price/SF ↔ cap rate (−0.42).",
    evidence: [
      { label: "Occupancy ↔ cap", value: "−0.61" },
      { label: "Price/SF ↔ cap", value: "−0.42" },
      { label: "Sample", value: "2,874 props" },
    ],
    bricklaysRead: "Be careful reading causation here. The −0.61 is inflated by the office sub-book, where a handful of distressed, half-empty towers drag both variables at once. Strip office out and the correlation drops to −0.38. It's a real signal, but it's mostly an office story, not a book-wide law.",
    followUps: ["Show correlation matrix", "Exclude office", "Which properties drive it?"],
    isSurprisingLink: true, relatedReportId: "rep-correlation", createdAt: T,
  },
  {
    id: "ins-pm-3", lens: "portfolio-manager", kind: "premium", severity: "info",
    title: "Recently-renovated assets carry a 14% price/SF premium",
    claim: "Properties with a renovation in the last 5 years price 14% higher per SF than un-renovated peers, controlling for class.",
    evidence: [
      { label: "Renovated price/SF", value: "$312" },
      { label: "Peer price/SF", value: "$274" },
      { label: "Premium", value: "+14%" },
    ],
    bricklaysRead: "This premium is likely overstated. Renovation dates are self-reported in the appraisal narrative and extraction confidence on that field averages 74% — the lowest of any field we pull. Treat the direction as sound, the magnitude as soft, until the field is verified.",
    followUps: ["Show extraction confidence", "By class", "List renovated assets"],
    isSurprisingLink: false, createdAt: T,
  },

  /* ---------------- Credit / Lending Officer ---------------- */
  {
    id: "ins-co-1", lens: "credit-officer", kind: "staleness", severity: "high",
    title: "1,233 appraisals are older than 24 months — $1.06B at risk",
    claim: "31% of appraisals predate the 24-month refresh policy; the at-risk book value has grown every quarter this year.",
    evidence: [
      { label: "Stale appraisals", value: "1,233" },
      { label: "At-risk value", value: "$1.06B", delta: "+17% YoY" },
      { label: "Oldest", value: "41 months" },
    ],
    bricklaysRead: "The headline count overstates the credit exposure. Roughly 40% of the stale set is stabilized industrial with occupancy above 95% — low reprice risk even when old. The genuine concern is the ~180 office assets that are both stale AND sub-75% occupied. That's the subset I'd pull into a refresh queue first, not all 1,233.",
    followUps: ["Show staleness heatmap", "Filter stale + low-occupancy", "Build a refresh queue"],
    isSurprisingLink: false, relatedReportId: "rep-staleness", createdAt: T,
  },
  {
    id: "ins-co-2", lens: "credit-officer", kind: "concentration", severity: "high",
    title: "An outlier cap rate is skewing the office trend line",
    claim: "1400 Market St reports an 11.4% cap rate — 3.9σ above the office class mean of 6.9%.",
    evidence: [
      { label: "Reported cap", value: "11.4%" },
      { label: "Class mean", value: "6.9%" },
      { label: "Std. devs", value: "3.9σ" },
    ],
    bricklaysRead: "This is almost certainly a data-entry artifact, not a real distressed cap rate. The underlying NOI ($4.82M) and value ($54.2M) imply a 8.9% cap, not 11.4% — the recorded figure looks like a transposed input. Exclude it and re-run the vintage regression before this reaches a credit memo; leaving it in overstates office stress book-wide.",
    followUps: ["Re-run without outlier", "Open 1400 Market St", "Show the source page"],
    isSurprisingLink: false, relatedReportId: "rep-value-vs-cap", createdAt: T,
  },
  {
    id: "ins-co-3", lens: "credit-officer", kind: "premium", severity: "watch",
    title: "Coastal flood-zone exposure sits at $1.31B",
    claim: "AE + VE flood-zone assets total $1.31B, 20% of the book; VE (coastal high-hazard) alone is $166M and skews to hospitality.",
    evidence: [
      { label: "AE + VE exposure", value: "$1.31B" },
      { label: "VE (coastal)", value: "$166M" },
      { label: "Share of book", value: "20%" },
    ],
    bricklaysRead: "Zone alone isn't the risk — three of these VE assets carry current flood coverage and elevation certificates, which the appraisal notes but our tile doesn't yet surface. The uninsured slice is what matters; on today's data that's two properties, ~$110M. I'd narrow the flag to those rather than the full $1.31B.",
    followUps: ["Show flood exposure map", "Filter uninsured", "By asset class"],
    isSurprisingLink: false, relatedReportId: "rep-flood", createdAt: T,
  },

  /* ---------------- Chief Appraiser ---------------- */
  {
    id: "ins-ca-1", lens: "chief-appraiser", kind: "workload", severity: "high",
    title: "One appraiser signed 214 reports in 90 days — a workload outlier",
    claim: "D. Whitfield's throughput (214 in 90d) is 2.2× the next-busiest appraiser and correlates with lower comp counts.",
    evidence: [
      { label: "Whitfield (90d)", value: "214" },
      { label: "Next highest", value: "96" },
      { label: "Avg comps", value: "3.6", delta: "vs 6.8 book" },
    ],
    bricklaysRead: "High volume isn't proof of low quality — but the pattern here is worth a review. Whitfield's reports average 3.6 comps against a 6.8 book norm, and three of the four highest-CoV appraisals in the book are his. That's a quality-control signal, not just a capacity one. Suggest a sample re-review of the stale, thin-comp subset before drawing conclusions.",
    followUps: ["Show workload chart", "List Whitfield's high-CoV reports", "Compare comp counts"],
    isSurprisingLink: false, relatedReportId: "rep-workload", createdAt: T,
  },
  {
    id: "ins-ca-2", lens: "chief-appraiser", kind: "data-health", severity: "watch",
    title: "Renovation-date and NOI fields have the weakest extraction confidence",
    claim: "Across the book, renovation date (74%) and NOI (83%) are the two lowest-confidence extracted fields.",
    evidence: [
      { label: "Renovation date", value: "74%" },
      { label: "NOI", value: "83%" },
      { label: "Cap rate", value: "97%" },
    ],
    bricklaysRead: "The low NOI confidence is concentrated in scanned/handwritten income statements, not the model — 88% of low-confidence NOI pulls come from pre-2015 PDFs. That's fixable with a targeted re-OCR pass on ~600 documents rather than a model change. I'd scope that before flagging the field as unreliable in downstream widgets.",
    followUps: ["Show QA by field", "Filter low-confidence NOI", "Which documents?"],
    isSurprisingLink: false, relatedReportId: "rep-extraction", createdAt: T,
  },
  {
    id: "ins-ca-3", lens: "chief-appraiser", kind: "correlation", severity: "info",
    title: "High comp-CoV tracks with stale valuations — a quality-decay link",
    claim: "Comp coefficient-of-variation correlates with valuation age at r = +0.44 — older appraisals used thinner, noisier comps.",
    evidence: [
      { label: "CoV ↔ age", value: "+0.44" },
      { label: "Stale avg CoV", value: "23.1%" },
      { label: "Fresh avg CoV", value: "7.4%" },
    ],
    bricklaysRead: "This is expected — older reports predate the current comp-sourcing tooling, so higher CoV is more about vintage of process than analyst error. The actionable read: prioritize refresh for the high-CoV stale set, since those valuations are both old and built on shaky comps. It doubles as a data-quality and a credit argument.",
    followUps: ["Show CoV vs age scatter", "List high-CoV stale", "Add to refresh queue"],
    isSurprisingLink: true, createdAt: T,
  },
];
