"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, FileBarChart2, LayoutDashboard, Lightbulb, MessagesSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrandMark } from "@/components/atoms/BrandMark";
import { Logo } from "@/components/atoms/Logo";
import { Tooltip } from "@/components/atoms/Tooltip";
import { SummonButton } from "@/components/molecules/SummonButton";
import { useUIStore } from "@/store/ui.store";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/dashboards", label: "Dashboards", icon: LayoutDashboard },
  { href: "/reports", label: "Reports", icon: FileBarChart2 },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/chat", label: "Chat", icon: MessagesSquare },
];

const EXPANDED = 236;
const COLLAPSED = 72;
const HEADER_H = 60; // must equal TopBar height so the dividers align

// eased resize (feels more controlled than a bouncy spring for a panel)
const RESIZE = { duration: 0.34, ease: [0.4, 0, 0.2, 1] as const };
// active-highlight slide
const HIGHLIGHT = { type: "spring" as const, stiffness: 400, damping: 34 };

export function AppNav() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.navCollapsed);

  return (
    <motion.nav
      aria-label="Primary"
      initial={false}
      animate={{ width: collapsed ? COLLAPSED : EXPANDED }}
      transition={RESIZE}
      style={{
        flex: "none",
        height: "100dvh",
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
        borderRight: "1px solid var(--hairline)",
        overflow: "hidden",
        willChange: "width",
      }}
    >
      {/* header cell — height matches the top bar so the two dividers form one line */}
      <div
        style={{
          height: HEADER_H,
          flex: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? 0 : "0 18px",
          borderBottom: "1px solid var(--hairline)",
        }}
      >
        <Link
          href="/insights"
          aria-label="Bricklayer home"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}
        >
          {collapsed ? <BrandMark size={26} /> : <Logo size={22} />}
        </Link>
      </div>

      {/* destinations */}
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: "var(--s-3) 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          const link = (
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 12,
                height: 40,
                padding: collapsed ? 0 : "0 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: "var(--r-md)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? "var(--primary)" : "var(--body)",
                transition: "color var(--dur)",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "var(--surface-3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  transition={HIGHLIGHT}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "var(--r-md)",
                    background: "var(--primary-soft)",
                    zIndex: 0,
                  }}
                />
              )}
              <Icon
                size={19}
                strokeWidth={active ? 2.2 : 1.9}
                style={{ flexShrink: 0, position: "relative", zIndex: 1 }}
              />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    style={{ whiteSpace: "nowrap", position: "relative", zIndex: 1 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );

          return (
            <li key={href}>
              {collapsed ? (
                <Tooltip label={label} side="right">
                  {link}
                </Tooltip>
              ) : (
                link
              )}
            </li>
          );
        })}
      </ul>

      {/* footer — summon only */}
      <div style={{ marginTop: "auto", padding: collapsed ? "0 12px var(--s-4)" : "0 16px var(--s-4)" }}>
        <SummonButton variant="nav" collapsed={collapsed} />
      </div>
    </motion.nav>
  );
}
