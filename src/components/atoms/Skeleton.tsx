/* Skeleton loading primitive — a token-driven shimmer.
   Every data surface shows a Skeleton (or a set of them) while its adapter
   call resolves; we ALWAYS simulate a short latency in the demo so the
   loading state is visible and the app feels alive (see CLAUDE.md).

   Pure CSS shimmer (no JS) so it's cheap to render in bulk and works in
   server or client trees. The shimmer respects prefers-reduced-motion via
   the global guard in globals.css. */

export type SkeletonShape = "text" | "block" | "circle" | "pill";

export interface SkeletonProps {
  shape?: SkeletonShape;
  width?: number | string;
  height?: number | string;
  radius?: string; // token var(); overrides shape default
  className?: string;
  style?: React.CSSProperties;
}

const RADIUS: Record<SkeletonShape, string> = {
  text: "var(--r-xs)",
  block: "var(--r-lg)",
  circle: "var(--r-pill)",
  pill: "var(--r-pill)",
};

export function Skeleton({ shape = "block", width, height, radius, className, style }: SkeletonProps) {
  const defaultH = shape === "text" ? "0.85em" : shape === "circle" ? 40 : 16;
  const defaultW = shape === "circle" ? (height ?? 40) : "100%";
  return (
    <span
      aria-hidden
      className={`bl-skeleton ${className ?? ""}`}
      style={{
        display: "block",
        width: width ?? defaultW,
        height: height ?? defaultH,
        borderRadius: radius ?? RADIUS[shape],
        ...style,
      }}
    />
  );
}

/* Convenience: a stack of shimmer text lines (last line shortened). */
export function SkeletonText({
  lines = 3,
  gap = 10,
  lastWidth = "62%",
}: {
  lines?: number;
  gap?: number;
  lastWidth?: string;
}) {
  return (
    <span style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          shape="text"
          height={12}
          width={i === lines - 1 ? lastWidth : "100%"}
        />
      ))}
    </span>
  );
}
