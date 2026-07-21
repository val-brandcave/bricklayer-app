"use client";

import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DatasetShape, Point } from "@/data/datasets";
import { fmtByUnit } from "@/lib/format";
import type { Unit } from "@/lib/format";
import { commonAxisProps, GRID_STROKE, seriesVar, VizLegend, VizTooltip } from "./chrome";

export interface LineAreaVizProps {
  data: Point[];
  xKey: string;
  series: DatasetShape["series"];
  unit?: Unit;
  /** render as stacked-area (widgetType "area") vs. line (widgetType "line"). */
  area?: boolean;
  height?: number;
}

/* Line / area trend widget. Multi-series areas get soft token gradients;
   lines stay crisp. A compact legend shows when there's more than one series. */
export function LineAreaViz({ data, xKey, series, unit, area = false, height = 240 }: LineAreaVizProps) {
  const tickFmt = (v: number) => fmtByUnit(v, unit);
  const gradId = (i: number) => `bl-area-grad-${series[i].key}`;
  const showLegend = series.length > 1;
  const chartH = showLegend ? height - 26 : height;

  return (
    <div>
      {showLegend && <VizLegend items={series.map((s) => ({ label: s.label, color: seriesVar(s.colorIndex) }))} />}
      <ResponsiveContainer width="100%" height={chartH}>
        {area ? (
          <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <defs>
              {series.map((s, i) => (
                <linearGradient key={s.key} id={gradId(i)} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={seriesVar(s.colorIndex)} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={seriesVar(s.colorIndex)} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
            <XAxis type="category" dataKey={xKey} {...commonAxisProps} />
            <YAxis type="number" tickFormatter={tickFmt} width={52} {...commonAxisProps} />
            <Tooltip content={<VizTooltip unit={unit} />} />
            {series.map((s, i) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={seriesVar(s.colorIndex)}
                strokeWidth={2}
                fill={`url(#${gradId(i)})`}
                isAnimationActive
                animationDuration={620}
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
            <XAxis type="category" dataKey={xKey} {...commonAxisProps} />
            <YAxis type="number" tickFormatter={tickFmt} width={52} {...commonAxisProps} />
            <Tooltip content={<VizTooltip unit={unit} />} />
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={seriesVar(s.colorIndex)}
                strokeWidth={2.25}
                dot={{ r: 2.5, strokeWidth: 0, fill: seriesVar(s.colorIndex) }}
                activeDot={{ r: 4.5 }}
                isAnimationActive
                animationDuration={620}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
