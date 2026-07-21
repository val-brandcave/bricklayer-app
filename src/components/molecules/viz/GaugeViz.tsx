"use client";

import { motion, useReducedMotion } from "framer-motion";
import { KpiValue } from "@/components/atoms/KpiValue";
import { DUR, EASE } from "@/lib/motion";
import { seriesVar } from "./chrome";

export interface GaugeVizProps {
  value: number;
  max: number;
  /** suffix for the center readout (e.g. "%"). */
  suffix?: string;
  decimals?: number;
  caption?: string;
  colorIndex?: number;
  height?: number;
}

/* Radial gauge — a single bounded metric (extraction confidence, avg cap
   rate) as a semicircular arc that sweeps to its value on mount. The center
   readout reuses KpiValue so it counts up and stays tabular-num. */
export function GaugeViz({ value, max, suffix = "", decimals = 1, caption, colorIndex = 0, height = 240 }: GaugeVizProps) {
  const reduce = useReducedMotion();
  const frac = Math.max(0, Math.min(1, value / max));

  const cx = 110;
  const cy = 116;
  const r = 90;
  const arcLen = Math.PI * r;
  const trackPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  // Scale the arc to fit the available height (fill-mode tiles vary): keep the
  // 220:132 viewBox ratio, shed the caption when the tile is short, and scale
  // the center readout with the dial so nothing overflows or collides.
  const showCaption = !!caption && height >= 190;
  const reserved = 22 + (showCaption ? 22 : 0);
  const arcH = Math.max(64, Math.min(132, height - reserved));
  const arcW = Math.round(arcH * (220 / 132));
  const readout = Math.max(20, Math.round((arcW / 220) * 34));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height, gap: 2, overflow: "hidden" }}>
      <div style={{ position: "relative", width: arcW, height: arcH }}>
        <svg viewBox="0 0 220 132" width={arcW} height={arcH} aria-hidden>
          <path d={trackPath} fill="none" stroke="var(--surface-3)" strokeWidth={14} strokeLinecap="round" />
          <motion.path
            d={trackPath}
            fill="none"
            stroke={seriesVar(colorIndex)}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={arcLen}
            initial={{ strokeDashoffset: reduce ? arcLen * (1 - frac) : arcLen }}
            animate={{ strokeDashoffset: arcLen * (1 - frac) }}
            transition={{ duration: DUR.slow + 0.2, ease: EASE.out }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 8,
            pointerEvents: "none",
          }}
        >
          <KpiValue value={value} suffix={suffix} decimals={decimals} size={readout} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: arcW, padding: "0 6px" }}>
        <span className="tnum" style={{ fontSize: 11, color: "var(--muted)" }}>
          0
        </span>
        <span className="tnum" style={{ fontSize: 11, color: "var(--muted)" }}>
          {max}
          {suffix}
        </span>
      </div>
      {showCaption && <span style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>{caption}</span>}
    </div>
  );
}
