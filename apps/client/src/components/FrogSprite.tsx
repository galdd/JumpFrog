import { memo } from "react";
import { frogFrames, type FrogColor, type FrogFrameKey } from "../anim/frogFrames";

const HEIGHT_RATIO = 1.2;
const LANDING_SCALE = 0.85;
const FINISH_SCALE = 1.8;
const BLACK_OFFSET_RATIO = 0.08;

/**
 * FrogSprite component displays a static frog image at a given frame
 * 
 * @param color - Frog color (GREEN or BLACK)
 * @param frame - Animation frame to display
 * @param size - Base width in pixels
 */
export const FrogSprite = memo(function FrogSprite({
  color,
  frame,
  size
}: {
  color: FrogColor;
  frame: FrogFrameKey;
  size: number;
}) {
  const src = frogFrames[color][frame];
  const scale =
    frame === "landing"
      ? LANDING_SCALE
      : frame === "finish"
        ? FINISH_SCALE
        : 1;
  const width = size * scale;
  const height = size * HEIGHT_RATIO * scale;
  const offsetX = color === "BLACK" ? size * BLACK_OFFSET_RATIO : 0;

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      style={{
        width,
        height,
        display: "block",
        pointerEvents: "none",
        objectFit: "contain",
        transform: offsetX ? `translateX(${offsetX}px)` : undefined
      }}
    />
  );
});
