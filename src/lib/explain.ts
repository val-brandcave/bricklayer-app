/* "Explain this" — the reasoning layer for the co-working copilot.
   A selection (or right-click) anywhere in the app becomes a scoped, skeptical
   read. This is the pure, mock-data brain: it maps a selection KIND to a
   credible reasoning template (echo → why → stacked flags → Bricklayer's Read →
   provenance → follow-ups → action). No backend; the "intelligence" is scripted.
   See docs/ROADMAP.md item 1b. */

export type ExplainKind = "property" | "number" | "category" | "claim";

export interface Explanation {
  kind: ExplainKind;
  /** what the user selected — echoed back as a chip (rendered as plain text). */
  echo: string;
  /** lead-in reasoning; canned constant, may contain <b> (never user text). */
  why: string;
  /** the stacked reasons; canned constants, may contain <b>. */
  flags: string[];
  /** Bricklayer's Read — the self-critique. Canned constant. */
  read: string;
  provenance: string;
  /** follow-up prompts (sent as real chat messages). */
  digs: string[];
  ctaLabel: string;
  ctaAction: "workspace" | "report" | "dashboard";
}

export interface ExplainInput {
  kind: ExplainKind;
  /** the selected text / entity name (user-derived — only ever shown as plain text). */
  text: string;
  name?: string;
  location?: string;
  /** real reasons to use as flags (e.g. from a watchlist row). */
  reasons?: string[];
  /** dock context chip label. */
  contextLabel?: string;
}

/** The adaptive CTA label, keyed off what was selected. */
export function ctaLabelFor(kind: ExplainKind): string {
  switch (kind) {
    case "property": return "Explain this property";
    case "number": return "Explain this number";
    case "category": return "Explain this exposure";
    case "claim": return "Unpack this claim";
  }
}

/** The user-turn phrasing when an explanation is requested. */
export function requestText(kind: ExplainKind, text: string): string {
  return `${ctaLabelFor(kind)} — “${clip(text)}”`;
}

function clip(s: string, n = 80): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n).trimEnd() + "…" : t;
}

export function buildExplanation(input: ExplainInput): Explanation {
  const text = clip(input.text, 90);

  if (input.kind === "property") {
    const name = input.name || text;
    const flags = input.reasons && input.reasons.length
      ? input.reasons
      : [
          "Cap rate sits below its class average — the value may be optimistic.",
          "The last valuation is past the 24-month staleness threshold.",
          "Direct-cap rests on only a few comparables — thin support.",
        ];
    return {
      kind: "property",
      echo: input.location ? `${name} · ${input.location}` : name,
      why: "This asset is on the watchlist because <b>several signals stack</b> — not one:",
      flags,
      read:
        "Any one of these alone is routine. Stacked, they point to a value that hasn’t been tested against a softening market. I’d prioritise a re-appraisal here over the merely-stale assets — the thin comp support is what makes this one fragile, not just its age.",
      provenance: `Source: Data Lake · latest appraisal for ${name}`,
      digs: ["Compare to its class", "Show the comparables", "What would a re-appraisal change?"],
      ctaLabel: "Open property workspace",
      ctaAction: "workspace",
    };
  }

  if (input.kind === "number") {
    return {
      kind: "number",
      echo: text,
      why: "This figure is <b>book-value-weighted</b> across the appraised portfolio. It’s shaped by:",
      flags: [
        "A wide spread between recently-repriced assets and the long tail.",
        "A meaningful share of <b>stale</b> valuations still sitting on older inputs.",
      ],
      read:
        "Treat this as a floor, not the whole truth. Roughly a third of the book is stale — refreshed today, this number would likely move. As reported, it’s conservative by construction.",
      provenance: "Source: Data Lake · 3,935 appraisals, weighted",
      digs: ["Break this down by class", "Show only fresh valuations", "How has it trended?"],
      ctaLabel: "Pin this to a dashboard",
      ctaAction: "dashboard",
    };
  }

  if (input.kind === "category") {
    const cat = text;
    return {
      kind: "category",
      echo: `${cat} · segment`,
      why: `Here’s the exposure picture for <b>${escapeInline(cat)}</b>:`,
      flags: [
        "One of your larger concentrations by book value.",
        "Carries an above-average share of stale valuations.",
        "Cap rates in this segment are moving faster than the portfolio average.",
      ],
      read:
        "Concentration on its own isn’t the risk — undated concentration is. The question isn’t the segment’s size; it’s how much of it hasn’t been re-tested recently. I’d frame this as a staleness problem inside a big bucket.",
      provenance: `Source: Data Lake · segment = ${cat}`,
      digs: [`${cat} by vintage`, `Stale ${cat} assets`, `Build a ${cat} risk dashboard`],
      ctaLabel: "Open as a report",
      ctaAction: "report",
    };
  }

  // claim (a line of Bricklayer's own narrative)
  return {
    kind: "claim",
    echo: text,
    why: "The claim checks out — here’s the evidence, and the caveat:",
    flags: [
      "The figure is summed from the underlying appraised values.",
      "It’s expressed against the current total book.",
    ],
    read:
      "The number is right, but flattering. It counts value at last-appraised dates — with a large slice of the book stale, today’s true figure is probably higher. Verified, but treat it as a lower bound.",
    provenance: "Source: Data Lake · read from the book",
    digs: ["Show the evidence chart", "What makes up this figure?", "How stale is it?"],
    ctaLabel: "Pin this to a dashboard",
    ctaAction: "dashboard",
  };
}

function escapeInline(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string));
}
