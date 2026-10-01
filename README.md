# Button + Card demo

A small standalone React + TypeScript + Tailwind demo showing two components:

- **`Button`** — style `variant` (`primary` / `secondary` / `ghost` / `gradient`), `size` (`sm` / `md` / `lg`), and a `pressed` visual state built with `useState`
- **`Card`** — a bordered container with a title, description, and an optional content slot (used here to hold a `Button`)
- **`Toggle`** — on/off switch from the ATJ design system (`size`, `tone`, `loading`, `disabled`, `label`), built from Figma Variables mapped to Tailwind tokens. Spec: [PRD in Notion](https://app.notion.com/p/3ec0695cf333818d9ea1df9c4f908736) · [Figma](https://www.figma.com/design/a42eTgy6hzjmFWrVymHdfG/ATJ-copy-_Main_design_file?node-id=524-13936)

Every step in [`src/components/Button.tsx`](src/components/Button.tsx) and [`src/components/Card.tsx`](src/components/Card.tsx) is commented inline, explaining not just what each line does but why it's written that way — this repo exists as a learning reference, not a production package.

## Run it

```bash
npm install
npm run dev
```

## Test it

```bash
npm test
```

## Storybook

```bash
npm run storybook
```

## Build it

```bash
npm run build
```
