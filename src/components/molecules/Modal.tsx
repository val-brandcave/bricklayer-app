"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { EASE } from "@/lib/motion";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** header-right controls */
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
  children?: React.ReactNode;
  /** disable the default body padding (e.g. for full-bleed content) */
  bare?: boolean;
}

/* Modal — the shared app-level overlay used by the report picker, the report
   editor, and other create/edit flows (never trapped inside a chat drawer, per
   CLAUDE.md). Backdrop + Escape close; entrance via scaleIn-style motion. */
export function Modal({ open, onClose, title, subtitle, headerActions, footer, width = 640, children, bare = false }: ModalProps) {
  // Portal to <body> so the overlay is never trapped by a transformed ancestor
  // (e.g. the page-transition motion wrapper), which would otherwise re-anchor
  // the fixed overlay and stall its exit animation.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // NOTE: no AnimatePresence / exit animation. On data-heavy pages (the
  // full-page chat) Framer's exit-completion callback can stall, leaving the
  // overlay mounted forever. Entrance animations are unaffected, so we animate
  // in and unmount instantly on close — reliable everywhere.
  const overlay =
    open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: EASE.standard }}
          onMouseDown={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "grid",
            placeItems: "center",
            padding: "var(--s-6)",
            background: "color-mix(in srgb, var(--brand-ink) 46%, transparent)",
            backdropFilter: "blur(3px)",
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: EASE.out }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: "min(100%, " + width + "px)",
              maxHeight: "calc(100dvh - var(--s-12))",
              display: "flex",
              flexDirection: "column",
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-xl)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            {(title || headerActions) && (
              <header
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "var(--s-4)",
                  padding: "var(--s-5) var(--s-5) var(--s-4)",
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  {title && <h2 style={{ fontSize: 18, fontWeight: 680, margin: 0, lineHeight: 1.25 }}>{title}</h2>}
                  {subtitle && <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0", lineHeight: 1.45 }}>{subtitle}</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  {headerActions}
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    style={{ display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: "var(--r-sm)", border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = "var(--ink)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}
                  >
                    <X size={18} strokeWidth={2} />
                  </button>
                </div>
              </header>
            )}

            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: bare ? 0 : "var(--s-5)" }}>{children}</div>

            {footer && (
              <footer style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--s-3)", padding: "var(--s-4) var(--s-5)", borderTop: "1px solid var(--hairline)" }}>
                {footer}
              </footer>
            )}
          </motion.div>
        </motion.div>
    ) : null;

  if (!mounted || !open) return null;
  return createPortal(overlay, document.body);
}
