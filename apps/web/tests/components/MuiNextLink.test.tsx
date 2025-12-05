import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import MuiNextLink from "@/components/MuiNextLink";

vi.mock("next/font/google", () => ({
  Inter: () => ({ style: { fontFamily: "mock-font" } }),
}));

// Mock next/link INLINE — do NOT reference top-level variables
vi.mock("next/link", () => ({
  // eslint-disable-next-line react/display-name
  default: React.forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
    (props, ref) => (
      <a ref={ref} {...props} data-mocked-nextlink>
        {props.children}
      </a>
    )
  ),
}));

test("renders as an anchor tag with the correct href", () => {
  render(<MuiNextLink href="/dashboard">Dashboard</MuiNextLink>);

  const link = screen.getByRole("link", { name: /Dashboard/i });
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute("href", "/dashboard");
});

test("allows custom sx props to override styles", () => {
  render(
    <MuiNextLink href="/" sx={{ color: "red", textDecoration: "none" }}>
      Styled
    </MuiNextLink>
  );

  const link = screen.getByRole("link");

  expect(link).toHaveStyle({ color: "rgb(255, 0, 0)" });
  expect(link).toHaveStyle({ textDecoration: "none" });
});
