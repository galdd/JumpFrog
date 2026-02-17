import { nanoid } from "nanoid";
import { createInitialBoard } from "@jumpfrog/rules";
import type { Player } from "@jumpfrog/rules";
import type { Room } from "./types.js";

type JoinRoomResult =
  | { ok: true; room: Room; assignedColors: boolean }
  | { ok: false; code: "ROOM_NOT_FOUND" | "ROOM_FULL" };

export const rooms = new Map<string, Room>();
const DISCONNECT_GRACE_MS = 60_000;

export const getRoom = (roomId: string): Room | undefined => rooms.get(roomId);

export const findRoomBySocket = (socketId: string): Room | undefined => {
  for (const room of rooms.values()) {
    if (room.sockets.includes(socketId)) {
      return room;
    }
  }
  return undefined;
};

const shuffleTwo = <T>(items: [T, T]): [T, T] =>
  Math.random() < 0.5 ? items : [items[1], items[0]];

const assignColors = (room: Room) => {
  const [socketA, socketB] = shuffleTwo([room.sockets[0], room.sockets[1]]);
  room.state.players = {
    [socketA]: { color: "GREEN" },
    [socketB]: { color: "BLACK" },
  };
  // Randomize who starts
  room.state.currentPlayer = Math.random() < 0.5 ? "GREEN" : "BLACK";
};

const clearDisconnectTimer = (room: Room, socketId: string) => {
  const timer = room.disconnectTimers[socketId];
  if (timer) {
    clearTimeout(timer);
    delete room.disconnectTimers[socketId];
  }
  delete room.disconnectedAt[socketId];
};

const removeSocket = (room: Room, socketId: string) => {
  room.sockets = room.sockets.filter((id) => id !== socketId);
  delete room.state.players[socketId];
  clearDisconnectTimer(room, socketId);
};

export const createRoom = (socketId: string): Room => {
  const roomId = nanoid(8);
  const room: Room = {
    id: roomId,
    sockets: [socketId],
    state: {
      board: createInitialBoard(),
      currentPlayer: "GREEN",
      winner: null,
      players: {
        [socketId]: { color: "GREEN" },
      },
      continuation: null,
    },
    disconnectedAt: {},
    disconnectTimers: {},
  };

  rooms.set(roomId, room);
  return room;
};

export const joinRoom = (roomId: string, socketId: string): JoinRoomResult => {
  const room = rooms.get(roomId);
  if (!room) {
    return { ok: false, code: "ROOM_NOT_FOUND" };
  }

  if (room.sockets.includes(socketId)) {
    clearDisconnectTimer(room, socketId);
    return { ok: true, room, assignedColors: false };
  }

  const disconnectedIds = Object.keys(room.disconnectedAt);
  if (room.sockets.length >= 2 && disconnectedIds.length === 0) {
    return { ok: false, code: "ROOM_FULL" };
  }

  if (room.sockets.length >= 2 && disconnectedIds.length > 0) {
    const replacedId = disconnectedIds[0];
    const replacedColor = room.state.players[replacedId]?.color;
    removeSocket(room, replacedId);
    room.sockets.push(socketId);
    room.state.players[socketId] = {
      color: replacedColor ?? "GREEN",
    };
    return { ok: true, room, assignedColors: false };
  }

  room.sockets.push(socketId);
  room.state.players[socketId] = { color: "GREEN" };

  if (room.sockets.length === 2) {
    assignColors(room);
    return { ok: true, room, assignedColors: true };
  }

  return { ok: true, room, assignedColors: false };
};

export const leaveRoom = (roomId: string, socketId: string): Room | undefined => {
  const room = rooms.get(roomId);
  if (!room) {
    return undefined;
  }

  removeSocket(room, socketId);

  if (room.sockets.length === 0) {
    if (room.timer) {
      clearInterval(room.timer);
      room.timer = undefined;
    }
    rooms.delete(roomId);
    return undefined;
  }

  return room;
};

export const markDisconnected = (roomId: string, socketId: string): Room | undefined => {
  const room = rooms.get(roomId);
  if (!room) {
    return undefined;
  }

  if (room.disconnectedAt[socketId]) {
    return room;
  }

  room.disconnectedAt[socketId] = Date.now();
  room.disconnectTimers[socketId] = setTimeout(() => {
    removeSocket(room, socketId);
    if (room.sockets.length === 0) {
      if (room.timer) {
        clearInterval(room.timer);
        room.timer = undefined;
      }
      rooms.delete(roomId);
    }
  }, DISCONNECT_GRACE_MS);

  return room;
};
