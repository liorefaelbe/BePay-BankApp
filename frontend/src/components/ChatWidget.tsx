import React, { useEffect, useMemo, useRef, useState } from "react";
import { Badge, Box, Chip, Divider, Drawer, Fab, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useNavigate } from "react-router-dom";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  ts: number;
};

type QuickAction = {
  label: string;
  to: string;
  authOnly?: boolean;
};

type QuickReply = {
  label: string;
  text: string;
  authOnly?: boolean;
};

export default function ChatWidget(props: { isAuthenticated: boolean; userEmail?: string }) {
  const { isAuthenticated, userEmail } = props;

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: cryptoId(),
      role: "assistant",
      text: isAuthenticated
        ? `Hi${userEmail ? ` ${userEmail}` : ""}. I’m your support assistant.\n\nYou can ask about: transfers, transactions, OTP verification, or navigation.`
        : "Hi. I’m your support assistant.\n\nYou can ask about OTP verification, registration, or how to use the app. If you already verified your account, please log in.",
      ts: Date.now(),
    },
  ]);

  const [unread, setUnread] = useState(0);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const quickActions: QuickAction[] = useMemo(
    () => [
      { label: "Dashboard", to: "/dashboard", authOnly: true },
      { label: "Transfer", to: "/transfer", authOnly: true },
      { label: "Transactions", to: "/transactions", authOnly: true },
      { label: "Login", to: "/login" },
      { label: "Register", to: "/register" },
    ],
    [],
  );

  const quickReplies: QuickReply[] = useMemo(
    () => [
      { label: "How to transfer?", text: "How do I make a transfer?", authOnly: true },
      { label: "Transactions help", text: "Show my transactions", authOnly: true },
      { label: "OTP help", text: "I didn't get my OTP" },
      { label: "Where is Dashboard?", text: "Open dashboard", authOnly: true },
      { label: "Login help", text: "I can't login" },
    ],
    [],
  );

  useEffect(() => {
    if (!open) return;
    setUnread(0);
    window.setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, open]);

  function push(role: ChatRole, text: string) {
    setMessages((prev) => [...prev, { id: cryptoId(), role, text, ts: Date.now() }]);
  }

  function normalize(s: string) {
    return (s || "").trim().toLowerCase();
  }

  function getBotReply(raw: string): { text: string; action?: string } {
    const q = normalize(raw);

    const wantsHelp = q === "help" || q === "?" || q.includes("help") || q.includes("what can you do");

    if (!q) return { text: "Please type a message." };

    if (wantsHelp) {
      return {
        text: 'I can help you navigate the app and answer common questions.\n\nTry:\n- "dashboard" / "balance"\n- "transfer"\n- "transactions"\n- "otp" / "verify"\n- "login" / "register"',
      };
    }

    const greetings = ["hi", "hello", "hey", "good morning", "good evening"];
    if (greetings.some((g) => q === g || q.startsWith(g + " "))) {
      return {
        text: isAuthenticated
          ? `Hello${userEmail ? ` ${userEmail}` : ""}. What would you like to do?`
          : "Hello. If you already verified your account, please log in to continue.",
      };
    }

    if (q.includes("login") || q.includes("sign in")) {
      return { text: "Opening the Login page.", action: "/login" };
    }

    if (q.includes("register") || q.includes("sign up") || q.includes("signup")) {
      return { text: "Opening the Register page.", action: "/register" };
    }

    if (q.includes("dashboard") || q.includes("balance") || q.includes("home")) {
      if (!isAuthenticated) {
        return {
          text: "You need to log in to view your dashboard. Opening Login.",
          action: "/login",
        };
      }
      return { text: "Opening Dashboard.", action: "/dashboard" };
    }

    if (q.includes("transfer") || q.includes("send money") || q.includes("pay")) {
      if (!isAuthenticated) {
        return { text: "You need to log in to make a transfer. Opening Login.", action: "/login" };
      }
      return {
        text: "To make a transfer: enter the recipient email and amount, then submit.\nOpening Transfer.",
        action: "/transfer",
      };
    }

    if (q.includes("transactions") || q.includes("history") || q.includes("statement")) {
      if (!isAuthenticated) {
        return { text: "You need to log in to view transactions. Opening Login.", action: "/login" };
      }
      return {
        text: "You can search, filter, and sort your transactions history.\nOpening Transactions.",
        action: "/transactions",
      };
    }

    if (q.includes("otp") || q.includes("verify") || q.includes("verification")) {
      return {
        text: "OTP verification: after registering, enter the 6-digit code on the Verify OTP screen.\n\nIf you didn't receive it, use Resend. If you hit rate limits, wait for the cooldown and try again.",
      };
    }

    if (q.includes("can't login") || q.includes("cannot login") || q.includes("invalid credentials")) {
      return {
        text: "Login issues usually come from one of these:\n- Account not verified (OTP)\n- Wrong password\n- Password reset needed\n\nIf you already verified your account, try logging in again.",
      };
    }

    return {
      text: 'I did not understand that. Type "help" for supported commands.\n\nCommon: "dashboard", "transfer", "transactions", "otp".',
    };
  }

  function handleSend(text?: string) {
    const raw = (text ?? draft).trim();
    if (!raw) return;

    if (!text) setDraft("");
    push("user", raw);

    const reply = getBotReply(raw);
    push("assistant", reply.text);

    if (reply.action) {
      window.setTimeout(() => navigate(reply.action as any), 350);
    }

    if (!open) setUnread((u) => u + 1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const filteredActions = quickActions.filter((a) => (a.authOnly ? isAuthenticated : true));
  const filteredReplies = quickReplies.filter((a) => (a.authOnly ? isAuthenticated : true));

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Badge color="error" badgeContent={unread} overlap="circular">
          <Fab color="primary" onClick={() => setOpen(true)} aria-label="Open chat">
            <ChatBubbleOutlineRoundedIcon />
          </Fab>
        </Badge>
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420 },
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.75,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <SmartToyRoundedIcon fontSize="small" />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={900} sx={{ lineHeight: 1.1 }}>
              Support
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              Basic help and navigation
            </Typography>
          </Box>

          <IconButton onClick={() => setOpen(false)} aria-label="Close chat">
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {/* Quick actions */}
        <Box sx={{ px: 2, pt: 1.75, pb: 1.25 }}>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Shortcuts
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }} useFlexGap>
            {filteredActions.map((a) => (
              <Chip
                key={a.to}
                label={a.label}
                variant="outlined"
                clickable
                onClick={() => navigate(a.to)}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>

          <Divider sx={{ mt: 1.5 }} />
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            px: 2,
            pb: 2,
          }}
        >
          <Stack spacing={1.25}>
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} text={m.text} />
            ))}
            <div ref={bottomRef} />
          </Stack>
        </Box>

        {/* Quick replies */}
        <Box sx={{ px: 2, pb: 1.25 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
            {filteredReplies.slice(0, 4).map((r) => (
              <Chip
                key={r.label}
                label={r.label}
                variant="filled"
                clickable
                onClick={() => handleSend(r.text)}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>
        </Box>

        {/* Composer */}
        <Box
          sx={{
            px: 2,
            pt: 1.25,
            pb: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              p: 1,
              display: "flex",
              alignItems: "flex-end",
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder='Type a message… (e.g. "transfer")'
              size="small"
              multiline
              minRows={1}
              maxRows={4}
              variant="standard"
              InputProps={{ disableUnderline: true }}
              sx={{ px: 1 }}
            />

            <IconButton
              onClick={() => handleSend()}
              disabled={!draft.trim()}
              aria-label="Send"
              sx={{
                borderRadius: 2,
                width: 40,
                height: 40,
              }}
            >
              <SendRoundedIcon />
            </IconButton>
          </Paper>

          <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mt: 1 }}>
            Enter to send, Shift+Enter for a new line.
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}

function MessageBubble(props: { role: ChatRole; text: string }) {
  const { role, text } = props;
  const isUser = role === "user";

  return (
    <Box sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <Box sx={{ display: "flex", gap: 1, maxWidth: "100%", alignItems: "flex-end" }}>
        {!isUser && (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              flexShrink: 0,
              mb: 0.25,
            }}
          >
            <SmartToyRoundedIcon fontSize="small" />
          </Box>
        )}

        <Box
          sx={{
            maxWidth: 320,
            borderRadius: 3,
            px: 1.5,
            py: 1.25,
            bgcolor: isUser ? "primary.main" : "background.paper",
            color: isUser ? "primary.contrastText" : "text.primary",
            border: isUser ? "none" : "1px solid",
            borderColor: isUser ? "transparent" : "divider",
            boxShadow: isUser ? 1 : 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.45 }}>
            {text}
          </Typography>
        </Box>

        {isUser && (
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              flexShrink: 0,
              mb: 0.25,
              opacity: 0.85,
            }}
          >
            <PersonRoundedIcon fontSize="small" />
          </Box>
        )}
      </Box>
    </Box>
  );
}

function cryptoId() {
  const c: any = crypto as any;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
