"use client";

import NextLink from "next/link";
import Link, { LinkProps } from "@mui/material/Link";
import { forwardRef } from "react";

export default forwardRef<HTMLAnchorElement, LinkProps>(
  function MuiNextLink(props, ref) {
    return <Link component={NextLink} ref={ref} {...props} />;
  }
);
