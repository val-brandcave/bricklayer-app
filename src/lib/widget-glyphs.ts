import {
  Activity,
  BarChart3,
  BarChartHorizontal,
  Gauge,
  Hash,
  LineChart,
  ListChecks,
  Map as MapIcon,
  PieChart,
  ScatterChart,
  SlidersHorizontal,
  Table2,
  TrendingUp,
  Grid3x3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WidgetType } from "@/types";

/* Shared glyph + human label per widget type — used by the report picker,
   the Reports library, and the editor so a type always reads the same way. */
export const WIDGET_GLYPH: Record<WidgetType, { icon: LucideIcon; label: string }> = {
  kpi: { icon: Hash, label: "KPI" },
  bar: { icon: BarChart3, label: "Bar chart" },
  hbar: { icon: BarChartHorizontal, label: "Horizontal bar" },
  line: { icon: LineChart, label: "Line chart" },
  area: { icon: TrendingUp, label: "Area chart" },
  donut: { icon: Activity, label: "Donut" },
  pie: { icon: PieChart, label: "Pie chart" },
  gauge: { icon: Gauge, label: "Gauge" },
  table: { icon: Table2, label: "Table" },
  scatter: { icon: ScatterChart, label: "Scatter plot" },
  map: { icon: MapIcon, label: "Map" },
  heatmap: { icon: Grid3x3, label: "Heatmap" },
  watchlist: { icon: ListChecks, label: "Watchlist" },
  scenario: { icon: SlidersHorizontal, label: "Scenario" },
};
