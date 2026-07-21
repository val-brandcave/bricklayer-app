import type { Severity } from "@/types";

/* Pill / Badge — a small status token. Semantics (success/danger/warning/info)
   are distinct from brand and from the data series (see CLAUDE.md).
   Purely presentational; entrance animation is owned by the parent. */

export type PillTone = "neutral" | "primary" | "success" | "danger" | "warning" | "info";
export type PillSize = "sm" | "md";

export interface PillProps {
  children: React.ReactNode;
  tone?: PillTone;
  size?: PillSize;
  /** show a leading status dot */
  dot?: boolean;
  className?: string;
}

const TONES: Record<PillTone, { bg: string; fg: string }> = {
  neutral: { bg: "var(--surface-3)", fg: "var(--body)" },
  primary: { bg: "var(--primary-soft)", fg: "var(--primary)" },
  success: { bg: "var(--success-soft)", fg: "var(--success)" },
  danger: { bg: "var(--danger-soft)", fg: "var(--danger)" },
  warning: { bg: "var(--warning-soft)", fg: "var(--warning)" },
  info: { bg: "var(--info-soft)", fg: "var(--info)" },
};

/** Map a domain Severity to a pill tone. */
export const severityTone: Record<Severity, PillTone> = {
  info: "info",
  watch: "warning",
  high: "danger",
};

export function Pill({ children, tone = "neutral", size = "md", dot = false, className }: PillProps) {
  const t = TONES[tone];
  const pad = size === "sm" ? "2px 8px" : "3px 10px";
  const font = size === "sm" ? 11 : 12;
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: pad,
        borderRadius: "var(--r-pill)",
        background: t.bg,
        color: t.fg,
        fontSize: font,
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: "var(--r-pill)",
            background: "currentColor",
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
