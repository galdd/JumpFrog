import type { Coord, Board, Player } from "@jumpfrog/rules";

/**
 * Visual theme for tiles
 */
export type Theme = "green" | "lily";

/**
 * Jump continuation state
 */
export interface JumpContinuation {
  frogId: string;
  fromCoord: Coord;
  timerMs: number;
}

/**
 * Screen states for navigation
 */
export type Screen = "MENU" | "GAME" | "SETTINGS" | "TUTORIAL";

/**
 * Game mode
 */
export type GameMode = "LOCAL" | "BOT" | "ONLINE";

/**
 * Bot difficulty levels
 */
export type BotDifficulty = "EASY" | "MEDIUM" | "HARD";

/**
 * User settings
 */
export interface Settings {
  theme: Theme;
  soundEnabled: boolean;
  soundVolume: number;
  animationSpeed: "fast" | "normal" | "slow";
  boardFlipped: boolean;
  reduceMotion: boolean;
  resumeLastGame: boolean;
}

/**
 * Persisted game state for save/resume functionality
 */
export interface PersistedGame {
  board: Board;
  currentPlayer: Player;
  mode: GameMode;
}
