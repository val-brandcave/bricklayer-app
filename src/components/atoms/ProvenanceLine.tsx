import { FileText } from "lucide-react";
import type { Provenance } from "@/types";

/* ProvenanceLine — the "traceable to a source" footer that sits under numbers.
   Every figure in Bricklayer should point back to its evidence; this is the
   atom that renders that pointer. Muted, small, non-interactive. */

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
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: "var(--faint)",
        fontSize: size,
        lineHeight: 1.4,
      }}
    >
      <FileText size={size + 1.5} strokeWidth={2} style={{ flexShrink: 0, marginTop: -1 }} aria-hidden />
      <span style={{ color: "var(--muted)" }}>{provenance.label}</span>
      {provenance.sourceRef && (
        <>
          <span aria-hidden>·</span>
          <span>{provenance.sourceRef}</span>
        </>
      )}
      {asOf && (
        <>
          <span aria-hidden>·</span>
          <span>as of {asOf}</span>
        </>
      )}
    </span>
  );
}
