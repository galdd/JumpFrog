/**
 * Player identifier
 */
export type Player = "GREEN" | "BLACK";

/**
 * Board coordinate (0-indexed)
 */
export type Coord = {
  r: number;
  c: number;
};

/**
 * Game piece with owner and unique ID
 */
export type Piece = {
  id: string;
  owner: Player;
};

/**
 * 8x8 board grid
 */
export type Board = (Piece | null)[][];

/**
 * Single diagonal step move
 */
export type StepMove = {
  type: "STEP";
  from: Coord;
  to: Coord;
};

/**
 * Jump move over a piece (path has length 2 for single jump)
 */
export type JumpMove = {
  type: "JUMP";
  path: Coord[];
};

/**
 * Legal move (step or jump)
 */
export type Move = StepMove | JumpMove;
