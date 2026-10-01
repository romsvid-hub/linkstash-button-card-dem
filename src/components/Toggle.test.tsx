import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "./Toggle";
import type { ToggleProps } from "./Toggle";

function Controlled(props: Partial<ToggleProps>) {
  const [checked, setChecked] = useState(props.checked ?? false);
  return (
    <Toggle
      aria-label="Notifications"
      {...props}
      checked={checked}
      onChange={(next) => {
        setChecked(next);
        return props.onChange?.(next);
      }}
    />
  );
}

describe("Toggle", () => {
  it("renders a switch with aria-checked reflecting `checked`", () => {
    const { rerender } = render(<Toggle aria-label="t" checked={false} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    rerender(<Toggle aria-label="t" checked />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange once with the next boolean per click", async () => {
    const onChange = vi.fn();
    render(<Toggle aria-label="t" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles with Space and Enter", async () => {
    render(<Controlled />);
    const sw = screen.getByRole("switch");
    sw.focus();
    await userEvent.keyboard(" ");
    expect(sw).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Enter}");
    expect(sw).toHaveAttribute("aria-checked", "false");
  });

  it("toggles when the label is clicked and uses it as accessible name", async () => {
    render(<Controlled aria-label={undefined} label="Сповіщення" />);
    const sw = screen.getByRole("switch", { name: "Сповіщення" });
    await userEvent.click(screen.getByText("Сповіщення"));
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("disabled: does not change, is not focusable, uses bg-disabled", async () => {
    const onChange = vi.fn();
    render(<Toggle aria-label="t" checked disabled onChange={onChange} />);
    const sw = screen.getByRole("switch");
    await userEvent.click(sw);
    await userEvent.tab();
    expect(onChange).not.toHaveBeenCalled();
    expect(sw).not.toHaveFocus();
    expect(sw).toBeDisabled();
    expect(sw.className).toContain("bg-bg-disabled");
  });

  it("loading: ignores clicks, sets aria-busy and shows the spinner", async () => {
    const onChange = vi.fn();
    render(<Toggle aria-label="t" checked={false} loading onChange={onChange} />);
    const sw = screen.getByRole("switch");
    await userEvent.click(sw);
    expect(onChange).not.toHaveBeenCalled();
    expect(sw).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("toggle-spinner")).toBeInTheDocument();
  });

  it("disabled wins over loading", () => {
    render(<Toggle aria-label="t" checked={false} loading disabled />);
    expect(screen.getByRole("switch")).not.toHaveAttribute("aria-busy");
    expect(screen.queryByTestId("toggle-spinner")).not.toBeInTheDocument();
  });

  it("async onChange: loading while pending, ignores repeat clicks", async () => {
    let resolve!: () => void;
    const onChange = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    render(<Toggle aria-label="t" checked={false} onChange={onChange} />);
    const sw = screen.getByRole("switch");
    await userEvent.click(sw);
    await userEvent.click(sw);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(sw).toHaveAttribute("aria-busy", "true");
    await act(async () => resolve());
    expect(sw).not.toHaveAttribute("aria-busy");
  });

  it("async onChange rejection: rolls back and reports the error", async () => {
    const onError = vi.fn();
    const error = new Error("boom");
    function Parent() {
      const [checked, setChecked] = useState(false);
      return (
        <Toggle
          aria-label="t"
          checked={checked}
          onError={onError}
          onChange={(next) =>
            Promise.reject(error).then(() => setChecked(next))
          }
        />
      );
    }
    render(<Parent />);
    const sw = screen.getByRole("switch");
    await userEvent.click(sw);
    expect(onError).toHaveBeenCalledWith(error);
    expect(sw).toHaveAttribute("aria-checked", "false");
    expect(sw).not.toHaveAttribute("aria-busy");
  });

  it("applies token classes for tone and size", () => {
    const { rerender } = render(<Toggle aria-label="t" checked />);
    const sw = screen.getByRole("switch");
    expect(sw.className).toContain("bg-accnt-bus-main");
    expect(sw.className).toContain("h-4 w-8");
    rerender(<Toggle aria-label="t" checked tone="user" size="large" />);
    expect(sw.className).toContain("bg-accnt-user-main");
    expect(sw.className).toContain("h-6 w-12");
    rerender(<Toggle aria-label="t" checked={false} />);
    expect(sw.className).toContain("bg-bg-dark-soft");
  });

  it("focus ring uses border_focus token only on focus-visible", () => {
    render(<Toggle aria-label="t" checked={false} />);
    const cls = screen.getByRole("switch").className;
    expect(cls).toContain("focus-visible:ring-border-focus");
    expect(cls).toContain("focus-visible:ring-bold");
  });
});
