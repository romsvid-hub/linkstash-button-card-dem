import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./Toggle";
import type { ToggleProps, ToggleSize, ToggleTone } from "./Toggle";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/a42eTgy6hzjmFWrVymHdfG/ATJ-copy-_Main_design_file?node-id=524-13936",
    },
  },
  args: {
    checked: false,
    size: "regular",
    tone: "business",
    disabled: false,
    loading: false,
    "aria-label": "Toggle",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["regular", "large"] },
    tone: { control: "inline-radio", options: ["business", "user"] },
    labelPosition: { control: "inline-radio", options: ["end", "start"] },
  },
  // Stories are interactive: clicking flips the local `checked` state.
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {};
export const On: Story = { args: { checked: true } };
export const Large: Story = { args: { size: "large", checked: true } };
export const Loading: Story = { args: { loading: true, checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledOn: Story = { args: { disabled: true, checked: true } };
export const UserTone: Story = { args: { tone: "user", checked: true } };

export const WithLabel: Story = {
  args: { label: "Підлягає обговоренню", size: "large", "aria-label": undefined },
};

export const WithLabelStart: Story = {
  args: { ...WithLabel.args, labelPosition: "start", checked: true },
};

export const LongLabel: Story = {
  args: {
    ...WithLabel.args,
    label:
      "Надсилати сповіщення про нові коментарі, згадки та зміни статусу задач, до яких я підписаний",
  },
  decorators: [(Story) => <div style={{ maxWidth: 320 }}>{Story()}</div>],
};

// Async onChange: shows the loading state for 1.5s. "Fail next" makes the
// request reject so you can see the rollback + error message.
export const AsyncWithRollback: Story = {
  render: function Render(args) {
    const [checked, setChecked] = useState(false);
    const [fail, setFail] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const request = (next: boolean) =>
      new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          if (fail) reject(new Error("Не вдалося зберегти зміну"));
          else {
            setChecked(next);
            resolve();
          }
        }, 1500),
      );
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <Toggle
          {...args}
          size="large"
          label="Сповіщення"
          checked={checked}
          onChange={(next) => {
            setError(null);
            return request(next);
          }}
          onError={(e) => setError((e as Error).message)}
        />
        <label style={{ fontSize: 14 }}>
          <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} /> Fail next request
        </label>
        {error && <p style={{ color: "#c94b2c", fontSize: 14 }}>{error}</p>}
      </div>
    );
  },
};

// Full matrix mirroring the Figma component set (408:85844):
// 2 sizes × 2 checked × default / hover / focus / loading / disabled.
// Hover and focus are pseudo-states — hover/Tab over the row to see them.
const states: { name: string; props: Partial<ToggleProps> }[] = [
  { name: "state=default", props: {} },
  { name: "state=hover (hover me)", props: {} },
  { name: "state=focus (Tab)", props: {} },
  { name: "isLoading=true", props: { loading: true } },
  { name: "isDisabled=true", props: { disabled: true } },
];

export const AllStates: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32 }}>
      {(["business", "user"] as ToggleTone[]).map((tone) =>
        (["regular", "large"] as ToggleSize[]).map((size) => (
          <div key={`${tone}-${size}`}>
            <p style={{ fontFamily: "monospace", fontSize: 12, marginBottom: 8 }}>
              tone={tone} · size={size}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "64px 64px 1fr", rowGap: 16, alignItems: "center" }}>
              {states.map(({ name, props }) => (
                <div key={name} style={{ display: "contents" }}>
                  <Toggle aria-label={`${name} off`} checked={false} size={size} tone={tone} {...props} />
                  <Toggle aria-label={`${name} on`} checked size={size} tone={tone} {...props} />
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "#676d77" }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        )),
      )}
    </div>
  ),
};
