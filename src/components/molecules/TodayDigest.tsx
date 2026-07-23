"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { Skeleton } from "@/components/atoms/Skeleton";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { LENS_DIGESTS } from "@/lib/insight-digests";
import { LENSES } from "@/lib/lenses";
import { bookStats } from "@/data/datasets";
import { useUIStore } from "@/store";
import type { Lens } from "@/types";

export interface TodayDigestProps {
  lens: Lens;
  /** Count of curated findings in the lens set — drives the live lede. */
  findingCount: number;
  /** Count of discovered "surprising links" — the second lede clause. */
  linkCount: number;
  /** While the insight set is fetching, hold the digest's shape with shimmer. */
  isLoading: boolean;
}

/* TodayDigest — the book-wide "TODAY" read that opens the Insights landing:
   Bricklayer's SYNTHESIS of the whole book through the active lens. Deliberately
   just the live lede (counts) + one posture sentence — the "where do I look
   first / how should I feel" the individual finding cards can't give, and which
   holds whether a lens surfaces 2 findings or 12. The per-finding detail lives
   in the cards below and their "Bricklayer's Read"; TODAY does not re-list them.
   A single chevron collapses it to its bar (a returning-user preference,
   persisted) — the one control, no nested disclosures. */
export function TodayDigest({ lens, findingCount, linkCount, isLoading }: TodayDigestProps) {
  const digest = LENS_DIGESTS[lens];
  const lensLabel = LENSES[lens].label;
  const collapsed = useUIStore((s) => s.todayCollapsed);
  const toggleCollapsed = useUIStore((s) => s.toggleTodayCollapsed);
  const [headerHover, setHeaderHover] = useState(false);

  const findingClause = `${findingCount} ${findingCount === 1 ? "finding stands" : "things stand"} out`;
  const linkClause =
    linkCount > 0 ? `, plus ${linkCount} ${linkCount === 1 ? "connection" : "connections"} worth probing` : "";
  // When collapsed, the bar still has to say something — fold the counts in.
  const countSummary = `${findingCount} stand out${linkCount > 0 ? `, ${linkCount} to probe` : ""}`;

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      aria-label="Today — the state of your book"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--r-xl)",
        boxShadow: "var(--shadow-sm)",
        padding: collapsed ? "var(--s-3) var(--s-5)" : "var(--s-5) var(--s-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--s-4)",
        transition: "padding var(--dur) var(--ease)",
      }}
    >
      {/* header — the whole row is the toggle: click anywhere to collapse the
          brief to its bar, or to expand it again. The chevron is a decorative
          cue (the button carries the semantics). */}
      <button
        type="button"
        onClick={toggleCollapsed}
        onMouseEnter={() => setHeaderHover(true)}
        onMouseLeave={() => setHeaderHover(false)}
        aria-label={collapsed ? "Expand today's brief" : "Collapse today's brief"}
        aria-expanded={!collapsed}
        style={{
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          width: "100%", padding: 0, border: "none", background: "transparent",
          font: "inherit", color: "inherit", textAlign: "left", cursor: "pointer",
        }}
      >
        <span
          style={{
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            width: collapsed ? 24 : 30,
            height: collapsed ? 24 : 30,
            borderRadius: "var(--r-md)",
            background: "var(--brand-gradient-action)",
            color: "#fff",
            transition: "width var(--dur) var(--ease), height var(--dur) var(--ease)",
          }}
        >
          <EmblemMark size={collapsed ? 13 : 16} tone="current" animation={isLoading ? "processing" : "none"} />
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Today
        </span>
        <span style={{ color: "var(--border-strong)" }} aria-hidden>·</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)" }}>{digest.eyebrow}</span>
        {collapsed && !isLoading && (
          <span style={{ fontSize: 12.5, color: "var(--faint)" }}>
            <span style={{ color: "var(--border-strong)", margin: "0 6px" }} aria-hidden>·</span>
            {countSummary}
          </span>
        )}

        <span style={{ flex: 1 }} />

        {!collapsed && (
          <span style={{ fontSize: 11.5, fontWeight: 500, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} aria-hidden />
            Looking at the whole book
          </span>
        )}

        <span
          aria-hidden
          style={{
            flexShrink: 0, display: "grid", placeItems: "center", width: 28, height: 28,
            borderRadius: "var(--r-md)",
            background: headerHover ? "var(--surface-2)" : "transparent",
            color: headerHover ? "var(--ink)" : "var(--muted)",
            transition: "background var(--dur), color var(--dur)",
          }}
        >
          {collapsed ? <ChevronDown size={17} strokeWidth={2.2} /> : <ChevronUp size={17} strokeWidth={2.2} />}
        </span>
      </button>

      {/* body — hidden when collapsed (entrance-only; instant unmount) */}
      {!collapsed && (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
          {isLoading ? (
            <>
              <Skeleton shape="text" height={15} width="72%" />
              <Skeleton shape="text" height={12} width="90%" />
            </>
          ) : (
            <>
              {/* lede — live counts from the lens set */}
              <motion.p variants={staggerItem} style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--body)" }}>
                I read all{" "}
                <span className="tnum" style={{ fontWeight: 650, color: "var(--ink)" }}>
                  {bookStats.appraisalCount.toLocaleString()}
                </span>{" "}
                appraisals through your {lensLabel} lens —{" "}
                <span style={{ fontWeight: 650, color: "var(--ink)" }}>{findingClause}</span>
                {linkClause}.
              </motion.p>

              {/* the one synthesis sentence — posture + the first move */}
              <motion.p variants={staggerItem} style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--muted)" }}>
                {digest.posture}
              </motion.p>
            </>
          )}
        </motion.div>
      )}
    </motion.section>
  );
}
