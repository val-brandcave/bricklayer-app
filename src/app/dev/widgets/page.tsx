"use client";

import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/atoms";
import { Widget } from "@/components/organisms";
import { seedReports } from "@/data/seed/reports.seed";

/* Mount children only once they scroll near the viewport. This QA page holds
   ~38 charts; mounting every Recharts container at once thrashes the main
   thread. Lazy-mounting keeps only a handful live. Placeholder reserves height
   so there's no scroll jump. (Dev-only — not a product pattern.) */
function LazyMount({ minHeight, children }: { minHeight: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: show ? undefined : minHeight }}>
      {show ? children : null}
    </div>
  );
}

/* DEV-ONLY widget gallery — visual verification of the Phase 3 widget
   organisms. Every starter report is rendered as a dashboard Tile and as an
   in-chat MCP app (Save/Edit), in both themes (toggle in the top bar), with a
   simulated loading pass to check skeletons + no layout shift. Not part of the
   product IA; safe to delete before ship. */

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "var(--s-12)" }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 4 }}>
        {title}
      </h2>
      {hint && <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 var(--s-4)" }}>{hint}</p>}
      {children}
    </section>
  );
}

export default function WidgetGalleryPage() {
  // Dev-only QA gallery — hidden (404) in production so it never ships on a demo link.
  if (process.env.NODE_ENV === "production") notFound();
  const [loading, setLoading] = useState(false);

  const simulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2200);
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "var(--s-10) var(--s-8) var(--s-16)" }}>
      <header style={{ marginBottom: "var(--s-10)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--s-4)", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Widget gallery</h1>
          <p style={{ color: "var(--muted)", fontSize: 15, maxWidth: 620 }}>
            Phase 3 widget organisms — all {seedReports.length} starter reports, each as a dashboard Tile and an in-chat MCP
            app. Toggle the theme in the top bar; simulate loading to see skeletons resolve with no layout shift.
          </p>
        </div>
        <Button variant="gradient" iconLeft={RefreshCw} onClick={simulate} loading={loading}>
          Simulate loading
        </Button>
      </header>

      <Section title="Tiles" hint="A Report rendered on a dashboard (frame=tile).">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--s-5)", alignItems: "start" }}>
          {seedReports.map((r) => (
            <LazyMount key={r.id} minHeight={320}>
              <Widget report={r} frame="tile" loading={loading} />
            </LazyMount>
          ))}
        </div>
      </Section>

      <Section title="MCP apps" hint="The same Reports rendered in chat (frame=mcp) — soft primary border, Save / Edit footer.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 460px))", gap: "var(--s-5)", alignItems: "start" }}>
          {seedReports.map((r) => (
            <LazyMount key={r.id} minHeight={360}>
              <Widget
                report={r}
                frame="mcp"
                loading={loading}
                onSave={(rep) => console.log("[widgets] save", rep.id)}
                onEdit={(rep) => console.log("[widgets] edit", rep.id)}
              />
            </LazyMount>
          ))}
        </div>
      </Section>
    </div>
  );
}
