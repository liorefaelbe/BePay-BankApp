import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import type { Socket } from "socket.io-client";
import { createSocket, type ServerToClientEvents, type ClientToServerEvents } from "../lib/socket";
import { api } from "../lib/api";
import { useAuth } from "../auth/AuthContext";

type RealtimeEvent = {
  name: string;
  payload: any;
};

type RealtimeContextValue = {
  connected: boolean;
  lastEvent: RealtimeEvent | null;
};

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

function pickFirstString(...vals: any[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function pickFirstNumber(...vals: any[]): number | null {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() && Number.isFinite(Number(v))) return Number(v);
  }
  return null;
}

function buildNotificationText(payload: any): string {
  const p = payload?.data ?? payload;

  const type = pickFirstString(p?.type, payload?.type);
  const fromEmail = pickFirstString(p?.fromEmail, p?.senderEmail, p?.from, payload?.fromEmail);
  const amount = pickFirstNumber(p?.amount, payload?.amount);

  if (type === "TRANSFER_RECEIVED") {
    if (amount != null && fromEmail) return `+$${amount} from ${fromEmail}`;
    if (amount != null) return `+$${amount} received`;
    if (fromEmail) return `Incoming transfer from ${fromEmail}`;
    return "Incoming transfer";
  }

  const serverMsg = pickFirstString(p?.message, payload?.message);
  return serverMsg || "New notification received";
}

function buildDedupeKey(payload: any): string {
  const p = payload?.data ?? payload;

  const type = pickFirstString(p?.type, payload?.type) ?? "";
  const from = pickFirstString(p?.fromEmail, p?.senderEmail, p?.from, payload?.fromEmail) ?? "";
  const amount = pickFirstNumber(p?.amount, payload?.amount);
  const msg = pickFirstString(p?.message, p?.note, payload?.message) ?? "";
  const createdAt = pickFirstString(p?.createdAt, payload?.createdAt) ?? "";

  return `${type}|${from}|${amount ?? ""}|${msg}|${createdAt}`;
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState<string>("");

  // de-dupe state (avoid double toast)
  const lastToastRef = useRef<{ key: string; at: number } | null>(null);

  useEffect(() => {
    // If logged out: ensure socket is disconnected.
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
      return;
    }

    // Create socket once per auth-session.
    if (!socketRef.current) {
      const s = createSocket();
      socketRef.current = s;

      s.on("connect", async () => {
        setConnected(true);

        try {
          const me = await api.get("/user/me");
          const email = me?.data?.email;
          if (typeof email === "string" && email.trim()) {
            s.emit("register", email.trim());
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log("REALTIME_REGISTER_FAILED:", e);
        }
      });

      s.on("disconnect", () => setConnected(false));

      s.on("connect_error", (e) => {
        // eslint-disable-next-line no-console
        console.log("SOCKET_CONNECT_ERROR:", (e as any)?.message || e);
      });

      s.on("notification", (payload) => {
        setLastEvent({ name: "notification", payload });

        const key = buildDedupeKey(payload);
        const now = Date.now();

        const last = lastToastRef.current;
        if (last && last.key === key && now - last.at < 1500) return;

        lastToastRef.current = { key, at: now };

        setToastText(buildNotificationText(payload));
        setToastOpen(true);
      });

      s.connect();
    }

    return () => {
      // component unmount
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  const value = useMemo<RealtimeContextValue>(() => ({ connected, lastEvent }), [connected, lastEvent]);

  return (
    <RealtimeContext.Provider value={value}>
      {children}

      <Snackbar
        open={toastOpen}
        autoHideDuration={4500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" variant="filled" icon={false} onClose={() => setToastOpen(false)}>
          {toastText}
        </Alert>
      </Snackbar>
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error("useRealtime must be used within RealtimeProvider");
  return ctx;
}
