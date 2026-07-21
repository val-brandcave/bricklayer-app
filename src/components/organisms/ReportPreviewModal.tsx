"use client";

import { Check, LayoutDashboard, Pencil, Plus } from "lucide-react";
import { Modal } from "@/components/molecules/Modal";
import { Menu } from "@/components/molecules/Menu";
import { Button } from "@/components/atoms/Button";
import { Widget } from "./Widget";
import type { Dashboard, Report } from "@/types";

export interface ReportPreviewModalProps {
  report: Report | null;
  onClose: () => void;
  dashboards: Dashboard[];
  /** dashboardIds that already contain this report */
  containingIds: Set<string>;
  onAddToDashboard: (dashboardId: string) => void;
  onEdit: (report: Report) => void;
}

/* ReportPreviewModal — opens a saved report as a live Widget (bare frame) with
   actions to edit it or drop it onto one of the current lens's dashboards.
   The same Widget component the dashboard tile and chat MCP app use. */
export function ReportPreviewModal({ report, onClose, dashboards, containingIds, onAddToDashboard, onEdit }: ReportPreviewModalProps) {
  return (
    <Modal
      open={!!report}
      onClose={onClose}
      width={720}
      title={report?.title}
      subtitle={report ? `${report.ownerName} · ${report.origin === "ai" ? "AI-made" : report.origin === "starter" ? "Starter report" : "Your report"}` : undefined}
      footer={
        report && (
          <>
            <Menu
              align="end"
              width={260}
              items={
                dashboards.length
                  ? dashboards.map((d) => ({
                      label: d.name,
                      icon: containingIds.has(d.id) ? Check : Plus,
                      disabled: containingIds.has(d.id),
                      onClick: () => onAddToDashboard(d.id),
                    }))
                  : [{ label: "No dashboards for this lens yet", disabled: true }]
              }
              trigger={({ onClick, ref, ...aria }) => (
                <Button ref={ref} variant="secondary" size="md" iconLeft={LayoutDashboard} onClick={onClick} {...aria}>
                  Add to dashboard
                </Button>
              )}
            />
            <Button variant="primary" size="md" iconLeft={Pencil} onClick={() => onEdit(report)}>
              Edit report
            </Button>
          </>
        )
      }
    >
      {report && (
        <div style={{ background: "var(--surface-2)", borderRadius: "var(--r-lg)", padding: "var(--s-4)", border: "1px solid var(--hairline)" }}>
          <div style={{ background: "var(--surface)", borderRadius: "var(--r-md)", padding: "var(--s-2) var(--s-4)", boxShadow: "var(--shadow-sm)" }}>
            <Widget report={report} frame="bare" />
          </div>
        </div>
      )}
    </Modal>
  );
}
