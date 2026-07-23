"use client";

import { useEffect, useState } from "react";
import { PropertyWorkspaceTemplate } from "@/templates/PropertyWorkspaceTemplate";
import type { PropertyView } from "@/templates/PropertyWorkspaceTemplate";
import { useProperties } from "@/hooks/useProperties";
import { useUIStore } from "@/store";

/* Properties — the individual-asset altitude. Browse the book (sortable table
   or cards), then drill into a property's full-width workspace: KPIs, the
   latest-appraisal evidence, and per-property valuation widgets. */
export default function PropertiesPage() {
  const data = useProperties();
  const [view, setView] = useState<PropertyView>("table");
  const openChat = useUIStore((s) => s.openChat);
  const setCrumb = useUIStore((s) => s.setCrumb);
  const setCrumbBack = useUIStore((s) => s.setCrumbBack);

  // Reflect the drill-down in the top-bar breadcrumb (Properties › {name}) and
  // register the way back: the breadcrumb's "Properties" base deselects.
  const selectedName = data.selected?.property.name ?? null;
  const select = data.select;
  useEffect(() => {
    setCrumb(selectedName);
    setCrumbBack(selectedName ? () => select(null) : null);
    return () => {
      setCrumb(null);
      setCrumbBack(null);
    };
  }, [selectedName, setCrumb, setCrumbBack, select]);

  return (
    <PropertyWorkspaceTemplate
      data={data}
      view={view}
      onViewChange={setView}
      onAskAbout={(context) => openChat(context)}
    />
  );
}
