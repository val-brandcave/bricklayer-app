"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Maximize2, Menu as MenuIcon, PanelLeftClose, Search, SquarePen, X } from "lucide-react";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { Tooltip } from "@/components/atoms/Tooltip";
import { ChatComposer } from "@/components/molecules/ChatComposer";
import { ChatSuggestions } from "@/components/molecules/ChatSuggestions";
import { ChatToast } from "@/components/molecules/ChatToast";
import { ChatConversation } from "@/components/organisms/ChatConversation";
import { ReportBuilderModal } from "@/components/organisms/ReportBuilderModal";
import { useUIStore } from "@/store/ui.store";
import { useChat } from "@/hooks/useChat";
import { useChatActions } from "@/hooks/useChatActions";
import { EASE } from "@/lib/motion";

const TOP = 60; // TopBar height — the dock is inset directly beneath it
const WIDTH = 400;

/* Right-docked co-working assistant. Inset beneath the top bar so the global
   search/profile stay usable while chatting. Shares the chat store with the
   full-page /chat destination (same conversation, two frames) — Expand (⤢)
   promotes the current thread to the full page. Header hamburger opens an
   in-dock thread slide-over (New chat / Search / Recent). */
export function CoWorkingChat() {
  const open = useUIStore((s) => s.chatOpen);
  const close = useUIStore((s) => s.closeChat);
  const context = useUIStore((s) => s.chatContext);
  const router = useRouter();

  const { recentThreads, activeThread, activeThreadId, thinking, isEmpty, search, setSearch, sendMessage, newThread, selectThread } = useChat();
  const { lens, editing, openEdit, closeEdit, toast, saveReport, forkReport } = useChatActions();

  const [threadsOpen, setThreadsOpen] = useState(false);

  const promote = () => {
    close();
    router.push("/chat");
  };

  const startNew = () => {
    newThread();
    setThreadsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside
            key="dock"
            aria-label="Bricklayer co-working assistant"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: WIDTH, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE.out }}
            style={{
              flex: "none",
              alignSelf: "flex-start",
              position: "sticky",
              top: TOP,
              height: `calc(100dvh - ${TOP}px)`,
              display: "flex",
              flexDirection: "column",
              background: "var(--surface)",
              borderLeft: "1px solid var(--hairline)",
              overflow: "hidden",
            }}
          >
            {/* header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 var(--s-3)", height: 52, flex: "none", borderBottom: "1px solid var(--hairline)", minWidth: WIDTH - 1 }}>
              <Tooltip label="Threads" side="bottom">
                <button type="button" aria-label="Threads" onClick={() => setThreadsOpen(true)} style={iconBtn}><MenuIcon size={18} strokeWidth={2} /></button>
              </Tooltip>
              <span style={{ display: "grid", placeItems: "center", width: 26, height: 26, borderRadius: "var(--r-md)", background: "var(--brand-gradient-action)", color: "#fff", flex: "none" }}>
                <EmblemMark size={15} tone="current" />
              </span>
              <span style={{ fontWeight: 650, color: "var(--ink)", fontSize: 14 }}>Bricklayer</span>
              <span style={{ flex: 1 }} />
              <Tooltip label="New chat" side="bottom">
                <button type="button" aria-label="New chat" onClick={startNew} style={iconBtn}><SquarePen size={17} strokeWidth={2} /></button>
              </Tooltip>
              <Tooltip label="Open full page" side="bottom">
                <button type="button" aria-label="Expand to full page" onClick={promote} style={iconBtn}><Maximize2 size={16} strokeWidth={2} /></button>
              </Tooltip>
              <Tooltip label="Close" side="bottom">
                <button type="button" aria-label="Close assistant" onClick={close} style={iconBtn}><X size={17} strokeWidth={2} /></button>
              </Tooltip>
            </div>

            {/* body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "var(--s-4)", minWidth: WIDTH - 1 }}>
              {context && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--primary)", background: "var(--primary-soft)", borderRadius: "var(--r-pill)", padding: "4px 10px", marginBottom: "var(--s-4)", fontWeight: 600 }}>
                  Context · {context}
                </div>
              )}

              {isEmpty ? (
                <DockWelcome onPick={sendMessage} />
              ) : (
                <ChatConversation messages={activeThread!.messages} thinking={thinking} onSave={saveReport} onEdit={openEdit} dense />
              )}
            </div>

            {/* composer */}
            <div style={{ padding: "var(--s-3) var(--s-4) var(--s-4)", borderTop: "1px solid var(--hairline)", flex: "none", minWidth: WIDTH - 1 }}>
              <ChatComposer onSend={sendMessage} disabled={thinking} size="sm" placeholder="Ask about this page…" />
            </div>

            {/* in-dock thread slide-over */}
            <AnimatePresence>
              {threadsOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setThreadsOpen(false)}
                    style={{ position: "absolute", inset: 0, background: "color-mix(in srgb, var(--brand-ink) 30%, transparent)", zIndex: 5 }}
                  />
                  <motion.div
                    initial={{ x: -WIDTH }}
                    animate={{ x: 0 }}
                    exit={{ x: -WIDTH }}
                    transition={{ duration: 0.26, ease: EASE.out }}
                    style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: WIDTH - 40, background: "var(--surface)", borderRight: "1px solid var(--hairline)", boxShadow: "var(--shadow-lg)", zIndex: 6, display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, height: 52, padding: "0 var(--s-3) 0 var(--s-4)", borderBottom: "1px solid var(--hairline)", flex: "none" }}>
                      <span style={{ display: "grid", placeItems: "center", width: 26, height: 26, borderRadius: "var(--r-md)", background: "var(--brand-gradient-action)", color: "#fff" }}><EmblemMark size={15} tone="current" /></span>
                      <span style={{ fontWeight: 650, fontSize: 14, flex: 1 }}>Threads</span>
                      <Tooltip label="Hide" side="bottom">
                        <button type="button" aria-label="Hide threads" onClick={() => setThreadsOpen(false)} style={iconBtn}><PanelLeftClose size={17} strokeWidth={2} /></button>
                      </Tooltip>
                    </div>
                    <div style={{ padding: "var(--s-3)", flex: "none" }}>
                      <button type="button" onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 10px", borderRadius: "var(--r-md)", border: "none", background: "transparent", color: "var(--primary)", font: "inherit", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <SquarePen size={16} strokeWidth={2} /> New chat
                      </button>
                      <div style={{ position: "relative", marginTop: 4 }}>
                        <Search size={14} strokeWidth={2} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }} aria-hidden />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats" aria-label="Search chats" style={{ width: "100%", height: 32, padding: "0 10px 0 30px", borderRadius: "var(--r-md)", border: "1px solid transparent", background: "var(--surface-2)", color: "var(--ink)", font: "inherit", fontSize: 12.5 }} onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")} onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")} />
                      </div>
                    </div>
                    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 var(--s-3) var(--s-3)" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--faint)", padding: "8px 10px 4px" }}>Recent</div>
                      {recentThreads.map((t) => {
                        const active = t.id === activeThreadId;
                        return (
                          <button key={t.id} type="button" onClick={() => { selectThread(t.id); setThreadsOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: "var(--r-md)", border: "none", background: active ? "var(--primary-soft)" : "transparent", color: active ? "var(--primary)" : "var(--body)", font: "inherit", fontSize: 13, fontWeight: active ? 600 : 500, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--surface-2)"; }} onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                            {t.title}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.aside>
        )}
      </AnimatePresence>

      <ReportBuilderModal open={!!editing} onClose={closeEdit} report={editing} lens={lens} onSave={forkReport} />
      <ChatToast message={toast} />
    </>
  );
}

function DockWelcome({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
      <div style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: "var(--r-lg)", background: "var(--primary-soft)", color: "var(--body)", fontSize: 13.5, lineHeight: 1.55 }}>
        I&apos;m your page-aware copilot. Ask about what&apos;s on screen, or across the whole $6.51B book — I can build a chart, save it to a dashboard, or open a property with receipts.
      </div>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", padding: "0 2px" }}>Try</div>
      <ChatSuggestions onPick={onPick} compact />
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: 30,
  height: 30,
  borderRadius: "var(--r-sm)",
  border: "none",
  background: "transparent",
  color: "var(--muted)",
  cursor: "pointer",
};
