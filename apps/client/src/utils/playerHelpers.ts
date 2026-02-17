import type { Player } from "@jumpfrog/rules";

/**
 * Get the opposite player
 */
export const otherPlayer = (player: Player): Player =>
  player === "GREEN" ? "BLACK" : "GREEN";
