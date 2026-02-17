import { motion } from "framer-motion";
import { FrogSprite } from "./FrogSprite";
import { type ActiveHop } from "../anim/useFrogHop";

/**
 * AnimatedHopOverlay component creates a frog hopping animation overlay
 * 
 * @param hop - Active hop animation data
 * @param size - Size of the frog sprite
 */
export function AnimatedHopOverlay({ hop, size }: { hop: ActiveHop; size: number }) {
  const duration = hop.durationMs / 1000;
  const frogHeight = size * 1.2;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: hop.from.x - size / 2,
        top: hop.from.y - frogHeight / 2,
        width: size,
        height: frogHeight,
        pointerEvents: "none",
        transformOrigin: "50% 80%",
        zIndex: 50
      }}
      animate={{
        left: hop.to.x - size / 2,
        top: hop.to.y - frogHeight / 2
      }}
      transition={{ duration, ease: [0.2, 0.9, 0.2, 1] }}
    >
      <motion.div
        animate={{
          y: [0, -hop.hop, 0],
          scaleX: [1.08, 0.98, 1.02, 1],
          scaleY: [0.92, 1.02, 0.98, 1]
        }}
        transition={{ duration, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <FrogSprite color={hop.color} frame={hop.frame} size={size} />
      </motion.div>
    </motion.div>
  );
}
