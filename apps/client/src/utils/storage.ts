import type { GameMode, PersistedGame, Settings } from "../types/game";

const SETTINGS_KEY = "jumpfrog.settings";
const LAST_MODE_KEY = "jumpfrog.lastMode";
const SAVED_GAME_KEY = "jumpfrog.savedGame";

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const readJson = <T>(key: string, fallback: T): T => {
  if (!hasStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!hasStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getDefaultSettings = (): Settings => {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return {
    theme: "green",
    soundEnabled: true,
    soundVolume: 0.85,
    animationSpeed: "normal",
    boardFlipped: false,
    reduceMotion: prefersReducedMotion,
    resumeLastGame: false
  };
};

export const loadSettings = (): Settings => {
  const defaults = getDefaultSettings();
  const stored = readJson<Partial<Settings>>(SETTINGS_KEY, {});
  return {
    ...defaults,
    ...stored,
    soundVolume: clamp(
      typeof stored.soundVolume === "number" ? stored.soundVolume : defaults.soundVolume,
      0,
      1
    )
  };
};

export const saveSettings = (settings: Settings) => {
  writeJson(SETTINGS_KEY, settings);
};

export const loadLastMode = (): GameMode | null => {
  const stored = readJson<GameMode | null>(LAST_MODE_KEY, null);
  return stored === "LOCAL" || stored === "BOT" ? stored : null;
};

export const saveLastMode = (mode: GameMode) => {
  writeJson(LAST_MODE_KEY, mode);
};

export const loadSavedGame = (): PersistedGame | null => {
  const stored = readJson<PersistedGame | null>(SAVED_GAME_KEY, null);
  if (!stored || !stored.board || !stored.currentPlayer || !stored.mode) return null;
  return stored;
};

export const saveSavedGame = (game: PersistedGame | null) => {
  if (!hasStorage()) return;
  if (!game) {
    window.localStorage.removeItem(SAVED_GAME_KEY);
    return;
  }
  writeJson(SAVED_GAME_KEY, game);
};
