import { useMemo, useState } from "react";
import { Alert, Button, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { api } from "../../lib/api";
import AuthShell from "../../layout/brand/AuthShell";
import { bepay, bepayInputSx } from "../../ui/bepay";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetPassword() {
  const q = useQuery();
  const token = q.get("token") || "";
  const tokenMissing = !token;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);

    if (!token) {
      setErr("Missing token.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setInfo("Password updated. You can log in now.");
      setTimeout(() => navigate("/login"), 700);
    } catch (error: any) {
      setErr(error?.response?.data?.message ?? "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Choose a new password" subtitle="Create a strong password for your BePay account.">
      <Stack component="form" onSubmit={onSubmit} spacing={2}>
        {err ? <Alert severity="error">{err}</Alert> : null}
        {info ? <Alert severity="success">{info}</Alert> : null}

        <TextField
          label="New password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          autoComplete="new-password"
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
          disabled={loading || tokenMissing}
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
          {loading ? "Updating..." : "Update password"}
        </Button>

        <Typography variant="body2" sx={{ color: bepay.colors.text2, textAlign: "center" }}>
          Back to <RouterLink to="/login">Log in</RouterLink>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
