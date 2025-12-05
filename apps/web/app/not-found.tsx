"use client";

import { Box, Button, Typography, Stack, Card } from "@mui/material";
import MuiNextLink from "@/components/MuiNextLink";
import AppTheme from "@/components/theme/theme";

export default function NotFound() {
  return (
    <AppTheme>
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Card
          variant="outlined"
          sx={(theme) => ({
            maxWidth: 500,
            width: "100%",
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            boxShadow:
              "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
            ...theme.applyStyles("dark", {
              boxShadow:
                "hsla(220, 30%, 5%, 0.4) 0px 5px 15px, hsla(220, 25%, 10%, 0.3) 0px 15px 35px -5px",
            }),
          })}
        >
          <Stack spacing={2}>
            <Typography variant="h1" sx={{ fontSize: "4rem", fontWeight: 700 }}>
              404
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Page Not Found
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Sorry, the page you’re looking for doesn’t exist or has been
              moved.
            </Typography>

            <Button
              component={MuiNextLink}
              href="/"
              variant="contained"
              size="large"
              fullWidth
            >
              Back to home
            </Button>
          </Stack>
        </Card>
      </Box>
    </AppTheme>
  );
}
