/* ============================================================
   Curated chart datasets + book-level headline stats.
   Widgets read these by `dataKey`. The seeded `properties` collection
   is a representative drill-down sample of the full book; these
   aggregates reflect the whole ~$6.5B / 3,935-appraisal book from the
   discovery numbers. Pure data, no logic.
   ============================================================ */

export const bookStats = {
  bookValue: 6_512_400_000,
  bookValueLabel: "$6.51B",
  appraisalCount: 3935,
  propertyCount: 2874,
  avgCapRate: 6.18,
  staleCount: 1233, // valued > 24 months ago
  watchlistCount: 47,
  watchlistHigh: 9,
  markets: 14,
  qoqValueDelta: 2.4,
  capRateDeltaBps: -12,
};

export type Point = Record<string, string | number>;

export interface DatasetShape {
  data: Point[];
  xKey: string;
  series: { key: string; label: string; colorIndex: number }[];
  unit?: "usd" | "pct" | "count" | "usd-sf";
  emphasisIndex?: number; // index in data to emphasize (e.g. latest)
}

export const datasets: Record<string, DatasetShape> = {
  capRateByVintage: {
    xKey: "vintage",
    unit: "pct",
    emphasisIndex: 5,
    series: [{ key: "capRate", label: "Avg cap rate", colorIndex: 0 }],
    data: [
      { vintage: "2018", capRate: 5.4 },
      { vintage: "2019", capRate: 5.7 },
      { vintage: "2020", capRate: 5.6 },
      { vintage: "2021", capRate: 6.3 },
      { vintage: "2022", capRate: 6.9 },
      { vintage: "2023", capRate: 7.4 },
    ],
  },

  valueByClass: {
    xKey: "class",
    unit: "usd",
    series: [{ key: "value", label: "Book value", colorIndex: 0 }],
    data: [
      { class: "Residential", value: 1_552_400_000 },
      { class: "Industrial", value: 1_204_010_000 },
      { class: "Office", value: 1_187_900_000 },
      { class: "Retail", value: 938_250_000 },
      { class: "Multifamily", value: 861_300_000 },
      { class: "Hospitality", value: 512_140_000 },
      { class: "Land", value: 256_400_000 },
    ],
  },

  pricePerSfByClass: {
    xKey: "class",
    unit: "usd-sf",
    series: [{ key: "psf", label: "Price / SF", colorIndex: 1 }],
    data: [
      { class: "Office", psf: 412 },
      { class: "Retail", psf: 328 },
      { class: "Residential", psf: 296 },
      { class: "Multifamily", psf: 274 },
      { class: "Industrial", psf: 168 },
      { class: "Hospitality", psf: 221 },
    ],
  },

  bookValueTrend: {
    xKey: "quarter",
    unit: "usd",
    series: [
      { key: "value", label: "Book value", colorIndex: 0 },
      { key: "atRisk", label: "At-risk value", colorIndex: 4 },
    ],
    data: [
      { quarter: "Q1 '25", value: 6_010_000_000, atRisk: 720_000_000 },
      { quarter: "Q2 '25", value: 6_140_000_000, atRisk: 690_000_000 },
      { quarter: "Q3 '25", value: 6_220_000_000, atRisk: 810_000_000 },
      { quarter: "Q4 '25", value: 6_355_000_000, atRisk: 905_000_000 },
      { quarter: "Q1 '26", value: 6_412_000_000, atRisk: 980_000_000 },
      { quarter: "Q2 '26", value: 6_512_400_000, atRisk: 1_060_000_000 },
    ],
  },

  valuationApproachMix: {
    xKey: "approach",
    unit: "pct",
    series: [{ key: "share", label: "Share of appraisals", colorIndex: 2 }],
    data: [
      { approach: "Income", share: 58 },
      { approach: "Sales comparison", share: 31 },
      { approach: "Cost", share: 11 },
    ],
  },

  valueVsCapByClass: {
    xKey: "capRate",
    unit: "usd",
    series: [
      { key: "office", label: "Office", colorIndex: 0 },
      { key: "retail", label: "Retail", colorIndex: 1 },
      { key: "industrial", label: "Industrial", colorIndex: 5 },
    ],
    // scatter: each point {capRate, value, class}
    data: [
      { capRate: 5.1, value: 42_000_000, cls: "office" },
      { capRate: 5.8, value: 28_000_000, cls: "office" },
      { capRate: 6.4, value: 61_000_000, cls: "office" },
      { capRate: 7.2, value: 18_000_000, cls: "office" },
      { capRate: 11.4, value: 54_000_000, cls: "office" },
      { capRate: 5.9, value: 22_000_000, cls: "retail" },
      { capRate: 6.6, value: 15_000_000, cls: "retail" },
      { capRate: 7.1, value: 33_000_000, cls: "retail" },
      { capRate: 8.0, value: 9_000_000, cls: "retail" },
      { capRate: 5.4, value: 47_000_000, cls: "industrial" },
      { capRate: 5.9, value: 38_000_000, cls: "industrial" },
      { capRate: 6.2, value: 52_000_000, cls: "industrial" },
      { capRate: 6.8, value: 29_000_000, cls: "industrial" },
    ],
  },

  flightRiskByFloodZone: {
    xKey: "zone",
    unit: "usd",
    series: [{ key: "exposure", label: "Exposure", colorIndex: 4 }],
    data: [
      { zone: "X (minimal)", exposure: 4_820_000_000 },
      { zone: "AE (100-yr)", exposure: 1_140_000_000 },
      { zone: "A", exposure: 386_000_000 },
      { zone: "VE (coastal)", exposure: 166_400_000 },
    ],
  },

  appraiserWorkload: {
    xKey: "appraiser",
    unit: "count",
    emphasisIndex: 0,
    series: [{ key: "reports", label: "Reports (90d)", colorIndex: 3 }],
    data: [
      { appraiser: "D. Whitfield", reports: 214 },
      { appraiser: "M. Osei", reports: 96 },
      { appraiser: "R. Delgado", reports: 88 },
      { appraiser: "S. Kaminski", reports: 81 },
      { appraiser: "J. Ferreira", reports: 74 },
      { appraiser: "L. Nakamura", reports: 69 },
    ],
  },
};

