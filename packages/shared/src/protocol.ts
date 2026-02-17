import type { Board, Move, Player } from "@jumpfrog/rules";

export type ContinuationState =
  | null
  | {
      pieceId: string;
      expiresAt: number;
      remainingMs: number;
    };

export type ServerGameState = {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  players: {
    [socketId: string]: { color: Player };
  };
  continuation: ContinuationState;
  lastMove?: Move;
};

export type RoomCreatePayload = Record<string, never>;
export type RoomJoinPayload = { roomId: string };
export type MoveRequestPayload = { roomId: string; move: Move };
export type TurnEndPayload = { roomId: string };
export type RoomLeavePayload = { roomId: string };

export type RoomCreatedPayload = { roomId: string; shareUrl: string };
export type RoomStatePayload = { roomId: string; state: ServerGameState };
export type RoomErrorPayload = { message: string; code?: string };

export interface ClientToServerEvents {
  "room:create": () => void;
  "room:join": (payload: RoomJoinPayload) => void;
  "move:request": (payload: MoveRequestPayload) => void;
  "turn:end": (payload: TurnEndPayload) => void;
  "room:leave": (payload: RoomLeavePayload) => void;
}

export interface ServerToClientEvents {
  "room:created": (payload: RoomCreatedPayload) => void;
  "room:state": (payload: RoomStatePayload) => void;
  "room:error": (payload: RoomErrorPayload) => void;
}
