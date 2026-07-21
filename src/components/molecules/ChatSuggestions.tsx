"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ArrowUpRight, Clock, Layers, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

export interface Suggestion {
  icon: LucideIcon;
  label: string;
  prompt: string;
}

export const CHAT_SUGGESTIONS: Suggestion[] = [
  { icon: Layers, label: "Where is my book most concentrated?", prompt: "Where is my book most concentrated by asset class?" },
  { icon: Clock, label: "Which valuations are going stale?", prompt: "Which valuations are stale and where do they cluster?" },
  { icon: AlertTriangle, label: "Walk me through the risk watchlist", prompt: "Walk me through the current risk watchlist." },
  { icon: SlidersHorizontal, label: "Stress-test a reprice scenario", prompt: "Let me stress-test a direct-cap reprice scenario." },
];

export interface ChatSuggestionsProps {
  onPick: (prompt: string) => void;
  /** compact chip layout for the docked assistant. */
  compact?: boolean;
}

/* ChatSuggestions — the null-state prompt starters (scientist.com pattern).
   Full cards on the full-page chat; slim chips in the docked assistant. */
export function ChatSuggestions({ onPick, compact = false }: ChatSuggestionsProps) {
  if (compact) {
    return (
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CHAT_SUGGESTIONS.map((s) => (
          <motion.button
            key={s.label}
            variants={staggerItem}
            type="button"
            onClick={() => onPick(s.prompt)}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: "var(--r-md)", border: "1px solid var(--hairline)", background: "var(--surface)", color: "var(--body)", font: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "border-color var(--dur), background var(--dur)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "var(--primary-soft)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--hairline)"; e.currentTarget.style.background = "var(--surface)"; }}
          >
            <s.icon size={15} strokeWidth={2} style={{ color: "var(--primary)", flexShrink: 0 }} aria-hidden />
            <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</span>
          </motion.button>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: "grid", gap: "var(--s-3)", width: "100%" }}>
      {CHAT_SUGGESTIONS.map((s) => (
        <motion.button
          key={s.label}
          variants={staggerItem}
          type="button"
          onClick={() => onPick(s.prompt)}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", padding: "16px 18px", borderRadius: "var(--r-lg)", border: "1px solid var(--hairline)", background: "var(--surface)", boxShadow: "var(--shadow-sm)", color: "var(--ink)", font: "inherit", cursor: "pointer", transition: "border-color var(--dur)" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
        >
          <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: "var(--r-md)", background: "var(--primary-soft)", color: "var(--primary)", flexShrink: 0 }}>
            <s.icon size={18} strokeWidth={2} aria-hidden />
          </span>
          <span style={{ flex: 1, fontSize: 14.5, fontWeight: 550 }}>{s.label}</span>
          <ArrowUpRight size={17} strokeWidth={2} style={{ color: "var(--muted)", flexShrink: 0 }} aria-hidden />
        </motion.button>
      ))}
    </motion.div>
  );
}
