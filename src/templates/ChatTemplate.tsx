"use client";

import { useRouter } from "next/navigation";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { ChatComposer } from "@/components/molecules/ChatComposer";
import { ChatSuggestions } from "@/components/molecules/ChatSuggestions";
import { ChatThreadRail } from "@/components/organisms/ChatThreadRail";
import { ChatConversation } from "@/components/organisms/ChatConversation";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import type { Report } from "@/types";
import type { UseChat } from "@/hooks/useChat";
import { HEADER_H } from "@/lib/layout";

const TOP = HEADER_H; // TopBar height
const COLUMN = 780; // readable conversation column

export interface ChatTemplateProps {
  data: UseChat;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSave: (report: Report) => void;
  onEdit: (report: Report) => void;
}

/* ChatTemplate — the full-page threaded copilot (the Chat destination). A left
   thread rail, a centered conversation (or a null-state of suggested prompts),
   and a pinned composer. Answers return MCP apps — the same Widget a dashboard
   renders, here with Save / Edit. Built to the scientist.com reference. */
export function ChatTemplate({ data, collapsed, onToggleCollapse, onSave, onEdit }: ChatTemplateProps) {
  const { recentThreads, activeThread, activeThreadId, thinking, isEmpty, search, setSearch, sendMessage, newThread, selectThread } = data;
  const router = useRouter();
  const onCta = (e: import("@/lib/explain").Explanation) => {
    if (e.ctaAction === "workspace") router.push("/properties");
  };

  return (
    <div style={{ position: "relative", isolation: "isolate", display: "flex", height: `calc(100dvh - ${TOP}px)`, backgroundColor: "var(--canvas)", overflow: "hidden" }}>
      {/* brick-lattice texture on its own layer, masked so it fades out smoothly
          toward the composer instead of ending in a hard line. Sits behind the
          rail (opaque) and the conversation (transparent). */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          backgroundImage: "var(--chat-texture)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 68%, transparent 96%)",
          maskImage: "linear-gradient(to bottom, #000 0%, #000 68%, transparent 96%)",
          pointerEvents: "none",
        }}
      />
      <ChatThreadRail
        threads={recentThreads}
        activeThreadId={activeThreadId}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        onNew={newThread}
        onSelect={selectThread}
        search={search}
        onSearch={setSearch}
      />

      {/* conversation column */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {isEmpty ? (
            <NullState onPick={sendMessage} />
          ) : (
            <div style={{ width: "100%", maxWidth: COLUMN, margin: "0 auto", padding: `var(--s-6) var(--s-6) var(--s-8)` }}>
              <ChatConversation messages={activeThread!.messages} thinking={thinking} onSave={onSave} onEdit={onEdit} onDig={sendMessage} onCta={onCta} />
            </div>
          )}
        </div>

        {/* composer */}
        <div style={{ flex: "none", padding: `0 var(--s-6) var(--s-4)` }}>
          <div style={{ width: "100%", maxWidth: COLUMN, margin: "0 auto" }}>
            <ChatComposer onSend={sendMessage} disabled={thinking} autoFocus placeholder="Ask Bricklayer about your book…" />
            <p style={{ textAlign: "center", fontSize: 11.5, color: "var(--faint)", margin: "10px 0 0" }}>Bricklayer can make mistakes — every figure links back to its source.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NullState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "var(--s-8) var(--s-6)" }}>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ width: "100%", maxWidth: 620, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-6)" }}>
        <motion.div variants={staggerItem} style={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: "var(--r-lg)", background: "var(--brand-gradient-action)", color: "#fff", boxShadow: "var(--shadow-md)" }}>
          <EmblemMark size={30} tone="current" />
        </motion.div>
        <motion.div variants={staggerItem} style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 720, lineHeight: 1.15, margin: 0 }}>How can Bricklayer help today?</h1>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.55, margin: "10px auto 0", maxWidth: "46ch" }}>
            Your appraisal intelligence copilot. Ask about concentration, staleness, or risk across the $6.51B book, or dig into a single property — answers come back as charts you can save.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} style={{ width: "100%" }}>
          <ChatSuggestions onPick={onPick} />
        </motion.div>
      </motion.div>
    </div>
  );
}
