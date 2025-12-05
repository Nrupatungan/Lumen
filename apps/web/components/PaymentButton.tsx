"use client";

import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import MuiNextLink from "./MuiNextLink";
import { useRouter } from "next/navigation";
import { INormalizeError } from "razorpay/dist/types/api";
import { Orders } from "razorpay/dist/types/orders";
import { Session } from "next-auth";
import { loadScript } from "@/utils/loadScript";

export interface PaymentButtonProps extends ButtonProps {
  title: string;
  price: string;
  redirectlink?: string;
  session: Session | null;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

function PaymentButton(props: PaymentButtonProps) {
  const router = useRouter();

  async function displayRazorpay() {
    if (!props.session?.user) {
      router.push("/auth/signin");
      return;
    }

    const res = await loadScript(
      process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_PAGE as string
    );

    if (!res) {
      alert("Razropay failed to load!!");
      return;
    }

    const order: Orders.RazorpayOrder = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentOption: props.title }),
      }
    ).then((t) => t.json());

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits.
      currency: order.currency,
      name: "Lumen AI",
      description: "Test Transaction",
      image:
        "https://github.com/Nrupatungan/Lumen/blob/main/apps/web/public/app-icon.svg",
      order_id: order.id,
      handler: async function (response: RazorpayResponse) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;
        const paymentValidation = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/verify-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            }),
          }
        ).then((t) => t.json());

        if (paymentValidation.status === "ok") {
          console.log("Payment verification successful");
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: INormalizeError) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata);
      });
      rzp.open();
    } else {
      console.error("Razorpay script not loaded.");
    }

    router.push("/dashboard");
  }

  if (props.title === "Free") {
    return (
      <MuiNextLink
        href={props.redirectlink}
        sx={{
          "&::before": {
            display: "none",
          },
          width: "100%",
        }}
      >
        <Button {...props}>{props.children}</Button>
      </MuiNextLink>
    );
  }

  return (
    <Button onClick={displayRazorpay} {...props}>
      {props.children}
    </Button>
  );
}

export default PaymentButton;
