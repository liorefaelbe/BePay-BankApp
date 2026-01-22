import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import DonutSmallOutlinedIcon from "@mui/icons-material/DonutSmallOutlined";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { bepay, bepayAssets, bepayCardSx, bepayPageBgSx } from "../../ui/bepay";

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Paper
      sx={{
        ...bepayCardSx,
        p: { xs: 2, sm: 2.5 },
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${bepay.colors.borderSoft}`,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography sx={{ fontWeight: 950, mb: 0.25, color: "white" }}>{title}</Typography>
          <Typography variant="body2" sx={{ color: bepay.colors.text2 }}>
            {body}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Landing() {
  return (
    <Box
      sx={{
        ...bepayPageBgSx,
        background: `
          radial-gradient(85% 70% at 15% 20%, rgba(42,124,255,0.22), transparent 60%),
          radial-gradient(70% 60% at 85% 35%, rgba(55,211,156,0.18), transparent 62%),
          linear-gradient(180deg, #050a18 0%, #08112a 45%, #050a18 100%)
        `,
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1240,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: { xs: 6, sm: 8 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 5, md: 6 }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* LEFT: TEXT */}
          <Stack
            spacing={2.6}
            sx={{
              flex: 1,
              maxWidth: 660,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: "center", md: "flex-start" }}>
              <Box
                component="img"
                src={bepayAssets.logo}
                alt="BePay"
                sx={{ width: { xs: 82, sm: 98 }, height: "auto" }}
              />
              <Typography
                sx={{
                  fontWeight: 950,
                  fontSize: { xs: 58, sm: 78 },
                  letterSpacing: -1.1,
                  lineHeight: 1,
                  color: "white",
                }}
              >
                BePay
              </Typography>
            </Stack>

            <Box
              sx={{
                mx: { xs: "auto", md: 0 },
                width: "fit-content",
                py: 1,
                px: { xs: 1.75, sm: 2.25 },
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.78)",
                display: "inline-flex",
                alignItems: "center",
                gap: 1.1,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2">Banking, Your Way</Typography>
              <Box sx={{ opacity: 0.5 }}>•</Box>
              <Typography variant="body2">Simplify Your Finances</Typography>
              <Box sx={{ opacity: 0.5 }}>•</Box>
              <Typography variant="body2">Be Smart, Be Secure</Typography>
            </Box>

            <Typography
              sx={{
                fontWeight: 950,
                fontSize: { xs: 40, sm: 60 },
                letterSpacing: -1,
                lineHeight: 1.05,
                color: "white",
              }}
            >
              Banking Made Easy
              <Box component="span" sx={{ display: "block", fontWeight: 900, opacity: 0.95 }}>
                with BePay
              </Box>
            </Typography>

            <Typography
              sx={{
                color: bepay.colors.text2,
                fontSize: { xs: 16, sm: 18 },
                maxWidth: 600,
                mx: { xs: "auto", md: 0 },
              }}
            >
              Manage your money anytime, anywhere. Fast transfers, strong security, and clear insights — built for
              modern banking.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                maxWidth: 560,
                width: "100%",
                pt: 0.5,
                mx: { xs: "auto", md: 0 },
              }}
            >
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  borderRadius: 3,
                  fontWeight: 950,
                  py: 1.4,
                  fontSize: 22,
                  color: "white",
                  background: `linear-gradient(90deg, ${bepay.colors.accent}, ${bepay.colors.primary})`,
                  boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
                  "&:hover": { filter: "brightness(1.04)" },
                }}
              >
                Get Started
              </Button>

              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                size="large"
                fullWidth
                sx={{
                  borderRadius: 3,
                  fontWeight: 900,
                  py: 1.4,
                  fontSize: 22,
                  borderColor: "rgba(255,255,255,0.24)",
                  color: "rgba(255,255,255,0.92)",
                  "&:hover": { borderColor: "rgba(255,255,255,0.34)" },
                }}
              >
                Learn More
              </Button>
            </Stack>

            <Box
              sx={{
                mt: 0.75,
                width: 620,
                maxWidth: "100%",
                height: 6,
                backgroundImage: `url(${bepayAssets.divider})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.95,
                mx: { xs: "auto", md: 0 },
              }}
            />
          </Stack>

          {/* RIGHT: Image */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
              position: "relative",
            }}
          >
            {/* Glow behind image */}
            <Box
              sx={{
                position: "absolute",
                right: { xs: "10%", md: "8%" },
                top: { xs: "14%", md: "8%" },
                width: { xs: 380, md: 440 },
                height: { xs: 380, md: 440 },
                background:
                  "radial-gradient(circle at 35% 35%, rgba(42,124,255,0.28), transparent 62%), radial-gradient(circle at 70% 60%, rgba(55,211,156,0.22), transparent 62%)",
                filter: "blur(12px)",
                opacity: 0.95,
                pointerEvents: "none",
              }}
            />
            {/* Waves */}
            <Box
              component="img"
              src={bepayAssets.wavesTrail}
              sx={{
                position: "absolute",
                right: { xs: "6%", md: "-5%" },
                top: { xs: "0%", md: "-75%" },

                width: { xs: 600, md: 1090 },
                rotate: "5deg",
                opacity: 0.92,
                pointerEvents: "none",
                zIndex: 0,
                filter: "drop-shadow(0 0 28px rgba(42,124,255,0.28))",
              }}
            />
            {/* Phone Image */}
            <Box
              component="img"
              src={bepayAssets.heroImage}
              alt="BePay app preview"
              sx={{
                width: "100%",
                maxWidth: 560,
                height: "auto",
                borderRadius: 4,
                userSelect: "none",
                pointerEvents: "none",
                filter: "drop-shadow(0 34px 70px rgba(0,0,0,0.55))",
                position: "relative",
                zIndex: 1,
              }}
            />
          </Box>
        </Stack>

        {/* Features */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: 1040,
            mt: { xs: 5, sm: 6.5 },
            mx: "auto",
          }}
        >
          <FeatureCard
            icon={<SendOutlinedIcon sx={{ color: "rgba(255,255,255,0.9)" }} />}
            title="Fast Transfers"
            body="Send money in seconds. Quick and easy."
          />
          <FeatureCard
            icon={<VerifiedUserOutlinedIcon sx={{ color: "rgba(255,255,255,0.9)" }} />}
            title="Secure & Safe"
            body="Advanced protection to keep your data secure."
          />
          <FeatureCard
            icon={<DonutSmallOutlinedIcon sx={{ color: "rgba(255,255,255,0.9)" }} />}
            title="Track Your Spending"
            body="Monitor your transactions with clarity."
          />
        </Stack>
      </Box>
    </Box>
  );
}
