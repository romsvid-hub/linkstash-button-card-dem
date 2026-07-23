# Button + Card demo

A small standalone React + TypeScript + Tailwind demo showing two components:

- **`Button`** — style `variant` (`primary` / `secondary` / `ghost` / `gradient`), `size` (`sm` / `md` / `lg`), and a `pressed` visual state built with `useState`
- **`Card`** — a bordered container with a title, description, and an optional content slot (used here to hold a `Button`)

Every step in [`src/components/Button.tsx`](src/components/Button.tsx) and [`src/components/Card.tsx`](src/components/Card.tsx) is commented inline, explaining not just what each line does but why it's written that way — this repo exists as a learning reference, not a production package.

## Run it

```bash
npm install
npm run dev
```

## Build it

```bash
npm run build
```
