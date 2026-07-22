"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ExternalLink, EyeOff } from "lucide-react";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { FindingCardHeader } from "@/components/molecules/FindingCardHeader";
import { Button } from "@/components/atoms/Button";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import type { Insight } from "@/types";

export interface InsightsFocusPanelProps {
  insight: Insight | null;
  onFollowUp: (prompt: string) => void;
  onOpenReport: (reportId: string) => void;
  onDismiss: (id: string) => void;
}

/* InsightsFocusPanel — the deep read on the focused finding: the claim, its
   evidence, and the signature "Bricklayer's Read" — the model critiquing its
   OWN number (the differentiator). Follow-up chips hand off to the co-working
   assistant; the finding can open its related report or be dismissed. */
export function InsightsFocusPanel({ insight, onFollowUp, onOpenReport, onDismiss }: InsightsFocusPanelProps) {
  return (
    <div style={{ position: "sticky", top: "calc(60px + var(--s-6))" }}>
      <AnimatePresence mode="wait">
        {insight ? (
          <motion.article
            key={insight.id}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--s-5)",
              padding: "var(--s-6)",
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-xl)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <motion.div variants={staggerItem}>
              <FindingCardHeader title={insight.title} kind={insight.kind} severity={insight.severity} isSurprisingLink={insight.isSurprisingLink} />
            </motion.div>

            <motion.p variants={staggerItem} data-kind="claim" style={{ fontSize: 15, color: "var(--body)", lineHeight: 1.6, margin: 0 }}>
              {insight.claim}
            </motion.p>

            {/* evidence */}
            <motion.div variants={staggerItem} style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(3, insight.evidence.length)}, 1fr)`, gap: "var(--s-3)" }}>
              {insight.evidence.map((e) => (
                <div key={e.label} style={{ padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--surface-2)", border: "1px solid var(--hairline)" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>{e.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)" }} className="tnum">{e.value}</div>
                  {e.delta && <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginTop: 3 }} className="tnum">{e.delta}</div>}
                </div>
              ))}
            </motion.div>

            {/* Bricklayer's Read — the self-critique callout (signature element) */}
            <motion.div
              variants={staggerItem}
              style={{
                display: "flex",
                gap: "var(--s-3)",
                padding: "var(--s-4) var(--s-4) var(--s-4) var(--s-5)",
                borderRadius: "var(--r-lg)",
                background: "var(--primary-soft)",
                border: "1px solid color-mix(in srgb, var(--primary) 22%, transparent)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "var(--brand-gradient-action)" }} aria-hidden />
              <span style={{ flexShrink: 0, display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: "var(--r-md)", background: "var(--brand-gradient-action)", color: "#fff" }}>
                <EmblemMark size={16} tone="current" />
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>Bricklayer&apos;s Read</div>
                <p style={{ fontSize: 13.5, color: "var(--body)", lineHeight: 1.6, margin: 0 }}>{insight.bricklaysRead}</p>
              </div>
            </motion.div>

            {/* follow-ups */}
            <motion.div variants={staggerItem}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 10 }}>Dig deeper</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {insight.followUps.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => onFollowUp(f)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 12px",
                      borderRadius: "var(--r-pill)",
                      border: "1px solid var(--border-strong)",
                      background: "var(--surface)",
                      color: "var(--body)",
                      font: "inherit",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "border-color var(--dur), color var(--dur), background var(--dur)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.background = "var(--primary-soft)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--body)"; e.currentTarget.style.background = "var(--surface)"; }}
                  >
                    {f}
                    <ArrowRight size={13} strokeWidth={2.2} />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* footer actions */}
            <motion.div variants={staggerItem} style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", paddingTop: "var(--s-4)", borderTop: "1px solid var(--hairline)" }}>
              {insight.relatedReportId && (
                <Button variant="secondary" size="sm" iconLeft={ExternalLink} onClick={() => onOpenReport(insight.relatedReportId!)}>
                  Open related report
                </Button>
              )}
              <span style={{ flex: 1 }} />
              <Button variant="ghost" size="sm" iconLeft={EyeOff} onClick={() => onDismiss(insight.id)}>
                Dismiss
              </Button>
            </motion.div>
          </motion.article>
        ) : (
          <motion.div key="empty" variants={fadeUp} initial="hidden" animate="visible" style={{ display: "grid", placeItems: "center", minHeight: 400, borderRadius: "var(--r-xl)", border: "1px dashed var(--border-strong)", background: "var(--surface-2)", color: "var(--muted)", fontSize: 14 }}>
            Select a finding to see Bricklayer&apos;s read.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
