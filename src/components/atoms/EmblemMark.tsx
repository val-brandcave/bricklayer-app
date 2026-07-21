"use client";

import { useId } from "react";

/* EmblemMark — the Bricklayer emblem rendered as its five offset brick courses
   (not the single-path BrandMark), so each brick can animate. This is the AI /
   brand-moment mark app-wide — it replaces the old sparkle icon.

   animation:
     • "none"       — static, assembled mark (default)
     • "build"      — A · Bricklaying: bricks drop in, bottom course first (reveal)
     • "processing" — C · Rolling courses: a glow-lift wave rolls through (AI thinking)

   Motion lives as tokenized keyframes in globals.css (.bl-emblem-*), consistent
   with the app's other CSS-level brand motion; reduced-motion is handled by the
   global guard. */

export type EmblemAnimation = "none" | "build" | "processing";
/** "gradient" = brand gradient bricks; "current" = monochrome via currentColor
    (use on colored/gradient surfaces like the summon button). */
export type EmblemTone = "gradient" | "current";

export interface EmblemMarkProps {
  size?: number; // height in px
  animation?: EmblemAnimation;
  tone?: EmblemTone;
  className?: string;
  title?: string;
}

/* Five brick courses (viewBox 0 0 673 800), top → bottom. course drives the
   stagger; the base is laid first in the build, last-reached by the wave. */
const BRICKS = [
  { x: 0, y: 0, w: 414.6, h: 160.5 }, // 0 top-left
  { x: 438.9, y: 160.5, w: 233.4, h: 159.3 }, // 1 upper-right
  { x: 0, y: 319.8, w: 414.6, h: 160.5 }, // 2 mid-left
  { x: 438.9, y: 480.2, w: 233.4, h: 160.5 }, // 3 lower-right
  { x: 156.8, y: 640.7, w: 257.8, h: 159.3 }, // 4 base
];

export function EmblemMark({ size = 24, animation = "none", tone = "gradient", className, title }: EmblemMarkProps) {
  const gradId = `emgrad-${useId().replace(/:/g, "")}`;
  const w = (size * 673) / 800;
  const fill = tone === "current" ? "currentColor" : `url(#${gradId})`;
  const animClass =
    animation === "build" ? "bl-emblem-build" : animation === "processing" ? "bl-emblem-wave" : "";

  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 673 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`bl-emblem ${animClass} ${className ?? ""}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="53.7" y1="683" x2="617.8" y2="119">
          <stop offset="0" stopColor="#1420B9" />
          <stop offset="0.152" stopColor="#2E2AC2" />
          <stop offset="0.357" stopColor="#5037CC" />
          <stop offset="0.49" stopColor="#653ED3" />
          <stop offset="0.6" stopColor="#7645D9" />
          <stop offset="1" stopColor="#B65CEE" />
        </linearGradient>
      </defs>
      {BRICKS.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={22}
          fill={fill}
          style={{ ["--i" as string]: i, ["--r" as string]: BRICKS.length - 1 - i }}
        />
      ))}
    </svg>
  );
}
