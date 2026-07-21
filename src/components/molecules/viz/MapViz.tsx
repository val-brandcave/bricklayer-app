"use client";

import { motion } from "framer-motion";
import { fmtUsd } from "@/lib/format";

export interface MapPoint {
  name: string;
  lat: number;
  lng: number;
  value: number;
  score: number; // 0-100 risk
  assetClass: string;
}

export interface MapVizProps {
  points: MapPoint[];
  height?: number;
}

/* Continental-US bounding box (lng/lat) for a lightweight equirectangular
   projection. Not a tile map (no external requests, per CLAUDE.md) — an
   on-palette bubble distribution: position ≈ geography, size ≈ book value,
   color ≈ risk. Reads as "where the book sits" without a mapping dep. */
const US = { lngMin: -125, lngMax: -66.5, latMin: 24.5, latMax: 49.5 };
const VIEW_W = 100;
const VIEW_H = (VIEW_W * (US.latMax - US.latMin)) / (US.lngMax - US.lngMin) / Math.cos((37 * Math.PI) / 180);

function project(lng: number, lat: number) {
  const x = ((lng - US.lngMin) / (US.lngMax - US.lngMin)) * VIEW_W;
  const y = ((US.latMax - lat) / (US.latMax - US.latMin)) * VIEW_H;
  return { x, y };
}

function riskColor(score: number): string {
  if (score >= 80) return "var(--c5)"; // high — rose
  if (score >= 60) return "var(--c4)"; // watch — amber
  return "var(--c6)"; // ok — teal
}

export function MapViz({ points, height = 240 }: MapVizProps) {
  const maxVal = Math.max(...points.map((p) => p.value), 1);
  const r = (v: number) => 1.1 + Math.sqrt(v / maxVal) * 3.2;

  return (
    <div style={{ height, display: "flex", flexDirection: "column", gap: 6, paddingBottom: "var(--s-4)" }}>
      <div
        style={{
          position: "relative",
          flex: 1,
          borderRadius: "var(--r-md)",
          background: "var(--surface-2)",
          border: "1px solid var(--hairline-2)",
          overflow: "hidden",
        }}
      >
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
          {/* faint graticule so the field reads as a map, not a scatter */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={`v${f}`} x1={VIEW_W * f} y1={0} x2={VIEW_W * f} y2={VIEW_H} stroke="var(--grid)" strokeWidth={0.15} />
          ))}
          {[0.33, 0.66].map((f) => (
            <line key={`h${f}`} x1={0} y1={VIEW_H * f} x2={VIEW_W} y2={VIEW_H * f} stroke="var(--grid)" strokeWidth={0.15} />
          ))}
          {points.map((p, i) => {
            const { x, y } = project(p.lng, p.lat);
            const color = riskColor(p.score);
            return (
              <motion.circle
                key={p.name}
                cx={x}
                cy={y}
                fill={color}
                fillOpacity={0.55}
                stroke={color}
                strokeWidth={0.4}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: r(p.value), opacity: 1 }}
                transition={{ delay: i * 0.02, type: "spring", stiffness: 260, damping: 22 }}
              >
                <title>{`${p.name} · ${fmtUsd(p.value)} · risk ${p.score}`}</title>
              </motion.circle>
            );
          })}
        </svg>
      </div>
      {/* risk legend */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[
          { label: "High (80+)", c: "var(--c5)" },
          { label: "Watch (60–79)", c: "var(--c4)" },
          { label: "OK (<60)", c: "var(--c6)" },
        ].map((l) => (
          <span key={l.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)" }}>
            <span aria-hidden style={{ width: 9, height: 9, borderRadius: "50%", background: l.c, flexShrink: 0 }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
