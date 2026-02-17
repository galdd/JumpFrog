import { useTranslation } from "../../i18n/LanguageContext";
import styles from "./TutorialScreen.module.css";

interface TutorialScreenProps {
  onBack: () => void;
}

export const TutorialScreen = ({ onBack }: TutorialScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{t.tutorial_title}</h2>
            <p className={styles.subtitle}>{t.tutorial_subtitle}</p>
          </div>
          <button className={styles.back} onClick={onBack}>
            {t.tutorial_back}
          </button>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3>{t.tutorial_objectiveTitle}</h3>
            <p>{t.tutorial_objectiveText}</p>
          </section>

          <section className={styles.section}>
            <h3>{t.tutorial_movementTitle}</h3>
            <p>
              <strong>{t.tutorial_stepLabel}</strong> {t.tutorial_stepText}
            </p>
            <p>
              <strong>{t.tutorial_jumpLabel}</strong> {t.tutorial_jumpText}
            </p>
          </section>

          <section className={styles.section}>
            <h3>{t.tutorial_rulesTitle}</h3>
            <ul>
              <li>{t.tutorial_rule1}</li>
              <li>{t.tutorial_rule2}</li>
              <li>{t.tutorial_rule3}</li>
              <li>{t.tutorial_rule4}</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>{t.tutorial_tipsTitle}</h3>
            <ul>
              <li>{t.tutorial_tip1}</li>
              <li>{t.tutorial_tip2}</li>
              <li>{t.tutorial_tip3}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
