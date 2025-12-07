import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!;
const FRONTEND_URL = process.env.FRONTEND_URL!;

export class ResendService {
  static async sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${FRONTEND_URL}/auth/verify-email?token=${token}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Your account needs verification</h2>
        <p>Click the link below to verify:</p>
        <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
      `,
    });
  }

  static async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${FRONTEND_URL}/auth/reset-password?token=${token}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      `,
    });
  }
}
