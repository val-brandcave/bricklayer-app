"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useChatStore, useReportStore } from "@/store";
import type { ChatMessage, ChatThread } from "@/store";
import type { Report } from "@/types";

/** A chat message with its MCP-app report resolved live from the reports store. */
export interface ResolvedMessage extends ChatMessage {
  report: Report | null;
}

export interface ResolvedThread extends Omit<ChatThread, "messages"> {
  messages: ResolvedMessage[];
}

/* Page hook for the chat surfaces (full-page + docked). Bridges the chat store
   (conversation/threads/thinking) to the reports store (so a message's reportId
   resolves to a live Report the Widget can render). Owns the thread-search box
   state. Store-only imports (never the adapter). */
export function useChat() {
  const threads = useChatStore((s) => s.threads);
  const activeThreadId = useChatStore((s) => s.activeThreadId);
  const thinking = useChatStore((s) => s.thinking);
  const newThreadRaw = useChatStore((s) => s.newThread);
  const selectThread = useChatStore((s) => s.selectThread);
  const sendMessageRaw = useChatStore((s) => s.sendMessage);

  const reports = useReportStore((s) => s.reports);
  const repLoaded = useReportStore((s) => s.loaded);
  const fetchReports = useReportStore((s) => s.fetchReports);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!repLoaded) fetchReports();
  }, [repLoaded, fetchReports]);

  const reportById = useMemo(() => {
    const m = new Map<string, Report>();
    reports.forEach((r) => m.set(r.id, r));
    return m;
  }, [reports]);

  const resolve = useCallback(
    (msgs: ChatMessage[]): ResolvedMessage[] => msgs.map((m) => ({ ...m, report: m.reportId ? reportById.get(m.reportId) ?? null : null })),
    [reportById],
  );

  // threads for the rail: most-recent first, filtered by the search box
  const recentThreads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...threads]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .filter((t) => !q || t.title.toLowerCase().includes(q) || t.messages.some((m) => m.text.toLowerCase().includes(q)));
  }, [threads, search]);

  const activeThread = useMemo<ResolvedThread | null>(() => {
    const t = threads.find((x) => x.id === activeThreadId);
    if (!t) return null;
    return { ...t, messages: resolve(t.messages) };
  }, [threads, activeThreadId, resolve]);

  const sendMessage = useCallback((text: string) => sendMessageRaw(text, reports), [sendMessageRaw, reports]);
  const newThread = useCallback(() => newThreadRaw(), [newThreadRaw]);

  const isEmpty = !activeThread || activeThread.messages.length === 0;

  return {
    recentThreads,
    activeThread,
    activeThreadId,
    thinking,
    isEmpty,
    search,
    setSearch,
    sendMessage,
    newThread,
    selectThread,
  } as const;
}

export type UseChat = ReturnType<typeof useChat>;
