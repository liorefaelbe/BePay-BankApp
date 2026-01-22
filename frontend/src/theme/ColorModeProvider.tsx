import { createContext, useContext, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { buildTheme } from "./theme";

type ColorModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
  setMode: (mode: PaletteMode) => void;
};

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

const STORAGE_KEY = "bankapp_color_mode";

function getInitialMode(): PaletteMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "dark" || saved === "light" ? saved : "light";
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<PaletteMode>(getInitialMode());

  function setMode(nextMode: PaletteMode) {
    localStorage.setItem(STORAGE_KEY, nextMode);
    setModeState(nextMode);
  }

  function toggleMode() {
    setMode(mode === "light" ? "dark" : "light");
  }

  const theme = useMemo(() => buildTheme(mode), [mode]);

  const value = useMemo<ColorModeContextValue>(() => ({ mode, toggleMode, setMode }), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error("useColorMode must be used within ColorModeProvider");
  return ctx;
}
