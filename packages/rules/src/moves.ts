import type { Board, Coord, JumpMove, Move, Player, StepMove } from "./types.js";
import { BOARD_SIZE, DIAGONALS, GREEN_BACK_JUMP_ROWS, BLACK_BACK_JUMP_ROWS } from "./constants.js";
import { inBounds, isPlayableDestination } from "./board.js";

/**
 * Check if a move is forward (not a back step / back jump).
 * GREEN moves toward row 0 (decreasing r), BLACK toward row 7 (increasing r).
 */
const isForwardMove = (from: Coord, to: Coord, player: Player): boolean => {
  if (player === "GREEN") {
    return to.r < from.r; // GREEN moves up (smaller row)
  }
  return to.r > from.r; // BLACK moves down (larger row)
};

/**
 * Check if a piece is in the zone where backward jumps are allowed.
 * GREEN: rows 0–1 (ranks 7–8). BLACK: rows 6–7 (ranks 1–2).
 */
const isInBackJumpZone = (from: Coord, player: Player): boolean => {
  if (player === "GREEN") {
    return (GREEN_BACK_JUMP_ROWS as readonly number[]).includes(from.r);
  }
  return (BLACK_BACK_JUMP_ROWS as readonly number[]).includes(from.r);
};

/**
 * Check if a jump is legal regarding forward/backward.
 * Back jumps are allowed (direction unrestricted).
 */
const isJumpDirectionAllowed = (): boolean => {
  return true;
};

/**
 * Check if a step is legal regarding forward/backward.
 * Back steps are allowed (direction unrestricted).
 */
const isStepDirectionAllowed = (): boolean => {
  return true;
};

/**
 * Generate all legal step moves for a piece at given position.
 * Forward steps always allowed; backward steps only in target rows (7–8 for GREEN, 1–2 for BLACK).
 */
const listStepMoves = (
  board: Board,
  from: Coord,
  player: Player
): StepMove[] => {
  const moves: StepMove[] = [];
  const goalRow = player === "GREEN" ? 0 : 7;
  const goalEntryRow = player === "GREEN" ? 1 : 6;

  for (const { dr, dc } of DIAGONALS) {
    const to = { r: from.r + dr, c: from.c + dc };
    if (!inBounds(to) || !isPlayableDestination(to, player)) {
      continue;
    }
    if (!isStepDirectionAllowed()) {
      continue;
    }
    if (!board[to.r][to.c]) {
      moves.push({ type: "STEP", from, to });
    }
  }

  // Special case: allow straight step into either edge row from the adjacent row
  // This lets pieces reach light squares on row 1 and row 8
  const edgeRows = [
    { entry: 1, edge: 0 },  // step from row 7 into row 8
    { entry: 6, edge: 7 }   // step from row 2 into row 1
  ];
  for (const { entry, edge } of edgeRows) {
    if (from.r === entry) {
      const to = { r: edge, c: from.c };
      if (inBounds(to) && isPlayableDestination(to, player) && !board[to.r][to.c]) {
        if (!moves.some((m) => m.to.r === to.r && m.to.c === to.c)) {
          moves.push({ type: "STEP", from, to });
        }
      }
    }
  }

  // Edge row lateral steps: pieces on row 1 or row 8 can step left/right
  if (from.r === 0 || from.r === 7) {
    for (const dc of [-1, 1]) {
      const to = { r: from.r, c: from.c + dc };
      if (inBounds(to) && !board[to.r][to.c]) {
        if (!moves.some((m) => m.to.r === to.r && m.to.c === to.c)) {
          moves.push({ type: "STEP", from, to });
        }
      }
    }
  }

  return moves;
};

/**
 * Generate all legal single-jump moves for a piece at given position.
 * Forward jumps always allowed; backward jumps only in target rows (7–8 for GREEN, 1–2 for BLACK).
 */
const listJumpMoves = (
  board: Board,
  from: Coord,
  player: Player
): JumpMove[] => {
  const moves: JumpMove[] = [];
  const goalRow = player === "GREEN" ? 0 : 7;
  const goalJumpRow = player === "GREEN" ? 2 : 5;
  const midRow = player === "GREEN" ? 1 : 6;

  for (const { dr, dc } of DIAGONALS) {
    const mid = { r: from.r + dr, c: from.c + dc };
    const landing = { r: from.r + dr * 2, c: from.c + dc * 2 };

    if (!inBounds(mid) || !inBounds(landing)) {
      continue;
    }

    if (!isPlayableDestination(landing, player)) {
      continue;
    }

    if (!isJumpDirectionAllowed()) {
      continue;
    }

    const midPiece = board[mid.r][mid.c];
    const landingPiece = board[landing.r][landing.c];

    if (!midPiece || landingPiece) {
      continue;
    }

    moves.push({ type: "JUMP", path: [from, landing] });
  }

  // Special case: allow straight jump into either edge row (over a piece in the adjacent row)
  const edgeJumps = [
    { jumpFrom: 2, mid: 1, edge: 0 },  // jump from row 6 over row 7 into row 8
    { jumpFrom: 5, mid: 6, edge: 7 }   // jump from row 3 over row 2 into row 1
  ];
  for (const { jumpFrom, mid: midR, edge } of edgeJumps) {
    if (from.r === jumpFrom) {
      const mid = { r: midR, c: from.c };
      const landing = { r: edge, c: from.c };
      if (
        inBounds(mid) &&
        inBounds(landing) &&
        isPlayableDestination(landing, player)
      ) {
        const midPiece = board[mid.r][mid.c];
        const landingPiece = board[landing.r][landing.c];
        if (midPiece && !landingPiece) {
          if (!moves.some((m) => m.path[m.path.length - 1].r === landing.r && m.path[m.path.length - 1].c === landing.c)) {
            moves.push({ type: "JUMP", path: [from, landing] });
          }
        }
      }
    }
  }

  // Edge row lateral jumps: pieces on row 1 or row 8 can jump over adjacent piece sideways
  if (from.r === 0 || from.r === 7) {
    for (const dc of [-2, 2]) {
      const mid = { r: from.r, c: from.c + dc / 2 };
      const landing = { r: from.r, c: from.c + dc };
      if (inBounds(mid) && inBounds(landing)) {
        const midPiece = board[mid.r][mid.c];
        const landingPiece = board[landing.r][landing.c];
        if (midPiece && !landingPiece) {
          if (!moves.some((m) => m.path[m.path.length - 1].r === landing.r && m.path[m.path.length - 1].c === landing.c)) {
            moves.push({ type: "JUMP", path: [from, landing] });
          }
        }
      }
    }
  }

  return moves;
};

/**
 * List all legal moves for a player
 *
 * @param board - Current board state
 * @param player - Player to generate moves for
 * @returns Array of legal moves (steps and jumps)
 *
 * @example
 * const board = createInitialBoard();
 * const moves = listLegalMoves(board, "GREEN");
 * // Returns all step moves and single-jump moves for GREEN
 */
export const listLegalMoves = (board: Board, player: Player): Move[] => {
  const moves: Move[] = [];

  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c < BOARD_SIZE; c += 1) {
      const piece = board[r][c];
      if (!piece || piece.owner !== player) {
        continue;
      }

      const from = { r, c };
      moves.push(...listStepMoves(board, from, player));
      moves.push(...listJumpMoves(board, from, player));
    }
  }

  return moves;
};
