"use client";

import { motion } from "framer-motion";
import { FindingCardHeader } from "./FindingCardHeader";
import { fadeUp } from "@/lib/motion";
import type { Insight } from "@/types";

export interface FindingCardProps {
  insight: Insight;
  selected: boolean;
  onSelect: (id: string) => void;
  inStagger?: boolean;
}

/* FindingCard — one finding in the Insights list rail. Header (kind glyph +
   severity + surprising-link) over a truncated claim. Selecting it drives the
   focus panel; the selected card carries a primary left-accent. */
export function FindingCard({ insight, selected, onSelect, inStagger = false }: FindingCardProps) {
  // Discovered ("surprising link") cards carry a faint violet resting border so
  // the exploratory tier reads as distinct from the vetted findings above it.
  const discovered = insight.origin === "discovered";
  const restBorder = discovered ? "color-mix(in srgb, var(--primary) 22%, var(--hairline))" : "var(--hairline)";
  return (
    <motion.button
      type="button"
      variants={fadeUp}
      initial={inStagger ? undefined : "hidden"}
      animate={inStagger ? undefined : "visible"}
      onClick={() => onSelect(insight.id)}
      aria-pressed={selected}
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "var(--s-4)",
        paddingLeft: "calc(var(--s-4) + 3px)",
        borderRadius: "var(--r-lg)",
        border: `1px solid ${selected ? "var(--primary)" : restBorder}`,
        background: selected ? "var(--primary-soft)" : "var(--surface)",
        boxShadow: selected ? "none" : "var(--shadow-sm)",
        cursor: "pointer",
        font: "inherit",
        transition: "border-color var(--dur), background var(--dur)",
      }}
      onMouseEnter={(e) => !selected && (e.currentTarget.style.borderColor = "var(--border-strong)")}
      onMouseLeave={(e) => !selected && (e.currentTarget.style.borderColor = restBorder)}
    >
      {selected && (
        <motion.span
          layoutId="finding-accent"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 3, borderRadius: "var(--r-pill)", background: "var(--primary)" }}
        />
      )}
      <FindingCardHeader title={insight.title} kind={insight.kind} severity={insight.severity} origin={insight.origin} />
      <p style={{ fontSize: 13, color: "var(--muted)", margin: "10px 0 0 46px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {insight.claim}
      </p>
    </motion.button>
  );
}
