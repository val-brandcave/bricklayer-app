"use client";

import { motion } from "framer-motion";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { useUIStore } from "@/store/ui.store";
import { SPRING } from "@/lib/motion";

/* The summon-AI control — the single persistent way to open the right-docked
   co-working copilot (lives in the nav footer). One of the two places the brand
   gradient is allowed on an interactive surface (the other is the full-page
   chat's empty-state hero). The mark is the Bricklayer emblem — never a generic
   sparkle. Collapsed nav → square icon button; expanded → full-width label. */
export function SummonButton({ collapsed = false }: { collapsed?: boolean }) {
  const toggleChat = useUIStore((s) => s.toggleChat);

  const gradientBase: React.CSSProperties = {
    border: "none",
    background: "var(--brand-gradient-action)",
    color: "#fff",
    cursor: "pointer",
  };

  if (collapsed) {
    return (
      <motion.button
        type="button"
        onClick={toggleChat}
        aria-label="Ask Bricklayer"
        title="Ask Bricklayer"
        whileHover={{ y: -1, filter: "brightness(1.06)" }}
        whileTap={{ scale: 0.94 }}
        transition={SPRING.snappy}
        style={{
          ...gradientBase,
          width: "100%",
          height: 44,
          borderRadius: "var(--r-md)",
          display: "grid",
          placeItems: "center",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <EmblemMark size={22} tone="current" />
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggleChat}
      whileHover={{ y: -1, filter: "brightness(1.06)" }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING.snappy}
      style={{
        ...gradientBase,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        width: "100%",
        padding: "11px 14px",
        borderRadius: "var(--r-md)",
        font: "inherit",
        fontSize: 13.5,
        fontWeight: 650,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <EmblemMark size={17} tone="current" /> Ask Bricklayer
    </motion.button>
  );
}
