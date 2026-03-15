import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { brandTheme } from "../../theme/brandTheme";

/**
 * Public area wrapper:
 * - Forces BePay public pages to use a fixed dark MUI theme
 * - Does NOT apply CssBaseline here (already applied globally)
 * - Keeps existing page-level visuals (AuthShell/Landing backgrounds) untouched
 */
export default function BrandShell({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={brandTheme}>{children}</ThemeProvider>;
}
