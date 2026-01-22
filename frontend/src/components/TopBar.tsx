import { AppBar, Box, Button, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useColorMode } from "../theme/ColorModeProvider";
import { bepayAssets } from "../ui/bepay";

export default function TopBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { mode, toggleMode } = useColorMode();
  const navigate = useNavigate();

  const homeHref = isAuthenticated ? "/profile" : "/";
  const isLight = mode === "light";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        background: isLight ? "rgba(255,255,255,0.9)" : "rgba(5,10,24,0.75)",
        borderBottom: "1px solid",
        borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box
          component={RouterLink}
          to={homeHref}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textDecoration: "none",
            color: isLight ? "text.primary" : "white",
          }}
        >
          <Box component="img" src={bepayAssets.logo} alt="BePay" sx={{ width: 28, height: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.2 }}>
            BePay
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Theme toggle */}
        <Tooltip title={isLight ? "Switch to dark" : "Switch to light"}>
          <IconButton onClick={toggleMode} sx={{ color: isLight ? "text.primary" : "white" }}>
            {isLight ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
        </Tooltip>

        <Box sx={{ width: 10 }} />

        {isAuthenticated ? (
          <>
            {/* Email */}
            <Typography
              variant="body2"
              sx={{
                mr: 1,
                color: isLight ? "text.secondary" : "rgba(255,255,255,0.75)",
              }}
            >
              {user?.email}
            </Typography>

            {/* Profile link */}
            <Button
              component={RouterLink}
              to="/profile"
              variant="text"
              size="small"
              sx={{
                color: isLight ? "text.primary" : "white",
                fontWeight: 700,
                textTransform: "none",
                mr: 1,
              }}
            >
              Profile
            </Button>

            <Button
              variant="outlined"
              sx={{
                color: isLight ? "text.primary" : "white",
                borderColor: isLight ? "rgba(0,0,0,0.23)" : "rgba(255,255,255,0.4)",
              }}
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button component={RouterLink} to="/login" sx={{ color: isLight ? "text.primary" : "white" }}>
              Log in
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" sx={{ ml: 1 }}>
              Sign up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
