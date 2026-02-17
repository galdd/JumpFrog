import type { Board, Coord, Player } from "./types.js";
import { BOARD_SIZE, GREEN_START_POSITIONS, BLACK_START_POSITIONS } from "./constants.js";

/**
 * Check if a square is dark (playable) based on checkerboard pattern
 */
export const isDarkSquare = (coord: Coord): boolean =>
  (coord.r + coord.c) % 2 === 1;

/**
 * Check if a coordinate is on the goal row for a player
 */
export const isGoalRow = (coord: Coord, player: Player): boolean =>
  player === "GREEN" ? coord.r === 0 : coord.r === 7;

/**
 * Check if a coordinate is on either edge row (row 1 or row 8).
 * All squares on these rows are always playable, even light squares.
 */
export const isEdgeRow = (coord: Coord): boolean =>
  coord.r === 0 || coord.r === 7;

/**
 * Destination validity:
 * - Dark squares are playable as usual
 * - All squares on row 1 (r=7) and row 8 (r=0) are playable even if light
 */
export const isPlayableDestination = (coord: Coord, _player: Player): boolean =>
  isDarkSquare(coord) || isEdgeRow(coord);

/**
 * Check if a coordinate is within board bounds
 */
export const inBounds = (coord: Coord): boolean =>
  coord.r >= 0 &&
  coord.r < BOARD_SIZE &&
  coord.c >= 0 &&
  coord.c < BOARD_SIZE;

/**
 * Create empty 8x8 board
 */
const makeEmptyBoard = (): Board =>
  Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );

/**
 * Create initial board with frogs in starting positions
 *
 * GREEN: A1, B2, C1, D2, E1, F2, G1, H2
 * BLACK: A7, B8, C7, D8, E7, F8, G7, H8
 */
export const createInitialBoard = (): Board => {
  const board = makeEmptyBoard();

  GREEN_START_POSITIONS.forEach((coord, index) => {
    board[coord.r][coord.c] = { id: `G${index + 1}`, owner: "GREEN" };
  });

  BLACK_START_POSITIONS.forEach((coord, index) => {
    board[coord.r][coord.c] = { id: `B${index + 1}`, owner: "BLACK" };
  });

  return board;
};

/**
 * Check if a coordinate matches any in a list
 */
export const coordIn = (coord: Coord, targets: Coord[]): boolean =>
  targets.some((t) => t.r === coord.r && t.c === coord.c);
