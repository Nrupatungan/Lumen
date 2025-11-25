import * as React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import AppTheme from "@/components/theme/theme";

export const metadata: Metadata = {
  title: "Lumen AI",
  description: "An AI Knowledge base Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <AppTheme>
            <CssBaseline />
            {children}
          </AppTheme>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
