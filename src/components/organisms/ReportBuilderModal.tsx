"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Modal } from "@/components/molecules/Modal";
import { Widget } from "./Widget";
import { WIDGET_GLYPH } from "@/lib/widget-glyphs";
import { DATA_SOURCES } from "@/lib/data-sources";
import type { DataSeriesKey, Lens, Report, WidgetType } from "@/types";
import { LENSES } from "@/lib/lenses";

export interface ReportBuilderModalProps {
  open: boolean;
  onClose: () => void;
  /** the report to edit; omit for a brand-new report */
  report?: Report | null;
  lens: Lens;
  onSave: (draft: ReportDraft, existingId: string | null) => void;
}

export interface ReportDraft {
  title: string;
  subtitle: string;
  widgetType: WidgetType;
  dataKey: DataSeriesKey;
  tags: string[];
}

const WIDGET_ORDER: WidgetType[] = ["kpi", "gauge", "bar", "hbar", "line", "area", "pie", "donut", "scatter", "heatmap", "table", "map", "watchlist", "scenario"];

/* ReportBuilderModal — the one shared editor for creating/editing a Report,
   reached from Dashboards, Reports and Chat (never trapped in a drawer, per
   CLAUDE.md). Pick a widget type + data source, name it, tag it — the live
   preview is the same Widget the tile/MCP app render. */
export function ReportBuilderModal({ open, onClose, report, lens, onSave }: ReportBuilderModalProps) {
  const [draft, setDraft] = useState<ReportDraft>(() => initial(report));

  // reset the draft whenever the target report (or new/edit mode) changes
  useEffect(() => {
    if (open) setDraft(initial(report));
  }, [open, report]);

  const set = <K extends keyof ReportDraft>(k: K, v: ReportDraft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const previewReport = useMemo<Report>(() => {
    const meta = LENSES[lens];
    return {
      id: report?.id ?? "draft",
      title: draft.title || "Untitled report",
      subtitle: draft.subtitle || undefined,
      widgetType: draft.widgetType,
      dimensions: report?.dimensions ?? [],
      measures: report?.measures ?? [],
      dataKey: draft.dataKey,
      ownerId: report?.ownerId ?? meta.userId,
      ownerName: report?.ownerName ?? meta.userName,
      origin: report?.origin ?? "user",
      tags: draft.tags,
      lens,
      provenance: report?.provenance ?? { label: "Draft — not yet saved" },
      createdAt: report?.createdAt ?? 0,
    };
  }, [draft, report, lens]);

  const canSave = draft.title.trim().length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={860}
      title={report ? "Edit report" : "New report"}
      subtitle="Choose a widget and a data source, then name it. The preview updates live."
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" disabled={!canSave} onClick={() => onSave(draft, report?.id ?? null)}>
            {report ? "Save changes" : "Create report"}
          </Button>
        </>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 320px) minmax(0, 1fr)", gap: "var(--s-5)" }}>
        {/* left: form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
          <Input label="Title" value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Cap rate by vintage" />
          <Input label="Subtitle" value={draft.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Optional context line" />

          <div>
            <FieldLabel>Widget type</FieldLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {WIDGET_ORDER.map((t) => {
                const Glyph = WIDGET_GLYPH[t].icon;
                const active = draft.widgetType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    title={WIDGET_GLYPH[t].label}
                    aria-label={WIDGET_GLYPH[t].label}
                    aria-pressed={active}
                    onClick={() => set("widgetType", t)}
                    style={{
                      display: "grid",
                      placeItems: "center",
                      aspectRatio: "1",
                      borderRadius: "var(--r-sm)",
                      border: `1px solid ${active ? "var(--primary)" : "var(--hairline)"}`,
                      background: active ? "var(--primary-soft)" : "var(--surface)",
                      color: active ? "var(--primary)" : "var(--muted)",
                      cursor: "pointer",
                    }}
                  >
                    <Glyph size={17} strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <FieldLabel>Data source</FieldLabel>
            <select
              value={draft.dataKey}
              onChange={(e) => set("dataKey", e.target.value as DataSeriesKey)}
              style={{
                width: "100%",
                height: 40,
                padding: "0 12px",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--border-strong)",
                background: "var(--surface)",
                color: "var(--ink)",
                font: "inherit",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {DATA_SOURCES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          <Input
            label="Tags"
            value={draft.tags.join(", ")}
            onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean))}
            hint="Comma-separated"
            placeholder="risk, overview"
          />
        </div>

        {/* right: live preview */}
        <div style={{ minWidth: 0 }}>
          <FieldLabel>Preview</FieldLabel>
          <div style={{ background: "var(--surface-2)", borderRadius: "var(--r-lg)", padding: "var(--s-4)", border: "1px solid var(--hairline)", minHeight: 320 }}>
            <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: "var(--s-2) var(--s-4)", boxShadow: "var(--shadow-sm)" }}>
              <Widget report={previewReport} frame="bare" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--body)", marginBottom: 8 }}>{children}</span>;
}

function initial(report?: Report | null): ReportDraft {
  return {
    title: report?.title ?? "",
    subtitle: report?.subtitle ?? "",
    widgetType: report?.widgetType ?? "bar",
    dataKey: report?.dataKey ?? "valueByClass",
    tags: report?.tags ?? [],
  };
}
