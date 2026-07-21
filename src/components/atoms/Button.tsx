"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SPRING } from "@/lib/motion";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "gradient";
export type ButtonSize = "sm" | "md" | "lg";

/* Drag & animation handlers collide with framer-motion's gesture props, so
   omit the native ones (we don't use them on buttons). */
type NativeProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "style" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

export interface ButtonProps extends NativeProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const SIZES: Record<ButtonSize, { pad: string; font: number; icon: number; h: number }> = {
  sm: { pad: "0 12px", font: 13, icon: 15, h: 32 },
  md: { pad: "0 16px", font: 14, icon: 16, h: 38 },
  lg: { pad: "0 22px", font: 15, icon: 18, h: 46 },
};

/* Base visual per variant, expressed through tokens only.
   `gradient` is the brand action gradient — reserve for ONE hero CTA per view
   (same rule as the summon control; see CLAUDE.md). */
const VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: "var(--primary)", color: "var(--on-primary)", border: "1px solid transparent" },
  secondary: { background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--border-strong)" },
  ghost: { background: "transparent", color: "var(--body)", border: "1px solid transparent" },
  danger: { background: "var(--danger)", color: "#fff", border: "1px solid transparent" },
  gradient: { background: "var(--brand-gradient-action)", color: "#fff", border: "1px solid transparent" },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    iconLeft: IconLeft,
    iconRight: IconRight,
    loading = false,
    fullWidth = false,
    disabled,
    children,
    ...rest
  },
  ref,
) {
  const s = SIZES[size];
  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { y: -1 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={SPRING.snappy}
      data-variant={variant}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: fullWidth ? "100%" : undefined,
        height: s.h,
        padding: s.pad,
        borderRadius: "var(--r-md)",
        font: "inherit",
        fontSize: s.font,
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: "-0.005em",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled && !loading ? 0.5 : 1,
        whiteSpace: "nowrap",
        transition: "background var(--dur), border-color var(--dur), box-shadow var(--dur), filter var(--dur)",
        ...VARIANTS[variant],
      }}
      onMouseEnter={(e) => applyHover(e.currentTarget, variant, true, isDisabled)}
      onMouseLeave={(e) => applyHover(e.currentTarget, variant, false, isDisabled)}
      {...rest}
    >
      {loading ? (
        <Loader2 size={s.icon} className="bl-spin" aria-hidden />
      ) : (
        IconLeft && <IconLeft size={s.icon} strokeWidth={2} aria-hidden />
      )}
      {children}
      {!loading && IconRight && <IconRight size={s.icon} strokeWidth={2} aria-hidden />}
    </motion.button>
  );
});

/* Token-driven hover — no literal colors. */
function applyHover(el: HTMLButtonElement, variant: ButtonVariant, on: boolean, disabled?: boolean) {
  if (disabled) return;
  switch (variant) {
    case "primary":
      el.style.background = on ? "var(--primary-hover)" : "var(--primary)";
      break;
    case "secondary":
      el.style.background = on ? "var(--surface-3)" : "var(--surface)";
      break;
    case "ghost":
      el.style.background = on ? "var(--surface-3)" : "transparent";
      break;
    case "danger":
      el.style.filter = on ? "brightness(1.06)" : "none";
      break;
    case "gradient":
      el.style.filter = on ? "brightness(1.06)" : "none";
      break;
  }
}
