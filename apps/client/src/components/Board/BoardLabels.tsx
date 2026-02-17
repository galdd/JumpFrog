import { FILE_LABELS, RANK_LABELS } from "../../constants/game";
import styles from "./BoardLabels.module.css";

interface BoardLabelsProps {
  rotated?: boolean;
}

/**
 * Renders coordinate labels (A-H, 1-8) on all four sides of the board
 */
export const BoardLabels = ({ rotated = false }: BoardLabelsProps) => {
  const fileLabels = rotated ? [...FILE_LABELS].reverse() : FILE_LABELS;
  const rankLabels = rotated ? [...RANK_LABELS].reverse() : RANK_LABELS;

  return (
    <>
      {/* Top-left corner */}
      <div className={styles.cornerTopLeft} aria-hidden />
      
      {/* Top files (A-H) */}
      <div className={styles.filesTop} aria-hidden>
        {fileLabels.map((letter) => (
          <span key={letter} className={styles.label}>
            {letter}
          </span>
        ))}
      </div>
      
      {/* Top-right corner */}
      <div className={styles.cornerTopRight} aria-hidden />
      
      {/* Left ranks (8-1) */}
      <div className={styles.ranksLeft} aria-hidden>
        {rankLabels.map((rank) => (
          <span key={rank} className={styles.label}>
            {rank}
          </span>
        ))}
      </div>
      
      {/* Right ranks (8-1) */}
      <div className={styles.ranksRight} aria-hidden>
        {rankLabels.map((rank) => (
          <span key={rank} className={styles.label}>
            {rank}
          </span>
        ))}
      </div>
      
      {/* Bottom-left corner */}
      <div className={styles.cornerBottomLeft} aria-hidden />
      
      {/* Bottom files (A-H) */}
      <div className={styles.filesBottom} aria-hidden>
        {fileLabels.map((letter) => (
          <span key={letter} className={styles.label}>
            {letter}
          </span>
        ))}
      </div>
      
      {/* Bottom-right corner */}
      <div className={styles.cornerBottomRight} aria-hidden />
    </>
  );
};