/* Valuation-staleness heatmap: class (rows) × age band (cols), value = count. */
export const stalenessMatrix = {
  rows: ["Residential", "Office", "Retail", "Industrial", "Multifamily", "Hospitality"],
  cols: ["0–12mo", "12–24mo", "24–36mo", "36mo+"],
  values: [
    [402, 288, 196, 121],
    [180, 214, 233, 168],
    [166, 158, 141, 96],
    [301, 176, 88, 41],
    [212, 133, 74, 38],
    [98, 76, 61, 44],
  ],
};

/* "What moves with what" — correlation matrix (r-values). */
export const correlationMatrix = {
  labels: ["Cap rate", "Price/SF", "Occupancy", "Age", "Comp CoV", "Flood risk"],
  values: [
    [1.0, -0.42, -0.61, 0.28, 0.55, 0.12],
    [-0.42, 1.0, 0.47, -0.33, -0.29, -0.08],
    [-0.61, 0.47, 1.0, -0.19, -0.44, -0.15],
    [0.28, -0.33, -0.19, 1.0, 0.21, 0.06],
    [0.55, -0.29, -0.44, 0.21, 1.0, 0.31],
    [0.12, -0.08, -0.15, 0.06, 0.31, 1.0],
  ],
};

/* Direct-cap reprice scenario — base inputs; the widget recomputes live. */
export interface ScenarioBase {
  noi: number;
  capRate: number;
  occupancy: number;
  rows: { label: string; noi: number; capRate: number; occupancy: number }[];
}

export const scenarioBase: ScenarioBase = {
  noi: 4_820_000,
  capRate: 6.5,
  occupancy: 92,
  rows: [
    { label: "1400 Market St", noi: 4_820_000, capRate: 6.5, occupancy: 92 },
    { label: "88 Harborview", noi: 2_140_000, capRate: 7.1, occupancy: 84 },
    { label: "Cedar Industrial", noi: 3_310_000, capRate: 5.9, occupancy: 96 },
  ],
};
