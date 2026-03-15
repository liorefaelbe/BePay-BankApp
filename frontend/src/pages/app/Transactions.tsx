import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

type Tx = {
  counterparty?: string;
  senderEmail?: string;
  recipientEmail?: string;
  amount: number;
  createdAt: string;
  message?: string;
};

type DirectionFilter = "all" | "incoming" | "outgoing";
type SortOrder = "newest" | "oldest";

function formatMoney(amount: number) {
  const sign = amount > 0 ? "+" : "";
  return `${sign}${amount}`;
}

function getCounterparty(tx: Tx): string {
  return tx.counterparty || tx.recipientEmail || tx.senderEmail || "";
}

function normalizeHistoryResponse(data: any): Tx[] {
  // Most common shapes:
  // 1) [ ... ]
  if (Array.isArray(data)) return data;

  // 2) { transactions: [ ... ] }
  if (Array.isArray(data?.transactions)) return data.transactions;

  // 3) { data: [ ... ] } (sometimes)
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

export default function Transactions() {
  const [list, setList] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [direction, setDirection] = useState<DirectionFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setErr(null);
      setLoading(true);
      try {
        const res = await api.get("/transactions/history");
        const items = normalizeHistoryResponse(res.data);

        if (!Array.isArray(items) || items.length === 0) {
          console.log("HISTORY_RAW_RESPONSE:", res.data);
        }

        setList(items);
      } catch (error: any) {
        setErr(error?.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let items = [...list];

    if (direction === "incoming") {
      items = items.filter((t) => Number(t.amount) > 0);
    } else if (direction === "outgoing") {
      items = items.filter((t) => Number(t.amount) < 0);
    }

    if (q) {
      items = items.filter((t) => {
        const cp = getCounterparty(t).toLowerCase();
        const msg = (t.message || "").toLowerCase();
        return cp.includes(q) || msg.includes(q);
      });
    }

    items.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });

    return items;
  }, [list, direction, sortOrder, query]);

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
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Back">
            <IconButton onClick={() => navigate(-1)} aria-label="back">
              <ArrowBackOutlinedIcon />
            </IconButton>
          </Tooltip>

          <Box>
            <Typography variant="h4" fontWeight={900}>
              Transactions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search, filter and review your account activity.
            </Typography>
          </Box>
        </Stack>

        {err && <Alert severity="error">{err}</Alert>}

        {!err && (
          <Paper sx={{ p: 2.25 }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
                <ToggleButtonGroup
                  value={direction}
                  exclusive
                  onChange={(_, val) => val && setDirection(val)}
                  size="small"
                >
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="incoming">Incoming</ToggleButton>
                  <ToggleButton value="outgoing">Outgoing</ToggleButton>
                </ToggleButtonGroup>

                <Box sx={{ flex: 1 }} />

                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="sort-label">Sort</InputLabel>
                  <Select
                    labelId="sort-label"
                    label="Sort"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  >
                    <MenuItem value="newest">Newest first</MenuItem>
                    <MenuItem value="oldest">Oldest first</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  label="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Email or message"
                  sx={{ minWidth: { xs: "100%", md: 280 } }}
                />
              </Stack>

              <Divider />

              {filtered.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No matching transactions.
                </Typography>
              ) : (
                <Stack divider={<Divider />} spacing={0}>
                  {filtered.map((tx, idx) => {
                    const directionLabel = Number(tx.amount) < 0 ? "Sent" : "Received";
                    const who = getCounterparty(tx) || "—";
                    const timeText = new Date(tx.createdAt).toLocaleString();

                    return (
                      <Box key={`${tx.createdAt}-${idx}`} sx={{ py: 1.75 }}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          justifyContent="space-between"
                        >
                          <Stack spacing={0.25}>
                            <Typography fontWeight={900}>
                              {directionLabel} • {who}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {timeText}
                            </Typography>
                            {tx.message && (
                              <Typography variant="body2" color="text.secondary">
                                {tx.message}
                              </Typography>
                            )}
                          </Stack>

                          <Typography fontWeight={950} sx={{ fontVariantNumeric: "tabular-nums" }}>
                            {formatMoney(Number(tx.amount))}
                          </Typography>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              )}

              <Typography variant="caption" color="text.secondary">
                Showing {filtered.length} of {list.length}
              </Typography>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
