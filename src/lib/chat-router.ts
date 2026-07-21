import type { DataSeriesKey, Report } from "@/types";

/* ============================================================
   Demo chat router — maps a free-text prompt to the most relevant
   seeded Report, so the full-page chat and the docked assistant can
   answer with a real MCP app (a rendered Widget) plus a written
   preamble. This is deterministic keyword scoring, NOT a model; it
   stands in for the backend agent until real devs wire it up.
   Keep it pure — no React, no side effects.
   ============================================================ */

export interface ChatRoute {
  /** keywords that pull toward this route (matched case-insensitively) */
  keywords: string[];
  /** the dataset the answer's report should be bound to */
  dataKey: DataSeriesKey;
  /** the written answer that precedes the MCP app */
  preamble: string;
}

/* Ordered by specificity — the scorer picks the highest keyword-overlap
   route, so put the sharper intents first only as a tiebreak aid. */
const ROUTES: ChatRoute[] = [
  {
    keywords: ["concentration", "concentrated", "asset class", "class mix", "mix", "exposure by class", "diversification", "book value by"],
    dataKey: "valueByClass",
    preamble: "Your book leans on a few asset classes. Here's book value by class — residential and office carry the weight, which is where a concentration limit would bite first.",
  },
  {
    keywords: ["stale", "staleness", "aging", "old valuation", "out of date", "overdue", "months since", "revalue"],
    dataKey: "stalenessByClassAge",
    preamble: "Valuation freshness is uneven. This heatmap crosses asset class with age band — 1,233 appraisals are past 24 months, and they cluster in the darker cells.",
  },
  {
    keywords: ["watchlist", "risk", "risky", "riskiest", "at risk", "flag", "worst", "attention"],
    dataKey: "riskWatchlist",
    preamble: "Here's the current risk watchlist, scored 0–100 with the reasons spelled out. The top entries pair a stale valuation with thin comps — worth a second look.",
  },
  {
    keywords: ["cap rate", "caprate", "cap-rate", "vintage", "yield", "compression"],
    dataKey: "capRateByVintage",
    preamble: "Cap rates move with vintage. Newer assets are pricing tighter; the older bands still carry wider yields. Here's the breakdown by vintage.",
  },
  {
    keywords: ["reprice", "re-price", "stress", "sensitivity", "scenario", "what if", "what-if", "shock", "downside"],
    dataKey: "directCapReprice",
    preamble: "Let's stress it. Drag the cap-rate and occupancy shifts and every value repositions live — this is a direct-cap reprice you can drive.",
  },
  {
    keywords: ["flood", "fema", "climate", "zone", "coastal", "hazard", "water"],
    dataKey: "flightRiskByFloodZone",
    preamble: "Flood exposure isn't trivial. Here's book value by FEMA zone — the AE and VE buckets are the ones a lender covenant usually cares about.",
  },
  {
    keywords: ["trend", "over time", "quarter", "growth", "trajectory", "history", "grown", "change over"],
    dataKey: "bookValueTrend",
    preamble: "Here's the book value trend quarter over quarter, with the at-risk slice tracked alongside it. The gap has been widening modestly.",
  },
  {
    keywords: ["map", "geography", "geographic", "where", "location", "region", "market", "distribution", "spread"],
    dataKey: "propertyDistribution",
    preamble: "Geographically, the book spreads across 14 markets. Bubble size is book value, tint is risk — the coastal metros carry both the value and the exposure.",
  },
  {
    keywords: ["correlation", "moves with", "driver", "relationship", "related", "linked", "surprising"],
    dataKey: "correlationMatrix",
    preamble: "I looked for what moves with what across the book. A couple of these pairings are stronger than you'd expect — the brighter cells are worth interrogating.",
  },
  {
    keywords: ["workload", "appraiser", "appraisers", "signer", "capacity", "throughput", "who signed"],
    dataKey: "appraiserWorkload",
    preamble: "Appraiser workload is lopsided over the trailing 90 days — one signer is well above the pack, which is a concentration risk in your QA process.",
  },
  {
    keywords: ["extraction", "confidence", "data health", "data quality", "quality", "qa", "accuracy", "trust"],
    dataKey: "extractionQa",
    preamble: "Here's mean field-level extraction confidence across the book. It's healthy overall, but the lower-confidence fields are where I'd sample before trusting a figure.",
  },
  {
    keywords: ["price per sf", "price/sf", "psf", "per square foot", "$/sf", "pricing"],
    dataKey: "pricePerSfByClass",
    preamble: "Median price per square foot by class — the spread tells you where the book is paying up. Here it is.",
  },
  {
    keywords: ["approach", "methodology", "income approach", "sales comparison", "cost approach", "weighting"],
    dataKey: "valuationApproachMix",
    preamble: "Across the book, here's how appraisals split by primary approach. Income dominates, as you'd expect for a commercial-heavy portfolio.",
  },
];

const FALLBACK: ChatRoute = {
  keywords: [],
  dataKey: "bookValueTrend",
  preamble: "Here's the shape of the whole book to orient us — $6.51B across 3,935 appraisals. Ask me about concentration, staleness, risk, or a specific property and I'll pull the exact view.",
};

export interface RouteResult {
  report: Report | null;
  preamble: string;
}

/** Score a prompt against the routes and return the best-matching seeded
    report plus the written preamble. Falls back to a book-overview view. */
export function routePrompt(prompt: string, reports: Report[]): RouteResult {
  const text = ` ${prompt.toLowerCase()} `;

  let best: ChatRoute | null = null;
  let bestScore = 0;
  for (const route of ROUTES) {
    let score = 0;
    for (const kw of route.keywords) {
      if (text.includes(kw)) score += kw.includes(" ") ? 2 : 1; // phrases weigh more
    }
    if (score > bestScore) {
      bestScore = score;
      best = route;
    }
  }

  const chosen = best ?? FALLBACK;
  const report = resolveReport(chosen.dataKey, reports);
  return { report, preamble: chosen.preamble };
}

/** Prefer a starter report for the dataKey (cleanest title/provenance), else
    any report on that key, else the book KPI, else the first report. */
function resolveReport(dataKey: DataSeriesKey, reports: Report[]): Report | null {
  if (reports.length === 0) return null;
  const onKey = reports.filter((r) => r.dataKey === dataKey);
  const starter = onKey.find((r) => r.origin === "starter");
  return starter ?? onKey[0] ?? reports.find((r) => r.dataKey === "bookValueTrend") ?? reports[0];
}
