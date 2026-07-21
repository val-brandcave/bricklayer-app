import type { Report } from "@/types";

const T = 1_767_225_600_000;
const prov = (label: string, ref?: string) => ({ label, sourceRef: ref, asOf: T });

/* The starter catalog — pre-built, parameterized domain reports (Ed's ~19),
   covering every widget type. Plus a couple of user/AI-made reports.
   dataKey binds each to a seeded dataset (or a live collection). */
export const seedReports: Report[] = [
  {
    id: "rep-book-kpi", title: "Total book value", widgetType: "kpi",
    dimensions: [], measures: ["Book value"], dataKey: "bookValueTrend",
    ownerId: "usr-pm", ownerName: "Dana Whitfield", origin: "starter", tags: ["overview", "kpi"],
    provenance: prov("Aggregated across 3,935 appraisals"), createdAt: T,
  },
  {
    id: "rep-value-by-class", title: "Book value by asset class", widgetType: "hbar",
    dimensions: ["Asset class"], measures: ["Book value"], dataKey: "valueByClass",
    ownerId: "usr-pm", ownerName: "Dana Whitfield", origin: "starter", tags: ["concentration", "overview"],
    emphasisSeries: 0, provenance: prov("Aggregated across 3,935 appraisals"), createdAt: T,
  },
  {
    id: "rep-cap-by-vintage", title: "Avg cap rate by vintage", widgetType: "bar",
    dimensions: ["Vintage year"], measures: ["Avg cap rate"], dataKey: "capRateByVintage",
    ownerId: "usr-pm", ownerName: "Dana Whitfield", origin: "starter", tags: ["cap rate", "trend"],
    provenance: prov("Income-approach appraisals, 2018–2023"), createdAt: T,
  },
  {
    id: "rep-value-vs-cap", title: "Value vs. cap rate by class", widgetType: "scatter",
    dimensions: ["Cap rate"], measures: ["Value"], dataKey: "valueVsCapByClass",
    ownerId: "usr-co", ownerName: "Marcus Reyes", origin: "starter", tags: ["cap rate", "risk"],
    provenance: prov("Office / retail / industrial sub-books"), createdAt: T,
  },
  {
    id: "rep-approach-mix", title: "Valuation approach mix", widgetType: "donut",
    dimensions: ["Approach"], measures: ["Share"], dataKey: "valuationApproachMix",
    ownerId: "usr-ca", ownerName: "Priya Anand", origin: "starter", tags: ["methodology"],
    provenance: prov("Primary approach per appraisal"), createdAt: T,
  },
  {
    id: "rep-book-trend", title: "Book value trend & at-risk", widgetType: "area",
    dimensions: ["Quarter"], measures: ["Book value", "At-risk value"], dataKey: "bookValueTrend",
    ownerId: "usr-pm", ownerName: "Dana Whitfield", origin: "starter", tags: ["trend", "overview"],
    provenance: prov("Quarter-end book snapshots"), createdAt: T,
  },
  {
    id: "rep-book-line", title: "Book value trend (line)", widgetType: "line",
    dimensions: ["Quarter"], measures: ["Book value"], dataKey: "bookValueTrend",
    ownerId: "usr-pm", ownerName: "Dana Whitfield", origin: "starter", tags: ["trend"],
    provenance: prov("Quarter-end book snapshots"), createdAt: T,
  },
  {
    id: "rep-staleness", title: "Valuation staleness by class × age", widgetType: "heatmap",
    dimensions: ["Asset class", "Age band"], measures: ["Appraisal count"], dataKey: "stalenessByClassAge",
    ownerId: "usr-co", ownerName: "Marcus Reyes", origin: "starter", tags: ["staleness", "risk"],
    provenance: prov("All active appraisals by effective date"), createdAt: T,
  },
  {
    id: "rep-distribution", title: "Property distribution", widgetType: "map",
    dimensions: ["Location"], measures: ["Book value"], dataKey: "propertyDistribution",
    ownerId: "usr-pm", ownerName: "Dana Whitfield", origin: "starter", tags: ["geography", "overview"],
    provenance: prov("Geocoded property book"), createdAt: T,
  },
  {
    id: "rep-correlation", title: "What moves with what", widgetType: "heatmap",
    dimensions: ["Metric", "Metric"], measures: ["Correlation (r)"], dataKey: "correlationMatrix",
    ownerId: "usr-pm", ownerName: "Dana Whitfield", origin: "ai", tags: ["correlation", "surprising"],
    provenance: prov("Pairwise across 2,874 properties"), createdAt: T,
  },
  {
    id: "rep-watchlist", title: "Risk watchlist", widgetType: "watchlist",
    dimensions: ["Property"], measures: ["Risk score"], dataKey: "riskWatchlist",
    ownerId: "usr-co", ownerName: "Marcus Reyes", origin: "starter", tags: ["risk", "watchlist"],
    provenance: prov("Scored 0–100 with reasons"), createdAt: T,
  },
  {
    id: "rep-reprice", title: "Direct-cap reprice scenario", widgetType: "scenario",
    dimensions: [], measures: ["NOI", "Cap rate", "Occupancy"], dataKey: "directCapReprice",
    ownerId: "usr-co", ownerName: "Marcus Reyes", origin: "starter", tags: ["scenario", "stress"],
    provenance: prov("Editable — recomputes value live"), createdAt: T,
  },
  {
    id: "rep-flood", title: "Exposure by flood zone", widgetType: "bar",
    dimensions: ["Flood zone"], measures: ["Exposure"], dataKey: "flightRiskByFloodZone",
    ownerId: "usr-co", ownerName: "Marcus Reyes", origin: "starter", tags: ["risk", "geography"],
    emphasisSeries: 0, provenance: prov("FEMA zone × book value"), createdAt: T,
  },
  {
    id: "rep-psf-by-class", title: "Price / SF by asset class", widgetType: "hbar",
    dimensions: ["Asset class"], measures: ["Price / SF"], dataKey: "pricePerSfByClass",
    ownerId: "usr-pm", ownerName: "Dana Whitfield", origin: "starter", tags: ["pricing"],
    provenance: prov("Median price/SF by class"), createdAt: T,
  },
  {
    id: "rep-workload", title: "Appraiser workload (90d)", widgetType: "bar",
    dimensions: ["Appraiser"], measures: ["Reports"], dataKey: "appraiserWorkload",
    ownerId: "usr-ca", ownerName: "Priya Anand", origin: "starter", tags: ["workload", "quality"],
    emphasisSeries: 0, provenance: prov("Signed reports, trailing 90 days"), createdAt: T,
  },
  {
    id: "rep-extraction", title: "Extraction confidence", widgetType: "gauge",
    dimensions: [], measures: ["Avg confidence"], dataKey: "extractionQa",
    ownerId: "usr-ca", ownerName: "Priya Anand", origin: "starter", tags: ["data-health", "qa"],
    provenance: prov("Mean field-level extraction confidence"), createdAt: T,
  },
  {
    id: "rep-caprate-gauge", title: "Portfolio avg cap rate", widgetType: "gauge",
    dimensions: [], measures: ["Avg cap rate"], dataKey: "capRateByVintage",
    ownerId: "usr-pm", ownerName: "Dana Whitfield", origin: "starter", tags: ["cap rate", "kpi"],
    provenance: prov("Weighted by book value"), createdAt: T,
  },
  {
    id: "rep-class-pie", title: "Class mix (pie)", widgetType: "pie",
    dimensions: ["Asset class"], measures: ["Book value"], dataKey: "valueByClass",
    ownerId: "usr-pm", ownerName: "Dana Whitfield", origin: "starter", tags: ["concentration"],
    provenance: prov("Aggregated across 3,935 appraisals"), createdAt: T,
  },
  {
    id: "rep-appraisal-table", title: "Appraisal detail", widgetType: "table",
    dimensions: ["Property", "Appraiser"], measures: ["Value", "Cap rate", "Comps"], dataKey: "riskWatchlist",
    ownerId: "usr-ca", ownerName: "Priya Anand", origin: "starter", tags: ["detail", "table"],
    provenance: prov("Latest appraisal per property"), createdAt: T,
  },
];
