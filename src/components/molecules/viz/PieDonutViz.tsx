"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Point } from "@/data/datasets";
import { fmtByUnit } from "@/lib/format";
import type { Unit } from "@/lib/format";
import { seriesVar, VizLegend, VizTooltip } from "./chrome";

export interface PieDonutVizProps {
  data: Point[];
  categoryKey: string;
  valueKey: string;
  unit?: Unit;
  /** donut (center hole + total) vs. full pie. */
  donut?: boolean;
  /** center label for the donut hole (e.g. "$6.5B"). */
  centerLabel?: string;
  centerCaption?: string;
  height?: number;
}

/* Pie / donut composition widget. Slices take the c1..c8 series colors in
   order; a legend sits alongside so slices stay labelled without clutter.
   The donut variant shows a computed total in the hole. */
export function PieDonutViz({
  data,
  categoryKey,
  valueKey,
  unit,
  donut = false,
  centerLabel,
  centerCaption,
  height = 240,
}: PieDonutVizProps) {
  const items = data.map((d, i) => ({
    name: String(d[categoryKey]),
    value: Number(d[valueKey]),
    color: seriesVar(i),
  }));

  const dial = Math.min(height - 20, 168);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-4)", minHeight: height, overflow: "hidden" }}>
      <div style={{ position: "relative", flex: "0 0 auto", width: dial, height: dial }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<VizTooltip unit={unit} hideLabel />} />
            <Pie
              data={items}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={donut ? "62%" : 0}
              outerRadius="92%"
              paddingAngle={donut ? 2 : 0}
              stroke="var(--surface)"
              strokeWidth={2}
              isAnimationActive
              animationDuration={560}
            >
              {items.map((it) => (
                <Cell key={it.name} fill={it.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {donut && centerLabel && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span className="tnum" style={{ fontSize: 22, fontWeight: 680, color: "var(--ink)", letterSpacing: "-0.02em" }}>
              {centerLabel}
            </span>
            {centerCaption && <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{centerCaption}</span>}
          </div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it) => (
            <div key={it.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--body)", minWidth: 0 }}>
                <span aria-hidden style={{ width: 10, height: 10, borderRadius: 3, background: it.color, flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</span>
              </span>
              <span className="tnum" style={{ fontSize: 12.5, fontWeight: 650, color: "var(--ink)", flexShrink: 0 }}>
                {fmtByUnit(it.value, unit)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** VizLegend re-export kept for callers that want the horizontal form. */
export { VizLegend };
