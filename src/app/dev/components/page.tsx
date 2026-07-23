"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, Download, Filter, Plus, TrendingUp } from "lucide-react";
import {
  Button,
  Icon,
  Input,
  KpiValue,
  Pill,
  ProvenanceLine,
  Skeleton,
  SkeletonText,
} from "@/components/atoms";
import {
  ChartFrame,
  DimensionChip,
  FindingCardHeader,
  SearchField,
  StatTile,
} from "@/components/molecules";
import { staggerContainer } from "@/lib/motion";

/* DEV-ONLY component gallery — visual verification of the Phase 2 design
   system (atoms + molecules) in both themes, including loading/skeleton
   states. Not part of the product IA; safe to delete before ship. */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "var(--s-12)" }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: "var(--s-4)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

const row: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "var(--s-3)", alignItems: "center" };

const SAMPLE_PROV = { label: "Derived from 3,935 appraisals", sourceRef: "Book snapshot", asOf: Date.now() };

export default function ComponentGalleryPage() {
  // Dev-only QA gallery — hidden (404) in production so it never ships on a demo link.
  if (process.env.NODE_ENV === "production") notFound();
  const [loading, setLoading] = useState(false);
  const [chips, setChips] = useState(["Asset class", "Vintage", "Cap rate"]);
  const [active, setActive] = useState<string | null>("Asset class");
  const [query, setQuery] = useState("");

  const simulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2200);
  };

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "var(--s-10) var(--s-8) var(--s-16)" }}>
      <header style={{ marginBottom: "var(--s-10)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--s-4)", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 28, marginBottom: 6 }}>Component gallery</h1>
          <p style={{ color: "var(--muted)", fontSize: 15 }}>
            Phase 2 atoms & molecules — dev-only. Toggle the theme (top bar) and simulate loading to see skeletons.
          </p>
        </div>
        <Button variant="gradient" iconLeft={TrendingUp} onClick={simulate} loading={loading}>
          Simulate loading
        </Button>
      </header>

      <Section title="Buttons">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
          <div style={row}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="gradient" iconLeft={Plus}>Gradient (hero)</Button>
          </div>
          <div style={row}>
            <Button size="sm" iconRight={ArrowRight}>Small</Button>
            <Button size="md" iconLeft={Download}>Medium</Button>
            <Button size="lg">Large</Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Section>

      <Section title="Inputs & search">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--s-4)" }}>
          <Input label="Report title" placeholder="Avg cap rate by vintage" hint="Shown on the dashboard tile" />
          <Input label="Threshold" placeholder="0" iconLeft={Filter} defaultValue="72" />
          <Input label="With error" defaultValue="—" error="Enter a value between 0 and 100" />
          <div style={{ alignSelf: "end" }}>
            <SearchField value={query} onChange={setQuery} placeholder="Search properties…" />
          </div>
        </div>
      </Section>

      <Section title="Pills & badges">
        <div style={row}>
          <Pill tone="neutral">Neutral</Pill>
          <Pill tone="primary" dot>Primary</Pill>
          <Pill tone="success" dot>Fresh</Pill>
          <Pill tone="warning" dot>Aging</Pill>
          <Pill tone="danger" dot>Stale</Pill>
          <Pill tone="info">Income approach</Pill>
        </div>
      </Section>

      <Section title="KPI value (count-up)">
        <div style={{ display: "flex", gap: "var(--s-10)", flexWrap: "wrap", alignItems: "baseline" }}>
          <KpiValue value={6.51} prefix="$" suffix="B" decimals={2} size={44} />
          <KpiValue value={3935} size={44} color="var(--primary)" />
          <KpiValue value={62.4} suffix="%" decimals={1} size={44} />
        </div>
      </Section>

      <Section title="Stat tiles">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--s-4)" }}
        >
          <StatTile inStagger label="Book value" value={6.51} prefix="$" suffix="B" decimals={2} icon={Building2} delta={{ direction: "up", value: "2.4%" }} caption="Across 3,935 appraisals" loading={loading} />
          <StatTile inStagger label="Stale valuations" value={1233} icon={TrendingUp} delta={{ direction: "up", value: "118", goodWhenUp: false }} caption="Aged over 24 months" loading={loading} />
          <StatTile inStagger label="Avg cap rate" value={6.18} suffix="%" decimals={2} delta={{ direction: "down", value: "0.12" }} caption="Weighted by book value" loading={loading} />
          <StatTile inStagger label="Data health" value={94.2} suffix="%" decimals={1} delta={{ direction: "flat", value: "0.0" }} caption="Extraction confidence" loading={loading} />
        </motion.div>
      </Section>

      <Section title="Chart frame (tile / MCP app) & skeleton">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--s-5)" }}>
          <ChartFrame
            title="Avg cap rate by vintage"
            subtitle="Weighted, last 8 vintages"
            frame="tile"
            loading={loading}
            provenance={SAMPLE_PROV}
            actions={<Icon icon={Filter} size="sm" tone="muted" />}
            bodyHeight={200}
          >
            <div style={{ display: "grid", placeItems: "center", height: 200, color: "var(--faint)", fontSize: 13 }}>
              [ chart mounts here in Phase 3 ]
            </div>
          </ChartFrame>

          <ChartFrame
            title="Avg cap rate by vintage"
            subtitle="Rendered as an MCP app in chat"
            frame="mcp"
            loading={loading}
            provenance={SAMPLE_PROV}
            bodyHeight={200}
            footer={
              <>
                <Button size="sm" variant="ghost">Edit</Button>
                <Button size="sm" variant="primary">Save</Button>
              </>
            }
          >
            <div style={{ display: "grid", placeItems: "center", height: 200, color: "var(--faint)", fontSize: 13 }}>
              [ same report, chat frame ]
            </div>
          </ChartFrame>
        </div>
      </Section>

      <Section title="Dimension chips (add / remove)">
        <div style={{ ...row }}>
          <AnimatePresence mode="popLayout">
            {chips.map((c) => (
              <DimensionChip
                key={c}
                label={c}
                active={active === c}
                onClick={() => setActive(active === c ? null : c)}
                onRemove={() => setChips((prev) => prev.filter((x) => x !== c))}
              />
            ))}
          </AnimatePresence>
          <Button
            size="sm"
            variant="secondary"
            iconLeft={Plus}
            onClick={() => setChips((prev) => [...prev, `Field ${prev.length + 1}`])}
          >
            Add
          </Button>
        </div>
      </Section>

      <Section title="Finding card header (Insights)">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
          {([
            { title: "Residential is 25% of the book — a $1.55B concentration", kind: "concentration", severity: "high", link: false },
            { title: "1,233 valuations have aged past 24 months", kind: "staleness", severity: "watch", link: false },
            { title: "Flood-zone AE tracks appraiser workload — an unexpected link", kind: "correlation", severity: "watch", link: true },
          ] as const).map((f) => (
            <div key={f.title} style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", boxShadow: "var(--shadow-sm)" }}>
              <FindingCardHeader title={f.title} kind={f.kind} severity={f.severity} origin={f.link ? "discovered" : "curated"} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skeleton primitives">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--s-5)" }}>
          <div style={{ display: "flex", gap: "var(--s-3)", alignItems: "center" }}>
            <Skeleton shape="circle" width={44} height={44} />
            <div style={{ flex: 1 }}><SkeletonText lines={2} /></div>
          </div>
          <div><SkeletonText lines={3} /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <Skeleton shape="pill" width={70} height={22} />
            <Skeleton shape="pill" width={54} height={22} />
            <Skeleton shape="pill" width={88} height={22} />
          </div>
        </div>
      </Section>
    </div>
  );
}
