"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { fmtPct, fmtUsd } from "@/lib/format";
import type { ScenarioBase } from "@/data/datasets";

export interface ScenarioVizProps {
  base: ScenarioBase;
  height?: number;
  /** label for the summed total row (default "Portfolio"). */
  totalLabel?: string;
  /** hide the summed total — e.g. a single-asset reprice where it duplicates the one row. */
  showTotal?: boolean;
}

const repricedValue = (noi: number, capRate: number) => noi / (capRate / 100);

/* Scenario widget — a live direct-cap reprice. Drag the cap-rate and
   occupancy shifts and every row's concluded value recomputes instantly
   (value = NOI ÷ cap rate; occupancy scales NOI). This is the one widget
   the user drives, not just reads. */
export function ScenarioViz({ base, height = 240, totalLabel = "Portfolio", showTotal = true }: ScenarioVizProps) {
  const [capBps, setCapBps] = useState(0); // basis points
  const [occPp, setOccPp] = useState(0); // percentage points

  const rows = base.rows.map((r) => {
    const baseline = repricedValue(r.noi, r.capRate);
    const newOcc = Math.max(1, Math.min(100, r.occupancy + occPp));
    const newNoi = r.noi * (newOcc / r.occupancy);
    const newCap = Math.max(0.5, r.capRate + capBps / 100);
    const repriced = repricedValue(newNoi, newCap);
    return { label: r.label, baseline, repriced, delta: (repriced - baseline) / baseline };
  });

  const baseTotal = rows.reduce((s, r) => s + r.baseline, 0);
  const newTotal = rows.reduce((s, r) => s + r.repriced, 0);
  const totalDelta = (newTotal - baseTotal) / baseTotal;
  const dirty = capBps !== 0 || occPp !== 0;

  const deltaColor = (d: number) => (Math.abs(d) < 0.0005 ? "var(--muted)" : d > 0 ? "var(--up)" : "var(--down)");

  return (
    <div style={{ minHeight: height, display: "flex", flexDirection: "column", gap: "var(--s-3)", paddingBottom: "var(--s-4)" }}>
      {/* controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {!showTotal && dirty && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                setCapBps(0);
                setOccPp(0);
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <RotateCcw size={12} strokeWidth={2} aria-hidden /> reset
            </button>
          </div>
        )}
        <SliderRow
          label="Cap-rate shift"
          value={`${capBps > 0 ? "+" : ""}${capBps} bps`}
          min={-150}
          max={150}
          step={5}
          v={capBps}
          onChange={setCapBps}
        />
        <SliderRow
          label="Occupancy shift"
          value={`${occPp > 0 ? "+" : ""}${occPp} pp`}
          min={-15}
          max={15}
          step={1}
          v={occPp}
          onChange={setOccPp}
        />
      </div>

      {/* repriced rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {rows.map((r) => (
          <div
            key={r.label}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "5px 0", borderBottom: "1px solid var(--hairline-2)" }}
          >
            <span style={{ fontSize: 12.5, color: "var(--body)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.label}
            </span>
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8, flexShrink: 0 }}>
              <span className="tnum" style={{ fontSize: 13, fontWeight: 650, color: "var(--ink)" }}>
                {fmtUsd(r.repriced)}
              </span>
              <span className="tnum" style={{ fontSize: 11.5, fontWeight: 600, color: deltaColor(r.delta), width: 52, textAlign: "right" }}>
                {r.delta > 0 ? "+" : ""}
                {fmtPct(r.delta * 100)}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* total */}
      {showTotal && (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{totalLabel}</span>
          {dirty && (
            <button
              onClick={() => {
                setCapBps(0);
                setOccPp(0);
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <RotateCcw size={12} strokeWidth={2} aria-hidden /> reset
            </button>
          )}
        </span>
        <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8 }}>
          <span className="tnum" style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>
            {fmtUsd(newTotal)}
          </span>
          <span className="tnum" style={{ fontSize: 12, fontWeight: 650, color: deltaColor(totalDelta), width: 52, textAlign: "right" }}>
            {totalDelta > 0 ? "+" : ""}
            {fmtPct(totalDelta * 100)}
          </span>
        </span>
      </div>
      )}
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  v,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  v: number;
  onChange: (n: number) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
        {label}
        <span className="tnum" style={{ color: "var(--primary)" }}>
          {value}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
        aria-label={label}
      />
    </label>
  );
}
