import crypto from "node:crypto";
import bcrypt from "bcrypt";
import User, { IUser } from "./user.model.js";
import VerificationToken from "./verification-token.model.js";
import { signJwt } from "../../utils/jwt.js";
import PasswordResetToken from "./password-reset-token.model.js";

const VERIFICATION_TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const PASSWORD_RESET_TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour

export class UserService {
  static async createUser(data: {
    name: string;
    email: string;
    password: string;
    image?: string;
  }) {
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      image: data.image,
    });
    return user.toJSON();
  }

  static async findByEmail(email: string) {
    const user = await User.findOne({ email });
    return user?.toJSON();
  }

  static async findById(id: string) {
    const user = await User.findById(id);
    return user?.toJSON();
  }

  static async verifyCredentials(email: string, password: string) {
    // include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) return null;
    if (!user.emailVerified) return null;
    const isValid = await user.comparePassword(password);
    if (!isValid) return null;
    return user?.toJSON();
  }

  static async createJwtForUser(user: IUser) {
    // include role and id in token payload
    const payload = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    return signJwt(payload, process.env.JWT_EXPIRES_IN || "7d");
  }

  // Verification token helpers
  static async createVerificationToken(userId: string) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
    await VerificationToken.create({ userId, token, expiresAt });
    return token;
  }

  static async verifyEmailToken(token: string) {
    const record = await VerificationToken.findOne({ token });
    if (!record) return null;
    // mark user verified
    await User.findByIdAndUpdate(record.userId, { emailVerified: true });
    await record.deleteOne();
    return true;
  }

  // Password reset
  static async createPasswordResetToken(userId: string) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);
    await PasswordResetToken.create({ userId, token, expiresAt });
    return token;
  }

  static async resetPassword(token: string, newPassword: string) {
    const record = await PasswordResetToken.findOne({ token });
    if (!record) return null;
    // hash new password and update user
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS || 10));
    const hashed = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(record.userId, { password: hashed });
    await record.deleteOne();
    return true;
  }
}
