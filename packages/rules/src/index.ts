// Types
export type {
  Player,
  Coord,
  Piece,
  Board,
  StepMove,
  JumpMove,
  Move
} from "./types.js";

// Constants
export { BOARD_SIZE } from "./constants.js";

// Board functions
export { isDarkSquare, isGoalRow, isEdgeRow, isPlayableDestination, inBounds, createInitialBoard } from "./board.js";

// Move generation
export { listLegalMoves } from "./moves.js";

// Game logic
export { applyMove, checkWinner } from "./game.js";
