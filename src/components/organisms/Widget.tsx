"use client";

import { Bookmark, Pencil } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { ChartFrame } from "@/components/molecules/ChartFrame";
import type { FrameKind } from "@/components/molecules/ChartFrame";
import {
  BarChartViz,
  DataTableViz,
  GaugeViz,
  HeatmapViz,
  KpiViz,
  LineAreaViz,
  MapViz,
  PieDonutViz,
  ScatterViz,
  ScenarioViz,
  WatchlistViz,
} from "@/components/molecules/viz";
import {
  getGauge,
  getKpi,
  getMapPoints,
  getMatrix,
  getPie,
  getScatter,
  getScenario,
  getSeries,
  getTable,
  getWatchlist,
} from "@/data/resolve";
import type { Unit } from "@/lib/format";
import type { Report } from "@/types";

export interface WidgetProps {
  report: Report;
  /** "tile" = on a dashboard; "mcp" = same report in chat (Save/Edit); "bare" = no chrome. */
  frame?: FrameKind;
  loading?: boolean;
  /** Fill the parent's height (resizable dashboard tile). The visualization
      sizes to the tile's measured box instead of a fixed per-type height. */
  fill?: boolean;
  inStagger?: boolean;
  /** header-right controls (e.g. a per-tile menu on a dashboard). */
  actions?: React.ReactNode;
  onSave?: (report: Report) => void;
  onEdit?: (report: Report) => void;
  className?: string;
}

/* Body height per widget type so the skeleton and the loaded chart occupy the
   same space (no layout shift), and denser widgets get more room. */
const BODY_HEIGHT: Partial<Record<Report["widgetType"], number>> = {
  kpi: 150,
  gauge: 220,
  table: 260,
  watchlist: 268,
  scenario: 300,
  heatmap: 250,
  map: 250,
};

/* Widget — the organism that turns a Report into a rendered visualization.
   ONE component, two frames: a Tile on a dashboard and an MCP app in chat are
   the same Widget with a different `frame` (see CLAUDE.md vocabulary). It
   resolves the report's data by widgetType and dispatches to a chart
   primitive; loading shows ChartFrame's skeleton in the same layout. */
export function Widget({ report, frame = "tile", loading = false, fill = false, inStagger = false, actions, onSave, onEdit, className }: WidgetProps) {
  const h = BODY_HEIGHT[report.widgetType] ?? 240;
  const footer =
    frame === "mcp" ? (
      <>
        <Button variant="ghost" size="sm" iconLeft={Pencil} onClick={() => onEdit?.(report)}>
          Edit
        </Button>
        <Button variant="secondary" size="sm" iconLeft={Bookmark} onClick={() => onSave?.(report)}>
          Save
        </Button>
      </>
    ) : undefined;

  return (
    <ChartFrame
      title={report.title}
      subtitle={report.subtitle}
      provenance={report.provenance}
      frame={frame}
      loading={loading}
      bodyHeight={h}
      fill={fill}
      inStagger={inStagger}
      actions={actions}
      footer={footer}
      className={className}
    >
      {(height: number) => <WidgetBody report={report} height={height} />}
    </ChartFrame>
  );
}

/* The inner dispatch — picks the primitive for the report's widgetType and
   feeds it resolved data. Kept separate so ChartFrame owns the loading gate. */
function WidgetBody({ report, height }: { report: Report; height: number }) {
  const { widgetType, dataKey } = report;

  switch (widgetType) {
    case "kpi": {
      const k = getKpi(dataKey);
      return <KpiViz {...k} height={height} />;
    }
    case "bar":
    case "hbar": {
      const ds = getSeries(dataKey);
      if (!ds) return <Unsupported label={report.title} />;
      return (
        <BarChartViz
          data={ds.data}
          xKey={ds.xKey}
          series={ds.series}
          unit={ds.unit as Unit}
          horizontal={widgetType === "hbar"}
          emphasisIndex={ds.emphasisIndex}
          height={height}
        />
      );
    }
    case "line":
    case "area": {
      const ds = getSeries(dataKey);
      if (!ds) return <Unsupported label={report.title} />;
      return <LineAreaViz data={ds.data} xKey={ds.xKey} series={ds.series} unit={ds.unit as Unit} area={widgetType === "area"} height={height} />;
    }
    case "pie":
    case "donut": {
      const p = getPie(dataKey, widgetType === "donut");
      if (!p) return <Unsupported label={report.title} />;
      return (
        <PieDonutViz
          data={p.data}
          categoryKey={p.categoryKey}
          valueKey={p.valueKey}
          unit={p.unit}
          donut={widgetType === "donut"}
          centerLabel={p.centerLabel}
          centerCaption={p.centerCaption}
          height={height}
        />
      );
    }
    case "scatter": {
      const s = getScatter(dataKey);
      if (!s) return <Unsupported label={report.title} />;
      return <ScatterViz {...s} height={height} />;
    }
    case "gauge": {
      const g = getGauge(dataKey);
      return <GaugeViz {...g} height={height} />;
    }
    case "heatmap": {
      const m = getMatrix(dataKey);
      if (!m) return <Unsupported label={report.title} />;
      return <HeatmapViz rows={m.rows} cols={m.cols} values={m.values} kind={m.kind} height={height} />;
    }
    case "watchlist":
      return <WatchlistViz items={getWatchlist()} height={height} />;
    case "scenario":
      return <ScenarioViz base={getScenario()} height={height} />;
    case "map":
      return <MapViz points={getMapPoints()} height={height} />;
    case "table": {
      const t = getTable();
      return <DataTableViz columns={t.columns} rows={t.rows} height={height} />;
    }
    default:
      return <Unsupported label={report.title} />;
  }
}

function Unsupported({ label }: { label: string }) {
  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: 120, color: "var(--muted)", fontSize: 13, textAlign: "center" }}>
      No renderer for “{label}”.
    </div>
  );
}
