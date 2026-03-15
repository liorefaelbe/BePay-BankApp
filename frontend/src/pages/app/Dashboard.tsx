import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../../lib/api";
import { useRealtime } from "../../realtime/RealtimeProvider";

type RecentTx = {
  counterparty: string;
  amount: number;
  createdAt: string;
};

type DashboardData = {
  email: string;
  phone: string;
  balance: number;
  transactions: RecentTx[];
};

function formatMoney(amount: number) {
  const sign = amount > 0 ? "+" : "";
  return `${sign}${amount}`;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { lastEvent } = useRealtime();

  async function refresh() {
    setErr(null);
    try {
      const res = await api.get("/user/dashboard");
      setData(res.data);
    } catch (error: any) {
      setErr(error?.response?.data?.message || "Failed to load dashboard");
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!lastEvent) return;
    refresh();
  }, [lastEvent]);

  const recent = useMemo(() => {
    return (data?.transactions || []).slice(0, 5);
  }, [data?.transactions]);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 980, mx: "auto" }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={900}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of your account and recent activity.
          </Typography>
        </Stack>

        {err && <Alert severity="error">{err}</Alert>}

        {!err && data && (
          <>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Paper sx={{ p: 3, flex: 1 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Balance
                  </Typography>
                  <Typography variant="h3" fontWeight={950} sx={{ lineHeight: 1.1 }}>
                    ${data.balance}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Available balance
                  </Typography>
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, flex: 1 }}>
                <Stack spacing={1}>
                  <Typography variant="body2" color="text.secondary">
                    Profile
                  </Typography>

                  <Stack spacing={0.5}>
                    <Typography fontWeight={800}>{data.email}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.phone}
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button component={RouterLink} to="/transfer" variant="contained">
                      New Transfer
                    </Button>
                    <Button component={RouterLink} to="/transactions" variant="outlined">
                      View All
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>

            <Paper sx={{ p: 3 }}>
              <Stack spacing={1.5}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography variant="h6" fontWeight={900}>
                    Recent Transactions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last {recent.length} records
                  </Typography>
                </Stack>

                <Divider />

                {recent.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No transactions yet.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {recent.map((tx, idx) => {
                      const direction = tx.amount < 0 ? "Sent" : "Received";
                      const amountText = formatMoney(tx.amount);
                      const timeText = new Date(tx.createdAt).toLocaleString();

                      return (
                        <Box key={`${tx.createdAt}-${idx}`}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                          >
                            <Stack spacing={0.25}>
                              <Typography fontWeight={800}>
                                {direction} • {tx.counterparty}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {timeText}
                              </Typography>
                            </Stack>

                            <Typography fontWeight={900} sx={{ fontVariantNumeric: "tabular-nums" }}>
                              {amountText}
                            </Typography>
                          </Stack>

                          {idx !== recent.length - 1 && <Divider sx={{ my: 1.25 }} />}
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Stack>
            </Paper>
          </>
        )}
      </Stack>
    </Box>
  );
}
