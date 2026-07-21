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

  // reflect the drill-down in the top-bar breadcrumb (Properties › {name})
  const selectedName = data.selected?.property.name ?? null;
  useEffect(() => {
    setCrumb(selectedName);
    return () => setCrumb(null);
  }, [selectedName, setCrumb]);

  return (
    <PropertyWorkspaceTemplate
      data={data}
      view={view}
      onViewChange={setView}
      onAskAbout={(context) => openChat(context)}
    />
  );
}
