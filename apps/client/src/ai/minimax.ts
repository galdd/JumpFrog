import type { Board, Player, Move, Coord } from "@jumpfrog/rules";
import { applyMove, checkWinner, listLegalMoves } from "@jumpfrog/rules";
import { evaluateBoard } from "./evaluation";

export type BotDifficulty = "EASY" | "MEDIUM" | "HARD";

export type BotAction =
  | { type: "MOVE"; move: Move }
  | { type: "END_TURN" };

// ── Config ───────────────────────────────────────────────────────────

interface MinimaxConfig {
  maxDepth: number;
  mistakeChance: number;
  mistakeTopN: number;
  quiescenceDepth: number; // extra plies when a jump is available at depth 0
}

const JUMP_BONUS = 30;
const STEP_BONUS = 5;
const CHAIN_WEIGHT = 14;

const DIFFICULTY_CONFIGS: Record<BotDifficulty, MinimaxConfig> = {
  EASY:   { maxDepth: 2, mistakeChance: 0.25, mistakeTopN: 3, quiescenceDepth: 0 },
  MEDIUM: { maxDepth: 4, mistakeChance: 0.10, mistakeTopN: 3, quiescenceDepth: 1 },
  HARD:   { maxDepth: 6, mistakeChance: 0,    mistakeTopN: 1, quiescenceDepth: 2 }
};

// ── Utilities ────────────────────────────────────────────────────────

const otherPlayer = (p: Player): Player => (p === "GREEN" ? "BLACK" : "GREEN");

const forwardDelta = (move: Move, player: Player): number => {
  const from: Coord = move.type === "STEP" ? move.from : move.path[0];
  const to: Coord = move.type === "STEP" ? move.to : move.path[move.path.length - 1];
  return player === "GREEN" ? from.r - to.r : to.r - from.r;
};

const isForwardMove = (move: Move, player: Player): boolean =>
  forwardDelta(move, player) > 0;

// ── Move ordering (critical for alpha-beta speed) ────────────────────

const getMoveCategory = (move: Move, player: Player): number => {
  const delta = forwardDelta(move, player);
  if (move.type === "JUMP" && delta > 0) return 0; // forward jump (best)
  if (move.type === "JUMP" && delta === 0) return 1; // lateral jump
  if (delta > 0) return 2;                           // forward step
  if (delta === 0) return 3;                          // lateral step
  if (move.type === "JUMP") return 4;                 // backward jump
  return 5;                                           // backward step (worst)
};

const orderMoves = (moves: Move[], player: Player): Move[] =>
  [...moves].sort((a, b) => {
    const catA = getMoveCategory(a, player);
    const catB = getMoveCategory(b, player);
    if (catA !== catB) return catA - catB;
    return forwardDelta(b, player) - forwardDelta(a, player);
  });

// ── Deterministic RNG ────────────────────────────────────────────────

const createRng = (seed?: number): (() => number) => {
  if (seed === undefined) return () => Math.random();
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

// ── Helpers ──────────────────────────────────────────────────────────

const getPieceIdAt = (board: Board, coord: Coord): string | null => {
  const piece = board[coord.r][coord.c];
  return piece ? piece.id : null;
};

const countForwardFollowUpJumps = (
  board: Board,
  move: Move,
  player: Player
): number => {
  if (move.type !== "JUMP") return 0;
  const nextBoard = applyMove(board, move);
  const end = move.path[move.path.length - 1];
  const from = move.path[0];
  const nextMoves = listLegalMoves(nextBoard, player);
  let count = 0;
  for (const m of nextMoves) {
    if (m.type !== "JUMP") continue;
    const start = m.path[0];
    const target = m.path[m.path.length - 1];
    if (start.r !== end.r || start.c !== end.c) continue;
    // Exclude back-jump to origin
    if (target.r === from.r && target.c === from.c) continue;
    // Only count forward follow-ups
    const delta = player === "GREEN" ? start.r - target.r : target.r - start.r;
    if (delta > 0) count += 1;
  }
  return count;
};

// ── Alpha-beta with quiescence ───────────────────────────────────────

let _qDepth = 0; // set per search from config

const alphabeta = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  player: Player,
  deadline: number
): number => {
  if (Date.now() >= deadline) return evaluateBoard(board, player);

  const winner = checkWinner(board);
  if (winner !== null) return evaluateBoard(board, player);

  if (depth <= 0) {
    // Quiescence: if jumps exist, extend search to avoid horizon effect
    if (_qDepth > 0) {
      const currentP = maximizingPlayer ? player : otherPlayer(player);
      const jumps = listLegalMoves(board, currentP).filter(
        (m) => m.type === "JUMP"
      );
      if (jumps.length > 0) {
        _qDepth -= 1;
        const result = alphabetaInner(
          board,
          1,
          alpha,
          beta,
          maximizingPlayer,
          player,
          deadline,
          jumps
        );
        _qDepth += 1;
        return result;
      }
    }
    return evaluateBoard(board, player);
  }

  const currentP = maximizingPlayer ? player : otherPlayer(player);
  const moves = listLegalMoves(board, currentP);
  if (moves.length === 0) return evaluateBoard(board, player);

  return alphabetaInner(
    board,
    depth,
    alpha,
    beta,
    maximizingPlayer,
    player,
    deadline,
    moves
  );
};

