"use client";

import { motion } from "framer-motion";
import { Pill, severityTone } from "@/components/atoms/Pill";
import { staggerContainer, staggerItem } from "@/lib/motion";
import type { WatchlistItem } from "@/types";

export interface WatchlistVizProps {
  items: WatchlistItem[];
  height?: number;
}

/* Watchlist widget — the scored 0–100 risk list with the WHY. Each row ranks
   a property, shows its score as a severity-toned badge, and surfaces the
   reasons as chips (the "claim → evidence" the product is built on). */
export function WatchlistViz({ items, height = 240 }: WatchlistVizProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ height, overflow: "auto", marginBottom: "var(--s-3)", display: "flex", flexDirection: "column", gap: 6 }}
    >
      {items.map((it, i) => (
        <motion.div
          key={it.id}
          variants={staggerItem}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--s-3)",
            padding: "8px 10px",
            borderRadius: "var(--r-md)",
            border: "1px solid var(--hairline-2)",
            background: "var(--surface-2)",
          }}
        >
          <span className="tnum" style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", width: 18, flexShrink: 0 }}>
            {i + 1}
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {it.propertyName}
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 4 }}>{it.location}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {it.reasons.slice(0, 3).map((r) => (
                <span
                  key={r}
                  style={{
                    fontSize: 10.5,
                    color: "var(--body)",
                    background: "var(--surface-3)",
                    borderRadius: "var(--r-pill)",
                    padding: "1px 7px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Pill tone={severityTone[it.severity]} size="sm">
              <span className="tnum" style={{ fontWeight: 700 }}>
                {it.score}
              </span>
            </Pill>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
