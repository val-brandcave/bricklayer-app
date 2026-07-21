"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { SPRING } from "@/lib/motion";

export interface SearchFieldProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  ariaLabel?: string;
  size?: "sm" | "md";
  fullWidth?: boolean;
}

/* SearchField — search input with a leading glass icon and an animated
   clear affordance that springs in once there's a query. Controlled or
   uncontrolled. */
export function SearchField({
  value,
  defaultValue = "",
  placeholder = "Search…",
  onChange,
  onSubmit,
  ariaLabel = "Search",
  size = "md",
  fullWidth = true,
}: SearchFieldProps) {
  const id = useId();
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const current = isControlled ? value : inner;

  const set = (next: string) => {
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  const h = size === "sm" ? 34 : 40;

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(current ?? "");
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: h,
        padding: "0 12px",
        width: fullWidth ? "100%" : undefined,
        borderRadius: "var(--r-md)",
        background: "var(--surface)",
        border: `1px solid ${focused ? "var(--primary)" : "var(--border-strong)"}`,
        boxShadow: focused ? "0 0 0 3px var(--ring)" : "none",
        transition: "border-color var(--dur), box-shadow var(--dur)",
      }}
    >
      <Search size={16} strokeWidth={2} color="var(--muted)" aria-hidden style={{ flexShrink: 0 }} />
      <input
        id={id}
        type="search"
        value={current}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => set(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          color: "var(--ink)",
          font: "inherit",
          fontSize: 14,
          // hide the native search clear (we render our own animated one)
          appearance: "none",
          WebkitAppearance: "none",
        }}
      />
      <AnimatePresence>
        {current && current.length > 0 && (
          <motion.button
            type="button"
            aria-label="Clear search"
            onClick={() => set("")}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={SPRING.snappy}
            whileTap={{ scale: 0.85 }}
            style={{
              display: "grid",
              placeItems: "center",
              width: 20,
              height: 20,
              flexShrink: 0,
              border: "none",
              borderRadius: "var(--r-pill)",
              background: "var(--surface-3)",
              color: "var(--muted)",
              cursor: "pointer",
            }}
          >
            <X size={13} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  );
}
