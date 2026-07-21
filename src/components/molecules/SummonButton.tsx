"use client";

import { motion } from "framer-motion";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { useUIStore } from "@/store/ui.store";
import { SPRING } from "@/lib/motion";

/* The summon-AI control. One of the two places the brand gradient is allowed on
   an interactive surface. The mark is the Bricklayer emblem (monochrome/white on
   the gradient) — never a generic sparkle. */
export function SummonButton({
  variant = "nav",
  context,
  collapsed = false,
}: {
  variant?: "nav" | "fab";
  context?: string;
  collapsed?: boolean;
}) {
  const toggleChat = useUIStore((s) => s.toggleChat);
  const openChat = useUIStore((s) => s.openChat);
  const onClick = () => (context ? openChat(context) : toggleChat());

  const gradientBase: React.CSSProperties = {
    border: "none",
    background: "var(--brand-gradient-action)",
    color: "#fff",
    cursor: "pointer",
  };

  if (variant === "fab") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        aria-label="Ask Bricklayer"
        title="Ask Bricklayer (⌘K)"
        whileHover={{ y: -2, filter: "brightness(1.08)" }}
        whileTap={{ scale: 0.94 }}
        transition={SPRING.snappy}
        style={{
          ...gradientBase,
          position: "fixed",
          right: 24,
          bottom: 24,
          width: 54,
          height: 54,
          borderRadius: "var(--r-pill)",
          boxShadow: "var(--shadow-lg)",
          display: "grid",
          placeItems: "center",
          zIndex: 40,
        }}
      >
        <EmblemMark size={24} tone="current" />
      </motion.button>
    );
  }

  // collapsed nav → square icon button
  if (collapsed) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        aria-label="Ask Bricklayer"
        title="Ask Bricklayer (⌘K)"
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

  // expanded nav → full-width labelled button
  return (
    <motion.button
      type="button"
      onClick={onClick}
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
