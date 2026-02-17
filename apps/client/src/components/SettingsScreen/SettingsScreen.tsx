import type { Settings } from "../../types/game";
import { useTranslation } from "../../i18n/LanguageContext";
import styles from "./SettingsScreen.module.css";

interface SettingsScreenProps {
  settings: Settings;
  onChange: (next: Settings) => void;
  onBack: () => void;
}

export const SettingsScreen = ({
  settings,
  onChange,
  onBack
}: SettingsScreenProps) => {
  const { t } = useTranslation();

  const update = (patch: Partial<Settings>) => {
    onChange({ ...settings, ...patch });
  };

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{t.settings_title}</h2>
            <p className={styles.subtitle}>{t.settings_subtitle}</p>
          </div>
          <button className={styles.back} onClick={onBack}>
            {t.settings_back}
          </button>
        </header>

        <section className={styles.section}>
          <h3>{t.settings_themeTitle}</h3>
          <div className={styles.radioRow}>
            <label>
              <input
                type="radio"
                name="theme"
                value="green"
                checked={settings.theme === "green"}
                onChange={() => update({ theme: "green" })}
              />
              {t.settings_themeGreen}
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="lily"
                checked={settings.theme === "lily"}
                onChange={() => update({ theme: "lily" })}
              />
              {t.settings_themeLily}
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <h3>{t.settings_soundTitle}</h3>
          <div className={styles.toggleRow}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(event) => update({ soundEnabled: event.target.checked })}
              />
              {t.settings_soundEnabled}
            </label>
            <div className={styles.sliderRow}>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(settings.soundVolume * 100)}
                onChange={(event) =>
                  update({ soundVolume: Number(event.target.value) / 100 })
                }
                disabled={!settings.soundEnabled}
              />
              <span>{Math.round(settings.soundVolume * 100)}%</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>{t.settings_animSpeedTitle}</h3>
          <div className={styles.radioRow}>
            <label>
              <input
                type="radio"
                name="animationSpeed"
                value="fast"
                checked={settings.animationSpeed === "fast"}
                onChange={() => update({ animationSpeed: "fast" })}
              />
              {t.settings_animFast}
            </label>
            <label>
              <input
                type="radio"
                name="animationSpeed"
                value="normal"
                checked={settings.animationSpeed === "normal"}
                onChange={() => update({ animationSpeed: "normal" })}
              />
              {t.settings_animNormal}
            </label>
            <label>
              <input
                type="radio"
                name="animationSpeed"
                value="slow"
                checked={settings.animationSpeed === "slow"}
                onChange={() => update({ animationSpeed: "slow" })}
              />
              {t.settings_animSlow}
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <h3>{t.settings_boardTitle}</h3>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={settings.boardFlipped}
              onChange={(event) => update({ boardFlipped: event.target.checked })}
            />
            {t.settings_flipBoard}
          </label>
        </section>

        <section className={styles.section}>
          <h3>{t.settings_accessibilityTitle}</h3>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(event) => update({ reduceMotion: event.target.checked })}
            />
            {t.settings_reduceMotion}
          </label>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={settings.resumeLastGame}
              onChange={(event) => update({ resumeLastGame: event.target.checked })}
            />
            {t.settings_resumeLastGame}
          </label>
        </section>
      </div>
    </div>
  );
};
