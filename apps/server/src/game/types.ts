import type { Board, Move, Player } from "@jumpfrog/rules";

export type { Player };

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

export type Room = {
  id: string;
  sockets: string[];
  state: ServerGameState;
  timer?: NodeJS.Timeout;
  disconnectedAt: Record<string, number>;
  disconnectTimers: Record<string, NodeJS.Timeout>;
};
