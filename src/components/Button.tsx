// Button.tsx
// A single reusable button with style variants, size options, and a
// "pressed" visual state. Every step below is commented to explain
// *why* it's written this way, not just what it does.

// We import the type of React's mouse event and the button's native
// HTML attributes separately from the value-level `useState` hook.
// `import type` tells TypeScript (and the bundler) that these two
// imports only exist at compile time and produce zero runtime code —
// they get erased entirely from the final JS bundle.
import { useState } from "react";
import type { ButtonHTMLAttributes, MouseEvent } from "react";

// Step 1: define the closed set of allowed visual styles as a string
// literal union. This is the TypeScript equivalent of an enum, but
// lighter — it compiles to nothing, it's just a compile-time check.
// Any other string (e.g. "danger") will be a type error at the call site.
type ButtonVariant = "primary" | "secondary" | "ghost" | "gradient";

// Step 2: same idea for sizes — a closed set of allowed values.
type ButtonSize = "sm" | "md" | "lg";

// Step 3: describe the component's public API (its props).
// `extends ButtonHTMLAttributes<HTMLButtonElement>` means: "this
// component accepts everything a native <button> accepts" — onClick,
// disabled, type, aria-*, etc. — for free, without us retyping them.
// We only add the two props that are specific to *our* button:
// `variant` and `size`. Both are optional (the `?`), because we want
// sensible defaults if the caller doesn't pass them.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

// Step 4: map each variant to its Tailwind utility classes.
// Using `Record<ButtonVariant, string>` forces this object to have
// exactly one entry per variant — if we add a new variant to the
// union in step 1 and forget to add it here, TypeScript will error
// immediately (this is the main benefit of union + Record over a
// plain object or a switch statement).
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    // Base look: dark solid background, white text.
    "bg-slate-900 text-white hover:bg-slate-700 " +
    // Focus ring shown only for keyboard focus (`focus-visible`,
    // not `focus`), so a mouse click doesn't show an ugly ring.
    "focus-visible:ring-2 focus-visible:ring-slate-400 " +
    // When the native `disabled` attribute is true, Tailwind's
    // `disabled:` variant applies these classes automatically —
    // no JS branching needed for this part.
    "disabled:opacity-50 disabled:pointer-events-none",
  secondary:
    // Lighter, "less important action" look.
    "bg-slate-100 text-slate-900 hover:bg-slate-200 " +
    "focus-visible:ring-2 focus-visible:ring-slate-300 " +
    "disabled:opacity-50 disabled:pointer-events-none",
  ghost:
    // No background at all until hovered — used for low-emphasis actions.
    "bg-transparent text-slate-700 hover:bg-slate-100 " +
    "focus-visible:ring-2 focus-visible:ring-slate-300 " +
    "disabled:opacity-50 disabled:pointer-events-none",
  gradient:
    // `bg-gradient-to-r` + `from-*`/`to-*` is Tailwind's gradient
    // syntax: a linear gradient going left-to-right between two colors.
    "bg-gradient-to-r from-blue-500 to-indigo-600 text-white " +
    // On hover we swap in slightly darker stops for the same gradient —
    // this changes a CSS custom property under the hood, not
    // `background-color`, which is why it won't smoothly fade under
    // `transition-colors` (only `transition` / `transition-all` catches it).
    "hover:from-blue-600 hover:to-indigo-700 " +
    "focus-visible:ring-2 focus-visible:ring-indigo-400 " +
    "disabled:opacity-50 disabled:pointer-events-none",
};

// Step 5: same pattern as step 4, but for sizes — padding and
// font-size scale together so the button always looks proportional.
const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

// Step 6: the component itself.
// `export function Button` — a *named* export (not `export default`).
// This project's convention reserves `export default` for the app's
// root component only, so every other file can be imported the same
// way: `import { Button } from "./Button"`.
export function Button({
  // Destructure props with defaults right in the function signature.
  // If the caller omits `variant`, it behaves exactly as if they
  // passed "primary" — same for `size` and `md`.
  variant = "primary",
  size = "md",
  className = "",
  // We pull these three event handlers out by name so we can wrap
  // them (see below) instead of accidentally overwriting whatever
  // the caller passed in.
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  // Everything else the caller passed (onClick, disabled, type, ...)
  // ends up in `props` and gets spread onto the native <button> as-is.
  ...props
}: ButtonProps) {
  // Step 7: local UI state.
  // `useState<boolean>(false)` creates one piece of state — a boolean,
  // starting as `false` — and a setter function to change it.
  // This state exists only while this specific <button> is mounted;
  // it resets whenever the component unmounts.
  const [pressed, setPressed] = useState<boolean>(false);

  // Step 8: wrap the native mouse events instead of replacing them.
  // If we simply did `onMouseDown={() => setPressed(true)}`, any
  // `onMouseDown` the *caller* passed in would be silently dropped.
  // Calling `onMouseDown?.(event)` after our own logic means: "if the
  // caller gave us a handler, call it too, with the same event."
  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    setPressed(true);
    onMouseDown?.(event);
  };

  const handleMouseUp = (event: MouseEvent<HTMLButtonElement>) => {
    setPressed(false);
    onMouseUp?.(event);
  };

  // Also reset on mouse-leave — otherwise if you press the button and
  // drag the cursor away before releasing, it would stay stuck "pressed".
  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    setPressed(false);
    onMouseLeave?.(event);
  };

  // Step 9: render.
  // The className is built by joining several utility-class strings:
  // - shared shape/typography classes that apply to every button
  // - the size classes for the current `size`
  // - the variant classes for the current `variant`
  // - `scale-95` only while `pressed` is true, giving a tiny "squish"
  //   feedback on click — this is the visual proof that `pressed`
  //   state is actually working
  // - whatever extra `className` the caller passed, appended last so
  //   they can override anything above if they need to
  return (
    <button
      className={`rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-offset-2 ${sizeClasses[size]} ${variantClasses[variant]} ${pressed ? "scale-95" : ""} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    />
  );
}
