import asyncHandler from "express-async-handler"
import { getRazorpay } from "./payment.service.js";
import { RequestHandler, Request, Response } from "express";
import crypto from "node:crypto";

const paymentOptions: Record<string, { amount: string }> = {
  Pro: {
    amount: "15",
  },
  Enterprise: {
    amount: "30",
  },
};

const razorpayInstance = getRazorpay();

const createOrders: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { paymentOption } = req.body;

  if (!paymentOption || !paymentOptions[paymentOption]) {
    res.status(400).json({ message: "Invalid payment option" });
  }

  try {
    const fetchedAmount = paymentOptions[paymentOption]?.amount;

    const options = {
      amount: Number(fetchedAmount) * 100,
      currency: "USD",
      receipt: "receipt_" + Math.random().toString(36).substring(5),
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});

const verifyPayments: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const generatedHmac = crypto.createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET!
    );
    const hash = generatedHmac.update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    );
    const generated_signature = hash.digest("hex");

    if (generated_signature === razorpay_signature) {
      res.status(200).json({ status: "ok" });
      console.log("Payment verification successful");
    } else {
      res.status(400).json({ status: "verification_failed" });
      console.error("Payment verification failed");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error verifying payment" });
  }
});
export { createOrders, verifyPayments };
