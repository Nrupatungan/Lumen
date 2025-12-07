"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import MuiNextLink from "@/components/MuiNextLink";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { GoogleIcon, GithubIcon, SitemarkIcon } from "@/components/CustomIcon";
import ColorModeIconDropdown from "@/components/ColorModeDropdown";
import Card from "@mui/material/Card";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/apiClient";
import { CircularProgress } from "@mui/material";
import { OAuthLogin } from "@/actions/oauth-action";
import { RegisterInput, registerSchema } from "@repo/shared";

const SignUpBackground = styled("div")(({ theme }) => ({
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

export default function SignUpForm() {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");

  const { register, handleSubmit, formState, setError } =
    useForm<RegisterInput>({
      resolver: zodResolver(registerSchema),
    });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/register", data);

      if (!res) {
        setError("root", { message: "Email already in use" });
      } else {
        // Redirect or show success (your choice)
        setSuccess(res.data.message);
        // setTimeout(() => {
        //   window.location.href = "/auth/signin";
        // }, 2000)
      }
    } catch (error) {
      console.error(error);
      setError("root", { message: "Something went wrong." });
    }

    setLoading(false);
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignUpBackground />
      <CenteredContainer>
        <Card
          variant="outlined"
          sx={(theme) => ({
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
            [theme.breakpoints.up("sm")]: {
              width: "370px",
            },
          })}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <SitemarkIcon />
            <ColorModeIconDropdown />
          </Box>

          <Typography component="h1" variant="h4">
            Sign up
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
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Full Name */}
            <FormControl>
              <FormLabel
                htmlFor="name"
                sx={(theme) => ({
                  ...theme.applyStyles("dark", {
                    color: theme.palette.info.light,
                  }),
                })}
              >
                Full name
              </FormLabel>
              <TextField
                id="name"
                placeholder="Jon Snow"
                fullWidth
                {...register("name")}
                error={!!formState.errors.name}
                helperText={formState.errors.name?.message}
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

            {/* Email */}
            <FormControl>
              <FormLabel
                htmlFor="email"
                sx={(theme) => ({
                  ...theme.applyStyles("dark", {
                    color: theme.palette.info.light,
                  }),
                })}
              >
                Email
              </FormLabel>
              <TextField
                id="email"
                placeholder="you@example.com"
                fullWidth
                {...register("email")}
                error={!!formState.errors.email}
                helperText={formState.errors.email?.message}
                sx={(theme) => ({
                  ...theme.applyStyles("dark", {
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.grey["400"], // DARK MODE placeholder
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
              <FormLabel
                htmlFor="password"
                sx={(theme) => ({
                  ...theme.applyStyles("dark", {
                    color: theme.palette.info.light,
                  }),
                })}
              >
                Password
              </FormLabel>
              <TextField
                id="password"
                type="password"
                placeholder="••••••"
                fullWidth
                {...register("password")}
                error={!!formState.errors.password}
                helperText={formState.errors.password?.message}
                sx={(theme) => ({
                  ...theme.applyStyles("dark", {
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.grey["400"], // DARK MODE placeholder
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

            {/* Optional subscribe */}
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  sx={(theme) => ({
                    ...theme.applyStyles("dark", {
                      borderColor: "hsla(218.6, 11.7%, 76.5%, 0.6)",
                    }),
                  })}
                />
              }
              label="I want to receive updates via email."
            />

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign up"
              )}
            </Button>
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
              onClick={async () => {
                await OAuthLogin("google");
              }}
            >
              Sign up with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GithubIcon />}
              onClick={async () => {
                await OAuthLogin("github");
              }}
            >
              Sign up with Github
            </Button>

            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <MuiNextLink
                href="/auth/signin"
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
                Sign in
              </MuiNextLink>
            </Typography>
          </Box>
        </Card>
      </CenteredContainer>
    </>
  );
}
