"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Globe2 } from "lucide-react";
import { getI18n } from "@/lib/i18n";

export const LanguageToggle = () => {
  const { language, toggle } = useLanguage();
  const i18n = getI18n(language);
  const isDe = language === "de";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle language"
      className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
    >
      <Globe2 className="h-4 w-4 text-gray-600" />
      <span>{isDe ? i18n.nav.languageGerman : i18n.nav.languageEnglish}</span>
    </button>
  );
};
