"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { scaleIn } from "@/lib/motion";

export interface MenuItem {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  /** render as a non-interactive section divider above this item */
  dividerBefore?: boolean;
}

export interface MenuProps {
  /** the trigger — receives props to spread onto a button-like element */
  trigger: (props: { onClick: () => void; "aria-expanded": boolean; "aria-haspopup": "menu"; ref: React.Ref<HTMLButtonElement> }) => React.ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
  /** width of the menu panel */
  width?: number;
}

/* Menu — a small popover list used for per-tile actions, switchers and filters.
   Click-outside + Escape to close; entrance via the shared scaleIn variant.
   Presentational shell; callers supply items. */
export function Menu({ trigger, items, align = "end", width = 200 }: MenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "inline-flex" }}>
      {trigger({ onClick: () => setOpen((o) => !o), "aria-expanded": open, "aria-haspopup": "menu", ref: triggerRef })}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            id={id}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              [align === "end" ? "right" : "left"]: 0,
              transformOrigin: align === "end" ? "top right" : "top left",
              width,
              zIndex: 60,
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-md)",
              boxShadow: "var(--shadow-lg)",
              padding: 6,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i}>
                  {item.dividerBefore && (
                    <div style={{ height: 1, background: "var(--hairline)", margin: "5px 2px" }} aria-hidden />
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      setOpen(false);
                      item.onClick?.();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "var(--r-sm)",
                      border: "none",
                      background: "transparent",
                      color: item.danger ? "var(--danger)" : "var(--body)",
                      font: "inherit",
                      fontSize: 13.5,
                      fontWeight: 500,
                      textAlign: "left",
                      cursor: item.disabled ? "not-allowed" : "pointer",
                      opacity: item.disabled ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!item.disabled) e.currentTarget.style.background = item.danger ? "var(--danger-soft)" : "var(--surface-3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {Icon && <Icon size={15} strokeWidth={2} style={{ flexShrink: 0 }} aria-hidden />}
                    {item.label}
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
