import { useCallback, useRef, useState } from "react";
import { hopTimeline, type FrogColor, type FrogFrameKey } from "./frogFrames";
import { ANIMATION_DURATION } from "../constants/game";

/**
 * Pixel coordinates for positioning
 */
export type Px = { x: number; y: number };

/**
 * Active hop animation state
 */
export type ActiveHop = {
  pieceId: string;
  color: FrogColor;
  from: Px;
  to: Px;
  hop: number;
  durationMs: number;
  frame: FrogFrameKey;
  token: number;
};

/**
 * Hook to manage frog hop animations with frame-by-frame sprite updates
 * 
 * @returns Object containing active hop state, animation status, and playSegment function
 * 
 * @example
 * const { active, isAnimating, playSegment } = useFrogHop();
 * await playSegment({ pieceId: "G1", color: "GREEN", from: {x: 50, y: 50}, to: {x: 150, y: 150}, hop: 30, durationMs: 300 });
 */
export function useFrogHop() {
  const [active, setActive] = useState<ActiveHop | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const tokenRef = useRef(0);

  const playSegment = useCallback(
    async (args: Omit<ActiveHop, "frame" | "token">) => {
      tokenRef.current += 1;
      const token = tokenRef.current;

      setIsAnimating(true);

      const frames = hopTimeline[args.color];
      const steps = frames.length;
      const stepMs = Math.floor(args.durationMs / steps);

      setActive({ ...args, frame: frames[0], token });

      for (let i = 1; i < steps; i += 1) {
        await new Promise((r) => setTimeout(r, stepMs));
        setActive((prev) =>
          prev && prev.token === token ? { ...prev, frame: frames[i] } : prev
        );
      }

      await new Promise((r) => setTimeout(r, ANIMATION_DURATION.FINAL_FRAME_DELAY));

      setActive(null);
      setIsAnimating(false);
    },
    []
  );

  return { active, isAnimating, playSegment };
}
