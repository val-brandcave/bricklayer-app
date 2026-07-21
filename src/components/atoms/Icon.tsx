import type { LucideIcon } from "lucide-react";

/* Icon atom — standardizes lucide icons to token sizes + tones so no
   component hard-codes stroke/size/color. Inline SVG only (no icon fonts). */

export type IconSize = "xs" | "sm" | "md" | "lg";
export type IconTone = "inherit" | "ink" | "body" | "muted" | "faint" | "primary" | "on-primary";

const SIZES: Record<IconSize, number> = { xs: 14, sm: 16, md: 18, lg: 22 };
const TONES: Record<IconTone, string> = {
  inherit: "currentColor",
  ink: "var(--ink)",
  body: "var(--body)",
  muted: "var(--muted)",
  faint: "var(--faint)",
  primary: "var(--primary)",
  "on-primary": "var(--on-primary)",
};

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  tone?: IconTone;
  strokeWidth?: number;
  className?: string;
  "aria-label"?: string;
}

export function Icon({ icon: I, size = "md", tone = "inherit", strokeWidth = 2, className, ...rest }: IconProps) {
  const label = rest["aria-label"];
  return (
    <I
      size={SIZES[size]}
      strokeWidth={strokeWidth}
      color={TONES[tone]}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    />
  );
}
