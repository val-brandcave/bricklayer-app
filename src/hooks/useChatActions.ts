"use client";

import { useCallback, useRef, useState } from "react";
import { useReportStore, useUIStore } from "@/store";
import { LENSES } from "@/lib/lenses";
import type { Report } from "@/types";
import type { ReportDraft } from "@/components/organisms/ReportBuilderModal";

/* Shared Save / Edit behaviour for the chat surfaces (full-page + docked). A
   chat-made MCP app can be saved to the report library as the user's own
   report, or forked into a new report through the shared editor. Owns the
   editor target and a transient confirmation toast. */
export function useChatActions() {
  const lens = useUIStore((s) => s.lens);
  const createReport = useReportStore((s) => s.createReport);

  const [editing, setEditing] = useState<Report | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((msg: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(msg);
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  // Bookmark a chat-made MCP app into Reports (as the user's own report).
  const saveReport = useCallback(
    (report: Report) => {
      const meta = LENSES[lens];
      createReport({
        title: report.title,
        subtitle: report.subtitle,
        widgetType: report.widgetType,
        dimensions: report.dimensions,
        measures: report.measures,
        dataKey: report.dataKey,
        ownerId: meta.userId,
        ownerName: meta.userName,
        origin: "user",
        tags: report.tags,
        lens,
        provenance: { label: "Saved from a chat" },
      });
      flash(`Saved “${report.title}” to Reports`);
    },
    [lens, createReport, flash],
  );

  // Edit forks the agent's view into a new report the user owns.
  const forkReport = useCallback(
    (draft: ReportDraft) => {
      const meta = LENSES[lens];
      createReport({
        title: draft.title,
        subtitle: draft.subtitle || undefined,
        widgetType: draft.widgetType,
        dimensions: [],
        measures: [],
        dataKey: draft.dataKey,
        ownerId: meta.userId,
        ownerName: meta.userName,
        origin: "user",
        tags: draft.tags,
        lens,
        provenance: { label: "Built from a chat" },
      });
      setEditing(null);
      flash(`Saved “${draft.title}” to Reports`);
    },
    [lens, createReport, flash],
  );

  return { lens, editing, openEdit: setEditing, closeEdit: () => setEditing(null), toast, flash, saveReport, forkReport } as const;
}
