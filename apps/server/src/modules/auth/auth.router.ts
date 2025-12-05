import { Router } from "express";
import {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  oauthLogin,
  getProfile,
} from "./auth.controller.js";

import { authenticateJWT } from "../../middlewares/jwt.middleware.js";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/oauth-login", oauthLogin);
router.post("/verify-email", verifyEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

router.get("/me", authenticateJWT, getProfile);

export default router;
