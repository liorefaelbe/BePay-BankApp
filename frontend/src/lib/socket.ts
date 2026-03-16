import { io, type Socket } from "socket.io-client";

export type ServerToClientEvents = {
  notification: (payload: any) => void;
};

export type ClientToServerEvents = {
  register: (email: string) => void;
};

function resolveSocketUrl(): string {
  // Prefer explicit env, otherwise same-origin (works behind reverse proxy).
  return import.meta.env.VITE_SOCKET_URL || window.location.origin;
}

function resolveSocketPath(): string {
  return import.meta.env.VITE_SOCKET_PATH || "/socket.io";
}

export function createSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io(resolveSocketUrl(), {
    path: resolveSocketPath(),
    autoConnect: false,
    transports: ["polling", "websocket"],
  });
}
