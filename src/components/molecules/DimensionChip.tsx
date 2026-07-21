"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SPRING } from "@/lib/motion";

export interface DimensionChipProps {
  label: string;
  icon?: LucideIcon;
  /** selected/active styling (e.g. an applied dimension or filter) */
  active?: boolean;
  /** show a remove (×) affordance and call onRemove */
  onRemove?: () => void;
  /** whole-chip click (toggle select) */
  onClick?: () => void;
  className?: string;
}

/* DimensionChip — a dimension / measure / filter token used in the report
   builder and filter bars. Selectable and/or removable, with spring press
   feedback. `layout` lets rows re-flow smoothly as chips are added/removed
   (parent should also enable AnimatePresence for exit). */
export function DimensionChip({ label, icon: I, active = false, onRemove, onClick, className }: DimensionChipProps) {
  const interactive = Boolean(onClick);
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={SPRING.snappy}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: onRemove ? "4px 6px 4px 10px" : "5px 11px",
        borderRadius: "var(--r-pill)",
        fontSize: 12.5,
        fontWeight: 600,
        cursor: interactive ? "pointer" : "default",
        userSelect: "none",
        background: active ? "var(--primary-soft)" : "var(--surface-2)",
        color: active ? "var(--primary)" : "var(--body)",
        border: `1px solid ${active ? "var(--primary)" : "var(--hairline)"}`,
        transition: "background var(--dur), color var(--dur), border-color var(--dur)",
      }}
    >
      {I && <I size={13} strokeWidth={2.2} aria-hidden />}
      {label}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            display: "grid",
            placeItems: "center",
            width: 18,
            height: 18,
            border: "none",
            borderRadius: "var(--r-pill)",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
            opacity: 0.7,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-3)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      )}
    </motion.span>
  );
}
