"use client";

import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import type { DatasetShape, Point } from "@/data/datasets";
import { fmtByUnit } from "@/lib/format";
import type { Unit } from "@/lib/format";
import { commonAxisProps, GRID_STROKE, seriesVar, VizLegend, VizTooltip } from "./chrome";

export interface ScatterVizProps {
  data: Point[];
  xKey: string;
  yKey: string;
  /** field whose value assigns each point to a series group. */
  groupKey: string;
  groups: DatasetShape["series"];
  unitX?: Unit;
  unitY?: Unit;
  height?: number;
}

/* Scatter widget — points grouped into colored series (e.g. value vs. cap
   rate, split by asset class). Axes are numeric with token-formatted ticks. */
export function ScatterViz({ data, xKey, yKey, groupKey, groups, unitX = "pct", unitY = "usd", height = 240 }: ScatterVizProps) {
  const chartH = height - 26;
  return (
    <div>
      <VizLegend items={groups.map((g) => ({ label: g.label, color: seriesVar(g.colorIndex) }))} />
      <ResponsiveContainer width="100%" height={chartH}>
        <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 4 }}>
          <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey={xKey}
            name="Cap rate"
            tickFormatter={(v: number) => fmtByUnit(v, unitX)}
            domain={["dataMin - 0.5", "dataMax + 0.5"]}
            {...commonAxisProps}
          />
          <YAxis
            type="number"
            dataKey={yKey}
            name="Value"
            tickFormatter={(v: number) => fmtByUnit(v, unitY)}
            width={52}
            {...commonAxisProps}
          />
          <ZAxis range={[60, 60]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "var(--hairline-2)" }}
            content={<VizTooltip unit={unitY} hideLabel />}
          />
          {groups.map((g) => (
            <Scatter
              key={g.key}
              name={g.label}
              data={data.filter((d) => d[groupKey] === g.key)}
              fill={seriesVar(g.colorIndex)}
              fillOpacity={0.82}
              isAnimationActive
              animationDuration={520}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
