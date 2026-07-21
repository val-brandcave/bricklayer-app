"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Building2, CalendarClock, Droplets, MapPin, TriangleAlert } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { Pill } from "@/components/atoms/Pill";
import { ProvenanceLine } from "@/components/atoms/ProvenanceLine";
import { StatTile } from "@/components/molecules/StatTile";
import { ChartFrame } from "@/components/molecules/ChartFrame";
import { PAGE_GUTTER } from "@/components/molecules/PageHeader";
import { PieDonutViz, ScenarioViz } from "@/components/molecules/viz";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { fmtCount, fmtPct, fmtUsd } from "@/lib/format";
import { CLASS_LABEL, FLOOD_LABEL, STATUS_META, isFloodHazard, riskColor } from "@/lib/property-meta";
import type { PropertyRow } from "@/hooks/useProperties";
import type { ScenarioBase } from "@/data/datasets";

export interface PropertyDetailProps {
  row: PropertyRow;
  onBack: () => void;
  onAskAbout: (context: string) => void;
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* PropertyDetail — the full-width property workspace reached by drilling into a
   row. Header identity + a KPI row, then the latest-appraisal detail (with
   provenance) alongside the per-property valuation widgets, and the watchlist
   rationale when the asset is flagged. Every number points back to its source. */
export function PropertyDetail({ row, onBack, onAskAbout }: PropertyDetailProps) {
  const { property: p, appraisal: a, watch } = row;
  const status = STATUS_META[p.valuationStatus];

  // approach mix from the latest appraisal's weighting (per-property, not book-wide)
  const approachData = a
    ? [
        { approach: "Income", share: a.approachWeights.income },
        { approach: "Sales comp", share: a.approachWeights.sales },
        { approach: "Cost", share: a.approachWeights.cost },
      ]
    : [];
  const primary = approachData.slice().sort((x, y) => y.share - x.share)[0];

  // single-asset reprice seeded from this property's own economics
  const scenarioBase: ScenarioBase = {
    noi: p.noi,
    capRate: p.capRate,
    occupancy: p.occupancy,
    rows: [{ label: p.name, noi: p.noi, capRate: p.capRate, occupancy: p.occupancy }],
  };

  const prov = a
    ? { label: `${a.firm}`, sourceRef: `${a.reportNumber} · ${a.pageRef}`, asOf: a.effectiveDate }
    : { label: "No appraisal on file" };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ padding: `var(--s-4) ${PAGE_GUTTER} var(--s-12)` }}>
      {/* back */}
      <motion.div variants={staggerItem}>
        <button
          type="button"
          onClick={onBack}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 10px 6px 6px", margin: "0 0 var(--s-4) -6px", borderRadius: "var(--r-md)", border: "none", background: "transparent", color: "var(--muted)", font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "color var(--dur), background var(--dur)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ink)"; e.currentTarget.style.background = "var(--surface-3)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; }}
        >
          <ArrowLeft size={16} strokeWidth={2.2} /> All properties
        </button>
      </motion.div>

      {/* header */}
      <motion.header variants={staggerItem} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--s-5)", flexWrap: "wrap", marginBottom: "var(--s-6)" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 27, fontWeight: 720, lineHeight: 1.1, margin: 0 }}>{p.name}</h1>
            <Pill tone="neutral" size="md">{CLASS_LABEL[p.assetClass]}</Pill>
            <Pill tone={status.tone} size="md" dot>{status.label} · {p.monthsSinceValuation}mo</Pill>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 10, fontSize: 13.5, color: "var(--muted)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><MapPin size={14} strokeWidth={2} aria-hidden />{p.address}, {p.city}, {p.state}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Building2 size={14} strokeWidth={2} aria-hidden />Built {p.yearBuilt} · {fmtCount(p.sfArea)} SF · {p.zoning}</span>
            {isFloodHazard(p.floodZone) && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--info)", fontWeight: 600 }}><Droplets size={14} strokeWidth={2.2} aria-hidden />FEMA {FLOOD_LABEL[p.floodZone]}</span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--s-4)", flexShrink: 0 }}>
          {/* risk dial */}
          <div style={{ textAlign: "center" }}>
            <div className="tnum" style={{ fontSize: 34, fontWeight: 760, lineHeight: 1, color: riskColor(p.riskScore) }}>{p.riskScore}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>Risk score</div>
          </div>
          <Button variant="gradient" size="md" onClick={() => onAskAbout(`${p.name} — ${p.city}, ${p.state}`)}>
            <EmblemMark size={16} tone="current" />
            Ask about this property
          </Button>
        </div>
      </motion.header>

      {/* KPI row */}
      <motion.div variants={staggerItem} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "var(--s-4)", marginBottom: "var(--s-6)" }}>
        <StatTile inStagger label="Book value" value={p.bookValue / 1_000_000} prefix="$" suffix="M" decimals={1} />
        <StatTile inStagger label="Cap rate" value={p.capRate} suffix="%" decimals={1} />
        <StatTile inStagger label="NOI" value={p.noi / 1_000_000} prefix="$" suffix="M" decimals={2} />
        <StatTile inStagger label="Occupancy" value={p.occupancy} suffix="%" decimals={0} />
        <StatTile inStagger label="Price / SF" value={p.pricePerSF} prefix="$" decimals={0} />
      </motion.div>

      {/* detail grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)", gap: "var(--s-5)", alignItems: "start" }}>
        {/* left column: appraisal + watchlist */}
        <motion.div variants={staggerItem} style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)", minWidth: 0 }}>
          <AppraisalCard row={row} prov={prov} />
          {watch && <WatchlistCard reasons={watch.reasons} score={watch.score} />}
        </motion.div>

        {/* right column: per-property widgets */}
        <motion.div variants={staggerItem} style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)", minWidth: 0 }}>
          {a && (
            <ChartFrame title="Valuation approach mix" subtitle="Weighting in the latest appraisal" bodyHeight={210} provenance={{ label: `${a.reportNumber}`, sourceRef: a.pageRef }}>
              <PieDonutViz
                data={approachData}
                categoryKey="approach"
                valueKey="share"
                unit="pct"
                donut
                centerLabel={primary ? `${primary.share}%` : undefined}
                centerCaption={primary ? primary.approach.toLowerCase() : undefined}
                height={210}
              />
            </ChartFrame>
          )}
          <ChartFrame title="Direct-cap reprice" subtitle="Stress cap rate & occupancy — value recomputes live" bodyHeight={230} provenance={{ label: "Editable — value = NOI ÷ cap rate" }}>
            <ScenarioViz base={scenarioBase} height={230} showTotal={false} />
          </ChartFrame>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* The latest-appraisal detail — the evidence behind the concluded value. */
