import { AlertTriangle, Clock, GitBranch, Layers, Link2, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Pill, severityTone } from "@/components/atoms/Pill";
import type { InsightKind, Severity } from "@/types";

/* FindingCardHeader — the top row of an Insight card: a kind glyph, the claim
   title, a severity pill, and (when the finding is an LLM-discovered
   correlation) a "surprising link" flag. Presentational; the parent card owns
   entrance animation and the claim → evidence → Read body. */

export interface FindingCardHeaderProps {
  title: string;
  kind: InsightKind;
  severity: Severity;
  isSurprisingLink?: boolean;
}

const KIND_META: Record<InsightKind, { icon: LucideIcon; label: string }> = {
  concentration: { icon: Layers, label: "Concentration" },
  staleness: { icon: Clock, label: "Staleness" },
  premium: { icon: AlertTriangle, label: "Premium" },
  correlation: { icon: GitBranch, label: "Correlation" },
  workload: { icon: Users, label: "Workload" },
  "data-health": { icon: ShieldCheck, label: "Data health" },
};

const SEVERITY_LABEL: Record<Severity, string> = {
  info: "Info",
  watch: "Watch",
  high: "High",
};

export function FindingCardHeader({ title, kind, severity, isSurprisingLink = false }: FindingCardHeaderProps) {
  const meta = KIND_META[kind];
  const KindIcon = meta.icon;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--s-3)" }}>
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 34,
          height: 34,
          flexShrink: 0,
          borderRadius: "var(--r-md)",
          background: "var(--surface-2)",
          color: "var(--body)",
          border: "1px solid var(--hairline)",
        }}
      >
        <KindIcon size={17} strokeWidth={2} aria-hidden />
      </span>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--muted)",
            }}
          >
            {meta.label}
          </span>
          <Pill tone={severityTone[severity]} size="sm" dot>
            {SEVERITY_LABEL[severity]}
          </Pill>
          {isSurprisingLink && (
            <Pill tone="primary" size="sm">
              <Link2 size={11} strokeWidth={2.5} aria-hidden style={{ marginRight: 1 }} />
              Surprising link
            </Pill>
          )}
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 650, lineHeight: 1.3, margin: 0 }}>{title}</h3>
      </div>
    </div>
  );
}
