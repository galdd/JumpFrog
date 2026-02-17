import type { Board, Move, Player } from "./types.js";
import { BOARD_SIZE } from "./constants.js";
import { isGoalRow } from "./board.js";

/**
 * Apply a move to the board (immutable)
 *
 * @param board - Current board state
 * @param move - Move to apply
 * @returns New board with move applied
 */
export const applyMove = (board: Board, move: Move): Board => {
  const next = board.map((row) => row.slice());

  if (move.type === "STEP") {
    const piece = next[move.from.r][move.from.c];
    if (!piece) {
      return next;
    }
    next[move.from.r][move.from.c] = null;
    next[move.to.r][move.to.c] = piece;
    return next;
  }

  const start = move.path[0];
  const end = move.path[move.path.length - 1];
  const piece = next[start.r][start.c];
  if (!piece) {
    return next;
  }
  next[start.r][start.c] = null;
  next[end.r][end.c] = piece;
  return next;
};

/**
 * Check if a player has won the game
 *
 * Win condition: All 8 frogs on opponent's home side (last two ranks)
 * - GREEN wins: All frogs on rows r=0 or r=1
 * - BLACK wins: All frogs on rows r=6 or r=7
 *
 * @param board - Current board state
 * @returns Winning player or null if no winner yet
 */
export const checkWinner = (board: Board): Player | null => {
  const greenCoords = [];
  const blackCoords = [];

  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c < BOARD_SIZE; c += 1) {
      const piece = board[r][c];
      if (!piece) continue;
      if (piece.owner === "GREEN") {
        greenCoords.push({ r, c });
      } else {
        blackCoords.push({ r, c });
      }
    }
  }

  if (
    greenCoords.length === 8 &&
    greenCoords.every((coord) => coord.r === 0 || coord.r === 1)
  ) {
    return "GREEN";
  }

  if (
    blackCoords.length === 8 &&
    blackCoords.every((coord) => coord.r === 6 || coord.r === 7)
  ) {
    return "BLACK";
  }

  return null;
};
