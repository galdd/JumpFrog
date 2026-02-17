import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "@jumpfrog/shared";
import type { Room } from "./game/types.js";
import {
  createRoom,
  findRoomBySocket,
  getRoom,
  joinRoom,
  leaveRoom,
  markDisconnected
} from "./game/rooms.js";
import { handleMoveRequest, handleTurnEnd } from "./game/logic.js";

const PORT = Number(process.env.PORT ?? 4000);
const WEB_ORIGIN = process.env.WEB_ORIGIN ?? "http://localhost:5173";

// Parse multiple origins (comma-separated); used only as fallback for share URL
const allowedOrigins = WEB_ORIGIN.split(",").map(o => o.trim());
const defaultShareBase = allowedOrigins[0] ?? "http://localhost:5173";

// Allow any origin so the link works for everyone (phone, different network, etc.)
const app = express();
app.use(cors({
  origin: true, // reflect request origin (required when credentials: true)
  credentials: true
}));

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const httpServer = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: true, // allow any origin so the link works for everyone
    credentials: true
  },
});

const broadcastRoomState = (room: Room) => {
  io.to(room.id).emit("room:state", {
    roomId: room.id,
    state: room.state,
  });
};

io.on("connection", (socket) => {
  console.log(`socket connected: ${socket.id}`);

  socket.on("room:create", () => {
    const room = createRoom(socket.id);
    socket.join(room.id);
    // Use client's origin for share URL so "Copy link" works for whoever opened the page
    const origin = socket.handshake.headers.origin ?? defaultShareBase;
    const base = origin.replace(/\/$/, "");
    socket.emit("room:created", {
      roomId: room.id,
      shareUrl: `${base}/play/${room.id}`,
    });
  });

  socket.on("room:join", ({ roomId }) => {
    const result = joinRoom(roomId, socket.id);
    if (!result.ok) {
      socket.emit("room:error", {
        message:
          result.code === "ROOM_NOT_FOUND"
            ? "Room not found."
            : "Room is full.",
        code: result.code,
      });
      return;
    }

    socket.join(result.room.id);

    socket.emit("room:state", {
      roomId: result.room.id,
      state: result.room.state,
    });

    if (result.assignedColors) {
      broadcastRoomState(result.room);
    }
  });

  socket.on("move:request", ({ roomId, move }) => {
    const room = getRoom(roomId);
    const result = handleMoveRequest(
      room,
      socket.id,
      move,
      broadcastRoomState
    );
    if (!result.ok) {
      socket.emit("room:error", {
        message: result.message,
        code: result.code,
      });
    }
  });

  socket.on("turn:end", ({ roomId }) => {
    const room = getRoom(roomId);
    const result = handleTurnEnd(
      room,
      socket.id,
      broadcastRoomState
    );
    if (!result.ok) {
      socket.emit("room:error", {
        message: result.message,
        code: result.code,
      });
    }
  });

  socket.on("room:leave", ({ roomId }) => {
    const room = leaveRoom(roomId, socket.id);
    if (room) {
      broadcastRoomState(room);
    }
  });

  socket.on("disconnect", () => {
    console.log(`socket disconnected: ${socket.id}`);
    const room = findRoomBySocket(socket.id);
    if (room) {
      const updatedRoom = markDisconnected(room.id, socket.id);
      if (updatedRoom) {
        socket.to(updatedRoom.id).emit("room:error", {
          message: "Opponent disconnected.",
          code: "OPPONENT_DISCONNECTED",
        });
        broadcastRoomState(updatedRoom);
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`JumpFrog server listening on http://localhost:${PORT}`);
});
