"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type Side = "right" | "left" | "top" | "bottom";

export interface TooltipProps {
  label: string;
  side?: Side;
  /** gap between trigger and tooltip, px */
  offset?: number;
  disabled?: boolean;
  children: React.ReactElement;
}

/* Tooltip — a small floating label with a caret, animated in with Framer.
   Portaled to <body> and fixed-positioned from the trigger's rect, so it
   escapes clipped/overflow-hidden containers (e.g. the collapsed nav rail).
   Opens on hover and keyboard focus. */
export function Tooltip({ label, side = "right", offset = 10, disabled, children }: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const open = useCallback(() => {
    if (disabled) return;
    const el = triggerRef.current?.firstElementChild ?? triggerRef.current;
    if (el) setRect(el.getBoundingClientRect());
  }, [disabled]);
  const close = useCallback(() => setRect(null), []);

  // position of the tooltip box + caret, by side
  const pos = (() => {
    if (!rect) return null;
    switch (side) {
      case "right":
        return { left: rect.right + offset, top: rect.top + rect.height / 2, ty: "-50%", tx: "0" };
      case "left":
        return { left: rect.left - offset, top: rect.top + rect.height / 2, ty: "-50%", tx: "-100%" };
      case "top":
        return { left: rect.left + rect.width / 2, top: rect.top - offset, ty: "-100%", tx: "-50%" };
      default:
        return { left: rect.left + rect.width / 2, top: rect.bottom + offset, ty: "0", tx: "-50%" };
    }
  })();

  const caret = (() => {
    // a rotated square sitting on the edge facing the trigger
    const base: React.CSSProperties = {
      position: "absolute",
      width: 8,
      height: 8,
      background: "var(--ink)",
      transform: "rotate(45deg)",
    };
    switch (side) {
      case "right":
        return { ...base, left: -3, top: "calc(50% - 4px)" };
      case "left":
        return { ...base, right: -3, top: "calc(50% - 4px)" };
      case "top":
        return { ...base, bottom: -3, left: "calc(50% - 4px)" };
      default:
        return { ...base, top: -3, left: "calc(50% - 4px)" };
    }
  })();

  const enterX = side === "right" ? -4 : side === "left" ? 4 : 0;
  const enterY = side === "top" ? 4 : side === "bottom" ? -4 : 0;

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={open}
        onMouseLeave={close}
        onFocus={open}
        onBlur={close}
        style={{ display: "contents" }}
      >
        {children}
      </span>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {pos && (
              <motion.span
                role="tooltip"
                initial={{ opacity: 0, scale: 0.94, x: enterX, y: enterY }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, x: enterX, y: enterY }}
                transition={{ duration: 0.13, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "fixed",
                  left: pos.left,
                  top: pos.top,
                  transform: `translate(${pos.tx}, ${pos.ty})`,
                  zIndex: 90,
                  pointerEvents: "none",
                  background: "var(--ink)",
                  color: "var(--surface)",
                  fontSize: 12.5,
                  fontWeight: 600,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  padding: "7px 10px",
                  borderRadius: "var(--r-sm)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <span style={caret} aria-hidden />
                <span style={{ position: "relative" }}>{label}</span>
              </motion.span>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
