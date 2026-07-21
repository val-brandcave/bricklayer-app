"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DatasetShape, Point } from "@/data/datasets";
import { fmtByUnit } from "@/lib/format";
import type { Unit } from "@/lib/format";
import { commonAxisProps, seriesVar, VizTooltip } from "./chrome";

export interface BarChartVizProps {
  data: Point[];
  xKey: string;
  series: DatasetShape["series"];
  unit?: Unit;
  /** horizontal bars (hbar) — ranked categories read better this way. */
  horizontal?: boolean;
  /** index in `data` to emphasize (single-series charts) with a brighter fill. */
  emphasisIndex?: number;
  height?: number;
}

/* Bar / horizontal-bar widget. One component for both orientations
   (widgetType "bar" and "hbar") — the frame decides which. Colors come
   from the c1..c8 series tokens via seriesVar. */
export function BarChartViz({ data, xKey, series, unit, horizontal = false, emphasisIndex, height = 240 }: BarChartVizProps) {
  const single = series.length === 1;
  const tickFmt = (v: number) => fmtByUnit(v, unit);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 12, bottom: 4, left: horizontal ? 8 : 0 }}
        barCategoryGap={horizontal ? "22%" : "28%"}
      >
        {/* Axes MUST be direct children of the chart — Recharts does not detect
            axis components wrapped in a Fragment (breaks tick labels + the
            category scale), so we switch props by orientation instead. */}
        <XAxis
          {...(horizontal ? { type: "number" as const, tickFormatter: tickFmt } : { type: "category" as const, dataKey: xKey, interval: 0 })}
          {...commonAxisProps}
        />
        <YAxis
          {...(horizontal
            ? { type: "category" as const, dataKey: xKey, width: 110, interval: 0 }
            : { type: "number" as const, tickFormatter: tickFmt, width: 52 })}
          {...commonAxisProps}
        />
        <Tooltip cursor={{ fill: "var(--surface-2)", opacity: 0.5 }} content={<VizTooltip unit={unit} />} />
        {series.map((s, si) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={seriesVar(s.colorIndex)}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            isAnimationActive
            animationDuration={520}
          >
            {single &&
              data.map((_, i) => (
                <Cell
                  key={i}
                  fill={seriesVar(s.colorIndex)}
                  fillOpacity={emphasisIndex == null || i === emphasisIndex ? 1 : 0.5}
                />
              ))}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
