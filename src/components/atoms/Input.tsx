"use client";

import { forwardRef, useId, useState } from "react";
import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

type NativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "style">;

export interface InputProps extends NativeProps {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: LucideIcon;
  fullWidth?: boolean;
}

/* Text input atom — labelled, AA-accessible, with a soft focus transition.
   Focus ring is driven by tokens; error state uses the danger semantic. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, iconLeft: IconLeft, fullWidth = true, id, disabled, onFocus, onBlur, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [focused, setFocused] = useState(false);
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errId = error ? `${inputId}-err` : undefined;

  const borderColor = error
    ? "var(--danger)"
    : focused
      ? "var(--primary)"
      : "var(--border-strong)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: fullWidth ? "100%" : undefined }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
          {label}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 40,
          padding: "0 12px",
          borderRadius: "var(--r-md)",
          background: disabled ? "var(--surface-2)" : "var(--surface)",
          border: `1px solid ${borderColor}`,
          boxShadow: focused && !error ? "0 0 0 3px var(--ring)" : "none",
          transition: "border-color var(--dur), box-shadow var(--dur)",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {IconLeft && <IconLeft size={16} strokeWidth={2} color="var(--muted)" aria-hidden style={{ flexShrink: 0 }} />}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={errId ?? hintId}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            color: "var(--ink)",
            font: "inherit",
            fontSize: 14,
          }}
          {...rest}
        />
      </div>
      {error ? (
        <span id={errId} style={{ fontSize: 12, color: "var(--danger)" }}>
          {error}
        </span>
      ) : (
        hint && (
          <span id={hintId} style={{ fontSize: 12, color: "var(--muted)" }}>
            {hint}
          </span>
        )
      )}
    </div>
  );
});
