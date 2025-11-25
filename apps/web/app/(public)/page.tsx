import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MuiNextLink from "@/components/MuiNextLink";
import ModeSwitch from "@/components/ModeSwitch";

export default function Home() {
  return (
    <Container maxWidth="md">
      <ModeSwitch sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <Box
        sx={{
          my: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI - Next.js App Router example in TypeScript
        </Typography>
        <MuiNextLink href="/about" color="secondary">
          Go to the about page
        </MuiNextLink>
      </Box>
    </Container>
  );
}
