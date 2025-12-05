"use server"

import { signIn } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function OAuthLogin(provider: "google" | "github") {
    try {
      await signIn(provider, {redirectTo: "/dashboard"});
    } catch (err) {
      console.error(err);
      if(isRedirectError(err)){
        throw err
      }
    }
}