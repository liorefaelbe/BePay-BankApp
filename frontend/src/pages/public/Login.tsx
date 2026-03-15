import { useState } from "react";
import { Alert, Button, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { api } from "../../lib/api";
import { useAuth } from "../../auth/AuthContext";
import AuthShell from "../../layout/brand/AuthShell";
import { bepay, bepayInputSx } from "../../ui/bepay";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      // login returns token + user -> no need for /user/me right after login
      loginWithToken(res.data.token, res.data.user);

      // If user was redirected here by RequireAuth -> go back.
      // Otherwise land on the profile home page.
      const from = (location.state as any)?.from?.pathname;
      navigate(from ?? "/profile", { replace: true });
    } catch (error: any) {
      const msg = error?.response?.data?.message;
      setErr(typeof msg === "string" ? msg : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to your BePay account.">
      <Stack component="form" onSubmit={onSubmit} spacing={2}>
        {err ? <Alert severity="error">{err}</Alert> : null}

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          autoComplete="email"
          sx={bepayInputSx}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          autoComplete="current-password"
          sx={bepayInputSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            fontWeight: 950,
            borderRadius: 3,
            py: 1.25,
            color: "white",
            background: `linear-gradient(90deg, ${bepay.colors.accent}, ${bepay.colors.primary})`,
            boxShadow: "0 14px 34px rgba(0,0,0,0.35)",
            "&:hover": { filter: "brightness(1.04)" },
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <Typography variant="body2" sx={{ color: bepay.colors.text2, textAlign: "center" }}>
          <RouterLink to="/forgot-password">Forgot password?</RouterLink>
        </Typography>

        <Typography variant="body2" sx={{ color: bepay.colors.text2, textAlign: "center" }}>
          No account? <RouterLink to="/register">Create one</RouterLink>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
