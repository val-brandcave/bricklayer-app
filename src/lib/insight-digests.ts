import type { Lens } from "@/types";

/* Per-lens "TODAY" digest — the book-wide read Bricklayer opens the Insights
   landing with (Ed's POC left-rail narrative, screenshots 1 & 3). It is a
   SYNTHESIS, not a re-list of the findings: the component renders only the live
   lede (counts, composed there) + this one posture sentence — the "where do I
   look first / how should I feel" that no individual finding card gives, and
   which holds the same whether a lens surfaces 2 findings or 12. The per-finding
   detail lives in the cards below and their "Bricklayer's Read".

   Copy is written to the seeded numbers in `data/seed/insights.seed.ts` and
   `data/datasets.ts` (bookStats); keep them in sync if either changes. */

export interface LensDigest {
  /** Lens-context eyebrow shown beside the TODAY label (POC per-lens header). */
  eyebrow: string;
  /** The single synthesis sentence after the lede — posture + the first move.
      Names the one most material item so it orients without listing. */
  posture: string;
}

export const LENS_DIGESTS: Record<Lens, LensDigest> = {
  "portfolio-manager": {
    eyebrow: "Appraisal portfolio overview",
    posture:
      "Nothing critical since your last visit — book value is up 2.4% this quarter and no policy limit is breached; the one thing to keep an eye on is Residential concentration, now 23.8% and climbing.",
  },
  "credit-officer": {
    eyebrow: "Collateral & credit risk",
    posture:
      "One item to clear before it reaches a memo — the 1400 Market St cap rate looks transposed and is skewing the office trend. Nothing else escalated since your last visit.",
  },
  "chief-appraiser": {
    eyebrow: "Panel & valuation quality",
    posture:
      "One workload outlier worth a sample re-review — 214 reports from a single appraiser in 90 days. The data-health items are fixable, not structural.",
  },
};
