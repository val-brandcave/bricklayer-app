import { BrandMark } from "./BrandMark";
import { Wordmark } from "./Wordmark";

/* Full lockup: gradient emblem + the real vector wordmark (not live text).
   Both are SVG; the wordmark themes via var(--ink), the emblem carries the
   brand gradient. `size` is the emblem height in px. */
export function Logo({ size = 22, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <BrandMark size={size + 4} />
      {showWordmark && <Wordmark height={Math.round(size * 0.9)} />}
    </span>
  );
}
