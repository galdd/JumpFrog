import { useTranslation } from "../../i18n/LanguageContext";
import styles from "./WaitingForOpponent.module.css";

interface WaitingForOpponentProps {
  roomId: string;
}

export const WaitingForOpponent = ({ roomId }: WaitingForOpponentProps) => {
  const { t } = useTranslation();
  const shareUrl = `${window.location.origin}/play/${roomId}`;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.spinner}>
          <div className={styles.frog}>🐸</div>
        </div>
        <h2 className={styles.title}>{t.waiting_title}</h2>
        <p className={styles.message}>{t.waiting_message}</p>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
          >
            {t.waiting_copyLink}
          </button>
          <button
            className={styles.button}
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
                "_blank"
              )
            }
          >
            {t.waiting_shareWhatsApp}
          </button>
        </div>
      </div>
    </div>
  );
};
