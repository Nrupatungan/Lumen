"use client";

import { useState } from "react";
import api from "@/lib/apiClient";
import { resetPasswordSchema } from "@/lib/validators/auth.validator";

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="max-w-md mx-auto py-16">
        <h1 className="text-3xl font-semibold">Invalid reset link</h1>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    const password = new FormData(e.currentTarget).get("password") as string;

    const parsed = resetPasswordSchema.safeParse({ password });
    if (!parsed.success) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        token,
        password,
      });
      setMessage("Password has been reset. You can now log in.");
    } catch (err) {
      setError("Invalid or expired token.");
      console.error(err);
    }
  }

  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-3xl font-semibold mb-6">Reset Password</h1>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="password"
          type="password"
          placeholder="New Password"
          className="border p-2 rounded"
        />
        <button className="bg-black text-white py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
}
