"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppNav } from "./AppNav";
import { TopBar } from "./TopBar";
import { CoWorkingChat } from "./CoWorkingChat";
import { PageTransition } from "./PageTransition";
import { SettingsModal } from "./SettingsModal";
import { SearchModal } from "./SearchModal";
import { ExplainLayer } from "./ExplainLayer";
import { useUIStore } from "@/store/ui.store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);
  const pathname = usePathname();
  const isFullChat = pathname.startsWith("/chat");

  // ⌘K / Ctrl-K opens the search / command palette (the shortcut is a standard
  // convention, so it stays unlabelled in the UI). The copilot has its own
  // summon: the "Ask Bricklayer" pill in the nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!useUIStore.getState().commandOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCommandOpen]);

  return (
    <div style={{ display: "flex", minHeight: "100dvh", background: "var(--canvas)" }}>
      <AppNav />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* top bar spans the full width above both the page and the dock */}
        <TopBar />
        {/* content row: page + inset co-working dock */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "flex-start" }}>
          <main style={{ flex: 1, minWidth: 0 }}>
            <PageTransition>{children}</PageTransition>
          </main>
          {/* The docked assistant is the companion to the full-page chat — never
              shown ON the full-page chat (that IS the destination). */}
          {!isFullChat && <CoWorkingChat />}
        </div>
      </div>

      <SettingsModal />

      {/* Search / command palette — global, reachable via the top-bar button or ⌘K. */}
      <SearchModal />

      {/* Global "Explain this" driver — select-to-explain + right-click, everywhere. */}
      {!isFullChat && <ExplainLayer />}
    </div>
  );
}
