"use client";

import { create } from "zustand";
import { generateId } from "@/types";
import type { Report } from "@/types";
import { routePrompt } from "@/lib/chat-router";
import { buildExplanation, requestText, type Explanation, type ExplainInput } from "@/lib/explain";
import { useUIStore } from "./ui.store";
import { latency } from "./latency";

/* Chat state — the conversation surface shared by the full-page chat and the
   right-docked assistant (same store, two frames, like Tile vs MCP app). It's
   UI-ephemeral (not persisted through the data adapter); the reports a message
   references ARE adapter data and are resolved live by reportId. The simulated
   "thinking" latency lives here so the emblem can animate while it resolves. */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** an MCP app to render beneath the text (assistant only) */
  reportId?: string;
  /** a scoped "Explain this" reasoning card (assistant only) */
  explanation?: Explanation;
  createdAt: number;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  threads: ChatThread[];
  activeThreadId: string | null;
  thinking: boolean;

  newThread: () => string;
  selectThread: (id: string) => void;
  sendMessage: (text: string, reports: Report[]) => Promise<void>;
  /** "Explain this" — opens the dock and drops a scoped reasoning turn. */
  explain: (input: ExplainInput) => Promise<void>;
}

const NEW_TITLE = "New chat";

/* A handful of realistic prior conversations so the Recent rail is populated
   on first load. Bound to stable seed report ids (see reports.seed.ts). */
function seedThreads(): ChatThread[] {
  const now = Date.now();
  const mk = (minsAgo: number, title: string, q: string, a: string, reportId: string): ChatThread => {
    const t0 = now - minsAgo * 60_000;
    return {
      id: generateId(),
      title,
      createdAt: t0,
      updatedAt: t0 + 20_000,
      messages: [
        { id: generateId(), role: "user", text: q, createdAt: t0 },
        { id: generateId(), role: "assistant", text: a, reportId, createdAt: t0 + 20_000 },
      ],
    };
  };
  return [
    mk(38, "Book concentration by class", "Where is my book most concentrated by asset class?", "Your book leans on residential and office. Here's book value by class — that's where a concentration limit would bite first.", "rep-value-by-class"),
    mk(126, "Stale valuations review", "How many valuations are stale, and where?", "1,233 appraisals are past 24 months. They cluster in the darker cells of this class × age heatmap.", "rep-staleness"),
    mk(210, "Risk watchlist walkthrough", "Walk me through the current risk watchlist.", "Here's the watchlist scored 0–100 with reasons. The top entries pair a stale valuation with thin comps.", "rep-watchlist"),
    mk(1440, "Cap rate by vintage", "Show me cap rate by vintage.", "Newer assets are pricing tighter; older bands carry wider yields. Here's the breakdown.", "rep-cap-by-vintage"),
    mk(2880, "Flood-zone exposure", "What's our exposure by flood zone?", "Here's book value by FEMA zone — the AE and VE buckets are the ones a lender covenant usually watches.", "rep-flood"),
  ];
}

function emptyThread(): ChatThread {
  const now = Date.now();
  return { id: generateId(), title: NEW_TITLE, messages: [], createdAt: now, updatedAt: now };
}

function initialThreads(): { threads: ChatThread[]; activeId: string } {
  const fresh = emptyThread();
  return { threads: [fresh, ...seedThreads()], activeId: fresh.id };
}

const { threads: _threads, activeId: _activeId } = initialThreads();

export const useChatStore = create<ChatState>((set, get) => ({
  threads: _threads,
  activeThreadId: _activeId,
  thinking: false,

  newThread: () => {
    // reuse the current thread if it's already an untouched "New chat"
    const active = get().threads.find((t) => t.id === get().activeThreadId);
    if (active && active.messages.length === 0) return active.id;
    const t = emptyThread();
    set((s) => ({ threads: [t, ...s.threads], activeThreadId: t.id }));
    return t.id;
  },

  selectThread: (id) => set({ activeThreadId: id }),

  sendMessage: async (text, reports) => {
    const clean = text.trim();
    if (!clean || get().thinking) return;

    // ensure an active thread
    let activeId = get().activeThreadId;
    if (!activeId || !get().threads.some((t) => t.id === activeId)) {
      const t = emptyThread();
      set((s) => ({ threads: [t, ...s.threads] }));
      activeId = t.id;
      set({ activeThreadId: activeId });
    }

    const now = Date.now();
    const userMsg: ChatMessage = { id: generateId(), role: "user", text: clean, createdAt: now };

    // append user message + title the thread from its first question
    set((s) => ({
      threads: s.threads.map((t) => {
        if (t.id !== activeId) return t;
        const title = t.messages.length === 0 || t.title === NEW_TITLE ? deriveTitle(clean) : t.title;
        return { ...t, title, messages: [...t.messages, userMsg], updatedAt: now };
      }),
      thinking: true,
    }));

    // simulate the agent "thinking" (a touch heavier than a data read)
    await latency(1150, 350);

    const { report, preamble } = routePrompt(clean, reports);
    const aiMsg: ChatMessage = {
      id: generateId(),
      role: "assistant",
      text: preamble,
      reportId: report?.id,
      createdAt: Date.now(),
    };

    set((s) => ({
      threads: s.threads.map((t) => (t.id === activeId ? { ...t, messages: [...t.messages, aiMsg], updatedAt: Date.now() } : t)),
      thinking: false,
    }));
  },

  explain: async (input) => {
    if (get().thinking) return;

    // summon the docked assistant, scoped to what was selected
    useUIStore.getState().openChat(input.contextLabel ?? "Explain this");

    // ensure an active thread
    let activeId = get().activeThreadId;
    if (!activeId || !get().threads.some((t) => t.id === activeId)) {
      const t = emptyThread();
      set((s) => ({ threads: [t, ...s.threads] }));
      activeId = t.id;
      set({ activeThreadId: activeId });
    }

    const now = Date.now();
    const userMsg: ChatMessage = { id: generateId(), role: "user", text: requestText(input.kind, input.text), createdAt: now };
    set((s) => ({
      threads: s.threads.map((t) => {
        if (t.id !== activeId) return t;
        const title = t.messages.length === 0 || t.title === NEW_TITLE ? deriveTitle(userMsg.text) : t.title;
        return { ...t, title, messages: [...t.messages, userMsg], updatedAt: now };
      }),
      thinking: true,
    }));

    await latency(1150, 350);

    const explanation = buildExplanation(input);
    const aiMsg: ChatMessage = { id: generateId(), role: "assistant", text: "", explanation, createdAt: Date.now() };
    set((s) => ({
      threads: s.threads.map((t) => (t.id === activeId ? { ...t, messages: [...t.messages, aiMsg], updatedAt: Date.now() } : t)),
      thinking: false,
    }));
  },
}));

function deriveTitle(text: string): string {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > 42 ? t.slice(0, 42).trimEnd() + "…" : t;
}
