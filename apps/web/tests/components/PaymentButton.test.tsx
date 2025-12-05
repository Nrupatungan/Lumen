import React from "react";
import { beforeEach, test, expect, vi } from "vitest";
import PaymentButton, { type PaymentButtonProps } from "@/components/PaymentButton";
import { fireEvent, render, waitFor, screen, act } from "@testing-library/react";
import { Session } from "next-auth";

// ----------------------------
// 🧪 Mock next/navigation
// ----------------------------
const pushMock = vi.fn();

vi.mock("next/font/google", () => ({
  Inter: () => ({
    style: {
      fontFamily: "mock-font",
    },
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// ----------------------------
// 🧪 Mock loadScript
// ----------------------------
vi.mock("@/utils/loadScript", () => ({
  loadScript: vi.fn().mockResolvedValue(true),
}));

// ----------------------------
// 🧪 Real Razorpay constructor mock
// ----------------------------
const openMock = vi.fn();
const onMock = vi.fn();

class MockRazorpay {
  open = openMock;
  on = onMock;
}

beforeEach(() => {
  pushMock.mockClear();
  openMock.mockClear();
  onMock.mockClear();

  (window as Window).Razorpay = MockRazorpay;
});

// ----------------------------
// Base props
// ----------------------------
const baseProps = {
  title: "Pro",
  price: "100",
  session: {
    user: {
      id: "123",
      name: "user",
      email: "test@test.com",
    },
  } as Session,
  children: "Pay Now",
} satisfies PaymentButtonProps;

// ----------------------------
// Tests
// ----------------------------

test("renders MuiNextLink when title = 'Free'", () => {
  render(
    <PaymentButton title="Free" price="0" session={null} redirectlink="/auth/signup">
      Continue
    </PaymentButton>
  );

  const link = screen.getByRole("link");
  expect(link).toHaveAttribute("href", "/free");
  expect(screen.getByRole("button")).toHaveTextContent("Continue");
});

test("redirects unauthenticated user to signin", async () => {
  render(<PaymentButton {...baseProps} session={null} />);

  await act(async () => {
    fireEvent.click(screen.getByRole("button"));
  });

  expect(pushMock).toHaveBeenCalledWith("/auth/signin");
});

test("fetches order when authenticated", async () => {
  const fakeOrder = { id: "order_1", amount: 100, currency: "INR" };

  vi.spyOn(global, "fetch").mockResolvedValue({
    json: async () => fakeOrder,
  } as Response);

  render(<PaymentButton {...baseProps} />);

  await act(async () => {
    fireEvent.click(screen.getByRole("button"));
  });

  await waitFor(() =>
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/payments/create-order"),
      expect.any(Object)
    )
  );
});

test("creates Razorpay instance and calls open()", async () => {
  const fakeOrder = { id: "order_1", amount: 100, currency: "INR" };

  vi.spyOn(global, "fetch").mockResolvedValue({
    json: async () => fakeOrder,
  } as Response);

  render(<PaymentButton {...baseProps} />);

  await act(async () => {
    fireEvent.click(screen.getByRole("button"));
  });

  await waitFor(() => {
    expect(openMock).toHaveBeenCalled();
  });
});

test("redirects to /dashboard after opening Razorpay", async () => {
  const fakeOrder = { id: "order_1", amount: 100, currency: "INR" };

  vi.spyOn(global, "fetch").mockResolvedValue({
    json: async () => fakeOrder,
  } as Response);

  render(<PaymentButton {...baseProps} />);

  await act(async () => {
    fireEvent.click(screen.getByRole("button"));
  });

  await waitFor(() => {
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });
});
