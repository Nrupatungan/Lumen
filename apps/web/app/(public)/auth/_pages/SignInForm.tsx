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
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import ForgotPassword from "@/components/ForgotPassword";
import AppTheme from "@/components/theme/theme";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "@/components/CustomIcon";
import ColorModeIconDropdown from "@/components/ColorModeDropdown";
import Card from "@mui/material/Card";

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

export default function SignInForm(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
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
            [theme.breakpoints.up("sm")]: {
              width: "370px", // expands starting at sm
            },
          })}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <SitemarkIcon />
            <ColorModeIconDropdown
              sx={(theme) => ({
                ...theme.applyStyles("dark", {
                  borderColor: "hsla(218.6, 11.7%, 76.5%, 0.6)",
                }),
              })}
            />
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="standard"
                color={emailError ? "error" : "primary"}
                sx={(theme) => ({
                  ...theme.applyStyles("dark", {
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.grey["400"], // DARK MODE placeholder
                      opacity: 1,
                    },
                  }),
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="standard"
                color={passwordError ? "error" : "primary"}
                sx={(theme) => ({
                  ...theme.applyStyles("dark", {
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.grey["400"], // DARK MODE placeholder
                      opacity: 1,
                    },
                  }),
                })}
              />
            </FormControl>
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
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign in
            </Button>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "center" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign in with Google")}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign in with Facebook")}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                variant="body2"
                sx={{
                  alignSelf: "center",
                  "&::before": {
                    background: "hsl(171.8, 91.6%, 46.9%)",
                    opacity: 1,
                    bottom: "-1px",
                  },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Card>
      </CenteredContainer>
    </AppTheme>
  );
}
