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
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import {
  GoogleIcon,
  FacebookIcon,
  SitemarkIcon,
} from "@/components/CustomIcon";
import ColorModeIconDropdown from "@/components/ColorModeDropdown";
import Card from "@mui/material/Card";

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
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const name = document.getElementById("name") as HTMLInputElement;

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

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (nameError || emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("name"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    });
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
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                variant="outlined"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
                sx={(theme) => ({
                  ...theme.applyStyles("dark", {
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.grey["400"], // DARK MODE placeholder
                      opacity: 1,
                    },
                    "& .MuiInputBase-formControl": {
                      borderColor: "hsla(21.6, 11.7%, 76.5%, 0.6)",
                    },
                  }),
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? "error" : "primary"}
                sx={(theme) => ({
                  ...theme.applyStyles("dark", {
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.grey["400"], // DARK MODE placeholder
                      opacity: 1,
                    },
                    "& .MuiInputBase-formControl": {
                      borderColor: "hsla(21.6, 11.7%, 76.5%, 0.6)",
                    },
                  }),
                })}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
                sx={(theme) => ({
                  ...theme.applyStyles("dark", {
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.grey["400"], // DARK MODE placeholder
                      opacity: 1,
                    },
                    "& .MuiInputBase-formControl": {
                      borderColor: "hsla(21.6, 11.7%, 76.5%, 0.6)",
                    },
                  }),
                })}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  value="allowExtraEmails"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Google")}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Facebook")}
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                variant="body2"
                underline="hover"
                sx={{
                  alignSelf: "center",
                  "&::before": {
                    backgroundColor: "hsl(118, 98.4%, 47.8%)", // Dark mode color here
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
              </Link>
            </Typography>
          </Box>
        </Card>
      </CenteredContainer>
    </>
  );
}
