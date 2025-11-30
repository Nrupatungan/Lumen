/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Razorpay } from "razorpay";
import { JWT } from "next-auth/jwt";
import { User, Session } from "next-auth";

declare global {
  interface Window {
    Razorpay: Razorpay;
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "admin" | "user";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user";
  }
}