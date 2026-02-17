import type { Board, Player, Coord, Move } from "@jumpfrog/rules";
import { checkWinner, listLegalMoves } from "@jumpfrog/rules";

// ── Weights ──────────────────────────────────────────────────────────
const PROGRESS_WEIGHT = 50;
const COMPLETION_WEIGHT = 120;
const LAGGARD_WEIGHT = 15;       // extra penalty for the piece furthest from goal
const MOBILITY_WEIGHT = 3;
const FORWARD_JUMP_WEIGHT = 14;  // reward forward jumps specifically
const STUCK_WEIGHT = 20;
const SPREAD_WEIGHT = 4;         // reward column spread (avoids congestion)

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Distance to goal zone (0 = already there).
 *   GREEN goal zone: rows 0-1  →  dist = max(0, r - 1)
 *   BLACK goal zone: rows 6-7  →  dist = max(0, 6 - r)
 */
const getGoalDistance = (coord: Coord, player: Player): number => {
  if (player === "GREEN") return Math.max(0, coord.r - 1);
  return Math.max(0, 6 - coord.r);
};

const isInGoalZone = (coord: Coord, player: Player): boolean =>
  player === "GREEN" ? coord.r <= 1 : coord.r >= 6;

const getMovesByPiece = (moves: Move[]): Set<string> => {
  const set = new Set<string>();
  for (const move of moves) {
    const start = move.type === "STEP" ? move.from : move.path[0];
    set.add(`${start.r},${start.c}`);
  }
  return set;
};

const countStuckPieces = (
  board: Board,
  player: Player,
  movablePieces: Set<string>
): number => {
  let count = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.owner !== player) continue;
      if (!movablePieces.has(`${r},${c}`)) count += 1;
    }
  }
  return count;
};

/**
 * Count forward jumps (jumps that move toward the goal).
 */
const countForwardJumps = (moves: Move[], player: Player): number => {
  let count = 0;
  for (const m of moves) {
    if (m.type !== "JUMP") continue;
    const from = m.path[0];
    const to = m.path[m.path.length - 1];
    const delta = player === "GREEN" ? from.r - to.r : to.r - from.r;
    if (delta > 0) count += 1;
  }
  return count;
};

/**
 * Measure how spread out a player's pieces are across columns.
 * More unique columns = less congestion = better.
 */
const columnSpread = (board: Board, player: Player): number => {
  const cols = new Set<number>();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.owner === player) cols.add(c);
    }
  }
  return cols.size;
};

// ── Main evaluation ──────────────────────────────────────────────────

/**
 * Evaluate the board position for a given player.
 * Positive = good for player, negative = bad.
 */
export const evaluateBoard = (board: Board, player: Player): number => {
  const opponent: Player = player === "GREEN" ? "BLACK" : "GREEN";
  const winner = checkWinner(board);
  if (winner === player) return 100000;
  if (winner === opponent) return -100000;

  let playerTotalDist = 0;
  let opponentTotalDist = 0;
  let playerMaxDist = 0;
  let opponentMaxDist = 0;
  let playerCompleted = 0;
  let opponentCompleted = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const coord = { r, c };
      const dist = getGoalDistance(coord, piece.owner);

      if (piece.owner === player) {
        playerTotalDist += dist;
        if (dist > playerMaxDist) playerMaxDist = dist;
        if (isInGoalZone(coord, player)) playerCompleted += 1;
      } else {
        opponentTotalDist += dist;
        if (dist > opponentMaxDist) opponentMaxDist = dist;
        if (isInGoalZone(coord, opponent)) opponentCompleted += 1;
      }
    }
  }

  // Progress: lower total distance is better (negate so positive = good)
  const progressScore =
    (opponentTotalDist - playerTotalDist) * PROGRESS_WEIGHT;

  // Completion: reward frogs already in goal zone
  const completionScore =
    (playerCompleted - opponentCompleted) * COMPLETION_WEIGHT;

  // Laggard: penalize having a frog very far from goal (bottleneck)
  const laggardScore =
    (opponentMaxDist - playerMaxDist) * LAGGARD_WEIGHT;

  // Mobility
  const playerMoves = listLegalMoves(board, player);
  const opponentMoves = listLegalMoves(board, opponent);
  const mobilityScore =
    (playerMoves.length - opponentMoves.length) * MOBILITY_WEIGHT;

  // Forward jump availability
  const forwardJumpScore =
    countForwardJumps(playerMoves, player) * FORWARD_JUMP_WEIGHT;

  // Stuck pieces
  const playerMovable = getMovesByPiece(playerMoves);
  const opponentMovable = getMovesByPiece(opponentMoves);
  const stuckScore =
    -(countStuckPieces(board, player, playerMovable) -
      countStuckPieces(board, opponent, opponentMovable)) *
    STUCK_WEIGHT;

  // Spread: avoid all pieces piling up in the same columns
  const spreadScore =
    (columnSpread(board, player) - columnSpread(board, opponent)) *
    SPREAD_WEIGHT;

  return (
    progressScore +
    completionScore +
    laggardScore +
    mobilityScore +
    forwardJumpScore +
    stuckScore +
    spreadScore
  );
};
