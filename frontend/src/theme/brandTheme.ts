import { createTheme } from "@mui/material/styles";

/**
 * Fixed dark theme for public pages (pre-auth).
 * This prevents MUI controls (TextField, Link, etc.) from reacting to the app's mode toggle.
 */
export const brandTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#050a18",
      paper: "rgba(255,255,255,0.06)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.72)",
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily:
      'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
  },
});
