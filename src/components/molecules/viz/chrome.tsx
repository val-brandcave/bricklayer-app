"use client";

/* ============================================================
   Shared viz chrome — the bits every Recharts widget needs so they
   read as one system: the c1..c8 series colors (as CSS vars, resolved
   at paint so both themes work), a token-styled tooltip, and common
   axis props. Never hard-code a hex here — colors come from tokens.
   ============================================================ */

import type { Unit } from "@/lib/format";
import { fmtByUnit } from "@/lib/format";

/** The data-viz series, referenced as CSS vars so light/dark both work. */
export const SERIES_VARS = [
  "var(--c1)",
  "var(--c2)",
  "var(--c3)",
  "var(--c4)",
  "var(--c5)",
  "var(--c6)",
  "var(--c7)",
  "var(--c8)",
] as const;

/** Series color by index (wraps at 8). */
export function seriesVar(i: number): string {
  return SERIES_VARS[((i % 8) + 8) % 8];
}

export const GRID_STROKE = "var(--grid)";
export const AXIS_STROKE = "var(--hairline-2)";

/** Common <XAxis>/<YAxis> tick styling — muted, small, Geist (inherits). */
export const axisTick = { fill: "var(--muted)", fontSize: 11 } as const;

export const commonAxisProps = {
  stroke: AXIS_STROKE,
  tick: axisTick,
  tickLine: false,
  axisLine: { stroke: AXIS_STROKE },
} as const;

/* ---------- themed tooltip ---------- */

interface TipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
}

export interface VizTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: TipEntry[];
  /** how to format each numeric value */
  unit?: Unit;
  /** override the label line (e.g. hide it for single-category charts) */
  hideLabel?: boolean;
  /** custom label resolver (e.g. scatter shows the class) */
  labelFormatter?: (label: string | number, payload?: TipEntry[]) => React.ReactNode;
}

/* A single tooltip surface used by every chart widget. Passed to Recharts
   as <Tooltip content={<VizTooltip unit="usd" />} /> — Recharts injects
   active/label/payload and merges them with our props. */
export function VizTooltip({ active, label, payload, unit, hideLabel, labelFormatter }: VizTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--r-md)",
        boxShadow: "var(--shadow-md)",
        padding: "8px 10px",
        minWidth: 120,
        fontSize: 12.5,
        lineHeight: 1.45,
      }}
    >
      {!hideLabel && (
        <div style={{ color: "var(--muted)", fontWeight: 600, marginBottom: 6 }}>
          {labelFormatter ? labelFormatter(label ?? "", payload) : label}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {payload.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--body)" }}>
              <span
                aria-hidden
                style={{ width: 9, height: 9, borderRadius: 2, background: e.color ?? "var(--c1)", flexShrink: 0 }}
              />
              {e.name}
            </span>
            <span className="tnum" style={{ fontWeight: 650, color: "var(--ink)" }}>
              {typeof e.value === "number" ? fmtByUnit(e.value, unit) : e.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* A compact legend row (some Recharts widgets use it; kept token-driven). */
export function VizLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 16px", padding: "2px 0 6px" }}>
      {items.map((it) => (
        <span key={it.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--body)" }}>
          <span aria-hidden style={{ width: 10, height: 10, borderRadius: 3, background: it.color, flexShrink: 0 }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
