"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, Search, SquarePen } from "lucide-react";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { Tooltip } from "@/components/atoms/Tooltip";
import { EASE } from "@/lib/motion";
import type { ChatThread } from "@/store";

export interface ChatThreadRailProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNew: () => void;
  onSelect: (id: string) => void;
  search: string;
  onSearch: (q: string) => void;
}

const EXPANDED = 280;
const COLLAPSED = 60;

/* ChatThreadRail — the full-page chat's left rail: assistant identity, New chat,
   a thread search box, and the Recent list with the active thread highlighted.
   Collapses to an icon rail (the app's established side-rail idiom). */
export function ChatThreadRail({ threads, activeThreadId, collapsed, onToggleCollapse, onNew, onSelect, search, onSearch }: ChatThreadRailProps) {
  return (
    <motion.aside
      aria-label="Chat threads"
      animate={{ width: collapsed ? COLLAPSED : EXPANDED }}
      transition={{ duration: 0.34, ease: EASE.inOut }}
      style={{
        flex: "none",
        alignSelf: "stretch",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
        borderRight: "1px solid var(--hairline)",
        overflow: "hidden",
      }}
    >
      {/* identity header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, height: 60, padding: collapsed ? "0" : "0 var(--s-4)", justifyContent: collapsed ? "center" : "space-between", flex: "none", borderBottom: "1px solid var(--hairline)" }}>
        {!collapsed && (
          <span style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: "var(--r-md)", background: "var(--brand-gradient-action)", color: "#fff", flex: "none" }}>
              <EmblemMark size={17} tone="current" />
            </span>
            <span style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 680, color: "var(--ink)", lineHeight: 1.1 }}>Bricklayer</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 1 }}>Appraisal copilot</div>
            </span>
          </span>
        )}
        <Tooltip label={collapsed ? "Show threads" : "Hide threads"} side="right">
          <button type="button" aria-label={collapsed ? "Show threads" : "Hide threads"} onClick={onToggleCollapse} style={iconBtn()}>
            {collapsed ? <PanelLeftOpen size={18} strokeWidth={2} /> : <PanelLeftClose size={18} strokeWidth={2} />}
          </button>
        </Tooltip>
      </div>

      {/* actions */}
      <div style={{ padding: collapsed ? "var(--s-3) 0" : "var(--s-3) var(--s-3) 0", display: "flex", flexDirection: "column", gap: 4, alignItems: collapsed ? "center" : "stretch" }}>
        <RailAction icon={SquarePen} label="New chat" collapsed={collapsed} onClick={onNew} accent />
        {collapsed ? (
          <RailAction icon={Search} label="Search chats" collapsed onClick={onToggleCollapse} />
        ) : (
          <div style={{ position: "relative", margin: "4px 0 2px" }}>
            <Search size={15} strokeWidth={2} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} aria-hidden />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search chats"
              aria-label="Search chats"
              style={{ width: "100%", height: 34, padding: "0 10px 0 32px", borderRadius: "var(--r-md)", border: "1px solid transparent", background: "var(--surface-2)", color: "var(--ink)", font: "inherit", fontSize: 13 }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
            />
          </div>
        )}
      </div>

      {/* recent */}
      {!collapsed && (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "var(--s-3) var(--s-3) var(--s-4)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--faint)", padding: "8px 10px 6px" }}>Recent</div>
          <AnimatePresence initial={false}>
            {threads.map((t) => {
              const active = t.id === activeThreadId;
              return (
                <motion.button
                  key={t.id}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => onSelect(t.id)}
                  style={{
                    position: "relative",
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 10px",
                    borderRadius: "var(--r-md)",
                    border: "none",
                    background: active ? "var(--primary-soft)" : "transparent",
                    color: active ? "var(--primary)" : "var(--body)",
                    font: "inherit",
                    fontSize: 13.5,
                    fontWeight: active ? 600 : 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: "background var(--dur), color var(--dur)",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--surface-2)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  {t.title}
                </motion.button>
              );
            })}
            {threads.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--muted)", padding: "8px 10px", margin: 0 }}>No matching chats.</p>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.aside>
  );
}

function RailAction({ icon: Icon, label, collapsed, onClick, accent = false }: { icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; label: string; collapsed: boolean; onClick: () => void; accent?: boolean }) {
  const content = (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: collapsed ? 38 : "100%",
        height: 38,
        justifyContent: collapsed ? "center" : "flex-start",
        padding: collapsed ? 0 : "0 10px",
        borderRadius: "var(--r-md)",
        border: "none",
        background: "transparent",
        color: accent ? "var(--primary)" : "var(--body)",
        font: "inherit",
        fontSize: 13.5,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background var(--dur)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Icon size={17} strokeWidth={2} />
      {!collapsed && label}
    </button>
  );
  return collapsed ? (
    <Tooltip label={label} side="right">{content}</Tooltip>
  ) : (
    content
  );
}

function iconBtn(): React.CSSProperties {
  return { display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: "var(--r-sm)", border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer" };
}
