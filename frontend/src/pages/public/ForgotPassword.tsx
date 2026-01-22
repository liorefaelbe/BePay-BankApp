import { useState } from "react";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../../lib/api";
import AuthShell from "../../layout/brand/AuthShell";
import { bepay, bepayInputSx } from "../../ui/bepay";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setInfo("If this email exists, a reset link has been sent.");
    } catch (error: any) {
      setErr(error?.response?.data?.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Reset your password" subtitle="We’ll send you a reset link to your email.">
      <Stack component="form" onSubmit={onSubmit} spacing={2}>
        {err ? <Alert severity="error">{err}</Alert> : null}
        {info ? <Alert severity="success">{info}</Alert> : null}

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          autoComplete="email"
          sx={bepayInputSx}
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
          {loading ? "Sending..." : "Send reset link"}
        </Button>

        <Typography variant="body2" sx={{ color: bepay.colors.text2, textAlign: "center" }}>
          Back to <RouterLink to="/login">Log in</RouterLink>
        </Typography>
      </Stack>
    </AuthShell>
  );
}
