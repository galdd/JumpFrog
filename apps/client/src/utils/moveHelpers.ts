import type { Coord, Move } from "@jumpfrog/rules";

/**
 * Get the target (destination) coordinate of a move
 */
export const getMoveTarget = (move: Move): Coord =>
  move.type === "STEP" ? move.to : move.path[move.path.length - 1];

/**
 * Get the start (origin) coordinate of a move
 */
export const getMoveStart = (move: Move): Coord =>
  move.type === "STEP" ? move.from : move.path[0];

/**
 * Get the full path of a move as an array of coordinates
 */
export const getMovePath = (move: Move): Coord[] =>
  move.type === "STEP" ? [move.from, move.to] : move.path;
