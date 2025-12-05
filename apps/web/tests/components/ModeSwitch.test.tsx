import React from "react";
import { test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ModeSwitch from "@/components/ModeSwitch";

// 1. Setup Mock State
const mockContext = {
  mode: "light" as "light" | "dark" | "system" | null,
  setMode: vi.fn(),
};

// 2. Mock Hook
vi.mock("@mui/material/styles", () => ({
  useColorScheme: () => ({
    mode: mockContext.mode,
    setMode: mockContext.setMode,
  }),
}));

beforeEach(() => {
  mockContext.mode = "light";
  mockContext.setMode.mockClear();
});

test("renders nothing when mode is null", () => {
  mockContext.mode = null;
  const view = render(<ModeSwitch />);
  expect(view.container).toBeEmptyDOMElement();
});

test("renders the theme select control when mode is available", () => {
  mockContext.mode = "light";
  render(<ModeSwitch />);

  // Fixed: Use 'combobox' role as per error log
  const selectTrigger = screen.getByRole("combobox", { name: /Theme/i });
  expect(selectTrigger).toBeInTheDocument();
  expect(selectTrigger).toHaveTextContent("Light");
});

test("correctly displays 'system' mode when active", () => {
  mockContext.mode = "system";
  render(<ModeSwitch />);

  const selectTrigger = screen.getByRole("combobox", { name: /Theme/i });
  expect(selectTrigger).toHaveTextContent("System");
});

test("calls setMode with 'dark' when selecting the dark option", async () => {
  mockContext.mode = "light";
  render(<ModeSwitch />);

  const selectTrigger = screen.getByRole("combobox", { name: /Theme/i });

  // MUI Select interactions: MouseDown on the trigger opens the options
  fireEvent.mouseDown(selectTrigger);

  // Find the option in the listbox (MUI portals this to document body)
  const darkOption = await screen.findByRole("option", { name: "Dark" });
  fireEvent.click(darkOption);

  expect(mockContext.setMode).toHaveBeenCalledWith("dark");
});
