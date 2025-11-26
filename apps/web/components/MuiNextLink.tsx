"use client";

import NextLink from "next/link";
import Link, { LinkProps } from "@mui/material/Link";
import { Inter } from "next/font/google";
import { forwardRef } from "react";

const inter = Inter({ subsets: ["latin"] });

export default forwardRef<HTMLAnchorElement, LinkProps>(
  function MuiNextLink(props, ref) {
    return (
      <Link
        component={NextLink}
        ref={ref}
        {...props}
        sx={{
          fontFamily: inter.style.fontFamily,
          ...(props.sx || {}),
        }}
      />
    );
  }
);
