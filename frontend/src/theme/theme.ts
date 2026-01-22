import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material/styles";
import { bepay } from "../ui/bepay";

export function buildTheme(mode: PaletteMode) {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: bepay.colors.primary,
      },

      secondary: {
        main: bepay.colors.accent,
      },

      background: {
        default: isLight ? "#f4f7fb" : "#050a18",
        paper: isLight ? "#ffffff" : "#0b1224",
      },

      text: {
        primary: isLight ? "rgba(10,20,40,0.9)" : "#ffffff",
        secondary: isLight ? "rgba(10,20,40,0.65)" : "rgba(255,255,255,0.7)",
      },

      divider: isLight ? "rgba(10,20,40,0.08)" : "rgba(255,255,255,0.12)",
    },

    shape: {
      borderRadius: 14,
    },

    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
    },

    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: isLight ? "1px solid rgba(10,20,40,0.08)" : "1px solid rgba(255,255,255,0.08)",
            backgroundImage: "none",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 700,
          },
          containedPrimary: {
            backgroundImage: `linear-gradient(90deg, ${bepay.colors.accent}, ${bepay.colors.primary})`,
            boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
            "&:hover": {
              filter: "brightness(1.05)",
              boxShadow: "0 14px 34px rgba(0, 0, 0, 0.2)",
            },
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isLight ? "rgba(10,20,40,0.08)" : "rgba(255,255,255,0.12)",
          },
        },
      },
    },
  });
}
