/**
 * Board coordinate labels (columns)
 */
export const FILE_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

/**
 * Board coordinate labels (rows, from top to bottom)
 */
export const RANK_LABELS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

/**
 * Winning positions for GREEN (opponent's starting positions)
 */
export const GREEN_TARGETS = [
  { r: 1, c: 0 }, // A7
  { r: 0, c: 1 }, // B8
  { r: 1, c: 2 }, // C7
  { r: 0, c: 3 }, // D8
  { r: 1, c: 4 }, // E7
  { r: 0, c: 5 }, // F8
  { r: 1, c: 6 }, // G7
  { r: 0, c: 7 }  // H8
] as const;

/**
 * Winning positions for BLACK (opponent's starting positions)
 */
export const BLACK_TARGETS = [
  { r: 7, c: 0 }, // A1
  { r: 6, c: 1 }, // B2
  { r: 7, c: 2 }, // C1
  { r: 6, c: 3 }, // D2
  { r: 7, c: 4 }, // E1
  { r: 6, c: 5 }, // F2
  { r: 7, c: 6 }, // G1
  { r: 6, c: 7 }  // H2
] as const;

/**
 * Time window for jump continuation (ms)
 */
export const JUMP_WINDOW_MS = 5000;

/**
 * Animation durations (ms)
 */
export const ANIMATION_DURATION = {
  STEP: 220,
  JUMP: 320,
  FINAL_FRAME_DELAY: 80
} as const;

/**
 * Frog size multipliers
 */
export const FROG_SIZE = {
  STATIC: 1.02,
  ANIMATED: 1.14
} as const;

/**
 * Hop animation height parameters
 */
export const HOP_HEIGHT = {
  MIN: 18,
  MAX: 60,
  MULTIPLIER: 0.22
} as const;
