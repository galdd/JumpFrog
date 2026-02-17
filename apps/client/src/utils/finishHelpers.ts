import type { Coord, Player } from "@jumpfrog/rules";
import { BLACK_TARGETS, GREEN_TARGETS } from "../constants/game";
import { coordsEqual } from "./coordHelpers";

/**
 * Check if a piece is on a winning target position.
 */
export const isFinishedPosition = (owner: Player, coord: Coord): boolean => {
  const targets = owner === "GREEN" ? GREEN_TARGETS : BLACK_TARGETS;
  return targets.some((target) => coordsEqual(target, coord));
};
