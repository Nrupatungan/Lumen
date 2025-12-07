import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { PasswordResetToken, User, VerificationToken } from "@repo/db";
import { RegisterInput } from "@repo/shared";

const EMAIL_VERIFY_TTL = 1000 * 60 * 60 * 24; // 24h
const PASSWORD_RESET_TTL = 1000 * 60 * 60; // 1h

export class AuthService {
  static async verifyCredentials(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.emailVerified) return null;

    const ok = await user.comparePassword(password);
    if (!ok) return null;

    const safeUser = user.toObject();
    delete safeUser.password;

    return safeUser;
  }

  static async createEmailVerificationToken(userId: string) {
    const token = crypto.randomBytes(32).toString("hex");

    await VerificationToken.create({
      identifier: userId,
      token,
      expires: new Date(Date.now() + EMAIL_VERIFY_TTL),
    });

    return token;
  }

  static async verifyEmailToken(token: string) {
    const record = await VerificationToken.findOne({ token });
    if (!record) return false;

    if (record.expires < new Date()) {
      await record.deleteOne();
      return false;
    }

    await User.findByIdAndUpdate(record.identifier, {
      emailVerified: new Date(),
    });

    await VerificationToken.deleteOne({ _id: record._id });
    return true;
  }

  static async createPasswordResetToken(userId: string) {
    const token = crypto.randomBytes(32).toString("hex");

    await PasswordResetToken.create({
      userId,
      token,
      expires: new Date(Date.now() + PASSWORD_RESET_TTL),
    });

    return token;
  }

  static async resetPassword(token: string, newPassword: string) {
    const record = await PasswordResetToken.findOne({ token });
    if (!record) return false;

    if (record.expires < new Date()) {
      await record.deleteOne();
      return false;
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(record.userId, { password: hashed });
    await record.deleteOne();

    return true;
  }

  static async createUser(data: RegisterInput) {
    const user = await User.create(data);
    return user;
  }

  static async findUserByEmail(email: string) {
    const user = await User.findOne({ email }).lean();
    return user;
  }

  static async findUserById(id: string) {
    const user = await User.findById(id).lean();
    return user;
  }
}
