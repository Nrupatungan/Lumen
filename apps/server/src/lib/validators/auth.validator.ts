// validations/auth.ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password too short (min 6)"),
  image: z.url().optional(),
});

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export const requestPasswordResetSchema = z.object({
  email: z.email("Invalid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token required"),
  password: z.string().min(6, "Password too short (min 6)"),
});

// types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
