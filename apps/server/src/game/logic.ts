import { applyMove, checkWinner, listLegalMoves } from "@jumpfrog/rules";
import type { Move, Coord, Player } from "@jumpfrog/rules";
import type { Room } from "./types.js";

export type MoveResult =
  | { ok: true }
  | { ok: false; message: string; code?: string };

export type BroadcastFn = (room: Room) => void;

const otherPlayer = (player: Player): Player =>
  player === "GREEN" ? "BLACK" : "GREEN";

const coordsEqual = (a: Coord, b: Coord): boolean =>
  a.r === b.r && a.c === b.c;

const jumpEndpointsEqual = (a: Move, b: Move): boolean => {
  if (a.type !== "JUMP" || b.type !== "JUMP") return false;
  const aStart = a.path[0];
  const aEnd = a.path[a.path.length - 1];
  const bStart = b.path[0];
  const bEnd = b.path[b.path.length - 1];
  return coordsEqual(aStart, bStart) && coordsEqual(aEnd, bEnd);
};

const jumpPathsEqual = (a: Move, b: Move): boolean => {
  if (a.type !== "JUMP" || b.type !== "JUMP") return false;
  if (a.path.length !== b.path.length) return false;
  return a.path.every((coord, idx) => coordsEqual(coord, b.path[idx]));
};

const movesEqual = (a: Move, b: Move): boolean => {
  if (a.type !== b.type) return false;
  if (a.type === "STEP" && b.type === "STEP") {
    return coordsEqual(a.from, b.from) && coordsEqual(a.to, b.to);
  }
  return jumpPathsEqual(a, b) || jumpEndpointsEqual(a, b);
};

const getMoveStart = (move: Move): Coord =>
  move.type === "STEP" ? move.from : move.path[0];

const getMoveEnd = (move: Move): Coord =>
  move.type === "STEP"
    ? move.to
    : move.path[move.path.length - 1];

const stopTimer = (room: Room) => {
  if (room.timer) {
    clearInterval(room.timer);
    room.timer = undefined;
  }
};

const startContinuationTimer = (room: Room, broadcast: BroadcastFn) => {
  stopTimer(room);
  room.timer = setInterval(() => {
    const continuation = room.state.continuation;
    if (!continuation) {
      stopTimer(room);
      return;
    }

    const remainingMs = continuation.expiresAt - Date.now();
    if (remainingMs <= 0) {
      room.state.continuation = null;
      room.state.currentPlayer = otherPlayer(room.state.currentPlayer);
      stopTimer(room);
      broadcast(room);
      return;
    }

    continuation.remainingMs = remainingMs;
    broadcast(room);
  }, 200);
};

const setContinuation = (room: Room, pieceId: string, broadcast: BroadcastFn) => {
  const now = Date.now();
  room.state.continuation = {
    pieceId,
    expiresAt: now + 5000,
    remainingMs: 5000,
  };
  startContinuationTimer(room, broadcast);
};

const isPlayerTurn = (room: Room, socketId: string) => {
  const player = room.state.players[socketId]?.color;
  return player && player === room.state.currentPlayer;
};

export const handleMoveRequest = (
  room: Room | undefined,
  socketId: string,
  move: Move,
  broadcast: BroadcastFn
): MoveResult => {
  if (!room) {
    return { ok: false, message: "Room not found.", code: "ROOM_NOT_FOUND" };
  }

  if (room.state.winner) {
    return { ok: false, message: "Game has ended." };
  }

  if (!room.state.players[socketId]) {
    return { ok: false, message: "You are not in this room." };
  }

  if (!isPlayerTurn(room, socketId)) {
    return { ok: false, message: "Not your turn." };
  }

  const continuation = room.state.continuation;
  if (continuation) {
    if (move.type !== "JUMP") {
      return { ok: false, message: "Continuation requires a jump move." };
    }

    const start = getMoveStart(move);
    const piece = room.state.board[start.r][start.c];
    if (!piece || piece.id !== continuation.pieceId) {
      return { ok: false, message: "Must move the same piece." };
    }
  }

  const legalMoves = listLegalMoves(room.state.board, room.state.currentPlayer);
  const matchingMove = legalMoves.find((candidate) => movesEqual(candidate, move));
  if (!matchingMove) {
    return { ok: false, message: "Illegal move." };
  }

  const start = getMoveStart(matchingMove);
  const movedPiece = room.state.board[start.r][start.c];
  if (!movedPiece) {
    return { ok: false, message: "No piece to move." };
  }

  const nextBoard = applyMove(room.state.board, matchingMove);
  const winner = checkWinner(nextBoard);
  const end = getMoveEnd(matchingMove);

  room.state.board = nextBoard;
  room.state.winner = winner;
  room.state.lastMove = matchingMove;

  if (winner) {
    room.state.continuation = null;
    stopTimer(room);
    broadcast(room);
    return { ok: true };
  }

  if (matchingMove.type === "JUMP") {
    const jumpsFromLanding = listLegalMoves(
      nextBoard,
      room.state.currentPlayer
    ).filter(
      (candidate) =>
        candidate.type === "JUMP" &&
        coordsEqual(candidate.path[0], end)
    );

    if (jumpsFromLanding.length > 0) {
      setContinuation(room, movedPiece.id, broadcast);
      broadcast(room);
      return { ok: true };
    }
  }

  room.state.currentPlayer = otherPlayer(room.state.currentPlayer);
  room.state.continuation = null;
  stopTimer(room);
  broadcast(room);
  return { ok: true };
};

export const handleTurnEnd = (
  room: Room | undefined,
  socketId: string,
  broadcast: BroadcastFn
): MoveResult => {
  if (!room) {
    return { ok: false, message: "Room not found.", code: "ROOM_NOT_FOUND" };
  }

  if (!room.state.continuation) {
    return { ok: false, message: "No continuation active." };
  }

  if (!room.state.players[socketId]) {
    return { ok: false, message: "You are not in this room." };
  }

  if (!isPlayerTurn(room, socketId)) {
    return { ok: false, message: "Not your turn." };
  }

  room.state.continuation = null;
  room.state.currentPlayer = otherPlayer(room.state.currentPlayer);
  stopTimer(room);
  broadcast(room);
  return { ok: true };
};
