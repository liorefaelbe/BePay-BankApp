import bgGradient from "../assets/bg-gradient.svg";
import bgWaves from "../assets/bg-waves.svg";
import orb1 from "../assets/glow-orb-1.svg";
import orb2 from "../assets/glow-orb-2.svg";
import divider from "../assets/divider-line.svg";
import logo from "../assets/bepay.logo.png";
import wavesTrail from "../assets//waves-trail.png";
import heroImage from "../assets/hero-phone.png";

export const bepayAssets = { bgGradient, bgWaves, orb1, orb2, divider, logo, wavesTrail, heroImage } as const;

export const bepay = {
  colors: {
    bg: "#050A18",
    bg2: "#07122B",
    surface: "rgba(10, 20, 40, 0.62)",
    surfaceStrong: "rgba(10, 20, 40, 0.78)",
    border: "rgba(255, 255, 255, 0.10)",
    borderSoft: "rgba(255, 255, 255, 0.08)",
    text: "rgba(255, 255, 255, 0.92)",
    text2: "rgba(255, 255, 255, 0.70)",
    primary: "#2A7CFF",
    accent: "#37D39C",
    danger: "#FF5C6C",
    link: "#6fe3b4",
    linkHover: "#8af0c8",
  },
  radii: {
    card: 16,
    input: 12,
    button: 12,
  },
  shadows: {
    card: "0 18px 50px rgba(0,0,0,0.45)",
    soft: "0 10px 30px rgba(0,0,0,0.35)",
  },
} as const;

export const bepayCardSx = {
  borderRadius: bepay.radii.card,
  background: bepay.colors.surface,
  border: `1px solid ${bepay.colors.borderSoft}`,
  boxShadow: bepay.shadows.card,
  backdropFilter: "blur(10px)",
} as const;

export const bepayInputSx = {
  "& .MuiInputBase-root": {
    borderRadius: bepay.radii.input,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.14)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.22)",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: bepay.colors.accent,
  },
  "& .MuiInputBase-input": {
    color: bepay.colors.text,
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.68)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: bepay.colors.accent,
  },
} as const;

export const bepayPageBgSx = {
  minHeight: "100vh",
  position: "relative",
  color: bepay.colors.text,
  backgroundColor: bepay.colors.bg,
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bgGradient})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 1,
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${bgWaves})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.85,
    pointerEvents: "none",
  },
} as const;
