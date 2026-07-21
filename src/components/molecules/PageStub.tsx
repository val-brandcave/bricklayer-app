import type { LucideIcon } from "lucide-react";

/* Interim placeholder for a route while its real screen is built (Phase 4).
   Themed and intentional — not a blank page. */
export function PageStub({
  icon: Icon,
  title,
  blurb,
  phase,
}: {
  icon: LucideIcon;
  title: string;
  blurb: string;
  phase: string;
}) {
  return (
    <div style={{ padding: "var(--s-12) var(--s-8)", maxWidth: 720 }}>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: 52,
          height: 52,
          borderRadius: "var(--r-lg)",
          background: "var(--primary-soft)",
          color: "var(--primary)",
          marginBottom: "var(--s-5)",
        }}
      >
        <Icon size={24} strokeWidth={2} />
      </div>
      <h1 style={{ fontSize: 30, lineHeight: 1.15, marginBottom: "var(--s-3)" }}>{title}</h1>
      <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: "60ch", lineHeight: 1.6 }}>{blurb}</p>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginTop: "var(--s-6)",
          fontSize: 12,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--muted)",
          background: "var(--surface-2)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--r-pill)",
          padding: "6px 12px",
        }}
      >
        {phase}
      </span>
    </div>
  );
}
