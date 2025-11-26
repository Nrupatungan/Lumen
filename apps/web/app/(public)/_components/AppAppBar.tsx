"use client";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "@/components/ColorModeDropdown";
import { SitemarkIcon } from "@/components/CustomIcon";
import MuiNextLink from "@/components/MuiNextLink";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <SitemarkIcon />
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                columnGap: { md: "14px" },
                boxSizing: "inherit",
              }}
            >
              <MuiNextLink
                href="#features"
                color="text.info"
                variant="body1"
                sx={{
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                Features
              </MuiNextLink>
              <MuiNextLink
                href="#testimonials"
                color="text.info"
                variant="body1"
                sx={{
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                Testimonials
              </MuiNextLink>
              <MuiNextLink
                href="#highlights"
                color="text.info"
                variant="body1"
                sx={{
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                Highlights
              </MuiNextLink>
              <MuiNextLink
                href="#pricing"
                color="text.info"
                variant="body1"
                sx={{
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                Pricing
              </MuiNextLink>
              <MuiNextLink
                href="#faq"
                color="text.info"
                variant="body1"
                sx={{
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                FAQ
              </MuiNextLink>
              <MuiNextLink
                href="#blog"
                color="text.info"
                variant="body1"
                sx={{
                  "&::before": {
                    display: "none",
                  },
                }}
              >
                Blog
              </MuiNextLink>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <MuiNextLink
              href="/auth/signin"
              sx={{
                "&::before": {
                  display: "none",
                },
              }}
            >
              <Button color="primary" variant="text" size="small">
                Sign in
              </Button>
            </MuiNextLink>
            <MuiNextLink
              href="/auth/signup"
              sx={{
                "&::before": {
                  display: "none",
                },
              }}
            >
              <Button color="primary" variant="contained" size="small">
                Sign up
              </Button>
            </MuiNextLink>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem>Features</MenuItem>
                <MenuItem>Testimonials</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Pricing</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Blog</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <MuiNextLink
                    href="/auth/signup"
                    sx={{
                      width: "100%",
                      "&::before": {
                        display: "none",
                      },
                    }}
                  >
                    <Button color="primary" variant="contained" fullWidth>
                      Sign up
                    </Button>
                  </MuiNextLink>
                </MenuItem>
                <MenuItem>
                  <MuiNextLink
                    href="/auth/signin"
                    sx={{
                      width: "100%",
                      "&::before": {
                        display: "none",
                      },
                    }}
                  >
                    <Button color="primary" variant="outlined" fullWidth>
                      Sign in
                    </Button>
                  </MuiNextLink>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
