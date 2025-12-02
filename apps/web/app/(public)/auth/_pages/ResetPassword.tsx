"use client";

import {
  Box,
  Card,
  Typography,
  CircularProgress,
  Button,
  Fade,
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/lib/apiClient";
import {
  ResetPasswordInput,
  resetPasswordSchema,
} from "@/lib/validators/auth.validator";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "form" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("Checking reset link...");

  const { register, handleSubmit, formState } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid password reset link.");
      return;
    }
    setStatus("form");
  }, [token]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setStatus("loading");
    setMessage("Resetting your password...");

    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });

      setStatus("success");
      setMessage("Password has been reset. You can now log in.");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Invalid or expired reset token.");
    }
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        backgroundImage:
          "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 92%), white)",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(at 50% 50%, hsla(210, 100%, 20%, .5), hsl(220, 30%, 50%))",
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
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Reset Password
        </Typography>

        {/* LOADING */}
        {status === "loading" && (
          <Fade in={true}>
            <Box sx={{ py: 4 }}>
              <CircularProgress size={48} />
              <Typography mt={2}>{message}</Typography>
            </Box>
          </Fade>
        )}

        {/* FORM */}
        {status === "form" && (
          <Fade in={true}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                textAlign: "left",
              }}
            >
              {/* PASSWORD */}
              <FormControl>
                <FormLabel htmlFor="password">New Password</FormLabel>
                <TextField
                  fullWidth
                  id="password"
                  type="password"
                  placeholder="••••••"
                  autoComplete="new-password"
                  {...register("password")}
                  error={!!formState.errors.password}
                  helperText={formState.errors.password?.message}
                  sx={(theme) => ({
                    ...theme.applyStyles("dark", {
                      "& .MuiInputBase-input::placeholder": {
                        color: theme.palette.grey["400"],
                        opacity: 1,
                      },
                      "& .MuiInputBase-formControl": {
                        borderColor: "hsla(21.6, 11.7%, 76.5%, 0.6)",
                      },
                      "& .MuiFormHelperText-root.Mui-error": {
                        color: theme.palette.error.light,
                        marginLeft: "0px",
                      },
                    }),
                  })}
                />
              </FormControl>

              {/* CONFIRM PASSWORD */}
              <FormControl>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  error={!!formState.errors.confirmPassword}
                  helperText={formState.errors.confirmPassword?.message}
                  sx={(theme) => ({
                    ...theme.applyStyles("dark", {
                      "& .MuiInputBase-input::placeholder": {
                        color: theme.palette.grey["400"],
                        opacity: 1,
                      },
                      "& .MuiInputBase-formControl": {
                        borderColor: "hsla(21.6, 11.7%, 76.5%, 0.6)",
                      },
                      "& .MuiFormHelperText-root.Mui-error": {
                        color: theme.palette.error.light,
                        marginLeft: "0px",
                      },
                    }),
                  })}
                />
              </FormControl>

              <Button type="submit" variant="contained" fullWidth>
                Reset Password
              </Button>
            </Box>
          </Fade>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <Fade in={true}>
            <Box sx={{ py: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
              <Typography mt={2} variant="h6">
                {message}
              </Typography>

              <Button variant="contained" href="/auth/signin" sx={{ mt: 3 }}>
                Go to Login
              </Button>
            </Box>
          </Fade>
        )}

        {/* ERROR */}
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
