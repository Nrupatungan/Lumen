import React from "react"; // Fixed: Added React import
import { test, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import ColorModeIconDropdown from "@/components/ColorModeDropdown";

// 1. Setup Mock State
const mockContext = {
  mode: "light" as "light" | "dark" | "system" | null,
  systemMode: null as "light" | "dark" | null,
  setMode: vi.fn(),
};

// 2. Mock Hook
vi.mock("@mui/material/styles", () => ({
  useColorScheme: () => ({
    mode: mockContext.mode,
    systemMode: mockContext.systemMode,
    setMode: mockContext.setMode,
  }),
}));

beforeEach(() => {
  mockContext.mode = "light";
  mockContext.systemMode = null;
  mockContext.setMode.mockClear();
});

const getToggleButton = () => screen.getByRole("button");

test("renders a placeholder Box when mode is null", () => {
  mockContext.mode = null;
  render(<ColorModeIconDropdown />);

  expect(screen.getByTestId("mode-placeholder")).toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("renders the LightModeIcon when mode is 'light'", () => {
  mockContext.mode = "light";
  render(<ColorModeIconDropdown />);

  const button = getToggleButton();
  expect(
    within(button).getByTestId("LightModeRoundedIcon")
  ).toBeInTheDocument();
});

test("renders the DarkModeIcon when mode is 'dark'", () => {
  mockContext.mode = "dark";
  render(<ColorModeIconDropdown />);

  const button = getToggleButton();
  expect(within(button).getByTestId("DarkModeRoundedIcon")).toBeInTheDocument();
});

test("renders the appropriate icon based on systemMode when mode is 'system'", () => {
  mockContext.mode = "system";
  mockContext.systemMode = "dark";

  render(<ColorModeIconDropdown />);

  const button = getToggleButton();
  expect(within(button).getByTestId("DarkModeRoundedIcon")).toBeInTheDocument();
});

test("opens the menu when the IconButton is clicked", async () => {
  mockContext.mode = "light";
  render(<ColorModeIconDropdown />);

  const button = getToggleButton();
  fireEvent.click(button);

  await waitFor(() => {
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "System" })
    ).toBeInTheDocument();
  });
});

test("calls setMode with 'dark' when 'Dark' is selected", async () => {
  mockContext.mode = "light";
  render(<ColorModeIconDropdown />);

  fireEvent.click(getToggleButton());

  const darkMenuItem = await screen.findByRole("menuitem", { name: "Dark" });
  fireEvent.click(darkMenuItem);

  expect(mockContext.setMode).toHaveBeenCalledWith("dark");
});
