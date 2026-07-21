"use client";

export interface TableColumn {
  key: string;
  label: string;
  align?: "left" | "right";
  numeric?: boolean;
}

export interface DataTableVizProps {
  columns: TableColumn[];
  rows: Record<string, React.ReactNode>[];
  height?: number;
}

/* Table widget — a scrollable data grid. Numeric columns are right-aligned
   and tabular-num so figures line up (Geist Sans, no mono). The header stays
   pinned while the body scrolls within the frame's fixed body height. */
export function DataTableViz({ columns, rows, height = 240 }: DataTableVizProps) {
  return (
    <div style={{ height, overflow: "auto", marginBottom: "var(--s-3)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  position: "sticky",
                  top: 0,
                  background: "var(--surface)",
                  textAlign: c.align ?? (c.numeric ? "right" : "left"),
                  color: "var(--muted)",
                  fontWeight: 600,
                  fontSize: 11.5,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  padding: "8px 10px",
                  borderBottom: "1px solid var(--hairline)",
                  whiteSpace: "nowrap",
                  zIndex: 1,
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: "1px solid var(--hairline-2)" }}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={c.numeric ? "tnum" : undefined}
                  style={{
                    textAlign: c.align ?? (c.numeric ? "right" : "left"),
                    padding: "8px 10px",
                    color: "var(--body)",
                    whiteSpace: "nowrap",
                    fontVariantNumeric: c.numeric ? "tabular-nums" : undefined,
                  }}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
