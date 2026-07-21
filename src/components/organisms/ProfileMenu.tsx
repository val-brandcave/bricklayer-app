"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, FlaskConical, LogOut, Settings } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { LENSES, LENS_ORDER } from "@/lib/lenses";
import { scaleIn } from "@/lib/motion";

/* Profile menu — the avatar popover. Holds real account actions (Settings,
   Sign out) and, fenced off as a dev-only band, the RBAC lens switcher (in the
   real product the lens is set at provisioning, no in-app switcher). This is the
   only home for the lens preview — the top bar stays product-clean. */
export function ProfileMenu() {
  const lens = useUIStore((s) => s.lens);
  const setLens = useUIStore((s) => s.setLens);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LENSES[lens];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const sep = <div style={{ height: 1, background: "var(--hairline)", margin: "6px 0" }} />;

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 11,
    width: "100%",
    padding: "9px 12px",
    borderRadius: "var(--r-sm)",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
    font: "inherit",
    fontSize: 14,
    color: "var(--body)",
  };
  const hoverOn = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.background = "var(--surface-3)");
  const hoverOff = (e: React.MouseEvent<HTMLButtonElement>) =>
    (e.currentTarget.style.background = "transparent");

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account · ${current.userName}`}
        title={`${current.userName} · ${current.title}`}
        style={{
          display: "grid",
          placeItems: "center",
          width: 34,
          height: 34,
          borderRadius: "var(--r-pill)",
          background: "var(--brand-gradient)",
          backgroundClip: "padding-box",
          color: "#fff",
          fontSize: 12.5,
          fontWeight: 600,
          border: "none",
          boxShadow: open ? "0 0 0 2px var(--surface), 0 0 0 4px var(--primary)" : "none",
          cursor: "pointer",
          userSelect: "none",
          flex: "none",
          overflow: "hidden",
        }}
      >
        {current.initials}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              transformOrigin: "top right",
              width: 288,
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-lg)",
              boxShadow: "var(--shadow-lg)",
              padding: 6,
              zIndex: 60,
            }}
          >
            {/* identity */}
            <div style={{ display: "flex", gap: 11, alignItems: "center", padding: "9px 10px 11px" }}>
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "var(--r-pill)",
                  background: "var(--brand-gradient)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  flex: "none",
                }}
              >
                {current.initials}
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 14.5, fontWeight: 650, color: "var(--ink)" }}>
                  {current.userName}
                </span>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{current.title}</span>
              </span>
            </div>

            {sep}

            {/* real account actions */}
            <button
              type="button"
              role="menuitem"
              style={itemStyle}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
              onClick={() => {
                setSettingsOpen(true);
                setOpen(false);
              }}
            >
              <Settings size={16} strokeWidth={2} style={{ color: "var(--muted)" }} /> Settings
            </button>
            <button
              type="button"
              role="menuitem"
              style={itemStyle}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
              onClick={() => setOpen(false)}
            >
              <LogOut size={16} strokeWidth={2} style={{ color: "var(--muted)" }} /> Sign out
            </button>

            {sep}

            {/* fenced dev band */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px 6px",
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: "var(--warning)",
              }}
            >
              <FlaskConical size={13} /> Dev · view as lens
            </div>
            {LENS_ORDER.map((id) => {
              const m = LENSES[id];
              const active = id === lens;
              return (
                <button
                  key={id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setLens(id);
                    setOpen(false);
                  }}
                  style={{
                    ...itemStyle,
                    background: active ? "var(--primary-soft)" : "transparent",
                    color: active ? "var(--ink)" : "var(--body)",
                    fontWeight: active ? 600 : 500,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "var(--surface-3)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: 26,
                      height: 26,
                      borderRadius: "var(--r-pill)",
                      background: active ? "var(--brand-gradient)" : "var(--surface-3)",
                      color: active ? "#fff" : "var(--muted)",
                      fontSize: 10.5,
                      fontWeight: 700,
                      flex: "none",
                    }}
                  >
                    {m.initials}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>{m.label}</span>
                  {active && <Check size={15} style={{ color: "var(--primary)" }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
