import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";

import OtpInput from "../../components/OtpInput";
import AuthShell from "../../layout/brand/AuthShell";
import { api } from "../../lib/api";
import { bepay } from "../../ui/bepay";

type LocationState = {
  email?: string;
  deliveredTo?: {
    email?: string;
    phone?: string;
  };
  phone?: string;
};

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function ValueLine(props: { icon: React.ReactNode; label: string; value: string }) {
  const { icon, label, value } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", opacity: 0.9 }}>{icon}</Box>
      <Typography variant="body2" sx={{ color: bepay.colors.text2 }}>
        {label}{" "}
        <Typography component="span" variant="body2" sx={{ fontWeight: 800, color: "rgba(255,255,255,0.9)" }}>
          {value}
        </Typography>
      </Typography>
    </Box>
  );
}

function cooldownKey(email: string) {
  return `otp_resend_until:${email.trim().toLowerCase()}`;
}

function extractErrorMessage(error: any): string {
  const data = error?.response?.data;
  if (typeof data?.message === "string") return data.message;
  if (Array.isArray(data?.message)) return data.message.join(", ");
  if (Array.isArray(data?.errors)) return data.errors.join(", ");
  return "OTP verification failed.";
}

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const emailFromState = state.email || "";
  const deliveredTo = state.deliveredTo;

  const [email] = useState(emailFromState);
  const [code, setCode] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [verified, setVerified] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const emailNorm = useMemo(() => (email || "").trim().toLowerCase(), [email]);

  const delivery = useMemo(() => {
    const emailValue = deliveredTo?.email || emailFromState || emailNorm || "";
    const phoneValue = deliveredTo?.phone || state.phone || "";
    return { emailValue, phoneValue };
  }, [deliveredTo, emailFromState, emailNorm, state.phone]);

  const showEmailLine = Boolean(delivery.emailValue);
  const showSmsLine = Boolean(delivery.phoneValue);

  const canResend = useMemo(() => secondsLeft <= 0 && !isResending, [secondsLeft, isResending]);

  function clearTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startCountdown(seconds: number, persist: boolean) {
    const s = Math.max(0, Math.floor(seconds));
    setSecondsLeft(s);

    clearTimer();
    if (s <= 0) {
      if (persist && emailNorm) localStorage.removeItem(cooldownKey(emailNorm));
      return;
    }

    if (persist && emailNorm) {
      const until = Date.now() + s * 1000;
      localStorage.setItem(cooldownKey(emailNorm), String(until));
    }

    timerRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          if (emailNorm) localStorage.removeItem(cooldownKey(emailNorm));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    if (!emailNorm) return;

    const raw = localStorage.getItem(cooldownKey(emailNorm));
    if (!raw) return;

    const until = Number(raw);
    if (!Number.isFinite(until)) {
      localStorage.removeItem(cooldownKey(emailNorm));
      return;
    }

    const diffMs = until - Date.now();
    if (diffMs <= 0) {
      localStorage.removeItem(cooldownKey(emailNorm));
      return;
    }

    startCountdown(Math.ceil(diffMs / 1000), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailNorm]);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  async function verifyOtp(submitCode: string) {
    setError(null);
    setInfo(null);

    const trimmedEmail = emailNorm;
    const trimmedCode = onlyDigits(submitCode).slice(0, 6);

    if (!trimmedEmail || trimmedCode.length !== 6) {
      setError("Email and a 6-digit OTP code are required.");
      return;
    }

    setIsVerifying(true);
    try {
      const resp = await api.post("/auth/verify-otp", { email: trimmedEmail, code: trimmedCode });
      const retryAfter = Number(resp?.data?.retryAfterSeconds ?? 0);
      if (Number.isFinite(retryAfter) && retryAfter > 0) startCountdown(retryAfter, true);

      setVerified(true);
      setInfo("Account verified successfully. Please log in to continue.");
    } catch (err: any) {
      const status = err?.response?.status;
      const retryAfter = Number(err?.response?.data?.retryAfterSeconds ?? 0);

      if (status === 429) {
        startCountdown(Number.isFinite(retryAfter) ? retryAfter : 30, true);
        setError(err?.response?.data?.message || "Too many attempts. Please try again later.");
      } else {
        setError(extractErrorMessage(err));
      }
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    setError(null);
    setInfo(null);

    const trimmedEmail = emailNorm;
    if (!trimmedEmail) {
      setError("Email is required to resend the OTP.");
      return;
    }

    setIsResending(true);
    try {
      const resp = await api.post("/auth/resend-otp", { email: trimmedEmail });
      const retryAfter = Number(resp?.data?.retryAfterSeconds ?? 30);
      startCountdown(Number.isFinite(retryAfter) ? retryAfter : 30, true);
      setInfo("A new OTP has been sent.");
    } catch (err: any) {
      const status = err?.response?.status;
      const retryAfter = Number(err?.response?.data?.retryAfterSeconds ?? 0);

      if (status === 429) {
        startCountdown(Number.isFinite(retryAfter) ? retryAfter : 30, true);
        setError(err?.response?.data?.message || "Please wait before resending.");
      } else {
        setError(extractErrorMessage(err) || "Failed to resend OTP.");
      }
    } finally {
      setIsResending(false);
    }
  }

  function handleComplete(completeCode: string) {
    if (verified) return;
    if (secondsLeft > 0) return;
    if (isVerifying) return;
    verifyOtp(completeCode);
  }

  const hasOtpError = Boolean(error);

  return (
    <AuthShell title="Verify your account" subtitle="Enter the 6-digit code we sent you.">
      <Stack spacing={2}>
        {(showEmailLine || showSmsLine) && (
          <Box
            sx={{
              border: `1px solid ${bepay.colors.borderSoft}`,
              borderRadius: 3,
              p: 1.5,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <Typography variant="body2" sx={{ color: bepay.colors.text2, mb: 1 }}>
              We sent a verification code to:
            </Typography>

            <Stack spacing={0.75}>
              {showEmailLine ? (
                <ValueLine icon={<EmailOutlinedIcon fontSize="small" />} label="Email:" value={delivery.emailValue} />
              ) : null}

              {showSmsLine ? (
                <ValueLine icon={<SmsOutlinedIcon fontSize="small" />} label="SMS:" value={delivery.phoneValue} />
              ) : null}
            </Stack>
          </Box>
        )}

        {error ? <Alert severity="error">{error}</Alert> : null}
        {info ? <Alert severity={verified ? "success" : "info"}>{info}</Alert> : null}

        {verified ? (
          <Stack spacing={1.25}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate("/login")}
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
              Go to Login
            </Button>

            <Button variant="text" fullWidth onClick={() => navigate("/register")}>
              Back to Register
            </Button>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <OtpInput
              value={code}
              onChange={(v) => setCode(onlyDigits(v).slice(0, 6))}
              onComplete={handleComplete}
              autoFocus
              disabled={isVerifying}
              hasError={hasOtpError}
              ariaLabel="OTP code"
            />

            <Typography variant="caption" sx={{ color: bepay.colors.text2 }}>
              Enter the 6-digit code. You can paste the full code.
            </Typography>

            <Button
              variant="contained"
              onClick={() => verifyOtp(code)}
              disabled={isVerifying || onlyDigits(code).length !== 6 || secondsLeft > 0}
              fullWidth
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
              {isVerifying ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={18} />
                  Verifying...
                </Box>
              ) : secondsLeft > 0 ? (
                `Try again in ${secondsLeft}s`
              ) : (
                "Verify"
              )}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button variant="text" onClick={() => navigate("/register")} disabled={isVerifying || isResending}>
                Back to Register
              </Button>

              <Button variant="outlined" onClick={handleResend} disabled={!canResend || isVerifying}>
                {isResending ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={18} />
                    Sending...
                  </Box>
                ) : secondsLeft > 0 ? (
                  `Resend in ${secondsLeft}s`
                ) : (
                  "Resend Code"
                )}
              </Button>
            </Box>

            <Typography variant="body2" sx={{ color: bepay.colors.text2, textAlign: "center" }}>
              Wrong email? <RouterLink to="/register">Go back</RouterLink>
            </Typography>
          </Stack>
        )}
      </Stack>
    </AuthShell>
  );
}
