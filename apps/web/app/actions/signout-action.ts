"use server";

import { signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signOutAction() {
  try {
    await signOut({ redirectTo: "/" });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
  }
}
