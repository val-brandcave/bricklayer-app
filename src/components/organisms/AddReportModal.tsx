"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { Modal } from "@/components/molecules/Modal";
import { SearchField } from "@/components/molecules/SearchField";
import { Pill } from "@/components/atoms/Pill";
import { WIDGET_GLYPH } from "@/lib/widget-glyphs";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { Report } from "@/types";

export interface AddReportModalProps {
  open: boolean;
  onClose: () => void;
  reports: Report[];
  /** reportIds already on the board — shown as "added" */
  presentIds: Set<string>;
  onAdd: (reportId: string) => void;
}

/* AddReportModal — pick a saved Report to drop onto the current dashboard as a
   Tile. Search-filterable; reports already on the board read as added. */
export function AddReportModal({ open, onClose, reports, presentIds, onAdd }: AddReportModalProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...reports].sort((a, b) => a.title.localeCompare(b.title));
    if (!q) return sorted;
    return sorted.filter((r) => r.title.toLowerCase().includes(q) || r.tags.some((t) => t.includes(q)) || r.widgetType.includes(q));
  }, [reports, query]);

  return (
    <Modal open={open} onClose={onClose} title="Add a report" subtitle="Drop a saved report onto this dashboard as a tile." width={620}>
      <div style={{ marginBottom: "var(--s-4)" }}>
        <SearchField value={query} onChange={setQuery} placeholder="Search reports by name, type, or tag…" ariaLabel="Search reports" />
      </div>

      <motion.ul variants={staggerContainer} initial="hidden" animate="visible" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((r) => {
          const glyph = WIDGET_GLYPH[r.widgetType];
          const Glyph = glyph.icon;
          const added = presentIds.has(r.id);
          return (
            <motion.li key={r.id} variants={fadeUp}>
              <button
                type="button"
                onClick={() => !added && onAdd(r.id)}
                disabled={added}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--hairline)",
                  background: "var(--surface)",
                  cursor: added ? "default" : "pointer",
                  textAlign: "left",
                  transition: "background var(--dur), border-color var(--dur)",
                }}
                onMouseEnter={(e) => !added && (e.currentTarget.style.background = "var(--surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
              >
                <span style={{ display: "grid", placeItems: "center", width: 34, height: 34, flexShrink: 0, borderRadius: "var(--r-sm)", background: "var(--surface-3)", color: "var(--body)" }}>
                  <Glyph size={17} strokeWidth={2} aria-hidden />
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</span>
                  <span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    {glyph.label} · {r.ownerName}
                  </span>
                </span>
                {r.origin === "ai" && <Pill tone="primary" size="sm">AI</Pill>}
                <span style={{ display: "grid", placeItems: "center", width: 26, height: 26, flexShrink: 0, borderRadius: "var(--r-sm)", color: added ? "var(--success)" : "var(--primary)" }}>
                  {added ? <Check size={17} strokeWidth={2.4} /> : <Plus size={17} strokeWidth={2.2} />}
                </span>
              </button>
            </motion.li>
          );
        })}
        {filtered.length === 0 && (
          <li style={{ padding: "var(--s-8)", textAlign: "center", color: "var(--muted)", fontSize: 13.5 }}>No reports match “{query}”.</li>
        )}
      </motion.ul>
    </Modal>
  );
}
