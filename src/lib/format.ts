/* ============================================================
   Number formatting — one place for the money/percent/count strings
   widgets render. Geist Sans with tabular-nums does the alignment
   (no mono, ever — see CLAUDE.md), so these just shape the text.
   ============================================================ */

export type Unit = "usd" | "pct" | "count" | "usd-sf" | "r";

/** Compact USD: 6_512_400_000 → "$6.51B", 54_200_000 → "$54.2M". */
export function fmtUsd(n: number, opts: { compact?: boolean; decimals?: number } = {}): string {
  const { compact = true, decimals } = opts;
  if (compact) {
    return n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: decimals ?? 2,
    });
  }
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals ?? 0,
  });
}

/** Percent: 6.18 → "6.2%" (the number is already in percent units). */
export function fmtPct(n: number, decimals = 1): string {
  return `${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`;
}

/** Plain count with thousands separators: 3935 → "3,935". */
export function fmtCount(n: number, decimals = 0): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/** Price per square foot: 412 → "$412/SF". */
export function fmtUsdSf(n: number): string {
  return `$${fmtCount(n)}/SF`;
}

/** Correlation r-value: 0.55 → "0.55", -0.42 → "−0.42" (true minus glyph). */
export function fmtR(n: number): string {
  const s = n.toFixed(2);
  return s.startsWith("-") ? `−${s.slice(1)}` : s;
}

/** Format a value by its dataset unit — the general entry widgets use. */
export function fmtByUnit(n: number, unit?: Unit): string {
  switch (unit) {
    case "usd":
      return fmtUsd(n);
    case "pct":
      return fmtPct(n);
    case "usd-sf":
      return fmtUsdSf(n);
    case "r":
      return fmtR(n);
    case "count":
    default:
      return fmtCount(n);
  }
}
