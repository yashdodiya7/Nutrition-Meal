"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppLanguage = "en" | "de";

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<AppLanguage>("en");

  // Load preference
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem("app_language") as AppLanguage | null)
        : null;
    if (stored === "en" || stored === "de") {
      setLanguage(stored);
    }
  }, []);

  // Persist and reflect to <html lang>
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app_language", language);
      try {
        document.documentElement.lang = language === "de" ? "de" : "en";
      } catch {}
    }
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggle: () => setLanguage((l) => (l === "en" ? "de" : "en")),
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
