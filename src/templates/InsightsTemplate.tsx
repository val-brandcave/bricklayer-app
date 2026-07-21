"use client";

import { motion } from "framer-motion";
import { Link2, TriangleAlert } from "lucide-react";
import { FindingCard } from "@/components/molecules/FindingCard";
import { PageHeader, PAGE_GUTTER } from "@/components/molecules/PageHeader";
import { InsightsFocusPanel } from "@/components/organisms/InsightsFocusPanel";
import { Skeleton } from "@/components/atoms/Skeleton";
import { staggerContainer } from "@/lib/motion";
import { LENSES } from "@/lib/lenses";
import type { Insight, Lens } from "@/types";

export interface InsightsTemplateProps {
  isLoading: boolean;
  lens: Lens;
  lensInsights: Insight[];
  focused: Insight | null;
  tally: { high: number; watch: number; info: number; surprising: number };
  onFocus: (id: string) => void;
  onFollowUp: (prompt: string) => void;
  onOpenReport: (reportId: string) => void;
  onDismiss: (id: string) => void;
}

/* InsightsTemplate — the per-lens landing: an attached header strip (title +
   severity tally) over the "today read" and a master-detail of findings. The
   opinion layer, not a dashboard copy. Structure only. */
export function InsightsTemplate({ isLoading, lens, lensInsights, focused, tally, onFocus, onFollowUp, onOpenReport, onDismiss }: InsightsTemplateProps) {
  const meta = LENSES[lens];
  const total = lensInsights.length;
  const firstName = meta.userName.split(" ")[0];

  return (
    <>
      <PageHeader
        left={
          <h1 style={{ fontSize: 21, fontWeight: 680, margin: 0, lineHeight: 1.15 }}>
            {greeting()}, <span style={{ color: "var(--muted)", fontWeight: 600 }}>{firstName}</span>
          </h1>
        }
        right={
          !isLoading && total > 0 ? (
            <>
              {tally.high > 0 && <TallyChip icon={TriangleAlert} tone="danger" label={`${tally.high} high`} />}
              {tally.watch > 0 && <TallyChip icon={TriangleAlert} tone="warning" label={`${tally.watch} to watch`} />}
              {tally.surprising > 0 && <TallyChip icon={Link2} tone="primary" label={`${tally.surprising} surprising ${tally.surprising === 1 ? "link" : "links"}`} />}
            </>
          ) : undefined
        }
      />

      <div style={{ padding: `var(--s-6) ${PAGE_GUTTER} var(--s-12)` }}>
        {/* master-detail */}
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
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
              {lensInsights.map((i) => (
                <FindingCard key={i.id} insight={i} selected={focused?.id === i.id} onSelect={onFocus} inStagger />
              ))}
            </motion.div>
          )}

          {!isLoading && <InsightsFocusPanel insight={focused} onFollowUp={onFollowUp} onOpenReport={onOpenReport} onDismiss={onDismiss} />}
        </div>
      </div>
    </>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function TallyChip({ icon: Icon, tone, label }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; tone: "danger" | "warning" | "primary"; label: string }) {
  const color = tone === "danger" ? "var(--danger)" : tone === "warning" ? "var(--warning)" : "var(--primary)";
  const bg = tone === "danger" ? "var(--danger-soft)" : tone === "warning" ? "var(--warning-soft)" : "var(--primary-soft)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: "var(--r-pill)", background: bg, color, fontSize: 12.5, fontWeight: 600 }}>
      <Icon size={13} strokeWidth={2.2} />
      {label}
    </span>
  );
}
