import { RequestHandler } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AuthService } from "./auth.service.js";
import { UserService } from "../user/user.service.js";

import {
  registerSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  oauthLoginSchema,
} from "../../lib/validators/auth.validator.js";

import { ResendService } from "../../services/resend.service.js";
import Account from "../account/account.model.js";
import User from "../user/user.model.js";

export const register: RequestHandler = asyncHandler(async (req, res) => {
  const parsed = registerSchema.parse(req.body);

  const existing = await UserService.findByEmail(parsed.email);
  if (existing) {
    res.status(409).json({ message: "Email already in use" });
    return;
  }

  const user = await UserService.createUser(parsed);

  const token = await AuthService.createEmailVerificationToken(
    user._id.toString()
  );

  await ResendService.sendVerificationEmail(parsed.email, token);

  res.status(201).json({
    message: "User created. Check your email for verification.",
  });
});

/** For Credentials Provider login */
export const login: RequestHandler = asyncHandler(async (req, res) => {
  const parsed = loginSchema.parse(req.body);

  const user = await AuthService.verifyCredentials(
    parsed.email,
    parsed.password
  );

  if (!user) {
    res.status(401).json({ message: "Invalid credentials." });
    return;
  }

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const oauthLogin: RequestHandler = asyncHandler(async (req, res) => {
  const parsed = oauthLoginSchema.parse(req.body);
  const {provider, providerAccountId, email, name, image} = parsed;

  if (!provider || !providerAccountId) {
    res.status(400).json({ message: "Invalid OAuth payload" });
    return;
  }

  // Check if account exists
  const account = await Account.findOne({ provider, providerAccountId }).lean();

  let user;

  if (account) {
    user = await UserService.findById(account.userId.toString());
  } else {
    // Create user if doesn't exist
    user = await UserService.findByEmail(email);

    if (!user) {
      user = (await User.create({
        email,
        name,
        image,
        emailVerified: new Date(),
        role: "user",
      })).toJSON();
    }

    // Create OAuth account link
    await Account.create({
      userId: user._id,
      provider,
      providerAccountId,
    });
  }

  // Return user data → Auth.js will embed into JWE session
  res.json({
    user: {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      role: user?.role,
      image: user?.image,
    },
  });
});

export const verifyEmail: RequestHandler = asyncHandler(async (req, res) => {
  const token = req.body.token ?? req.query.token;
  if (!token){
    res.status(400).json({ message: "Token required" });
    return;
  } 

  const ok = await AuthService.verifyEmailToken(String(token));
  if (!ok) {
    res.status(400).json({ message: "Invalid or expired token" });
    return;
  }

  res.json({ message: "Email verified" });
});

export const requestPasswordReset: RequestHandler = asyncHandler(
  async (req, res) => {
    const parsed = requestPasswordResetSchema.parse(req.body);
    const user = await UserService.findByEmail(parsed.email);

    if (user) {
      const token = await AuthService.createPasswordResetToken(
        user._id.toString()
      );

      await ResendService.sendPasswordResetEmail(user.email!, token);
    }

    res.json({
      message: "If an account exists, a reset link will be sent.",
    });
  }
);

export const resetPassword: RequestHandler = asyncHandler(async (req, res) => {
  const parsed = resetPasswordSchema.parse(req.body);

  const ok = await AuthService.resetPassword(parsed.token, parsed.password);

  if (!ok) {
    res.status(400).json({ message: "Invalid or expired token" });
    return;
  }

  res.json({ message: "Password reset successful" });
});

/** Example protected route (credentials-based) */
export const getProfile: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await UserService.findById(req.user.id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ user });
});
