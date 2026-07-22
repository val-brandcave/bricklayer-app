"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { EmblemMark } from "@/components/atoms/EmblemMark";
import { ContextMenu, type ContextMenuItem } from "@/components/molecules/ContextMenu";
import { useChatStore } from "@/store/chat.store";
import { ctaLabelFor, type ExplainKind } from "@/lib/explain";
import { DUR, EASE } from "@/lib/motion";

/* ExplainLayer — the global "Explain this" driver (roadmap 1b). Any element
   tagged with data-kind (property | number | category | claim) becomes
   explainable two ways:
   • select-to-explain — highlight text inside it → a floating ✦ chip with an
     adaptive label; click it to summon a scoped read in the docked assistant.
   • right-click — a context menu with the same explain action (+ Open workspace
     for a property).
   All behaviour lives here; tagged components only add data-* attributes. */

interface Target {
  kind: ExplainKind;
  text: string;
  name?: string;
  location?: string;
  reasons?: string[];
}
interface Pop extends Target { x: number; y: number; }
interface Ctx extends Target { x: number; y: number; }

function readTarget(node: Node | null): { el: HTMLElement; kind: ExplainKind } | null {
  let el: HTMLElement | null = node && node.nodeType === 3 ? node.parentElement : (node as HTMLElement | null);
  const host = el?.closest<HTMLElement>("[data-kind]") ?? null;
  if (!host) return null;
  const kind = host.dataset.kind as ExplainKind;
  if (kind !== "property" && kind !== "number" && kind !== "category" && kind !== "claim") return null;
  return { el: host, kind };
}

function attrsOf(el: HTMLElement): Pick<Target, "name" | "location" | "reasons"> {
  return {
    name: el.dataset.name || undefined,
    location: el.dataset.location || undefined,
    reasons: el.dataset.reasons ? el.dataset.reasons.split("|").filter(Boolean) : undefined,
  };
}

export function ExplainLayer() {
  const router = useRouter();
  const explain = useChatStore((s) => s.explain);
  const [pop, setPop] = useState<Pop | null>(null);
  const [ctx, setCtx] = useState<Ctx | null>(null);

  const run = useCallback(
    (t: Target) => {
      explain({
        kind: t.kind,
        text: t.text,
        name: t.name,
        location: t.location,
        reasons: t.reasons,
        contextLabel: t.name || (t.kind === "property" ? "Property" : t.kind === "number" ? "Figure" : t.kind === "category" ? "Segment" : "Insight"),
      });
    },
    [explain],
  );

  // select-to-explain
  useEffect(() => {
    const onUp = () => {
      // let the selection settle
      window.setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) { setPop(null); return; }
        const info = readTarget(sel.anchorNode);
        if (!info) { setPop(null); return; }
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        setPop({ kind: info.kind, text: sel.toString(), ...attrsOf(info.el), x: rect.left + rect.width / 2, y: rect.top });
      }, 1);
    };
    const clear = (e: Event) => {
      // keep the chip if the click is on the chip itself
      if (e.type === "mousedown" && (e.target as HTMLElement)?.closest?.("[data-explain-chip]")) return;
      setPop(null);
    };
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mousedown", clear);
    window.addEventListener("scroll", clear, true);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mousedown", clear);
      window.removeEventListener("scroll", clear, true);
    };
  }, []);

  // right-click context menu
  useEffect(() => {
    const onCtx = (e: MouseEvent) => {
      const info = readTarget(e.target as Node);
      if (!info) return;
      e.preventDefault();
      const a = attrsOf(info.el);
      const text = a.name || (e.target as HTMLElement)?.textContent?.trim() || info.el.textContent?.trim() || "";
      setPop(null);
      setCtx({ kind: info.kind, text, ...a, x: e.clientX, y: e.clientY });
    };
    document.addEventListener("contextmenu", onCtx);
    return () => document.removeEventListener("contextmenu", onCtx);
  }, []);

  const chipClick = () => {
    if (!pop) return;
    run(pop);
    window.getSelection()?.removeAllRanges();
    setPop(null);
  };

  const ctxItems = (c: Ctx): ContextMenuItem[] => {
    const items: ContextMenuItem[] = [
      { label: ctaLabelFor(c.kind), icon: EmblemIcon, prime: true, onClick: () => run(c) },
    ];
    if (c.kind === "property") {
      items.push({ label: "Open property workspace", icon: LayoutDashboard, onClick: () => router.push("/properties") });
    }
    return items;
  };

  return (
    <>
      <AnimatePresence>
        {pop && (
          <motion.div
            data-explain-chip
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: DUR.fast, ease: EASE.out }}
            style={{ position: "fixed", left: pop.x, top: pop.y, transform: "translate(-50%,calc(-100% - 8px))", zIndex: 150 }}
          >
            <button
              type="button"
              onClick={chipClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "var(--brand-gradient-action)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--r-pill)",
                padding: "8px 14px",
                font: "inherit",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "var(--shadow-lg)",
                whiteSpace: "nowrap",
              }}
            >
              <EmblemMark size={14} tone="current" /> {ctaLabelFor(pop.kind)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {ctx && <ContextMenu x={ctx.x} y={ctx.y} items={ctxItems(ctx)} onClose={() => setCtx(null)} />}
    </>
  );
}

/* small adapter so EmblemMark can be used as a lucide-style icon in the menu */
function EmblemIcon({ size = 15 }: { size?: number }) {
  return <EmblemMark size={size} tone="current" />;
}
