import { type Razorpay } from "razorpay";

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: Razorpay;
  }
}
