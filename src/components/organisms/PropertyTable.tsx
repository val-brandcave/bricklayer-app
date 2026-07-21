"use client";

import { motion } from "framer-motion";
import { ChevronDown, Droplets } from "lucide-react";
import { Pill } from "@/components/atoms/Pill";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { fmtPct, fmtUsd, fmtUsdSf } from "@/lib/format";
import { CLASS_LABEL, FLOOD_LABEL, STATUS_META, isFloodHazard, riskColor, riskTone } from "@/lib/property-meta";
import type { PropertyRow, PropertySort } from "@/hooks/useProperties";

export interface PropertyTableProps {
  rows: PropertyRow[];
  sort: PropertySort;
  onSort: (s: PropertySort) => void;
  onSelect: (id: string) => void;
}

interface Col {
  key: string;
  label: string;
  sort?: PropertySort;
  numeric?: boolean;
  width?: string;
}

const COLS: Col[] = [
  { key: "name", label: "Property", sort: "name" },
  { key: "class", label: "Class", width: "1%" },
  { key: "value", label: "Book value", sort: "value", numeric: true, width: "1%" },
  { key: "cap", label: "Cap rate", sort: "cap", numeric: true, width: "1%" },
  { key: "psf", label: "Price / SF", numeric: true, width: "1%" },
  { key: "risk", label: "Risk", sort: "risk", numeric: true, width: "1%" },
  { key: "valuation", label: "Valuation", sort: "stale", width: "1%" },
];

/* PropertyTable — the dense, sortable book browser (default Properties view).
   Rows are risk-tinted on the left edge; numeric columns use tabular figures.
   Clicking a row drills into the property workspace. */
export function PropertyTable({ rows, sort, onSort, onSelect }: PropertyTableProps) {
  return (
    <div style={{ border: "1px solid var(--hairline)", borderRadius: "var(--r-lg)", overflow: "hidden", background: "var(--surface)" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--hairline)" }}>
              {COLS.map((c) => {
                const active = c.sort && sort === c.sort;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    style={{
                      textAlign: c.numeric ? "right" : "left",
                      padding: "11px 16px",
                      fontSize: 11.5,
                      fontWeight: 650,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: active ? "var(--primary)" : "var(--muted)",
                      whiteSpace: "nowrap",
                      width: c.width,
                      userSelect: "none",
                      cursor: c.sort ? "pointer" : "default",
                    }}
                    onClick={() => c.sort && onSort(c.sort)}
                    aria-sort={active ? "descending" : undefined}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, flexDirection: c.numeric ? "row-reverse" : "row" }}>
                      {c.label}
                      {c.sort && (
                        <ChevronDown
                          size={13}
                          strokeWidth={2.4}
                          style={{ opacity: active ? 1 : 0, transition: "opacity var(--dur)" }}
                          aria-hidden
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
            {rows.map(({ property: p, watch }) => {
              const status = STATUS_META[p.valuationStatus];
              return (
                <motion.tr
                  key={p.id}
                  variants={staggerItem}
                  onClick={() => onSelect(p.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(p.id);
                    }
                  }}
                  style={{ borderBottom: "1px solid var(--hairline-2)", cursor: "pointer", outline: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onFocus={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                  onBlur={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* property */}
                  <td style={{ padding: "12px 16px", position: "relative" }}>
                    <span aria-hidden style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: 2, background: riskColor(p.riskScore), opacity: p.riskScore >= 50 ? 1 : 0.35 }} />
                    <div style={{ fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: 7 }}>
                      {p.name}
                      {watch && <Pill tone={status.tone === "danger" ? "danger" : "warning"} size="sm">Watchlist</Pill>}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                      {p.city}, {p.state}
                      {isFloodHazard(p.floodZone) && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "var(--info)" }} title={`Flood ${FLOOD_LABEL[p.floodZone]}`}>
                          <Droplets size={11} strokeWidth={2.2} aria-hidden />
                          {p.floodZone}
                        </span>
                      )}
                    </div>
                  </td>
                  {/* class */}
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap", color: "var(--body)" }}>{CLASS_LABEL[p.assetClass]}</td>
                  {/* book value */}
                  <td className="tnum" style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap" }}>{fmtUsd(p.bookValue)}</td>
                  {/* cap rate */}
                  <td className="tnum" style={{ padding: "12px 16px", textAlign: "right", color: "var(--body)", whiteSpace: "nowrap" }}>{fmtPct(p.capRate)}</td>
                  {/* price/sf */}
                  <td className="tnum" style={{ padding: "12px 16px", textAlign: "right", color: "var(--body)", whiteSpace: "nowrap" }}>{fmtUsdSf(p.pricePerSF)}</td>
                  {/* risk */}
                  <td style={{ padding: "12px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <span
                      className="tnum"
                      style={{
                        display: "inline-flex",
                        justifyContent: "center",
                        minWidth: 34,
                        padding: "2px 8px",
                        borderRadius: "var(--r-sm)",
                        fontSize: 12.5,
                        fontWeight: 700,
                        background: `color-mix(in srgb, ${riskColor(p.riskScore)} 14%, transparent)`,
                        color: riskColor(p.riskScore),
                      }}
                    >
                      {p.riskScore}
                    </span>
                  </td>
                  {/* valuation */}
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Pill tone={status.tone} size="sm" dot>{status.label}</Pill>
                      <span className="tnum" style={{ fontSize: 12, color: "var(--muted)" }}>{p.monthsSinceValuation}mo</span>
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