function AppraisalCard({ row, prov }: { row: PropertyRow; prov: { label: string; sourceRef?: string; asOf?: number } }) {
  const { appraisal: a } = row;
  if (!a) {
    return (
      <div style={{ padding: "var(--s-5)", border: "1px dashed var(--border-strong)", borderRadius: "var(--r-lg)", background: "var(--surface-2)", color: "var(--muted)", fontSize: 14 }}>
        No appraisal on file for this property.
      </div>
    );
  }

  const covHigh = a.compCoV >= 12;
  const confLow = a.extractionConfidence < 85;

  return (
    <motion.section variants={fadeUp} style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--s-3)", padding: "var(--s-5) var(--s-5) var(--s-4)", borderBottom: "1px solid var(--hairline-2)" }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 680, margin: 0 }}>Latest appraisal</h3>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <CalendarClock size={13} strokeWidth={2} aria-hidden /> Effective {fmtDate(a.effectiveDate)}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="tnum" style={{ fontSize: 22, fontWeight: 720, color: "var(--ink)" }}>{fmtUsd(a.value)}</div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>Concluded value</div>
        </div>
      </header>

      <div style={{ padding: "var(--s-5)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--s-4) var(--s-5)" }}>
        <Field label="Appraiser" value={a.appraiser} sub={a.appraiserLicense} />
        <Field label="Firm" value={a.firm} />
        <Field label="Primary approach" value={a.approach === "sales-comparison" ? "Sales comparison" : a.approach === "income" ? "Income" : "Cost"} />
        <Field label="Cap rate" value={fmtPct(a.capRate)} />
        <Field label="NOI" value={fmtUsd(a.noi)} />
        <Field label="Comps used" value={fmtCount(a.compCount)} />
        <Field label="Comp CoV" value={fmtPct(a.compCoV)} tone={covHigh ? "danger" : undefined} note={covHigh ? "wide spread" : undefined} />
        <Field label="Extraction confidence" value={fmtPct(a.extractionConfidence)} tone={confLow ? "warning" : "success"} />
      </div>

      <footer style={{ padding: "var(--s-3) var(--s-5)", borderTop: "1px solid var(--hairline-2)", background: "var(--surface-2)" }}>
        <ProvenanceLine provenance={prov} />
      </footer>
    </motion.section>
  );
}

function Field({ label, value, sub, tone, note }: { label: string; value: string; sub?: string; tone?: "danger" | "warning" | "success"; note?: string }) {
  const color = tone === "danger" ? "var(--danger)" : tone === "warning" ? "var(--warning)" : tone === "success" ? "var(--success)" : "var(--ink)";
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 5 }}>{label}</div>
      <div className="tnum" style={{ fontSize: 14.5, fontWeight: 600, color, display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
        {note && <span style={{ fontSize: 11, fontWeight: 600, color }}>{note}</span>}
      </div>
      {sub && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

/* Why this asset is on the watchlist — the WHY column, spelled out. */
function WatchlistCard({ reasons, score }: { reasons: string[]; score: number }) {
  return (
    <motion.section
      variants={fadeUp}
      style={{ background: "var(--danger-soft)", border: "1px solid color-mix(in srgb, var(--danger) 22%, transparent)", borderRadius: "var(--r-lg)", padding: "var(--s-5)" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--s-4)" }}>
        <span style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: "var(--r-md)", background: "var(--danger)", color: "#fff", flexShrink: 0 }}>
          <TriangleAlert size={16} strokeWidth={2.2} />
        </span>
        <h3 style={{ fontSize: 15, fontWeight: 680, margin: 0, color: "var(--danger)" }}>On the risk watchlist</h3>
        <span className="tnum" style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "var(--danger)" }}>score {score}</span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {reasons.map((r) => (
          <li key={r} style={{ display: "flex", gap: 9, fontSize: 13.5, color: "var(--body)", lineHeight: 1.5 }}>
            <span aria-hidden style={{ marginTop: 7, flexShrink: 0, width: 5, height: 5, borderRadius: "50%", background: "var(--danger)" }} />
            {r}
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
