import React from "react";
import { beforeEach, test, expect, vi } from "vitest";
import PaymentButton, {
  type PaymentButtonProps,
} from "@/components/PaymentButton";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { Session } from "next-auth";

// --- Mocks ---
const pushMock = vi.fn();

vi.mock("next/font/google", () => ({
  Inter: () => ({ style: { fontFamily: "mock-font" } }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/utils/loadScript", () => ({
  loadScript: vi.fn().mockResolvedValue(true),
}));

// --- Razorpay Mock Setup ---
const rzpOpenMock = vi.fn();
const rzpOnMock = vi.fn();

// Define a class mock for Razorpay
class MockRazorpay {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_options: unknown) {}
  open = rzpOpenMock;
  on = rzpOnMock;
}

// Stub Env vars
vi.stubEnv("NEXT_PUBLIC_BACKEND_URL", "http://mock-api.com");
vi.stubEnv("NEXT_PUBLIC_RAZORPAY_KEY_ID", "mock_key_id");

beforeEach(() => {
  vi.clearAllMocks();
  // Assign the mock class to window
  (window as Window).Razorpay = MockRazorpay;
});

const baseProps: PaymentButtonProps = {
  title: "Pro",
  price: "100",
  session: {
    user: { id: "123", name: "user", email: "test@test.com" },
  } as Session,
  children: "Pay Now",
};

test("renders MuiNextLink when title = 'Free'", () => {
  render(
    <PaymentButton
      title="Free"
      price="0"
      session={null}
      redirectlink="/auth/signup"
    >
      Continue
    </PaymentButton>
  );

  const link = screen.getByRole("link", { name: /Continue/i });
  expect(link).toHaveAttribute("href", "/auth/signup");
});

test("redirects unauthenticated user to signin", () => {
  render(<PaymentButton {...baseProps} session={null} />);

  fireEvent.click(screen.getByRole("button", { name: /Pay Now/i }));
  expect(pushMock).toHaveBeenCalledWith("/auth/signin");
});

test("fetches order and opens Razorpay when authenticated", async () => {
  // Mock the Fetch response for create-order
  const fakeOrder = { id: "order_123", amount: 10000, currency: "INR" };

  const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
    json: async () => fakeOrder,
  } as Response);

  render(<PaymentButton {...baseProps} />);

  fireEvent.click(screen.getByRole("button", { name: /Pay Now/i }));

  // 1. Check Fetch
  await waitFor(() => {
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/payments/create-order"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ paymentOption: "Pro" }),
      })
    );
  });

  // 2. Check Razorpay Open
  await waitFor(() => {
    expect(rzpOpenMock).toHaveBeenCalled();
  });

  fetchSpy.mockRestore();
});
