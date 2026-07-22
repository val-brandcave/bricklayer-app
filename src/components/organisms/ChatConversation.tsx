"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, FileText, ThumbsDown, ThumbsUp } from "lucide-react";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { Widget } from "@/components/organisms/Widget";
import { fadeUp } from "@/lib/motion";
import type { Report } from "@/types";
import type { Explanation } from "@/lib/explain";
import type { ResolvedMessage } from "@/hooks/useChat";

export interface ChatConversationProps {
  messages: ResolvedMessage[];
  thinking: boolean;
  onSave: (report: Report) => void;
  onEdit: (report: Report) => void;
  /** follow-up chip clicked inside an explanation → send as a chat message. */
  onDig?: (text: string) => void;
  /** primary CTA on an explanation (open workspace / pin / report). */
  onCta?: (explanation: Explanation) => void;
  /** tighter spacing + narrower MCP app for the docked assistant. */
  dense?: boolean;
}

/* ChatConversation — the threaded exchange. User turns are right-aligned
   bubbles; the assistant answers as plain prose (scientist.com pattern) and
   may attach an MCP app — the SAME Widget a dashboard tile renders, here in its
   chat frame with Save / Edit. A live "thinking" turn animates the emblem while
   the (simulated) agent resolves. Auto-scrolls to the newest turn. */
export function ChatConversation({ messages, thinking, onSave, onEdit, onDig, onCta, dense = false }: ChatConversationProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, thinking]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: dense ? "var(--s-4)" : "var(--s-6)" }}>
      {messages.map((m) => (m.role === "user" ? <UserTurn key={m.id} text={m.text} /> : <AssistantTurn key={m.id} message={m} onSave={onSave} onEdit={onEdit} onDig={onDig} onCta={onCta} dense={dense} />))}

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

function AssistantTurn({ message, onSave, onEdit, onDig, onCta, dense }: { message: ResolvedMessage; onSave: (r: Report) => void; onEdit: (r: Report) => void; onDig?: (t: string) => void; onCta?: (e: Explanation) => void; dense: boolean }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ display: "flex", gap: dense ? 9 : 12, alignItems: "flex-start" }}>
      <Avatar />
      <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
        {message.text && <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "var(--body)" }}>{message.text}</p>}

        {message.explanation && <ExplanationCard explanation={message.explanation} onDig={onDig} onCta={onCta} />}

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

/* The scoped "Explain this" reasoning card — one voice every time: selection
   echo → the why (stacked flags) → Bricklayer's Read (self-critique) →
   provenance → follow-up chips → a primary action. */
function ExplanationCard({ explanation: e, onDig, onCta }: { explanation: Explanation; onDig?: (t: string) => void; onCta?: (e: Explanation) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
      <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--body)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "var(--r-pill)", padding: "4px 11px", maxWidth: "100%" }}>
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>“</span>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.echo}</span>
        <span style={{ color: "var(--primary)", fontWeight: 700 }}>”</span>
      </span>

      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--body)" }} dangerouslySetInnerHTML={{ __html: e.why }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {e.flags.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13.5, color: "var(--body)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--danger)", marginTop: 7, flexShrink: 0 }} aria-hidden />
            <span dangerouslySetInnerHTML={{ __html: f }} />
          </div>
        ))}
      </div>

      <div style={{ borderLeft: "2px solid var(--primary)", background: "var(--primary-soft)", borderRadius: "0 var(--r-md) var(--r-md) 0", padding: "11px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--primary)", marginBottom: 5 }}>
          <EmblemMark size={13} tone="current" /> Bricklayer’s Read
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "var(--body)" }}>{e.read}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--faint)" }}>
        <FileText size={12} strokeWidth={2} aria-hidden /> {e.provenance}
      </div>

      {onDig && e.digs.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {e.digs.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDig(d)}
              style={{ fontSize: 12, padding: "6px 11px", border: "1px solid var(--hairline)", borderRadius: "var(--r-pill)", background: "var(--surface-2)", color: "var(--body)", cursor: "pointer", font: "inherit" }}
              onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = "var(--primary)"; ev.currentTarget.style.color = "var(--primary)"; }}
              onMouseLeave={(ev) => { ev.currentTarget.style.borderColor = "var(--hairline)"; ev.currentTarget.style.color = "var(--body)"; }}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {onCta && (
        <button
          type="button"
          onClick={() => onCta(e)}
          style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 7, marginTop: 2, padding: "9px 15px", border: "none", borderRadius: "var(--r-md)", background: "var(--brand-gradient-action)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", font: "inherit" }}
        >
          {e.ctaLabel} <ArrowRight size={15} strokeWidth={2.2} aria-hidden />
        </button>
      )}
    </div>
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
