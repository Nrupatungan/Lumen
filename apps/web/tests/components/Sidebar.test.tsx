import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Sidebar from "@/components/Sidebar";

test("renders header", () => {
  render(<Sidebar />);
  expect(screen.getByText("Dashboard")).toBeInTheDocument();
});
