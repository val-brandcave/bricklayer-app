"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FindingCard } from "@/components/molecules/FindingCard";
import { PAGE_GUTTER } from "@/components/molecules/PageHeader";
import { TodayDigest } from "@/components/molecules/TodayDigest";
import { InsightsFocusPanel } from "@/components/organisms/InsightsFocusPanel";
import { Skeleton } from "@/components/atoms/Skeleton";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { LENSES } from "@/lib/lenses";
import type { Insight, Lens, Report } from "@/types";

export interface InsightsTemplateProps {
  isLoading: boolean;
  lens: Lens;
  findings: Insight[];
  links: Insight[];
  focused: Insight | null;
  focusedReport: Report | null;
  onFocus: (id: string) => void;
  onFollowUp: (prompt: string) => void;
  onAsk: (prompt: string) => void;
  onOpenBoard: (insight: Insight) => void;
  onPin: (insight: Insight) => void;
  onDismiss: (id: string) => void;
}

/* InsightsTemplate — the per-lens landing: a personal greeting sits as a plain
   line over the TODAY digest (the book-wide synthesis), then the master-detail.
   The list segregates the two insight tiers — curated "what stands out"
   findings, then the LLM-discovered "surprising links" with a caveat header and
   exploratory styling — while a single focus panel adapts its detail by type.
   No header strip and no tally chips: the counts live in the TODAY read. */
export function InsightsTemplate({
  isLoading, lens, findings, links, focused, focusedReport,
  onFocus, onFollowUp, onAsk, onOpenBoard, onPin, onDismiss,
}: InsightsTemplateProps) {
  const meta = LENSES[lens];
  const firstName = meta.userName.split(" ")[0];

  return (
    <div style={{ padding: `var(--s-6) ${PAGE_GUTTER} var(--s-12)`, display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
      {/* personal greeting — an orphaned line, not a header strip */}
      <h1 style={{ fontSize: 22, fontWeight: 680, margin: 0, lineHeight: 1.15 }}>
        {greeting()}, <span style={{ color: "var(--muted)", fontWeight: 600 }}>{firstName}</span>
      </h1>

      {/* The book-wide "TODAY" read — the state of the book, before the drill. */}
      <TodayDigest lens={lens} findingCount={findings.length} linkCount={links.length} isLoading={isLoading} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 400px) minmax(0, 1fr)", gap: "var(--s-6)", alignItems: "start" }}>
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ padding: "var(--s-4)", borderRadius: "var(--r-lg)", border: "1px solid var(--hairline)", background: "var(--surface)", display: "flex", flexDirection: "column", gap: 10 }}>
                  <Skeleton width="60%" height={14} shape="text" />
                  <Skeleton width="90%" height={12} shape="text" />
                  <Skeleton width="80%" height={12} shape="text" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
              {/* Tier 1 — curated findings */}
              <section style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                <GroupLabel eyebrow="What stands out" />
                {findings.map((i) => (
                  <FindingCard key={i.id} insight={i} selected={focused?.id === i.id} onSelect={onFocus} inStagger />
                ))}
              </section>

              {/* Tier 2 — discovered surprising links, cordoned + caveated */}
              {links.length > 0 && (
                <section style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                  <GroupLabel
                    eyebrow="Surprising links"
                    icon={Sparkles}
                    caption="Bricklayer found these — worth probing, not yet proven."
                    accent
                  />
                  {links.map((i) => (
                    <FindingCard key={i.id} insight={i} selected={focused?.id === i.id} onSelect={onFocus} inStagger />
                  ))}
                </section>
              )}
            </motion.div>
          )}

          {!isLoading && (
            <InsightsFocusPanel
              insight={focused}
              report={focusedReport}
              onFollowUp={onFollowUp}
              onAsk={onAsk}
              onOpenBoard={onOpenBoard}
              onPin={onPin}
              onDismiss={onDismiss}
            />
          )}
        </div>
    </div>
  );
}

/* A section label in the list rail — an uppercase eyebrow, optionally with a
   brand glyph + a one-line caveat (used for the exploratory "surprising links"
   tier so its provisional nature is set once, at the group level). */
function GroupLabel({ eyebrow, icon: Icon, caption, accent = false }: { eyebrow: string; icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>; caption?: string; accent?: boolean }) {
  return (
    <motion.div variants={staggerItem} style={{ display: "flex", flexDirection: "column", gap: 3, padding: "2px 2px 0" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: accent ? "var(--primary)" : "var(--muted)" }}>
        {Icon && <Icon size={13} strokeWidth={2.2} />}
        {eyebrow}
      </span>
      {caption && <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.45 }}>{caption}</span>}
    </motion.div>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
