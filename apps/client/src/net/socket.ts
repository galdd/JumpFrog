import { io } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@jumpfrog/shared";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000";

export const socket = io<ServerToClientEvents, ClientToServerEvents>(
  SERVER_URL,
  {
    autoConnect: true,
    reconnection: true,
    transports: ["websocket", "polling"],
    withCredentials: true
  }
);
