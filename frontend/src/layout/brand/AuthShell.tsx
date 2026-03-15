import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { bepay, bepayAssets, bepayCardSx, bepayPageBgSx } from "../../ui/bepay";

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: number;
};

export default function AuthShell({ children, title, subtitle, maxWidth = 520 }: Props) {
  return (
    <Box
      sx={{
        ...bepayPageBgSx,
        minHeight: "calc(100vh - 64px)", // space for PublicLayout AppBar
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 5, sm: 7 },

        // Premium navy background (same language as landing)
        background: `
          radial-gradient(85% 70% at 15% 20%, rgba(42,124,255,0.22), transparent 60%),
          radial-gradient(70% 60% at 85% 35%, rgba(55,211,156,0.18), transparent 62%),
          linear-gradient(180deg, #050a18 0%, #08112a 45%, #050a18 100%)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glows (never capture clicks) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: "-20%",
            top: "-30%",
            width: 520,
            height: 520,
            background: "radial-gradient(circle at 30% 30%, rgba(42,124,255,0.20), transparent 60%)",
            filter: "blur(18px)",
            opacity: 0.9,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: "-20%",
            bottom: "-35%",
            width: 560,
            height: 560,
            background: "radial-gradient(circle at 70% 60%, rgba(55,211,156,0.16), transparent 62%)",
            filter: "blur(18px)",
            opacity: 0.85,
          }}
        />
      </Box>

      <Box sx={{ width: "100%", maxWidth, position: "relative", zIndex: 1 }}>
        <Box sx={{ position: "relative" }}>
          {/* Card glow behind (never capture clicks) */}
          <Box
            sx={{
              position: "absolute",
              inset: -90,
              background:
                "radial-gradient(circle at 30% 30%, rgba(42,124,255,0.22), transparent 55%), radial-gradient(circle at 70% 60%, rgba(55,211,156,0.18), transparent 58%)",
              filter: "blur(16px)",
              opacity: 0.9,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <Paper
            sx={{
              ...bepayCardSx,
              position: "relative",
              zIndex: 1, // ✅ ensures inputs/buttons are above any overlays
              overflow: "hidden",
              p: { xs: 2.5, sm: 3 },
              borderRadius: 4,
              border: `1px solid ${bepay.colors.borderSoft}`,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",

              "& a": {
                color: bepay.colors.link,
                textDecoration: "none",
                fontWeight: 700,
              },
              "& a:hover": {
                color: bepay.colors.linkHover,
                textDecoration: "underline",
              },
              "& a:visited": {
                color: bepay.colors.link,
              },
            }}
          >
            {/* Brand header */}
            <Stack spacing={1.4} alignItems="center" textAlign="center" sx={{ mb: 2.25 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                <Box component="img" src={bepayAssets.logo} alt="BePay" sx={{ width: 56, height: 56 }} />
                <Typography
                  sx={{
                    fontWeight: 950,
                    letterSpacing: -0.8,
                    lineHeight: 1,
                    fontSize: { xs: 34, sm: 40 },
                    color: "white",
                  }}
                >
                  BePay
                </Typography>
              </Stack>

              {title ? (
                <Typography
                  sx={{
                    fontWeight: 950,
                    letterSpacing: -0.5,
                    color: "white",
                    fontSize: { xs: 22, sm: 26 },
                  }}
                >
                  {title}
                </Typography>
              ) : null}

              {subtitle ? <Typography sx={{ color: bepay.colors.text2, maxWidth: 420 }}>{subtitle}</Typography> : null}

              <Box
                sx={{
                  mt: 0.5,
                  width: 260,
                  maxWidth: "100%",
                  height: 6,
                  backgroundImage: `url(${bepayAssets.divider})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.95,
                }}
              />
            </Stack>

            {children}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
