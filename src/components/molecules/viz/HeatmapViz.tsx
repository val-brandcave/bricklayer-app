"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { fmtCount, fmtR } from "@/lib/format";

export interface HeatmapVizProps {
  rows: string[];
  cols: string[];
  values: number[][]; // values[rowIndex][colIndex]
  /** "count" = sequential (magnitude); "corr" = diverging around 0. */
  kind?: "count" | "corr";
  height?: number;
}

/* Heatmap — a matrix of categories (staleness class × age band) or a
   correlation grid. Sequential cells scale one hue by magnitude; the
   correlation variant diverges (teal +, rose −) around zero. Colors blend
   from series tokens via color-mix so both themes stay on-palette. */
export function HeatmapViz({ rows, cols, values, kind = "count", height = 240 }: HeatmapVizProps) {
  const flat = values.flat();
  const maxAbs = Math.max(...flat.map((v) => Math.abs(v)), 0.0001);

  function cellStyle(v: number): { bg: string; fg: string } {
    if (kind === "corr") {
      const intensity = Math.min(1, Math.abs(v) / 1); // r is already -1..1
      const base = v >= 0 ? "var(--c6)" : "var(--c5)";
      const pct = Math.round(intensity * 100);
      return {
        bg: `color-mix(in srgb, ${base} ${pct}%, var(--surface))`,
        fg: intensity > 0.55 ? "#fff" : "var(--body)",
      };
    }
    const intensity = Math.min(1, v / maxAbs);
    const pct = Math.round(12 + intensity * 78);
    return {
      bg: `color-mix(in srgb, var(--c1) ${pct}%, var(--surface))`,
      fg: intensity > 0.5 ? "#fff" : "var(--body)",
    };
  }

  const fmtCell = (v: number) => (kind === "corr" ? fmtR(v) : fmtCount(v));

  return (
    <div style={{ maxHeight: height, overflowY: "auto", overflowX: "auto", paddingBottom: 4 }}>
      <div style={{ minWidth: 320, minHeight: height - 8 }}>
        {/* header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `minmax(88px, 1.2fr) repeat(${cols.length}, 1fr)`,
            gap: 4,
            marginBottom: 4,
          }}
        >
          <span />
          {cols.map((c) => (
            <span
              key={c}
              style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textAlign: "center", lineHeight: 1.2 }}
            >
              {c}
            </span>
          ))}
        </div>
        {/* data rows */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {rows.map((rowLabel, ri) => (
            <div
              key={rowLabel}
              style={{
                display: "grid",
                gridTemplateColumns: `minmax(88px, 1.2fr) repeat(${cols.length}, 1fr)`,
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "var(--body)",
                  fontWeight: 550,
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {rowLabel}
              </span>
              {cols.map((_, ci) => {
                const v = values[ri][ci];
                const { bg, fg } = cellStyle(v);
                return (
                  <motion.div
                    key={ci}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (ri * cols.length + ci) * 0.012, duration: 0.28 }}
                    title={`${rowLabel} · ${cols[ci]}: ${fmtCell(v)}`}
                    style={{
                      background: bg,
                      color: fg,
                      borderRadius: "var(--r-sm)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 30,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                    className="tnum"
                  >
                    {fmtCell(v)}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
