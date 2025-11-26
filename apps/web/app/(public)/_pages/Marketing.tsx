import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppTheme from "@/components/theme/theme";
import AppAppBar from "@/app/(public)/_components/AppAppBar";
import Hero from "@/app/(public)/_components/Hero";
import LogoCollection from "@/app/(public)/_components/LogoCollection";
import Highlights from "@/app/(public)/_components/Highlights";
import Pricing from "@/app/(public)/_components/Pricing";
import Features from "@/app/(public)/_components/Features";
import Testimonials from "@/app/(public)/_components/Testimonials";
import FAQ from "@/app/(public)/_components/FAQ";
import Footer from "@/app/(public)/_components/Footer";

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
