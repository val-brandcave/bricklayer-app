import type { BaseEntity, Lens, Provenance, UUID } from "./common.types";

/* ============================================================
   Domain vocabulary is FIXED (see CLAUDE.md):
   Widget (type) → Report (saved instance) → Tile (on dashboard)
   / MCP app (in chat). Dashboard = collection of reports.
   ============================================================ */

/* ---------- Properties & appraisals ---------- */

export type AssetClass =
  | "residential"
  | "office"
  | "retail"
  | "industrial"
  | "multifamily"
  | "hospitality"
  | "land";

export type FloodZone = "X" | "AE" | "A" | "VE" | "none";

export type ValuationStatus = "fresh" | "aging" | "stale";

export type ValuationApproach = "income" | "sales-comparison" | "cost";

export interface Property extends BaseEntity {
  name: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  assetClass: AssetClass;
  yearBuilt: number;
  sfArea: number; // square feet
  bookValue: number; // USD
  capRate: number; // percent, e.g. 6.18
  pricePerSF: number; // USD/SF
  occupancy: number; // percent 0-100
  noi: number; // net operating income, USD
  floodZone: FloodZone;
  zoning: string;
  valuationStatus: ValuationStatus;
  monthsSinceValuation: number;
  riskScore: number; // 0-100
  latestAppraisalId: UUID;
}

export interface Appraisal extends BaseEntity {
  propertyId: UUID;
  reportNumber: string; // e.g. "A-2291"
  appraiser: string;
  appraiserLicense: string;
  firm: string;
  effectiveDate: number; // epoch ms
  value: number; // concluded value USD
  capRate: number;
  noi: number;
  approach: ValuationApproach; // primary approach
  approachWeights: { income: number; sales: number; cost: number }; // percent split
  compCount: number;
  compCoV: number; // coefficient of variation across comps (%)
  status: ValuationStatus;
  pageRef: string; // provenance, e.g. "p.14"
  extractionConfidence: number; // 0-100 data-health / QA
}

/* ---------- Widgets, reports, dashboards ---------- */

export type WidgetType =
  | "kpi"
  | "bar"
  | "hbar"
  | "line"
  | "area"
  | "donut"
  | "pie"
  | "gauge"
  | "table"
  | "scatter"
  | "map"
  | "heatmap"
  | "watchlist"
  | "scenario";

export type Dimension = string; // category / date field key
export type Measure = string; // aggregated numeric field key

export type DataSeriesKey =
  | "capRateByVintage"
  | "valueByClass"
  | "valueVsCapByClass"
  | "valuationApproachMix"
  | "bookValueTrend"
  | "stalenessByClassAge"
  | "propertyDistribution"
  | "correlationMatrix"
  | "riskWatchlist"
  | "directCapReprice"
  | "flightRiskByFloodZone"
  | "pricePerSfByClass"
  | "appraiserWorkload"
  | "extractionQa";

export interface Report extends BaseEntity {
  title: string;
  subtitle?: string;
  widgetType: WidgetType;
  dimensions: Dimension[];
  measures: Measure[];
  dataKey: DataSeriesKey; // which seeded dataset feeds it
  ownerId: UUID;
  ownerName: string;
  origin: "user" | "ai" | "starter"; // starter = pre-built domain catalog
  tags: string[];
  lens?: Lens; // relevant lens, if scoped
  provenance: Provenance;
  emphasisSeries?: number; // index into c1..c8 to emphasize
}

export type DashboardAccess = "private" | "everyone-view" | "everyone-edit";

export interface Tile {
  reportId: UUID;
  x: number; // grid column (0-based)
  y: number; // grid row
  w: number; // width in grid columns (12-col grid)
  h: number; // height in row units
}

export interface Dashboard extends BaseEntity {
  name: string;
  description?: string;
  lens: Lens;
  ownerId: UUID;
  ownerName: string;
  access: DashboardAccess;
  isDefault: boolean; // starred default per lens
  favorite: boolean;
  ephemeral: boolean; // built for one meeting, expires
  origin: "user" | "ai";
  tiles: Tile[];
}

/* ---------- Insights (the opinion / critique layer) ---------- */

export type InsightKind =
  | "concentration"
  | "staleness"
  | "premium"
  | "correlation"
  | "workload"
  | "data-health";

export type Severity = "info" | "watch" | "high";

/* The two kinds of insight, distinguished by provenance + trust:
   - "curated"    → a prescriptive cut of the book (predefined widget). Trusted,
                    pinnable; the Read is advisory ("what I'd do").
   - "discovered" → an LLM-found correlation (the "surprising link" / wow).
                    Provisional; NOT pinned until validated; the Read is
                    skeptical ("correlation, not proof"). Ed's 28:07 split. */
export type InsightOrigin = "curated" | "discovered";

export interface Insight extends BaseEntity {
  lens: Lens;
  kind: InsightKind;
  severity: Severity;
  title: string;
  claim: string; // the finding, one line
  evidence: { label: string; value: string; delta?: string }[];
  bricklaysRead: string; // the skeptical AI critique of its own number
  followUps: string[]; // "dig deeper" chips
  origin: InsightOrigin; // curated finding vs. LLM-discovered surprising link
  relatedReportId?: UUID; // the chart the Read reasons over
  dismissed?: boolean;
}

/* ---------- Users, watchlist ---------- */

export interface User extends BaseEntity {
  name: string;
  email: string;
  title: string;
  lens: Lens;
  initials: string;
}

export interface WatchlistItem extends BaseEntity {
  propertyId: UUID;
  propertyName: string;
  location: string;
  assetClass: AssetClass;
  score: number; // 0-100
  severity: Severity;
  reasons: string[]; // the WHY column
  lens: Lens;
}
