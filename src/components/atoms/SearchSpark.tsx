import { Search, Sparkle } from "lucide-react";

/* SearchSpark — a magnifier with a small AI sparkle riding its top-right.
   Signals that search is AI-aware (it can answer, not just match). Used on the
   top-bar Search button and in the search modal's input. The sparkle inherits
   the brand primary; the glass inherits currentColor from its context. */
export function SearchSpark({ size = 16, sparkColor = "var(--primary)" }: { size?: number; sparkColor?: string }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, width: size, height: size }} aria-hidden>
      <Search size={size} strokeWidth={2} />
      <Sparkle
        size={Math.round(size * 0.62)}
        strokeWidth={2}
        fill={sparkColor}
        style={{ position: "absolute", top: -Math.round(size * 0.28), right: -Math.round(size * 0.3), color: sparkColor }}
      />
    </span>
  );
}
