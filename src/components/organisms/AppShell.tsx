"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppNav } from "./AppNav";
import { TopBar } from "./TopBar";
import { CoWorkingChat } from "./CoWorkingChat";
import { PageTransition } from "./PageTransition";
import { SettingsModal } from "./SettingsModal";
import { ExplainLayer } from "./ExplainLayer";
import { SummonButton } from "@/components/molecules/SummonButton";
import { useUIStore } from "@/store/ui.store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const chatOpen = useUIStore((s) => s.chatOpen);
  const toggleChat = useUIStore((s) => s.toggleChat);
  const pathname = usePathname();
  const isFullChat = pathname.startsWith("/chat");

  // ⌘K / Ctrl-K summons the co-working assistant.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleChat();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleChat]);

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

      {/* Global "Explain this" driver — select-to-explain + right-click, everywhere. */}
      {!isFullChat && <ExplainLayer />}

      {/* Floating summon on every page except the full-page chat, and only when the dock is closed. */}
      {!isFullChat && !chatOpen && <SummonButton variant="fab" />}
    </div>
  );
}
