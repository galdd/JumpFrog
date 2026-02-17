import { useState } from "react";
import type { GameMode, BotDifficulty } from "../../types/game";
import { useTranslation } from "../../i18n/LanguageContext";
import { LanguageSelector } from "../LanguageSelector/LanguageSelector";
import styles from "./MenuScreen.module.css";

interface MenuScreenProps {
  lastMode: GameMode;
  hasSavedGame: boolean;
  onResume: () => void;
  onStartLocal: () => void;
  onStartBot: (difficulty: BotDifficulty) => void;
  onPlayOnline: () => void;
  onOpenSettings: () => void;
  onTutorial: () => void;
}

export const MenuScreen = ({
  lastMode,
  hasSavedGame,
  onResume,
  onStartLocal,
  onStartBot,
  onPlayOnline,
  onOpenSettings,
  onTutorial
}: MenuScreenProps) => {
  const { t } = useTranslation();
  const [showBotDifficulty, setShowBotDifficulty] = useState(false);

  const handleBotClick = () => {
    setShowBotDifficulty(true);
  };

  const handleDifficultySelect = (difficulty: BotDifficulty) => {
    setShowBotDifficulty(false);
    onStartBot(difficulty);
  };

  const handleBackFromDifficulty = () => {
    setShowBotDifficulty(false);
  };

  if (showBotDifficulty) {
    return (
      <div className={styles.screen}>
        <div className={styles.card}>
          <div className={styles.langRow}>
            <LanguageSelector />
          </div>
          <div className={styles.brand}>
            <h1 className={styles.title}>{t.difficulty_title}</h1>
            <p className={styles.subtitle}>{t.difficulty_subtitle}</p>
          </div>

          <div className={styles.primaryActions}>
            <button 
              className={styles.difficulty}
              onClick={() => handleDifficultySelect("EASY")}
            >
              <span className={styles.difficultyTitle}>{t.difficulty_easy}</span>
              <span className={styles.difficultyDesc}>{t.difficulty_easyDesc}</span>
            </button>
            <button 
              className={styles.difficulty}
              onClick={() => handleDifficultySelect("MEDIUM")}
            >
              <span className={styles.difficultyTitle}>{t.difficulty_medium}</span>
              <span className={styles.difficultyDesc}>{t.difficulty_mediumDesc}</span>
            </button>
            <button 
              className={styles.difficulty}
              onClick={() => handleDifficultySelect("HARD")}
            >
              <span className={styles.difficultyTitle}>{t.difficulty_hard}</span>
              <span className={styles.difficultyDesc}>{t.difficulty_hardDesc}</span>
            </button>
          </div>

          <div className={styles.secondaryActions}>
            <button className={styles.secondary} onClick={handleBackFromDifficulty}>
              {t.difficulty_back}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <div className={styles.langRow}>
          <LanguageSelector />
        </div>
        <div className={styles.brand}>
          <h1 className={styles.title}>{t.menu_title}</h1>
          <p className={styles.subtitle}>{t.menu_subtitle}</p>
        </div>

        <div className={styles.primaryActions}>
          {hasSavedGame ? (
            <button className={styles.primary} onClick={onResume}>
              {t.menu_resumeLastGame}
            </button>
          ) : null}
          <button className={styles.primary} onClick={onStartLocal}>
            {t.menu_local2Players}
          </button>
          <button className={styles.primaryAlt} onClick={onPlayOnline}>
            {t.menu_playOnline}
          </button>
          <button className={styles.primaryAlt} onClick={handleBotClick}>
            {t.menu_vsBot}
          </button>
        </div>

        <div className={styles.secondaryActions}>
          <button className={styles.secondary} onClick={onTutorial}>
            {t.menu_tutorial}
          </button>
          <button className={styles.secondary} onClick={onOpenSettings}>
            {t.menu_settings}
          </button>
        </div>

        <div className={styles.meta}>
          {t.menu_lastMode}:{" "}
          {lastMode === "BOT"
            ? t.menu_modeBot
            : lastMode === "ONLINE"
              ? t.menu_modeOnline
              : t.menu_modeLocal}
        </div>
      </div>
    </div>
  );
};
