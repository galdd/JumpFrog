import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../../i18n/LanguageContext";
import { languageOptions } from "../../i18n/translations";
import styles from "./LanguageSelector.module.css";

export const LanguageSelector = () => {
  const { language, setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = languageOptions.find((o) => o.code === language)!;

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((p) => !p)}
        aria-label="Select language"
        aria-expanded={open}
      >
        <span className={styles.flag}>{current.flag}</span>
        <span className={styles.label}>{current.label}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>▾</span>
      </button>

      {open && (
        <ul className={styles.dropdown} role="listbox">
          {languageOptions.map((opt) => (
            <li key={opt.code} role="option" aria-selected={opt.code === language}>
              <button
                className={`${styles.option} ${opt.code === language ? styles.active : ""}`}
                onClick={() => {
                  setLanguage(opt.code);
                  setOpen(false);
                }}
              >
                <span className={styles.flag}>{opt.flag}</span>
                <span>{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
