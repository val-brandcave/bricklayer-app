"use client";

import { motion } from "framer-motion";
import { Sparkles, User2 } from "lucide-react";
import { Pill } from "@/components/atoms/Pill";
import { ProvenanceLine } from "@/components/atoms/ProvenanceLine";
import { WIDGET_GLYPH } from "@/lib/widget-glyphs";
import { fadeUp } from "@/lib/motion";
import type { Report } from "@/types";

export type ReportLayout = "grid" | "list";

export interface ReportCardProps {
  report: Report;
  onOpen: (report: Report) => void;
  layout?: ReportLayout;
  inStagger?: boolean;
}

const ORIGIN_META: Record<Report["origin"], { label: string; tone: "primary" | "neutral" | "info" }> = {
  starter: { label: "Starter", tone: "neutral" },
  ai: { label: "AI", tone: "primary" },
  user: { label: "You", tone: "info" },
};

/* ReportCard — one saved report in the library. Grid layout = a vertical card;
   list layout = a compact full-width row. Clicking opens a live preview (we
   don't mount a chart per card — see the Phase-3 render-freeze note). */
export function ReportCard({ report, onOpen, layout = "grid", inStagger = false }: ReportCardProps) {
  const glyph = WIDGET_GLYPH[report.widgetType];
  const Glyph = glyph.icon;
  const origin = ORIGIN_META[report.origin];

  if (layout === "list") {
    return (
      <motion.button
        type="button"
        variants={fadeUp}
        initial={inStagger ? undefined : "hidden"}
        animate={inStagger ? undefined : "visible"}
        onClick={() => onOpen(report)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--s-4)",
          width: "100%",
          textAlign: "left",
          padding: "var(--s-3) var(--s-4)",
          background: "var(--surface)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--r-md)",
          cursor: "pointer",
          font: "inherit",
          minWidth: 0,
          transition: "border-color var(--dur), background var(--dur)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--surface-2)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--hairline)"; e.currentTarget.style.background = "var(--surface)"; }}
      >
        <span style={{ display: "grid", placeItems: "center", width: 36, height: 36, flexShrink: 0, borderRadius: "var(--r-sm)", background: "var(--primary-soft)", color: "var(--primary)" }}>
          <Glyph size={18} strokeWidth={2} aria-hidden />
        </span>
        <span style={{ minWidth: 0, flex: "1 1 40%" }}>
          <span style={{ display: "block", fontSize: 14.5, fontWeight: 640, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{report.title}</span>
          <span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{glyph.label}</span>
        </span>
        <span style={{ flex: "0 1 auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--muted)", whiteSpace: "nowrap" }}>
          <User2 size={13} strokeWidth={2} aria-hidden />
          {report.ownerName}
        </span>
        <span style={{ flexShrink: 0, width: 74, display: "flex", justifyContent: "flex-end" }}>
          <Pill tone={origin.tone} size="sm">
            {report.origin === "ai" && <Sparkles size={11} strokeWidth={2.5} style={{ marginRight: 1 }} aria-hidden />}
            {origin.label}
          </Pill>
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      variants={fadeUp}
      initial={inStagger ? undefined : "hidden"}
      animate={inStagger ? undefined : "visible"}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      onClick={() => onOpen(report)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--s-3)",
        textAlign: "left",
        padding: "var(--s-5)",
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--r-lg)",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        font: "inherit",
        minWidth: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: "var(--r-md)",
            background: "var(--primary-soft)",
            color: "var(--primary)",
          }}
        >
          <Glyph size={20} strokeWidth={2} aria-hidden />
        </span>
        <Pill tone={origin.tone} size="sm">
          {report.origin === "ai" && <Sparkles size={11} strokeWidth={2.5} style={{ marginRight: 1 }} aria-hidden />}
          {origin.label}
        </Pill>
      </div>

      <div style={{ minWidth: 0 }}>
        <h3 style={{ fontSize: 15.5, fontWeight: 650, margin: 0, lineHeight: 1.3, color: "var(--ink)" }}>{report.title}</h3>
        <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "4px 0 0" }}>
          {glyph.label}
          {report.subtitle ? ` · ${report.subtitle}` : ""}
        </p>
      </div>

      {report.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {report.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "var(--muted)",
                background: "var(--surface-2)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--r-pill)",
                padding: "2px 9px",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: "auto", paddingTop: "var(--s-2)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
          <User2 size={13} strokeWidth={2} aria-hidden />
          {report.ownerName}
        </span>
      </div>

      <ProvenanceLine provenance={report.provenance} />
    </motion.button>
  );
}
