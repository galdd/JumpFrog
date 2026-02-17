import type { Coord } from "@jumpfrog/rules";

/**
 * Check if two coordinates are equal
 */
export const coordsEqual = (a: Coord, b: Coord): boolean =>
  a.r === b.r && a.c === b.c;

/**
 * Calculate the center pixel position of a board cell
 */
export const calculateCellCenter = (
  coord: Coord,
  boardRect: DOMRect,
  padding: { left: number; top: number },
  cellSize: number
): { x: number; y: number } => ({
  x: boardRect.left + padding.left + (coord.c + 0.5) * cellSize,
  y: boardRect.top + padding.top + (coord.r + 0.5) * cellSize
});
