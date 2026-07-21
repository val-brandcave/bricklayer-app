"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { Widget } from "@/components/organisms/Widget";
import { fadeUp } from "@/lib/motion";
import type { Report } from "@/types";
import type { ResolvedMessage } from "@/hooks/useChat";

export interface ChatConversationProps {
  messages: ResolvedMessage[];
  thinking: boolean;
  onSave: (report: Report) => void;
  onEdit: (report: Report) => void;
  /** tighter spacing + narrower MCP app for the docked assistant. */
  dense?: boolean;
}

/* ChatConversation — the threaded exchange. User turns are right-aligned
   bubbles; the assistant answers as plain prose (scientist.com pattern) and
   may attach an MCP app — the SAME Widget a dashboard tile renders, here in its
   chat frame with Save / Edit. A live "thinking" turn animates the emblem while
   the (simulated) agent resolves. Auto-scrolls to the newest turn. */
export function ChatConversation({ messages, thinking, onSave, onEdit, dense = false }: ChatConversationProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, thinking]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: dense ? "var(--s-4)" : "var(--s-6)" }}>
      {messages.map((m) => (m.role === "user" ? <UserTurn key={m.id} text={m.text} /> : <AssistantTurn key={m.id} message={m} onSave={onSave} onEdit={onEdit} dense={dense} />))}

      <AnimatePresence>{thinking && <ThinkingTurn key="thinking" />}</AnimatePresence>

      <div ref={endRef} />
    </div>
  );
}

function UserTurn({ text }: { text: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: "flex", justifyContent: "flex-end" }}>
      <div
        style={{
          maxWidth: "82%",
          padding: "10px 15px",
          borderRadius: "18px 18px 5px 18px",
          background: "var(--surface-3)",
          color: "var(--ink)",
          fontSize: 14.5,
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
        }}
      >
        {text}
      </div>
    </motion.div>
  );
}

function AssistantTurn({ message, onSave, onEdit, dense }: { message: ResolvedMessage; onSave: (r: Report) => void; onEdit: (r: Report) => void; dense: boolean }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: "flex", gap: dense ? 9 : 12, alignItems: "flex-start" }}>
      <Avatar />
      <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--body)" }}>{message.text}</p>

        {message.report && (
          <div style={{ maxWidth: dense ? "100%" : 560 }}>
            <Widget report={message.report} frame="mcp" onSave={onSave} onEdit={onEdit} />
          </div>
        )}

        <Feedback />
      </div>
    </motion.div>
  );
}

function ThinkingTurn() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ display: "flex", gap: 12, alignItems: "center" }}
    >
      <Avatar processing />
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 14 }}>
        Reading the book
        <Dots />
      </span>
    </motion.div>
  );
}

function Avatar({ processing = false }: { processing?: boolean }) {
  return (
    <span
      style={{
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        width: 30,
        height: 30,
        borderRadius: "var(--r-md)",
        background: "var(--brand-gradient-action)",
        color: "#fff",
        marginTop: 1,
      }}
    >
      <EmblemMark size={17} tone="current" animation={processing ? "processing" : "none"} />
    </span>
  );
}

function Feedback() {
  const btn: React.CSSProperties = {
    display: "grid",
    placeItems: "center",
    width: 26,
    height: 26,
    borderRadius: "var(--r-sm)",
    border: "none",
    background: "transparent",
    color: "var(--faint)",
    cursor: "pointer",
    transition: "color var(--dur), background var(--dur)",
  };
  const on = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "var(--surface-3)"; };
  const off = (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.color = "var(--faint)"; e.currentTarget.style.background = "transparent"; };
  return (
    <div style={{ display: "flex", gap: 2 }}>
      <button type="button" aria-label="Good response" style={btn} onMouseEnter={on} onMouseLeave={off}><ThumbsUp size={14} strokeWidth={2} /></button>
      <button type="button" aria-label="Bad response" style={btn} onMouseEnter={on} onMouseLeave={off}><ThumbsDown size={14} strokeWidth={2} /></button>
    </div>
  );
}

function Dots() {
  return (
    <span style={{ display: "inline-flex", gap: 3 }} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor" }}
        />
      ))}
    </span>
  );
}
