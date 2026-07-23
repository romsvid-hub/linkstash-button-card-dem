// Card.tsx
// A simple bordered container used to present a title, a description,
// and optionally any other content underneath (e.g. a Button).

// `ReactNode` is the type for "anything React can render" — a string,
// a number, an element, an array of elements, or nothing at all.
// It's a type-only import: it disappears at build time.
import type { ReactNode } from "react";

// Step 1: describe the props this component accepts.
// Unlike Button, Card doesn't wrap a native HTML element with its own
// attributes, so there's nothing to `extend` here — just three plain
// props defined directly.
interface CardProps {
  // Required: shown as the bold heading.
  title: string;
  // Required: shown as smaller, muted supporting text under the title.
  description: string;
  // Optional (the `?`): whatever the caller nests inside <Card>...</Card>,
  // e.g. `<Card ...><Button>Save</Button></Card>`. If nothing is
  // passed, this is `undefined` and we render nothing extra.
  children?: ReactNode;
}

// Step 2: the component.
// Destructuring `{ title, description, children }` directly out of
// the props object is a common React shorthand — equivalent to
// writing `props.title`, `props.description`, `props.children`
// everywhere below, just shorter.
export function Card({ title, description, children }: CardProps) {
  return (
    // Step 3: the outer box.
    // - `w-full max-w-xs`: fill available width, but never grow past
    //   a small fixed max (20rem) — keeps the card compact.
    // - `rounded-lg border border-slate-200`: soft corners + a thin
    //   light-gray border, the classic "card" look.
    // - `bg-white p-4 shadow-sm`: white background, internal padding,
    //   and a very subtle drop shadow to lift it off the page.
    <div className="w-full max-w-xs rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {/* Step 4: the title — bold, slightly larger, near-black text. */}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>

      {/* Step 5: the description — smaller and muted (gray), sits
          right under the title with a small top margin. */}
      <p className="mt-1 text-sm text-slate-500">{description}</p>

      {/* Step 6: conditionally render the children block.
          `children ? <div>...</div> : null` means: if something was
          passed inside <Card>...</Card>, wrap it in a spaced-out div;
          if nothing was passed, render nothing (not even an empty div) —
          this avoids leaving unnecessary empty markup in the DOM. */}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
