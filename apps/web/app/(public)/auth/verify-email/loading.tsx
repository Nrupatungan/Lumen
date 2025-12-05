"use client";

import { Box, CircularProgress, Typography, Fade, Card } from "@mui/material";

export default function Loading() {
  return (
    <Fade in timeout={500}>
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
            p: 4,
            borderRadius: 3,
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          <CircularProgress size={56} sx={{ mb: 3 }} />

          <Typography variant="h5" fontWeight="600" mb={1}>
            Loading...
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Preparing your verif email page. Please wait.
          </Typography>
        </Card>
      </Box>
    </Fade>
  );
}
