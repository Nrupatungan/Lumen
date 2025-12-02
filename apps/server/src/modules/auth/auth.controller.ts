// controllers/auth.controller.ts
import { Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import { UserService } from "../user/user.service.js";
import User from "../user/user.model.js";
import {
  registerSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "../../lib/validators/auth.validator.js";
import { ResendService } from "../../services/resend.service.js";

/**
 * Register controller
 */
export const register: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = registerSchema.parse(req.body);

    const existing = await UserService.findByEmail(parsed.email);
    if (existing) {
      res.status(409).json({ message: "Email already in use" });
    }

    const user = await UserService.createUser(parsed);

    // Generate verification token
    const token = await UserService.createVerificationToken(
      user._id.toString()
    );

    // Send verification email through Resend
    await ResendService.sendVerificationEmail(user.email, token);

    res.status(201).json({
      message: "User created. Check your email for verification.",
      user: { id: user._id, email: user.email },
    });
  }
);

/**
 * Login controller (for Credentials flow)
 * This endpoint is used by Next.js authorize() to validate credentials.
 */
export const login: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = loginSchema.parse(req.body);
    const user = await UserService.verifyCredentials(
      parsed.email,
      parsed.password
    );

    if (!user) {
      res
        .status(401)
        .json({ message: "Invalid credentials or user not verified." });
      return;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }
);

/**
 * Verify email controller
 */
export const verifyEmail: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const token = String(req.query.token || req.body.token || "");
    if (!token) {
      res.status(400).json({ message: "Token required" });
    }
    const ok = await UserService.verifyEmailToken(token);

    if (!ok) {
      res.status(400).json({ message: "Invalid or expired token" });
    }

    res.json({ message: "Email verified" });
  }
);

/**
 * Request password reset (sends email with reset link containing token)
 */
export const requestPasswordReset: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = requestPasswordResetSchema.parse(req.body);
    const user = await UserService.findByEmail(parsed.email);

    // Do not reveal whether user exists
    if (!user) {
      res.json({ message: "If an account exists, a reset link will be sent." });
      return;
    }

    const token = await UserService.createPasswordResetToken(
      user._id.toString()
    );

    // Send reset email
    await ResendService.sendPasswordResetEmail(user.email, token);

    res.json({ message: "If an account exists, a reset link will be sent." });
  }
);

/**
 * Reset password
 */
export const resetPassword: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = resetPasswordSchema.parse(req.body);
    const ok = await UserService.resetPassword(parsed.token, parsed.password);
    if (!ok) {
      res.status(400).json({ message: "Invalid or expired token" });
    }
    res.json({ message: "Password reset successful" });
  }
);

/**
 * Example protected route
 */
export const getProfile: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  }
);
