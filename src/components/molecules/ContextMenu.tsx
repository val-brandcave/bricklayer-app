"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { SPRING } from "@/lib/motion";

export interface ContextMenuItem {
  label: string;
  /** any icon component that accepts a `size` prop (lucide icon or our EmblemMark). */
  icon?: React.ElementType;
  onClick: () => void;
  prime?: boolean;
  danger?: boolean;
  dividerBefore?: boolean;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

/* A cursor-anchored context menu (portaled to <body>). Opened by the global
   ExplainLayer on right-click of an explainable element. Closes on Esc, outside
   click, or scroll; flips to stay on-screen; arrow keys move between items. */
export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // keep the menu on-screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let nx = x, ny = y;
    if (x + r.width > window.innerWidth - 8) nx = window.innerWidth - r.width - 8;
    if (y + r.height > window.innerHeight - 8) ny = window.innerHeight - r.height - 8;
    el.style.left = Math.max(8, nx) + "px";
    el.style.top = Math.max(8, ny) + "px";
    (el.querySelector("button") as HTMLButtonElement | null)?.focus();
  }, [x, y]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const btns = Array.from(ref.current?.querySelectorAll("button") ?? []) as HTMLButtonElement[];
        if (!btns.length) return;
        const i = btns.indexOf(document.activeElement as HTMLButtonElement);
        const next = e.key === "ArrowDown" ? (i + 1) % btns.length : (i - 1 + btns.length) % btns.length;
        btns[next].focus();
      }
    };
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    const onScroll = () => onClose();
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      ref={ref}
      role="menu"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING.snappy}
      style={{
        position: "fixed",
        left: x,
        top: y,
        zIndex: 200,
        minWidth: 216,
        transformOrigin: "top left",
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--r-md)",
        boxShadow: "var(--shadow-lg)",
        padding: 5,
      }}
    >
      {items.map((it, i) => (
        <div key={it.label}>
          {it.dividerBefore && <div style={{ height: 1, background: "var(--hairline)", margin: "4px 6px" }} aria-hidden />}
          <button
            type="button"
            role="menuitem"
            onClick={() => { it.onClick(); onClose(); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              textAlign: "left",
              border: "none",
              background: "transparent",
              color: it.danger ? "var(--danger)" : it.prime ? "var(--primary)" : "var(--body)",
              font: "inherit",
              fontSize: 13,
              fontWeight: it.prime ? 600 : 500,
              padding: "9px 10px",
              borderRadius: "var(--r-sm)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            autoFocus={i === 0}
          >
            {it.icon && <it.icon size={15} strokeWidth={2} style={{ flex: "none" }} aria-hidden />}
            {it.label}
          </button>
        </div>
      ))}
    </motion.div>,
    document.body,
  );
}
