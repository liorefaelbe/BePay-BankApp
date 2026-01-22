import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import RecentRecipients from "../../components/RecentRecipients";

type Tx = {
  counterparty?: string;
  senderEmail?: string;
  recipientEmail?: string;
  amount: number;
  createdAt: string;
  message?: string;
};

function extractErrorMessage(error: any): string {
  const data = error?.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    if (typeof first === "string") return data.errors.join(", ");
    if (typeof first?.message === "string") {
      const field = typeof first?.field === "string" ? first.field : "";
      return field ? `${field}: ${first.message}` : first.message;
    }
    return JSON.stringify(first);
  }

  if (Array.isArray(data?.message)) return data.message.join(", ");
  if (typeof data?.message === "string") return data.message;

  if (typeof data?.error === "string") return data.error;
  if (typeof data === "string") return data;

  const status = error?.response?.status;
  if (status) return `Request failed (${status})`;

  return "Transfer failed";
}

function getCounterparty(tx: Tx): string {
  return tx.counterparty || tx.recipientEmail || tx.senderEmail || "";
}

function normalizeHistoryResponse(data: any): Tx[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.transactions)) return data.transactions;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function Transfer() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note] = useState("");

  const [fieldErrorEmail, setFieldErrorEmail] = useState<string | null>(null);
  const [fieldErrorAmount, setFieldErrorAmount] = useState<string | null>(null);

  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [recentRecipients, setRecentRecipients] = useState<string[]>([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);

  const navigate = useNavigate();

  const parsedAmount = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const trimmedEmail = useMemo(() => recipientEmail.trim(), [recipientEmail]);
  const trimmedNote = useMemo(() => note.trim(), [note]);

  const isValidEmailBasic = useMemo(() => {
    // Basic email check (client-side). Server is source of truth.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  }, [trimmedEmail]);

  const canSubmit = useMemo(() => {
    return (
      trimmedEmail.length > 0 && isValidEmailBasic && Number.isFinite(parsedAmount) && parsedAmount > 0 && !loading
    );
  }, [trimmedEmail, isValidEmailBasic, parsedAmount, loading]);

  useEffect(() => {
    (async () => {
      setLoadingRecipients(true);
      try {
        const res = await api.get("/transactions/history");
        const items = normalizeHistoryResponse(res.data);

        const uniq: string[] = [];
        for (const tx of items as Tx[]) {
          const cp = getCounterparty(tx).trim();
          if (!cp) continue;
          if (!uniq.includes(cp)) uniq.push(cp);
          if (uniq.length >= 8) break;
        }

        setRecentRecipients(uniq);
      } catch {
        setRecentRecipients([]);
      } finally {
        setLoadingRecipients(false);
      }
    })();
  }, []);

  function validateFields(): boolean {
    setFieldErrorEmail(null);
    setFieldErrorAmount(null);
    setErr(null);
    setSuccess(null);

    let ok = true;

    if (!trimmedEmail) {
      setFieldErrorEmail("Recipient email is required");
      ok = false;
    } else if (!isValidEmailBasic) {
      setFieldErrorEmail("Invalid email format");
      ok = false;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFieldErrorAmount("Amount must be a positive number");
      ok = false;
    }

    return ok;
  }

  function onPrimarySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateFields()) return;
    setConfirmOpen(true);
  }

  async function executeTransfer() {
    setConfirmOpen(false);
    setLoading(true);
    setErr(null);
    setSuccess(null);

    try {
      const res = await api.post("/transactions/transfer", {
        toEmail: trimmedEmail, // IMPORTANT: matches BE
        amount: parsedAmount,
        message: trimmedNote || undefined,
      });

      setSuccess(res.data?.message || "Transfer completed");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log("TRANSFER_ERROR_RAW:", error?.response?.data);
      setErr(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 620, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={900}>
            New Transfer
          </Typography>

          {err && <Alert severity="error">{err}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <RecentRecipients
            recipients={loadingRecipients ? [] : recentRecipients}
            onPick={(email) => setRecipientEmail(email)}
          />

          <Box component="form" onSubmit={onPrimarySubmit}>
            <Stack spacing={2}>
              <TextField
                label="Recipient Email"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                error={!!fieldErrorEmail}
                helperText={fieldErrorEmail || " "}
                required
              />

              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={!!fieldErrorAmount}
                helperText={fieldErrorAmount || " "}
                required
                inputProps={{ min: 1, step: "1" }}
              />

              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" disabled={!canSubmit} sx={{ flex: 1 }}>
                  Review transfer
                </Button>

                <Button variant="outlined" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
              </Stack>

              {!loadingRecipients && recentRecipients.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  Tip: once you make transfers, recent recipients will appear here.
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm transfer</DialogTitle>
        <DialogContent>
          <Stack spacing={1.25} sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Please confirm the details before sending.
            </Typography>

            <Divider />

            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                To
              </Typography>
              <Typography fontWeight={900}>{trimmedEmail || "—"}</Typography>
            </Stack>

            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Amount
              </Typography>
              <Typography fontWeight={900}>{Number.isFinite(parsedAmount) ? parsedAmount : "—"}</Typography>
            </Stack>

            {trimmedNote && (
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Message
                </Typography>
                <Typography>{trimmedNote}</Typography>
              </Stack>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={loading}>
            Edit
          </Button>
          <Button onClick={executeTransfer} variant="contained" disabled={loading}>
            {loading ? "Sending..." : "Confirm & Send"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
