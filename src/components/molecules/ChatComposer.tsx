"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUp, Mic, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { SPRING } from "@/lib/motion";
import { Tooltip } from "@/components/atoms/Tooltip";

export interface ChatComposerProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  /** "sm" trims padding for the docked assistant. */
  size?: "md" | "sm";
}

/* ChatComposer — the message input shared by the full-page chat and the docked
   assistant. Auto-growing textarea, attach + mic affordances, and a gradient
   send button. Enter sends; Shift+Enter makes a newline. Self-contained input
   state so both frames reuse it as-is. */
export function ChatComposer({ onSend, disabled = false, placeholder = "Ask Bricklayer…", autoFocus = false, size = "md" }: ChatComposerProps) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSend = text.trim().length > 0 && !disabled;

  // auto-grow the textarea to fit its content (capped)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [text]);

  const submit = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  };

  const pad = size === "sm" ? "9px 10px" : "11px 14px";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        padding: pad,
        borderRadius: "var(--r-xl)",
        border: "1px solid var(--border-strong)",
        background: "var(--surface)",
        boxShadow: "var(--shadow-sm)",
        transition: "border-color var(--dur), box-shadow var(--dur)",
      }}
      onFocusCapture={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px var(--focus-ring, color-mix(in srgb, var(--primary) 18%, transparent))";
      }}
      onBlurCapture={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <IconBtn label="Attach" disabled={disabled}>
        <Plus size={size === "sm" ? 17 : 19} strokeWidth={2} />
      </IconBtn>

      <textarea
        ref={ref}
        rows={1}
        value={text}
        autoFocus={autoFocus}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        aria-label={placeholder}
        style={{
          flex: 1,
          minWidth: 0,
          resize: "none",
          border: "none",
          outline: "none",
          background: "transparent",
          color: "var(--ink)",
          font: "inherit",
          fontSize: size === "sm" ? 13.5 : 14.5,
          lineHeight: 1.5,
          padding: "5px 2px",
          maxHeight: 160,
        }}
      />

      <IconBtn label="Dictate" disabled={disabled}>
        <Mic size={size === "sm" ? 16 : 18} strokeWidth={2} />
      </IconBtn>

      <Tooltip label="Send" side="top">
        <motion.button
          type="button"
          aria-label="Send message"
          disabled={!canSend}
          onClick={submit}
          whileTap={canSend ? { scale: 0.9 } : undefined}
          transition={SPRING.snappy}
          style={{
            display: "grid",
            placeItems: "center",
            width: size === "sm" ? 30 : 34,
            height: size === "sm" ? 30 : 34,
            flexShrink: 0,
            borderRadius: "var(--r-pill)",
            border: "none",
            background: canSend ? "var(--brand-gradient-action)" : "var(--surface-3)",
            color: canSend ? "#fff" : "var(--faint)",
            cursor: canSend ? "pointer" : "default",
            transition: "background var(--dur)",
          }}
        >
          <ArrowUp size={size === "sm" ? 16 : 18} strokeWidth={2.4} />
        </motion.button>
      </Tooltip>
    </div>
  );
}

function IconBtn({ label, disabled, children }: { label: string; disabled?: boolean; children: React.ReactNode }) {
  return (
    <Tooltip label={label} side="top">
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        style={{
          display: "grid",
          placeItems: "center",
          width: 30,
          height: 30,
          flexShrink: 0,
          borderRadius: "var(--r-md)",
          border: "none",
          background: "transparent",
          color: "var(--muted)",
          cursor: disabled ? "default" : "pointer",
          transition: "color var(--dur), background var(--dur)",
        }}
        onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = "var(--ink)"; } }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}
      >
        {children}
      </button>
    </Tooltip>
  );
}
