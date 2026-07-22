import { FileText } from "lucide-react";
import type { Provenance } from "@/types";

/* ProvenanceLine — the "traceable to a source" footer that sits under numbers.
   Every figure in Bricklayer should point back to its evidence; this is the
   atom that renders that pointer. Muted, small. Renders on a SINGLE line and
   truncates with an ellipsis when space is tight (narrow tiles, MCP apps in
   chat) — the full text is revealed on hover via the native title. Never wraps
   to two lines. */

export interface ProvenanceLineProps {
  provenance: Provenance;
  size?: number;
  className?: string;
}

function formatAsOf(ts?: number): string | null {
  if (!ts) return null;
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ProvenanceLine({ provenance, size = 11.5, className }: ProvenanceLineProps) {
  const asOf = formatAsOf(provenance.asOf);
  const parts = [provenance.label, provenance.sourceRef, asOf ? `as of ${asOf}` : null].filter(Boolean) as string[];
  const full = parts.join(" · ");

  return (
    <span
      className={className}
      title={full}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        minWidth: 0,
        maxWidth: "100%",
        color: "var(--faint)",
        fontSize: size,
        lineHeight: 1.4,
      }}
    >
      <FileText size={size + 1.5} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden />
      <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <span style={{ color: "var(--muted)" }}>{provenance.label}</span>
        {provenance.sourceRef && <span> · {provenance.sourceRef}</span>}
        {asOf && <span> · as of {asOf}</span>}
      </span>
    </span>
  );
}
