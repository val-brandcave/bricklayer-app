"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Database, Info, Moon, Palette, Settings2, Sun, UserRound, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { LENSES } from "@/lib/lenses";
import { fade, scaleIn } from "@/lib/motion";

/* Settings — a tabbed modal launched from the profile menu (Val's chosen model:
   a modal with left-nav, not a rail destination). Keeps the five destinations
   clean and scales if settings grow. Theme is a real control; other rows are
   demo placeholders and labelled as such. */

type TabId = "general" | "appearance" | "account" | "data" | "about";
const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "account", label: "Account", icon: UserRound },
  { id: "data", label: "Data", icon: Database },
  { id: "about", label: "About", icon: Info },
];

export function SettingsModal() {
  const open = useUIStore((s) => s.settingsOpen);
  const setOpen = useUIStore((s) => s.setSettingsOpen);
  const [tab, setTab] = useState<TabId>("general");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseDown={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            display: "grid",
            placeItems: "center",
            padding: "var(--s-6)",
            background: "color-mix(in srgb, var(--brand-ink) 55%, transparent)",
            backdropFilter: "blur(3px)",
          }}
          aria-hidden={false}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
            variants={scaleIn}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: "min(760px, 100%)",
              height: "min(560px, 88vh)",
              display: "grid",
              gridTemplateColumns: "196px 1fr",
              background: "var(--surface)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-xl)",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            {/* left nav */}
            <aside
              style={{
                background: "var(--surface-2)",
                borderRight: "1px solid var(--hairline)",
                padding: "var(--s-5) var(--s-3)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <h2 style={{ fontSize: 16, margin: "0 0 var(--s-4) 10px" }}>Settings</h2>
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = id === tab;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: "var(--r-md)",
                      border: "none",
                      cursor: "pointer",
                      font: "inherit",
                      fontSize: 13.5,
                      fontWeight: active ? 600 : 500,
                      textAlign: "left",
                      color: active ? "var(--primary)" : "var(--body)",
                      background: active ? "var(--primary-soft)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "var(--surface-3)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Icon size={16} strokeWidth={2} /> {label}
                  </button>
                );
              })}
            </aside>

            {/* content */}
            <section style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <header
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "var(--s-4) var(--s-5)",
                  borderBottom: "1px solid var(--hairline-2)",
                }}
              >
                <h3 style={{ margin: 0, fontSize: 16 }}>{TABS.find((t) => t.id === tab)?.label}</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close settings"
                  autoFocus
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--hairline)",
                    background: "var(--surface)",
                    color: "var(--muted)",
                    cursor: "pointer",
                  }}
                >
                  <X size={16} />
                </button>
              </header>

              <div style={{ padding: "var(--s-5)", overflowY: "auto", flex: 1 }}>
                <TabBody tab={tab} />
              </div>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--s-4)",
        padding: "var(--s-4) 0",
        borderBottom: "1px solid var(--hairline-2)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{label}</div>
        {hint && <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ flex: "none" }}>{children}</div>
    </div>
  );
}

function Placeholder() {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "var(--faint)",
        border: "1px dashed var(--border-strong)",
        borderRadius: "var(--r-pill)",
        padding: "3px 9px",
      }}
    >
      demo
    </span>
  );
}

function TabBody({ tab }: { tab: TabId }) {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const lens = useUIStore((s) => s.lens);
  const user = LENSES[lens];

  if (tab === "appearance") {
    return (
      <>
        <Row label="Theme" hint="Light or dark. Persists on this device.">
          <div style={{ display: "flex", gap: 6, background: "var(--surface-2)", padding: 4, borderRadius: "var(--r-md)" }}>
            {(["light", "dark"] as const).map((t) => {
              const on = theme === t;
              const Icon = t === "light" ? Sun : Moon;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "6px 12px",
                    borderRadius: "var(--r-sm)",
                    border: "none",
                    cursor: "pointer",
                    font: "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform: "capitalize",
                    color: on ? "var(--on-primary)" : "var(--body)",
                    background: on ? "var(--primary)" : "transparent",
                  }}
                >
                  <Icon size={15} /> {t}
                </button>
              );
            })}
          </div>
        </Row>
        <Row label="Density" hint="Comfortable spacing vs. compact data tables.">
          <Placeholder />
        </Row>
        <Row label="Motion" hint="Follows your system reduced-motion preference.">
          <Placeholder />
        </Row>
      </>
    );
  }

  if (tab === "account") {
    return (
      <>
        <Row label="Name">
          <span style={{ fontSize: 14, color: "var(--ink)" }}>{user.userName}</span>
        </Row>
        <Row label="Role (lens)" hint="Set at provisioning in the real product.">
          <span style={{ fontSize: 14, color: "var(--ink)" }}>{user.title}</span>
        </Row>
        <Row label="Email">
          <Placeholder />
        </Row>
      </>
    );
  }

  if (tab === "data") {
    return (
      <>
        <Row label="Data source" hint="This demo runs entirely on mock data behind the adapter.">
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--success)",
              background: "var(--success-soft)",
              padding: "3px 10px",
              borderRadius: "var(--r-pill)",
            }}
          >
            mock
          </span>
        </Row>
        <Row label="Book snapshot" hint="Seeded fixtures from the discovery book.">
          <span className="tnum" style={{ fontSize: 14, color: "var(--ink)" }}>
            3,935 appraisals
          </span>
        </Row>
        <Row label="Reset demo data" hint="Re-seed local storage to the shipped fixtures.">
          <Placeholder />
        </Row>
      </>
    );
  }

  if (tab === "about") {
    return (
      <div style={{ fontSize: 14, color: "var(--body)", lineHeight: 1.7 }}>
        <p style={{ marginTop: 0 }}>
          <strong style={{ color: "var(--ink)" }}>Bricklayer</strong> — appraisal intelligence for banks.
        </p>
        <p style={{ color: "var(--muted)" }}>
          Design-led demo shell · mock data · v0.2. Turns a bank&rsquo;s book of commercial-real-estate appraisals
          into a queryable data lake with dashboards and an analytics copilot.
        </p>
      </div>
    );
  }

  // general
  return (
    <>
      <Row label="Default landing" hint="Where the app opens. Follows your lens by default.">
        <Placeholder />
      </Row>
      <Row label="Number format" hint="Regional formatting for figures.">
        <span style={{ fontSize: 14, color: "var(--ink)" }}>en-US</span>
      </Row>
      <Row label="Keyboard shortcuts" hint="⌘K summons the assistant anywhere.">
        <Placeholder />
      </Row>
    </>
  );
}
