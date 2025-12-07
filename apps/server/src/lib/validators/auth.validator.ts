import { z } from "zod";

export const oauthLoginSchema = z.object({
  provider: z.enum(["github", "google"]),
  providerAccountId: z.string(),
  email: z.email("Invalid email"),
  name: z.string().min(1, "Name is required"),
  image: z.url().optional(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token required"),
  password: z.string().min(6, "Password too short (min 6)"),
});

// types
export type OAuthLoginInput = z.infer<typeof oauthLoginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
