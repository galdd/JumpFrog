import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { translations, isRtlLanguage, type Language, type Translations } from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRtl: boolean;
}

const STORAGE_KEY = "jumpfrog-language";

const getInitialLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "he" || stored === "es") return stored;
  } catch {
    // localStorage may not be available
  }

  // Auto-detect from browser
  const browserLang = navigator.language?.toLowerCase() ?? "";
  if (browserLang.startsWith("he")) return "he";
  if (browserLang.startsWith("es")) return "es";
  return "en";
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  // Apply RTL direction to the document
  useEffect(() => {
    const rtl = isRtlLanguage(language);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: translations[language],
    isRtl: isRtlLanguage(language),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
};
