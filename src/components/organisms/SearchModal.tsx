"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Building2, CornerDownLeft, FileBarChart2, LayoutDashboard, Lightbulb } from "lucide-react";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { SearchSpark } from "@/components/atoms/SearchSpark";
import { CHAT_SUGGESTIONS } from "@/components/molecules/ChatSuggestions";
import { useUIStore } from "@/store/ui.store";
import { useReportStore, useDashboardStore, usePropertyStore } from "@/store";
import { useChat } from "@/hooks/useChat";
import { EASE } from "@/lib/motion";

interface Hit {
  id: string;
  label: string;
  sub?: string;
  icon: typeof Building2;
  href: string;
}

const PER_GROUP = 4;

/* SearchModal — the app's command palette (⌘K, or the top-bar Search button).
   Hybrid: it searches the book normally (properties · reports · dashboards) AND
   offers the AI path — "Ask Bricklayer" escalates the query into the co-working
   copilot as a new thread. Empty state suggests natural-language prompts. */
export function SearchModal() {
  const open = useUIStore((s) => s.commandOpen);
  const setOpen = useUIStore((s) => s.setCommandOpen);
  const openChat = useUIStore((s) => s.openChat);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");

  const { sendMessage, newThread } = useChat();

  const properties = usePropertyStore((s) => s.properties);
  const propsLoaded = usePropertyStore((s) => s.loaded);
  const fetchProps = usePropertyStore((s) => s.fetchAll);
  const reports = useReportStore((s) => s.reports);
  const repLoaded = useReportStore((s) => s.loaded);
  const fetchReports = useReportStore((s) => s.fetchReports);
  const dashboards = useDashboardStore((s) => s.dashboards);
  const dashLoaded = useDashboardStore((s) => s.loaded);
  const fetchDashboards = useDashboardStore((s) => s.fetchDashboards);

  // load the searchable book the first time the palette opens
  useEffect(() => {
    if (!open) return;
    if (!propsLoaded) fetchProps();
    if (!repLoaded) fetchReports();
    if (!dashLoaded) fetchDashboards();
  }, [open, propsLoaded, repLoaded, dashLoaded, fetchProps, fetchReports, fetchDashboards]);

  // focus + reset on open
  useEffect(() => {
    if (open) {
      setQ("");
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const query = q.trim().toLowerCase();

  const groups = useMemo(() => {
    if (!query) return [] as { key: string; label: string; hits: Hit[] }[];
    const propHits: Hit[] = properties
      .filter((p) => `${p.name} ${p.address} ${p.city} ${p.state}`.toLowerCase().includes(query))
      .slice(0, PER_GROUP)
      .map((p) => ({ id: p.id, label: p.name, sub: `${p.city}, ${p.state}`, icon: Building2, href: "/properties" }));
    const repHits: Hit[] = reports
      .filter((r) => r.title.toLowerCase().includes(query))
      .slice(0, PER_GROUP)
      .map((r) => ({ id: r.id, label: r.title, icon: FileBarChart2, href: "/reports" }));
    const dashHits: Hit[] = dashboards
      .filter((d) => d.name.toLowerCase().includes(query))
      .slice(0, PER_GROUP)
      .map((d) => ({ id: d.id, label: d.name, icon: LayoutDashboard, href: "/dashboards" }));
    return [
      { key: "properties", label: "Properties", hits: propHits },
      { key: "reports", label: "Reports", hits: repHits },
      { key: "dashboards", label: "Dashboards", hits: dashHits },
    ].filter((g) => g.hits.length > 0);
  }, [query, properties, reports, dashboards]);

  const close = () => setOpen(false);

  const ask = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    newThread();
    sendMessage(clean);
    openChat(); // opens the docked copilot (no-op visual on /chat, where the full page shows it)
    close();
  };

  const go = (href: string) => {
    router.push(href);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "Enter" && q.trim()) { e.preventDefault(); ask(q); }
  };

  const hasResults = groups.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onMouseDown={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "14vh 20px 20px",
            background: "color-mix(in srgb, var(--brand-ink) 42%, transparent)",
            backdropFilter: "blur(4px)",
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE.out }}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            style={{
              width: "min(640px, 100%)",
              maxHeight: "72vh",
              display: "flex",
              flexDirection: "column",
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-lg)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            {/* input row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 16px", height: 56, flex: "none", borderBottom: "1px solid var(--hairline)", color: "var(--muted)" }}>
              <SearchSpark size={18} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search properties, reports, dashboards — or ask Bricklayer…"
                aria-label="Search or ask Bricklayer"
                style={{ flex: 1, minWidth: 0, height: "100%", border: "none", outline: "none", background: "transparent", color: "var(--ink)", font: "inherit", fontSize: 15 }}
              />
              <kbd style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: "var(--r-xs)", padding: "2px 7px", flexShrink: 0 }}>Esc</kbd>
            </div>

            {/* body */}
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "10px" }}>
              {/* primary AI action — always present */}
              <button type="button" onClick={() => ask(q || "")} disabled={!q.trim()} style={askRow(!!q.trim())}
                onMouseEnter={(e) => { if (q.trim()) e.currentTarget.style.background = "var(--surface-2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = q.trim() ? "var(--primary-soft)" : "transparent"; }}
              >
                <span style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: "var(--r-md)", background: "var(--primary)", color: "#fff", flex: "none" }}>
                  <EmblemMark size={18} tone="current" />
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 650, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {q.trim() ? <>Ask Bricklayer: <span style={{ color: "var(--primary)" }}>“{q.trim()}”</span></> : "Start a new chat with Bricklayer"}
                  </span>
                  <span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 1 }}>
                    {q.trim() ? "Reason across the whole book — answers come back as charts" : "Type a question, then press Enter"}
                  </span>
                </span>
                {q.trim() && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--muted)", flex: "none" }}>
                    <CornerDownLeft size={13} strokeWidth={2} /> Enter
                  </span>
                )}
              </button>

              {/* entity results (typing) */}
              {query && hasResults && groups.map((g) => (
                <div key={g.key} style={{ marginTop: 8 }}>
                  <GroupLabel>{g.label}</GroupLabel>
                  {g.hits.map((h) => (
                    <button key={h.id} type="button" onClick={() => go(h.href)} style={hitRow}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: "var(--r-md)", background: "var(--surface-3)", color: "var(--muted)", flex: "none" }}>
                        <h.icon size={16} strokeWidth={2} aria-hidden />
                      </span>
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ display: "block", fontSize: 13.5, fontWeight: 550, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.label}</span>
                        {h.sub && <span style={{ display: "block", fontSize: 12, color: "var(--muted)" }}>{h.sub}</span>}
                      </span>
                    </button>
                  ))}
                </div>
              ))}

              {query && !hasResults && (
                <p style={{ fontSize: 13, color: "var(--muted)", padding: "14px 12px 6px", margin: 0 }}>
                  No direct matches in the book — press <b style={{ color: "var(--ink)" }}>Enter</b> to ask Bricklayer instead.
                </p>
              )}

              {/* empty state — suggested prompts */}
              {!query && (
                <div style={{ marginTop: 8 }}>
                  <GroupLabel>Try searching</GroupLabel>
                  {CHAT_SUGGESTIONS.map((s) => (
                    <button key={s.label} type="button" onClick={() => ask(s.prompt)} style={hitRow}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: "var(--r-md)", background: "var(--surface-3)", color: "var(--muted)", flex: "none" }}>
                        <Lightbulb size={16} strokeWidth={2} aria-hidden />
                      </span>
                      <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--body)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--faint)", padding: "8px 12px 4px" }}>{children}</div>;
}

function askRow(active: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    textAlign: "left",
    padding: "11px 12px",
    borderRadius: "var(--r-md)",
    border: "1px solid " + (active ? "color-mix(in srgb, var(--primary) 40%, var(--hairline))" : "var(--hairline)"),
    background: active ? "var(--primary-soft)" : "transparent",
    color: "var(--ink)",
    font: "inherit",
    cursor: active ? "pointer" : "default",
    opacity: active ? 1 : 0.75,
    transition: "background var(--dur), border-color var(--dur)",
  };
}

const hitRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 11,
  width: "100%",
  textAlign: "left",
  padding: "8px 12px",
  borderRadius: "var(--r-md)",
  border: "none",
  background: "transparent",
  color: "var(--ink)",
  font: "inherit",
  cursor: "pointer",
  transition: "background var(--dur)",
};
