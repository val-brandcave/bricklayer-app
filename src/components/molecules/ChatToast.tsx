"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

/* ChatToast — the transient "saved to Reports" confirmation shared by the chat
   surfaces. Fixed, centered, self-dismissing (timing owned by useChatActions). */
export function ChatToast({ message }: { message: string | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          role="status"
          style={{
            position: "fixed",
            bottom: "var(--s-6)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            padding: "10px 16px",
            borderRadius: "var(--r-pill)",
            background: "var(--ink)",
            color: "var(--surface)",
            fontSize: 13.5,
            fontWeight: 600,
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <span style={{ display: "grid", placeItems: "center", width: 18, height: 18, borderRadius: "50%", background: "var(--success)", color: "#fff" }}>
            <Check size={12} strokeWidth={3} />
          </span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
