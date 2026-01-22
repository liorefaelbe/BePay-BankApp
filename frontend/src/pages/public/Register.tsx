import { useMemo, useState } from "react";
import { Alert, Box, Button, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import AuthShell from "../../layout/brand/AuthShell";
import { bepay, bepayInputSx } from "../../ui/bepay";

function extractErrorMessage(error: any): string {
  const data = error?.response?.data;
  if (typeof data?.message === "string") return data.message;
  if (Array.isArray(data?.message)) return data.message.join(", ");
  if (Array.isArray(data?.errors)) return data.errors.join(", ");
  return "Registration failed";
}

function passwordChecks(password: string) {
  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "At least 1 uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter", ok: /[a-z]/.test(password) },
    { label: "At least 1 number", ok: /\d/.test(password) },
    { label: "At least 1 special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const isValid = checks.every((c) => c.ok);
  return { checks, isValid };
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checks = useMemo(() => passwordChecks(password), [password]);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (!checks.isValid) {
      setErr("Please choose a stronger password.");
      return;
    }
    if (!passwordsMatch) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { email, phone, password });
      navigate("/verify-otp", { state: { email, phone } });
    } catch (error: any) {
      setErr(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Join BePay in less than a minute.">
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
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          autoComplete="tel"
          sx={bepayInputSx}
        />

        <TextField
          label="Password"
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

        <TextField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          autoComplete="new-password"
          sx={bepayInputSx}
        />

        {/* Password checklist */}
        <Box
          sx={{
            border: `1px solid ${bepay.colors.borderSoft}`,
            borderRadius: 3,
            p: 1.5,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <Stack spacing={0.75}>
            {checks.checks.map((c) => (
              <Stack key={c.label} direction="row" spacing={1} alignItems="center">
                {c.ok ? (
                  <CheckCircleOutlineIcon fontSize="small" sx={{ color: bepay.colors.accent }} />
                ) : (
                  <RadioButtonUncheckedIcon fontSize="small" sx={{ color: "rgba(255,255,255,0.35)" }} />
                )}
                <Typography variant="body2" sx={{ color: c.ok ? "rgba(255,255,255,0.86)" : bepay.colors.text2 }}>
                  {c.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

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
          {loading ? "Creating..." : "Create account"}
        </Button>

        <Typography variant="body2" sx={{ color: bepay.colors.text2, textAlign: "center" }}>
          Already have an account? <RouterLink to="/login">Log in</RouterLink>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
