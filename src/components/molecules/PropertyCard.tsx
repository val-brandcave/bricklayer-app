"use client";

import { motion } from "framer-motion";
import { Droplets, MapPin } from "lucide-react";
import { Pill } from "@/components/atoms/Pill";
import { staggerItem, fadeUp } from "@/lib/motion";
import { fmtPct, fmtUsd, fmtUsdSf } from "@/lib/format";
import { CLASS_LABEL, FLOOD_LABEL, STATUS_META, isFloodHazard, riskColor } from "@/lib/property-meta";
import type { PropertyRow } from "@/hooks/useProperties";

export interface PropertyCardProps {
  row: PropertyRow;
  onSelect: (id: string) => void;
  inStagger?: boolean;
}

/* PropertyCard — the visual alt to the table row: a scannable asset card with a
   risk-tinted header rule, headline stats, and a valuation-status footer.
   Clicking drills into the property workspace. */
export function PropertyCard({ row, onSelect, inStagger = false }: PropertyCardProps) {
  const { property: p, watch } = row;
  const status = STATUS_META[p.valuationStatus];

  return (
    <motion.button
      type="button"
      variants={inStagger ? staggerItem : fadeUp}
      initial={inStagger ? undefined : "hidden"}
      animate={inStagger ? undefined : "visible"}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      onClick={() => onSelect(p.id)}
      style={{
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        gap: "var(--s-4)",
        padding: 0,
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--r-lg)",
        boxShadow: "var(--shadow-sm)",
        cursor: "pointer",
        overflow: "hidden",
        font: "inherit",
        minWidth: 0,
      }}
    >
      <span aria-hidden style={{ height: 3, background: riskColor(p.riskScore), opacity: p.riskScore >= 50 ? 1 : 0.4 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)", padding: "var(--s-4) var(--s-5) var(--s-5)" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 650, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
              <MapPin size={12} strokeWidth={2} aria-hidden />
              {p.city}, {p.state}
            </div>
          </div>
          <span
            className="tnum"
            style={{
              flexShrink: 0,
              display: "inline-flex",
              justifyContent: "center",
              minWidth: 36,
              padding: "3px 9px",
              borderRadius: "var(--r-sm)",
              fontSize: 13,
              fontWeight: 700,
              background: `color-mix(in srgb, ${riskColor(p.riskScore)} 14%, transparent)`,
              color: riskColor(p.riskScore),
            }}
            title="Risk score (0–100)"
          >
            {p.riskScore}
          </span>
        </div>

        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)" }}>
          <Stat label="Book value" value={fmtUsd(p.bookValue)} />
          <Stat label="Cap rate" value={fmtPct(p.capRate)} />
          <Stat label="Price / SF" value={fmtUsdSf(p.pricePerSF)} />
        </div>

        {/* footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: "var(--s-3)", borderTop: "1px solid var(--hairline-2)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <Pill tone="neutral" size="sm">{CLASS_LABEL[p.assetClass]}</Pill>
            {watch && <Pill tone={status.tone === "danger" ? "danger" : "warning"} size="sm">Watchlist</Pill>}
            {isFloodHazard(p.floodZone) && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11.5, fontWeight: 600, color: "var(--info)" }} title={FLOOD_LABEL[p.floodZone]}>
                <Droplets size={11} strokeWidth={2.2} aria-hidden />
                {p.floodZone}
              </span>
            )}
          </span>
          <Pill tone={status.tone} size="sm" dot>{status.label}</Pill>
        </div>
      </div>
    </motion.button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 3 }}>{label}</div>
      <div className="tnum" style={{ fontSize: 14, fontWeight: 650, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
    </div>
  );
}
