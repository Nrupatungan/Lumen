"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/apiClient";
import { useSearchParams } from "next/navigation";

import {
  Box,
  Card,
  Typography,
  CircularProgress,
  Button,
  Fade,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function VerifyEmail() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    (async () => {
      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage("Email verified successfully! You can now log in.");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Invalid or expired verification link.");
      }
    })();
  }, [token]);

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        backgroundImage:
          "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 92%), hsl(0, 0%, 100%))",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(at 50% 50%, hsla(210, 100%, 20%, 0.5), hsl(220, 30%, 50%))",
        }),
      })}
    >
      <Card
        elevation={3}
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 4,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        {/* Heading */}
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Email Verification
        </Typography>

        {/* Loading */}
        {status === "loading" && (
          <Fade in={true}>
            <Box sx={{ py: 4 }}>
              <CircularProgress size={48} />
              <Typography mt={2}>{message}</Typography>
            </Box>
          </Fade>
        )}

        {/* Success */}
        {status === "success" && (
          <Fade in={true}>
            <Box sx={{ py: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
              <Typography mt={2} variant="h6">
                {message}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                href="/auth/signin"
                sx={{ mt: 3 }}
              >
                Go to Login
              </Button>
            </Box>
          </Fade>
        )}

        {/* Error */}
        {status === "error" && (
          <Fade in={true}>
            <Box sx={{ py: 4 }}>
              <ErrorIcon color="error" sx={{ fontSize: 60 }} />
              <Typography mt={2} variant="h6">
                {message}
              </Typography>

              <Button
                variant="outlined"
                color="error"
                href="/auth/signup"
                sx={{ mt: 3 }}
              >
                Go Back to Signup
              </Button>
            </Box>
          </Fade>
        )}
      </Card>
    </Box>
  );
}
