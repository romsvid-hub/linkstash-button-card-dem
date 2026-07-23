// App.tsx
// Demo page: renders one Card containing a gradient Button, plus a
// row showing every size × variant combination so both components'
// full range of props is visible at a glance.

// `export default` is used only here — the app's single root
// component — every other component in this project uses a named
// export instead (see Button.tsx / Card.tsx).
import { Button } from "./components/Button";
import { Card } from "./components/Card";

const variants = ["primary", "secondary", "ghost", "gradient"] as const;
const sizes = ["sm", "md", "lg"] as const;

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-slate-50 p-8">
      {/* The original showcase: a Card using Button inside its children slot. */}
      <Card title="Design-ресурси" description="12 збережених лінків у цій темі">
        <Button variant="gradient">Save current tab</Button>
      </Card>

      {/* A grid proving every variant/size combination renders correctly. */}
      <div className="flex flex-col gap-3">
        {variants.map((variant) => (
          <div key={variant} className="flex items-center gap-3">
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                {variant} / {size}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
