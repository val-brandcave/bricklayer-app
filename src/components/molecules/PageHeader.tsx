"use client";

/* PageHeader — the attached header strip shared by the feature screens
   (Insights / Dashboards / Reports). Full-bleed band under the global top bar
   with a bottom hairline so it reads as app chrome, not a floating card: title
   or switcher on the left, primary actions on the right. Prose descriptions
   live nowhere — the strip is structural. Scrolls away with the page. */

export interface PageHeaderProps {
  left: React.ReactNode;
  right?: React.ReactNode;
}

/** Horizontal gutter shared by the header strip, the page body, and the top
    bar so every edge lines up and the content fills the full available width
    (no max-width cap — matches the full-bleed top bar). */
export const PAGE_GUTTER = "var(--s-6)";

export function PageHeader({ left, right }: PageHeaderProps) {
  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--hairline)",
        minHeight: 64,
        padding: `10px ${PAGE_GUTTER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--s-4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1, flexWrap: "wrap" }}>{left}</div>
      {right && <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>{right}</div>}
    </header>
  );
}
