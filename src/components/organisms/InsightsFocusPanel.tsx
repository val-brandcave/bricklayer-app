"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bookmark, Check, ExternalLink, EyeOff, FlaskConical } from "lucide-react";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { Skeleton } from "@/components/atoms/Skeleton";
import { FindingCardHeader } from "@/components/molecules/FindingCardHeader";
import { Button } from "@/components/atoms/Button";
import { Widget } from "@/components/organisms/Widget";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import type { Insight, Report } from "@/types";

export interface InsightsFocusPanelProps {
  insight: Insight | null;
  /** The chart the Read reasons over — resolved from insight.relatedReportId. */
  report: Report | null;
  onFollowUp: (prompt: string) => void;
  onAsk: (prompt: string) => void;
  onOpenBoard: (insight: Insight) => void;
  onPin: (insight: Insight) => void;
  onDismiss: (id: string) => void;
}

/* How long the "reasoning over the numbers…" beat holds before the Read
   resolves — long enough to read as computation, short enough for a bank. */
const READ_MS = 750;

/* InsightsFocusPanel — the deep read on the focused insight, and where the two
   types diverge. Both show the claim, the CHART, and "Bricklayer's Read". But:
   - curated findings   → advisory Read + Open full board + PIN to board.
   - discovered links   → skeptical Read + a confidence chip + Open board ONLY
                          (you scrutinise a hypothesis; you don't pin it yet).
   The Read "computes" on each focus change (chart re-skeletons, text shimmers)
   so it feels freshly reasoned. */
export function InsightsFocusPanel({ insight, report, onFollowUp, onAsk, onOpenBoard, onPin, onDismiss }: InsightsFocusPanelProps) {
  const [reading, setReading] = useState(true);
  const [pinned, setPinned] = useState(false);
  const [ask, setAsk] = useState("");
  const askRef = useRef<HTMLInputElement>(null);

  // Re-run the reasoning beat and reset transient state whenever the focus moves.
  useEffect(() => {
    if (!insight) return;
    setReading(true);
    setPinned(false);
    setAsk("");
    const t = setTimeout(() => setReading(false), READ_MS);
    return () => clearTimeout(t);
  }, [insight?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const discovered = insight?.origin === "discovered";

  function submitAsk() {
    const q = ask.trim();
    if (!q) return;
    onAsk(q);
    setAsk("");
  }

  function handlePin() {
    if (!insight || pinned) return;
    onPin(insight);
    setPinned(true);
  }

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
              <FindingCardHeader title={insight.title} kind={insight.kind} severity={insight.severity} origin={insight.origin} />
            </motion.div>

            <motion.p variants={staggerItem} data-kind="claim" style={{ fontSize: 15, color: "var(--body)", lineHeight: 1.6, margin: 0 }}>
              {insight.claim}
            </motion.p>

            {/* the chart the Read reasons over */}
            <motion.div variants={staggerItem}>
              {insight.relatedReportId ? (
                report ? (
                  <Widget report={report} frame="bare" loading={reading} />
                ) : (
                  <Skeleton height={200} radius="var(--r-lg)" />
                )
              ) : (
                /* graceful fallback — no bound report, show the evidence figures */
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(3, insight.evidence.length)}, 1fr)`, gap: "var(--s-3)" }}>
                  {insight.evidence.map((e) => (
                    <div key={e.label} style={{ padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--surface-2)", border: "1px solid var(--hairline)" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>{e.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)" }} className="tnum">{e.value}</div>
                      {e.delta && <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginTop: 3 }} className="tnum">{e.delta}</div>}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Bricklayer's Read — advisory (curated) or skeptical (discovered) */}
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
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Bricklayer&apos;s Read
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)" }}>
                    {reading ? "reasoning…" : discovered ? "· hypothesis" : "· advisory"}
                  </span>
                  {discovered && !reading && (
                    <span
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: 10.5, fontWeight: 600, color: "var(--warning)",
                        background: "var(--warning-soft)",
                        border: "1px solid color-mix(in srgb, var(--warning) 32%, transparent)",
                        borderRadius: "var(--r-pill)", padding: "2px 8px",
                      }}
                    >
                      <FlaskConical size={11} strokeWidth={2.2} aria-hidden />
                      Exploratory · correlation, not proof
                    </span>
                  )}
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  {reading ? (
                    <motion.div key="shimmer" variants={fadeUp} initial="hidden" animate="visible" exit="exit" style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 3 }} aria-hidden>
                      <Skeleton shape="text" height={9} width="100%" />
                      <Skeleton shape="text" height={9} width="92%" />
                      <Skeleton shape="text" height={9} width="68%" />
                    </motion.div>
                  ) : (
                    <motion.p key="text" variants={fadeUp} initial="hidden" animate="visible" exit="exit" style={{ fontSize: 13.5, color: "var(--body)", lineHeight: 1.6, margin: 0 }}>
                      {insight.bricklaysRead}
                    </motion.p>
                  )}
                </AnimatePresence>
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
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "7px 12px", borderRadius: "var(--r-pill)",
                      border: "1px solid var(--border-strong)", background: "var(--surface)",
                      color: "var(--body)", font: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer",
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

            {/* free-form ask — hands off to the co-working assistant */}
            <motion.div variants={staggerItem}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "var(--surface-2)", border: "1px solid var(--border-strong)",
                  borderRadius: "var(--r-lg)", padding: "6px 6px 6px 14px",
                  transition: "border-color var(--dur)",
                }}
                onFocusCapture={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
                onBlurCapture={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
              >
                <input
                  ref={askRef}
                  value={ask}
                  onChange={(e) => setAsk(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitAsk(); } }}
                  placeholder="Ask a follow-up about this…"
                  aria-label="Ask a follow-up about this insight"
                  style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", outline: "none", font: "inherit", fontSize: 13.5, color: "var(--body)" }}
                />
                <Button variant="primary" size="sm" onClick={submitAsk} disabled={!ask.trim()}>
                  Ask
                </Button>
              </div>
            </motion.div>

            {/* footer actions — type-aware */}
            <motion.div variants={staggerItem} style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", paddingTop: "var(--s-4)", borderTop: "1px solid var(--hairline)" }}>
              <Button variant="primary" size="sm" iconLeft={ExternalLink} onClick={() => onOpenBoard(insight)}>
                Open full board
              </Button>
              {!discovered && (
                <Button
                  variant="secondary"
                  size="sm"
                  iconLeft={pinned ? Check : Bookmark}
                  onClick={handlePin}
                  disabled={pinned}
                >
                  {pinned ? "Pinned" : "Pin to board"}
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
