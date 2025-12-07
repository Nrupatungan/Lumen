import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password too short (min 6)"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
