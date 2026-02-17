/**
 * Frog color type
 */
export type FrogColor = "GREEN" | "BLACK";

/**
 * Animation frame identifiers for frog sprites
 */
export type FrogFrameKey =
  | "idle"
  | "crouch"
  | "takeoff"
  | "midair"
  | "landing"
  | "finish";

/**
 * Map of frog colors to frame names to image paths
 */
export const frogFrames: Record<FrogColor, Record<FrogFrameKey, string>> = {
  GREEN: {
    idle: "/image/green_1_idle.png",
    crouch: "/image/green_2_crouch.png",
    takeoff: "/image/green_3_takeoff..png",
    midair: "/image/green_3_takeoff..png",
    landing: "/image/green_4_landing.png",
    finish: "/image/green_frog_finish.png"
  },
  BLACK: {
    idle: "/image/black_1_idle.png",
    crouch: "/image/black_1_idle.png",
    takeoff: "/image/black_2_crouch.png",
    midair: "/image/black_3_takeoff.png",
    landing: "/image/black_4_landing.png",
    finish: "/image/black_frog_finish.png"
  }
};

/**
 * Frame sequences for hop animations by color
 */
export const hopTimeline: Record<FrogColor, FrogFrameKey[]> = {
  GREEN: ["crouch", "takeoff", "midair", "landing"],
  BLACK: ["idle", "takeoff", "midair", "landing"]
};
