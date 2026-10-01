// Toggle.tsx
// A boolean on/off switch that applies its change immediately.
// Spec (PRD): https://app.notion.com/p/3ec0695cf333818d9ea1df9c4f908736
// Design (Figma): https://www.figma.com/design/a42eTgy6hzjmFWrVymHdfG/ATJ-copy-_Main_design_file?node-id=524-13936
//
// Every colour, radius and spacing below comes from a Figma Variable that
// is mapped to a Tailwind token in `tailwind.config.js` — no hardcoded hex.

import { useId, useState } from "react";
import type { ButtonHTMLAttributes, MouseEvent } from "react";

// Step 1: closed sets of allowed values (Figma variant names, 1:1).
// `regular` / `large` are the variant names on the `❖ Toggle` component set.
export type ToggleSize = "regular" | "large";
// The ON colour depends on product context: Business (blue) or User (terracotta).
export type ToggleTone = "business" | "user";
export type ToggleLabelPosition = "start" | "end";

// Step 2: public API. Derived from the PRD acceptance criteria:
// - controlled boolean only (`checked` + `onChange(next)`), no indeterminate state
// - `onChange` may return a Promise: while it is pending the toggle shows the
//   loading state and ignores further clicks; if it rejects, `checked` is left
//   untouched (the parent never updated it), so the UI rolls back by itself
//   and `onError` lets the caller show a toast / inline error.
export interface ToggleProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onChange" | "onError" | "children" | "role" | "type"
  > {
  checked: boolean;
  onChange?: (next: boolean) => void | Promise<unknown>;
  onError?: (error: unknown) => void;
  size?: ToggleSize;
  tone?: ToggleTone;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  labelPosition?: ToggleLabelPosition;
}

// Step 3: per-size geometry.
// regular: track 32×16, thumb 12 (2px inset) → travels 16px
// large:   track 48×24, thumb 20 (m/space-20, 2px inset: x=2 → x=26) → travels 24px
// `rtl:` flips the travel direction so ON is always on the inline end.
// regular gets an invisible 24px-tall hit area (`before:`) to meet a11y minimums.
const sizeClasses: Record<
  ToggleSize,
  { track: string; thumb: string; on: string; spinner: string }
> = {
  regular: {
    track: "h-4 w-8 before:absolute before:-inset-y-1 before:inset-x-0",
    thumb: "size-3",
    on: "translate-x-4 rtl:-translate-x-4",
    spinner: "size-2",
  },
  large: {
    track: "h-6 w-12",
    thumb: "size-space-20",
    on: "translate-x-6 rtl:-translate-x-6",
    spinner: "size-3",
  },
};

// Step 4: ON-track colour per brand tone. The spinner reuses it so the
// loading indicator inside the white thumb matches the track.
const toneClasses: Record<ToggleTone, { on: string; spinner: string }> = {
  business: { on: "bg-accnt-bus-main", spinner: "text-accnt-bus-main" },
  user: { on: "bg-accnt-user-main", spinner: "text-accnt-user-main" },
};

export function Toggle({
  checked,
  onChange,
  onError,
  size = "regular",
  tone = "business",
  disabled = false,
  loading = false,
  label,
  labelPosition = "end",
  id,
  className = "",
  onClick,
  ...props
}: ToggleProps) {
  const generatedId = useId();
  const toggleId = id ?? generatedId;

  // Internal pending flag for async `onChange`; merged with the `loading` prop.
  const [pending, setPending] = useState(false);
  // PRD edge case: disabled wins over loading when both are set.
  const isLoading = !disabled && (loading || pending);
  const isInteractive = !disabled && !isLoading;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    // Loading: repeated clicks are ignored (no request queue).
    if (event.defaultPrevented || !isInteractive) return;

    const result = onChange?.(!checked);
    if (result instanceof Promise) {
      setPending(true);
      result
        .catch((error: unknown) => onError?.(error))
        .finally(() => setPending(false));
    }
  };

  const sizes = sizeClasses[size];
  const tones = toneClasses[tone];

  // Track colour: disabled > on > off.
  const trackColor = disabled
    ? "bg-bg-disabled"
    : checked
      ? tones.on
      : "bg-bg-dark-soft";

  const control = (
    <button
      {...props}
      id={toggleId}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={isLoading || undefined}
      // Native `disabled` removes the control from the tab order and blocks
      // hover/focus/click in one go, exactly as the PRD requires.
      disabled={disabled}
      onClick={handleClick}
      className={[
        "group relative inline-flex shrink-0 rounded-full transition-colors duration-200",
        "motion-reduce:transition-none",
        // Focus: 2px border_focus ring, 2px gap — keyboard focus only.
        "focus-visible:outline-none focus-visible:ring-bold focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card",
        sizes.track,
        trackColor,
        // Hover (assumption — Figma hover equals default, see PR notes).
        isInteractive ? "cursor-pointer hover:brightness-110" : "",
        disabled ? "cursor-not-allowed" : "",
        isLoading ? "cursor-progress" : "",
        className,
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute start-0.5 top-0.5 flex items-center justify-center rounded-full bg-bg-card",
          "transition-transform duration-200 motion-reduce:transition-none",
          isInteractive ? "group-hover:shadow-md" : "",
          sizes.thumb,
          checked ? sizes.on : "translate-x-0",
        ].join(" ")}
      >
        {isLoading && (
          // Loading indicator inside the thumb (assumption — hidden in Figma).
          <svg
            data-testid="toggle-spinner"
            viewBox="0 0 24 24"
            fill="none"
            className={`animate-spin ${sizes.spinner} ${tones.spinner}`}
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );

  if (!label) return control;

  // Toggle With label: `<label htmlFor>` gives the switch its accessible name
  // and makes the whole label a click target. The control sits in a 26px box
  // (label line-height) so it stays aligned with the first line of long text.
  return (
    <div
      className={`inline-flex items-start gap-space-8 ${labelPosition === "start" ? "flex-row-reverse" : ""}`}
    >
      <span className="flex h-[26px] items-center">{control}</span>
      <label
        htmlFor={toggleId}
        className={`font-base text-b2 text-text-secondary ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {label}
      </label>
    </div>
  );
}
