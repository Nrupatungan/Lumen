"use server"

import { signIn } from "@/auth";
import { LoginInput } from "@/lib/validators/auth.validator";

type Res =
    {success: true, message: string} |
    {success: false, error: string}

export async function signInAction(formData: LoginInput): Promise<Res>{
    try {
       await signIn("credentials", {
        ...formData,
        redirect: false,
        });

        return {success: true, message: "You've logged in successfully"};
    } catch (error) {
        console.error(error)
        return {success: false, error: "Invalid credentials or user not verified."}
    }
}