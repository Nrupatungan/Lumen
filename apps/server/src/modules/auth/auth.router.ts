// routes/auth.routes.ts
import { Router } from "express";
import { register, login, verifyEmail, requestPasswordReset, resetPassword, getProfile } from "../auth/auth.controller.js";
import { authenticateToken } from "../../middlewares/jwt.middleware.js";

const router: Router = Router();

// Unprotected endpoints (used by Next.js Credentials provider)
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

// Protected example
router.get("/me", authenticateToken, getProfile);

export default router;
