import type { Coord } from "./types.js";

export const BOARD_SIZE = 8;

export const DIAGONALS = [
  { dr: -1, dc: -1 },
  { dr: -1, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: 1, dc: 1 }
] as const;

/**
 * Starting positions for GREEN frogs (ranks 1-2)
 */
export const GREEN_START_POSITIONS: Coord[] = [
  { r: 7, c: 0 }, // A1
  { r: 6, c: 1 }, // B2
  { r: 7, c: 2 }, // C1
  { r: 6, c: 3 }, // D2
  { r: 7, c: 4 }, // E1
  { r: 6, c: 5 }, // F2
  { r: 7, c: 6 }, // G1
  { r: 6, c: 7 }  // H2
];

/**
 * Starting positions for BLACK frogs (ranks 7-8)
 */
export const BLACK_START_POSITIONS: Coord[] = [
  { r: 1, c: 0 }, // A7
  { r: 0, c: 1 }, // B8
  { r: 1, c: 2 }, // C7
  { r: 0, c: 3 }, // D8
  { r: 1, c: 4 }, // E7
  { r: 0, c: 5 }, // F8
  { r: 1, c: 6 }, // G7
  { r: 0, c: 7 }  // H8
];

/**
 * Winning positions for GREEN (opponent's starting row)
 */
export const GREEN_TARGET_POSITIONS: Coord[] = BLACK_START_POSITIONS;

/**
 * Winning positions for BLACK (opponent's starting row)
 */
export const BLACK_TARGET_POSITIONS: Coord[] = GREEN_START_POSITIONS;

/**
 * Row indices where GREEN may jump backward (ranks 7–8, opponent's side)
 */
export const GREEN_BACK_JUMP_ROWS = [0, 1] as const;

/**
 * Row indices where BLACK may jump backward (ranks 1–2, opponent's side)
 */
export const BLACK_BACK_JUMP_ROWS = [6, 7] as const;
