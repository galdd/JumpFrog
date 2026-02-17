import type { Player } from "@jumpfrog/rules";
import { useTranslation } from "../../i18n/LanguageContext";
import styles from "./GameHeader.module.css";

/**
 * Props for the GameHeader component
 */
interface GameHeaderProps {
  /** Current player whose turn it is */
  currentPlayer: Player;
  /** Handler for reset button */
  onReset: () => void;
  /** Optional handler for back button */
  onBack?: () => void;
  /** Optional label for reset button */
  resetLabel?: string;
  /** Whether to show reset button */
  showReset?: boolean;
}

/**
 * Header component displaying current player and game controls
 */
export const GameHeader = ({
  currentPlayer,
  onReset,
  onBack,
  resetLabel,
  showReset = true
}: GameHeaderProps) => {
  const { t } = useTranslation();

  const playerLabel = currentPlayer === "GREEN" ? t.gameHeader_green : t.gameHeader_black;
  const effectiveResetLabel = resetLabel ?? t.gameHeader_resetGame;

  return (
    <header className={styles.header}>
      <div className={styles.status}>
        <span className={styles.label}>{t.gameHeader_currentPlayer}</span>
        <span className={`${styles.player} ${currentPlayer === "GREEN" ? styles.green : styles.black}`}>
          {playerLabel}
        </span>
      </div>
      <div className={styles.controls}>
        {onBack && (
          <button className={styles.back} onClick={onBack}>
            {t.gameHeader_backToMenu}
          </button>
        )}
        {showReset ? (
          <button className={styles.reset} onClick={onReset}>
            {effectiveResetLabel}
          </button>
        ) : null}
      </div>
    </header>
  );
};
