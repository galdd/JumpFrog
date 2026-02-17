import type { Player } from "@jumpfrog/rules";
import { useTranslation } from "../../i18n/LanguageContext";
import styles from "./GameStatus.module.css";

/**
 * Props for the GameStatus component
 */
interface GameStatusProps {
  /** Winning player, or null if game in progress */
  winner: Player | null;
  /** Remaining jump continuation time in ms, or null if not active */
  jumpTimerMs: number | null;
  /** Whether the bot is currently thinking */
  isBotThinking?: boolean;
}

/**
 * Status component showing game state (winner, jump timer, or instructions)
 */
export const GameStatus = ({ winner, jumpTimerMs, isBotThinking = false }: GameStatusProps) => {
  const { t } = useTranslation();

  if (winner) {
    const winnerLabel = winner === "GREEN" ? t.gameHeader_green : t.gameHeader_black;
    return <div className={styles.winnerBanner}>{t.gameStatus_wins.replace("{player}", winnerLabel)}</div>;
  }

  if (jumpTimerMs !== null) {
    return (
      <div className={styles.jumpTimer}>
        {t.gameStatus_chainJumps}
      </div>
    );
  }

  if (isBotThinking) {
    return (
      <div className={styles.botThinking}>
        <span className={styles.thinkingDots}>{t.gameStatus_botThinking}</span>
      </div>
    );
  }

  return (
    <div className={styles.helperText}>
      {t.gameStatus_helperText}
    </div>
  );
};
