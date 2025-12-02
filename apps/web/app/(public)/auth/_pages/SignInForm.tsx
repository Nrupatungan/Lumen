"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";

import ForgotPassword from "@/components/ForgotPassword";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "@/components/CustomIcon";
import ColorModeIconDropdown from "@/components/ColorModeDropdown";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validators/auth.validator";
import MuiNextLink from "@/components/MuiNextLink";
import { signInAction } from "@/app/actions/signin-action";
import { CircularProgress } from "@mui/material";

const SignInBackground = styled("div")(({ theme }) => ({
  position: "fixed",
  inset: 0,
  zIndex: -1,
  width: "100%",
  height: "100dvh",
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 92%), hsl(0, 0%, 100%))",
  ...theme.applyStyles("dark", {
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 20%, 0.5), hsl(220, 30%, 50%))",
  }),
}));

const CenteredContainer = styled("div")(({ theme }) => ({
  minHeight: "100dvh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(2),
  position: "relative",
}));

export default function SignInForm() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const { register, handleSubmit, formState, setError } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);

    const res = await signInAction(data);

    setLoading(false);
    if (!res.success) {
      setError("root", { message: res.error });
    } else {
      setSuccess(res.message);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInBackground />

      <CenteredContainer>
        <Card
          variant="outlined"
          sx={(theme) => ({
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
            [theme.breakpoints.up("sm")]: { width: "370px" },
          })}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <SitemarkIcon />
            <ColorModeIconDropdown />
          </Box>

          <Typography component="h1" variant="h4">
            Sign in
          </Typography>

          {/* Error message */}
          {formState.errors.root && (
            <Typography
              color="error"
              sx={(theme) => ({
                mb: 1,
                color: theme.palette.error.light,
                fontWeight: "600",
              })}
            >
              {formState.errors.root.message}
            </Typography>
          )}

          {/* Success message */}
          {formState.isSubmitSuccessful && (
            <Typography
              color="success"
              sx={(theme) => ({
                mb: 1,
                color: theme.palette.success.light,
                fontWeight: "600",
              })}
            >
              {success}
            </Typography>
          )}

          {/* FORM */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Email */}
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                fullWidth
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                {...register("email")}
                error={!!formState.errors.email}
                helperText={formState.errors.email?.message}
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
                    },
                  }),
                })}
              />
            </FormControl>

            {/* Password */}
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                fullWidth
                id="password"
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
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
                    },
                  }),
                })}
              />
            </FormControl>

            {/* Remember Me */}
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  sx={(theme) => ({
                    ...theme.applyStyles("dark", {
                      borderColor: "hsla(218.6, 11.7%, 76.5%, 0.6)",
                    }),
                  })}
                />
              }
              label="Remember me"
            />

            {/* Forgot Password */}
            <ForgotPassword open={open} handleClose={() => setOpen(false)} />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={(theme) => ({
                "&:disabled": {
                  color: theme.palette.info.contrastText,
                },
                ...theme.applyStyles("dark", {
                  "&:disabled": {
                    color: theme.palette.info.main,
                  },
                }),
              })}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign in"
              )}
            </Button>

            {/* Open Forgot Password Modal */}
            <MuiNextLink
              component="button"
              type="button"
              onClick={() => setOpen(true)}
              variant="body2"
              underline="hover"
              sx={{
                alignSelf: "center",
                "&::before": {
                  backgroundColor: "hsl(118, 98.4%, 47.8%)",
                  opacity: "0.6",
                  bottom: "-2px",
                },
                "&:hover": {
                  textDecorationColor: "hsl(118, 98.4%, 47.8%)",
                  textUnderlinePosition: "under",
                },
              }}
            >
              Forgot your password?
            </MuiNextLink>
          </Box>

          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>

          {/* OAuth Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => alert("Google Sign-in coming soon")}
            >
              Sign in with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={() => alert("Facebook Sign-in coming soon")}
            >
              Sign in with Facebook
            </Button>

            <Typography sx={{ textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <MuiNextLink
                href="/auth/signup"
                variant="body2"
                underline="hover"
                sx={{
                  alignSelf: "center",
                  "&::before": {
                    backgroundColor: "hsl(118, 98.4%, 47.8%)",
                    opacity: "0.6",
                    bottom: "-2px",
                  },
                  "&:hover": {
                    textDecorationColor: "hsl(118, 98.4%, 47.8%)",
                    textUnderlinePosition: "under",
                  },
                }}
              >
                Sign up
              </MuiNextLink>
            </Typography>
          </Box>
        </Card>
      </CenteredContainer>
    </>
  );
}
