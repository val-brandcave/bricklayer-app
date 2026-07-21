/* ============================================================
   Widget data resolver — bridges a Report's `dataKey` to the concrete
   data its widget needs. Curated chart series live in datasets.ts;
   collection-backed widgets (watchlist / map / table) read the seed
   arrays directly here.

   NOTE: in Phase 4 the collection-backed getters move behind the
   store/adapter (a page hook passes the data in). The chart `datasets`
   are static curated viz data and stay resolved here. Keep this layer
   pure — no React, no side effects.
   ============================================================ */

import type { DataSeriesKey, Report, WidgetType } from "@/types";
import type { DatasetShape } from "./datasets";
import { bookStats, correlationMatrix, datasets, scenarioBase, stalenessMatrix } from "./datasets";
import type { ScenarioBase } from "./datasets";
import type { Unit } from "@/lib/format";
import type { KpiDelta } from "@/components/molecules/viz";
import type { MapPoint, TableColumn } from "@/components/molecules/viz";
import { fmtPct, fmtUsd } from "@/lib/format";
import { seedProperties } from "./seed/properties.seed";
import { seedWatchlist } from "./seed/watchlist.seed";
import { seedAppraisals } from "./seed/appraisals.seed";
import type { WatchlistItem } from "@/types";

/* ---------- chart series (bar / hbar / line / area) ---------- */

export function getSeries(dataKey: DataSeriesKey): DatasetShape | null {
  return (datasets as Record<string, DatasetShape>)[dataKey] ?? null;
}

/* ---------- pie / donut ---------- */

export interface PieResolved {
  data: DatasetShape["data"];
  categoryKey: string;
  valueKey: string;
  unit?: Unit;
  centerLabel?: string;
  centerCaption?: string;
}

export function getPie(dataKey: DataSeriesKey, donut: boolean): PieResolved | null {
  const ds = getSeries(dataKey);
  if (!ds) return null;
  const valueKey = ds.series[0].key;
  const total = ds.data.reduce((s, d) => s + Number(d[valueKey]), 0);
  return {
    data: ds.data,
    categoryKey: ds.xKey,
    valueKey,
    unit: ds.unit as Unit,
    centerLabel: donut ? (ds.unit === "usd" ? fmtUsd(total) : ds.unit === "pct" ? `${total}%` : String(total)) : undefined,
    centerCaption: donut ? "total" : undefined,
  };
}

/* ---------- scatter ---------- */

export interface ScatterResolved {
  data: DatasetShape["data"];
  xKey: string;
  yKey: string;
  groupKey: string;
  groups: DatasetShape["series"];
  unitX: Unit;
  unitY: Unit;
}

export function getScatter(dataKey: DataSeriesKey): ScatterResolved | null {
  const ds = getSeries(dataKey);
  if (!ds) return null;
  return { data: ds.data, xKey: ds.xKey, yKey: "value", groupKey: "cls", groups: ds.series, unitX: "pct", unitY: "usd" };
}

/* ---------- gauge ---------- */

export interface GaugeResolved {
  value: number;
  max: number;
  suffix: string;
  decimals: number;
  caption?: string;
  colorIndex: number;
}

export function getGauge(dataKey: DataSeriesKey): GaugeResolved {
  if (dataKey === "extractionQa") {
    const avg = seedAppraisals.reduce((s, a) => s + a.extractionConfidence, 0) / seedAppraisals.length;
    return { value: Math.round(avg * 10) / 10, max: 100, suffix: "%", decimals: 1, caption: "Mean field-level confidence", colorIndex: 5 };
  }
  // capRateByVintage → portfolio avg cap rate
  return { value: bookStats.avgCapRate, max: 12, suffix: "%", decimals: 2, caption: "Weighted by book value", colorIndex: 0 };
}

/* ---------- kpi ---------- */

export interface KpiResolved {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals: number;
  delta?: KpiDelta;
  caption?: string;
}

export function getKpi(dataKey: DataSeriesKey): KpiResolved {
  // bookValueTrend → total book value, shown in $B so the count-up reads well
  if (dataKey === "bookValueTrend") {
    return {
      value: bookStats.bookValue / 1_000_000_000,
      prefix: "$",
      suffix: "B",
      decimals: 2,
      delta: { direction: "up", value: `+${bookStats.qoqValueDelta}% QoQ`, goodWhenUp: true },
      caption: `Across ${bookStats.appraisalCount.toLocaleString("en-US")} appraisals`,
    };
  }
  return { value: bookStats.appraisalCount, decimals: 0, caption: "Appraisals in book" };
}

/* ---------- heatmap ---------- */

export interface MatrixResolved {
  rows: string[];
  cols: string[];
  values: number[][];
  kind: "count" | "corr";
}

export function getMatrix(dataKey: DataSeriesKey): MatrixResolved | null {
  if (dataKey === "stalenessByClassAge") {
    return { rows: stalenessMatrix.rows, cols: stalenessMatrix.cols, values: stalenessMatrix.values, kind: "count" };
  }
  if (dataKey === "correlationMatrix") {
    return { rows: correlationMatrix.labels, cols: correlationMatrix.labels, values: correlationMatrix.values, kind: "corr" };
  }
  return null;
}

/* ---------- watchlist ---------- */

export function getWatchlist(): WatchlistItem[] {
  return [...seedWatchlist].sort((a, b) => b.score - a.score);
}

/* ---------- scenario ---------- */

export function getScenario(): ScenarioBase {
  return scenarioBase;
}

/* ---------- map ---------- */

export function getMapPoints(): MapPoint[] {
  return seedProperties.map((p) => ({
    name: p.name,
    lat: p.lat,
    lng: p.lng,
    value: p.bookValue,
    score: p.riskScore,
    assetClass: p.assetClass,
  }));
}

/* ---------- table ---------- */

const CLASS_LABEL: Record<string, string> = {
  office: "Office",
  retail: "Retail",
  industrial: "Industrial",
  residential: "Residential",
  multifamily: "Multifamily",
  hospitality: "Hospitality",
  land: "Land",
};

export interface TableResolved {
  columns: TableColumn[];
  rows: Record<string, React.ReactNode>[];
}

export function getTable(): TableResolved {
  const columns: TableColumn[] = [
    { key: "name", label: "Property" },
    { key: "cls", label: "Class" },
    { key: "value", label: "Value", numeric: true },
    { key: "cap", label: "Cap rate", numeric: true },
    { key: "risk", label: "Risk", numeric: true },
  ];
  const rows = [...seedProperties]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 14)
    .map((p) => ({
      name: p.name,
      cls: CLASS_LABEL[p.assetClass] ?? p.assetClass,
      value: fmtUsd(p.bookValue),
      cap: fmtPct(p.capRate),
      risk: String(p.riskScore),
    }));
  return { columns, rows };
}

/* Widget types this resolver can currently feed (all 14). */
export const SUPPORTED_WIDGETS: WidgetType[] = [
  "kpi",
  "bar",
  "hbar",
  "line",
  "area",
  "donut",
  "pie",
  "gauge",
  "table",
  "scatter",
  "map",
  "heatmap",
  "watchlist",
  "scenario",
];