const alphabetaInner = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  player: Player,
  deadline: number,
  moves: Move[]
): number => {
  const currentP = maximizingPlayer ? player : otherPlayer(player);
  const sorted = orderMoves(moves, currentP);

  if (maximizingPlayer) {
    let best = -Infinity;
    for (const move of sorted) {
      if (Date.now() >= deadline) break;
      const score = alphabeta(
        applyMove(board, move),
        depth - 1,
        alpha,
        beta,
        false,
        player,
        deadline
      );
      if (score > best) best = score;
      if (score > alpha) alpha = score;
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = Infinity;
  for (const move of sorted) {
    if (Date.now() >= deadline) break;
    const score = alphabeta(
      applyMove(board, move),
      depth - 1,
      alpha,
      beta,
      true,
      player,
      deadline
    );
    if (score < best) best = score;
    if (score < beta) beta = score;
    if (beta <= alpha) break;
  }
  return best;
};

// ── Root-level move scoring ──────────────────────────────────────────

const scoreMove = (
  board: Board,
  move: Move,
  player: Player,
  depth: number,
  deadline: number
): number => {
  const newBoard = applyMove(board, move);
  const baseScore = alphabeta(
    newBoard,
    depth - 1,
    -Infinity,
    Infinity,
    false,
    player,
    deadline
  );

  // Type bonus: prefer jumps
  const typeBonus = move.type === "JUMP" ? JUMP_BONUS : STEP_BONUS;

  // Chain bonus: reward jumps that create forward follow-ups
  const chainBonus = countForwardFollowUpJumps(board, move, player) * CHAIN_WEIGHT;

  // Direction bonus: reward forward moves, penalise backward ones
  const delta = forwardDelta(move, player);
  // Forward gets +12 per row advanced, backward gets -20 per row retreated
  const directionBonus = delta > 0 ? delta * 12 : delta * 20;

  return baseScore + typeBonus + chainBonus + directionBonus;
};

// ── Iterative deepening ──────────────────────────────────────────────

const scoreMovesAtDepth = (
  board: Board,
  moves: Move[],
  player: Player,
  depth: number,
  deadline: number
): { scoredMoves: Array<{ move: Move; score: number }>; completed: boolean } => {
  const scoredMoves: Array<{ move: Move; score: number }> = [];
  for (const move of moves) {
    if (Date.now() >= deadline) return { scoredMoves, completed: false };
    const score = scoreMove(board, move, player, depth, deadline);
    scoredMoves.push({ move, score });
  }
  scoredMoves.sort((a, b) => b.score - a.score);
  return { scoredMoves, completed: true };
};

const chooseFromTop = (
  scoredMoves: Array<{ move: Move; score: number }>,
  topN: number,
  rng: () => number
): Move => {
  const count = Math.min(topN, scoredMoves.length);
  return scoredMoves[Math.floor(rng() * count)].move;
};

// ── Public API ───────────────────────────────────────────────────────

export const chooseBotAction = (args: {
  board: Board;
  botPlayer: Player;
  continuationPieceId: string | null;
  continuationFromCoord?: Coord | null;
  difficulty: BotDifficulty;
  timeLimitMs: number;
  seed?: number;
}): BotAction => {
  const {
    board,
    botPlayer,
    continuationPieceId,
    continuationFromCoord,
    difficulty,
    timeLimitMs,
    seed
  } = args;
  const config = DIFFICULTY_CONFIGS[difficulty];
  const rng = createRng(seed);
  const deadline = Date.now() + Math.max(10, timeLimitMs);

  // Set quiescence budget for this search
  _qDepth = config.quiescenceDepth;

  let moves = listLegalMoves(board, botPlayer);

  // ── Continuation filtering ──
  if (continuationPieceId) {
    moves = moves.filter((move) => {
      if (move.type !== "JUMP") return false;
      const start = move.path[0];
      const target = move.path[move.path.length - 1];
      const pieceId = getPieceIdAt(board, start);
      if (pieceId !== continuationPieceId) return false;
      // Disallow jumping back to the square we came from
      if (
        continuationFromCoord &&
        target.r === continuationFromCoord.r &&
        target.c === continuationFromCoord.c
      )
        return false;
      return true;
    });

    // During continuation only accept forward jumps — end turn rather than
    // jump backward / sideways
    const forwardContinuation = moves.filter((m) =>
      isForwardMove(m, botPlayer)
    );
    if (forwardContinuation.length > 0) {
      moves = forwardContinuation;
    } else {
      return { type: "END_TURN" };
    }
  }

  if (moves.length === 0) return { type: "END_TURN" };

  // ── Iterative deepening ──
  const orderedMoves = orderMoves(moves, botPlayer);
  let bestMove: Move | null = null;
  let lastScoredMoves: Array<{ move: Move; score: number }> = [];

  for (let depth = 1; depth <= config.maxDepth; depth += 1) {
    const { scoredMoves, completed } = scoreMovesAtDepth(
      board,
      orderedMoves,
      botPlayer,
      depth,
      deadline
    );

    if (scoredMoves.length > 0) {
      lastScoredMoves = scoredMoves;
      bestMove = scoredMoves[0].move;
    }

    if (!completed || Date.now() >= deadline) break;
  }

  if (!bestMove) bestMove = orderedMoves[0];

  // Mistakes (EASY/MEDIUM only — HARD has 0%)
  if (
    lastScoredMoves.length > 1 &&
    config.mistakeChance > 0 &&
    rng() < config.mistakeChance
  ) {
    return { type: "MOVE", move: chooseFromTop(lastScoredMoves, config.mistakeTopN, rng) };
  }

  return { type: "MOVE", move: bestMove };
};

export const chooseGreedyMove = (
  board: Board,
  player: Player
): Move | null => {
  const moves = listLegalMoves(board, player);
  if (moves.length === 0) return null;

  const scored = moves.map((move) => ({
    move,
    score:
      evaluateBoard(applyMove(board, move), player) +
      (move.type === "JUMP" ? JUMP_BONUS : STEP_BONUS)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored[0].move;
};
