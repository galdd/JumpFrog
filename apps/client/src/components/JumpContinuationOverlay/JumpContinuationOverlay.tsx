import { useEffect, useState } from "react";
import { useTranslation } from "../../i18n/LanguageContext";
import styles from "./JumpContinuationOverlay.module.css";

interface JumpContinuationOverlayProps {
  /** Remaining time in milliseconds */
  timeRemainingMs: number;
  /** Total duration in milliseconds */
  totalDurationMs: number;
  /** Handler for ending turn early */
  onEndTurn?: () => void;
  /** Whether the current player can end the turn */
  canEndTurn?: boolean;
}

/**
 * Overlay component showing jump continuation countdown with circular progress ring
 */
export const JumpContinuationOverlay = ({
  timeRemainingMs,
  totalDurationMs,
  onEndTurn,
  canEndTurn = true
}: JumpContinuationOverlayProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  // Fade in animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const progress = timeRemainingMs / totalDurationMs;
  const seconds = Math.max(0, timeRemainingMs / 1000).toFixed(1);
  
  // Circle parameters for SVG
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  // Color changes as time runs out
  const getColor = () => {
    if (progress > 0.6) return "#10b981"; // Green
    if (progress > 0.3) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  return (
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ""}`}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title}>{t.jumpOverlay_title}</span>
        </div>

        <div className={styles.timerContainer}>
          <svg className={styles.circularProgress} viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className={styles.circleBackground}
              cx="50"
              cy="50"
              r={radius}
            />
            {/* Progress circle */}
            <circle
              className={styles.circleProgress}
              cx="50"
              cy="50"
              r={radius}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
                stroke: getColor()
              }}
            />
          </svg>
          <div className={styles.timeText} style={{ color: getColor() }}>
            {seconds}s
          </div>
        </div>

        <div className={styles.instructions}>
          {t.jumpOverlay_instructions}
        </div>

        <button
          className={styles.endTurnButton}
          onClick={onEndTurn}
          disabled={!canEndTurn}
        >
          {t.jumpOverlay_endTurn}
        </button>
      </div>
    </div>
  );
};
