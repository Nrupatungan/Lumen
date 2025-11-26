"use client"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MuiNextLink from '@/components/MuiNextLink';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import {SitemarkIcon} from '@/components/CustomIcon';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
      {'Copyright © '}
      <MuiNextLink color="text.secondary" href="https://mui.com/">
        Sitemark
      </MuiNextLink>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'center', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minWidth: { xs: '100%', sm: '60%' },
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '60%' } }}>
            <SitemarkIcon />
            <Typography variant="body2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              Join the newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Subscribe for weekly updates. No spams ever!
            </Typography>
            <InputLabel htmlFor="email-newsletter">Email</InputLabel>
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                id="email-newsletter"
                hiddenLabel
                size="small"
                variant="outlined"
                fullWidth
                aria-label="Enter your email address"
                placeholder="Your email address"
                slotProps={{
                  htmlInput: {
                    autoComplete: 'off',
                    'aria-label': 'Enter your email address',
                  },
                }}
                sx={(theme) => ({ 
                  width: '250px',
                  ...theme.applyStyles('dark', ({
                    "& .MuiInputBase-input::placeholder": {
                      color: theme.palette.grey["400"], // DARK MODE placeholder
                      opacity: 1,
                    },
                    "& .MuiInputBase-formControl": {
                      borderColor: "hsla(21.6, 11.7%, 76.5%, 0.6)",
                    }
                  }))
                })}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ flexShrink: 0 }}
              >
                Subscribe
              </Button>
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Product
          </Typography>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Features
          </MuiNextLink>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Testimonials
          </MuiNextLink>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Highlights
          </MuiNextLink>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Pricing
          </MuiNextLink>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            FAQs
          </MuiNextLink>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Company
          </Typography>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            About us
          </MuiNextLink>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Careers
          </MuiNextLink>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Press
          </MuiNextLink>
        </Box>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Legal
          </Typography>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Terms
          </MuiNextLink>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Privacy
          </MuiNextLink>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Contact
          </MuiNextLink>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: { xs: 4, sm: 8 },
          width: '100%',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <div>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Privacy Policy
          </MuiNextLink>
          <Typography sx={{ display: 'inline', mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <MuiNextLink color="text.secondary" variant="body2" href="#">
            Terms of Service
          </MuiNextLink>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: 'left', color: 'text.secondary' }}
        >
          <IconButton
            color="inherit"
            size="small"
            href="https://github.com/mui"
            aria-label="GitHub"
            sx={{ alignSelf: 'center' }}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://x.com/MaterialUI"
            aria-label="X"
            sx={{ alignSelf: 'center' }}
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://www.linkedin.com/company/mui/"
            aria-label="LinkedIn"
            sx={{ alignSelf: 'center' }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
