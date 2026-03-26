import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

function getSocketBaseUrl(): string {
  const envUrl = import.meta.env.VITE_WS_URL as string | undefined;
  if (envUrl && envUrl.trim().length > 0) return envUrl;
  return window.location.origin;
}

export function connectRealtime(): Socket {
  if (socket && socket.connected) return socket;

  if (!socket) {
    socket = io(getSocketBaseUrl(), {
      path: "/socket.io",
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: false,
    });
  }

  if (!socket.connected) socket.connect();
  return socket;
}

export function disconnectRealtime(): void {
  if (!socket) return;
  socket.disconnect();
}

export function getRealtimeSocket(): Socket | null {
  return socket;
}
